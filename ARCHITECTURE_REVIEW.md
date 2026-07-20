# Architecture Review
**Date:** 05 July 2026
**Reviewer:** Senior Staff Engineer / Architect
**Context:** 5-Year Maintenance Horizon, 20+ Engineers

This document provides a final, rigorous review of the proposed engineering specifications, looking specifically for YAGNI/KISS violations, technical debt, and scalability bottlenecks.

## 1. Strengths
- **Decoupled Monorepo:** Excellent choice for a 20-engineer team. It provides a single source of truth without tightly coupling frontend and backend runtimes.
- **Django Service Layer Pattern:** Separating business logic from Views/Serializers ensures the backend respects the Single Responsibility Principle (SOLID). This prevents "fat models" and "fat views" from becoming unmaintainable over 5 years.
- **Tech Stack Longevity:** Django 6.0, Next.js 16.2, and PostgreSQL 18 represent the cutting edge of stable software, ensuring a long runway before major legacy upgrades are needed.
- **Security-First Approach:** Utilizing HttpOnly cookies and preventing `localStorage` JWT storage neutralizes the most common XSS attack vectors.

## 2. Weaknesses
- **Cookie/Domain Ambiguity (Contradiction Risk):** The `SECURITY_GUIDELINES.md` states Next.js acts as a BFF (Backend-For-Frontend) to set HttpOnly cookies. However, if the browser is expected to make direct calls to the Django API using this cookie, Django and Next.js **must** share a top-level domain (e.g., `app.domain.com` and `api.domain.com`). If Next.js proxies *all* API requests to Django to attach the cookie, Next.js becomes a severe scalability bottleneck.
- **Global Soft Deletes (YAGNI Violation):** `DATABASE_GUIDELINES.md` recommends `is_deleted` globally. Implementing soft deletes on every table introduces massive complexity for unique constraints (e.g., unique email) and cascading logic. 
- **Pagination Complexity:** Supporting both Cursor and Limit/Offset pagination from Day 1 introduces unnecessary branching in API design unless immediately required by the UI.

## 3. Risks
- **Next.js Server Component (RSC) Auth Forwarding:** A hidden technical debt in Next.js decoupled architectures is that Server Components do not automatically forward client cookies to the backend. Engineers will need to manually extract cookies from `next/headers` and attach them to Django `fetch()` calls. If forgotten, SSR pages will render as unauthenticated.
- **Over-engineering with Celery:** Deploying Celery + Redis from Day 1 adds 2 extra infrastructure components. While necessary for a mature product, it violates KISS for initial feature launches if simple async tasks could be handled by Django 6.0's async capabilities.

## 4. Missing Documentation
- **Local Git Hooks:** `CODING_STANDARDS.md` mentions PR checks but omits local `pre-commit` hook enforcement (e.g., running Ruff and Biome automatically before pushing).
- **Cookie Domain Strategy:** The `DEVOPS_DEPLOYMENT.md` does not specify the DNS/Domain layout required to make the HttpOnly JWT strategy work securely between the two frameworks.

## 5. Recommended Improvements (Simplifications)
1. **Clarify the Auth Architecture (Mandatory):** Django and Next.js must be deployed on subdomains of the same root domain. Next.js sets the HttpOnly cookie with `Domain=.example.com`. The browser will then natively send the cookie directly to Django for client-side fetches.
2. **Restrict Soft Deletes (Mandatory):** Remove the global soft-delete requirement. Apply it strictly to high-value models (e.g., `User`, `Order`).
3. **Automate Cookie Forwarding:** Create a standardized server-side `fetch` wrapper in `frontend/src/lib/api.ts` that automatically extracts and forwards the HttpOnly JWT to Django during SSR.
4. **Standardize Pagination:** Default strictly to Limit/Offset pagination to start (KISS). Only implement Cursor pagination when a specific feed explicitly requires infinite scrolling.

## 6. Items Requiring Future Review
- **Celery / Redis Dependency:** Review within 6 months whether the async queue is strictly necessary, or if Django's async background tasks (via ASGI) are sufficient for the scale.
- **TypeScript 7.0 Migration:** As noted in the chronologically-corrected research, we are starting on TS 6.9.4. A migration plan to the TS 7.0 Go-native compiler should be reviewed in Q4 2026.

## 7. Final Verdict

**GO WITH CHANGES**

The architecture is overwhelmingly solid and enterprise-ready, but contains a few hidden complexities that will frustrate developers early on. 

### Mandatory Changes Required Before Implementation:
1. **Update `SECURITY_GUIDELINES.md` & `DEVOPS_DEPLOYMENT.md`** to explicitly define the shared-domain cookie strategy (e.g., `api.project.com` and `app.project.com`) to prevent proxy-bottlenecking Next.js.
2. **Update `DATABASE_GUIDELINES.md`** to restrict Soft Deletes to high-value business entities only, abandoning the global `is_deleted` rule to simplify unique constraints.
3. **Update `API_SPECIFICATION.md`** to strictly default to Limit/Offset pagination (KISS), deferring Cursor pagination until required by a specific infinite-scroll feature.
