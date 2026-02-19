export interface ContactMethod {
  id: string;
  type: 'email' | 'phone' | 'social' | 'calendar';
  label: string;
  value: string;
  icon: string;
  description: string;
  primary?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  username: string;
  followers?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  alt: string;
  content: string;
  rating: number;
}

export interface TrustBadge {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface AvailabilitySlot {
  id: string;
  day: string;
  time: string;
  available: boolean;
  date?: string;
  blockedReason?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}