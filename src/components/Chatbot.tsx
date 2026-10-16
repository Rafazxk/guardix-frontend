
import { useEffect, useRef, useState, type FormEvent } from "react";

interface ChatbotProps {
  plano?: string;
  onNavigateToPlanos: () => void;
}

interface Mensagem {
  id: number;
  texto: string;
  autor: "bot" | "usuario";
}

const WHATSAPP_URL =
  import.meta.env.VITE_GUARDIX_WHATSAPP_URL ||
  "https://wa.me/5581987984631";


function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function identificarPedidoDeAnalise(texto: string): boolean {
  const mensagem = normalizarTexto(texto);

  const contemUrl =
    /https?:\/\/\S+|www\.\S+|\b[\w-]+\.(com|net|org|br|io)(\/\S*)?/i.test(
      mensagem
    );

  const contemTelefone =
    /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-.\s]?\d{4}/.test(
      mensagem
    );

  const verboAnalise =
    /\b(analisar|analise|verificar|verifique|consultar|consulta|investigar|checar|confira|avaliar)\b/i.test(
      mensagem
    );

  const mencionaAlvo =
    /\b(link|url|site|telefone|celular|numero|print|imagem|screenshot)\b/i.test(
      mensagem
    );

  return (
    (contemUrl || contemTelefone) ||
    (verboAnalise && mencionaAlvo)
  );
}

function gerarResposta(texto: string, plano: string): Mensagem {
  const mensagem = normalizarTexto(texto);
  const premium = plano === "premium";

  let resposta: string;

  // Dúvidas educativas: disponíveis para todos os planos.
  if (
    /\b(o que e phishing|defina phishing|significado de phishing|phishing)\b/i.test(
      mensagem
    ) &&
    !/\b(analisar|verificar|consultar)\b/i.test(mensagem)
  ) {
    resposta =
      "🎣 Phishing é um tipo de golpe em que alguém tenta enganar você para obter dados pessoais, senhas ou informações bancárias. Isso pode acontecer por e-mail, SMS, redes sociais ou mensagens com links falsos. Desconfie de urgência, ameaças, ofertas muito boas e páginas que imitam empresas conhecidas. Nunca informe senhas ou códigos por links recebidos inesperadamente.";
  } else if (
    /\b(prevenir|prevenir-se|proteger|protecao|seguranca|evitar golpes|link suspeito|links suspeitos|link malicioso|links maliciosos)\b/i.test(
      mensagem
    )
  ) {
    resposta =
      "🛡️ Para se proteger de links suspeitos:\n\n" +
      "• Confira o endereço do site antes de abrir.\n" +
      "• Desconfie de mensagens com ameaças ou urgência.\n" +
      "• Não informe senhas, códigos ou dados bancários em páginas desconhecidas.\n" +
      "• Evite baixar arquivos de remetentes desconhecidos.\n" +
      "• Se tiver dúvidas, acesse o site oficial digitando o endereço no navegador.\n\n" +
      "O Guardix pode ajudar a identificar indicadores de risco, mas nenhum resultado garante que um link seja seguro.";
  } else if (
    /\b(identificar|reconhecer|perceber|sinais|caracteristicas)\b/i.test(
      mensagem
    ) &&
    /\b(golpe|fraude|phishing|mensagem suspeita)\b/i.test(mensagem)
  ) {
    resposta =
      "🚨 Alguns sinais comuns de golpe são pedidos urgentes de dinheiro, ameaças, links desconhecidos, erros no endereço do site e solicitações de senhas ou códigos. Confira as informações por um canal oficial antes de agir. Se suspeitar de uma mensagem, não clique nos links nem envie dinheiro sem verificar.";
  } else if (
    /\b(analisar|verificar|consultar|investigar|checar)\b/i.test(
      mensagem
    ) &&
    identificarPedidoDeAnalise(mensagem)
  ) {
    resposta = premium
      ? "🔒 Para analisar links, telefones ou prints pelo atendimento assistido, continue com nossa equipe pelo WhatsApp."
      : "🔒 A análise de links, telefones e prints pelo chatbot é um recurso exclusivo do plano Premium. Você pode conhecer os planos para consultar as opções disponíveis.";
  } else if (
    /\b(oi|ola|eai|bom dia|boa tarde|boa noite|hey|hello)\b/i.test(
      mensagem
    )
  ) {
    resposta =
      "Olá! 👋 Sou o assistente do Guardix. Posso explicar conceitos de segurança digital, ajudar você a reconhecer possíveis golpes e tirar dúvidas sobre a plataforma. O que gostaria de saber?";
  } else if (
    /\b(plano|planos|assinatura|premium|preco|valor)\b/i.test(mensagem)
  ) {
    resposta =
      "O Guardix possui os planos Free, Pro e Premium. Consulte a seção Planos do dashboard para conferir os recursos e valores disponíveis.";
  } else if (
    /\b(obrigado|obrigada|valeu|agradeco)\b/i.test(mensagem)
  ) {
    resposta =
      "Por nada! 😊 Continue atento aos sinais de golpes e confirme informações suspeitas por canais oficiais.";
  } else if (
    /\b(ajuda|ajudar|funciona|funcionalidades|o que voce faz)\b/i.test(
      mensagem
    )
  ) {
    resposta =
      "Posso explicar conceitos de segurança digital, orientar sobre possíveis golpes e ajudar você a conhecer as funcionalidades do Guardix. As análises assistidas seguem as regras do seu plano.";
  } else if (premium) {
    resposta =
      "Posso ajudar com dúvidas gerais sobre segurança digital e sobre o Guardix. Para atendimento personalizado, você também pode continuar pelo WhatsApp.";
  } else {
    resposta =
      "Posso ajudar com dúvidas sobre segurança digital, phishing, links suspeitos e possíveis golpes. Também posso explicar as funcionalidades do Guardix. 😊";
  }

  return {
    id: Date.now(),
    texto: resposta,
    autor: "bot",
  };
}


