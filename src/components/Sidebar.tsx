interface Usuario {
    nome: string;
    email: string;
    plano: string;
}

interface SidebarProps {
    menuAberto: boolean;
    setMenuAberto: React.Dispatch<React.SetStateAction<boolean>>;
    secaoAtiva: string;
    navegar: (secao: string) => void;
    abrirModalPro: () => void;
    abrirModalReporte: () => void;
    usuario?: Usuario;
}

function Sidebar({
    menuAberto,
    setMenuAberto,
    secaoAtiva,
    navegar,
    abrirModalReporte,
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
        text-slate-500
        transition-all duration-200
        hover:bg-slate-800
        hover:text-slate-200
    `;

    const itemAtivo = `
        bg-indigo-500/10
        border border-indigo-500/25
        text-indigo-400
    `;

    return (
        <aside
            className={`
                fixed left-0 top-0 z-[1000]
                flex h-dvh w-[260px]
                flex-col
                border-r border-slate-800
                bg-slate-950
                transition-transform duration-200 ease-in-out
                md:sticky md:top-0
                md:translate-x-0
                ${menuAberto ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]" : "-translate-x-[280px]"}
            `}
        >
            {/* HEADER */}
            <div className="shrink-0 border-b border-slate-800 px-5 pb-4 pt-6">
                <button
                    type="button"
                    onClick={alternarMenu}
                    className="mb-2 ml-auto flex cursor-pointer border-0 bg-transparent text-lg text-slate-500 transition-colors hover:text-slate-200 md:hidden"
                    aria-label="Fechar menu"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-sm text-indigo-400">
                        <i className="fas fa-shield-halved"></i>
                    </div>
                    <span className="font-mono text-base font-bold tracking-[0.08em] text-slate-200">
                        GUARDIX
                    </span>
                </div>
            </div>

            {/* NAVEGAÇÃO */}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
                <p className="px-2 py-2 pb-1 font-mono text-[0.65rem] font-bold tracking-[0.12em] text-slate-700">
                    PAINEL
                </p>

                <a
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
                    href="#"
                    className={itemBase}
                    onClick={(e) => {
                        e.preventDefault();
                        abrirModalReporte();
                    }}
                >
                    <i className="fas fa-triangle-exclamation w-4 text-center"></i>
                    <span>Denunciar Golpe</span>
                </a>
            
            <a
                href="#"
                className={`${itemBase} ${secaoAtiva === "planos" ? itemAtivo : ""}`}
                onClick={(e) => {
                    e.preventDefault();
                    navegar("planos");
                }}
            >
                <i className="fas fa-star"></i>
                <span>Acessar Planos</span>
            </a>
         </nav>
         
            {/* RODAPÉ DO USUÁRIO */}
            <div className="shrink-0 flex items-center gap-3 border-t border-slate-800 px-3 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 font-mono text-xs font-bold text-white">
                        {inicialAvatar}
                    </div>

                    <div className="min-w-0">
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-slate-200" title={nomeExibido}>
                            {nomeExibido}
                        </p>
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[0.7rem] text-slate-500">
                            {planoExibido}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={fazerLogout}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-transparent text-slate-500 transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5"
                    title="Sair"
                    aria-label="Sair"
                >
                    <i className="fas fa-right-from-bracket"></i>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
