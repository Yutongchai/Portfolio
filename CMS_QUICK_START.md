# Quick Start Guide: Content Management System

## 🚀 Getting Started in 5 Minutes

Your portfolio now has a powerful no-code content editor! Here's how to use it.

## Step 1: Login (30 seconds)

1. Look at the **bottom-right corner** of your website
2. Click the **floating ⚙️ Settings button**
3. Enter password: `admin123`
4. Click **Login**

![Admin Button Location](https://via.placeholder.com/400x300/fcb22f/ffffff?text=Bottom+Right+Corner)

## Step 2: Enable Edit Mode (10 seconds)

1. Click the **Settings button** again
2. Toggle **Edit Mode** to **ON** (it turns green ✅)
3. Now you're ready to edit!

![Edit Mode Toggle](https://via.placeholder.com/400x200/12a28f/ffffff?text=Toggle+Edit+Mode+ON)

## Step 3: Edit Your Content (2 minutes)

### Editing Text

1. **Hover** over any text on your page
2. You'll see a **dashed border** appear
3. **Click** the text
4. **Type** your changes
5. **Press Enter** to save (or Ctrl+Enter for paragraphs)

**Example:**
- Edit your name in the hero section
- Update your job title
- Change your bio

### Editing Images

1. **Hover** over any image
2. You'll see "Click to change image"
3. **Click** the image
4. Choose one option:
   - **Paste a URL** from the web
   - **Upload a file** from your computer
5. **Click "Save Image"**

**Tips:**
- Use images under 500KB for best performance
- Recommended sizes: 800x800px for profiles, 1200x800px for projects

## Step 4: Backup Your Work (30 seconds)

**Always backup before major changes!**

1. Click the **Settings button**
2. Click **"Export Content"**
3. Click **"Download JSON File"**
4. Save it somewhere safe (Desktop, Cloud storage, etc.)

## Step 5: Continue Editing

You can now edit:

- ✏️ **Personal Info**: Name, title, bio, image
- 📁 **Projects**: Titles, descriptions, images, links
- 🛠️ **Skills**: Names, proficiency levels
- 💡 **Values**: Titles, descriptions
- 🔗 **Social Links**: Platform names, URLs

## ⚠️ Important Tips

### Do This:
✅ Backup weekly (at minimum)
✅ Save backups with dates (e.g., `portfolio-2024-01-15.json`)
✅ Test your changes on mobile
✅ Keep images under 500KB
✅ Write clear, concise content

### Don't Do This:
❌ Clear browser data without backing up first
❌ Upload huge images (over 2MB)
❌ Make too many changes without saving
❌ Forget to toggle Edit Mode OFF when done

## 🆘 Quick Troubleshooting

### "I can't see the edit borders"
→ Make sure **Edit Mode is ON** (green toggle)

### "My changes didn't save"
→ Press **Enter** (single line) or **Ctrl+Enter** (paragraph) to save

### "I lost my content!"
→ Import your latest backup:
1. Settings → Import Content
2. Paste your backup JSON
3. Click Import

### "Images won't load"
→ Check the image URL is correct and publicly accessible

## 📱 Mobile Editing

Yes, you can edit on mobile too!

1. Use the same steps above
2. Tap instead of click
3. For images, you can upload from your phone's camera or gallery

## 🎓 Learn More

- **Full User Guide**: See `CMS_USER_GUIDE.md` for detailed instructions
- **Technical Guide**: See `CMS_TECHNICAL_GUIDE.md` for developer information
- **Color System**: See `COLOR_REFERENCE.md` for theme colors

## 🔒 Security Note

**Change the default password before deploying to production!**

Edit `src/contexts/AdminContext.tsx`:

```tsx
// Change this line:
const ADMIN_PASSWORD = 'admin123';  // ← Change to your password

// To:
const ADMIN_PASSWORD = 'your-secure-password-here';
```

## 📋 Common Tasks

### Task: Update Your Profile Photo
1. Enable Edit Mode
2. Click your profile image
3. Upload new image or paste URL
4. Click "Save Image"

### Task: Add a New Project
*Coming in next update - use ContentContext API for now*

### Task: Change Your Bio
1. Enable Edit Mode
2. Click your bio text
3. Type new bio (max ~500 characters recommended)
4. Press Ctrl+Enter to save

### Task: Export All Content
1. Settings → Export Content
2. Download JSON File
3. Save with today's date

### Task: Restore from Backup
1. Settings → Import Content
2. Paste your backup JSON
3. Click Import Content
4. Confirm

## 🎉 That's It!

You're now ready to manage your portfolio content without touching code!

**Remember:**
- Edit Mode ON = You can edit
- Edit Mode OFF = Normal viewing
- Always backup before major changes

**Need help?** Check the full guides in your project folder.

---

## Next Steps

1. ✅ Login to the admin panel
2. ✅ Enable Edit Mode
3. ✅ Update your name and title
4. ✅ Change your profile photo
5. ✅ Edit your bio
6. ✅ Export a backup
7. ✅ Toggle Edit Mode OFF

**Happy editing!** 🎨✨
