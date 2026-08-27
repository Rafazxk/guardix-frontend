import { useState, useEffect } from "react";

interface FeedItem {
    tipo: string;
    valor: string;
    total: string | number;
}

interface FeedGolpesProps {
    apiUrl?: string;
}

function FeedGolpes({ apiUrl = "http://192.168.0.9:10000/stats/feed" }: FeedGolpesProps) {
    const [stats, setStats] = useState<FeedItem[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const buscarStatsLive = async () => {
            setCarregando(true);
            setErro(null);
            try {
                const token = localStorage.getItem("guardix_token");
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar estatísticas ao vivo.");
                }

                const data = await response.json();
                setStats(data);
            } catch (err: any) {
                setErro(err.message || "Erro desconhecido ao carregar o feed.");
            } finally {
                setCarregando(false);
            }
        };

        buscarStatsLive();
    }, [apiUrl]);

    return (
        <section className="content-section p-6 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-1 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                        <i className="fas fa-rss text-indigo-500"></i> Feed de Golpes
                    </h1>
                    <p className="text-sm text-slate-400">
                        Ameaças reportadas pela comunidade em tempo real
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">Monitoramento Ativo</span>
                </div>
            </div>

            {/* ERRO */}
            {erro && (
                <div className="p-4 text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center gap-3">
                    <i className="fas fa-exclamation-triangle text-red-500"></i>
                    <span>{erro}</span>
                </div>
            )}

            {/* FEED */}
            <div id="feed-golpes" className="space-y-3">
                {carregando && (
                    <>
                        <div className="h-20 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse"></div>
                        <div className="h-20 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse"></div>
                    </>
                )}

                {/* VAZIO */}
                {!carregando && !erro && stats.length === 0 && (
                    <div className="p-12 text-sm text-slate-400 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
                        <i className="fas fa-shield-alt text-4xl text-slate-600 mb-3"></i>
                        <p className="font-medium text-slate-300">Nenhuma ameaça registrada no momento.</p>
                    </div>
                )}

                {!carregando &&
                    stats.map((item, index) => (
                        <div 
                            key={index} 
                            className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0 mt-0.5">
                                    <i className={`fas ${item.tipo === 'link' ? 'fa-link' : 'fa-phone'} text-lg`}></i>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-slate-100 text-base break-all">
                                            {item.valor}
                                        </span>
                                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs font-medium uppercase">
                                            {item.tipo}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Identificado e reportado pela rede de segurança Guardix.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center self-end sm:self-center gap-3">
                                <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">
                                    <i className="fas fa-flag text-red-500"></i> {item.total} {Number(item.total) === 1 ? 'denúncia' : 'denúncias'}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}

export default FeedGolpes;