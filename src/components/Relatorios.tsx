import { useState, useEffect } from "react";

interface EstatisticasUsuario {
    total_consultas: number | string;
    ameacas_evitadas: number | string;
    analises_seguras: number | string;
    risco_medio: string | number;
    reportados: number | string;
}

interface RelatoriosProps {
    apiUrl?: string;
    onUpgradePro?: () => void;
}

function Relatorios({
    apiUrl = "http://localhost:10000/stats/estatisticas",
    onUpgradePro,
}: RelatoriosProps) {
    const [stats, setStats] = useState<EstatisticasUsuario>({
        total_consultas: "—",
        ameacas_evitadas: "—",
        analises_seguras: "—",
        risco_medio: "—",
        reportados: "—",
    });

    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const buscarEstatisticas = async () => {
            setCarregando(true);
            setErro(null);

            try {
                const token = localStorage.getItem("guardix_token");

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar as estatísticas de segurança."
                    );
                }

                const data = await response.json();

                setStats({
                    total_consultas: data.total_consultas ?? 0,
                    ameacas_evitadas: data.ameacas_evitadas ?? 0,
                    analises_seguras: data.analises_seguras ?? 0,
                    risco_medio: data.risco_medio ?? "Baixo",
                    reportados: data.reportados ?? 0,
                });
            } catch (err: any) {
                setErro(
                    err.message ||
                        "Erro desconhecido ao carregar suas estatísticas."
                );
            } finally {
                setCarregando(false);
            }
        };

        buscarEstatisticas();
    }, [apiUrl]);

    const totalConsultas = Number(stats.total_consultas) || 0;
    const ameacasIdentificadas = Number(stats.ameacas_evitadas) || 0;
    const analisesSeguras = Number(stats.analises_seguras) || 0;
    const denuncias = Number(stats.reportados) || 0;

    return (
        <section className="content-section">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <i className="fas fa-shield-halved text-indigo-500" />
                        Minha Segurança
                    </h1>

                    <p className="page-subtitle">
                        Acompanhe sua atividade e seus resultados no Guardix.
                    </p>
                </div>
            </div>

            {/* ERRO */}
            {erro && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-800/50 bg-red-950/40 p-4 text-sm text-red-400">
                    <i className="fas fa-circle-exclamation text-red-500" />
                    <span>{erro}</span>
                </div>
            )}

            {/* INDICADORES */}
            <div className="stats-grid">
                {/* ANÁLISES */}
                <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">
                        <i className="fas fa-magnifying-glass" />
                    </div>

                    <div className="stat-info">
                        <p className="stat-label">
                            Análises realizadas
                        </p>

                        <p className="stat-value">
                            {carregando ? "..." : totalConsultas}
                        </p>
                    </div>
                </div>

                {/* AMEAÇAS */}
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">
                        <i className="fas fa-triangle-exclamation" />
                    </div>

                    <div className="stat-info">
                        <p className="stat-label">
                            Ameaças identificadas
                        </p>

                        <p className="stat-value">
                            {carregando ? "..." : ameacasIdentificadas}
                        </p>
                    </div>
                </div>

                {/* SEGURAS */}
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">
                        <i className="fas fa-shield-check" />
                    </div>

                    <div className="stat-info">
                        <p className="stat-label">
                            Análises seguras
                        </p>

                        <p className="stat-value">
                            {carregando ? "..." : analisesSeguras}
                        </p>
                    </div>
                </div>

                {/* DENÚNCIAS */}
                <div className="stat-card">
                    <div className="stat-icon stat-icon-yellow">
                        <i className="fas fa-flag" />
                    </div>

                    <div className="stat-info">
                        <p className="stat-label">
                            Denúncias realizadas
                        </p>

                        <p className="stat-value">
                            {carregando ? "..." : denuncias}
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
                {/* RESUMO DAS ANÁLISES */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Suas análises
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Distribuição dos resultados das suas
                                verificações.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <i className="fas fa-chart-pie" />
                        </div>
                    </div>

                    {/* SEGURAS */}
                    <div className="mb-5">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                                <span className="text-sm text-slate-300">
                                    Análises seguras
                                </span>
                            </div>

                            <strong className="text-sm text-slate-200">
                                {carregando ? "..." : analisesSeguras}
                            </strong>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-green-500 transition-all"
                                style={{
                                    width:
                                        totalConsultas > 0
                                            ? `${Math.min(
                                                  (analisesSeguras /
                                                      totalConsultas) *
                                                      100,
                                                  100
                                              )}%`
                                            : "0%",
                                }}
                            />
                        </div>
                    </div>

                    {/* AMEAÇAS */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                                <span className="text-sm text-slate-300">
                                    Ameaças identificadas
                                </span>
                            </div>

                            <strong className="text-sm text-slate-200">
                                {carregando ? "..." : ameacasIdentificadas}
                            </strong>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-red-500 transition-all"
                                style={{
                                    width:
                                        totalConsultas > 0
                                            ? `${Math.min(
                                                  (ameacasIdentificadas /
                                                      totalConsultas) *
                                                      100,
                                                  100
                                              )}%`
                                            : "0%",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* RESUMO DE SEGURANÇA */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">
                                Resumo de segurança
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Uma visão geral dos resultados encontrados.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                            <i className="fas fa-gauge-high" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                                    <i className="fas fa-gauge-high" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Nível médio de risco
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Baseado nas suas análises
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                                {carregando
                                    ? "..."
                                    : stats.risco_medio}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                    <i className="fas fa-flag" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Contribuições
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Ameaças enviadas à comunidade
                                    </p>
                                </div>
                            </div>

                            <strong className="text-lg text-slate-100">
                                {carregando ? "..." : denuncias}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* ATIVIDADE PRO */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/80 to-slate-900/80 p-8 text-center shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <i className="fas fa-chart-line text-2xl" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-100">
                    Atividade de segurança
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                    Acompanhe a evolução das suas análises e identifique
                    padrões de segurança ao longo do tempo.
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <i className="fas fa-lock" />
                    Disponível no Plano Pro
                </div>

                <button
                    type="button"
                    className="btn-outline-indigo mt-5"
                    onClick={() => {
                        if (onUpgradePro) {
                            onUpgradePro();
                        }
                    }}
                >
                    Desbloquear
                    <i className="fas fa-arrow-right ml-2" />
                </button>
            </div>
        </section>
    );
}

export default Relatorios;