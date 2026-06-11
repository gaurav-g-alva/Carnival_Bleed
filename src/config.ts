import generalSettings from "./content/settings/general.json";

export interface Service {
  name: string;
  description: string;
  icon: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
  skills?: string[];
}

export interface Experience {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  dateRange: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
  tags?: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  siteUrl: string;
  resumeUrl?: string;
  accentColor: string;
  social: {
    email: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  aboutMe: string;
  skills: string[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export const siteConfig = generalSettings as SiteConfig;

