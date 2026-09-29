import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Verificador from "../components/Verificador";
import Historico from "../components/Historico";
import FeedGolpes from "../components/FeedGolpes";
import Relatorios from "../components/Relatorios";
import Planos from "../components/planos/Planos";
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

    useEffect(() => {
    const dadosSalvos = localStorage.getItem("guardix_user");
    const token = localStorage.getItem("guardix_token");

    if (!token) {
        onLogout();
        return;
    }

    if (dadosSalvos) {
        setUsuarioLogado(JSON.parse(dadosSalvos));
    }
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
                        limiteCota={10}
                        onAbrirModalPro={() => setModalProAberto(true)}
                        onReportarAmeaca={() => {
                            setModalReporteAberto(true);
                        }}
                    />
                )}

                {secaoAtiva === "historico" && ( 
                    <Historico />
                )}

                {secaoAtiva === "feed" && (
                   <FeedGolpes />
                )}

                {secaoAtiva === "relatorios" && (
                   <Relatorios />
                )}

                {secaoAtiva === "planos" && (
                    <Planos />
                )}
                
                {secaoAtiva === "pro" && (
                    <ModalPro 
                        onClose={() => setModalProAberto(false)}
                    />
                )}

            </main>

            {modalProAberto && (
    <ModalPro onClose={() => setModalProAberto(false)} />
)}

            <ModalReport 
                isOpen={modalReporteAberto} 
                onClose={() => setModalReporteAberto(false)} 
            />

        </div>
    );
}

export default Guardix;
