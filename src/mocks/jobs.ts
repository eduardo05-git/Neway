export type JobType = "Remoto" | "Híbrido" | "Presencial";
export type JobRegime = "Tempo Integral" | "Meio Período" | "Freelance";
export type JobLevel = "Estágio" | "Júnior" | "Pleno" | "Sênior";

export interface Benefit {
  icon: string;
  label: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyDescription: string;
  location: string;
  state: string;
  type: JobType;
  regime: JobRegime;
  level: JobLevel;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  benefits: Benefit[];
  address: string;
  postedAt: string;
  isSaved: boolean;
}

export const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    company: "TechFlow Solutions",
    companyDescription:
      "A TechFlow é líder em soluções de automação para recursos humanos na América Latina, impactando mais de 500 mil usuários diariamente.",
    location: "São Paulo",
    state: "SP",
    type: "Remoto",
    regime: "Tempo Integral",
    level: "Sênior",
    salaryMin: 12000,
    salaryMax: 16000,
    description:
      "Estamos em busca de um Desenvolvedor Frontend Sênior apaixonado por criar interfaces excepcionais e performáticas. Na TechFlow, você será responsável por liderar a arquitetura de novos módulos do nosso produto principal, garantindo uma experiência de usuário fluida e escalável. Trabalhamos com as tecnologias mais modernas do mercado e valorizamos a autonomia e a excelência técnica.",
    requirements: [
      "Experiência mínima de 5 anos com React.js e ecossistema Moderno.",
      "Domínio avançado de TypeScript e Tailwind CSS.",
      "Conhecimento profundo em Next.js e renderização no lado do servidor (SSR).",
      "Experiência com testes unitários e de integração (Jest/Cypress).",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde Premium" },
      { icon: "fork.knife", label: "Vale Refeição Flexível" },
      { icon: "house", label: "Auxílio Home Office" },
      { icon: "book", label: "Bolsa de Estudos" },
    ],
    address: "Avenida Paulista, 1200 - Bela Vista, São Paulo - SP",
    postedAt: "2 dias atrás",
    isSaved: false,
  },
  {
    id: "2",
    title: "Product Designer (UI/UX)",
    company: "Designly Studio",
    companyDescription:
      "A Designly é uma boutique de design digital especializada em criar produtos que encantam usuários e geram resultados reais para empresas B2B.",
    location: "Curitiba",
    state: "PR",
    type: "Híbrido",
    regime: "Tempo Integral",
    level: "Pleno",
    salaryMin: 8500,
    salaryMax: 12000,
    description:
      "Buscamos um Product Designer criativo e orientado a dados para se juntar ao nosso time. Você será responsável por conduzir pesquisas de usuário, criar fluxos, wireframes e protótipos de alta fidelidade, colaborando diretamente com os times de produto e engenharia.",
    requirements: [
      "Portfólio sólido com cases de UX/UI para produtos digitais.",
      "Domínio do Figma e ferramentas de prototipação.",
      "Experiência com metodologias ágeis e design system.",
      "Habilidade em conduzir entrevistas e testes de usabilidade.",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde" },
      { icon: "fork.knife", label: "Vale Alimentação" },
      { icon: "figure.run", label: "Gympass" },
      { icon: "book", label: "Budget de Aprendizado" },
    ],
    address: "Rua XV de Novembro, 600 - Centro, Curitiba - PR",
    postedAt: "5 dias atrás",
    isSaved: true,
  },
  {
    id: "3",
    title: "Analista de Dados Pleno",
    company: "Finflow Bank",
    companyDescription:
      "O Finflow é uma fintech de crédito digital focada em democratizar o acesso a serviços financeiros para micro e pequenos empreendedores.",
    location: "Rio de Janeiro",
    state: "RJ",
    type: "Presencial",
    regime: "Tempo Integral",
    level: "Pleno",
    salaryMin: 9000,
    salaryMax: 11500,
    description:
      "Procuramos um Analista de Dados Pleno para integrar nosso time de Data & Analytics. Você vai transformar dados brutos em insights estratégicos para o negócio, construindo dashboards, modelos preditivos e reportes executivos.",
    requirements: [
      "Sólida experiência com SQL e manipulação de grandes volumes de dados.",
      "Conhecimento em Python (pandas, numpy, scikit-learn).",
      "Experiência com ferramentas de BI (Power BI ou Tableau).",
      "Familiaridade com cloud data warehouses (BigQuery ou Redshift).",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde e Odonto" },
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "car", label: "Vale Transporte" },
      { icon: "gift", label: "PLR Semestral" },
    ],
    address: "Av. Rio Branco, 100 - Centro, Rio de Janeiro - RJ",
    postedAt: "1 semana atrás",
    isSaved: false,
  },
  {
    id: "4",
    title: "UX Designer Sênior",
    company: "FinTech Solutions",
    companyDescription:
      "A FinTech Solutions é uma plataforma de pagamentos digitais com presença em 12 países da América Latina.",
    location: "São Paulo",
    state: "SP",
    type: "Híbrido",
    regime: "Tempo Integral",
    level: "Sênior",
    salaryMin: 14000,
    salaryMax: 18000,
    description:
      "Vaga para UX Designer Sênior para liderar a experiência de usuário em nossos produtos financeiros. Você definirá a visão de design e mentorará designers juniores.",
    requirements: [
      "8+ anos de experiência em UX Design.",
      "Experiência com produtos financeiros ou fintech.",
      "Domínio de Figma e Adobe XD.",
      "Experiência em liderança de design e mentoria.",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde Premium" },
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "house", label: "Home Office Flexível" },
      { icon: "airplane", label: "Stock Options" },
    ],
    address: "Rua Faria Lima, 3000 - Itaim Bibi, São Paulo - SP",
    postedAt: "3 dias atrás",
    isSaved: true,
  },
  {
    id: "5",
    title: "Engenheiro de Software Backend",
    company: "Cloudstack Brasil",
    companyDescription:
      "A Cloudstack é uma empresa de infraestrutura em nuvem que atende mais de 2.000 empresas no Brasil e na América Latina.",
    location: "Belo Horizonte",
    state: "MG",
    type: "Remoto",
    regime: "Tempo Integral",
    level: "Pleno",
    salaryMin: 10000,
    salaryMax: 14000,
    description:
      "Buscamos um Engenheiro Backend apaixonado por sistemas distribuídos e APIs de alta performance. Você irá projetar e construir microsserviços robustos que suportam milhões de requisições diárias.",
    requirements: [
      "Experiência sólida com Node.js ou Go.",
      "Conhecimento em bancos de dados relacionais e NoSQL.",
      "Familiaridade com Docker, Kubernetes e CI/CD.",
      "Entendimento de arquitetura de microsserviços.",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde Premium" },
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "house", label: "Auxílio Home Office" },
      { icon: "book", label: "Budget de Cursos" },
    ],
    address: "Av. do Contorno, 5000 - Funcionários, Belo Horizonte - MG",
    postedAt: "1 dia atrás",
    isSaved: false,
  },
  {
    id: "6",
    title: "Mobile Developer (React Native)",
    company: "Appify Labs",
    companyDescription:
      "A Appify Labs é uma software house especializada em apps móveis para grandes marcas do varejo e entretenimento.",
    location: "São Paulo",
    state: "SP",
    type: "Híbrido",
    regime: "Tempo Integral",
    level: "Pleno",
    salaryMin: 9500,
    salaryMax: 13000,
    description:
      "Procuramos um desenvolvedor mobile com expertise em React Native para criar experiências nativas incríveis em iOS e Android. Você trabalhará em projetos de alto impacto com times multidisciplinares.",
    requirements: [
      "2+ anos de experiência com React Native.",
      "Conhecimento em Expo e publicação nas stores.",
      "Experiência com Redux ou Zustand para gerenciamento de estado.",
      "Familiaridade com animações (Reanimated).",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde" },
      { icon: "fork.knife", label: "Vale Alimentação" },
      { icon: "figure.run", label: "Gympass" },
      { icon: "gift", label: "Bônus por Performance" },
    ],
    address: "R. Funchal, 418 - Vila Olímpia, São Paulo - SP",
    postedAt: "4 dias atrás",
    isSaved: false,
  },
  {
    id: "7",
    title: "Cientista de Dados Júnior",
    company: "DataMind AI",
    companyDescription:
      "A DataMind AI é uma startup de inteligência artificial focada em soluções preditivas para o setor de saúde e varejo.",
    location: "Porto Alegre",
    state: "RS",
    type: "Remoto",
    regime: "Tempo Integral",
    level: "Júnior",
    salaryMin: 5000,
    salaryMax: 7500,
    description:
      "Ótima oportunidade para quem está começando na área de dados. Você irá apoiar o time de ciência de dados na construção de modelos preditivos e análises exploratórias.",
    requirements: [
      "Graduação em Estatística, Computação ou áreas afins.",
      "Conhecimento em Python e bibliotecas de ML.",
      "Noções de SQL e manipulação de dados.",
      "Vontade de aprender e crescer rápido.",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde" },
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "book", label: "Bolsa de Pós-graduação" },
      { icon: "house", label: "Home Office Total" },
    ],
    address: "Av. Ipiranga, 6681 - Partenon, Porto Alegre - RS",
    postedAt: "6 dias atrás",
    isSaved: false,
  },
  {
    id: "8",
    title: "Gerente de Produto (Product Manager)",
    company: "Inova Corp",
    companyDescription:
      "A Inova Corp é uma empresa de tecnologia educacional que conecta mais de 1 milhão de alunos a cursos profissionalizantes online.",
    location: "São Paulo",
    state: "SP",
    type: "Presencial",
    regime: "Tempo Integral",
    level: "Sênior",
    salaryMin: 16000,
    salaryMax: 22000,
    description:
      "Buscamos um PM experiente para liderar o roadmap do nosso produto principal. Você será o elo entre negócio, design e engenharia, definindo prioridades e garantindo a entrega de valor.",
    requirements: [
      "5+ anos de experiência como Product Manager.",
      "Experiência com metodologias ágeis (Scrum/Kanban).",
      "Habilidade em análise de dados e métricas de produto.",
      "Excelente comunicação com stakeholders.",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde Premium" },
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "airplane", label: "Stock Options" },
      { icon: "gift", label: "PLR Anual" },
    ],
    address: "Av. Brigadeiro Faria Lima, 1755 - Pinheiros, São Paulo - SP",
    postedAt: "2 dias atrás",
    isSaved: true,
  },
  {
    id: "9",
    title: "DevOps Engineer",
    company: "Nexus Cloud",
    companyDescription:
      "A Nexus Cloud fornece infraestrutura gerenciada para startups e scale-ups que precisam de alta disponibilidade e segurança.",
    location: "Florianópolis",
    state: "SC",
    type: "Remoto",
    regime: "Tempo Integral",
    level: "Pleno",
    salaryMin: 11000,
    salaryMax: 15000,
    description:
      "Procuramos um DevOps Engineer para automatizar pipelines, gerenciar infraestrutura como código e garantir a resiliência dos nossos sistemas em produção.",
    requirements: [
      "Experiência com AWS, GCP ou Azure.",
      "Domínio de Terraform e Ansible.",
      "Conhecimento sólido em Docker e Kubernetes.",
      "Experiência com monitoramento (Grafana, Prometheus).",
    ],
    benefits: [
      { icon: "heart", label: "Plano de Saúde e Odonto" },
      { icon: "fork.knife", label: "Vale Alimentação" },
      { icon: "house", label: "Home Office 100%" },
      { icon: "book", label: "Budget de Certificações" },
    ],
    address: "Rod. José Carlos Daux, 600 - João Paulo, Florianópolis - SC",
    postedAt: "3 dias atrás",
    isSaved: false,
  },
  {
    id: "10",
    title: "Estágio em Desenvolvimento Web",
    company: "StartHub Agency",
    companyDescription:
      "A StartHub é uma agência digital que cria soluções web e mobile para startups em estágio inicial de crescimento.",
    location: "Recife",
    state: "PE",
    type: "Híbrido",
    regime: "Meio Período",
    level: "Estágio",
    salaryMin: 1500,
    salaryMax: 2200,
    description:
      "Oportunidade de estágio para estudantes de TI que queiram aprender na prática. Você participará do desenvolvimento de landing pages, sistemas internos e integrações com APIs.",
    requirements: [
      "Cursando graduação em TI, Sistemas ou áreas afins.",
      "Conhecimentos básicos de HTML, CSS e JavaScript.",
      "Vontade de aprender React ou Vue.js.",
      "Disponibilidade de 20h/semana.",
    ],
    benefits: [
      { icon: "fork.knife", label: "Vale Refeição" },
      { icon: "car", label: "Vale Transporte" },
      { icon: "book", label: "Mentoria Semanal" },
      { icon: "gift", label: "Possibilidade de Efetivação" },
    ],
    address: "Av. Boa Viagem, 3400 - Boa Viagem, Recife - PE",
    postedAt: "1 semana atrás",
    isSaved: false,
  },
];
