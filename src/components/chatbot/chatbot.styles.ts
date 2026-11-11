import type { CSSProperties } from "react";

export const estilos = {
  janela: {
    position: "fixed",
    right: "20px",
    bottom: "88px",
    width: "min(370px, calc(100vw - 32px))",
    height: "min(520px, calc(100dvh - 120px))",
    display: "flex",
    flexDirection: "column",
    background: "var(--card)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    zIndex: 9999,
    overflow: "hidden",
  } satisfies CSSProperties,

  cabecalho: {
    padding: "16px",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  } satisfies CSSProperties,

  titulo: {
    display: "block",
    fontSize: "16px",
    color: "var(--text)",
  } satisfies CSSProperties,

  subtitulo: {
    color: "var(--text-muted)",
    fontSize: "12px",
  } satisfies CSSProperties,

  botaoFechar: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "20px",
    cursor: "pointer",
  } satisfies CSSProperties,

  listaMensagens: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  } satisfies CSSProperties,

  mensagem: {
    maxWidth: "88%",
    padding: "11px 13px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  } satisfies CSSProperties,

  mensagemBot: {
    background: "var(--surface-2)",
    color: "var(--text)",
    alignSelf: "flex-start",
  } satisfies CSSProperties,

  mensagemUsuario: {
    background: "var(--indigo)",
    color: "#ffffff",
    alignSelf: "flex-end",
  } satisfies CSSProperties,

  indicadorDigitando: {
    color: "var(--text-muted)",
    fontSize: "13px",
  } satisfies CSSProperties,

  formulario: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid var(--border)",
    background: "var(--card)",
  } satisfies CSSProperties,

  campoMensagem: {
    minWidth: 0,
    flex: 1,
    padding: "11px",
    color: "var(--text)",
    background: "var(--input-bg)",
    border: "1px solid var(--border)",
    borderRadius: "9px",
    outline: "none",
  } satisfies CSSProperties,

  botaoAcao: {
    padding: "10px 12px",
    border: "none",
    borderRadius: "9px",
    background: "var(--indigo)",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  } satisfies CSSProperties,

  linkWhatsApp: {
    display: "block",
    textAlign: "center",
    padding: "10px 12px",
    borderRadius: "9px",
    background: "#15803d",
    color: "#ffffff",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "13px",
  } satisfies CSSProperties,

  areaAcao: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxWidth: "88%",
  } satisfies CSSProperties,

  botaoFlutuante: {
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
  } satisfies CSSProperties,
};