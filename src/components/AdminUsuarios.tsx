
import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

interface AdminUsuario {
  user_id: string;
  nome: string | null;
  telefone: string | null;
  nome_empresa: string | null;
  email: string;
  tipo_pessoa: string | null;
  plano: string | null;
  email_verified: boolean;
  data_criacao: string | null;
}

interface AdminUsuariosProps {
  onLogout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

function formatarData(valor: string | null): string {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleDateString("pt-BR");
}

export default function AdminUsuarios({ onLogout }: AdminUsuariosProps) {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    setErro("");
    setMensagem("");

    const token = localStorage.getItem("guardix_token");

    if (!token) {
      onLogout();
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/users/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resposta.status === 401) {
        onLogout();
        return;
      }

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível carregar os usuários."
        );
      }

      setUsuarios(dados.users ?? []);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Erro ao carregar usuários."
      );
    } finally {
      setCarregando(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void carregarUsuarios();
  }, [carregarUsuarios]);

  const excluirUsuario = async (usuario: AdminUsuario) => {
    const nome = usuario.nome || usuario.email;

    const confirmado = window.confirm(
      `Tem certeza que deseja excluir a conta de ${nome} (${usuario.email})? Esta ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    const token = localStorage.getItem("guardix_token");

    if (!token) {
      onLogout();
      return;
    }

    setExcluindo(usuario.user_id);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/users/admin/users/${encodeURIComponent(usuario.user_id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resposta.status === 401) {
        onLogout();
        return;
      }

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível excluir o usuário."
        );
      }

      setUsuarios((atuais) =>
        atuais.filter((item) => item.user_id !== usuario.user_id)
      );

      setMensagem("Usuário excluído com sucesso.");
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Erro ao excluir usuário."
      );
    } finally {
      setExcluindo(null);
    }
  };

  const termo = busca.trim().toLowerCase();

  const filtrados = usuarios.filter((usuario) =>
    [
      usuario.nome,
      usuario.email,
      usuario.telefone,
      usuario.nome_empresa,
      usuario.tipo_pessoa,
      usuario.plano,
    ].some((campo) => campo?.toLowerCase().includes(termo))
  );

  const botaoSecundario =
    "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const cartao =
    "rounded-2xl border p-5 shadow-sm transition-colors";

  const textoSecundario = {
    color: "var(--text-dim)",
  };

  return (
    <section
      className="min-h-screen px-4 py-8 transition-colors sm:px-8"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <header
          className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div
              className="mb-2 flex items-center gap-2"
              style={{ color: "var(--success)" }}
            >
              <ShieldCheck size={20} />

              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Área restrita
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Usuários
            </h1>

            <p className="mt-2 text-sm" style={textoSecundario}>
              Gerencie as contas cadastradas no Guardix.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void carregarUsuarios()}
            disabled={carregando}
            className={botaoSecundario}
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
              background: "var(--surface)",
            }}
          >
            <RefreshCw
              size={16}
              className={carregando ? "animate-spin" : ""}
            />
            Atualizar lista
          </button>
        </header>

        {/* Indicadores */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div
            className={cartao}
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={textoSecundario}>
                Contas cadastradas
              </span>

              <Users
                size={20}
                style={{ color: "var(--success)" }}
              />
            </div>

            <p className="mt-3 text-3xl font-bold tabular-nums">
              {usuarios.length}
            </p>
          </div>

          <div
            className={cartao}
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-sm" style={textoSecundario}>
              Resultados da busca
            </p>

            <p className="mt-3 text-3xl font-bold tabular-nums">
              {filtrados.length}
            </p>
          </div>
        </div>

        {/* Pesquisa */}
        <div
          className="mb-4 flex items-center gap-3 rounded-xl border px-4 shadow-sm transition-colors"
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--border)",
          }}
        >
          <Search
            size={18}
            className="shrink-0"
            style={{ color: "var(--text-muted)" }}
          />

          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome, e-mail, telefone ou plano..."
            className="w-full bg-transparent py-3.5 text-sm outline-none"
            style={{
              color: "var(--text)",
            }}
          />

          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--text-dim)" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mensagens */}
        {erro && (
          <div
            role="alert"
            className="mb-4 rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--danger)",
              background: "var(--danger-dim)",
              color: "var(--danger)",
            }}
          >
            {erro}
          </div>
        )}

        {mensagem && (
          <div
            role="status"
            className="mb-4 rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--success)",
              background: "var(--success-dim)",
              color: "var(--success)",
            }}
          >
            {mensagem}
          </div>
        )}

        {/* Tabela de usuários */}
        <div
          className="overflow-hidden rounded-2xl border shadow-sm transition-colors"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead
                className="border-b text-xs uppercase tracking-wider"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-dim)",
                }}
              >
                <tr>
                  <th className="px-5 py-4">Usuário</th>
                  <th className="px-5 py-4">Telefone</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Plano</th>
                  <th className="px-5 py-4">Cadastro</th>
                  <th className="px-5 py-4">E-mail</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center"
                      style={{ color: "var(--text-dim)" }}
                    >
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center"
                      style={{ color: "var(--text-dim)" }}
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((usuario) => (
                    <tr
                      key={usuario.user_id}
                      className="border-b transition-colors last:border-b-0"
                      style={{ borderColor: "var(--border)" }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                          "var(--hover-bg)";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {usuario.nome || "Sem nome"}
                        </p>

                        {usuario.nome_empresa && (
                          <p
                            className="mt-1 text-xs"
                            style={textoSecundario}
                          >
                            {usuario.nome_empresa}
                          </p>
                        )}

                        <p
                          className="mt-1 text-xs"
                          style={textoSecundario}
                        >
                          {usuario.email}
                        </p>
                      </td>

                      <td
                        className="px-5 py-4"
                        style={textoSecundario}
                      >
                        {usuario.telefone || "—"}
                      </td>

                      <td
                        className="px-5 py-4"
                        style={textoSecundario}
                      >
                        {usuario.tipo_pessoa || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="rounded-full border px-2.5 py-1 text-xs"
                          style={{
                            borderColor: "var(--border)",
                            color: "var(--text-dim)",
                          }}
                        >
                          {usuario.plano || "free"}
                        </span>
                      </td>

                      <td
                        className="px-5 py-4"
                        style={textoSecundario}
                      >
                        {formatarData(usuario.data_criacao)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          style={{
                            color: usuario.email_verified
                              ? "var(--success)"
                              : "var(--warn)",
                          }}
                        >
                          {usuario.email_verified
                            ? "Verificado"
                            : "Pendente"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void excluirUsuario(usuario)}
                          disabled={excluindo === usuario.user_id}
                          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          style={{
                            borderColor: "var(--danger)",
                            color: "var(--danger)",
                            background: "transparent",
                          }}
                          aria-label={`Excluir ${usuario.email}`}
                        >
                          <Trash2 size={14} />

                          {excluindo === usuario.user_id
                            ? "Excluindo..."
                            : "Excluir"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p
          className="mt-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Por segurança, a lista não retorna senhas nem hashes de autenticação.
        </p>
      </div>
    </section>
  );
}
