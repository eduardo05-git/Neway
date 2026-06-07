export type ApplicationStatus =
  | "Em Análise"
  | "Entrevista Marcada"
  | "Processo Finalizado"
  | "Aprovado"
  | "Reprovado";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: ApplicationStatus;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  state: string;
  email: string;
  avatarUrl: string;
  bio: string;
  savedJobsCount: number;
  applications: Application[];
}

export const MOCK_USER: UserProfile = {
  id: "u1",
  name: "Eduardo Elias",
  title: "Senior Product Designer & UX Researcher",
  location: "São Paulo",
  state: "SP",
  email: "rm93000@estudante.fieb.edu.br",
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  bio: "Especialista em criar experiências digitais centradas no humano com mais de 8 anos de mercado. Focada em soluções SaaS e ecossistemas complexos de design system. Atualmente buscando novos desafios em empresas tech de alto crescimento.",
  savedJobsCount: 12,
  applications: [
    {
      id: "a1",
      jobTitle: "UX Designer Senior",
      company: "Tech Solutions S.A.",
      appliedAt: "Aplicado há 2 dias",
      status: "Em Análise",
      iconName: "business-outline",
      iconBg: "#DBEAFE",
      iconColor: "#1A6FE8",
    },
    {
      id: "a2",
      jobTitle: "Product Designer II",
      company: "Cloud Creative",
      appliedAt: "Aplicado há 1 semana",
      status: "Entrevista Marcada",
      iconName: "cloud-outline",
      iconBg: "#E0F7FA",
      iconColor: "#0891B2",
    },
    {
      id: "a3",
      jobTitle: "Visual Interaction Designer",
      company: "Volt Startups",
      appliedAt: "Aplicado há 3 semanas",
      status: "Processo Finalizado",
      iconName: "flash-outline",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
  ],
};
