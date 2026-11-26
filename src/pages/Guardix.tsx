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
import Chatbot from "../components/chatbot/Chatbot";
import ModalPerfil from "../components/ModalPerfil";
import AdminUsuarios from "../components/AdminUsuarios";
import ModalConfiguracoes from "../components/ModalConfiguracoes";
import TutorialGuardix from "../components/tutorial/TutorialGuardix";

interface GuardixProps {
    onLogout: () => void;
}

type AmeacaParaReportar = {
    tipo: "link" | "telefone";
    valor: string;
    score: number;
};


function Guardix({ onLogout }: GuardixProps) {
    const [secaoAtiva, setSecaoAtiva] = useState("verificador");
    const [menuAberto, setMenuAberto] = useState(false);

    const [modalProAberto, setModalProAberto] = useState(false);
    const [modalReporteAberto, setModalReporteAberto] = useState(false);
    const [consultasRealizadas] = useState(0);
    const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState<any>(undefined);
    const [tutorialAberto, setTutorialAberto] = useState(false);

    const [modalConfiguracoesAberto, setModalConfiguracoesAberto] =
        useState(false);
    const [ameacaParaReportar, setAmeacaParaReportar] =
        useState<AmeacaParaReportar | null>(null);

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

useEffect(() => {
    if (!usuarioLogado) return;

    const tutorialVisto = localStorage.getItem(
        "guardix_tutorial_visto"
    );

    if (!tutorialVisto) {
        setTutorialAberto(true);
    }
}, [usuarioLogado]);

    const navegar = (secao: string) => {
        setSecaoAtiva(secao);

        if (window.innerWidth < 768) {
            setMenuAberto(false);
        }
    };

const iniciarTutorial = () => {
    setMenuAberto(false);
    navegar("verificador");
    setTutorialAberto(true);
};

function fecharTutorial() {
  localStorage.setItem("guardix_tutorial_visto", "true");
  setTutorialAberto(false);
}

    return (
        <div className="corpo-dashboard">
            {usuarioLogado?.plano?.toLowerCase() !== "premium+" &&
                usuarioLogado?.plano?.toLowerCase() !== "premium" && (
                    <button
                        type="button"
                        className="
    fixed right-6 top-4 z-[1050]
    flex items-center gap-2
    rounded-lg
    border border-indigo-500/40
    bg-indigo-600
    px-4 py-2
    text-sm font-semibold
    text-white
    shadow-lg shadow-indigo-900/20
    transition-all duration-200
    hover:border-indigo-400
    hover:bg-indigo-700
    hover:shadow-indigo-900/30
    focus:outline-none
    focus:ring-2 focus:ring-indigo-400
"
                        onClick={() => setSecaoAtiva("planos")}
                    >
                        <i className="fas fa-arrow-up" aria-hidden="true"></i>
                        {usuarioLogado?.plano?.toLowerCase() === "pro"
                            ? "Conheça o Premium+"
                            : "Atualize seu plano"}
                    </button>

                    
                )}

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
                abrirModalPerfil={() => setModalPerfilAberto(true)}
                abrirModalConfiguracoes={() => setModalConfiguracoesAberto(true)}
                abrirTutorial={iniciarTutorial}
            />

            <main className="main-content">

                {secaoAtiva === "admin-usuarios" && usuarioLogado?.is_admin && (
                    <AdminUsuarios onLogout={onLogout} />
                )}

                {secaoAtiva === "verificador" && (
                    <Verificador
                        consultasRealizadas={consultasRealizadas}
                        limiteCota={5}
                        onAbrirModalPro={() => setModalProAberto(true)}
                        onReportarAmeaca={(ameaca) => {
                            setAmeacaParaReportar(ameaca);
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

            <ModalPerfil
                isOpen={modalPerfilAberto}
                onClose={() => setModalPerfilAberto(false)}
                usuario={usuarioLogado}
            />

            <ModalConfiguracoes
                isOpen={modalConfiguracoesAberto}
                onClose={() => setModalConfiguracoesAberto(false)}
            />

            <ModalReport
                isOpen={modalReporteAberto}
                onClose={() => {
                    setModalReporteAberto(false);
                    setAmeacaParaReportar(null);
                }}
                ameacaInicial={ameacaParaReportar}
            />
            <Chatbot
                plano={usuarioLogado?.plano || "free"}
                onNavigateToPlanos={handleNavigateToPlanos}
            />

            <TutorialGuardix
    aberto={tutorialAberto}
    onFechar={fecharTutorial}
    onNavegar={navegar}
    onMenuAbrir={() => setMenuAberto(true)}
/>
        </div>
    );
}

export default Guardix;
