import { type FormEvent, useState, useEffect } from "react";

interface VerificadorProps {
    consultasRealizadas: number;
    limiteCota: number;
    onAbrirModalPro: () => void;
    onReportarAmeaca: () => void;
    onLogout: () => void;
}

export const FRAUD_MESSAGES: Record<string, { titulo: string; descricao: string; cor: string }> = {
    CHECK_TYPOSQUATTING: {
        titulo: "Tentativa de Typosquatting",
        descricao: "O endereço imita o nome de uma marca oficial conhecida para enganar usuários.",
        cor: "#ef4444"
    },
    CHECK_DOMAIN_STRUCTURE: {
        titulo: "Estrutura de Domínio Suspeita",
        descricao: "Uso de extensão de domínio de alto risco ou padrão anômalo.",
        cor: "#f97316"
    },
    CHECK_DOMAIN_AGE: {
        titulo: "Domínio Recém-Criado",
        descricao: "O site foi registrado há muito poucos dias, o que é comum em golpes temporários.",
        cor: "#ef4444"
    }
};

// Função auxiliar para mascarar o telefone (DD) 9XXXX-XXXX
const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2")
        .slice(0, 15);
};

function Verificador({
    consultasRealizadas,
    limiteCota,
    onAbrirModalPro,
    onReportarAmeaca,
    onLogout,
}: VerificadorProps) {
    const [link, setLink] = useState("");
    const [telefone, setTelefone] = useState("");
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [resultado, setResultado] = useState<any>(null);
    const [erro, setErro] = useState("");

    // Gerencia a criação e limpeza da URL de preview da imagem
    useEffect(() => {
        if (!arquivo) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(arquivo);
        setPreviewUrl(objectUrl);

        // Cleanup da memória ao desmontar ou alterar o arquivo
        return () => URL.revokeObjectURL(objectUrl);
    }, [arquivo]);

    const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setArquivo(file);
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = maskPhone(e.target.value);
        setTelefone(formatted);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (consultasRealizadas >= limiteCota) {
            onAbrirModalPro();
            return;
        }

        if (!link && !telefone && !arquivo) {
            setErro("Preencha ao menos um campo.");
            return;
        }

        setErro("");
        setResultado(null);
        setCarregando(true);

        const token = localStorage.getItem("guardix_token");

        // Validação local prévia
        if (!token) {
            setErro("Sessão expirada ou não autenticada. Faça login novamente.");
            setCarregando(false);
            return;
        }

        try {
            let response: Response;
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (arquivo) {
                const formData = new FormData();
                formData.append("imagem", arquivo);

                response = await fetch("http://localhost:10000/api/print", {
                    method: "POST",
                    headers,
                    body: formData,
                });
            } else if (link) {
                response = await fetch("http://localhost:10000/api/link", {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: link }),
                });
            } else {
                response = await fetch("http://localhost:10000/api/phone", {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ numero: telefone }),
                });
            }

            // Tenta fazer o parse do JSON enviado pela API (mesmo para códigos de erro HTTP)
            const data = await response.json().catch(() => null);

            // Trata erro 401: Token Inválido / Expirado
            if (response.status === 401) {
                onLogout();
                throw new Error(data?.error || data?.mensagem || "Sessão expirada. Faça login novamente.");
            }

            // Trata erro 403: Cota do Plano Atingida
            if (response.status === 403) {
                onAbrirModalPro(); // Abre o modal de upgrade automaticamente
                throw new Error(data?.error || data?.mensagem || "Limite de consultas diárias atingido.");
            }

            if (!response.ok) {
                throw new Error(data?.error || data?.mensagem || `Erro no servidor (${response.status})`);
            }

            setResultado(data);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao realizar análise."
            );
        } finally {
            setCarregando(false);
        }
    };

    const rawScore = resultado?.score ?? 0;
    const score = Math.min(rawScore, 100);
    const isPerigo = rawScore >= 60;
    const isAltaAmeaca = rawScore >= 100;

    const pontosAtencao = resultado?.regrasVioladas?.map((regraObj: any) => {
        const config = FRAUD_MESSAGES[regraObj.regra];

        if (config) {
            return {
                texto: `${config.titulo}: ${config.descricao}`,
                cor: config.cor
            };
        }

        return {
            texto: regraObj.mensagem || "Padrão suspeito detectado nos dados analisados.",
            cor: "#eab308"
        };
    }) || [];

    const comprimentoMaximo = 267;
    const dashOffsetCalculado = comprimentoMaximo - (comprimentoMaximo * score) / 100;

    return (
        <section id="secao-verificador" className="content-section active">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Verificador</h1>
                    <p className="page-subtitle">Analise ameaças em segundos</p>
                </div>
            </div>

            <div className="tool-card">
                <form id="form-analise-interna" onSubmit={handleSubmit}>
                    <div className="input-grid">
                        <div className="field-group">
                            <label className="field-label">
                                <i className="fas fa-link"></i> Link Suspeito
                            </label>
                            <input
                                type="text"
                                id="input-url"
                                className="field-input"
                                placeholder="https://site-duvidoso.com"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>

                        {/* TELEFONE */}
                        <div className="field-group">
                            <label className="field-label">
                                <i className="fas fa-phone"></i> Telefone / WhatsApp
                            </label>
                            <input
                                type="tel"
                                id="input-tel"
                                className="field-input"
                                placeholder="(00) 00000-0000"
                                value={telefone}
                                onChange={handleTelefoneChange}
                                maxLength={15}
                            />
                        </div>
                    </div>

                    <div className="upload-zone" id="upload-zone">
                        <input
                            type="file"
                            id="arquivo-print"
                            hidden
                            accept="image/*"
                            onChange={handleArquivo}
                        />
                        <label htmlFor="arquivo-print" className="upload-label" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {previewUrl ? (
                                <div style={{ marginBottom: "10px", textAlign: "center" }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview do print"
                                        style={{ maxHeight: "100px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain", border: "1px solid var(--accent, #3b82f6)" }}
                                    />
                                    <p style={{ fontSize: "0.85rem", marginTop: "4px", color: "var(--text-muted)" }}>Clique para trocar a imagem</p>
                                </div>
                            ) : (
                                <>
                                    <div className="upload-icon">
                                        <i className="fas fa-cloud-arrow-up"></i>
                                    </div>
                                    <p>
                                        Arraste ou clique para anexar{" "}
                                        <strong>Print do Comprovante</strong>
                                    </p>
                                </>
                            )}
                            <span id="nome-doc" className="upload-filename">
                                {arquivo ? arquivo.name : "Nenhum arquivo selecionado"}
                            </span>
                        </label>
                    </div>

                    {erro && (
                        <div style={{ color: "var(--danger)", marginTop: "1rem" }}>
                            {erro}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-analyze"
                        id="btn-analisar"
                        disabled={carregando}
                    >
                        <i className="fas fa-shield-check"></i>
                        <span>{carregando ? "Analisando..." : "Verificar Agora"}</span>
                    </button>
                </form>

                {(carregando || resultado) && (
                    <div id="resultado-analise">
                        {/* LOADING */}
                        {carregando && (
                            <div className="loading-container" id="loading-container">
                                <div className="scan-animation">
                                    <div className="scan-ring"></div>
                                    <div className="scan-ring"></div>
                                    <div className="scan-ring"></div>
                                    <i className="fas fa-shield-halved scan-icon"></i>
                                </div>
                                <p className="scan-text">Escaneando base de dados...</p>
                                <div className="scan-steps" id="scan-steps">
                                    <span className="step active">Verificando URL</span>
                                    <span className="step">Cruzando banco de dados</span>
                                    <span className="step">Analisando padrões</span>
                                </div>
                            </div>
                        )}

                        {!carregando && resultado && (
                            <div id="veredito">
                                <div className="result-layout">
                                    <div className="gauge-container">
                                        <svg className="gauge-svg" viewBox="0 0 200 120">
                                            <defs>
                                                <linearGradient id="gaugeGradientSafe" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#22c55e" />
                                                    <stop offset="100%" stopColor="#86efac" />
                                                </linearGradient>
                                                <linearGradient id="gaugeGradientDanger" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#f97316" />
                                                    <stop offset="100%" stopColor="#ef4444" />
                                                </linearGradient>
                                            </defs>

                                            <path
                                                d="M 15 105 A 85 85 0 0 1 185 105"
                                                fill="none"
                                                stroke="#1e2d4a"
                                                strokeWidth="14"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                id="gauge-fill"
                                                d="M 15 105 A 85 85 0 0 1 185 105"
                                                fill="none"
                                                stroke={isPerigo ? "url(#gaugeGradientDanger)" : "url(#gaugeGradientSafe)"}
                                                strokeWidth="14"
                                                strokeLinecap="round"
                                                strokeDasharray={comprimentoMaximo}
                                                strokeDashoffset={dashOffsetCalculado}
                                                style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                                            />
                                            <text x="12" y="118" fill="#475569" fontSize="10" fontFamily="Space Mono">0</text>
                                            <text x="88" y="28" fill="#475569" fontSize="10" fontFamily="Space Mono" textAnchor="middle">50</text>
                                            <text x="182" y="118" fill="#475569" fontSize="10" fontFamily="Space Mono">100</text>
                                        </svg>

                                        <div className="gauge-score-display">
                                            <span className="gauge-number">{score}</span>
                                            <span className="gauge-unit">/ 100</span>
                                            <p
                                                className="gauge-label"
                                                style={{
                                                    color: isPerigo ? "var(--danger)" : "var(--success)",
                                                }}
                                            >
                                                {isAltaAmeaca ? "RISCO CRÍTICO" : isPerigo ? "ALTO RISCO" : "SEGURO"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="result-details">
                                        <div
                                            className="result-header"
                                            style={{
                                                color: isPerigo ? "var(--danger)" : "var(--success)",
                                            }}
                                        >
                                            <i className={`fas ${isPerigo ? "fa-triangle-exclamation" : "fa-circle-check"}`}></i>
                                            <h2>{resultado.classificacao || (isAltaAmeaca ? "Risco Crítico" : isPerigo ? "Alto Risco" : "Seguro")}</h2>
                                        </div>

                                        {resultado.conclusao && (
                                            <div className="attention-points">
                                                <p className="attention-title">
                                                    <i className="fas fa-list-check"></i> Recomendação
                                                </p>
                                                <ul className="attention-list">
                                                    <li style={{ marginBottom: "6px" }}>
                                                        <i
                                                            className="fas fa-circle-dot"
                                                            style={{
                                                                color: isPerigo ? "var(--danger)" : "var(--success)",
                                                                marginRight: "8px",
                                                            }}
                                                        ></i>
                                                        {resultado.conclusao}
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                        {resultado.analiseDetalhadaIa && (
                                            <div className="attention-points">
                                                <p className="attention-title">
                                                    <i className="fas fa-file-lines"></i> Análise detalhada
                                                </p>

                                                <div
                                                    style={{
                                                        whiteSpace: "pre-line",
                                                        lineHeight: "1.6",
                                                        color: "var(--text-muted)",
                                                        padding: "4px 0",
                                                    }}
                                                >
                                                    {resultado.analiseDetalhadaIa}
                                                </div>
                                            </div>
                                        )}

                                        {resultado.regrasVioladas && resultado.regrasVioladas.length > 0 && (
                                            <div className="attention-points">
                                                <p className="attention-title">
                                                    <i className="fas fa-terminal"></i> Logs Técnicos da Análise
                                                </p>
                                                <ul className="attention-list" style={{ fontFamily: "Space Mono, monospace", fontSize: "0.8rem" }}>
                                                    {resultado.regrasVioladas.map((regra: { regra: string; mensagem: string }, index: number) => (
                                                        <li key={index} style={{ marginBottom: "6px", wordBreak: "break-all" }}>
                                                            <i
                                                                className="fas fa-circle-dot"
                                                                style={{
                                                                    color: "var(--accent)",
                                                                    marginRight: "8px",
                                                                    fontSize: "0.5rem",
                                                                    verticalAlign: "middle"
                                                                }}
                                                            ></i>
                                                            <span>[{regra.regra}]: {regra.mensagem}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {pontosAtencao.length > 0 && (
                                            <div id="pontos-atencao" className="attention-points">
                                                <p className="attention-title">
                                                    <i className="fas fa-list-check"></i> Pontos de Atenção
                                                </p>
                                                <ul className="attention-list">
                                                    {pontosAtencao.map((ponto: { texto: string; cor: string }, index: number) => (
                                                        <li key={index} style={{ marginBottom: "6px" }}>
                                                            <i
                                                                className="fas fa-circle-dot"
                                                                style={{
                                                                    color: ponto.cor,
                                                                    marginRight: "8px",
                                                                }}
                                                            ></i>
                                                            {ponto.texto}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="result-actions">
                                            {isPerigo && (
                                                <button
                                                    id="btn-reportar"
                                                    className="btn-report"
                                                    onClick={onReportarAmeaca}
                                                >
                                                    <i className="fas fa-flag"></i>
                                                    Reportar Ameaça
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Verificador;