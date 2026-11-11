
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot } from "lucide-react";

import type { Mensagem, ChatbotProps } from "./chatbot.types";

import { CHATBOT_CONFIG, WHATSAPP_URL } from "./chatbot.constants";

import { identificarIntencao } from "./chatbot.intents";

import { gerarResposta } from "./chatbot.responses";

import { normalizarPlano } from "./chatbot.utils";

import { estilos } from "./chatbot.styles";

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
      texto: CHATBOT_CONFIG.mensagemInicial,
      autor: "bot",
    },
  ]);

  const listaRef = useRef<HTMLDivElement>(null);
  const temporizadorRef = useRef<number | null>(null);

  const planoAtual = normalizarPlano(plano);
  const premium = planoAtual === "premium";

  useEffect(() => {
    listaRef.current?.scrollTo({
      top: listaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens, digitando, aberto]);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current !== null) {
        window.clearTimeout(temporizadorRef.current);
      }
    };
  }, []);

  function enviarMensagem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const conteudo = texto.trim();

    if (!conteudo || digitando) {
      return;
    }

    const mensagemUsuario: Mensagem = {
      id: Date.now(),
      texto: conteudo,
      autor: "usuario",
    };

    setMensagens((atuais) => [
      ...atuais,
      mensagemUsuario,
    ]);

    setTexto("");
    setDigitando(true);

    temporizadorRef.current = window.setTimeout(() => {
      const intencao = identificarIntencao(conteudo);

      const resposta = gerarResposta(intencao, planoAtual);

      const mensagemBot: Mensagem = {
        id: Date.now(),
        texto: resposta.texto,
        autor: "bot",
        acao: resposta.acao,
      };

      setMensagens((atuais) => [
        ...atuais,
        mensagemBot,
      ]);

      setDigitando(false);
      temporizadorRef.current = null;
    }, CHATBOT_CONFIG.tempoResposta);
  }

  function renderizarAcao(mensagem: Mensagem) {
    if (!mensagem.acao) {
      return null;
    }

    return (
      <div style={estilos.areaAcao}>
        {mensagem.acao === "planos" && (
          <button
            type="button"
            onClick={onNavigateToPlanos}
            style={estilos.botaoAcao}
          >
            Conhecer os planos
          </button>
        )}

        {mensagem.acao === "whatsapp" && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={estilos.linkWhatsApp}
          >
            Continuar pelo WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {aberto && (
        <section
          aria-label="Chatbot do Guardix"
          aria-describedby="chatbot-descricao"
          style={estilos.janela}
        >
          <header style={estilos.cabecalho}>
            <div>
              <strong style={estilos.titulo}>
                🔒 {CHATBOT_CONFIG.nome}
              </strong>

              <span style={estilos.subtitulo}>
                {premium
                  ? "Atendimento Premium"
                  : "Assistente da plataforma"}
              </span>

              <span
                id="chatbot-descricao"
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "3px",
                }}
              >
                Assistente educativo baseado em regras
              </span>
            </div>

            <button
              type="button"
              aria-label="Fechar chatbot"
              onClick={() => setAberto(false)}
              style={estilos.botaoFechar}
            >
              ✕
            </button>
          </header>

          <div
            ref={listaRef}
            aria-live="polite"
            aria-relevant="additions"
            style={estilos.listaMensagens}
          >
            {mensagens.map((mensagem) => {
              const mensagemUsuario = mensagem.autor === "usuario";

              return (
                <div
                  key={mensagem.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: mensagemUsuario
                      ? "flex-end"
                      : "flex-start",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      ...estilos.mensagem,
                      ...(mensagemUsuario
                        ? estilos.mensagemUsuario
                        : estilos.mensagemBot),
                    }}
                  >
                    {mensagem.texto}
                  </div>

                  {!mensagemUsuario && renderizarAcao(mensagem)}
                </div>
              );
            })}

            {digitando && (
              <span
                role="status"
                style={estilos.indicadorDigitando}
              >
                Guardix está respondendo...
              </span>
            )}
          </div>

          <form
            onSubmit={enviarMensagem}
            style={estilos.formulario}
          >
            <input
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Digite sua mensagem..."
              aria-label="Mensagem para o Guardix"
              maxLength={CHATBOT_CONFIG.limiteMensagem}
              style={estilos.campoMensagem}
            />

            <button
              type="submit"
              disabled={!texto.trim() || digitando}
              aria-label="Enviar mensagem"
              style={{
                ...estilos.botaoAcao,
                opacity: !texto.trim() || digitando ? 0.5 : 1,
                cursor:
                  !texto.trim() || digitando
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Enviar
            </button>
          </form>
        </section>
      )}

      {/* Botão flutuante do assistente */}
      <button
        type="button"
        aria-label={
          aberto
            ? "Fechar assistente"
            : "Abrir assistente Guardix"
        }
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
        style={{
  ...estilos.botaoFlutuante,
  background: "var(--indigo)",
  color: "#ffffff",
  border: "1px solid var(--indigo)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
}}
      >
        {aberto ? (
          "✕"
        ) : (
          <Bot size={27} strokeWidth={2.2} />
        )}
      </button>
    </div>
  );
}
