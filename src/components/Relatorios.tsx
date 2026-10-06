import { useState, useEffect } from "react";
import { ModalPro } from "./ModalPro";

interface EstatisticasUsuario {
  total_consultas: number | string;
  ameacas_evitadas: number | string;
  analises_seguras: number | string;
  total_reportados: number | string;
}

interface RelatoriosProps {
  apiUrl?: string;
  onUpgradePro?: () => void;
  onLogout?: () => void;
}

interface RelatorioPremium {
  evolucao: {
    data: string;
    total: number | string;
  }[];

  distribuicao_risco: {
    risco: "alto" | "medio" | "baixo";
    total: number | string;
  }[];

  tipos_analise: {
    tipo_consulta: string;
    total: number | string;
  }[];
}

function Relatorios({
  apiUrl = "http://localhost:10000/stats/estatisticas",
  onUpgradePro,
  onLogout,
}: RelatoriosProps) {

  const [stats, setStats] = useState<EstatisticasUsuario>({
    total_consultas: "—",
    ameacas_evitadas: "—",
    analises_seguras: "—",
    total_reportados: "—",
  });

  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [relatorioPremium, setRelatorioPremium] =
    useState<RelatorioPremium | null>(null);

  const [carregandoPremium, setCarregandoPremium] =
    useState<boolean>(true);

  const [erroPremium, setErroPremium] =
    useState<string | null>(null)

  const [modalProAberto, setModalProAberto] = useState<boolean>(false);

  useEffect(() => {
    const buscarEstatisticas = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const token = localStorage.getItem("guardix_token");

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.status === 401) {
    onLogout?.();
    return;
}

if (response.status === 403) {
    setRelatorioPremium(null);
    return;
}

        if (!response.ok) {
          throw new Error(
            "Erro ao carregar as estatísticas de segurança."
          );
        }

        const data = await response.json();

        setStats({
          total_consultas: data.total_consultas ?? 0,
          ameacas_evitadas: data.ameacas_evitadas ?? 0,
          analises_seguras: data.analises_seguras ?? 0,
          total_reportados: data.total_reportados ?? 0,
        });
      } catch (err: any) {
        setErro(
          err.message ||
          "Erro desconhecido ao carregar suas estatísticas."
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarEstatisticas();
  }, [apiUrl]);

  useEffect(() => {
    const buscarRelatorioPremium = async () => {
      setCarregandoPremium(true);
      setErroPremium(null);

      try {
        const token = localStorage.getItem("guardix_token");

        const response = await fetch(
          "http://localhost:10000/stats/relatorio",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

      if (response.status === 403) {
  setRelatorioPremium(null);
  return;
}

if (!response.ok) {
  throw new Error(
    "Não foi possível carregar o relatório avançado."
  );
}
        const data = await response.json();

        setRelatorioPremium(data);
      } catch (err: any) {
        setErroPremium(
          err.message ||
          "Erro ao carregar o relatório avançado."
        );
      } finally {
        setCarregandoPremium(false);
      }
    };

    buscarRelatorioPremium();
  }, []);

  const totalConsultas = Number(stats.total_consultas) || 0;
  const ameacasIdentificadas = Number(stats.ameacas_evitadas) || 0;
  const analisesSeguras = Number(stats.analises_seguras) || 0;
  const denuncias = Number(stats.total_reportados) || 0;

const temAcessoPremium =
  !carregandoPremium && relatorioPremium !== null;

  const handleIrParaPlanos = () => {
    setModalProAberto(false);
    if (onUpgradePro) {
      onUpgradePro();
    }
  };

  return (
    <section className="content-section">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <i className="fas fa-shield-halved text-indigo-500" />
            Minha Segurança
          </h1>

          <p className="page-subtitle">
            Acompanhe sua atividade e seus resultados no Guardix.
          </p>
        </div>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-800/50 bg-red-950/40 p-4 text-sm text-red-400">
          <i className="fas fa-circle-exclamation text-red-500" />
          <span>{erro}</span>
        </div>
      )}

      {/* INDICADORES */}
      <div className="stats-grid">
        {/* ANÁLISES */}
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <i className="fas fa-magnifying-glass" />
          </div>

          <div className="stat-info">
            <p className="stat-label">Análises realizadas</p>

            <p className="stat-value">
              {carregando ? "..." : totalConsultas}
            </p>
          </div>
        </div>

        {/* AMEAÇAS */}
        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <i className="fas fa-triangle-exclamation" />
          </div>

          <div className="stat-info">
            <p className="stat-label">Ameaças identificadas</p>

            <p className="stat-value">
              {carregando ? "..." : ameacasIdentificadas}
            </p>
          </div>
        </div>

        {/* SEGURAS */}
        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <i className="fas fa-shield-check" />
          </div>

          <div className="stat-info">
            <p className="stat-label">Análises seguras</p>

            <p className="stat-value">
              {carregando ? "..." : analisesSeguras}
            </p>
          </div>
        </div>

        {/* DENÚNCIAS */}
        <div className="stat-card">
          <div className="stat-icon stat-icon-yellow">
            <i className="fas fa-flag" />
          </div>

          <div className="stat-info">
            <p className="stat-label">Denúncias realizadas</p>

            <p className="stat-value">
              {carregando ? "..." : denuncias}
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        {/* RESUMO DAS ANÁLISES */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Suas análises
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Distribuição dos resultados das suas verificações.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <i className="fas fa-chart-pie" />
            </div>
          </div>

          {/* SEGURAS */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="text-sm text-slate-300">
                  Análises seguras
                </span>
              </div>

              <strong className="text-sm text-slate-200">
                {carregando ? "..." : analisesSeguras}
              </strong>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width:
                    totalConsultas > 0
                      ? `${Math.min(
                        (analisesSeguras / totalConsultas) * 100,
                        100
                      )}%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* AMEAÇAS */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                <span className="text-sm text-slate-300">
                  Ameaças identificadas
                </span>
              </div>

              <strong className="text-sm text-slate-200">
                {carregando ? "..." : ameacasIdentificadas}
              </strong>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width:
                    totalConsultas > 0
                      ? `${Math.min(
                        (ameacasIdentificadas / totalConsultas) * 100,
                        100
                      )}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>

        {/* RESUMO DE SEGURANÇA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-3">


                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Contribuições
                  </p>

                  <p className="text-xs text-slate-500">
                    Ameaças enviadas à comunidade
                  </p>
                </div>
              </div>

              <strong className="text-lg text-slate-100">
                {carregando ? "..." : denuncias}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* PRÉVIA DO RELATÓRIO PRO */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/80 to-slate-900/80 p-6 shadow-lg">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="fas fa-chart-line" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Relatório detalhado
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Descubra padrões nas suas análises de segurança.
                </p>
              </div>
            </div>
          </div>

          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            PRO
          </span>
        </div>

        {/* PRÉVIA DOS DADOS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* EVOLUÇÃO */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <i className="fas fa-chart-line text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">
                Evolução
              </span>
            </div>

            <div className="flex h-20 items-end gap-2">
              {carregandoPremium ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-slate-500">
                    Carregando...
                  </span>
                </div>
              ) : relatorioPremium?.evolucao.length ? (
                relatorioPremium.evolucao.map((item) => {
                  const total = Number(item.total) || 0;

                  const maiorTotal = Math.max(
                    ...relatorioPremium.evolucao.map(
                      (item) => Number(item.total) || 0
                    ),
                    1
                  );

                  const altura = Math.max(
                    (total / maiorTotal) * 80,
                    8
                  );

                  return (
                    <div
                      key={item.data}
                      className="flex flex-1 flex-col items-center justify-end gap-1"
                    >
                      <span className="text-[10px] text-slate-500">
                        {total}
                      </span>

                      <div
                        className="w-full rounded-t bg-indigo-500/50"
                        style={{
                          height: `${altura}px`,
                        }}
                        title={`${item.data}: ${total} análises`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-slate-500">
                    Nenhum dado disponível.
                  </span>
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Análises realizadas ao longo do tempo
            </p>
          </div>

          {/* DISTRIBUIÇÃO DE RISCO */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <i className="fas fa-chart-pie text-yellow-400" />
              <span className="text-sm font-medium text-slate-200">
                Distribuição de risco
              </span>
            </div>

            <div className="space-y-3">
  {carregandoPremium ? (
    <div className="flex h-24 items-center justify-center">
      <span className="text-xs text-slate-500">
        Carregando...
      </span>
    </div>
  ) : relatorioPremium?.distribuicao_risco.length ? (
    relatorioPremium.distribuicao_risco.map((item) => {
      const total = Number(item.total) || 0;

      const totalRiscos = relatorioPremium.distribuicao_risco.reduce(
        (soma, item) => soma + (Number(item.total) || 0),
        0
      );

      const percentual =
        totalRiscos > 0
          ? (total / totalRiscos) * 100
          : 0;

      const configuracao = {
        baixo: {
          label: "Baixo risco",
          classe: "bg-green-500/50",
        },
        medio: {
          label: "Médio risco",
          classe: "bg-yellow-500/50",
        },
        alto: {
          label: "Alto risco",
          classe: "bg-red-500/50",
        },
      }[item.risco];

      return (
        <div key={item.risco}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">
              {configuracao.label}
            </span>

            <span className="text-slate-500">
              {total}
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${configuracao.classe}`}
              style={{
                width: `${percentual}%`,
              }}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div className="flex h-24 items-center justify-center">
      <span className="text-xs text-slate-500">
        Nenhum dado disponível.
      </span>
    </div>
  )}
</div>
          </div>

          {/* PADRÕES */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <i className="fas fa-magnifying-glass-chart text-red-400" />
              <span className="text-sm font-medium text-slate-200">
                Tipos de análise
              </span>
            </div>

            <div className="space-y-3">
  {carregandoPremium ? (
    <div className="flex h-24 items-center justify-center">
      <span className="text-xs text-slate-500">
        Carregando...
      </span>
    </div>
  ) : relatorioPremium?.tipos_analise.length ? (
    relatorioPremium.tipos_analise.map((item) => {
      const total = Number(item.total) || 0;

      const totalAnalises =
        relatorioPremium.tipos_analise.reduce(
          (soma, item) => soma + (Number(item.total) || 0),
          0
        );

      const percentual =
        totalAnalises > 0
          ? (total / totalAnalises) * 100
          : 0;

      const label =
        item.tipo_consulta === "link"
          ? "Links"
          : item.tipo_consulta === "telefone"
            ? "Telefones"
            : item.tipo_consulta;

      return (
        <div key={item.tipo_consulta}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">
              {label}
            </span>

            <span className="text-slate-500">
              {total}
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500/50"
              style={{
                width: `${percentual}%`,
              }}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div className="flex h-24 items-center justify-center">
      <span className="text-xs text-slate-500">
        Nenhum dado disponível.
      </span>
    </div>
  )}
</div>
          </div>
        </div>

        {/* BLOQUEIO */}
        {!carregandoPremium && !temAcessoPremium && (
  <div className="mt-6 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-5 text-center">
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
      <i className="fas fa-lock" />
    </div>

    <h3 className="mt-3 text-sm font-semibold text-slate-200">
      Relatório completo disponível no Plano Premium
    </h3>

    <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-500">
      Tenha acesso à evolução das suas análises, distribuição de riscos,
      tipos de análise e histórico detalhado das suas verificações.
    </p>

    <button
      type="button"
      className="btn-outline-indigo mt-4"
      onClick={() => setModalProAberto(true)}
    >
      Conhecer o Plano Premium
      <i className="fas fa-arrow-right ml-2" />
    </button>
  </div>
)}
      </div>

      {/* MODAL PRO */}
      {modalProAberto && (
        <ModalPro
          onClose={() => setModalProAberto(false)}
          onNavigateToPlanos={handleIrParaPlanos}
        />
      )}
    </section>
  );
}

export default Relatorios;