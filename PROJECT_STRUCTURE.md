# Project Structure Specification

This document defines the repository layout, folder hierarchy, and structural conventions for the project.

## 1. Repository Layout
We will use a **Decoupled Monorepo** approach. The frontend and backend live in the same Git repository but occupy completely separate root folders.
- **Why Chosen:** Simplifies versioning, CI/CD coordination, and developer onboarding (one `git clone` gets the whole stack).
- **Alternatives Considered:** Multi-repo (one for frontend, one for backend).
- **Trade-offs:** Monorepos can become large, requiring specialized CI rules to avoid rebuilding the backend when only frontend files change.

## 2. Folder Hierarchy
```text
/
├── .github/                 # CI/CD workflows and GitHub templates
├── backend/                 # Django application
│   ├── config/              # Django settings, root urls, wsgi/asgi
│   ├── apps/                # Feature-based Django apps (e.g., users, core)
│   │   └── users/
│   │       ├── models.py
│   │       ├── services.py  # Business logic
│   │       ├── selectors.py # Complex database queries
│   │       ├── apis.py      # DRF Views/ViewSets
│   │       └── urls.py
│   ├── requirements/        # Python dependencies
│   └── manage.py
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages and layouts
│   │   ├── features/        # Domain-specific modules (e.g., Auth, Dashboard)
│   │   │   └── auth/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── api/
│   │   │       └── store/
│   │   ├── components/      # Shared/Global UI (shadcn/ui)
│   │   ├── lib/             # Global utilities (api client, formatting)
│   │   └── types/           # Global TypeScript definitions
│   ├── public/              # Static assets
│   ├── tailwind.config.ts
│   └── package.json
└── docker-compose.yml       # Local development orchestration
```
- **Why Chosen:** A feature-based architecture (both in Django `apps/` and Next.js `features/`) keeps related code together, improving maintainability.
- **Alternatives Considered:** Grouping by type (e.g., all hooks in one folder, all components in another).
- **Trade-offs:** Feature-based grouping requires stricter discipline to avoid circular dependencies between features.

## 3. Naming Conventions
- **Folders/Files:** `kebab-case` for frontend files (`user-profile.tsx`), `snake_case` for backend files (`user_profile.py`).
- **Why Chosen:** Aligns with standard Next.js routing patterns and Python PEP8 standards.

## 4. Component & Feature Organization (Frontend)
Features encapsulate their own logic, API calls, and state. Components in `src/components` are strictly "dumb" UI elements.
- **Why Chosen:** Prevents the core `components/` folder from becoming bloated with business-logic-heavy elements.
- **Trade-offs:** Sometimes it is ambiguous whether a component is a generic UI element or a feature-specific component.

## 5. Configuration and Environments
- `.env` files are strictly excluded from version control.
- Configuration is loaded via `Pydantic` settings (Backend) and `zod` validated env vars (Frontend).
- **Why Chosen:** Ensures the app fails immediately at startup if an environment variable is missing, avoiding unpredictable runtime errors.
