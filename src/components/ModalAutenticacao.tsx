import { useState, type FormEvent } from "react";

interface ModalAutenticacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onLoginSuccess?: () => void; 
}

function ModalAutenticacao({
    aberto,
    onFechar,
    onLoginSuccess,
}: ModalAutenticacaoProps) {
    const [aba, setAba] = useState<"login" | "cadastro">("login");

    const [emailLogin, setEmailLogin] = useState("");
    const [senhaLogin, setSenhaLogin] = useState("");

    const [nomeCadastro, setNomeCadastro] = useState("");
    const [emailCadastro, setEmailCadastro] = useState("");
    const [senhaCadastro, setSenhaCadastro] = useState("");

    if (!aberto) {
        return null;
    }

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const resposta = await fetch("http://192.168.0.9:10000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
            });

            const dados = await resposta.json();
            if (!resposta.ok) {
                console.error("Erro no login:", dados);
                return;
            }

            localStorage.setItem("guardix_token", dados.token);
            localStorage.setItem("guardix_user", JSON.stringify(dados.user));
            
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            onFechar();
            
            window.location.reload(); 
        } catch (erro) {
            console.error("Erro ao conectar com o servidor:", erro);
        }
    };

    const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const resposta = await fetch("http://192.168.0.9:10000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: nomeCadastro, email: emailCadastro, senha: senhaCadastro }),
            });

            const dados = await resposta.json();
            if (!resposta.ok) {
                console.error("Erro no cadastro:", dados);
                return;
            }

            setAba("login");
            setNomeCadastro("");
            setEmailCadastro("");
            setSenhaCadastro("");
        } catch (erro) {
            console.error("Erro ao conectar com o servidor:", erro);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Clicou em Entrar com o Google");
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onFechar}
        >
            <div
                className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] animate-[aparecer_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onFechar}
                    aria-label="Fechar"
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-transparent text-xl text-slate-400 transition-all duration-300 hover:border-red-500 hover:text-red-400"
                >
                    &times;
                </button>

                <div className="mb-6 flex gap-6 border-b border-slate-700">
                    <button
                        type="button"
                        onClick={() => setAba("login")}
                        className={`border-b-2 pb-2 font-semibold transition-all duration-300 ${
                            aba === "login"
                                ? "border-blue-500 text-blue-500"
                                : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setAba("cadastro")}
                        className={`border-b-2 pb-2 font-semibold transition-all duration-300 ${
                            aba === "cadastro"
                                ? "border-blue-500 text-blue-500"
                                : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Cadastro
                    </button>
                </div>
                {aba === "login" && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email-login" className="text-sm font-semibold text-slate-400">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email-login"
                                placeholder="seu@email.com"
                                value={emailLogin}
                                onChange={(e) => setEmailLogin(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="senha-login" className="text-sm font-semibold text-slate-400">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="senha-login"
                                placeholder="••••••••"
                                value={senhaLogin}
                                onChange={(e) => setSenhaLogin(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] active:scale-[0.98]"
                        >
                            Entrar na Conta
                        </button>
                    </form>
                )}

                {/* CADASTRO */}
                {aba === "cadastro" && (
                    <form onSubmit={handleCadastro} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome-cadastro" className="text-sm font-semibold text-slate-400">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="nome-cadastro"
                                placeholder="João Silva"
                                value={nomeCadastro}
                                onChange={(e) => setNomeCadastro(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email-cadastro" className="text-sm font-semibold text-slate-400">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email-cadastro"
                                placeholder="seu@email.com"
                                value={emailCadastro}
                                onChange={(e) => setEmailCadastro(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="senha-cadastro" className="text-sm font-semibold text-slate-400">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="senha-cadastro"
                                placeholder="Crie uma senha forte"
                                value={senhaCadastro}
                                onChange={(e) => setSenhaCadastro(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] active:scale-[0.98]"
                        >
                            Criar Minha Conta
                        </button>
                    </form>
                )}

                <div className="relative my-6 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <span className="relative bg-slate-800 px-3 text-xs uppercase text-slate-400">
                        ou
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-slate-950 hover:border-slate-600 active:scale-[0.98]"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.4l4.09-3.16z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                    </svg>
                    Continuar com o Google
                </button>
            </div>
        </div>
    );
}

export default ModalAutenticacao;