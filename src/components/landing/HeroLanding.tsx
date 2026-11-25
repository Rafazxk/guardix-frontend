interface HeroLandingProps {
  onAbrirAutenticacao: () => void;
}

function HeroLanding({ onAbrirAutenticacao }: HeroLandingProps) {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#090909] text-white"
    >
      {/* Textura técnica de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-28">
        {/* Apresentação */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-3 py-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-white"
            />
            <span className="text-xs font-medium tracking-wide text-white">
              PREVENÇÃO DE FRAUDES DIGITAIS
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
            Antes de confiar,
            <br />
            <span className="text-white">verifique.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-neutral-400 sm:text-lg">
            Links, telefones e imagens podem esconder riscos. O Guardix ajuda
            você a analisar informações suspeitas e tomar decisões digitais
            com mais segurança.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
           <button
  type="button"
  onClick={onAbrirAutenticacao}
  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-white px-6 font-bold text-black transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#090909]"
>
  Acessar o Guardix

</button>

            <a
              href="#educativo"
              className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/20 px-6 font-medium text-white transition hover:border-white/40 hover:bg-white/[0.06]"
            >
              Aprenda a se proteger
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <span className="text-white">✓</span>
              Análise de riscos
            </span>
            <span className="flex items-center gap-2">
              <span className="text-white">✓</span>
              Informação preventiva
            </span>
          </div>
        </div>

        {/* Painel visual ilustrativo — não representa uma consulta real */}
        <div className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute -inset-5 -z-10 rounded-[2rem] bg-white/[0.04] blur-2xl"
          />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-neutral-600" />
                  <span className="h-2 w-2 rounded-full bg-neutral-600" />
                  <span className="h-2 w-2 rounded-full bg-neutral-600" />
                </div>
                <span className="text-xs text-neutral-400">
                  VISÃO DE SEGURANÇA
                </span>
              </div>

              <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-neutral-500">
                DEMONSTRAÇÃO
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-400">
                    Exemplo de verificação
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Avaliação de um link
                  </h2>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] text-white">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                  >
                    <circle
                      cx="10.5"
                      cy="10.5"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="m15.5 15.5 4 4M8 10.5h5M10.5 8v5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                  Endereço ilustrativo
                </p>
                <p className="mt-2 break-all font-mono text-sm text-neutral-300">
                  https://exemplo.com/validacao
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-white/15 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12 3 19 6V11.5C19 16 16.1 19.2 12 21 7.9 19.2 5 16 5 11.5V6L12 3Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m9 12 2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      Análise preventiva
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-400">
                      Verificações baseadas nas regras disponíveis no sistema.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-neutral-600">
                Interface ilustrativa. O resultado real depende dos dados
                enviados e das verificações executadas pelo Guardix.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1 text-xs text-neutral-600">
            <span>PREVENÇÃO DIGITAL</span>
            <span>GUARDIX / 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroLanding;
