export type NotificationType = "job_match" | "application_viewed" | "interview" | "profile_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
  group: "today" | "yesterday";
  tag?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "job_match",
    title: "Nova vaga compatível encontrada",
    description:
      "UX Designer Sênior na FinTech Solutions. Corresponde a 95% do seu perfil com base nas suas habilidades em Figma e pesquisa de usuário.",
    time: "37m",
    read: false,
    actionLabel: "Ver Vaga",
    actionRoute: "/jobs/4",
    group: "today",
    tag: "95% compatível",
  },
  {
    id: "n2",
    type: "application_viewed",
    title: "Sua candidatura foi visualizada",
    description:
      "A equipe de recrutamento da TechFlow Solutions visualizou seu currículo para a vaga de Desenvolvedor Frontend Sênior. Isso é um ótimo sinal!",
    time: "2h",
    read: false,
    group: "today",
  },
  {
    id: "n3",
    type: "job_match",
    title: "3 novas vagas para você",
    description:
      "Encontramos 3 vagas de Product Designer compatíveis com seu perfil em São Paulo, Curitiba e Remoto. Não perca essa oportunidade!",
    time: "5h",
    read: false,
    actionLabel: "Ver Vagas",
    actionRoute: "/jobs",
    group: "today",
    tag: "Novo",
  },
  {
    id: "n4",
    type: "interview",
    title: "Entrevista agendada",
    description:
      "Sua entrevista com CloudScale Inc. está confirmada para amanhã às 14:00. Prepare-se revisando a descrição da vaga e o perfil da empresa.",
    time: "22h",
    read: true,
    group: "yesterday",
  },
  {
    id: "n5",
    type: "application_viewed",
    title: "Recrutador acessou seu perfil",
    description:
      "Um recrutador da Designly Studio acessou seu perfil completo após ver sua candidatura para a vaga de UX Designer Pleno.",
    time: "23h",
    read: true,
    group: "yesterday",
  },
  {
    id: "n6",
    type: "profile_alert",
    title: "Aumente a visibilidade do seu perfil",
    description:
      "Complete suas certificações e adicione 2 projetos ao portfólio para aumentar sua visibilidade em 40% e aparecer para mais recrutadores.",
    time: "1 dia",
    read: true,
    group: "yesterday",
  },
];
