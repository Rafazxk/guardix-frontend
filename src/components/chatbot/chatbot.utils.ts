export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function normalizarPlano(plano?: string): string {
  const valor = normalizarTexto(plano || "free")
    .replace(/[\s_-]+/g, "");

  if (["premium", "premium+", "premiumplus"].includes(valor)) {
    return "premium";
  }

  if (valor === "pro") {
    return "pro";
  }

  return "free";
}

export function possuiLink(texto: string): boolean {
  return /https?:\/\/\S+|www\.\S+|\b[\w-]+\.(com|net|org|br|io)(\/\S*)?/i.test(
    texto
  );
}

export function possuiTelefone(texto: string): boolean {
  return /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-.\s]?\d{4}/.test(
    texto
  );
}