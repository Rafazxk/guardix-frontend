interface ModalPagamentoProps {
    aberto: boolean;
    plano: "pro" | "premium";
    onFechar: () => void;
    onContinuar: () => void;
}

export default function ModalPagamento({
    aberto,
    plano,
    onFechar,
    onContinuar,
}: ModalPagamentoProps) {

    if (!aberto) {
        return null;
    }

    const nomePlano = plano === "pro" ? "Pro" : "Premium+";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

                {/* Botão fechar */}
                <button
                    type="button"
                    onClick={onFechar}
                    className="absolute right-4 top-4 text-2xl text-slate-400 transition hover:text-white"
                    aria-label="Fechar"
                >
                    ×
                </button>

                {/* Conteúdo */}
                <div className="pr-8">
                    <h2 className="text-2xl font-bold text-white">
                        Assinar Guardix {nomePlano}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        Você será direcionado para o ambiente seguro de
                        pagamento para concluir sua assinatura.
                    </p>
                </div>

                {/* Informações */}
                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Plano
                        </span>

                        <span className="font-semibold text-cyan-400">
                            {nomePlano}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                            Cobrança
                        </span>

                        <span className="text-sm font-medium text-white">
                            Mensal
                        </span>
                    </div>
                </div>

                {/* Aviso */}
                <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <p className="text-xs leading-relaxed text-slate-400">
                        O pagamento será realizado no ambiente do Asaas.
                        Nenhum dado do seu cartão é armazenado pelo Guardix.
                    </p>
                </div>

                {/* Ações */}
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={onContinuar}
                        className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Continuar para pagamento
                    </button>

                    <button
                        type="button"
                        onClick={onFechar}
                        className="w-full rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    );
}