export interface ChatbotProps {
  plano?: string;
  onNavigateToPlanos: () => void;
}

export type AutorMensagem = "bot" | "usuario";

export type AcaoMensagem =
  | "planos"
  | "whatsapp"
  | null;

export interface Mensagem {
  id: number;
  texto: string;
  autor: AutorMensagem;
  acao?: AcaoMensagem;
}

export interface RespostaChatbot {
  texto: string;
  acao?: AcaoMensagem;
}

export type IntencaoChatbot =
  | "saudacao"
  | "phishing"
  | "protecao"
  | "sinais_golpe"
  | "analise"
  | "planos"
  | "agradecimento"
  | "ajuda"
  | "atendimento"
  | "desconhecida";