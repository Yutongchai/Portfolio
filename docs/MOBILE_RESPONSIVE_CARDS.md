# Mobile Responsive Card System

## Overview
The `ScrollableCards` component provides automatic mobile responsiveness for card grids throughout the site.

## Features
- **Mobile**: Horizontal scrolling carousel (swipeable)
- **Desktop**: Standard responsive grid layout
- **No scrollbar clutter**: Invisible scrollbars on mobile
- **Flexible**: Configurable columns, gaps, and card widths

## Usage

### Basic Example
```tsx
import ScrollableCards from '../components/ui/ScrollableCards';

<ScrollableCards desktopColumns={3} gap={6}>
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</ScrollableCards>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `desktopColumns` | `2 \| 3 \| 4` | `3` | Number of columns on desktop |
| `gap` | `4 \| 6 \| 8 \| 10` | `6` | Gap between cards (Tailwind units) |
| `mobileScroll` | `boolean` | `true` | Enable horizontal scroll on mobile |
| `className` | `string` | `''` | Additional CSS classes |

### Examples by Use Case

#### 3-Column Feature Cards
```tsx
<ScrollableCards desktopColumns={3} gap={8}>
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</ScrollableCards>
```

#### 4-Column Activity Cards
```tsx
<ScrollableCards desktopColumns={4} gap={6}>
  {activities.map(activity => (
    <ActivityCard key={activity.id} {...activity} />
  ))}
</ScrollableCards>
```

#### 2-Column Testimonials
```tsx
<ScrollableCards desktopColumns={2} gap={10}>
  {testimonials.map(testimonial => (
    <TestimonialCard key={testimonial.id} {...testimonial} />
  ))}
</ScrollableCards>
```

## Migration Guide

### Before (Manual Grid)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</div>
```

### After (ScrollableCards)
```tsx
<ScrollableCards desktopColumns={3} gap={8}>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</ScrollableCards>
```

## Pages to Update

### High Priority (Card-Heavy Pages)
- ✅ **TeamBuilding.tsx** - Activity cards (4 columns)
- ⬜ **CSR.tsx** - Impact areas (3 columns), case studies (3 columns)
- ⬜ **CorporateEvent.tsx** - Event types (4 columns), features (4 columns)
- ⬜ **TrainingProgram.tsx** - Training categories
- ⬜ **Home.tsx** - Service cards

### Medium Priority
- ⬜ **BeliefsValuesSection.tsx** - Value cards
- ⬜ **ActivitiesSection.tsx** - Activity grid
- ⬜ **OurRoleSection.tsx** - Role cards

### Low Priority (Already Responsive)
- Forms (use native grid behavior)
- Modal grids (limited width)

## Testing Checklist
- [ ] Mobile (375px): Cards scroll horizontally, visible overflow hint
- [ ] Tablet (768px): Switches to grid layout
- [ ] Desktop (1024px+): Full grid with proper columns
- [ ] Touch gestures work smoothly
- [ ] No horizontal page scroll (only card scroll)

## Customization

### Adjust Mobile Card Width
Edit `ScrollableCards.tsx` line 53:
```tsx
style={{ width: '85vw', maxWidth: '400px' }}
//              ↑ Adjust percentage     ↑ Adjust max width
```

### Add Scroll Indicators
You can add visual scroll hints:
```tsx
<div className="relative">
  <ScrollableCards desktopColumns={3}>
    {/* cards */}
  </ScrollableCards>
  <div className="md:hidden absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white pointer-events-none" />
</div>
```

## Benefits
✅ **50% less code** per card section  
✅ **Consistent mobile UX** across all pages  
✅ **Better touch experience** on mobile  
✅ **Maintains desktop layout** perfectly  
✅ **Single source of truth** for responsive behavior