export default function Chatbot({
  plano = "free",
  onNavigateToPlanos,
}: ChatbotProps) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      texto:
        "Olá! 👋 Bem-vindo ao Guardix. Pode conversar comigo e tirar suas dúvidas sobre a plataforma. Como posso ajudar?",
      autor: "bot",
    },
  ]);

  const listaRef = useRef<HTMLDivElement>(null);
  const planoAtual = plano.toLowerCase();
  const premium = planoAtual === "premium";

  useEffect(() => {
    listaRef.current?.scrollTo({
      top: listaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens, digitando, aberto]);

  function enviarMensagem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const conteudo = texto.trim();

    if (!conteudo || digitando) return;

    const mensagemUsuario: Mensagem = {
      id: Date.now(),
      texto: conteudo,
      autor: "usuario",
    };

    setMensagens((atuais) => [...atuais, mensagemUsuario]);
    setTexto("");
    setDigitando(true);

    // Resposta local para validar a interface.
    // Não executa análises nem chama a API.
    window.setTimeout(() => {
      const resposta = gerarResposta(conteudo, planoAtual);
      setMensagens((atuais) => [...atuais, resposta]);
      setDigitando(false);
    }, 500);
  }

  return (
    <div>
      {aberto && (
        <section
          aria-label="Chatbot do Guardix"
          style={{
            position: "fixed",
            right: "20px",
            bottom: "88px",
            width: "min(370px, calc(100vw - 32px))",
            height: "min(520px, calc(100dvh - 120px))",
            display: "flex",
            flexDirection: "column",
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid #374151",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <header
            style={{
              padding: "16px",
              background: "#1f2937",
              borderBottom: "1px solid #374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <strong style={{ display: "block", fontSize: "16px" }}>
                🔒 Guardix Assistente
              </strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                {premium ? "Atendimento Premium" : "Assistente da plataforma"}
              </span>
            </div>

            <button
              type="button"
              aria-label="Fechar chatbot"
              onClick={() => setAberto(false)}
              style={botaoFechar}
            >
              ✕
            </button>
          </header>

          <div
            ref={listaRef}
            aria-live="polite"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                style={{
                  alignSelf:
                    mensagem.autor === "usuario" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "11px 13px",
                  borderRadius: "12px",
                  background:
                    mensagem.autor === "usuario" ? "#b7791f" : "#1f2937",
                  color: "#f9fafb",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {mensagem.texto}
              </div>
            ))}

            {digitando && (
              <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                Guardix está respondendo...
              </span>
            )}

            {mensagens.length > 1 &&
              identificarPedidoDeAnalise(
                mensagens[mensagens.length - 2]?.texto || ""
              ) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {!premium && (
                    <button
                      type="button"
                      onClick={onNavigateToPlanos}
                      style={botaoAcao}
                    >
                      Conhecer os planos
                    </button>
                  )}

                  {premium && (
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={linkWhatsApp}>
                      Continuar pelo WhatsApp
                    </a>
                  )}
                </div>
              )}

            {premium && (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                style={linkWhatsApp}
              >
                Falar com o Guardix no WhatsApp
              </a>
            )}
          </div>

          <form
            onSubmit={enviarMensagem}
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              borderTop: "1px solid #374151",
              background: "#111827",
            }}
          >
            <input
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Digite sua mensagem..."
              aria-label="Mensagem para o Guardix"
              maxLength={1000}
              style={{
                minWidth: 0,
                flex: 1,
                padding: "11px",
                color: "#f9fafb",
                background: "#1f2937",
                border: "1px solid #4b5563",
                borderRadius: "9px",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={!texto.trim() || digitando}
              aria-label="Enviar mensagem"
              style={{
                ...botaoAcao,
                opacity: !texto.trim() || digitando ? 0.5 : 1,
              }}
            >
              Enviar
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={aberto ? "Fechar assistente" : "Abrir assistente Guardix"}
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: "none",
          background: "#d97706",
          color: "#ffffff",
          fontSize: "25px",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          zIndex: 10000,
        }}
      >
        {aberto ? "✕" : "💬"}
      </button>
    </div>
  );
}

const botaoFechar: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#f9fafb",
  fontSize: "20px",
  cursor: "pointer",
};

const botaoAcao: React.CSSProperties = {
  padding: "10px 12px",
  border: "none",
  borderRadius: "9px",
  background: "#d97706",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};

const linkWhatsApp: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "10px 12px",
  borderRadius: "9px",
  background: "#15803d",
  color: "#ffffff",
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "13px",
};
