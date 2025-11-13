# AI Coding Agent Instructions for Code-Glaze-Hub

## Project Overview

**Code-Glaze-Hub** is a React-based problem-solving platform with a Supabase backend, featuring:
- Public problem browsing (Home page with search/filtering)
- Admin-only CRUD operations (Admin panel)
- Role-based access control via Supabase RLS
- Light/dark theme system with custom Tailwind colors
- Responsive UI using shadcn/ui + Radix-UI components

**Key Stack**: React 18, TypeScript, Vite, Supabase (PostgreSQL), Tailwind CSS, shadcn/ui, React Router v6

---

## Critical Architecture Patterns

### Authentication & Authorization Flow

1. **Auth Context** (`src/contexts/AuthContext.tsx`) manages user session globally
   - Listens to Supabase auth state changes on mount
   - `useAuth()` hook provides `user`, `session`, `loading`, and `signOut()`
   - Session persistence via localStorage is auto-configured in Supabase client

2. **Admin Role Check** (`src/hooks/useAdminRole.ts`)
   - Queries `user_roles` table for `role='admin'` matching current `user.id`
   - Returns `{ isAdmin, loading }` - **always check both before rendering**
   - Protected pages redirect: unauthenticated → `/auth`, non-admin → `/admin-setup`

3. **Supabase RLS Policies** (`supabase/migrations/`)
   - Tables use `has_role(auth.uid(), 'admin'::app_role)` for admin-only inserts/updates/deletes
   - Public SELECT on categories/problems (anyone can read)
   - Admin setup: Users must manually insert their role via SQL after account creation (see `ADMIN_SETUP.md`)

### Data Flow: Problems & Categories

- **Problems table**: `id`, `title`, `description`, `difficulty` (Easy/Medium/Hard), `category` (nullable foreign key), `created_at`, `user_id`
- **Categories table**: `id`, `name` (unique), `image_url`, `created_at`, `updated_at`
- **Home page** displays problems in a table, filtered by category or search query
- **Admin panel** lists all problems with edit/delete actions; uses `AlertDialog` confirmation before delete
- **ProblemDetail page** shows full problem content by slug (derived from title)

---

## Project-Specific Developer Workflows

### Local Development

```bash
# Start dev server (Vite on port 8080)
npm run dev

# Build for production
npm run build

# Build in development mode (enables `componentTagger()` plugin)
npm run build:dev

# Lint TypeScript/TSX
npm lint

# Preview production build
npm preview
```

**Key Dev Setup**: Create `.env.local` with:
```
VITE_SUPABASE_URL=<your-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
```

### Supabase Local Development

- Config file: `supabase/config.toml`
- Migrations auto-apply when using `supabase migrate` commands
- To add admin role manually during dev: Run SQL directly in Supabase console on `user_roles` table

### Build Output & Assets

- Vite outputs to `dist/` (production builds)
- All imports use `@` alias → `src/` (configured in `vite.config.ts`)
- ShadcN/UI components in `src/components/ui/` are auto-generated from `components.json`

---

## Critical Code Patterns & Conventions

### React Component Structure

1. **Page Components** (`src/pages/`): Top-level route handlers
   - Use `useAuth()` and `useAdminRole()` for permission checks
   - Perform initial data fetches with try/catch, emit `toast` errors
   - Example: `Admin.tsx` checks `!user` → redirect to auth, `!isAdmin` → redirect to setup

2. **UI Components** (`src/components/ui/`): ShadcN-wrapped Radix primitives
   - Do NOT edit directly (auto-generated from Radix-UI)
   - Use via `import { Button } from "@/components/ui/button"`

3. **Reusable Components** (`src/components/`): Business logic wrappers
   - `CategoryCard.tsx`, `ProblemCard.tsx` wrap problem/category displays
   - `ThemeProvider.tsx` wraps `next-themes` for light/dark mode
   - `Navigation.tsx` provides header with theme toggle and auth status

### State Management

- **React hooks + Context**: `useAuth()`, `useAdminRole()`, `useToast()`
- **Query caching**: `@tanstack/react-query` with `QueryClient` (configured in `App.tsx`)
- **Local component state**: `useState` for UI toggles, filters, form inputs

