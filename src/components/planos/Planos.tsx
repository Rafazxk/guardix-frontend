import { useState } from "react";

function Planos() {
    const [periodo, setPeriodo] = useState<"mensal" | "anual">("mensal");
     const precoPro = periodo === "mensal" ? "XX,XX" : "XX,XX";
     const precoPremium = periodo === "mensal" ? "XX,XX" : "XX,XX";
    return (
        <section className="content-section">
            <div className="page-header">
                <h1 className="page-title">Planos Guardix</h1>
                <p className="page-subtitle">
                    Escolha o plano ideal para aumentar sua proteção.
                </p>
            </div>

            <div className="flex justify-center mt-8">
                <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 p-1.5 shadow-lg">
            
                    <button
                        onClick={() => setPeriodo("mensal")}
                        className={`rounded-xl px-7 py-3 font-semibold transition-all duration-200 ${
                            periodo === "mensal"
                                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Mensal
                    </button>
            
                    <button
                        onClick={() => setPeriodo("anual")}
                        className={`rounded-xl px-7 py-3 font-semibold transition-all duration-200 ${
                            periodo === "anual"
                                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Anual
                    </button>
            
                </div>
            </div>
            		
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">

                {/* PLANO PRO */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            Pro
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Proteção avançada para uso individual.
                        </p>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-white">
                             R$  {precoPro}
                        </span>

                        <span className="ml-2 text-slate-400">
                            {periodo === "mensal" ? "/mês" : "/ano"}
                        </span>
                    </div>

                        <div className="mb-6 space-y-3">
                        
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Verificação de Links Falsos ilimitados;</span>
                            </div>
                        
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Verificação de Números Desconhecidos ilimitados;</span>
                            </div>
                        
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Verificação de Conversas Suspeitas ilimitadas;</span>
                            </div>
                        
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Históricos ilimitados;</span>
                            </div>
                        
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Resposta da IA mais detalhada e mais explicativa.</span>
                            </div>
                        
                        </div>
                        
                    <button
                        type="button"
                        className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Assinar Pro
                    </button>

                </div>


                {/* PLANO PREMIUM+ */}
              <div className="relative rounded-2xl border border-cyan-400/60 bg-slate-900 p-6 shadow-xl shadow-cyan-400/20 ring-1 ring-cyan-400/10">

                    <div className="absolute -top-3 right-5 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                        COMPLETO
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-400">
                            Premium+
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Proteção completa para usuários e empresas.
                        </p>

                        <div className="mt-4 inline-flex items-center rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-300">
                            ✓ Tudo do plano Pro + recursos exclusivos
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-white">
                            R$ {precoPremium}
                        </span>

                        <span className="ml-2 text-slate-400">
                          {periodo === "mensal" ? "/mês" : "/ano"}
                        </span>
                    </div>

                    <div className="mb-6 space-y-3">
                    
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>Feed de Golpes em Tempo Real com Monitoramento ativo;</span>
                        </div>
                    
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>Guardix como uma API de Gerenciamento e Prevenção contra Golpes para Empresas;</span>
                        </div>
                    
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>Relatórios mais completos: Atividade de Segurança avançada;</span>
                        </div>
                    
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="text-cyan-400">✓</span>
                            <span>Chatbot de autoatendimento ilimitado e avançado.</span>
                        </div>
                    
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Assinar Premium+
                    </button>

                </div>

            </div>

            <div className="max-w-5xl mx-auto mt-12">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">
                        Compare os planos
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Veja as diferenças entre o Pro e o Premium+.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">

                    <div className="grid grid-cols-3 border-b border-slate-700">

                        <div className="p-4 text-sm font-semibold text-slate-400">
                            Recursos
                        </div>

                        <div className="p-4 text-center text-sm font-semibold text-white">
                            Pro
                        </div>

                        <div className="p-4 text-center text-sm font-semibold text-cyan-400">
                            Premium+
                        </div>

                    </div>

                        <div className="divide-y divide-slate-700">
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Verificação de Links Falsos ilimitados
                                </div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Verificação de Números Desconhecidos ilimitados
                                </div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Verificação de Conversas Suspeitas ilimitadas
                                </div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Históricos ilimitados
                                </div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Resposta da IA mais detalhada e mais explicativa
                                </div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Feed de Golpes em Tempo Real com Monitoramento ativo
                                </div>
                                <div className="p-4 text-center text-slate-600">—</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    API de Gerenciamento e Prevenção contra Golpes para Empresas
                                </div>
                                <div className="p-4 text-center text-slate-600">—</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Relatórios mais completos: Atividade de Segurança avançada
                                </div>
                                <div className="p-4 text-center text-slate-600">—</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                            <div className="grid grid-cols-3">
                                <div className="p-4 text-sm text-slate-300">
                                    Chatbot de autoatendimento ilimitado e avançado
                                </div>
                                <div className="p-4 text-center text-slate-600">—</div>
                                <div className="p-4 text-center text-cyan-400">✓</div>
                            </div>
                        
                        </div>
                        
                       </div>
                      </div>

        </section>
    );
}

export default Planos;
