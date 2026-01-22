# Content Management System (CMS) User Guide

## Overview

Your portfolio now includes a powerful no-code content management system that allows you to edit all content directly on your website without touching any code. This guide will walk you through using the CMS features.

## Getting Started

### Accessing the Admin Panel

1. **Locate the Admin Button**: Look for the floating settings button in the bottom-right corner of your website
2. **Login**: Click the button and enter the admin password (default: `admin123`)
3. **Enable Edit Mode**: Once logged in, toggle "Edit Mode" to ON in the admin panel

### Default Credentials

```
Password: admin123
```

> **Security Note**: Change the password in `src/contexts/AdminContext.tsx` for production use.

## Editing Content

### Text Editing

When Edit Mode is enabled, all editable text will show a dashed border when you hover over it:

1. **Click any text** you want to edit
2. **Type your changes** directly in the input field
3. **Press Enter** to save (or Ctrl+Enter for multi-line text)
4. **Press Escape** to cancel

**Text Field Types:**
- **Single Line**: Names, titles, taglines (press Enter to save)
- **Multi Line**: Bios, descriptions, paragraphs (press Ctrl+Enter to save)

### Image Editing

1. **Click on any image** while in Edit Mode
2. Choose one of two options:
   - **Enter URL**: Paste an image URL from the web
   - **Upload File**: Choose an image from your computer

3. **Preview** the image before saving
4. **Click "Save Image"** to apply changes

> **Note**: Uploaded images are stored as base64 in browser storage. For large images or production sites, consider using an image hosting service like Cloudinary or Imgix.

## Admin Panel Features

### 1. Edit Mode Toggle

- **ON (Green)**: Shows edit indicators on all editable content
- **OFF (Gray)**: Normal viewing mode, no editing allowed

### 2. Export Content

**Purpose**: Create a backup of all your content

**How to Use:**
1. Click "Export Content" in the admin panel
2. Review the JSON preview
3. Click "Download JSON File"
4. Save the file to your computer

**When to Use:**
- Before making major changes
- To backup your content
- To transfer content between devices
- To version control your content

### 3. Import Content

**Purpose**: Restore content from a backup

**How to Use:**
1. Click "Import Content" in the admin panel
2. Paste the JSON content from your backup file
3. Click "Import Content"
4. Confirm the import

**Use Cases:**
- Restoring from backup
- Transferring content between environments
- Undoing unwanted changes

### 4. Reset to Default

**Purpose**: Restore all content to original defaults

**How to Use:**
1. Click "Reset to Default"
2. Confirm the action (⚠️ This cannot be undone!)
3. All content returns to initial state

**Warning**: This will permanently delete all your customizations!

## Content Structure

### Personal Information

**Editable Fields:**
- Name
- Title
- Tagline
- Bio
- Profile Image
- Email
- Phone
- Location

**Where to Edit**: Home page hero section

### Projects

**Editable Fields Per Project:**
- Title
- Description
- Category
- Tags
- Images
- GitHub Link
- Live Demo Link
- Technologies Used
- Year

**Where to Edit**: Work Showcase section

### Skills

**Editable Fields Per Skill:**
- Skill Name
- Proficiency Level (0-100)
- Category
- Icon

**Where to Edit**: Personal Story section

### Core Values

**Editable Fields Per Value:**
- Title
- Description
- Icon

**Where to Edit**: Philosophy section

### Social Links

**Editable Fields Per Link:**
- Platform Name
- URL
- Icon

**Where to Edit**: Connection Hub footer

## Best Practices

### 1. Content Editing

✅ **Do:**
- Make small changes and save frequently
- Preview changes before finalizing
- Keep backups of your content
- Use descriptive text
- Optimize images before uploading

❌ **Don't:**
- Make too many changes at once
- Use extremely large images (keep under 500KB)
- Forget to save your changes
- Edit without creating a backup first

### 2. Image Management

**Recommended Image Sizes:**
- Profile Photos: 800x800px
- Project Images: 1200x800px
- Icons: 100x100px
- Thumbnails: 400x300px

**File Formats:**
- Use JPEG for photos
- Use PNG for graphics with transparency
- Use SVG for icons (when possible)
- Use WebP for modern browsers (best compression)

**Optimization:**
- Compress images before uploading
- Use tools like TinyPNG or Squoosh
- Aim for under 200KB per image

### 3. Content Backup Strategy

1. **Export weekly** (minimum)
2. **Save exports** with date in filename
3. **Keep multiple versions** (at least 3)
4. **Test imports** periodically to ensure backups work

### 4. Writing Content

**Effective Descriptions:**
- Be concise (2-3 sentences)
- Focus on impact and results
- Use active voice
- Include relevant keywords
- Show, don't just tell

