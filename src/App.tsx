import { useState } from "react";
import Home from "./pages/Home";
import Guardix from "./pages/Guardix";

function App() {
    const [logado, setLogado] = useState<boolean>(
        () => !!localStorage.getItem("guardix_token")
    );
    const [exibirBoasVindas, setExibirBoasVindas] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("");

    const handleLoginSuccess = () => {
        setLogado(true);

        // Recupera os dados do usuário para personalização
        const usuarioSalvo = localStorage.getItem("guardix_user");
        if (usuarioSalvo) {
            const user = JSON.parse(usuarioSalvo);
            setNomeUsuario(user.nome || user.name || "Usuário");
        }

        // Ativa a mensagem de boas-vindas
        setExibirBoasVindas(true);

        // Esconde a mensagem após 4 segundos
        setTimeout(() => {
            setExibirBoasVindas(false);
        }, 4000);
    };

    const handleLogout = () => {
    localStorage.removeItem("guardix_token");
    localStorage.removeItem("guardix_user");

    setNomeUsuario("");
    setExibirBoasVindas(false);
    setLogado(false);
};

    return (
        <div className="relative min-h-screen bg-slate-950 text-white">
            {/* TOAST DE BOAS-VINDAS */}
            {exibirBoasVindas && (
                <div className="fixed top-5 right-5 z-[10000] flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 px-6 py-4 text-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.2)] backdrop-blur-md animate-[aparecer_0.3s_ease-out]">
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-bold">Acesso Autorizado!</p>
                        <p className="text-sm text-emerald-400/80">
                            Seja bem-vindo ao Guardix, <strong>{nomeUsuario}</strong>.
                        </p>
                    </div>
                </div>
            )}

            {logado ? (
                <Guardix onLogout={handleLogout} />
            ) : (
                <Home onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;