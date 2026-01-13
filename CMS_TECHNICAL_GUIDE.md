# CMS Technical Implementation Guide

## Architecture Overview

The CMS (Content Management System) is built with a clean, modular architecture that separates concerns and makes it easy to extend.

```
┌─────────────────────────────────────────────┐
│              App Component                   │
│  (Wraps everything with providers)           │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬─────────────┬────────────┐
        │                       │             │            │
┌───────▼────────┐    ┌────────▼───────┐  ┌─▼──────┐  ┌─▼────────┐
│ ThemeProvider  │    │ AdminProvider   │  │Content │  │  Admin   │
│                │    │                 │  │Provider│  │  Panel   │
└────────────────┘    └─────────────────┘  └────────┘  └──────────┘
                              │                 │
                    ┌─────────┴─────────┐      │
                    │                   │      │
              ┌─────▼──────┐    ┌──────▼──────▼───┐
              │ isEditMode │    │   CMS Content    │
              │ isAuth     │    │   (localStorage) │
              └────────────┘    └──────────────────┘
                    │                   │
            ┌───────┴────────┬─────────┴──────────┐
            │                │                    │
    ┌───────▼──────┐  ┌─────▼────────┐  ┌───────▼──────┐
    │   Inline     │  │   Inline     │  │   Project    │
    │   Text       │  │   Image      │  │   Editor     │
    │   Editor     │  │   Editor     │  │   (Future)   │
    └──────────────┘  └──────────────┘  └──────────────┘
```

## Core Components

### 1. Context System

#### AdminContext (`src/contexts/AdminContext.tsx`)

**Purpose**: Manages authentication and edit mode state

**State:**
```typescript
interface AdminContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleEditMode: () => void;
}
```

**Key Features:**
- Password-based authentication
- Edit mode toggle
- Persists auth state to localStorage
- Provides hooks for components

**Usage:**
```tsx
import { useAdmin } from '../../contexts/AdminContext';

const MyComponent = () => {
  const { isEditMode, isAuthenticated, toggleEditMode } = useAdmin();
  
  return (
    <div>
      {isEditMode && <EditControls />}
    </div>
  );
};
```

#### ContentContext (`src/contexts/ContentContext.tsx`)

**Purpose**: Manages all editable content and CRUD operations

**Content Structure:**
```typescript
interface CMSContent {
  personal: PersonalContent;
  projects: Project[];
  skills: Skill[];
  coreValues: CoreValue[];
  socialLinks: SocialLink[];
}
```

**Key Features:**
- Centralized content management
- CRUD operations for all content types
- Export/Import functionality
- Reset to defaults
- Persists to localStorage
- Type-safe content structure

**Usage:**
```tsx
import { useContent } from '../../contexts/ContentContext';

const MyComponent = () => {
  const { content, updatePersonal, addProject } = useContent();
  
  return (
    <div>
      <h1>{content.personal.name}</h1>
      <button onClick={() => updatePersonal({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
};
```

### 2. Admin Panel (`src/components/admin/AdminPanel.tsx`)

**Purpose**: Main control panel for CMS operations

**Features:**
- Floating action button (FAB) for quick access
- Login modal with password protection
- Edit mode toggle switch
- Export content to JSON file
- Import content from JSON
- Reset to default content
- Logout functionality

**Visual States:**
- **Not Authenticated**: Shows login button
- **Authenticated**: Shows admin panel with options
- **Edit Mode ON**: Green indicator on FAB
- **Edit Mode OFF**: Primary color on FAB

**Component Structure:**
```tsx
<AdminPanel>
  ├── Floating Action Button (FAB)
  ├── Login Modal (when not authenticated)
  └── Admin Panel (when authenticated)
      ├── Edit Mode Toggle
      ├── Export Content Button
      ├── Import Content Button
      ├── Reset to Default Button
      └── Logout Button
</AdminPanel>
```

### 3. Inline Editors

#### InlineTextEditor (`src/components/admin/InlineTextEditor.tsx`)

**Purpose**: Editable text fields with visual indicators

**Props:**
```typescript
interface InlineTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
}
```

