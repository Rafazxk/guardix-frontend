interface Usuario {
    nome: string;
    email: string;
    telefone?: string;
    plano: string;
    is_admin?: boolean;
}

interface SidebarProps {
    menuAberto: boolean;
    setMenuAberto: React.Dispatch<React.SetStateAction<boolean>>;
    secaoAtiva: string;
    navegar: (secao: string) => void;
    abrirModalPro: () => void;
    abrirModalReporte: () => void;
    abrirModalPerfil: () => void;
    usuario?: Usuario;
    abrirModalConfiguracoes: () => void;
    abrirTutorial: () => void;
}

function Sidebar({
    menuAberto,
    setMenuAberto,
    secaoAtiva,
    navegar,
    abrirModalReporte,
    abrirModalPerfil,
    abrirModalConfiguracoes,
    abrirTutorial,
    usuario,
}: SidebarProps) {


    const alternarMenu = () => {
        setMenuAberto((prev) => !prev);
    };

    const fazerLogout = () => {
        localStorage.removeItem("guardix_token");
        localStorage.removeItem("guardix_user");
        window.location.reload();
    };

    // Fallback caso os dados do usuário ainda não tenham carregado
    const nomeExibido = usuario?.nome || "Usuario";
    const planoExibido = usuario?.plano || "Plano Free";
    const inicialAvatar = nomeExibido.charAt(0).toUpperCase();

    const itemBase = `
    flex items-center gap-3
    rounded-lg
    px-3 py-2.5
    text-sm font-medium
    text-[var(--sidebar-text)]
    transition-all duration-200
    hover:bg-[var(--sidebar-hover)]
    hover:text-[var(--sidebar-text-strong)]
`;

    const itemAtivo = `
        bg-indigo-500/10
        border border-indigo-500/25
        text-indigo-400
    `;

    return (
        <>

          {menuAberto && (
            <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setMenuAberto(false)}
                className="
                    fixed inset-0 z-[990]
                    bg-black/60
                    backdrop-blur-[2px]
                    md:hidden
                "
            />
        )}

        <aside
            className={`
                fixed left-0 top-0 z-[1000]
                flex h-dvh w-[260px]
                flex-col
                border-r border-[var(--border)]
                bg-[var(--sidebar-bg)]
                transition-transform duration-200 ease-in-out
                md:sticky md:top-0
                md:translate-x-0
                ${menuAberto ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]" : "-translate-x-[280px]"}
            `}
        >
            {/* HEADER */}
            <div className="shrink-0 border-b border-[var(--border)] px-5 pb-4 pt-6">
                <button
                    type="button"
                    onClick={alternarMenu}
                    className="mb-2 ml-auto flex cursor-pointer border-0 bg-transparent text-lg text-slate-500 transition-colors hover:text-[var(--sidebar-text-strong)] md:hidden"
                    aria-label="Fechar menu"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-sm text-indigo-400">
                        <i className="fas fa-shield-halved"></i>
                    </div>
                    <span className="font-mono text-base font-bold tracking-[0.08em] text-[var(--sidebar-text-strong)]">
                        GUARDIX
                    </span>
                </div>
            </div>

                
            {/* NAVEGAÇÃO */}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
                <p className="px-2 py-2 pb-1 font-mono text-[0.65rem] font-bold tracking-[0.12em] text-[var(--sidebar-muted)]">
                    PAINEL
                </p>

                <a  
                    id="tutorial-verificador"
                    href="#"
                    className={`${itemBase} ${secaoAtiva === "verificador" ? itemAtivo : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("verificador");
                    }}
                >
                    <i className="fas fa-shield-halved w-4 text-center"></i>
                    <span>Verificador</span>
                </a>

                <a
                    id="secao-historico"
                    href="#"
                    className={`${itemBase} ${secaoAtiva === "historico" ? itemAtivo : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("historico");
                    }}
                >
                    <i className="fas fa-clock-rotate-left w-4 text-center"></i>
                    <span>Histórico</span>
                </a>

                <a
                    id="feed-golpes"
                    href="#"
                    className={`${itemBase} ${secaoAtiva === "feed" ? itemAtivo : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("feed");
                    }}
                >
                    <i className="fas fa-tower-broadcast w-4 text-center"></i>
                    <span>Feed de Golpes</span>

                    <span className="ml-auto rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-red-500">
                        LIVE
                    </span>
                </a>

                <a
                    id="secao-relatorios"
                    href="#"
                    className={`${itemBase} ${secaoAtiva === "relatorios" ? itemAtivo : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("relatorios");
                    }}
                >
                    <i className="fas fa-chart-column w-4 text-center"></i>
                    <span>Relatórios</span>
                </a>

                <a
                    id="tutorial-denunciar"
                    href="#"
                    className={itemBase}
                    onClick={(e) => {
                        e.preventDefault();
                        abrirModalReporte();

                        if (window.innerWidth < 768) {
                            setMenuAberto(false);
                        }
                    }}
                >
                    <i className="fas fa-triangle-exclamation w-4 text-center"></i>
                    <span>Denunciar Golpe</span>
                </a>

                <a  
                    id="tutorial-planos"
                    href="#"
                    className={`${itemBase} ${secaoAtiva === "planos" ? itemAtivo : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("planos");

                        if (window.innerWidth < 768) {
                            setMenuAberto(false);
                        }
                    }}
                >
                    <i className="fas fa-star"></i>
                    <span>Acessar Planos</span>
                </a>
                {usuario?.is_admin && (
                    <a
                        href="#"
                        className={`${itemBase} ${secaoAtiva === "admin-usuarios" ? itemAtivo : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navegar("admin-usuarios");

                            if (window.innerWidth < 768) {
                                setMenuAberto(false);
                            }
                        }}
                    >
                        <i className="fas fa-user-shield w-4 text-center"></i>
                        <span>Administração</span>
                    </a>


                )}

                <a  
                    id="tutorial-configuracoes"
                    href="#"
                    className={itemBase}
                    onClick={(e) => {
                        e.preventDefault();
                        abrirModalConfiguracoes();

                        if (window.innerWidth < 768) {
                            setMenuAberto(false);
                        }
                    }}
                >
                    <i className="fas fa-gear w-4 text-center" />
                    <span>Configurações</span>
                </a>
            </nav>

