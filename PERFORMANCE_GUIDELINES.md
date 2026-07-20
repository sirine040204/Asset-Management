# Performance Guidelines

## 1. Frontend Performance
- **Rendering Strategy:** Prioritize React Server Components (RSC) to shift the rendering burden and bundle size away from the client.
  - *Why Chosen:* Drastically reduces Time-To-Interactive (TTI) on low-end devices.
- **Bundle Optimization & Code Splitting:** Next.js handles route-level splitting automatically. Use `next/dynamic` to lazy-load heavy client-side components (e.g., charts, rich text editors).
- **Image Optimization:** Always use `<Image>` from `next/image` to serve WebP/AVIF formats, enforce lazy loading, and prevent Cumulative Layout Shift (CLS).
- **React Optimization:** React Compiler (v19) optimizes re-renders automatically. Avoid deep nested prop-drilling by utilizing Zustand.

## 2. Backend Performance
- **N+1 Query Prevention:** Always analyze API endpoints using tools like `django-debug-toolbar` (locally). Enforce `.select_related()` for ForeignKey traversals and `.prefetch_related()` for ManyToMany traversals.
  - *Why Chosen:* Database roundtrips are the most common bottleneck in Django APIs.
- **PostgreSQL Indexing:** Add `db_index=True` to any field frequently used in `filter()`, `exclude()`, or `order_by()`.
- **Redis Caching Strategy:** Use Redis to cache heavy, infrequently changing API responses (e.g., public catalogs).
- **Async Tasks:** Offload slow processes (emails, image processing, external API calls) to Celery workers backed by Redis.
  - *Why Chosen:* Prevents blocking the Gunicorn HTTP worker thread, maintaining high throughput for the API.
