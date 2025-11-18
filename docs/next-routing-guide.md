# Aurelane Next.js Routing Guide

This project uses the Next.js App Router. Route groups keep concerns separated while preserving the URLs from the original React Router setup.

## Route Groups

- `(public)/(main)` – public-facing pages rendered inside `MainLayout`.
- `(public)/(auth)` – authentication pages wrapped with `AuthLayout` and the placeholder `PublicRoute` guard.
- `(standalone)` – routes that should not inherit the main site chrome (currently `/aman_birthday`).
- `(protected)` – authenticated pages rendered inside `MainLayout`.
  - Direct children are buyer/general authenticated routes.
  - `seller/*` is wrapped with a seller-only guard.
  - `(admin-only)` wraps admin-only dashboards and tools.

All layout components live in `components/layouts`, and route guards live in `components/auth`.

## Replacing Placeholders

Each `page.tsx` currently renders a short placeholder. To wire in your React components:

1. Move the component into an appropriate location under `components/` (for example, `components/pages/Home.tsx` or `components/dashboard/AdminDashboard.tsx`).
2. Import the component in the corresponding `page.tsx`.
3. Replace the placeholder JSX with the component, e.g.
   ```tsx
   import Home from "@/components/pages/Home";

   export default function HomePage() {
     return <Home />;
   }
   ```

## Hooking Up Authentication

`ProtectedRoute` and `PublicRoute` are client components that currently contain TODOs. Integrate them with your real auth solution by:

1. Reading auth state from context, cookies, or an API call.
2. Updating the `isAuthenticated` and `userRole` checks.
3. Adjusting the redirects (`router.replace(...)`) as needed.

> Tip: wrap your app with an `AuthProvider` in `app/layout.tsx` once the authentication logic is ready.

## Adding New Routes

1. Create a new folder structure under `app/` that mirrors the desired URL.
2. If the page should use an existing layout, place it inside the matching route group.
3. Add `page.tsx` (and optionally `loading.tsx` / `error.tsx`) with your component.

Next.js automatically handles 404s, so you no longer need the React Router catch-all redirect.


