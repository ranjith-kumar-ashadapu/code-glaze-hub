# Design System & Theme Utilities

Complete reference for the new theme system with Tailwind color classes, gradient backgrounds, and component utilities.

## 🎨 Color Palette

### Light Theme
All light theme colors are available as Tailwind utilities:

```tsx
// Backgrounds & Cards
bg-light-bg              // #F8F6FF - Soft white-purple
bg-light-card            // #F0E9FF - Subtle lilac

// Text
text-light-text-primary    // #1A1A1A - Deep gray
text-light-text-secondary  // #555555 - Muted gray

// Badges (light backgrounds)
bg-badge-easy-light      // #D1FAE5
bg-badge-medium-light    // #FEF3C7
bg-badge-hard-light      // #FEE2E2
```

### Dark Theme
All dark theme colors with `.dark:` prefix or when inside `.dark` class:

```tsx
// Backgrounds & Cards
dark:bg-dark-bg              // #0F051E - Deep purple-black
dark:bg-dark-card            // #1C1230 - Slight contrast

// Text
dark:text-dark-text-primary    // #EDE9FE - Off-white
dark:text-dark-text-secondary  // #C4B5FD - Soft lavender

// Badge backgrounds (dark)
dark:bg-badge-easy-dark-bg      // #065F46
dark:bg-badge-medium-dark-bg    // #78350F
dark:bg-badge-hard-dark-bg      // #7F1D1D

// Badge text (dark)
dark:text-badge-easy-dark-fg    // #6EE7B7
dark:text-badge-medium-dark-fg  // #FCD34D
dark:text-badge-hard-dark-fg    // #FCA5A5
```

## 🎭 Gradients

### Background Image Utilities

```tsx
bg-accent-light           // linear-gradient(90deg, #A66CFF, #C77DFF, #9D4EDD)
dark:bg-accent-dark       // linear-gradient(90deg, #C77DFF, #9D4EDD, #7B2FF7)
bg-heading-gradient       // linear-gradient(90deg, #7B2FF7, #F107A3)
bg-btn-gradient-light     // linear-gradient(90deg, #9D4EDD, #C77DFF)
dark:bg-btn-gradient-dark // linear-gradient(90deg, #C77DFF, #9D4EDD)
```

## 🔧 CSS Utility Classes

### Typography
```tsx
.heading-font        // Font: Poppins, weight: 600 (semibold)
.body-font           // Font: Inter, weight: 400
.mono-font           // Font: JetBrains Mono, monospace
```

### Components

#### Card (`ui-card`)
- Glassy blur effect (12px backdrop-filter)
- Gradient border using accent color (20% opacity)
- Soft shadow with inset highlight
- Hover effects: enhanced glow and border color

```tsx
<div className="ui-card">
  Content with glassy appearance
</div>
```

#### Button (`btn-gradient`)
- Exact gradient background (light or dark theme)
- Hover: larger shadow, lift transform (-2px), brightness filter
- Active: reset to base transform
- Semibold font weight

```tsx
<button className="btn-gradient">
  Click me
</button>
```

#### Gradient Heading (`gradient-heading`)
- Heading gradient text: #7B2FF7 → #F107A3
- Uses Poppins font, weight 700
- `-webkit-text-fill-color` for cross-browser support

```tsx
<h1 className="gradient-heading heading-font">
  Browse by Category
</h1>
```

#### Badge (`badge`, `badge-{easy|medium|hard}`)
- Inline-flex, rounded pill shape
- Light/dark mode colors included
- Hover: scale(1.05)
- Available variants:
  - `badge badge-easy` → #D1FAE5 / #065F46 (light/dark)
  - `badge badge-medium` → #FEF3C7 / #78350F (light/dark)
  - `badge badge-hard` → #FEE2E2 / #7F1D1D (light/dark)

```tsx
<span className="badge badge-easy">Easy</span>
<span className="badge badge-medium">Medium</span>
<span className="badge badge-hard">Hard</span>
```

## 📋 Usage Examples

### Example 1: Hero Section
```tsx
<div className="bg-light-bg dark:bg-dark-bg p-8">
  <h1 className="gradient-heading heading-font text-5xl mb-4">
    Welcome to CodeGrid
  </h1>
  <p className="body-font text-light-text-secondary dark:text-dark-text-secondary">
    Explore curated problems with solutions
  </p>
  <button className="btn-gradient mt-6">
    Get Started
  </button>
</div>
```

### Example 2: Problem Card
```tsx
<div className="ui-card">
  <div className="flex justify-between items-start mb-3">
    <h3 className="heading-font text-lg">Two Sum</h3>
    <span className="badge badge-easy">Easy</span>
  </div>
  <p className="body-font text-light-text-secondary dark:text-dark-text-secondary">
    Given an array of integers, return two numbers that add up to a target.
  </p>
</div>
```

### Example 3: Code Block
```tsx
<pre className="mono-font bg-light-card dark:bg-dark-card p-4 rounded-lg">
  <code>{`const solution = (arr) => {
  // code here
}`}</code>
</pre>
```

## 🌓 Theme Toggle

The app uses `next-themes` for theme management. Theme is applied via the `class` attribute on the root `<html>` element.

```tsx
// In your component
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

When `.dark` class is present, all `dark:` prefixed Tailwind utilities and `.dark .ui-card` styles apply.

## 🎯 CSS Variables (in `src/index.css`)

For direct CSS or styled-components access, these CSS variables are available:

```css
/* Font stacks */
--font-heading: "Poppins", "Manrope", "Outfit", ...
--font-body: "Inter", "DM Sans", ...
--font-mono: "JetBrains Mono", "Fira Code", ...

/* Light theme */
--bg-light: #F8F6FF
--card-light: #F0E9FF
--text-primary-light: #1A1A1A
--text-secondary-light: #555555

/* Dark theme */
--bg-dark: #0F051E
--card-dark: #1C1230
--text-primary-dark: #EDE9FE
--text-secondary-dark: #C4B5FD

/* Gradients */
--heading-gradient-from: #7B2FF7
--heading-gradient-to: #F107A3
--btn-grad-from: #9D4EDD
--btn-grad-to: #C77DFF
--btn-grad-from-dark: #C77DFF
--btn-grad-to-dark: #9D4EDD

/* Badge colors (dark) */
--badge-easy-dark-bg: #065F46
--badge-easy-dark-fg: #6EE7B7
--badge-medium-dark-bg: #78350F
--badge-medium-dark-fg: #FCD34D
--badge-hard-dark-bg: #7F1D1D
--badge-hard-dark-fg: #FCA5A5
```

## 🎬 Preview

Visit **`http://localhost:8081/theme`** to see the complete theme showcase with all colors, gradients, and components in action!

## 📚 Related Files

- `src/index.css` — Base CSS variables, typography, and utility classes
- `tailwind.config.ts` — Tailwind theme extensions (colors, gradients, images)
- `src/components/ThemeShowcase.tsx` — Visual reference for all utilities
- `src/components/ThemeProvider.tsx` — Theme management (light/dark)
- `index.html` — Font imports (Poppins, Inter, JetBrains Mono, etc.)
