# Architecture Decisions Log

This document summarizes the major architectural decisions, the alternatives considered, the rationale, and the potential need to revisit them in the future.

| Decision | Alternatives | Why Chosen | Trade-offs | Future Revisit? |
| --- | --- | --- | --- | --- |
| **Decoupled Monorepo** | Multi-repo | Single source of truth, easy onboarding, shared CI. | CI must be carefully tuned to avoid redundant cross-stack builds. | No |
| **Next.js App Router** | Pages Router, Vite/SPA | Unmatched SSR, SEO, and RSC performance. | Steeper learning curve for Server vs Client components. | No |
| **Tailwind CSS v4 + shadcn** | Material-UI, CSS-in-JS | Maximum performance, zero lock-in, auditable components. | More initial setup required than dropping in a pre-built library. | No |
| **PostgreSQL UUID PKs** | Integer IDs | Prevents URL enumeration, secure by default. | Slightly higher storage footprint and index lookup times. | No |
| **HttpOnly Cookie JWT Auth** | LocalStorage JWT, Session | Mitigates XSS entirely while remaining stateless on the DB. | Requires a shared root domain (e.g., `api.domain.com` and `app.domain.com`) to avoid Next.js acting as a traffic proxy bottleneck. | No |
| **Django Service Layer** | Fat Views / Fat Serializers | Decouples business logic from HTTP transport, making code reusable. | Adds extra abstraction layers (`services.py`, `selectors.py`). | No |
| **Limit/Offset Pagination** | Cursor Pagination | Drastically simpler to implement (KISS) and satisfies 95% of use cases out of the box. | Can suffer from data skipping during live inserts compared to Cursor pagination. | Yes (Add Cursor when an infinite-scroll feed explicitly requires it) |
| **Targeted Soft Deletes** | Global Soft Deletes | Simplifies unique constraints and database schema by only soft-deleting critical business entities (e.g., `User`, `Order`). | Requires developers to explicitly configure soft-delete mechanisms per model. | No |
| **Docker Compose Local Dev** | Native installs, venv | Guarantees identical environments for all developers (DB, Redis, App). | High memory/CPU overhead on local machines. | No |
