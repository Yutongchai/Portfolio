// SEO Configuration for EITO Group
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image: string;
  twitterHandle?: string;
  locale: string;
  type: string;
}

export const BASE_URL = "https://eitogroup.com.my"; 
// Default SEO Configuration
export const defaultSEO: SEOConfig = {
  title: "EITO Group | HRDC Claimable Team Building & Training Malaysia",
  description: "Corporate team building and HRDC claimable training in Malaysia designed to improve communication, leadership and workplace performance.",
  keywords: [
    "HRDC claimable training Malaysia",
    "improve workplace performance",
    // Primary Keywords
    "team building Malaysia",
    "corporate training Malaysia",
    "leadership training programs",
    "team building activities",
    
    // Service-specific Keywords
    "corporate team building events",
    "employee engagement programs",
    "CSR programs Malaysia",
    "training and development Malaysia",
    "team building facilitator",
    "corporate coaching services",
    
    // Location-based Keywords
    "team building KL",
    "corporate training Kuala Lumpur",
    "team building Selangor",
    
    // Long-tail Keywords
    "best team building company Malaysia",
    "corporate training programs for employees",
    "professional team building facilitator",
    "outdoor team building activities Malaysia",
  ],
  url: BASE_URL,
  image: `${BASE_URL}/EITO-bw.webp`,
  locale: "en_US",
  type: "website",
};

// Page-specific SEO Configurations
export const pageSEO = {
  home: {
    title: "EITO Group | #1 Corporate Team Building & Training Malaysia",
    description: "Corporate team building and HRDC claimable training in Malaysia designed to improve communication, leadership and workplace performance.",
    keywords: [
      ...defaultSEO.keywords,
      "Corporate team building",
      "HRDC claimable training in Malaysia",
      "improve workplace performance",
    ],
    url: BASE_URL,
    type: "website",
  },
  
  /* workShowcase: {
    title: "Our Work & Success Stories | EITO Group",
    description: "Explore EITO Group's portfolio of successful team building events and training programs. See how we've helped companies like Petronas, AirAsia, and Maxis transform their teams.",
    keywords: [
      "team building case studies",
      "corporate training success stories",
      "team building portfolio Malaysia",
      "corporate event gallery",
    ],
    url: `${BASE_URL}/work-showcase`,
    type: "website",
  }, */
  
  personalStory: {
    title: "About Our Team Building Experts | EITO Group",
    description: "Meet the passionate team behind EITO Group. Learn about our founder's journey and our mission to transform corporate teams through innovative training and team building programs.",
    keywords: [
      "team building facilitator Malaysia",
      "corporate trainer profile",
      "team building expert",
      "leadership coach Malaysia",
    ],
    url: `${BASE_URL}/personal-story-section`,
    type: "profile",
  },
  
  connectionHub: {
    title: "Book a Consultation | Team Building Experts Malaysia",
    description: "Schedule a free consultation with EITO Group's team building experts. Get customized solutions for your corporate training, team building events, and CSR programs. Available via WhatsApp, email, or direct booking.",
    keywords: [
      "book team building consultation",
      "corporate training inquiry",
      "team building quote Malaysia",
      "schedule team building event",
    ],
    url: `${BASE_URL}/connection-hub`,
    type: "website",
  },

  csr: {
    title: "CSR Programs Malaysia | Community & Environmental Initiatives | EITO Group",
    description: "EITO Group designs impactful Corporate Social Responsibility programs in Malaysia — community outreach, environmental initiatives, and employee volunteerism tailored to your brand values.",
    keywords: [
      "CSR programs Malaysia",
      "corporate social responsibility activities",
      "employee volunteering Malaysia",
      "community engagement program",
      "environmental CSR initiative",
    ],
    url: `${BASE_URL}/services/csr`,
    type: "website",
  },

  teamBuilding: {
    title: "Team Building Activities Malaysia | EITO Group",
    description: "Energize your workforce with EITO Group's corporate team building activities in Malaysia. From adventure challenges to leadership workshops — fully customizable for any team size.",
    keywords: [
      "team building activities Malaysia",
      "corporate team building events",
      "outdoor team building Malaysia",
      "employee engagement activities",
      "leadership team building",
    ],
    url: `${BASE_URL}/services/team-building`,
    type: "website",
  },

  corporateEvent: {
    title: "Corporate Event Management Malaysia | EITO Group",
    description: "From annual dinners to family days and sports events — EITO Group delivers seamless corporate event experiences in Malaysia that celebrate your people and strengthen your culture.",
    keywords: [
      "corporate event management Malaysia",
      "annual dinner organizer Malaysia",
      "family day event Malaysia",
      "corporate sports day",
      "company event planner KL",
    ],
    url: `${BASE_URL}/services/corporate-event`,
    type: "website",
  },

  trainingProgram: {
    title: "HRDC Claimable Corporate Training Malaysia | EITO Group",
    description: "Upskill your team with EITO Group's HRDC claimable training programs in Malaysia — soft skills, leadership, mental health, and more. Customized for your industry and team size.",
    keywords: [
      "HRDC claimable training Malaysia",
      "corporate training programs Malaysia",
      "soft skills training Malaysia",
      "leadership development program",
      "mental health workplace training",
    ],
    url: `${BASE_URL}/services/training-program`,
    type: "website",
  },
};

// Structured Data (JSON-LD) for Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EITO Group",
  "description": "Corporate team building and HRDC claimable training in Malaysia designed to improve communication, leadership and workplace performance.",
  "url": BASE_URL,
  "logo": `${BASE_URL}/EITO-bw.webp`,
  "image": `${BASE_URL}/EITO-bw.webp`,
  "email": "info@eitogroup.com",
  "telephone": "+60163287947",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MY",
    "addressLocality": "Kuala Lumpur",
    "addressRegion": "Federal Territory of Kuala Lumpur",
  },
  "sameAs": [
    "https://www.instagram.com/eitogroup/",
    "https://wa.me/60163287947",
  ],
  "founder": {
    "@type": "Person",
    "name": "Chow Wyen Dee",
    "jobTitle": "Founder & Chief Facilitator",
  },
  "areaServed": {
    "@type": "Country",
    "name": "Malaysia",
  },
  "serviceType": [
    "Corporate Team Building",
    "Leadership Training",
    "Corporate Training Programs",
    "CSR Programs",
    "Team Development",
    "Employee Engagement",
  ],
};

// Service Schema for better SEO
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Corporate Team Building & Training",
  "provider": {
    "@type": "Organization",
    "name": "EITO Group",
    "url": BASE_URL,
  },
  "areaServed": {
    "@type": "Country",
    "name": "Malaysia",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Team Building & Training Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Corporate Team Building Events",
          "description": "Customized team building activities and events for corporate organizations",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Leadership Training Programs",
          "description": "Professional leadership development and training programs",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "CSR Programs",
          "description": "Corporate Social Responsibility programs and team activities",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Employee Engagement Programs",
          "description": "Enhance employee engagement and team collaboration",
        },
      },
    ],
  },
};

// Local Business Schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "EITO Group",
  "image": `${BASE_URL}/EITO-bw.webp`,
  "telephone": "+60163287947",
  "email": "info@eitogroup.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MY",
    "addressLocality": "Kuala Lumpur",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "3.139003",
    "longitude": "101.686855",
  },
  "url": BASE_URL,
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00",
    },
  ],
};
