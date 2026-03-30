# EITO Group Portfolio

Modern, responsive portfolio website for EITO Group - a team building and corporate services company.

## 🚀 Features

- **Multi-page Navigation** with smooth transitions (no URL changes)
- **Dynamic Content** powered by Supabase CMS
- **Responsive Design** across all devices
- **Theme Support** with ThemeContext
- **Image Management** via Supabase Storage

## 📁 Project Structure

```
Portfolio/
├── public/              # Static assets
│   ├── events/         # Event photos
│   └── customers/      # Client logos
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/        # Button, Input, Header, Footer, etc.
│   ├── pages/         # Main page components
│   │   ├── personal-story-section/
│   │   ├── work-showcase/
│   │   └── connection-hub/
│   ├── contexts/      # React contexts (Theme)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities (Supabase storage, etc.)
│   ├── config/        # Configuration files
│   └── style/         # Global styles
├── supabase/
│   └── migrations/    # Database migrations
├── scripts/           # Utility scripts
└── docs/              # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion, GSAP
- **Backend**: Supabase (Database + Storage + Auth)
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run redeploy
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run migration file from `supabase/migrations/20260122_create_cms_tables.sql`
3. Create storage buckets:
   - `hero-images`
   - `client-logos`
   - `project-images`
4. Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

See [DATABASE_SCHEMA_GUIDE.md](DATABASE_SCHEMA_GUIDE.md) for detailed schema information.

## 🎨 Key Components

- **PillNav** - Animated navigation with pill-shaped buttons
- **Hero Section** - Dynamic background images from database
- **Client Dome Gallery** - 3D sphere of client logos
- **Work Showcase** - Project cards with detailed case studies
- **Connection Hub** - Contact forms and testimonials

## 🎨 Color Palette

consistent branding:
```
#fcb22f - Gold/Yellow
#e1620b - Orange (Accent)
#12a28f - Teal/Turquoise
#695da5 - Purple
#ee424c - Red/Coral
#0074b4 - Blue
#153462 - Navy (Primary)
#f68921 - Orange (Brand)
#79989f - Sage/Blue-Gray
#18616e - Teal/Dark
#103C61 - 
#FFEBD2 - 
```

## 📝 Content Management

Content is managed through Supabase tables:
- `hero_images` - Hero section backgrounds
- `client_logos` - Client portfolio
- `projects` - Work showcase projects
- `testimonials` - Client reviews
- `site_settings` - Global site content

## 🔐 Authentication

Admin features coming soon! Will use Supabase Auth for content management.

## 📄 License

Private project for EITO Group.

## 🤝 Contact

EITO Group - [info@eitogroup.com.my](mailto:info@eitogroup.com.my);

## for adding a new user use
INSERT INTO public.admin_users (user_id, email)
SELECT id, 'newadmin@example.com'
FROM auth.users
WHERE email = 'newadmin@example.com';

and use forget password to set the password
