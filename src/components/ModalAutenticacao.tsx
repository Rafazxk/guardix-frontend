
import { useState, type FormEvent } from "react";

interface ModalAutenticacaoProps {
  aberto: boolean;
  onFechar: () => void;
  onLoginSuccess?: () => void;
}

type Aba = "login" | "cadastro";
type Etapa = "FORM" | "VERIFICACAO";
type TipoPessoa = "Pessoa física" | "Empresa";

interface RespostaAutenticacao {
  message?: string;
  token?: string;
  user?: Record<string, unknown>;
}

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:10000"
).replace(/\/$/, "");

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#171b16] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-lime-300";

const labelClassName = "mb-2 block text-sm font-medium text-white/80";

function ModalAutenticacao({
  aberto,
  onFechar,
  onLoginSuccess,
}: ModalAutenticacaoProps) {
  const [aba, setAba] = useState<Aba>("login");
  const [etapa, setEtapa] = useState<Etapa>("FORM");
  const [tipoPessoa, setTipoPessoa] =
    useState<TipoPessoa>("Pessoa física");

  const [nomeCadastro, setNomeCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  const [codigo, setCodigo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  if (!aberto) return null;

  const emailAtual = aba === "login" ? emailLogin : emailCadastro;
  const senhaAtual = aba === "login" ? senhaLogin : senhaCadastro;

  function trocarAba(novaAba: Aba) {
    setAba(novaAba);
    setEtapa("FORM");
    setMensagemErro("");
    setCodigo("");
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros.length ? `(${numeros}` : "";
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  async function lerResposta(resposta: Response): Promise<RespostaAutenticacao> {
    try {
      return await resposta.json();
    } catch {
      return {};
    }
  }

  async function solicitarCodigo(email: string) {
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

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível enviar o código de verificação.",
        );
      }

      setCodigo("");
      setEtapa("VERIFICACAO");
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao conectar com o servidor.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function concluirLogin(email: string, senha: string) {
    const resposta = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
      throw new Error(
        dados.message ||
          "E-mail confirmado, mas não foi possível entrar na conta.",
      );
    }

    if (!dados.token) {
      throw new Error("O servidor não retornou o token de autenticação.");
    }

    localStorage.setItem("guardix_token", dados.token);

    if (dados.user) {
      localStorage.setItem("guardix_user", JSON.stringify(dados.user));
    }

    onFechar();
    onLoginSuccess?.();
  }

  async function handleLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setMensagemErro("");

    try {
      const resposta = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailLogin.trim(),
          senha: senhaLogin,
        }),
      });

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        if (dados.message === "E-mail não verificado") {
          await solicitarCodigo(emailLogin.trim());
          return;
        }

        throw new Error(dados.message || "E-mail ou senha incorretos.");
      }

      if (!dados.token) {
        throw new Error("O servidor não retornou o token de autenticação.");
      }

      localStorage.setItem("guardix_token", dados.token);

      if (dados.user) {
        localStorage.setItem("guardix_user", JSON.stringify(dados.user));
      }

      onFechar();
      onLoginSuccess?.();
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : "Erro ao realizar login.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagemErro("");

    if (telefoneCadastro.replace(/\D/g, "").length !== 11) {
      setMensagemErro(
        "Informe um telefone celular com DDD e 11 dígitos.",
      );
      return;
    }

    if (senhaCadastro.length < 8) {
      setMensagemErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senhaCadastro !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCadastro.trim(),
          telefone: telefoneCadastro.replace(/\D/g, ""),
          email: emailCadastro.trim(),
          senha: senhaCadastro,
          tipo_pessoa: tipoPessoa,
          ...(tipoPessoa === "Empresa"
            ? { nome_empresa: nomeEmpresa.trim() }
            : {}),
        }),
      });

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível criar sua conta.",
        );
      }

      await solicitarCodigo(emailCadastro.trim());
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : "Erro durante o cadastro.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleConfirmarCodigo(
    evento: FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault();
    setCarregando(true);
    setMensagemErro("");

    try {
      const resposta = await fetch(
        `${API_URL}/verification/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailAtual.trim(),
            code: codigo.trim(),
          }),
        },
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Código inválido ou expirado.",
        );
      }

      await concluirLogin(emailAtual.trim(), senhaAtual);
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível confirmar o código.",
      );
    } finally {
      setCarregando(false);
    }
  }

  function voltarParaFormulario() {
    setEtapa("FORM");
    setMensagemErro("");
    setCodigo("");
  }

function atualizarCodigo(valor: string, indice: number) {
  const numeros = valor.replace(/\D/g, "");

  if (numeros.length > 1) {
    setCodigo(numeros.slice(0, 6));
    return;
  }

  const novoCodigo = codigo.split("");
  novoCodigo[indice] = numeros;

  setCodigo(novoCodigo.join("").slice(0, 6));
}

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget && !carregando) {
          onFechar();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-autenticacao"
        className="relative my-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#101310] p-6 text-white shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onFechar}
          disabled={carregando}
          aria-label="Fechar janela"
          className="absolute right-5 top-5 rounded-lg px-3 py-1 text-2xl text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
        >
          ×
        </button>

        <div className="mb-7">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 font-black text-[#101310]">
              G
            </span>
            <span className="text-lg font-bold tracking-tight">
              guardix<span className="text-lime-300">.</span>
            </span>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
            {etapa === "VERIFICACAO"
              ? "Confirme seu e-mail"
              : aba === "login"
                ? "Bem-vindo de volta"
                : "Comece com segurança"}
          </p>

          <h2
            id="titulo-autenticacao"
            className="pr-8 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {etapa === "VERIFICACAO"
              ? "Só falta confirmar."
              : aba === "login"
                ? "Acesse sua conta."
                : "Crie sua conta."}
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {etapa === "VERIFICACAO"
              ? `Enviamos um código para ${emailAtual}.`
              : aba === "login"
                ? "Entre para continuar usando o Guardix."
                : "Conte um pouco sobre você para começarmos."}
          </p>
        </div>

        {etapa === "FORM" && (
          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-[#171b16] p-1">
            <button
              type="button"
              onClick={() => trocarAba("login")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                aba === "login"
                  ? "bg-lime-300 text-[#101310]"
                  : "text-white/55 hover:text-white"
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => trocarAba("cadastro")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                aba === "cadastro"
                  ? "bg-lime-300 text-[#101310]"
                  : "text-white/55 hover:text-white"
              }`}
            >
              Criar conta
            </button>
          </div>
        )}

        {mensagemErro && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200"
          >
            {mensagemErro}
          </div>
        )}

        {etapa === "VERIFICACAO" ? (
          <form onSubmit={handleConfirmarCodigo} className="space-y-5">
            <div>
  <label className={labelClassName}>
    Código de verificação
  </label>

  <div className="flex justify-center gap-2 sm:gap-3">
    {Array.from({ length: 6 }).map((_, indice) => (
      <input
        key={indice}
        type="text"
        inputMode="numeric"
        autoComplete={indice === 0 ? "one-time-code" : "off"}
        maxLength={1}
        value={codigo[indice] || ""}
        onChange={(evento) =>
          atualizarCodigo(evento.target.value, indice)
        }
        onKeyDown={(evento) => {
          if (
            evento.key === "Backspace" &&
            !codigo[indice] &&
            indice > 0
          ) {
            const anterior = document.getElementById(
              `codigo-${indice - 1}`
            );

            anterior?.focus();
          }
        }}
        onInput={(evento) => {
          const input = evento.currentTarget;

          if (input.value && indice < 5) {
            document.getElementById(
              `codigo-${indice + 1}`
            )?.focus();
          }
        }}
        id={`codigo-${indice}`}
        aria-label={`Dígito ${indice + 1} do código`}
        className="h-12 w-10 rounded-xl border border-white/10 bg-[#171b16] text-center text-xl font-bold text-white outline-none transition focus:border-lime-300 sm:h-14 sm:w-12"
        required
      />
    ))}
  </div>
</div>

            <button
              type="submit"
              disabled={carregando || codigo.length !== 6}
              className="w-full rounded-xl bg-lime-300 px-4 py-3.5 font-bold text-[#101310] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Confirmando..." : "Confirmar e continuar"}
            </button>

            <button
              type="button"
              disabled={carregando}
              onClick={() => solicitarCodigo(emailAtual.trim())}
              className="w-full py-2 text-sm text-white/60 transition hover:text-lime-300 disabled:opacity-40"
            >
              Não recebeu? Enviar outro código
            </button>

            <button
              type="button"
              disabled={carregando}
              onClick={voltarParaFormulario}
              className="w-full py-1 text-sm text-white/40 transition hover:text-white"
            >
              Voltar
            </button>
          </form>
        ) : aba === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email-login" className={labelClassName}>
                E-mail
              </label>
              <input
                id="email-login"
                type="email"
                autoComplete="email"
                value={emailLogin}
                onChange={(evento) => setEmailLogin(evento.target.value)}
                placeholder="voce@exemplo.com"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="senha-login" className={labelClassName}>
                Senha
              </label>
              <input
                id="senha-login"
                type="password"
                autoComplete="current-password"
                value={senhaLogin}
                onChange={(evento) => setSenhaLogin(evento.target.value)}
                placeholder="Digite sua senha"
                className={inputClassName}
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-lime-300 px-4 py-3.5 font-bold text-[#101310] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Entrando..." : "Entrar na conta"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className={labelClassName}>Tipo de conta</label>
              <div className="grid grid-cols-2 gap-3">
                {(["Pessoa física", "Empresa"] as TipoPessoa[]).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => {
                      setTipoPessoa(tipo);
                      setMensagemErro("");
                    }}
                    className={`rounded-xl border p-3 text-left transition ${
                      tipoPessoa === tipo
                        ? "border-lime-300 bg-lime-300/10"
                        : "border-white/10 bg-[#171b16] hover:border-white/25"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {tipo}
                    </span>
                    <span className="mt-1 block text-xs text-white/45">
                      {tipo === "Empresa"
                        ? "Para negócios"
                        : "Para uso pessoal"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="nome-cadastro" className={labelClassName}>
                {tipoPessoa === "Empresa"
                  ? "Nome do responsável"
                  : "Nome completo"}
              </label>
              <input
                id="nome-cadastro"
                type="text"
                autoComplete="name"
                value={nomeCadastro}
                onChange={(evento) => setNomeCadastro(evento.target.value)}
                placeholder="Como podemos chamar você?"
                className={inputClassName}
                maxLength={150}
                required
              />
            </div>

            {tipoPessoa === "Empresa" && (
              <div>
                <label htmlFor="nome-empresa" className={labelClassName}>
                  Nome da empresa
                </label>
                <input
                  id="nome-empresa"
                  type="text"
                  autoComplete="organization"
                  value={nomeEmpresa}
                  onChange={(evento) => setNomeEmpresa(evento.target.value)}
                  placeholder="Nome do seu negócio"
                  className={inputClassName}
                  maxLength={150}
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="telefone-cadastro" className={labelClassName}>
                Telefone celular
              </label>
              <input
                id="telefone-cadastro"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                value={telefoneCadastro}
                onChange={(evento) =>
                  setTelefoneCadastro(formatarTelefone(evento.target.value))
                }
                placeholder="(81) 99999-9999"
                className={inputClassName}
                maxLength={16}
                required
              />
              <p className="mt-1.5 text-xs text-white/40">
                Inclua o DDD. Não usamos esse campo como senha.
              </p>
            </div>

            <div>
              <label htmlFor="email-cadastro" className={labelClassName}>
                E-mail
              </label>
              <input
                id="email-cadastro"
                type="email"
                autoComplete="email"
                value={emailCadastro}
                onChange={(evento) => setEmailCadastro(evento.target.value)}
                placeholder="voce@exemplo.com"
                className={inputClassName}
                maxLength={254}
                required
              />
            </div>

            <div>
              <label htmlFor="senha-cadastro" className={labelClassName}>
                Senha
              </label>
              <input
                id="senha-cadastro"
                type="password"
                autoComplete="new-password"
                value={senhaCadastro}
                onChange={(evento) => setSenhaCadastro(evento.target.value)}
                placeholder="Mínimo de 8 caracteres"
                className={inputClassName}
                minLength={8}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmar-senha" className={labelClassName}>
                Confirme sua senha
              </label>
              <input
                id="confirmar-senha"
                type="password"
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(evento) => setConfirmarSenha(evento.target.value)}
                placeholder="Digite a senha novamente"
                className={inputClassName}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-lime-300 px-4 py-3.5 font-bold text-[#101310] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Criando sua conta..." : "Criar minha conta"}
            </button>

            <p className="text-center text-xs leading-5 text-white/40">
              Ao continuar, você poderá confirmar seu e-mail para ativar a
              conta.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}

export default ModalAutenticacao;
