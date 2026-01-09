export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  experience: string;
  price: number;
  duration: string;
  min_participants: number;
  max_participants: number;
  image_url: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}
