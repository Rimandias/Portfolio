export interface Project {
  id: string;
  title: string;
  description: string;
  figmaUrl: string;
  liveUrl?: string;
  gradient: string;
  tags: string[];
}

export interface SocialLinks {
  figma?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
  instagram?: string;
  twitter?: string;
  email?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  status: string; // e.g., "Disponível para novos projetos" or "Trabalhando atualmente"
  avatarUrl?: string;
  skills: { name: string; level: number; category: string }[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  company?: string;
  content: string;
  timestamp: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  activities: string[];
}

export interface Education {
  id: string;
  year: string;
  degree: string;
  institution: string;
}

export interface PortfolioData {
  profile: Profile;
  socials: SocialLinks;
  projects: Project[];
  experiences: WorkExperience[];
  education: Education[];
}
