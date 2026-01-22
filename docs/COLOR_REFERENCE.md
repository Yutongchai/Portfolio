# Quick Color Reference Guide

## Citrus Theme (Orange & Yellow)
```
🎨 PRIMARY (30%)
├─ Orange #e1620b - Headers, Nav, Main UI
└─ Yellow #fcb22f - Secondary UI, Highlights

🔴 ACCENT (10%)  
├─ Red #ee424c - CTA Buttons, Alerts
└─ Blue #0074b4 - Links, Secondary Actions

⚪ FOUNDATION (60%)
├─ #fafafa - Page Background
├─ #ffffff - Cards
└─ #f5f5f5 - Subtle Areas
```

## Jewel Theme (Teal & Purple)
```
🎨 PRIMARY (30%)
├─ Teal #12a28f - Headers, Nav, Main UI
└─ Purple #695da5 - Secondary UI, Highlights

🔴 ACCENT (10%)
├─ Red #ee424c - CTA Buttons, Alerts
└─ Blue #0074b4 - Links, Secondary Actions

⚪ FOUNDATION (60%)
├─ #fafafa - Page Background
├─ #ffffff - Cards
└─ #f5f5f5 - Subtle Areas
```

---

## Common Patterns

### Headers (30%)
```tsx
className="bg-primary text-primary-foreground"
```

### Buttons (10%)
```tsx
className="bg-accent hover:bg-cta text-accent-foreground"
```

### Cards (60%)
```tsx
className="bg-card text-card-foreground"
```

### Links (10%)
```tsx
className="text-accent hover:text-accent-secondary"
```

---

## Color Distribution Example

```
┌─────────────────────────────────────┐
│     BACKGROUND (60% - #fafafa)      │
│  ┌───────────────────────────────┐  │
│  │  HEADER (30% - Primary)       │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  CARD (60% - #ffffff)         │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ Button (10% - Accent)   │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Tailwind Classes Quick Reference

| Element | Citrus Classes | Jewel Classes |
|---------|---------------|---------------|
| Primary BG | `bg-primary` → #e1620b | `bg-primary` → #12a28f |
| Primary Text | `text-primary` → #e1620b | `text-primary` → #12a28f |
| Accent Button | `bg-accent` → #ee424c | `bg-accent` → #ee424c |
| CTA Button | `bg-cta` → darker red | `bg-cta` → #0074b4 |
| Page BG | `bg-background` → #fafafa | `bg-background` → #fafafa |
| Card BG | `bg-card` → #ffffff | `bg-card` → #ffffff |

---

## Component Examples

### Navigation Bar
```tsx
<nav className="bg-primary text-primary-foreground"> {/* 30% */}
  <a className="hover:text-accent"> {/* 10% accent on hover */}
    Menu
  </a>
</nav>
```

### Hero Section
```tsx
<section className="bg-background"> {/* 60% foundation */}
  <h1 className="text-primary"> {/* 30% primary */}
    Welcome
  </h1>
  <button className="bg-accent"> {/* 10% accent */}
    Get Started
  </button>
</section>
```

### Card Component
```tsx
<div className="bg-card border-primary"> {/* 60% + 30% */}
  <h3 className="text-primary"> {/* 30% */}
    Title
  </h3>
  <a className="text-accent"> {/* 10% */}
    Learn More
  </a>
</div>
```
