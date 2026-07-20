# Coding Standards

## 1. Frontend Rules (Next.js & React)
- **Server Components by Default:** Components must remain Server Components unless interactivity (onClick, useState) or browser APIs are required. In those cases, push the `"use client"` directive as far down the component tree as possible.
  - *Why Chosen:* Reduces JavaScript bundle size and improves initial page load.
  - *Trade-offs:* Requires careful structuring to avoid passing non-serializable props.
- **TypeScript:** Strict mode enabled. No `any` types.
- **State Management:** Use TanStack Query for server data fetching and Zustand for purely local global state. Avoid Context API for rapidly changing values to prevent unnecessary re-renders.

## 2. Backend Rules (Django & DRF)
- **Fat Models, Helper Services, Thin Views:** 
  - *Views* only handle HTTP routing, parsing, and returning responses.
  - *Services* (`services.py`) handle complex business logic and write operations.
  - *Selectors* (`selectors.py`) handle complex read queries.
- **Why Chosen:** Keeps Views easily testable and allows business logic to be reused in Celery tasks or Management commands.
- **Alternatives:** Putting all logic in DRF Serializers or Views.
- **Trade-offs:** Adds more files and slight indirection, but scales much better for team development.
- **Query Optimization:** Always use `.select_related()` (for foreign keys) and `.prefetch_related()` (for many-to-many/reverse relations) in Views to prevent N+1 queries.

## 3. General Conventions
- **Git Branching:** Trunk-based development. Feature branches (`feature/add-login`) branch off `main` and merge back quickly.
- **Commits:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`). 
  - *Why Chosen:* Allows automated semver and changelog generation.
- **Pull Requests:** Must pass CI (Linting, Tests). Code reviews are mandatory.
- **Documentation:** All complex functions must have a docstring/JSDoc explaining *why* something is done, not *what* it does.
