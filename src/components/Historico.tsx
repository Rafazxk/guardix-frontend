import { useMemo, useState, useEffect } from "react";

type TipoHistorico = "todos" | "link" | "telefone" | "print";

interface HistoricoItem {
    id?: number | string;
    data: string;
    tipo: "link" | "telefone" | "print" | string;
    alvo?: string;
    url?: string;  
    numero?: string;   
    status: string | { nivel: string };
}

interface HistoricoProps {
    historicoInicial?: HistoricoItem[];
    apiUrl?: string;
}

function Historico({
    historicoInicial,
    apiUrl = "http://localhost:10000/api/historico"
}: HistoricoProps) {
    const [historico, setHistorico] = useState<HistoricoItem[]>(historicoInicial || []);
    const [carregando, setCarregando] = useState<boolean>(!historicoInicial);
    const [erro, setErro] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<TipoHistorico>("todos");

    useEffect(() => {
        if (historicoInicial) return;

        const buscarHistorico = async () => {
            setCarregando(true);
            setErro(null);
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("guardix_token")}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao carregar o histórico de análises.");
                }

                const data = await response.json();
                setHistorico(data);
            } catch (err: any) {
                setErro(err.message || "Erro desconhecido");
            } finally {
                setCarregando(false);
            }
        };

        buscarHistorico();
    }, [apiUrl, historicoInicial]);

    const historicoFiltrado = useMemo(() => {
        if (filtro === "todos") {
            return historico;
        }

        return historico.filter((item) => {
            const tipoBruto = (item.tipo || "").toLowerCase().trim();
            if (filtro === "link") return tipoBruto === "link" || tipoBruto === "url";
            if (filtro === "telefone") return tipoBruto === "telefone" || tipoBruto === "tel";
            if (filtro === "print") return tipoBruto === "print" || tipoBruto === "imagem";
            return false;
        });
    }, [historico, filtro]);

    const alterarFiltro = (novoFiltro: TipoHistorico) => {
        setFiltro(novoFiltro);
    };

    const formatarStatus = (status: string | { nivel: string }) => {
        if (!status) return "Desconhecido";
        if (typeof status === "object") return status.nivel || "Analisado";
        try {
            const parsed = JSON.parse(status);
            return parsed.nivel || status;
        } catch {
            return status;
        }
    };

    const obterAlvo = (item: HistoricoItem) => {
        return item.alvo || item.url || item.numero || "Alvo não especificado";
    };

    return (
        <section id="secao-historico" className="w-full max-w-full px-2 sm:px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Histórico</h1>
                    <p className="text-xs sm:text-sm text-slate-400">Registros de suas análises</p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => alterarFiltro("todos")}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${filtro === "todos" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                    >
                        Todos
                    </button>
                    <button
                        type="button"
                        onClick={() => alterarFiltro("link")}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${filtro === "link" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                    >
                        <i className="fas fa-link"></i> Link
                    </button>
                    <button
                        type="button"
                        onClick={() => alterarFiltro("telefone")}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${filtro === "telefone" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                    >
                        <i className="fas fa-phone"></i> Tel
                    </button>
                    <button
                        type="button"
                        onClick={() => alterarFiltro("print")}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${filtro === "print" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                    >
                        <i className="fas fa-image"></i> Print
                    </button>
                </div>
            </div>

            {erro && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {erro}
                </div>
            )}

            <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
                <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono text-[0.7rem] uppercase tracking-wider">
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Alvo</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {carregando && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    Carregando histórico...
                                </td>
                            </tr>
                        )}

                        {!carregando && !erro && historicoFiltrado.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    Nenhum registro encontrado para este filtro.
                                </td>
                            </tr>
                        )}

                        {!carregando &&
                            historicoFiltrado.map((item, index) => {
                                const textoAlvo = obterAlvo(item);
                                const textoStatus = formatarStatus(item.status);

                                return (
                                    <tr key={item.id || `${textoAlvo}-${index}`} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">{item.data}</td>
                                        
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            {item.tipo === "link" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                                        <i className="fas fa-link text-xs"></i>
                                                    </div>
                                                    <span className="text-blue-400 font-semibold">Link</span>
                                                </div>
                                            )}

                                            {item.tipo === "telefone" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                                        <i className="fas fa-phone text-xs"></i>
                                                    </div>
                                                    <span className="text-emerald-400 font-semibold">Telefone</span>
                                                </div>
                                            )}

                                            {item.tipo === "print" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                                        <i className="fas fa-image text-xs"></i>
                                                    </div>
                                                    <span className="text-purple-400 font-semibold">Print</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5 max-w-[200px] sm:max-w-md truncate">
                                            <span className="text-slate-200" title={textoAlvo}>
                                                {textoAlvo}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5 whitespace-normal">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-[0.7rem] sm:text-xs font-semibold ${textoStatus.toLowerCase().includes('alto risco') ? 'bg-red-950 text-red-400 border border-red-800/50' : 'bg-slate-800 text-slate-300'}`}>
                                                {textoStatus}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Historico;