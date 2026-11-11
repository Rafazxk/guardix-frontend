
import { useState } from "react";
import ModalAutenticacao from "../components/ModalAutenticacao";
import CabecalhoLanding from "../components/landing/CabecalhoLanding";
import HeroLanding from "../components/landing/HeroLanding";
import RecursosLanding from "../components/landing/RecursosLanding";
import RodapeLanding from "../components/landing/RodapeLanding";

interface HomeProps {
  onLoginSuccess?: () => void;
}

function Home({ onLoginSuccess }: HomeProps) {
  const [modalAutenticacaoAberto, setModalAutenticacaoAberto] =
    useState(false);

  const abrirModal = () => {
    setModalAutenticacaoAberto(true);
  };

  const fecharModal = () => {
    setModalAutenticacaoAberto(false);
  };

  const handleLoginSuccess = () => {
    fecharModal();
    onLoginSuccess?.();
  };

  return (
    <div className="min-h-screen bg-[#101310] text-white selection:bg-lime-300 selection:text-[#151812]">
      <CabecalhoLanding onAbrirAutenticacao={abrirModal} />

      <main>
        <HeroLanding onAbrirAutenticacao={abrirModal} />

        <RecursosLanding />
      </main>

      <RodapeLanding />

      <ModalAutenticacao
        aberto={modalAutenticacaoAberto}
        onFechar={fecharModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Home;