**Professional Tone:**
- Maintain consistency across all content
- Use industry-standard terminology
- Proofread before saving
- Avoid jargon when possible

## Storage & Persistence

### How Content is Saved

All your edits are automatically saved to your browser's localStorage:

- **Storage Location**: Browser localStorage
- **Persistence**: Survives page reloads and browser restarts
- **Scope**: Per browser, per device
- **Capacity**: ~5-10MB depending on browser

### Important Storage Notes

⚠️ **Browser-Specific**: Content is stored per browser. If you switch browsers, you'll need to export/import content.

⚠️ **Device-Specific**: Content is stored per device. Moving to a new computer requires export/import.

⚠️ **Clearing Browser Data**: Clearing browser cache/storage will delete all content. Always keep backups!

⚠️ **Private/Incognito Mode**: Changes won't persist after closing the browser.

## Troubleshooting

### Issue: Changes Not Saving

**Solutions:**
1. Check that Edit Mode is ON
2. Ensure you're clicking the Save button
3. Check browser console for errors
4. Try refreshing the page
5. Export content, clear storage, re-import

### Issue: Images Not Loading

**Solutions:**
1. Verify the image URL is correct
2. Check if the URL is publicly accessible
3. Try re-uploading the image
4. Reduce image file size
5. Use a different image host

### Issue: Lost Content

**Solutions:**
1. Check if you have a recent export file
2. Import from your backup
3. Check browser localStorage using DevTools
4. Reset to default as last resort

### Issue: Admin Panel Not Appearing

**Solutions:**
1. Check that you've added AdminPanel to App.tsx
2. Verify all contexts are properly wrapped
3. Check browser console for errors
4. Clear browser cache and refresh

## Advanced Features

### Keyboard Shortcuts

- **Enter**: Save single-line text
- **Ctrl/Cmd + Enter**: Save multi-line text
- **Escape**: Cancel editing
- **Tab**: Move to next field (when multiple editors are open)

### Browser Developer Tools

For advanced users, you can directly edit content in browser storage:

1. Open Developer Tools (F12)
2. Go to Application > Storage > Local Storage
3. Find `portfolio-content` key
4. Edit JSON directly
5. Refresh page

> **Warning**: Only do this if you understand JSON structure. Invalid JSON will break the site.

## Security Considerations

### Password Protection

The CMS includes basic password protection, but it's **client-side only**:

✅ **Good for:**
- Personal portfolios
- Preventing accidental edits
- Local development

❌ **Not sufficient for:**
- Production websites with multiple users
- Protecting sensitive data
- Public-facing admin panels

### Production Recommendations

For production websites:

1. **Change the default password** in `AdminContext.tsx`
2. **Remove the default password hint** from login screen
3. **Consider server-side authentication** for real security
4. **Use environment variables** for sensitive data
5. **Implement rate limiting** to prevent brute force
6. **Add HTTPS** to encrypt data transmission

## Next Steps

### Extending the CMS

The CMS is built with modularity in mind. You can easily:

1. **Add new content types** in `ContentContext.tsx`
2. **Create custom editors** following the inline editor pattern
3. **Add rich text editing** with libraries like Draft.js or Slate
4. **Implement image cropping** with libraries like react-image-crop
5. **Add version history** by storing multiple content snapshots

### Integration with Backend

To persist content to a database:

1. **Replace localStorage** with API calls in `ContentContext.tsx`
2. **Add authentication endpoint** in `AdminContext.tsx`
3. **Implement proper CRUD** operations with your backend
4. **Add loading states** for async operations
5. **Handle errors gracefully** with user-friendly messages

### Popular Backend Options

- **Headless CMS**: Strapi, Contentful, Sanity
- **Backend as a Service**: Firebase, Supabase, AWS Amplify
- **Custom API**: Node.js + Express, Python + FastAPI, Go + Gin

## Support & Resources

### File Locations

- **Admin Panel**: `src/components/admin/AdminPanel.tsx`
- **Text Editor**: `src/components/admin/InlineTextEditor.tsx`
- **Image Editor**: `src/components/admin/InlineImageEditor.tsx`
- **Content Context**: `src/contexts/ContentContext.tsx`
- **Admin Context**: `src/contexts/AdminContext.tsx`

### Need Help?

1. Check this guide first
2. Review the code comments
3. Check browser console for errors
4. Review the implementation in example components

## Summary

Your portfolio CMS provides:

✅ No-code editing for all content
✅ Inline editing with visual feedback
✅ Image upload and URL management
✅ Export/Import for backup
✅ Reset to defaults
✅ Browser-based storage
✅ Secure admin authentication

**Remember:**
- Always backup before major changes
- Keep your backups organized
- Test imports periodically
- Optimize images before upload
- Write clear, concise content

Happy editing! 🎨
