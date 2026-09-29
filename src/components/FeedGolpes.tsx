import { useState, useEffect } from "react";

interface FeedItem {
    tipo: string;
    valor: string;
    total: string | number;
}

interface FeedPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FeedResponse {
    items: FeedItem[];
    pagination: FeedPagination;
}

interface FeedGolpesProps {
    apiUrl?: string;
}

function FeedGolpes({
    apiUrl = "http://localhost:10000/stats/feed",
}: FeedGolpesProps) {

    const [stats, setStats] = useState<FeedItem[]>([]);

    const [busca, setBusca] = useState("");

    const [pagina, setPagina] = useState(1);

    const [paginacao, setPaginacao] = useState<FeedPagination>({
        page: 1,
        limit: 3,
        total: 0,
        totalPages: 0,
    });

    const [carregando, setCarregando] = useState<boolean>(true);

    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {

        const buscarFeed = async () => {

            setCarregando(true);
            setErro(null);

            try {

                const token = localStorage.getItem("guardix_token");

                const params = new URLSearchParams({
                    busca,
                    page: String(pagina),
                    limit: "3",
                });

                const response = await fetch(
                    `${apiUrl}?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                                ? `Bearer ${token}`
                                : "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Erro ao buscar o feed de golpes."
                    );
                }

                const data: FeedResponse = await response.json();

                setStats(data.items);
                setPaginacao(data.pagination);

            } catch (err: unknown) {

                const mensagem =
                    err instanceof Error
                        ? err.message
                        : "Erro desconhecido ao carregar o feed.";

                setErro(mensagem);

            } finally {

                setCarregando(false);

            }
        };

        const timeout = setTimeout(() => {
            buscarFeed();
        }, 400);

        return () => clearTimeout(timeout);

    }, [apiUrl, busca, pagina]);

    const alterarBusca = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setBusca(event.target.value);
        setPagina(1);
    };

    const limparBusca = () => {
        setBusca("");
        setPagina(1);
    };

    return (

        <section className="content-section p-6 space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-1 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">

                        <i className="fas fa-rss text-indigo-500"></i>

                        Feed de Golpes

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

                    <span className="text-xs font-medium text-emerald-400">

                        Monitoramento Ativo

                    </span>

                </div>

            </div>

            {/* BUSCA */}

            <div className="relative">

                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>

                <input
                    type="text"
                    value={busca}
                    onChange={alterarBusca}
                    placeholder="Pesquisar link ou telefone..."
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
                />

                {busca && (

                    <button
                        type="button"
                        onClick={limparBusca}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                        aria-label="Limpar busca"
                    >

                        <i className="fas fa-times"></i>

                    </button>

                )}

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

                        <p className="font-medium text-slate-300">

                            {busca
                                ? "Nenhuma ameaça encontrada para essa busca."
                                : "Nenhuma ameaça registrada no momento."
                            }

                        </p>

                    </div>

                )}

                {!carregando && stats.map((item) => (

                    <div
                        key={`${item.tipo}-${item.valor}`}
                        className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg"
                    >

                        <div className="flex items-start gap-3.5">

                            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0 mt-0.5">

                                <i
                                    className={`fas ${
                                        item.tipo === "link"
                                            ? "fa-link"
                                            : "fa-phone"
                                    } text-lg`}
                                ></i>

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

                                <i className="fas fa-flag text-red-500"></i>

                                {item.total}{" "}

                                {Number(item.total) === 1
                                    ? "denúncia"
                                    : "denúncias"
                                }

                            </span>

                        </div>

                    </div>

                ))}

            </div>

            {/* PAGINAÇÃO */}

            {!carregando &&
                !erro &&
                paginacao.totalPages > 1 && (

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">

                        <span className="text-xs text-slate-500">

                            {paginacao.total} ameaças encontradas

                        </span>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={pagina <= 1}
                                onClick={() =>
                                    setPagina((paginaAtual) =>
                                        Math.max(paginaAtual - 1, 1)
                                    )
                                }
                                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >

                                <i className="fas fa-chevron-left mr-1"></i>

                                Anterior

                            </button>

                            <span className="px-3 py-2 text-xs font-medium text-slate-400">

                                Página {paginacao.page} de{" "}

                                {paginacao.totalPages}

                            </span>

                            <button
                                type="button"
                                disabled={
                                    pagina >= paginacao.totalPages
                                }
                                onClick={() =>
                                    setPagina((paginaAtual) =>
                                        Math.min(
                                            paginaAtual + 1,
                                            paginacao.totalPages
                                        )
                                    )
                                }
                                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >

                                Próxima

                                <i className="fas fa-chevron-right ml-1"></i>

                            </button>

                        </div>

                    </div>

                )}

        </section>

    );
}

export default FeedGolpes;