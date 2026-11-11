import type { IntencaoChatbot } from "./chatbot.types";
import {
  normalizarTexto,
  possuiLink,
  possuiTelefone,
} from "./chatbot.utils";

export function identificarPedidoDeAnalise(
  texto: string
): boolean {
  const mensagem = normalizarTexto(texto);

  const temAlvo =
    possuiLink(mensagem) ||
    possuiTelefone(mensagem) ||
    /\b(link|url|site|telefone|celular|numero|print|imagem|screenshot)\b/i.test(
      mensagem
    );

  const temIntencao =
    /\b(analisar|analise|verificar|verifique|consultar|consulta|investigar|checar|confira|avaliar|descobrir)\b/i.test(
      mensagem
    );

  const perguntaSobreRisco =
    /\b(e seguro|sera que e golpe|isso e golpe|pode ser golpe|e confiavel|posso confiar|parece golpe)\b/i.test(
      mensagem
    );

  return temAlvo && (temIntencao || perguntaSobreRisco);
}

export function identificarIntencao(
  texto: string
): IntencaoChatbot {
  const mensagem = normalizarTexto(texto);

  if (!mensagem) {
    return "desconhecida";
  }

  // Saudações
  if (
    /\b(oi|ola|eai|bom dia|boa tarde|boa noite|hey|hello)\b/i.test(
      mensagem
    )
  ) {
    return "saudacao";
  }

  // Phishing, incluindo erros comuns de escrita.
  if (
    /\b(phishing|phising|phish|pishing)\b/i.test(mensagem)
  ) {
    return "phishing";
  }

  // Pedidos de análise devem ser identificados antes
  // das dúvidas educativas sobre proteção.
  if (identificarPedidoDeAnalise(mensagem)) {
    return "analise";
  }

  // Proteção contra golpes
  if (
    /\b(prevenir|prevenir-se|proteger|protecao|seguranca|evitar golpes|link suspeito|links suspeitos|link malicioso|links maliciosos)\b/i.test(
      mensagem
    )
  ) {
    return "protecao";
  }

  // Sinais de golpes
  if (
    /\b(identificar|reconhecer|perceber|sinais|caracteristicas)\b/i.test(
      mensagem
    ) &&
    /\b(golpe|fraude|phishing|phising|mensagem suspeita)\b/i.test(
      mensagem
    )
  ) {
    return "sinais_golpe";
  }

  // Planos
  if (
    /\b(plano|planos|assinatura|premium|preco|valor)\b/i.test(
      mensagem
    )
  ) {
    return "planos";
  }

  // Atendimento
  if (
    /\b(whatsapp|atendimento humano|falar com atendente|falar com alguem|atendimento personalizado)\b/i.test(
      mensagem
    )
  ) {
    return "atendimento";
  }

  // Agradecimento
  if (
    /\b(obrigado|obrigada|valeu|agradeco)\b/i.test(
      mensagem
    )
  ) {
    return "agradecimento";
  }

  // Ajuda
  if (
    /\b(ajuda|ajudar|funciona|funcionalidades|o que voce faz)\b/i.test(
      mensagem
    )
  ) {
    return "ajuda";
  }

  return "desconhecida";
}
