import { useState, type FormEvent } from "react";

interface ModalAutenticacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onLoginSuccess?: () => void;
}

// Centraliza a URL da API (Ajuste para a sua variável de ambiente se usar Vite ou Next)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

function ModalAutenticacao({
    aberto,
    onFechar,
    onLoginSuccess,
}: ModalAutenticacaoProps) {
    const [aba, setAba] = useState<"login" | "cadastro">("login");
    const [etapa, setEtapa] = useState<"FORM" | "VERIFICACAO">("FORM");

    // Estados da aba de LOGIN
    const [emailLogin, setEmailLogin] = useState("");
    const [senhaLogin, setSenhaLogin] = useState("");

    // Estados da aba de CADASTRO
    const [nomeCadastro, setNomeCadastro] = useState("");
    const [emailCadastro, setEmailCadastro] = useState("");
    const [senhaCadastro, setSenhaCadastro] = useState("");

    // Estado do código de verificação
    const [codigo, setCodigo] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagemErro, setMensagemErro] = useState("");

    if (!aberto) return null;

    const emailAtual = aba === "login" ? emailLogin : emailCadastro;

    // Utilitário para alternar de aba limpando erros
    const trocarAba = (novaAba: "login" | "cadastro") => {
        setAba(novaAba);
        setMensagemErro("");
    };

    // 1. Envia a solicitação de código OTP para a API
    const solicitarCodigo = async (email: string) => {
        setCarregando(true);
        setMensagemErro("");

        try {
            const resposta = await fetch(`${API_URL}/verification/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    type: "EMAIL_VERIFICATION",
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Erro ao solicitar código de acesso.");
            }

            setEtapa("VERIFICACAO");
        } catch (erro: any) {
            setMensagemErro(erro.message || "Erro ao conectar com o servidor.");
        } finally {
            setCarregando(false);
        }
    };

    // 2. Valida o login com E-mail e Senha antes de enviar o OTP
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setMensagemErro("");

    try {
        const respostaLogin = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailLogin,
                senha: senhaLogin,
            }),
        });

        const dadosLogin = await respostaLogin.json();

        if (!respostaLogin.ok) {
            // Se o erro for especificamente e-mail não verificado, redireciona para o OTP
            if (dadosLogin.message === "E-mail não verificado") {
                await solicitarCodigo(emailLogin);
                return;
            }
            throw new Error(dadosLogin.message || "E-mail ou senha incorretos.");
        }

        // Login realizado com sucesso! Armazena o JWT retornado pelo backend
        if (dadosLogin.token) {
            localStorage.setItem("guardix_token", dadosLogin.token);
        }
        if (dadosLogin.user) {
            localStorage.setItem("guardix_user", JSON.stringify(dadosLogin.user));
        }

        if (onLoginSuccess) {
            onLoginSuccess();
        }

        onFechar();
    } catch (erro: any) {
        setMensagemErro(erro.message || "Erro ao realizar login.");
    } finally {
        setCarregando(false);
    }
};

    // 3. Cadastra o novo usuário e aciona o envio do OTP
    const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCarregando(true);
        setMensagemErro("");

        try {
            const resposta = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nomeCadastro,
                    email: emailCadastro,
                    senha: senhaCadastro,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Essa conta ja existe.");
            }

            await solicitarCodigo(emailCadastro);
        } catch (erro: any) {
            setMensagemErro(erro.message || "Erro no processo de cadastro.");
            setCarregando(false);
        }
    };

    // 4. Confirma o código digitado e valida a autenticação final
    const handleConfirmarCodigo = async (
    e: FormEvent<HTMLFormElement>
) => {
    e.preventDefault();
    setCarregando(true);
    setMensagemErro("");

    try {
        // 1. Confirma o código de verificação
        const resposta = await fetch(
            `${API_URL}/verification/verify-email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailAtual,
                    code: codigo,
                }),
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.message || "Código inválido ou expirado."
            );
        }

        // 2. O endpoint de verificação NÃO define JWT.
        // Depois de confirmar o e-mail, fazemos o login normalmente.
        const loginResp = await fetch(
            `${API_URL}/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailAtual,
                    senha:
                        aba === "login"
                            ? senhaLogin
                            : senhaCadastro,
                }),
            }
        );

        const loginDados = await loginResp.json();

        if (!loginResp.ok) {
            throw new Error(
                loginDados.message ||
                    "E-mail confirmado, mas não foi possível realizar o login."
            );
        }

        // 3. O JWT deve vir SOMENTE do login
        if (
            !loginDados.token ||
            typeof loginDados.token !== "string"
        ) {
            throw new Error(
                "O servidor não retornou um JWT válido."
            );
        }

        // 4. Salva o JWT válido
        localStorage.setItem(
            "guardix_token",
            loginDados.token
        );

        // 5. Salva os dados do usuário
        if (loginDados.user) {
            localStorage.setItem(
                "guardix_user",
                JSON.stringify(loginDados.user)
            );
        }

        // 6. Avisa o App que o login terminou
        if (onLoginSuccess) {
            onLoginSuccess();
        }

        // 7. Fecha o modal
        onFechar();

    } catch (erro: any) {
        setMensagemErro(
            erro.message ||
                "Falha na validação do código."
        );
    } finally {
        setCarregando(false);
    }
};

    const handleVoltarFormulario = () => {
        setEtapa("FORM");
        setCodigo("");
        setMensagemErro("");
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

                {mensagemErro && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                        {mensagemErro}
                    </div>
                )}

                {etapa === "VERIFICACAO" ? (
                    <form onSubmit={handleConfirmarCodigo} className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-white">Verificação de E-mail</h3>
                        <p className="text-sm text-slate-400">
                            Digite o código de 6 dígitos enviado para <strong>{emailAtual}</strong>:
                        </p>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-center text-2xl font-bold tracking-widest text-white outline-none transition-all focus:border-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={carregando}
                            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                        >
                            {carregando ? "Validando..." : "Confirmar e Entrar"}
                        </button>

                        <button
                            type="button"
                            onClick={handleVoltarFormulario}
                            className="text-sm text-slate-400 hover:underline text-center mt-1"
                        >
                            Voltar e alterar e-mail
                        </button>
                    </form>
                ) : (
                    <>
                        <div className="mb-6 flex gap-6 border-b border-slate-700">
                            <button
                                type="button"
                                onClick={() => trocarAba("login")}
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
                                onClick={() => trocarAba("cadastro")}
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
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500"
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
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                                >
                                    {carregando ? "Validando..." : "Entrar na Conta"}
                                </button>
                            </form>
                        )}

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
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500"
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
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500"
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
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                                >
                                    {carregando ? "Criando conta..." : "Criar Minha Conta"}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ModalAutenticacao;