### Supabase Integration Pattern

```tsx
// Standard query pattern in Home.tsx and Admin.tsx
const { data, error } = await supabase
  .from('problems')
  .select('id, title, difficulty, created_at')
  .order('created_at', { ascending: false });

if (error) {
  toast({ title: 'Error', description: 'Failed to load problems', variant: 'destructive' });
} else {
  setProblems(data || []);
}
```

- Always destructure `{ data, error }`
- Always check error and show toast
- Type interfaces for responses (e.g., `interface Problem { ... }`)

### Form Handling

- Uses `react-hook-form` + `@hookform/resolvers` for validation
- Forms in `AdminForm.tsx` follow pattern: `register()`, `handleSubmit()`, error display
- Validation schemas use Zod (inferred from form setup)

---

## Theme System & Styling

### Tailwind Color Variables

Custom color classes defined in `tailwind.config.ts` and `index.css`:

**Light theme**:
- `bg-light-bg` (soft white-purple) - main background
- `bg-light-card` (subtle lilac) - card background
- `text-light-text-primary` (deep gray) - primary text
- `text-light-text-secondary` (muted gray) - secondary text
- `bg-badge-easy-light`, `bg-badge-medium-light`, `bg-badge-hard-light` - difficulty badges

**Dark theme** (prefix with `dark:`):
- `dark:bg-dark-bg` (deep purple-black)
- `dark:bg-dark-card` (purple contrast)
- `dark:text-dark-text-primary` (off-white)
- `dark:text-dark-text-secondary` (soft lavender)
- `dark:bg-badge-easy-dark-bg`, etc.

### Gradient & Utility Classes

- `.ui-card` - glassy blur effect, gradient border, soft shadow
- `.heading-font` - Poppins semibold
- `.body-font` - Inter regular
- `.mono-font` - JetBrains Mono
- `bg-accent-light`, `dark:bg-accent-dark` - purple gradients
- `bg-heading-gradient`, `bg-btn-gradient-light` - accent gradients

Comprehensive reference in `THEME_UTILITIES.md`.

### Theme Toggle

`ThemeToggle.tsx` uses `next-themes` hooks to switch "light" | "dark":
```tsx
import { useTheme } from "next-themes";
const { theme, setTheme } = useTheme();
// Toggle: setTheme(theme === "light" ? "dark" : "light")
```

---

## Important Integration Points

### Environment Variables

**Required** (in `.env.local`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key

**Auto-generated** (via Supabase):
- `src/integrations/supabase/types.ts` - TypeScript types for database tables
- `src/integrations/supabase/client.ts` - Supabase client instantiation

### Router Configuration

React Router v6 setup in `App.tsx`:
- `/home` - Home page (default redirect from `/`)
- `/:category` - Category filter view
- `/:category/:slug` - Problem detail view
- `/auth` - Login/signup
- `/admin` - Admin dashboard (protected)
- `/admin/new` - Create problem (protected)
- `/admin/edit/:id` - Edit problem (protected)
- `/admin-setup` - First-time admin setup
- `*` - 404 Not Found

---

## Common Tasks & Entry Points

**Add a new UI component**: Use ShadcN CLI or copy from `src/components/ui/` template
**Add a protected page**: Wrap in `AdminProvider` check pattern (see `Admin.tsx`)
**Query database**: Use Supabase client in hooks/components following standard pattern
**Add a route**: Update `App.tsx` routes + add page in `src/pages/`
**Customize theme**: Edit `tailwind.config.ts` for colors, `index.css` for utility classes
**Debug auth**: Check `AuthContext.tsx` + `useAdminRole.ts` loading states first

---

## Red Flags & Gotchas

1. **Admin role must exist in DB**: New users need SQL insert in `user_roles` table (not auto-assigned)
2. **Component tagging plugin**: Only active in `build:dev` (Lovable integration)
3. **RLS policies block unfenced queries**: Always ensure Supabase policies match intended access
4. **Loading states matter**: Both `useAuth()` and `useAdminRole()` have separate loading flags
5. **ShadcN components auto-generated**: Don't edit `src/components/ui/` files directly
6. **Route params are strings**: `/:category/:slug` params must be decoded/normalized for lookups
