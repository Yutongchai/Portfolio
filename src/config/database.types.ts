export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: number;
          setting_key: string;
          setting_value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          setting_key: string;
          setting_value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          setting_key?: string;
          setting_value?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      training_program_inquiries: {
        Row: {
          id: string;
          name: string;
          contact: number;
          company_name: string;
          company_email: string;
          industry: string | null;
          no_of_pax: number | null;
          duration: string | null;
          types_of_training: string[];
          estimated_training_month: string | null;
          budget: number | null;
          hrdc: boolean;
          preferred_location: string | null;
          language: string | null;
          remarks: string | null;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: number;
          company_name: string;
          company_email: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          types_of_training?: string[];
          estimated_training_month?: string | null;
          budget?: number | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: number;
          company_name?: string;
          company_email?: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          types_of_training?: string[];
          estimated_training_month?: string | null;
          budget?: number | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      csr_inquiries: {
        Row: {
          id: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry: string | null;
          no_of_pax: number | null;
          duration: string | null;
          estimated_event_month: string | null;
          budget: string | null;
          hrdc: boolean;
          preferred_location: string | null;
          language: string | null;
          remarks: string | null;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          company_name?: string;
          company_email?: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      team_building_inquiries: {
        Row: {
          id: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry: string | null;
          no_of_pax: number | null;
          duration: string | null;
          estimated_event_month: string | null;
          budget: string | null;
          hrdc: boolean;
          preferred_location: string | null;
          language: string | null;
          remarks: string | null;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          company_name?: string;
          company_email?: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      corporate_event_inquiries: {
        Row: {
          id: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry: string | null;
          no_of_pax: number | null;
          duration: string | null;
          estimated_event_month: string | null;
          budget: string | null;
          hrdc: boolean;
          preferred_location: string | null;
          language: string | null;
          remarks: string | null;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          company_name: string;
          company_email: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          company_name?: string;
          company_email?: string;
          industry?: string | null;
          no_of_pax?: number | null;
          duration?: string | null;
          estimated_event_month?: string | null;
          budget?: string | null;
          hrdc?: boolean;
          preferred_location?: string | null;
          language?: string | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      hero_images: {
        Row: {
          id: number;
          image_url: string;
          title: string | null;
          subtitle: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          image_url: string;
          title?: string | null;
          subtitle?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          image_url?: string;
          title?: string | null;
          subtitle?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      client_logos: {
        Row: {
          id: number;
          logo_url: string;
          company_name: string;
          website_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          logo_url: string;
          company_name: string;
          website_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          logo_url?: string;
          company_name?: string;
          website_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          category: string;
          description: string;
          long_description: string;
          featured_image_url: string;
          image_alt: string | null;
          type_id: string | null;
          technologies: string[];
          year: string;
          client: string;
          role: string | null;
          duration: string;
          outcome: string;
          metrics: {
            label: string;
            value: string;
            icon: string;
          }[];
          testimonial: {
            quote: string;
            author: string;
            position: string;
            company: string;
            avatar: string;
            alt: string;
          } | null;
          gallery: {
            url: string;
            alt: string;
            caption: string;
          }[];
          featured: boolean;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          category: string;
          description: string;
          long_description: string;
          featured_image_url: string;
          image_alt?: string | null;
          type_id?: string | null;
          technologies?: string[];
          year: string;
          client: string;
          role?: string | null;
          duration: string;
          outcome: string;
          metrics?: {
            label: string;
            value: string;
            icon: string;
          }[];
          testimonial?: {
            quote: string;
            author: string;
            position: string;
            company: string;
            avatar: string;
            alt: string;
          } | null;
          gallery?: {
            url: string;
            alt: string;
            caption: string;
          }[];
          featured?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          description?: string;
          long_description?: string;
          featured_image_url?: string;
          image_alt?: string | null;
          type_id?: string | null;
          technologies?: string[];
          year?: string;
          client?: string;
          role?: string | null;
          duration?: string;
          outcome?: string;
          metrics?: {
            label: string;
            value: string;
            icon: string;
          }[];
          testimonial?: {
            quote: string;
            author: string;
            position: string;
            company: string;
            avatar: string;
            alt: string;
          } | null;
          gallery?: {
            url: string;
            alt: string;
            caption: string;
          }[];
          featured?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_types: {
        Row: {
          id: string;
          type_key: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type_key: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type_key?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_gallery: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          alt: string | null;
          caption: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          url: string;
          alt?: string | null;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          url?: string;
          alt?: string | null;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
