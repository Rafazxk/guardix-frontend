import { Sparkles, CheckCircle2, X } from "lucide-react";

interface ModalProProps {
  onClose: () => void;
  onNavigateToPlanos?: (plano?: "pro" | "todos") => void;
}

export function ModalPro({ onClose, onNavigateToPlanos }: ModalProProps) {
  const handleSelecionarPlano = (tipo: "pro" | "todos") => {
    if (onNavigateToPlanos) {
      onNavigateToPlanos(tipo);
    } else {
      console.log(`Navegar para: ${tipo}`);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR */}
        <button
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* BADGE */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Recurso Pro
        </div>

        {/* TÍTULO */}
        <h3 className="text-xl font-bold text-white mb-2">
          Limite atingido ou recurso exclusivo
        </h3>

        {/* DESCRIÇÃO */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Você atingiu o limite do plano gratuito. Faça o upgrade para o plano{" "}
          <span className="font-semibold text-cyan-400">Pro</span> para continuar realizando verificações ilimitadas e ter relatórios avançados.
        </p>

        {/* DOIS BOTÕES DE AÇÃO */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          {/* BOTÃO 1: ASSINAR PRO DIRETO (DESTAQUE) */}
          <button
            onClick={() => handleSelecionarPlano("pro")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            Assinar Pro
          </button>

          {/* BOTÃO 2: VER TODOS OS PLANOS (SECUNDÁRIO) */}
          <button
            onClick={() => handleSelecionarPlano("todos")}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all"
          >
            Ver todos os planos
          </button>
        </div>

        {/* BOTÃO DISCRETO PARA CANCELAR */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          Talvez depois
        </button>
      </div>
    </div>
  );
}

export default ModalPro;