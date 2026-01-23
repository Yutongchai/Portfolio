export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  featured_image_url: string;
  image_alt: string;
  technologies: string[];
  year: string;
  client: string;
  role?: string;
  duration: string;
  outcome: string;
  metrics: ProjectMetric[];
  testimonial?: Testimonial;
  gallery: GalleryImage[];
  link?: string;
  featured: boolean;
}

export interface ProjectMetric {
  label: string;
  value: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
  alt: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export type SortOption = 'recent' | 'featured' | 'alphabetical';

export interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProjectFiltersProps {
  categories: FilterOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export interface ProjectStatsProps {
  totalProjects: number;
  filteredCount: number;
  categories: number;
}