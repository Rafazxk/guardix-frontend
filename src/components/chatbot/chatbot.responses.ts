import type {
  RespostaChatbot,
  IntencaoChatbot,
} from "./chatbot.types";

export function gerarResposta(
  intencao: IntencaoChatbot,
  plano: string
): RespostaChatbot {
  const premium = plano === "premium";

  switch (intencao) {
    case "phishing":
      return {
        texto:
          "🎣 Phishing é um tipo de golpe em que alguém tenta enganar você para obter dados pessoais, senhas ou informações bancárias. Isso pode acontecer por e-mail, SMS, redes sociais ou mensagens com links falsos.\n\nDesconfie de mensagens urgentes, ameaças, ofertas muito boas e páginas que imitam empresas conhecidas. Nunca informe senhas ou códigos por links recebidos inesperadamente.",
      };

    case "protecao":
      return {
        texto:
          "🛡️ Algumas medidas ajudam a proteger você contra golpes digitais:\n\n" +
          "• Confira o endereço do site antes de abrir.\n" +
          "• Desconfie de mensagens com ameaças ou urgência.\n" +
          "• Não informe senhas, códigos ou dados bancários em páginas desconhecidas.\n" +
          "• Evite baixar arquivos de remetentes desconhecidos.\n" +
          "• Acesse sites oficiais digitando o endereço diretamente no navegador.\n\n" +
          "O Guardix pode ajudar a identificar indicadores de risco, mas nenhum resultado garante que um link seja seguro.",
      };

    case "sinais_golpe":
      return {
        texto:
          "🚨 Alguns sinais comuns de golpe são:\n\n" +
          "• Pedidos urgentes de dinheiro.\n" +
          "• Ameaças ou tentativas de pressionar você.\n" +
          "• Links desconhecidos.\n" +
          "• Endereços de sites com pequenas alterações.\n" +
          "• Solicitações de senhas ou códigos de verificação.\n\n" +
          "Antes de agir, confirme as informações por um canal oficial.",
      };

    case "analise":
      return premium
        ? {
            texto:
              "🔒 Para continuar com o atendimento assistido sobre links, telefones ou prints, entre em contato com nossa equipe pelo WhatsApp.",
            acao: "whatsapp",
          }
        : {
            texto:
              "🔒 O atendimento assistido para solicitações de análise pelo chatbot é um recurso disponibilizado no plano Premium. Consulte os planos para conhecer os recursos e condições disponíveis.",
            acao: "planos",
          };

    case "planos":
      return {
        texto:
          "O Guardix possui os planos Free, Pro e Premium+. Cada plano disponibiliza recursos e condições diferentes. Acesse a seção Planos do dashboard para conferir os detalhes e valores atualizados.",
        acao: "planos",
      };

    case "atendimento":
      return premium
        ? {
            texto:
              "📲 Você pode continuar seu atendimento com nossa equipe pelo WhatsApp.",
            acao: "whatsapp",
          }
        : {
            texto:
              "Para conhecer as opções de atendimento e os recursos disponíveis, consulte os planos do Guardix.",
            acao: "planos",
          };

    case "saudacao":
      return {
        texto:
          "Olá! 👋 Sou o assistente do Guardix. Posso explicar conceitos de segurança digital, ajudar você a reconhecer possíveis golpes e tirar dúvidas sobre a plataforma. O que gostaria de saber?",
      };

    case "agradecimento":
      return {
        texto:
          "Por nada! 😊 Continue atento aos sinais de golpes e confirme informações suspeitas por canais oficiais.",
      };

    case "ajuda":
      return {
        texto:
          "Posso ajudar você com:\n\n" +
          "• Conceitos de segurança digital.\n" +
          "• Informações sobre phishing.\n" +
          "• Orientações para reconhecer possíveis golpes.\n" +
          "• Dúvidas sobre as funcionalidades do Guardix.\n" +
          "• Informações sobre os planos disponíveis.\n\n" +
          "Lembre-se: as respostas são orientações educativas e não substituem uma análise técnica.",
      };

    default:
      return {
        texto:
          "Posso ajudar com dúvidas sobre segurança digital, phishing, links suspeitos, possíveis golpes e funcionalidades do Guardix. 😊\n\nTente reformular sua pergunta para que eu possa encontrar uma orientação adequada.",
      };
  }
}