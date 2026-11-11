import { createPortal } from "react-dom";

interface Usuario {
    nome: string;
    email: string;
    telefone?: string | null;
    plano: string;
}

interface ModalPerfilProps {
    isOpen: boolean;
    onClose: () => void;
    usuario?: Usuario;
}

function ModalPerfil({
    isOpen,
    onClose,
    usuario,
}: ModalPerfilProps) {
    if (!isOpen) return null;

    const nome = usuario?.nome?.trim() || "Usuário";
    const telefone = usuario?.telefone?.trim() || "";
    const planoOriginal = usuario?.plano?.toLowerCase().trim() || "free";

    const planos: Record<string, string> = {
        free: "Free",
        pro: "Pro",
        premium: "Premium+",
        "premium+": "Premium+",
    };

    const plano = planos[planoOriginal] || planoOriginal;

    const inicial = nome.charAt(0).toUpperCase();

    const planoPremium =
        planoOriginal === "premium" ||
        planoOriginal === "premium+";

    const planoPro = planoOriginal === "pro";

    return createPortal(
        <div
            className="
                fixed inset-0 z-[9999]
                flex items-center justify-center
                overflow-y-auto
                bg-black/70 p-4
                backdrop-blur-sm
            "
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="perfil-titulo"
                className="
                    relative my-auto w-full max-w-md
                    overflow-hidden rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--card)] shadow-2xl
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* CABEÇALHO */}
                <div
                    className="
                        flex items-center justify-between
                        border-b border-[var(--border)]
                        px-6 py-5
                    "
                >
                    <div>
                        <h2
                            id="perfil-titulo"
                            className="text-lg font-bold text-[var(--text)]"
                        >
                            Meu perfil
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Suas informações no Guardix
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar perfil"
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-lg border border-[var(--border)]
                            text-[var(--text-muted)] transition-colors
                            hover:border-[var(--border-2)]
                            hover:text-[var(--text)]
                        "
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    {/* FOTO PROVISÓRIA */}
                    <div className="flex flex-col items-center">
                        <div
                            className="
                                relative flex h-24 w-24
                                items-center justify-center
                                rounded-full border-2 border-indigo-400/40
                                bg-gradient-to-br from-indigo-500 to-purple-600
                                text-3xl font-bold text-white
                                shadow-lg shadow-indigo-500/10
                            "
                        >
                            {inicial}

                            <span
                                className="
                                    absolute bottom-0 right-0
                                    flex h-8 w-8 items-center justify-center
                                    rounded-full border-4 border-[var(--card)]
                                    bg-[var(--surface-2)]
                                    text-xs text-[var(--text-dim)]
                                "
                                aria-label="Foto de perfil indisponível"
                            >
                                <i className="fas fa-camera" />
                            </span>
                        </div>

                        <span className="mt-3 text-xs text-[var(--text-muted)]">
                            Foto de perfil em breve
                        </span>

                        <h3 className="mt-2 text-base font-semibold text-[var(--text)]">
                            {nome}
                        </h3>
                    </div>

                    {/* INFORMAÇÕES DO USUÁRIO */}
                    <div className="space-y-4">
                        {/* NOME */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider
                                    text-[var(--text-muted)]
                                "
                            >
                                Nome
                            </label>

                            <div
                                className="
                                    flex items-center gap-3 rounded-xl
                                    border border-[var(--border)]
                                    bg-[var(--surface-2)]
                                    px-4 py-3
                                "
                            >
                                <i className="fas fa-user w-4 text-center text-indigo-400" />

                                <span className="min-w-0 break-words text-sm text-[var(--text)]">
                                    {nome}
                                </span>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider
                                    text-[var(--text-muted)]
                                "
                            >
                                E-mail
                            </label>

                            <div
                                className="
                                    flex items-center gap-3 rounded-xl
                                    border border-[var(--border)]
                                    bg-[var(--surface-2)]
                                    px-4 py-3
                                "
                            >
                                <i className="fas fa-envelope w-4 text-center text-indigo-400" />

                                <span className="min-w-0 break-all text-sm text-[var(--text)]">
                                    {usuario?.email || "E-mail não informado"}
                                </span>
                            </div>
                        </div>

                        {/* TELEFONE */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider
                                    text-[var(--text-muted)]
                                "
                            >
                                Telefone
                            </label>

                            <div
                                className="
                                    flex items-center gap-3 rounded-xl
                                    border border-[var(--border)]
                                    bg-[var(--surface-2)]
                                    px-4 py-3
                                "
                            >
                                <i className="fas fa-phone w-4 text-center text-indigo-400" />

                                <span
                                    className={`min-w-0 break-words text-sm ${
                                        telefone
                                            ? "text-[var(--text)]"
                                            : "text-[var(--text-muted)]"
                                    }`}
                                >
                                    {telefone || "Telefone não informado"}
                                </span>
                            </div>
                        </div>

                        {/* PLANO ATUAL */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider
                                    text-[var(--text-muted)]
                                "
                            >
                                Plano atual
                            </label>

                            <div
                                className="
                                    flex items-center justify-between gap-3
                                    rounded-xl border border-[var(--border)]
                                    bg-[var(--surface-2)] px-4 py-3
                                "
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <i
                                        className={`fas ${
                                            planoPremium
                                                ? "fa-crown text-amber-400"
                                                : planoPro
                                                    ? "fa-star text-indigo-400"
                                                    : "fa-shield-halved text-[var(--text-muted)]"
                                        } w-4 text-center`}
                                    />

                                    <span className="text-sm font-semibold text-[var(--text)]">
                                        {plano}
                                    </span>
                                </div>

                                <span
                                    className="
                                        shrink-0 rounded-full
                                        border border-[var(--border)]
                                        bg-[var(--hover-bg)] px-2.5 py-1
                                        text-[10px] font-semibold
                                        uppercase tracking-wider
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Atual
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-[var(--text-muted)]">
                                O plano não pode ser alterado nesta tela.
                            </p>
                        </div>
                    </div>

                    {/* FECHAR */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-full rounded-xl bg-indigo-600
                            px-4 py-3 text-sm font-semibold text-white
                            transition-colors hover:bg-indigo-500
                        "
                    >
                        Fechar perfil
                    </button>
                </div>
            </section>
        </div>,
        document.body
    );
}

export default ModalPerfil;
