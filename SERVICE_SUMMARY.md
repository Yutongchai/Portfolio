# Service Summary — EITO Group Website

## Basic Package

| # | Feature | Details |
|---|---------|---------|
| 1 | **Modern Website** | Built with React.js + Vite, TypeScript, Tailwind CSS |
| 2 | **Multiple Pages** | Home, About (Personal Story), Services (CSR, Team Building, Corporate Event, Training Program), Contact (Connection Hub) |
| 3 | **Responsive Design** | Fully optimized for Mobile, Tablet, and Laptop |
| 4 | **Social Media Links** | Instagram and WhatsApp integrated in header and footer |
| 5 | **Domain & Hosting** | Deployed on Vercel, connected to custom domain `www.eitogroup.com.my` |
| 6 | **1 Month Post-Launch Support** | Bug fixes included for 1 month after launch |

---

## Website Add-Ons

### SEO & Performance
- Meta tags, Open Graph, and Twitter Card configured for all pages
- JSON-LD structured data (Organization, Service, LocalBusiness schemas)
- Sitemap (`sitemap.xml`) and robots.txt
- Google Analytics (`G-J45HZDCVNQ`) integrated
- Umami Analytics integrated (privacy-friendly, public dashboard available)
- Image optimization (WebP conversion, lazy loading)
- Page speed optimizations (font preloading, code splitting)

### UI / UX Features
- Animated hero section with video background
- Client logo marquee (drag & scroll)
- Image hover scroll sections
- Cookie consent banner
- Page loader and scroll-to-top button
- Light/Dark theme support
- Custom 404 page

### Forms & Booking
- **Inquiry Forms** — CSR, Team Building, Corporate Event, Training Program
  - Multi-step questionnaire with validation
  - Data saved to Supabase database
  - Auto email notification sent to admin on every submission
- **Booking / Availability Calendar** (Connection Hub)
  - Customers can pick available time slots
  - Booking saved to database
  - Auto email confirmation sent to customer
  - Auto email notification sent to admin

### Email System (Resend)
- Branded HTML email templates (EITO logo, styled layout)
- Verified sending domain (`info@eitogroup.com.my`)
- Admin notification emails for all inquiry types and bookings
- Customer confirmation email for bookings

---

## Admin Panel

Access: `/admin` (login required)

### Core Features
- Secure login with email/password (Supabase Auth)
- Protected routes — admin-only access
- Dashboard with quick stats (hero images, logos, inquiries, bookings)
- Embedded Umami analytics dashboard

### Content Management
| Section | What You Can Do |
|---------|----------------|
| **Hero Images** | Upload, reorder, activate/deactivate background images |
| **Client Logos** | Add, edit, remove logos shown in the marquee |
| **Inquiries** | View all form submissions (CSR, Team Building, Corporate Event, Training) |
| **Bookings** | View all consultation bookings with customer details |

### Infrastructure
- Supabase backend (PostgreSQL database + file storage)
- Row Level Security (RLS) on all tables
- Supabase Edge Functions for email sending
- Environment-based secrets management (no keys in code)
