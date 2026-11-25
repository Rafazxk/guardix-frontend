
import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { tutorialEtapas } from "./TutorialEtapas.js";
import type { DriveStep } from "driver.js";

interface TutorialGuardixProps {
  aberto: boolean;
  onFechar: () => void;
  onNavegar: (secao: string) => void;
  onMenuAbrir?: () => void;
}

export default function TutorialGuardix({
  aberto,
  onFechar,
  onNavegar,
  onMenuAbrir,
}: TutorialGuardixProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    if (!aberto) return;

    const etapas: DriveStep[] = tutorialEtapas.map((etapa, index) => ({
      ...etapa,

      onNextClick: () => {
        const proximasSecoes: Record<number, string> = {
          0: "verificador",
          1: "historico",
          2: "feed",
          3: "relatorios",
        };

        const proximaSecao = proximasSecoes[index];

        if (proximaSecao) {
          onNavegar(proximaSecao);
        }

        if (index >= 3 && index <= 6) {
          onMenuAbrir?.();
        }

        if (index === etapas.length - 1) {
          driverRef.current?.destroy();
          onFechar();
          return;
        }

        setTimeout(() => {
          driverRef.current?.moveNext();
        }, 250);
      },

      onPrevClick: () => {
        const secoesAnteriores: Record<number, string> = {
          1: "verificador",
          2: "historico",
          3: "feed",
        };

        const secaoAnterior = secoesAnteriores[index];

        if (secaoAnterior) {
          onNavegar(secaoAnterior);
        }

        setTimeout(() => {
          driverRef.current?.movePrevious();
        }, 250);
      },
    }));

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayOpacity: 0.65,
      nextBtnText: "Próximo",
      prevBtnText: "Voltar",
      doneBtnText: "Concluir",
      progressText: "{{current}} de {{total}}",

      onDestroyed: () => {
        driverRef.current = null;
        onFechar();
      },

      steps: etapas,
    });

    driverRef.current = driverObj;

    // O primeiro passo começa no Verificador.
    onNavegar("verificador");

    const timeout = setTimeout(() => {
      driverObj.drive();
    }, 300);

    return () => {
      clearTimeout(timeout);
      driverObj.destroy();
      driverRef.current = null;
    };
  }, [aberto]);

  return null;
}
