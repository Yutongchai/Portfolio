# Database Schema Guide

## Overview
This database schema is designed to support a fully manageable CMS for your portfolio website. Authenticated users can add, edit, and delete all content through an admin interface.

## Tables Structure

### 1. **hero_images** - Hero Section Background Images
Manages the rotating/changing background images in the Personal Story Section hero.

**Fields:**
- `id`: Unique identifier
- `title`: Image title (for admin reference)
- `image_url`: Path to the image
- `alt_text`: Accessibility text
- `display_order`: Order of appearance
- `is_active`: Show/hide toggle
- `created_at`, `updated_at`: Timestamps

**Usage:**
```javascript
// Fetch active hero images
const { data: heroImages } = await supabase
  .from('hero_images')
  .select('*')
  .eq('is_active', true)
  .order('display_order');
```

---

### 2. **client_logos** - Client Dome Gallery
Stores all client logos that appear in the 3D sphere/dome gallery.

**Fields:**
- `company_name`: Client company name
- `logo_url`: Path to logo image
- `website_url`: Optional client website link
- `display_order`: Position in gallery

**Usage:**
```javascript
// Fetch all active client logos
const { data: logos } = await supabase
  .from('client_logos')
  .select('*')
  .eq('is_active', true)
  .order('display_order');
```

---

### 3. **projects** - Work Showcase Projects
Main table for all portfolio projects/case studies.

**Fields:**
- `slug`: URL-friendly identifier (e.g., "advelsoft-team-building")
- `title`: Project name
- `category`: Project type (Team Building, CSR, Workshop, etc.)
- `description`: Short description (for cards)
- `long_description`: Full project details
- `featured_image_url`: Main project image
- `year`, `client`, `role`, `duration`: Project metadata
- `challenge`, `solution`, `outcome`: Case study sections
- `is_featured`: Highlight this project
- `is_active`: Show/hide toggle

**Usage:**
```javascript
// Fetch all active projects
const { data: projects } = await supabase
  .from('projects')
  .select(`
    *,
    project_metrics(*),
    project_technologies(*),
    project_images(*)
  `)
  .eq('is_active', true)
  .order('display_order');
```

---

### 4. **project_metrics** - Project Statistics
Related to projects - shows key achievements (e.g., "50% Engagement Increase").

**Fields:**
- `project_id`: Links to projects table
- `label`: Metric name
- `value`: Metric value
- `icon`: Icon name to display

---

### 5. **project_technologies** - Project Tags
Technologies/methods used in each project.

**Fields:**
- `project_id`: Links to projects table
- `technology_name`: Tag name (e.g., "Community Engagement")

---

### 6. **project_images** - Project Gallery
Additional images for each project (gallery/slideshow).

**Fields:**
- `project_id`: Links to projects table
- `image_url`: Image path
- `caption`: Optional image description

---

### 7. **testimonials** - Client Testimonials
Customer reviews and testimonials.

**Fields:**
- `author_name`: Person's name
- `author_title`: Job title
- `company`: Company name
- `avatar_url`: Profile picture
- `quote`: Testimonial text
- `rating`: 1-5 star rating

---

### 8. **site_settings** - General Site Content
Key-value pairs for site-wide settings (titles, contact info, etc.).

**Fields:**
- `setting_key`: Unique identifier (e.g., "site_title")
- `setting_value`: The actual value
- `setting_type`: text, json, number, boolean

**Usage:**
```javascript
// Get site title
const { data } = await supabase
  .from('site_settings')
  .select('setting_value')
  .eq('setting_key', 'site_title')
  .single();
```

---

### 9. **media_library** - Centralized Media Management
All uploaded images/files in one place for easy reuse.

**Fields:**
- `file_name`: Original filename
- `file_url`: Storage path
- `file_type`: image, video, document
- `folder`: Categorization (hero, clients, projects, etc.)

---

## Security (Row Level Security)

**Public Users (Visitors):**
- ✅ Can view all active content
- ❌ Cannot add, edit, or delete anything

**Authenticated Users (Admins):**
- ✅ Full access to all content
- ✅ Can add, edit, delete everything
- ✅ Can manage media library

---

## Setup Instructions

### 1. Run the Migration
```bash
# In Supabase Dashboard -> SQL Editor, paste and run the migration file
# Or use Supabase CLI:
supabase db push
```

### 2. Set Up Storage Buckets
In Supabase Dashboard -> Storage, create buckets:
- `hero-images`
- `client-logos`
- `project-images`
- `testimonials`

Make them public for read access.

### 3. Update Image Upload
Configure your upload functions to use Supabase Storage:

```javascript
// Example: Upload to Supabase Storage
async function uploadImage(file, bucket) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
```

---

## Admin Interface TODO

You'll need to build admin pages for:

1. **Hero Images Manager**
   - Upload/delete background images
   - Reorder images
   - Toggle active/inactive

2. **Client Logos Manager**
   - Add/remove client logos
   - Edit company details
   - Reorder in gallery

3. **Projects Manager**
   - Create new project cards
   - Edit project details
   - Add/remove metrics, technologies, gallery images
   - Toggle featured/active status

4. **Testimonials Manager**
   - Add/edit testimonials
   - Upload avatars

5. **Site Settings**
   - Edit site-wide content
   - Update contact information

---

## Example Queries

### Add a new project:
```javascript
const { data, error } = await supabase
  .from('projects')
  .insert({
    slug: 'new-project-slug',
    title: 'New Project',
    category: 'Team Building',
    description: 'Short description',
    featured_image_url: '/path/to/image.jpg',
    is_active: true
  });
```

### Update hero image order:
```javascript
await supabase
  .from('hero_images')
  .update({ display_order: 2 })
  .eq('id', imageId);
```

### Delete a client logo:
```javascript
await supabase
  .from('client_logos')
  .delete()
  .eq('id', logoId);
```

---

## Next Steps

1. ✅ Run the migration file in Supabase
2. Create storage buckets for images
3. Build admin authentication (use Supabase Auth)
4. Create admin UI components for managing content
5. Connect your existing pages to fetch from Supabase instead of hardcoded data
