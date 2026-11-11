import { useState } from "react";
import ModalPagamento from "./ModalPagamento";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:10000";

type Plano = "free" | "pro" | "premium";
type PlanoPago = Exclude<Plano, "free">;
type Periodo = "mensal" | "anual";

interface PlanosProps {
    onLogout?: () => void;
    planoAtual?: Plano;
}

interface CheckoutResponse {
    link?: string;
    message?: string;
}

function Planos({ onLogout, planoAtual }: PlanosProps) {
    const [periodo, setPeriodo] = useState<Periodo>("mensal");
    const [modalPagamentoAberto, setModalPagamentoAberto] =
        useState(false);
    const [planoSelecionado, setPlanoSelecionado] =
        useState<PlanoPago>("premium");
    const [carregandoCheckout, setCarregandoCheckout] =
        useState(false);

    const planoNormalizado = planoAtual?.toLowerCase();

    const proEhAtual = planoNormalizado === "pro";
    const premiumEhAtual = planoNormalizado === "premium";

    const precoPro = periodo === "mensal" ? "29,90" : "299,00";
    const precoPremium =
        periodo === "mensal" ? "59,90" : "599,00";

    const iniciarCheckout = async (plano: PlanoPago) => {
        if (carregandoCheckout) return;

        setCarregandoCheckout(true);

        try {
            const token = localStorage.getItem("guardix_token");

            if (!token) {
                onLogout?.();
                throw new Error(
                    "Sua sessão não está disponível. Entre novamente."
                );
            }

            const response = await fetch(
                `${API_URL}/payments/checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        plano,
                        periodo:
                            periodo === "mensal" ? "monthly" : "yearly",
                    }),
                }
            );

            let dados: CheckoutResponse;

            try {
                dados = await response.json();
            } catch {
                throw new Error(
                    "O servidor retornou uma resposta inválida."
                );
            }

            if (response.status === 401) {
                onLogout?.();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    dados.message || "Erro ao iniciar pagamento."
                );
            }

            if (
                typeof dados.link !== "string" ||
                !dados.link.trim()
            ) {
                throw new Error(
                    "Link de pagamento não recebido."
                );
            }

            const checkoutUrl = new URL(dados.link);

            if (checkoutUrl.protocol !== "https:") {
                throw new Error(
                    "O servidor retornou um link de pagamento inválido."
                );
            }

            window.location.assign(checkoutUrl.href);
        } catch (erro: unknown) {
            console.error("Erro ao iniciar pagamento:", erro);

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro inesperado ao iniciar pagamento.";

            alert(mensagem);
        } finally {
            setCarregandoCheckout(false);
        }
    };

    const abrirPagamento = (plano: PlanoPago) => {
        setPlanoSelecionado(plano);
        setModalPagamentoAberto(true);
    };

    const badgePlanoAtual = (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-500">
            <i className="fas fa-check-circle" aria-hidden="true" />
            SEU PLANO ATUAL
        </div>
    );

    return (
        <section className="content-section">
            <div className="page-header">
                <h1 className="page-title">Planos Guardix</h1>
                <p className="page-subtitle">
                    Escolha o plano ideal para aumentar sua proteção.
                </p>
            </div>

            {/* PERIODICIDADE */}
            <div className="mt-8 flex justify-center">
                <div
                    className="flex items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1.5 shadow-lg"
                    role="group"
                    aria-label="Periodicidade do pagamento"
                >
                    <button
                        type="button"
                        aria-pressed={periodo === "mensal"}
                        onClick={() => setPeriodo("mensal")}
                        className={`rounded-xl px-7 py-3 font-semibold transition-all duration-200 ${
                            periodo === "mensal"
                                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                                : "text-[var(--text-dim)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
                        }`}
                    >
                        Mensal
                    </button>

                    <button
                        type="button"
                        aria-pressed={periodo === "anual"}
                        onClick={() => setPeriodo("anual")}
                        className={`rounded-xl px-7 py-3 font-semibold transition-all duration-200 ${
                            periodo === "anual"
                                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                                : "text-[var(--text-dim)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
                        }`}
                    >
                        Anual
                    </button>
                </div>
            </div>

            {/* CARDS DOS PLANOS */}
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">

                {/* PLANO PRO */}
                <div
                    className={`rounded-2xl border bg-[var(--card)] p-6 shadow-lg ${
                        proEhAtual
                            ? "border-emerald-400/50"
                            : "border-[var(--border)]"
                    }`}
                >
                    {proEhAtual && badgePlanoAtual}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[var(--text)]">
                            Pro
                        </h2>
                        <p className="mt-2 text-sm text-[var(--text-dim)]">
                            Proteção avançada para uso individual.
                        </p>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-[var(--text)]">
                            R$ {precoPro}
                        </span>
                        <span className="ml-2 text-[var(--text-muted)]">
                            {periodo === "mensal" ? "/mês" : "/ano"}
                        </span>
                    </div>

                    <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Verificação de Links Falsos ilimitados</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Verificação de Números Desconhecidos ilimitados</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Verificação de Conversas Suspeitas ilimitadas</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Históricos ilimitados</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Resposta da IA mais detalhada e explicativa</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={proEhAtual || carregandoCheckout}
                        onClick={() => abrirPagamento("pro")}
                        className={`w-full rounded-xl px-5 py-3 font-semibold transition ${
                            proEhAtual
                                ? "cursor-not-allowed border border-emerald-400/30 bg-emerald-400/10 text-emerald-500"
                                : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
                        }`}
                    >
                        {proEhAtual
                            ? "✓ Plano atual"
                            : "Assinar Pro"}
                    </button>
                </div>

                {/* PLANO PREMIUM+ */}
                <div
                    className={`relative rounded-2xl border bg-[var(--card)] p-6 shadow-xl shadow-cyan-400/10 ring-1 ring-cyan-400/10 ${
                        premiumEhAtual
                            ? "border-emerald-400/50"
                            : "border-cyan-400/60"
                    }`}
                >
                    {premiumEhAtual && badgePlanoAtual}

                    <div className="absolute -top-3 right-5 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                        COMPLETO
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-500">
                            Premium+
                        </h2>

                        <p className="mt-2 text-sm text-[var(--text-dim)]">
                            Proteção completa para usuários e empresas.
                        </p>

                        <div className="mt-4 inline-flex items-center rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-500">
                            ✓ Tudo do plano Pro + recursos exclusivos
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-[var(--text)]">
                            R$ {precoPremium}
                        </span>
                        <span className="ml-2 text-[var(--text-muted)]">
                            {periodo === "mensal" ? "/mês" : "/ano"}
                        </span>
                    </div>

                    <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Feed de Golpes em Tempo Real com Monitoramento ativo</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>API de gerenciamento e prevenção contra golpes para empresas</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Relatórios mais completos e atividade de segurança avançada</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[var(--text-dim)]">
                            <span className="text-cyan-400">✓</span>
                            <span>Chatbot de autoatendimento ilimitado e avançado</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={premiumEhAtual || carregandoCheckout}
                        onClick={() => abrirPagamento("premium")}
                        className={`w-full rounded-xl px-5 py-3 font-semibold transition ${
                            premiumEhAtual
                                ? "cursor-not-allowed border border-emerald-400/30 bg-emerald-400/10 text-emerald-500"
                                : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
                        }`}
                    >
                        {premiumEhAtual
                            ? "✓ Plano atual"
                            : "Assinar Premium+"}
                    </button>
                </div>
            </div>

            {/* COMPARAÇÃO DOS PLANOS */}
            <div className="mx-auto mt-12 max-w-5xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-[var(--text)]">
                        Compare os planos
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-dim)]">
                        Veja as diferenças entre o Pro e o Premium+.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
                    <div className="grid grid-cols-3 border-b border-[var(--border)]">
                        <div className="p-4 text-sm font-semibold text-[var(--text-muted)]">
                            Recursos
                        </div>

                        <div className="p-4 text-center text-sm font-semibold text-[var(--text)]">
                            Pro
                            {proEhAtual && (
                                <div className="mt-1 text-xs text-emerald-500">
                                    Plano atual
                                </div>
                            )}
                        </div>

                        <div className="p-4 text-center text-sm font-semibold text-cyan-500">
                            Premium+
                            {premiumEhAtual && (
                                <div className="mt-1 text-xs text-emerald-500">
                                    Plano atual
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                        {[
                            {
                                recurso: "Verificação de Links Falsos ilimitados",
                                pro: true,
                                premium: true,
                            },
                            {
                                recurso: "Verificação de Números Desconhecidos ilimitados",
                                pro: true,
                                premium: true,
                            },
                            {
                                recurso: "Verificação de Conversas Suspeitas ilimitadas",
                                pro: true,
                                premium: true,
                            },
                            {
                                recurso: "Históricos ilimitados",
                                pro: true,
                                premium: true,
                            },
                            {
                                recurso: "Resposta da IA mais detalhada e explicativa",
                                pro: true,
                                premium: true,
                            },
                            {
                                recurso: "Feed de Golpes em Tempo Real com Monitoramento ativo",
                                pro: false,
                                premium: true,
                            },
                            {
                                recurso: "API de gerenciamento e prevenção contra golpes para empresas",
                                pro: false,
                                premium: true,
                            },
                            {
                                recurso: "Relatórios e atividade de segurança avançada",
                                pro: false,
                                premium: true,
                            },
                            {
                                recurso: "Chatbot de autoatendimento ilimitado e avançado",
                                pro: false,
                                premium: true,
                            },
                        ].map((item) => (
                            <div
                                key={item.recurso}
                                className="grid grid-cols-3"
                            >
                                <div className="p-4 text-sm text-[var(--text-dim)]">
                                    {item.recurso}
                                </div>

                                <div
                                    className="p-4 text-center"
                                    aria-label={
                                        item.pro
                                            ? "Incluído no plano Pro"
                                            : "Não incluído no plano Pro"
                                    }
                                >
                                    {item.pro ? (
                                        <span className="text-cyan-500">✓</span>
                                    ) : (
                                        <span className="text-[var(--text-muted)]">—</span>
                                    )}
                                </div>

                                <div
                                    className="p-4 text-center"
                                    aria-label={
                                        item.premium
                                            ? "Incluído no Premium+"
                                            : "Não incluído no Premium+"
                                    }
                                >
                                    {item.premium ? (
                                        <span className="text-cyan-500">✓</span>
                                    ) : (
                                        <span className="text-[var(--text-muted)]">—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ModalPagamento
                aberto={modalPagamentoAberto}
                plano={planoSelecionado}
                onFechar={() => setModalPagamentoAberto(false)}
                onContinuar={() => iniciarCheckout(planoSelecionado)}
            />
        </section>
    );
}

export default Planos;
