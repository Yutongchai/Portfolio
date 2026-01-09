import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PersonalContent {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  alt: string;
  technologies: string[];
  year: string;
  client: string;
  role: string;
  duration: string;
  challenge: string;
  solution: string;
  outcome: string;
  featured: boolean;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

export interface CoreValue {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  username: string;
}

export interface CMSContent {
  personal: PersonalContent;
  projects: Project[];
  skills: Skill[];
  coreValues: CoreValue[];
  socialLinks: SocialLink[];
}

interface ContentContextType {
  content: CMSContent;
  updatePersonal: (data: Partial<PersonalContent>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateSkill: (id: number, data: Partial<Skill>) => void;
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: number) => void;
  updateCoreValue: (id: number, data: Partial<CoreValue>) => void;
  updateSocialLink: (id: string, data: Partial<SocialLink>) => void;
  exportContent: () => string;
  importContent: (jsonString: string) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const defaultContent: CMSContent = {
  personal: {
    name: 'EITO Group',
    title: 'Team Building & Collaboration Experts',
    tagline: 'Building stronger teams, one connection at a time',
    bio: 'At EITO Group, we believe that the foundation of every successful organization is a united, motivated, and collaborative team.',
    image: '/Portfolio/mainPic.jpg',
    email: 'events@hiveandthrive.com',
    phone: '+1 (555) 987-6543',
  },
  projects: [],
  skills: [],
  coreValues: [],
  socialLinks: [],
};

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CMSContent>(() => {
    const saved = localStorage.getItem('cms-content');
    return saved ? JSON.parse(saved) : defaultContent;
  });

  useEffect(() => {
    localStorage.setItem('cms-content', JSON.stringify(content));
  }, [content]);

  const updatePersonal = (data: Partial<PersonalContent>) => {
    setContent((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...data },
    }));
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  };

  const addProject = (project: Project) => {
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const deleteProject = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateSkill = (id: number, data: Partial<Skill>) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  };

  const addSkill = (skill: Skill) => {
    setContent((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const deleteSkill = (id: number) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const updateCoreValue = (id: number, data: Partial<CoreValue>) => {
    setContent((prev) => ({
      ...prev,
      coreValues: prev.coreValues.map((cv) => (cv.id === id ? { ...cv, ...data } : cv)),
    }));
  };

  const updateSocialLink = (id: string, data: Partial<SocialLink>) => {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((sl) => (sl.id === id ? { ...sl, ...data } : sl)),
    }));
  };

  const exportContent = () => {
    return JSON.stringify(content, null, 2);
  };

  const importContent = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setContent(imported);
    } catch (error) {
      console.error('Failed to import content:', error);
    }
  };

  const resetContent = () => {
    setContent(defaultContent);
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updatePersonal,
        updateProject,
        addProject,
        deleteProject,
        updateSkill,
        addSkill,
        deleteSkill,
        updateCoreValue,
        updateSocialLink,
        exportContent,
        importContent,
        resetContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
