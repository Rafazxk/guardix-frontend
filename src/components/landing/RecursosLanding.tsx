
const recursos = [
  {
    numero: "01",
    categoria: "NAVEGAÇÃO",
    titulo: "Análise de links",
    descricao:
      "Avalie endereços suspeitos e consulte os sinais de risco identificados pelas verificações disponíveis no sistema.",
    icone: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
      >
        <path
          d="M10 13.5a4 4 0 0 0 5.8.3l3-3a4 4 0 0 0-5.7-5.6l-1.7 1.7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M14 10.5a4 4 0 0 0-5.8-.3l-3 3a4 4 0 0 0 5.7 5.6l1.7-1.7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    numero: "02",
    categoria: "COMUNICAÇÃO",
    titulo: "Verificação de telefones",
    descricao:
      "Consulte informações relacionadas a números suspeitos e identifique possíveis sinais de golpes reportados.",
    icone: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
      >
        <path
          d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M9 6.5h6M10 17.5h4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    numero: "03",
    categoria: "ANÁLISE VISUAL",
    titulo: "Análise de imagens",
    descricao:
      "Investigue capturas de tela e imagens suspeitas com os mecanismos de verificação disponibilizados pela plataforma.",
    icone: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
      >
        <rect
          x="3.5"
          y="4.5"
          width="17"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="8.5"
          cy="9"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m5 17 5-5 3 3 2-2 4 4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function RecursosLanding() {
  return (
    <>
      <section
        id="recursos"
        className="border-t border-white/[0.07] bg-[#151814] text-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-lime-300">
                O QUE O GUARDIX FAZ
              </p>

              <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                Mais informação antes de tomar uma decisão.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
                Uma plataforma voltada à prevenção de fraudes digitais, que
                reúne verificações para ajudar a reconhecer sinais de alerta
                antes de confiar em uma informação.
              </p>

              <div className="mt-8 flex items-center gap-3 border-l-2 border-lime-300/60 py-2 pl-4">
                <span className="text-sm leading-6 text-neutral-300">
                  A análise auxilia sua avaliação. Na dúvida, confirme a
                  informação diretamente com o canal oficial.
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {recursos.map((recurso) => (
                <article
                  key={recurso.numero}
                  className="group grid gap-4 py-6 transition-colors sm:grid-cols-[48px_1fr] sm:gap-5 sm:py-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-lime-300 transition-colors group-hover:border-lime-300/30 group-hover:bg-lime-300/[0.06]">
                    {recurso.icone}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-xs text-neutral-600">
                        {recurso.numero}
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-lime-300/80">
                        {recurso.categoria}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                      {recurso.titulo}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-400">
                      {recurso.descricao}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="educativo"
        className="border-t border-white/[0.07] bg-[#101310] text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-lime-300">
              CONHECIMENTO TAMBÉM PROTEGE
            </p>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              Reconhecer um golpe é parte da defesa.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
              A prevenção começa ao entender como as fraudes funcionam. Alguns
              sinais merecem atenção antes de clicar, pagar ou compartilhar
              dados pessoais.
            </p>
          </div>

          <div className="space-y-0">
            <article className="border-t border-white/10 py-5">
              <p className="font-mono text-xs text-lime-300">01 / PHISHING</p>
              <h3 className="mt-2 font-semibold text-white">
                Mensagens que imitam empresas
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Desconfie de pedidos urgentes, domínios estranhos e páginas que
                solicitam senhas ou códigos de segurança.
              </p>
            </article>

            <article className="border-t border-white/10 py-5">
              <p className="font-mono text-xs text-lime-300">02 / COMPROVANTES</p>
              <h3 className="mt-2 font-semibold text-white">
                Imagens não comprovam pagamento
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Confira a transação no aplicativo ou extrato oficial antes de
                entregar um produto ou prestar um serviço.
              </p>
            </article>

            <article className="border-y border-white/10 py-5">
              <p className="font-mono text-xs text-lime-300">03 / ENGENHARIA SOCIAL</p>
              <h3 className="mt-2 font-semibold text-white">
                Pressa e pressão são sinais de alerta
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Não compartilhe códigos de autenticação nem faça transferências
                sem verificar a identidade de quem está solicitando.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export default RecursosLanding;
