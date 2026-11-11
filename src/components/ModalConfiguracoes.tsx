
import { useEffect, useLayoutEffect, useState } from "react";

type Tema = "escuro" | "claro" | "automatico";

interface Preferencias {
    tema: Tema;
    notificacoesFeed: boolean;
    notificacoesAnalise: boolean;
    notificacoesSeguranca: boolean;
}

const PREFERENCIAS_PADRAO: Preferencias = {
    tema: "escuro",
    notificacoesFeed: true,
    notificacoesAnalise: true,
    notificacoesSeguranca: true,
};

interface ModalConfiguracoesProps {
    isOpen: boolean;
    onClose: () => void;
}

function ModalConfiguracoes({
    isOpen,
    onClose,
}: ModalConfiguracoesProps) {
    const [preferencias, setPreferencias] = useState<Preferencias>(() => {
        try {
            const salvas = localStorage.getItem("guardix_preferencias");

            return salvas
                ? { ...PREFERENCIAS_PADRAO, ...JSON.parse(salvas) }
                : PREFERENCIAS_PADRAO;
        } catch {
            return PREFERENCIAS_PADRAO;
        }
    });

    // Salva as preferências sempre que houver alterações.
    useEffect(() => {
        localStorage.setItem(
            "guardix_preferencias",
            JSON.stringify(preferencias)
        );
    }, [preferencias]);

    // Aplica o tema antes da pintura da tela, evitando o flash branco.
    useLayoutEffect(() => {
        const media = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const aplicarTema = () => {
            const temaEscuro =
                preferencias.tema === "escuro" ||
                (preferencias.tema === "automatico" && media.matches);

            document.documentElement.dataset.theme = temaEscuro
                ? "dark"
                : "light";
        };

        aplicarTema();

        if (preferencias.tema === "automatico") {
            media.addEventListener("change", aplicarTema);

            return () => {
                media.removeEventListener("change", aplicarTema);
            };
        }
    }, [preferencias.tema]);

    if (!isOpen) return null;

    const alterarPreferencia = async (
        chave: keyof Preferencias,
        valor: boolean | Tema
    ) => {
        if (
            typeof valor === "boolean" &&
            valor &&
            chave !== "tema" &&
            "Notification" in window
        ) {
            if (Notification.permission === "default") {
                await Notification.requestPermission();
            }

            if (Notification.permission === "denied") {
                alert(
                    "As notificações estão bloqueadas no navegador. Altere a permissão nas configurações do site."
                );
                return;
            }
        }

        setPreferencias((anterior) => ({
            ...anterior,
            [chave]: valor,
        }));
    };

    const alternarNotificacao = (
        chave:
            | "notificacoesFeed"
            | "notificacoesAnalise"
            | "notificacoesSeguranca"
    ) => (
        <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-[var(--border)] py-4 last:border-0">
            <span className="text-sm text-[var(--text-dim)]">
                {chave === "notificacoesFeed"
                    ? "Novos alertas no Feed de Golpes"
                    : chave === "notificacoesAnalise"
                    ? "Conclusão de análises"
                    : "Avisos de segurança da conta"}
            </span>

            <input
                type="checkbox"
                checked={preferencias[chave]}
                onChange={(e) =>
                    alterarPreferencia(chave, e.target.checked)
                }
                className="h-4 w-4 accent-indigo-500"
            />
        </label>
    );

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <section
                className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CABEÇALHO */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text)]">
                            Configurações
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-dim)]">
                            Personalize sua experiência no Guardix.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                        aria-label="Fechar configurações"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* APARÊNCIA */}
                <div className="mb-7">
                    <h3 className="mb-2 font-semibold text-[var(--text)]">
                        <i className="fas fa-palette mr-2 text-indigo-400" />
                        Aparência
                    </h3>

                    <p className="mb-3 text-sm text-[var(--text-dim)]">
                        Escolha como deseja visualizar o Guardix.
                    </p>

                    <select
                        value={preferencias.tema}
                        onChange={(e) =>
                            alterarPreferencia(
                                "tema",
                                e.target.value as Tema
                            )
                        }
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-indigo-500"
                    >
                        <option value="escuro">Escuro</option>
                        <option value="claro">Claro</option>
                        <option value="automatico">Automático</option>
                    </select>
                </div>

                {/* NOTIFICAÇÕES */}
                <div>
                    <h3 className="mb-1 font-semibold text-[var(--text)]">
                        <i className="fas fa-bell mr-2 text-indigo-400" />
                        Notificações
                    </h3>

                    <p className="mb-2 text-sm text-[var(--text-dim)]">
                        Escolha quais avisos deseja receber.
                    </p>

                    {alternarNotificacao("notificacoesFeed")}
                    {alternarNotificacao("notificacoesAnalise")}
                    {alternarNotificacao("notificacoesSeguranca")}
                </div>

                {/* RODAPÉ */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Concluir
                    </button>
                </div>
            </section>
        </div>
    );
}

export default ModalConfiguracoes;