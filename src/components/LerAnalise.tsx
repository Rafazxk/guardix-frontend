
import { useEffect, useState } from "react";

interface LerAnaliseProps {
  texto: string;
}

export function LerAnalise({ texto }: LerAnaliseProps) {
  const [falando, setFalando] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function ouvir() {
    const voz = window.speechSynthesis;

    if (falando) {
      voz.cancel();
      setFalando(false);
      return;
    }

    voz.cancel();

    const leitura = new SpeechSynthesisUtterance(texto);
    leitura.lang = "pt-BR";
    leitura.rate = 1;

    leitura.onstart = () => setFalando(true);
    leitura.onend = () => setFalando(false);
    leitura.onerror = () => setFalando(false);

    voz.speak(leitura);
  }

  return (
    <button type="button" onClick={ouvir}>
      {falando ? "Parar leitura" : "Ouvir análise"}
    </button>
  );
}
