# Architecture Plan
**Date:** 05 July 2026
**Target Project:** Production-Ready Full-Stack Application

Based on the findings in `TECH_RESEARCH.md`, this document outlines the complete architectural strategy for the new project.

## 1. Recommended Project Architecture
**Decoupled Monorepo / Multi-Repo:** A decoupled architecture separating the Next.js frontend and the Django backend. This allows independent scaling, deployment, and technology upgrades. We will use a RESTful JSON API over HTTPS to connect the two layers.

## 2. Recommended Frontend Architecture
**Framework:** Next.js 16.2 (App Router) + React 19.2 + TypeScript 7.0.
**Styling:** Tailwind CSS v4 + shadcn/ui (CLI v4 with Base UI/React Aria primitives).
**Structure:** Feature-driven architecture. Components, hooks, and types will be grouped by feature rather than type, promoting modularity and code-splitting. All components will default to React Server Components (RSC), explicitly using `"use client"` only when interactivity is required.

## 3. Recommended Backend Architecture
**Framework:** Django 6.0.7 + Python 3.14+.
**Structure:** Modular apps. Business logic will be decoupled from views and serializers, utilizing a service layer pattern for complex operations. 
**Task Queue:** Celery with Redis for asynchronous tasks (e.g., email sending, background processing).

## 4. Recommended Database Architecture
**RDBMS:** PostgreSQL 18.4.
**Structure:** Strictly normalized tables for transactional data, utilizing PostgreSQL's native `JSONB` fields for dynamic configurations or flexible metadata. We will enforce strict database constraints (foreign keys, unique constraints, check constraints) at the DB level, not just the ORM level.

## 5. Recommended API Architecture
**Framework:** Django REST Framework 3.17.1.
**Style:** RESTful principles with standard JSON responses.
**Features:** 
- Cursor-based pagination for high-performance feeds.
- Class-based ViewSets for standard CRUD, APIViews for custom endpoints.
- Extensive use of `.select_related()` and `.prefetch_related()` to prevent N+1 query issues.

## 6. Recommended Authentication Approach
**Strategy:** JWT (JSON Web Tokens) via `djangorestframework-simplejwt`.
**Security:** Tokens will NEVER be stored in `localStorage`. We will use the Backend-For-Frontend (BFF) pattern or Next.js API routes to attach the Access Token and Refresh Token to **HTTP-Only, Secure, SameSite=Lax/Strict cookies**. CSRF protection will be enforced on state-changing requests.

## 7. Recommended State Management Approach
**Server State:** TanStack Query (React Query) v5 for data fetching, caching, and background synchronization.
**Client State:** Zustand v5 for global client-side state (e.g., UI toggles, multistep form data).
**Context:** React Context API strictly for dependency injection (e.g., Theme, Auth context), avoiding it for high-frequency state updates.

## 8. Recommended Form Validation Approach
**Library:** React Hook Form combined with Zod for schema validation.
**Execution:** Forms will be uncontrolled to minimize re-renders. Zod schemas will be shared where possible to ensure strict type safety between the UI form payload and expected backend inputs.

## 9. Recommended Internationalization Approach
**Library:** `next-intl` (compatible with Next.js App Router and Server Components).
**Execution:** Locales will be route-based (e.g., `/en/about`, `/ar/about`). Translations will be stored in JSON dictionaries.

## 10. Recommended Arabic RTL Approach
**Implementation:** 
- The `<html>` tag will dynamically set `dir="rtl"` and `lang="ar"` based on the locale.
- Tailwind CSS v4 logical properties (e.g., `ps-4`, `ms-2`, `start-0`) will be used exclusively instead of directional properties (like `pl-4` or `left-0`). This ensures components flip automatically without writing custom RTL CSS.
- Typography will utilize Arabic-optimized Google Fonts (e.g., Cairo, Tajawal, or IBM Plex Sans Arabic).

## 11. Recommended SEO Approach
**Strategy:** Server-Side Rendering (SSR) via Next.js App Router.
**Implementation:**
- Native Next.js Metadata API for dynamic `<title>`, `<meta>`, and OpenGraph tags.
- Dynamic `sitemap.xml` and `robots.txt` generation.
- JSON-LD Structured Data injected directly into Server Components for rich search results.

## 12. Recommended Testing Strategy
**Frontend:** 
- Unit/Component: Vitest + React Testing Library.
- E2E: Playwright (simulating actual user flows).
**Backend:** 
- Framework: `pytest` with `pytest-django`.
- Focus on API integration tests and service-layer unit tests. Test database isolation will be strictly enforced.

## 13. Recommended Deployment Strategy
**Frontend:** Vercel (preferred for Next.js App Router caching/edge network) or customized Docker container running Node 22+ behind an Nginx reverse proxy.
**Backend:** VPS or Containerized deployment (Docker/Compose). Gunicorn application server managed by systemd or Docker, placed behind Nginx as the reverse proxy.
**CI/CD:** GitHub Actions to run linting, tests, and automated builds on main branch merges.

## 14. Recommended Security Strategy
**Frontend:** Content Security Policy (CSP) headers, strict XSS prevention (React's default behavior), and HTTP-Only cookies.
**Backend:** Enforce HTTPS via TLS 1.3, configure CORS strictly (allow only specific frontend domains), implement rate-limiting via Redis, and conduct regular dependency audits (e.g., `pip-audit`).
**Infrastructure:** Database firewalled to accept connections only from the backend application servers.

## 15. Recommended Performance Strategy
**Frontend:** Leverage Next.js Turbopack build caching. Heavy components will be dynamically imported (`next/dynamic`). Images optimized via `next/image` in modern WebP/AVIF formats.
**Backend:** Redis caching for expensive database queries. Gunicorn worker tuning based on CPU core count. PostgreSQL query profiling to identify missing indices.

## 16. Main Risks
- **TypeScript 7.0 Tooling Breakage:** The move to a Go-native compiler might break legacy JS-based plugins. Mitigation: Run tests on CI and fallback to TS 6.9 if blocking issues occur.
- **RTL Layout Regressions:** Hardcoded directional CSS properties. Mitigation: Enforce strict linting rules against `left/right/pl/pr` utilities in Tailwind.
- **Cookie-based Auth Complexities:** Handling CSRF and cookie domains across different environments (dev vs. prod). Mitigation: Strict environment variable configuration and robust documentation.

## 17. Safe Implementation Plan
1. **Repository Setup:** Initialize Git repos, set up pre-commit hooks (Ruff for Python, Biome/ESLint for JS).
2. **Backend Foundation:** Bootstrap Django 6.0, configure PostgreSQL 18.4, and set up simple custom User model.
3. **Frontend Foundation:** Initialize Next.js 16.2 with Tailwind v4, setup shadcn/ui CLI v4, and configure routing with `next-intl`.
4. **Auth Layer:** Implement SimpleJWT backend and HttpOnly cookie attachment frontend mechanisms.
5. **Core Features:** Iterative development of API endpoints and UI components using feature-driven architecture.
6. **Polishing:** SEO metadata injection, performance profiling, and extensive Playwright E2E testing before production launch.
