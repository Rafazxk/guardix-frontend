function RodapeLanding() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#090909] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 py-10 sm:grid-cols-[1fr_auto] sm:items-start">
          {/* Identidade */}
          <div className="max-w-md">
            <a
              href="#inicio"
              aria-label="Voltar ao início do Guardix"
              className="inline-flex items-center gap-3 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] text-white transition-colors group-hover:bg-white/[0.12]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                >
                  <path
                    d="M12 3 19 6V11.5C19 16 16.1 19.2 12 21 7.9 19.2 5 16 5 11.5V6L12 3Z"
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

              <span className="text-xl font-bold tracking-tight">
                guardix<span className="text-neutral-400">.</span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
              Tecnologia e informação para ajudar você a reconhecer sinais de
              risco e agir com mais segurança no ambiente digital.
            </p>
          </div>

          {/* Navegação */}
          <nav aria-label="Links do rodapé" className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Explore
            </span>

            <a
              href="#inicio"
              className="w-fit text-sm text-neutral-300 transition-colors hover:text-white"
            >
              Início
            </a>

            <a
              href="#recursos"
              className="w-fit text-sm text-neutral-300 transition-colors hover:text-white"
            >
              Recursos
            </a>

            <a
              href="#educativo"
              className="w-fit text-sm text-neutral-300 transition-colors hover:text-white"
            >
              Conteúdo educativo
            </a>
          </nav>
        </div>

        {/* Aviso e créditos */}
        <div className="flex flex-col gap-4 border-t border-white/[0.07] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-neutral-500">
            O Guardix é uma ferramenta de apoio à prevenção. As análises não
            garantem a identificação de todas as fraudes. Verifique informações
            importantes sempre pelos canais oficiais.
          </p>

          <p className="shrink-0 text-xs text-neutral-600">
            © {anoAtual} Guardix. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default RodapeLanding;
