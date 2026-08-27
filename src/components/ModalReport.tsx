import { useState, type FormEvent } from "react";

type TipoAmeaca = "link" | "telefone";

interface ModalReportProps {
    isOpen: boolean;
    onClose: () => void;
}

function ModalReport({
    isOpen,
    onClose,
}: ModalReportProps) {
    const [tipo, setTipo] = useState<TipoAmeaca>("link");
    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    if (!isOpen) {
        return null;
    }

    const limparFormulario = () => {
        setTipo("link");
        setValor("");
        setDescricao("");
        setErro(null);
        setSucesso(false);
    };

    const fecharModal = () => {
        if (carregando) {
            return;
        }

        limparFormulario();
        onClose();
    };

    const alterarTipo = (novoTipo: TipoAmeaca) => {
        setTipo(novoTipo);
        setValor("");
        setErro(null);
    };

    const handleSubmitReport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const valorLimpo = valor.trim();
        const descricaoLimpa = descricao.trim();

        if (!valorLimpo) {
            setErro(
                tipo === "link"
                    ? "Informe o link que deseja denunciar."
                    : "Informe o número de telefone que deseja denunciar."
            );
            return;
        }

        setErro(null);
        setCarregando(true);

        try {
            const token = localStorage.getItem("guardix_token");

            if (!token) {
                throw new Error(
                    "Sua sessão expirou. Faça login novamente."
                );
            }

            const response = await fetch(
                "http://192.168.0.9:10000/stats/report",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        tipo,
                        valor: valorLimpo,
                        descricao: descricaoLimpa,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        "Não foi possível enviar a denúncia."
                );
            }

            setSucesso(true);

            setTimeout(() => {
                limparFormulario();
                onClose();
            }, 1800);
        } catch (error: unknown) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro desconhecido ao enviar a denúncia."
            );
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={fecharModal}
        >
            <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="modal-title flex text-white items-center gap-2">
                            <i className="fas fa-flag text-red-400" />
                            Denunciar ameaça
                        </h3>

                        <p className="modal-text mt-2">
                            Ajude a proteger a comunidade denunciando
                            links ou telefones suspeitos.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={fecharModal}
                        disabled={carregando}
                        aria-label="Fechar"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>


                {sucesso ? (
                    <div className="py-10 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                            <i className="fas fa-circle-check text-3xl" />
                        </div>

                        <h4 className="mt-4 text-lg font-semibold text-slate-100">
                            Denúncia registrada!
                        </h4>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                            Obrigado por contribuir. Sua denúncia pode
                            ajudar outras pessoas a reconhecer essa ameaça.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmitReport}
                        className="mt-6 space-y-5"
                    >
                        <div>
                            <label className="field-label">
                                O que você deseja denunciar?
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => alterarTipo("link")}
                                    disabled={carregando}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        tipo === "link"
                                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                tipo === "link"
                                                    ? "bg-indigo-500/20"
                                                    : "bg-slate-800"
                                            }`}
                                        >
                                            <i className="fas fa-link" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Link
                                            </p>

                                            <p className="mt-0.5 text-xs opacity-70">
                                                Site ou phishing
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => alterarTipo("telefone")}
                                    disabled={carregando}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        tipo === "telefone"
                                            ? "border-red-500/60 bg-red-500/10 text-red-300"
                                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                tipo === "telefone"
                                                    ? "bg-red-500/20"
                                                    : "bg-slate-800"
                                            }`}
                                        >
                                            <i className="fas fa-phone" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Telefone
                                            </p>

                                            <p className="mt-0.5 text-xs opacity-70">
                                                Golpe ou WhatsApp
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>


                        <div>
                            <label
                                htmlFor="report-valor"
                                className="field-label"
                            >
                                {tipo === "link"
                                    ? "Link suspeito"
                                    : "Número de telefone"}
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <i
                                        className={
                                            tipo === "link"
                                                ? "fas fa-link"
                                                : "fas fa-phone"
                                        }
                                    />
                                </div>

                                <input
                                    id="report-valor"
                                    type="text"
                                    className="field-input pl-10"
                                    placeholder={
                                        tipo === "link"
                                            ? "https://exemplo.com"
                                            : "(00) 00000-0000"
                                    }
                                    value={valor}
                                    onChange={(e) => {
                                        setValor(e.target.value);
                                        setErro(null);
                                    }}
                                    disabled={carregando}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* DESCRIÇÃO */}
                        <div>
                            <label
                                htmlFor="report-descricao"
                                className="field-label"
                            >
                                Como essa ameaça aconteceu?
                                <span className="ml-1 text-slate-500">
                                    (opcional)
                                </span>
                            </label>

                            <textarea
                                id="report-descricao"
                                className="field-input min-h-[100px] resize-none"
                                placeholder={
                                    tipo === "link"
                                        ? "Ex.: recebi o link por mensagem e o site solicitava dados bancários..."
                                        : "Ex.: o número entrou em contato fingindo ser do banco..."
                                }
                                value={descricao}
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }
                                disabled={carregando}
                                rows={4}
                            />
                        </div>

                        {/* ERRO */}
                        {erro && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                                <i className="fas fa-circle-exclamation mt-0.5" />

                                <span>{erro}</span>
                            </div>
                        )}

                        {/* AVISO */}
                        <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
                            <i className="fas fa-shield-halved mt-0.5 text-indigo-400" />

                            <p>
                                Sua denúncia será analisada e poderá
                                contribuir para identificar ameaças
                                recorrentes na comunidade.
                            </p>
                        </div>

                        {/* BOTÃO */}
                        <button
                            type="submit"
                            className="btn-analyze w-full"
                            disabled={carregando}
                        >
                            {carregando ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" />
                                    <span>Enviando denúncia...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-flag" />
                                    <span>Enviar denúncia</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ModalReport;