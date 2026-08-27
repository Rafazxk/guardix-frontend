import { useState } from "react";
import ModalAutenticacao from "../components/ModalAutenticacao";

// 1. Defina a interface aceitando a prop
interface HomeProps {
    onLoginSuccess?: () => void;
}

// 2. Receba a prop no componente Home
function Home({ onLoginSuccess }: HomeProps) {
    const [modalAutenticacaoAberto, setModalAutenticacaoAberto] = useState(false);

    const abrirModal = () => setModalAutenticacaoAberto(true);
    const fecharModal = () => setModalAutenticacaoAberto(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">

            <header className="sticky top-0 z-[100] border-b border-slate-800 bg-slate-950/80 px-[10%] py-4 backdrop-blur-md transition-all">
                <nav className="flex items-center justify-between">
                    <div className="text-2xl font-extrabold tracking-tight text-blue-500 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
                        Guardix
                    </div>

                    <button
                        type="button"
                        onClick={abrirModal}
                        className="cursor-pointer rounded-xl border border-blue-500/50 bg-blue-500/10 px-5 py-2.5 font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(0,123,255,0.4)]"
                    >
                        Entrar / Cadastrar
                    </button>
                </nav>
            </header>

            <main>
                <section className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 px-6 pt-24 pb-20 overflow-hidden text-center">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

                    <div className="mx-auto max-w-[800px] relative">
                        <span className="inline-block mb-4 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-400">
                            🛡️ Inteligência Antifraude
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                            Antecipe-se a golpes digitais e proteja suas informações 
                        </h1>
                        <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            Uma solução robusta focada em segurança cibernética, análise de riscos e detecção preventiva de fraudes em ambientes digitais.
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <button
                                type="button"
                                onClick={abrirModal}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-extrabold uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/45 cursor-pointer"
                            >
                                Acessar Sistema
                            </button>
                        </div>
                    </div>
                </section>

                <section id="educativo" className="px-6 py-20 border-t border-slate-900 bg-slate-950/50">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                            Por que a prevenção é sua melhor defesa?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400 text-sm md:text-base">
                            Entenda as ameaças que circulam na rede e como nos antecipamos a elas.
                        </p>

                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {[
                                { title: "O que é Phishing?", desc: "Técnica de engenharia social onde criminosos criam sites idênticos aos reais para roubar dados." },
                                { title: "Golpe do Comprovante", desc: "Utilização de capturas de tela falsificadas para simular pagamentos que nunca ocorreram." },
                                { title: "Links Suspeitos", desc: "URLs encurtadas ou maliciosas configuradas para instalar malwares no seu dispositivo." }
                            ].map((item, idx) => (
                                <article key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold mb-4">
                                        0{idx + 1}
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-slate-200">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ModalAutenticacao
                aberto={modalAutenticacaoAberto}
                onFechar={fecharModal}
                onLoginSuccess={onLoginSuccess} 
            />

        </div>
    );
}

export default Home;