import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Verificador from "../components/Verificador";
import Historico from "../components/Historico";
import FeedGolpes from "../components/FeedGolpes";
import Relatorios from "../components/Relatorios";
import Planos from "../components/Planos";
import ModalPro from "../components/ModalPro";
import ModalReport from "../components/ModalReport";

interface GuardixProps {
    onLogout: () => void;
}



function Guardix({ onLogout }: GuardixProps) {
    const [secaoAtiva, setSecaoAtiva] = useState("verificador");
    const [menuAberto, setMenuAberto] = useState(false);

    const [modalProAberto, setModalProAberto] = useState(false);
    const [modalReporteAberto, setModalReporteAberto] = useState(false);
    const [consultasRealizadas] = useState(0);

    const [usuarioLogado, setUsuarioLogado] = useState<any>(undefined);


    const handleUpgradePro = () => {
        setModalProAberto(false);
        setSecaoAtiva("planos");
    };

    const handleNavigateToPlanos = () => {
        setModalProAberto(false);
        setSecaoAtiva("planos");
    };

    useEffect(() => {
        const carregarUsuario = async () => {
            const token = localStorage.getItem("guardix_token");

            if (!token) {
                onLogout();
                return;
            }

            try {
                const API_URL =
                    import.meta.env.VITE_API_URL || "http://localhost:10000";

                const resposta = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resposta.status === 401) {
                    console.error("Token rejeitado pelo backend.");
                    onLogout();
                    return;
                }

                if (!resposta.ok) {
                    console.error(
                        "Erro ao carregar usuário:",
                        resposta.status
                    );
                    return;
                }

                const dados = await resposta.json();

                if (dados.user) {

                    setUsuarioLogado(dados.user);

                    localStorage.setItem(
                        "guardix_user",
                        JSON.stringify(dados.user)
                    );
                }
            } catch (erro) {
                console.error("Erro de conexão com /users/me:", erro);
            }
        };

        carregarUsuario();
    }, []);

    const navegar = (secao: string) => {
        setSecaoAtiva(secao);

        if (window.innerWidth < 768) {
            setMenuAberto(false);
        }
    };

    return (
        <div className="corpo-dashboard">
            <button
                type="button"
                className="
        fixed right-6 top-4 z-[1050]
        flex items-center gap-2
        rounded-lg
        border border-amber-500/40
        bg-slate-900
        px-4 py-2
        text-sm font-semibold
        text-amber-400
        shadow-lg
        transition-all
        hover:border-amber-400
        hover:bg-slate-800
        hover:text-amber-300
    "
                onClick={() => setSecaoAtiva("planos")}
            >
                <i className="fas fa-arrow-up"></i>
                Atualize seu plano
            </button>

            <button
                type="button"
                onClick={() => setMenuAberto(true)}
                aria-label="Abrir menu"
                className="
                    fixed left-4 top-4 z-[1100]
                    flex h-10 w-10
                    items-center justify-center
                    rounded-lg
                    border border-slate-700
                    bg-slate-900
                    text-slate-200
                    transition-colors
                    hover:border-indigo-500
                    hover:text-indigo-400
                    md:hidden
                "
            >
                <i className="fas fa-bars"></i>
            </button>

            <Sidebar
                usuario={usuarioLogado}
                menuAberto={menuAberto}
                setMenuAberto={setMenuAberto}
                secaoAtiva={secaoAtiva}
                navegar={navegar}
                abrirModalPro={() => setModalProAberto(true)}
                abrirModalReporte={() => setModalReporteAberto(true)}
            />

            <main className="main-content">

                {secaoAtiva === "verificador" && (
                    <Verificador
                        consultasRealizadas={consultasRealizadas}
                        limiteCota={5}
                        onAbrirModalPro={() => setModalProAberto(true)}
                        onReportarAmeaca={() => {
                            setModalReporteAberto(true);
                        }}
                        onLogout={onLogout}
                    />
                )}

                {secaoAtiva === "historico" && (
                    <Historico onLogout={onLogout} />
                )}

                {secaoAtiva === "feed" && (
                    <FeedGolpes
                        onUpgradePro={handleUpgradePro}
                        onLogout={onLogout} />

                )}

                {secaoAtiva === "relatorios" && (
                    <Relatorios onLogout={onLogout}
                        onUpgradePro={handleUpgradePro}
                    />

                )}

                {secaoAtiva === "planos" && (
                    <Planos
                        onLogout={onLogout}
                        planoAtual={usuarioLogado?.plano?.toLowerCase()} />
                )}
            </main>

            {modalProAberto && (
                <ModalPro
                    onClose={() => setModalProAberto(false)}
                    onNavigateToPlanos={handleNavigateToPlanos}
                />
            )}

            <ModalReport
                isOpen={modalReporteAberto}
                onClose={() => setModalReporteAberto(false)}
            />

        </div>
    );
}

export default Guardix;