{/* AJUDA E TUTORIAL */}
<div className="shrink-0 border-t border-[var(--border)] px-3 py-3">
    <button
        id="botao-ajuda-tutorial"
        type="button"
        onClick={abrirTutorial}
        className="
            group flex w-full items-center gap-3
            rounded-xl border border-indigo-500/20
            bg-indigo-500/5 p-3 text-left
            transition-all duration-200
            hover:border-indigo-500/40
            hover:bg-indigo-500/10
        "
    >
        <div className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-lg bg-indigo-500/10 text-indigo-400
        ">
            <i className="fas fa-circle-question text-lg" />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--sidebar-text-strong)]">
                Precisa de ajuda?
            </p>

            <p className="mt-0.5 text-xs text-[var(--sidebar-muted)]">
                Acesse o tutorial do Guardix
            </p>
        </div>

        <i className="fas fa-chevron-right text-xs text-[var(--sidebar-muted)]" />
    </button>
</div>

            {/* RODAPÉ DO USUÁRIO */}
            <div className="shrink-0 flex items-center gap-3 border-t border-[var(--border)] px-3 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button 
                    id="tutorial-perfil"
                    type="button"
                    onClick={abrirModalPerfil}
                    className="
        flex min-w-0 flex-1 items-center gap-2.5
        rounded-xl p-2 text-left
        transition-colors
        hover:bg-[var(--sidebar-hover)]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500
    "
                    aria-label="Abrir meu perfil"
                    title="Ver perfil"
                >
                    <div className="
        flex h-10 w-10 shrink-0 items-center justify-center
        rounded-full border border-indigo-400/30
        bg-gradient-to-br from-indigo-500 to-purple-600
        font-mono text-sm font-bold text-white
    ">
                        {inicialAvatar}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="
                overflow-hidden text-ellipsis whitespace-nowrap
                text-sm font-semibold text-[var(--sidebar-text-strong)]
            "
                            title={nomeExibido}
                        >
                            {nomeExibido}
                        </p>

                        <span className="
            block overflow-hidden text-ellipsis whitespace-nowrap
            text-[0.7rem] text-[var(--sidebar-text)]
        ">
                            {planoExibido}
                        </span>

                        <span className="
            mt-0.5 block text-[0.65rem] text-indigo-400
        ">
                            Ver meu perfil
                        </span>
                    </div>

                    <i className="fas fa-chevron-right shrink-0 text-xs text-[var(--sidebar-muted)]" />
                </button>

                <button
                    type="button"
                    onClick={fazerLogout}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--sidebar-text)] transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5"
                    title="Sair"
                    aria-label="Sair"
                >
                    <i className="fas fa-right-from-bracket"></i>
                </button>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;
