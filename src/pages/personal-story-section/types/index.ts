export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  image: string;
  alt: string;
}

export interface CoreValue {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

export interface Journey {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface Philosophy {
  id: number;
  quote: string;
  author: string;
  context: string;
}