**Behavior:**
- **View Mode**: Shows text with hover indicator
- **Edit Mode**: Shows input/textarea with save/cancel buttons
- **Keyboard Shortcuts**:
  - Enter (single line) / Ctrl+Enter (multiline): Save
  - Escape: Cancel

**Visual Feedback:**
- Dashed border on hover
- Edit icon indicator
- Save/Cancel buttons while editing
- Keyboard shortcut hints

**Usage Example:**
```tsx
<InlineTextEditor
  value={content.personal.name}
  onChange={(value) => updatePersonal({ name: value })}
  label="Name"
  className="text-4xl font-bold"
/>
```

#### InlineImageEditor (`src/components/admin/InlineImageEditor.tsx`)

**Purpose**: Editable images with upload and URL support

**Props:**
```typescript
interface InlineImageEditorProps {
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  className?: string;
  label?: string;
  aspectRatio?: string;
}
```

**Features:**
- Image preview
- URL input
- File upload with base64 conversion
- Aspect ratio preservation
- Hover overlay with edit prompt

**Image Handling:**
1. **URL Mode**: Direct image URL
2. **Upload Mode**: Convert to base64 and store
3. **Preview**: Real-time preview before saving

**Usage Example:**
```tsx
<InlineImageEditor
  value={content.personal.image}
  onChange={(value) => updatePersonal({ image: value })}
  alt="Profile Photo"
  aspectRatio="1/1"
  className="w-full h-96 object-cover"
/>
```

## Data Flow

### 1. Content Update Flow

```
User clicks text
      ↓
InlineTextEditor enters edit mode
      ↓
User types and presses Enter
      ↓
onChange callback fired
      ↓
updatePersonal() called in ContentContext
      ↓
Content updated in state
      ↓
Content saved to localStorage
      ↓
Components re-render with new content
```

### 2. Authentication Flow

```
User clicks admin button
      ↓
Login modal appears
      ↓
User enters password
      ↓
AdminContext.login() validates
      ↓
If valid:
  - isAuthenticated set to true
  - State saved to localStorage
  - Admin panel opens
If invalid:
  - Show error alert
  - Clear password field
```

### 3. Export/Import Flow

**Export:**
```
User clicks "Export Content"
      ↓
exportContent() called
      ↓
JSON.stringify(content)
      ↓
Create Blob with JSON
      ↓
Generate download link
      ↓
Trigger file download
```

**Import:**
```
User pastes JSON
      ↓
User clicks "Import Content"
      ↓
importContent(jsonString) called
      ↓
JSON.parse(jsonString)
      ↓
Validate structure
      ↓
Update content state
      ↓
Save to localStorage
      ↓
Re-render components
```

## Integration Guide

### Adding CMS to a Component

1. **Import necessary hooks:**
```tsx
import { useContent } from '../../../contexts/ContentContext';
import InlineTextEditor from '../../../components/admin/InlineTextEditor';
```

2. **Get content and update functions:**
```tsx
const { content, updatePersonal } = useContent();
```

3. **Replace static text with editor:**

**Before:**
```tsx
<h1>{personalInfo.name}</h1>
```

**After:**
```tsx
<h1>
  <InlineTextEditor
    value={content.personal.name}
    onChange={(value) => updatePersonal({ name: value })}
    label="Name"
  />
</h1>
```

### Adding New Content Types

To add a new content type (e.g., testimonials):

1. **Define interface in ContentContext:**
```typescript
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
  rating: number;
}
```

2. **Add to CMSContent interface:**
```typescript
interface CMSContent {
  // ... existing types
  testimonials: Testimonial[];
}
```

3. **Add default data:**
```typescript
const defaultContent: CMSContent = {
  // ... existing defaults
  testimonials: [
    {
      id: '1',
      name: 'John Doe',
      role: 'CTO',
      company: 'Tech Corp',
      text: 'Great work!',
      avatar: '/avatars/john.jpg',
      rating: 5
    }
  ]
};
```

