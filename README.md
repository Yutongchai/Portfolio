# Portfolio Website

A modern, responsive portfolio website with a powerful no-code Content Management System (CMS) and dual-theme support.

## ✨ Features

### 🎨 Dual Theme System
- **Citrus Theme**: Energetic orange and yellow tones
- **Jewel Theme**: Sophisticated teal and purple tones
- Smooth theme transitions with one-click toggle
- Follows 60-30-10 color rule for professional design
- Theme preference persists across sessions

### 📱 Fully Responsive Design
- Mobile-first approach
- 6-tier breakpoint system (xs, sm, md, lg, xl, 2xl)
- Optimized for phones (320px+), tablets (768px+), and desktops (1024px+)
- Touch-friendly interactions
- Safe area support for notched devices

### 🛠️ No-Code CMS (Content Management System)
- **Visual Editing**: Edit content directly on your website
- **Inline Editors**: Click any text or image to edit
- **Image Management**: Upload images or use URLs
- **Export/Import**: Backup and restore your content
- **Password Protected**: Secure admin access
- **No Coding Required**: Perfect for non-technical users

### 🚀 Technical Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Context API** for state management
- **LocalStorage** for data persistence

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Quick Start: Using the CMS

### 1. Access Admin Panel
- Look for the **⚙️ Settings button** in the bottom-right corner
- Click it and login with password: `admin123`

### 2. Enable Edit Mode
- Toggle **Edit Mode** to ON (turns green)
- Now you can edit content!

### 3. Edit Content
- **Text**: Click any text → Type changes → Press Enter
- **Images**: Click any image → Upload or paste URL → Save

### 4. Backup Your Work
- Settings → Export Content → Download JSON
- **Always backup before major changes!**

**For detailed instructions, see:** [CMS_QUICK_START.md](./CMS_QUICK_START.md)

## 📚 Documentation

### User Guides
- **[CMS Quick Start](./CMS_QUICK_START.md)** - Get started in 5 minutes
- **[CMS User Guide](./CMS_USER_GUIDE.md)** - Complete user manual
- **[Color Reference](./COLOR_REFERENCE.md)** - Theme colors and usage

### Developer Guides
- **[CMS Technical Guide](./CMS_TECHNICAL_GUIDE.md)** - Architecture and implementation
- **[Theme System](./THEME_SYSTEM.md)** - Theme implementation details
- **[Responsive Design Guide](./RESPONSIVE_IMPLEMENTATION_GUIDE.md)** - Responsive system overview

## 🎨 Theme System

### Citrus Theme (Default)
- **Primary**: Warm oranges and yellows
- **Accent**: Energetic red
- **Perfect for**: Creative, energetic, approachable feel

### Jewel Theme
- **Primary**: Rich teals and purples
- **Accent**: Professional blue
- **Perfect for**: Sophisticated, elegant, professional feel

**Toggle themes** using the button in the header (sun ☀️ / gem 💎 icon)

## 📂 Project Structure

```
Portfolio/
├── src/
│   ├── components/
│   │   ├── admin/              # CMS components
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── InlineTextEditor.tsx
│   │   │   └── InlineImageEditor.tsx
│   │   ├── ui/                 # UI components
│   │   │   ├── Header.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   ├── ThemeContext.tsx
│   │   ├── ContentContext.tsx
│   │   └── AdminContext.tsx
│   ├── pages/                  # Page components
│   │   ├── personal-story-section/
│   │   ├── work-showcase/
│   │   └── connection-hub/
│   ├── style/                  # Global styles
│   │   ├── index.css
│   │   └── tailwind.css
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── docs/                       # Documentation
│   ├── CMS_QUICK_START.md
│   ├── CMS_USER_GUIDE.md
│   ├── CMS_TECHNICAL_GUIDE.md
│   └── ...
└── ...
```

## 🔧 Configuration

### Changing Admin Password

**⚠️ Important: Change this before deploying to production!**

Edit [src/contexts/AdminContext.tsx](src/contexts/AdminContext.tsx):

```tsx
// Change this line:
const ADMIN_PASSWORD = 'admin123';

// To your secure password:
const ADMIN_PASSWORD = 'your-secure-password-here';
```

### Customizing Themes

Edit [src/style/index.css](src/style/index.css) to customize colors:

```css
.citrus {
  --color-primary: #fcb22f;      /* Change primary color */
  --color-secondary: #e1620b;    /* Change secondary color */
  /* ... other colors */
}
```

### Adding Custom Breakpoints

Edit [tailwind.config.js](tailwind.config.js):

```js
theme: {
  screens: {
    'xs': '320px',
    'sm': '640px',
    // Add your custom breakpoint:
    'tablet': '900px',
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy (it auto-detects Vite config)

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Manual Deployment

```bash
npm run build
# Upload the 'dist' folder to your hosting
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Content Management

### Editable Content Types

- **Personal Info**: Name, title, bio, image, contact details
- **Projects**: Title, description, images, links, technologies
- **Skills**: Name, proficiency level, category
- **Core Values**: Title, description
- **Social Links**: Platform, URL

### Storage

All content is stored in browser localStorage. For production:
- Consider using a backend API
- See [CMS_TECHNICAL_GUIDE.md](./CMS_TECHNICAL_GUIDE.md) for migration guide

## 🔒 Security

### Current Implementation
- Client-side password protection
- Content stored in localStorage
- **Good for**: Personal portfolios, development

### Production Recommendations
- Change default password
- Implement server-side authentication
- Use environment variables
- Add rate limiting
- Enable HTTPS

## 📊 Performance

### Optimizations
- Code splitting with React lazy loading
- Image optimization recommendations
- CSS purging with TailwindCSS
- Vite's fast HMR in development
- Optimized production builds

### Best Practices
- Keep images under 500KB
- Use WebP format when possible
- Lazy load images below the fold
- Minimize number of custom fonts

## 🐛 Troubleshooting

### Content not saving
- Check that Edit Mode is ON
- Press Enter/Ctrl+Enter to save
- Check browser console for errors

### Images not loading
- Verify image URL is correct and public
- Check image file size (keep under 2MB)
- Try re-uploading the image

### Theme not changing
- Check browser console for errors
- Clear localStorage and refresh
- Verify ThemeProvider is wrapping App

### Lost content
- Import your latest backup (Settings → Import)
- Check localStorage in DevTools
- Use Reset to Default as last resort

**For more help, see:** [CMS_USER_GUIDE.md](./CMS_USER_GUIDE.md)

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or support, please open an issue in this repository.

---

## 🎉 Quick Links

- 📖 [CMS Quick Start Guide](./CMS_QUICK_START.md)
- 📘 [Full CMS User Guide](./CMS_USER_GUIDE.md)
- 🛠️ [Technical Documentation](./CMS_TECHNICAL_GUIDE.md)
- 🎨 [Theme System Guide](./THEME_SYSTEM.md)
- 📱 [Responsive Design Guide](./RESPONSIVE_IMPLEMENTATION_GUIDE.md)
- 🌈 [Color Reference](./COLOR_REFERENCE.md)

---

**Built with ❤️ using React, TypeScript, and TailwindCSS**
