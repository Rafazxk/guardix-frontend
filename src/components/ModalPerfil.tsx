import { createPortal } from "react-dom";

interface Usuario {
    nome: string;
    email: string;
    telefone?: string;
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

    const nome = usuario?.nome || "Usuário";
    const telefone = usuario?.telefone || "";
    const planoOriginal = usuario?.plano?.toLowerCase() || "free";

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
                    border border-slate-700
                    bg-slate-950 shadow-2xl
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div
                    className="
                        flex items-center justify-between
                        border-b border-slate-800
                        px-6 py-5
                    "
                >
                    <div>
                        <h2
                            id="perfil-titulo"
                            className="text-lg font-bold text-white"
                        >
                            Meu perfil
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Suas informações no Guardix
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar perfil"
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-lg border border-slate-700
                            text-slate-400 transition-colors
                            hover:border-slate-500 hover:text-white
                        "
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    {/* Foto provisória */}
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
                                    rounded-full border-4 border-slate-950
                                    bg-slate-800 text-xs text-slate-300
                                "
                                aria-label="Foto de perfil indisponível"
                            >
                                <i className="fas fa-camera" />
                            </span>
                        </div>

                        <span className="mt-3 text-xs text-slate-500">
                            Foto de perfil em breve
                        </span>

                        <h3 className="mt-2 text-base font-semibold text-white">
                            {nome}
                        </h3>
                    </div>

                    {/* Informações do usuário */}
                    <div className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider text-slate-500
                                "
                            >
                                Nome
                            </label>

                            <div
                                className="
                                    flex items-center gap-3 rounded-xl
                                    border border-slate-800 bg-slate-900/70
                                    px-4 py-3
                                "
                            >
                                <i className="fas fa-user w-4 text-center text-indigo-400" />

                                <span className="min-w-0 break-words text-sm text-slate-200">
                                    {nome}
                                </span>
                            </div>
                        </div>

                        {/* Telefone */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider text-slate-500
                                "
                            >
                                Telefone
                            </label>

                            <div
                                className="
                                    flex items-center gap-3 rounded-xl
                                    border border-slate-800 bg-slate-900/70
                                    px-4 py-3
                                "
                            >
                                <i className="fas fa-phone w-4 text-center text-indigo-400" />

                                <span
                                    className={`min-w-0 break-words text-sm ${
                                        telefone
                                            ? "text-slate-200"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {telefone || "Telefone não informado"}
                                </span>
                            </div>
                        </div>

                        {/* Plano atual */}
                        <div>
                            <label
                                className="
                                    mb-2 block text-xs font-semibold
                                    uppercase tracking-wider text-slate-500
                                "
                            >
                                Plano atual
                            </label>

                            <div
                                className="
                                    flex items-center justify-between gap-3
                                    rounded-xl border border-slate-800
                                    bg-slate-900/70 px-4 py-3
                                "
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <i
                                        className={`fas ${
                                            planoPremium
                                                ? "fa-crown text-amber-400"
                                                : planoPro
                                                    ? "fa-star text-indigo-400"
                                                    : "fa-shield-halved text-slate-400"
                                        } w-4 text-center`}
                                    />

                                    <span className="text-sm font-semibold text-slate-200">
                                        {plano}
                                    </span>
                                </div>

                                <span
                                    className="
                                        shrink-0 rounded-full
                                        border border-slate-700
                                        bg-slate-800 px-2.5 py-1
                                        text-[10px] font-semibold
                                        uppercase tracking-wider text-slate-400
                                    "
                                >
                                    Atual
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                O plano não pode ser alterado nesta tela.
                            </p>
                        </div>
                    </div>

                    {/* Fechar */}
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
