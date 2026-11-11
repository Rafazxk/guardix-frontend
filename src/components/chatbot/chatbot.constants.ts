export const WHATSAPP_URL =
  import.meta.env.VITE_GUARDIX_WHATSAPP_URL ||
  "https://wa.me/5581987984631";

export const CHATBOT_CONFIG = {
  nome: "Guardix Assistente",
  mensagemInicial:
    "Olá! 👋 Bem-vindo ao Guardix. Pode conversar comigo e tirar suas dúvidas sobre a plataforma. Como posso ajudar?",
  limiteMensagem: 1000,
  tempoResposta: 500,
};  

export const PLANOS = {
  FREE: "free",
  PRO: "pro",
  PREMIUM: "premium",
} as const;