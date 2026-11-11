
interface CabecalhoLandingProps {
  onAbrirAutenticacao: () => void;
}

function CabecalhoLanding({
  onAbrirAutenticacao,
}: CabecalhoLandingProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101310]/95 backdrop-blur-md">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
      >
        <a
          href="#inicio"
          aria-label="Guardix — página inicial"
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-300 transition-colors group-hover:bg-lime-300/20">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <path
                d="M12 3 19 6V11.5C19 16 16.1 19.2 12 21C7.9 19.2 5 16 5 11.5V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              guardix<span className="text-lime-300">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Segurança digital
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#recursos"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Recursos
          </a>
          <a
            href="#educativo"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Aprenda a se proteger
          </a>
        </div>

        <button
          type="button"
          onClick={onAbrirAutenticacao}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-lime-300 px-4 py-2 text-sm font-bold text-[#151812] transition-colors hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-[#101310] sm:px-5"
        >
          Entrar
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}

export default CabecalhoLanding;
