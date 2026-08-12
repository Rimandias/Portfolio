import { PortfolioData } from './types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Sergio Riman Dias",
    title: "UX/UI Designer Sênior & Product Owner",
    bio: "UX/UI Designer Sênior com mais de 8 anos de experiência em concepção, pesquisa, prototipação e implementação de produtos digitais centrados no usuário. Especialista em liderança de squads multidisciplinares, construção de Design Systems escaláveis e condução de pesquisas qualitativas/quantitativas, alinhando de forma precisa a experiência de uso aos objetivos estratégicos de negócio.",
    location: "São Paulo, Brasil (Híbrido / Remoto)",
    status: "Imediata para contratação e projetos freelance",
    avatarUrl: "", // Usará iniciais estilizadas se estiver em branco
    skills: [
      { name: "UI/UX Design & Research", level: 100, category: "Design" },
      { name: "Design Systems & Componentes", level: 100, category: "Design" },
      { name: "Protótipos de Alta Fidelidade", level: 100, category: "Design" },
      { name: "Testes de Usabilidade", level: 100, category: "Design" },
      { name: "Acessibilidade & Usabilidade", level: 100, category: "Design" },
      { name: "Branding & Identidade Visual", level: 100, category: "Design" },
      { name: "Product Ownership", level: 90, category: "Product Management" },
      { name: "Gestão de Backlog & Roadmap", level: 90, category: "Product Management" },
      { name: "Liderança de Squads", level: 90, category: "Product Management" },
      { name: "Priorização de Features", level: 90, category: "Product Management" },
      { name: "Metodologias Ágeis (Scrum/Kanban)", level: 90, category: "Product Management" },
      { name: "Facilitação de Cerimônias", level: 90, category: "Product Management" }
    ]
  },
  socials: {
    figma: "https://www.figma.com/design/N7gdGltPYo32VonhJ7DdYd/Portal?m=auto&t=wjVkZwEnS5WHThxK-1",
    linkedin: "https://www.linkedin.com/in/sergio-riman-dias-21714474/",
    behance: "https://www.behance.net/sergiodias5",
    github: "",
    instagram: "https://instagram.com/sergioriman",
    email: "sergioriman@gmail.com"
  },
  projects: [
    {
      id: "proj-portal-assinatura",
      title: "Portal de Assinatura",
      description: "Concepção de UX/UI e desenvolvimento de fluxos de usuário refinados, prototipação interativa e especificação de componentes modernos para o Portal de Assinatura da Valid Certificadora.",
      figmaUrl: "https://www.figma.com/design/N7gdGltPYo32VonhJ7DdYd/Portal?m=auto&t=wjVkZwEnS5WHThxK-1",
      liveUrl: "https://www.figma.com/design/N7gdGltPYo32VonhJ7DdYd/Portal?m=auto&t=wjVkZwEnS5WHThxK-1",
      gradient: "from-indigo-600 via-purple-600 to-pink-500",
      tags: ["Portal", "Figma Design", "UX/UI Design", "Prototipação"]
    },
    {
      id: "proj-portal-rebranding",
      title: "Portal Rebranding",
      description: "Projeto de rebranding e redesenho da interface do Portal, focado em otimização da experiência do usuário, modernização visual e fluidez na navegação de ponta a ponta.",
      figmaUrl: "https://portalassinaturas.ai.studio",
      liveUrl: "https://portalassinaturas.ai.studio",
      gradient: "from-emerald-500 to-teal-700",
      tags: ["Rebranding", "Web Application", "UX Optimization", "Visual Identity"]
    },
    {
      id: "proj-tcg-colecionador",
      title: "TCG Colecionador",
      description: "Aplicação web voltada para rastreio, catálogo e gerenciamento completo de coleções de cartas TCG, projetada com interface responsiva, busca dinâmica e usabilidade simplificada.",
      figmaUrl: "https://www.tcgcolecionador.com.br",
      liveUrl: "https://www.tcgcolecionador.com.br",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      tags: ["Aplicação Web", "TCG Colecionador", "UX/UI Design", "Catalogação"]
    },
    {
      id: "proj-components-design",
      title: "Design de componentes",
      description: "Estruturação e design de componentes escaláveis no Figma, com foco em reutilização, variáveis dinâmicas de cores e consistência para sistemas corporativos complexos.",
      figmaUrl: "https://www.figma.com/design/C1Xm84fHRKhq5ykW3sn5dG/Components?node-id=0-1&t=A0NBn3L1fnlttkgo-1",
      liveUrl: "",
      gradient: "from-amber-500 to-red-600",
      tags: ["Design System", "Figma Components", "Scalability", "Acessibilidade"]
    }
  ],
  experiences: [
    {
      id: "exp-valid",
      company: "VALID CERTIFICADORA",
      role: "UX/UI Designer Sênior & Product Owner",
      period: "Novembro/2024 – Junho/2026",
      activities: [
        "Liderança de UX/UI em múltiplos produtos digitais da certificadora, responsável pela evolução completa da experiência do usuário.",
        "Condução de pesquisas com usuários (entrevistas, testes de usabilidade e análise de jornada) que identificaram oportunidades de melhoria e geraram aumento de satisfação e conversão.",
        "Criação e validação de fluxos, wireframes, protótipos de alta fidelidade e interfaces focadas em usabilidade e acessibilidade (WCAG).",
        "Atuação como Product Owner de um produto core: gestão completa de backlog, refinamento, priorização de features e planejamento de roadmap.",
        "Liderança de equipe multidisciplinar (desenvolvedores e QA), garantindo entregas ágeis com alta qualidade.",
        "Implementação e evolução contínua de Design System e componentes reutilizáveis."
      ]
    },
    {
      id: "exp-bfw-coord",
      company: "BFW ENERGIA / FONTES VERDES",
      role: "Coordenador de Comunicação Corporativa",
      period: "2023 - 2024",
      activities: [
        "Desenvolvimento completo do branding e identidade visual da nova empresa.",
        "Liderança direta da equipe de comunicação corporativa, engajando profissionais em campanhas de marketing integrado.",
        "Planejamento e execução estratégica de campanhas institucionais e gestão de comunicação interna / endomarketing.",
        "Desenvolvimento de vídeos de treinamento, materiais educacionais corporativos e atuação direta junto ao CEO na definição de estratégias macro de mercado."
      ]
    },
    {
      id: "exp-bfw-des",
      company: "BFW ENERGIA / FONTES VERDES",
      role: "Designer Corporativo e Instrucional Sênior",
      period: "2023",
      activities: [
        "Desenvolvimento de materiais instrucionais e educacionais estruturados para capacitação.",
        "Criação de apresentações executivas refinadas de alto impacto para tomada de decisão das lideranças.",
        "Gestão técnica e evolução de conteúdo do portal corporativo oficial.",
        "Apoio direto à implementação de melhorias organizacionais e desenvolvimento de ações voltadas à melhoria da experiência do colaborador."
      ]
    },
    {
      id: "exp-om30",
      company: "OM30",
      role: "UI Designer",
      period: "2023 - 2024",
      activities: [
        "Criação de wireframes, fluxos interativos e protótipos de alta fidelidade no Figma.",
        "Desenvolvimento de interfaces digitais focadas e centradas na real necessidade do usuário.",
        "Condução sistemática de testes de usabilidade para coleta de feedbacks e levantamento de requisitos técnicos com as áreas de negócio do grupo.",
        "Implementação e manutenção escalável do Design System em cooperação direta com os desenvolvedores frontend."
      ]
    },
    {
      id: "exp-veeva",
      company: "VEEVA SAÚDE",
      role: "Designer Corporativo | Marketing Digital | UX/UI",
      period: "2019 - 2022",
      activities: [
        "Gestão completa da presença digital corporativa da marca nas redes sociais e canais web.",
        "Administração técnica de websites oficiais e planejamento de campanhas estratégicas de marketing digital.",
        "Desenvolvimento de apresentações estruturadas para captação e prestação de contas com investidores, parceiros e franqueados.",
        "Criação conceitual da marca, identidade visual impressa/digital e modelagem 3D das instalações físicas de franquias.",
        "Implementação prática de conceitos avançados de UX/UI para otimização da experiência do paciente e taxas de conversão."
      ]
    }
  ],
  education: [
    {
      id: "edu-umc",
      year: "2005",
      degree: "Designer gráfico",
      institution: "Universidade de Mogi das Cruzes (UMC)"
    },
    {
      id: "edu-fmu",
      year: "2015",
      degree: "Rádio e Tv",
      institution: "Centro Universitário das Faculdades Metropolitanas Unidas (FMU)"
    }
  ]
};