4. **Add CRUD functions:**
```typescript
const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
  const newTestimonial = {
    ...testimonial,
    id: Date.now().toString()
  };
  setContent(prev => ({
    ...prev,
    testimonials: [...prev.testimonials, newTestimonial]
  }));
};

const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
  setContent(prev => ({
    ...prev,
    testimonials: prev.testimonials.map(t =>
      t.id === id ? { ...t, ...updates } : t
    )
  }));
};

const deleteTestimonial = (id: string) => {
  setContent(prev => ({
    ...prev,
    testimonials: prev.testimonials.filter(t => t.id !== id)
  }));
};
```

5. **Export in context value:**
```typescript
const value: ContentContextType = {
  // ... existing values
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
};
```

### Creating Custom Editors

To create a custom editor component:

1. **Follow the pattern:**
```tsx
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

interface CustomEditorProps {
  value: YourType;
  onChange: (value: YourType) => void;
  // ... other props
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  value,
  onChange,
  // ... other props
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  // If not in edit mode, just display the value
  if (!isEditMode) {
    return <YourDisplayComponent value={value} />;
  }

  // If editing, show edit UI
  if (isEditing) {
    return (
      <div>
        {/* Your edit UI */}
        <button onClick={() => {
          onChange(editValue);
          setIsEditing(false);
        }}>
          Save
        </button>
      </div>
    );
  }

  // Default: show value with edit indicator
  return (
    <div onClick={() => setIsEditing(true)}>
      <YourDisplayComponent value={value} />
      {/* Edit indicator */}
    </div>
  );
};

export default CustomEditor;
```

## Storage Strategy

### localStorage Structure

```json
{
  "portfolio-content": "{...full CMSContent JSON...}",
  "portfolio-admin-auth": "true"
}
```

### Size Considerations

- **localStorage limit**: ~5-10MB per domain
- **Base64 images**: Significantly larger than original
- **Recommendation**: Use external image hosting for production

### Migration Strategy

If you need to migrate to a backend:

1. **Keep the same interface:**
```typescript
// Replace localStorage with API calls
const updatePersonal = async (updates: Partial<PersonalContent>) => {
  const response = await fetch('/api/content/personal', {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  const updated = await response.json();
  setContent(prev => ({ ...prev, personal: updated }));
};
```

2. **Add loading states:**
```typescript
const [isLoading, setIsLoading] = useState(false);
```

3. **Handle errors:**
```typescript
try {
  // API call
} catch (error) {
  console.error('Failed to update content:', error);
  // Show user-friendly error message
}
```

## Performance Optimization

### 1. Debouncing

For text editors, consider debouncing saves:

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const InlineTextEditor = ({ value, onChange }) => {
  const [editValue, setEditValue] = useState(value);
  const [debouncedValue] = useDebounce(editValue, 500);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return <input value={editValue} onChange={e => setEditValue(e.target.value)} />;
};
```

### 2. Image Optimization

For image uploads:

```tsx
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate new dimensions (max 1200px)
        const maxSize = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

### 3. Lazy Loading

For components with many editable fields:

```tsx
import { lazy, Suspense } from 'react';

const InlineTextEditor = lazy(() => import('./InlineTextEditor'));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <InlineTextEditor value={value} onChange={onChange} />
</Suspense>
```

## Security Best Practices

### 1. Password Storage

**Current Implementation** (client-side only):
```tsx
const ADMIN_PASSWORD = 'admin123';
```

**Recommended for Production:**
```tsx
// Store hash only
const ADMIN_PASSWORD_HASH = 'bcrypt_hash_here';

// Use a hashing library
import bcrypt from 'bcryptjs';

const login = async (password: string) => {
  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  return isValid;
};
```

### 2. Content Validation

Add validation before saving:

```tsx
const updatePersonal = (updates: Partial<PersonalContent>) => {
  // Validate
  if (updates.email && !isValidEmail(updates.email)) {
    throw new Error('Invalid email format');
  }
  
  if (updates.bio && updates.bio.length > 1000) {
    throw new Error('Bio too long (max 1000 characters)');
  }
  
  // Update
  setContent(prev => ({
    ...prev,
    personal: { ...prev.personal, ...updates }
  }));
};
```

### 3. XSS Prevention

Sanitize user input:

