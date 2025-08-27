
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string[];
  period: string;
}

export interface Achievement {
    id: number;
    description: string;
}