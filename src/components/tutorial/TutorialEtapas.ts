
import type { DriveStep } from "driver.js";

export const tutorialEtapas: DriveStep[] = [
  {
    element: "#secao-verificador",
    popover: {
      title: "Bem-vindo ao Verificador!",
      description:
        "Aqui você pode analisar links, números de telefone e imagens para identificar possíveis sinais de golpes.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#secao-historico",
    popover: {
      title: "Seu histórico",
      description:
        "Consulte suas análises anteriores e filtre por links, telefones e imagens.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#feed-golpes",
    popover: {
      title: "Feed da comunidade",
      description:
        "Veja informações denunciadas por outros usuários e pesquise links ou telefones suspeitos.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#secao-relatorios",
    popover: {
      title: "Relatórios e estatísticas",
      description:
        "Acompanhe informações sobre consultas, ameaças identificadas e análises realizadas.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-denunciar",
    popover: {
      title: "Ajude a comunidade!",
      description:
        "Denuncie links ou números de telefone suspeitos e contribua com a segurança de outros usuários.",
      side: "right",
      align: "center",
    },
  },
  {
    element: "#tutorial-configuracoes",
    popover: {
      title: "Personalize sua experiência",
      description:
        "Escolha o tema da aplicação e ajuste suas preferências de notificação.",
      side: "right",
      align: "center",
    },
  },
  {
    element: "#tutorial-perfil",
    popover: {
      title: "Sua conta Guardix",
      description:
        "Acesse seu perfil para consultar suas informações e gerenciar sua conta.",
      side: "right",
      align: "center",
    },
  },
];
