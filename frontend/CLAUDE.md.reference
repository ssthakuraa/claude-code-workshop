# frontend/CLAUDE.md — React/TypeScript Rules

Applies when working in the `frontend/` directory. Loaded in addition to root CLAUDE.md.

---

## Data Fetching

- Use TanStack Query (`useQuery` / `useMutation`) for all API calls — never raw fetch or axios directly
- Use `HrApiClient` for HTTP requests — the interceptor handles auth token injection and response unwrapping
- API response shape: `HrApiResponse<T>` (single) or `HrPagedResponse<T>` (list with pagination)

## Components

- All component names use the `Hr` prefix — e.g., `HrEmployeeCard`, `HrDepartmentTree`, `HrSalaryBadge`
- Component files match the component name exactly — `HrEmployeeCard.tsx`
- No inline styles — Tailwind CSS classes only

## Styling

- Use Oracle Redwood design tokens via Tailwind CSS
- Color tokens: `redwood-primary`, `redwood-secondary`, `redwood-surface` — never raw hex values
- Layout: use the existing `HrLayout`, `HrPageHeader`, `HrCard` wrapper components

## Forms

- React Hook Form + Zod for all forms
- Define Zod schema first, then infer the TypeScript type from it
- Display field-level validation errors inline — never alert()

## Build

```bash
cd frontend
npm install
npm run dev         # Dev server with HMR
npm run build       # Production build
npm run lint        # TypeScript + ESLint check
```
