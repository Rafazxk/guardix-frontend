
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

        const secoes: Record<number, string> = {
            0: "verificador",
            1: "historico",
            2: "feed",
            3: "relatorios",
        };

        const mobile = window.innerWidth < 768;

        const etapas: DriveStep[] = tutorialEtapas.map((etapa, index) => ({
            ...etapa,

            popover: {
                ...etapa.popover,
                side: mobile ? "bottom" : etapa.popover?.side,
                align: "center",
            },

            onNextClick: () => {
                const proximoIndice = index + 1;

                // Última etapa: encerra o tutorial.
                if (proximoIndice >= etapas.length) {
                    driverRef.current?.destroy();
                    return;
                }

                // Navega pelas telas principais.
                if (proximoIndice <= 3) {
                    onNavegar(secoes[proximoIndice]);
                }

                // Ao chegar na etapa Denunciar, abre a Sidebar.
                if (proximoIndice === 4) {
                    onMenuAbrir?.();
                }

                // Aguarda o React atualizar a tela antes de avançar.
                window.setTimeout(() => {
                    driverRef.current?.moveNext();
                }, 350);
            },

            onPrevClick: () => {
                const indiceAnterior = index - 1;

                if (indiceAnterior < 0) return;

                // Retorna às telas principais quando necessário.
                if (indiceAnterior <= 3) {
                    onNavegar(secoes[indiceAnterior]);
                }

                window.setTimeout(() => {
                    driverRef.current?.movePrevious();
                }, 350);
            },
        }));

        const driverObj = driver({
            showProgress: true,
            animate: true,
            smoothScroll: true,
            allowClose: true,
            allowKeyboardControl: true,
            overlayOpacity: 0.65,
            stagePadding: 8,
            stageRadius: 12,
            popoverOffset: 12,

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

        // Começa sempre pelo Verificador.
        onNavegar("verificador");

        const timeout = window.setTimeout(() => {
            driverObj.drive();
        }, 350);

        return () => {
            window.clearTimeout(timeout);
            driverObj.destroy();
            driverRef.current = null;
        };
    }, [aberto]);

    return null;
}