```tsx
import DOMPurify from 'dompurify';

const updatePersonal = (updates: Partial<PersonalContent>) => {
  const sanitized = {
    ...updates,
    bio: updates.bio ? DOMPurify.sanitize(updates.bio) : updates.bio
  };
  
  setContent(prev => ({
    ...prev,
    personal: { ...prev.personal, ...sanitized }
  }));
};
```

## Testing

### Unit Tests

```tsx
// ContentContext.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { ContentProvider, useContent } from './ContentContext';

describe('ContentContext', () => {
  it('should update personal info', () => {
    const { result } = renderHook(() => useContent(), {
      wrapper: ContentProvider
    });

    act(() => {
      result.current.updatePersonal({ name: 'New Name' });
    });

    expect(result.current.content.personal.name).toBe('New Name');
  });

  it('should export content as JSON', () => {
    const { result } = renderHook(() => useContent(), {
      wrapper: ContentProvider
    });

    const exported = result.current.exportContent();
    const parsed = JSON.parse(exported);

    expect(parsed).toHaveProperty('personal');
    expect(parsed).toHaveProperty('projects');
  });
});
```

### Integration Tests

```tsx
// AdminPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AdminPanel from './AdminPanel';
import { AdminProvider } from '../../contexts/AdminContext';

describe('AdminPanel', () => {
  it('should show login modal when clicked', () => {
    render(
      <AdminProvider>
        <AdminPanel />
      </AdminProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('should login with correct password', () => {
    render(
      <AdminProvider>
        <AdminPanel />
      </AdminProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const passwordInput = screen.getByPlaceholderText('Enter admin password');
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
```

## Deployment

### Environment Variables

Create `.env` file:

```env
VITE_ADMIN_PASSWORD=your_secure_password
VITE_API_URL=https://api.yoursite.com
```

Use in code:

```tsx
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
```

### Build Configuration

Update `vite.config.js`:

```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'admin': [
            './src/contexts/AdminContext',
            './src/contexts/ContentContext',
            './src/components/admin/AdminPanel'
          ]
        }
      }
    }
  }
});
```

### Production Checklist

- [ ] Change default password
- [ ] Remove password hints
- [ ] Add proper error boundaries
- [ ] Implement rate limiting
- [ ] Add HTTPS
- [ ] Optimize images
- [ ] Add loading states
- [ ] Implement proper validation
- [ ] Add user feedback (toasts)
- [ ] Test export/import thoroughly
- [ ] Set up automated backups
- [ ] Add analytics events
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

## Future Enhancements

### 1. Rich Text Editor

Integrate a library like Draft.js or Slate:

```tsx
import { Editor } from 'draft-js';

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
  );

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    onChange(JSON.stringify(raw));
  };

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
    />
  );
};
```

### 2. Undo/Redo

Implement history tracking:

```tsx
const useContentHistory = () => {
  const [history, setHistory] = useState<CMSContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushHistory = (content: CMSContent) => {
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, content]);
    setCurrentIndex(newHistory.length);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
  };

  return { pushHistory, undo, redo };
};
```

### 3. Drag and Drop

For reordering projects:

```tsx
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProjectList = () => {
  const { content, reorderProjects } = useContent();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(content.projects);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    reorderProjects(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {content.projects.map((project, index) => (
              <Draggable key={project.id} draggableId={project.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ProjectCard project={project} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
```

### 4. Image Cropping

Add image cropping capability:

```tsx
import Cropper from 'react-easy-crop';

const ImageCropEditor = ({ image, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onSave(croppedImage);
  };

  return (
    <div>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <button onClick={handleSave}>Save Cropped Image</button>
    </div>
  );
};
```

## Summary

The CMS system provides:

✅ **Modular Architecture**: Easy to extend and maintain
✅ **Type Safety**: Full TypeScript support
✅ **Context-Based**: Clean separation of concerns
✅ **Visual Feedback**: Intuitive editing experience
✅ **Export/Import**: Backup and transfer capabilities
✅ **Responsive**: Works on all device sizes
✅ **Customizable**: Easy to add new content types
✅ **Production-Ready**: With proper security considerations

For questions or issues, refer to the code comments or create an issue in your repository.
