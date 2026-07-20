# Security Guidelines

## 1. Authentication & Authorization Flow
- **Authentication:** Users authenticate via email and password to a Next.js Server Action (BFF). Next.js forwards this to Django DRF to receive a JWT pair. Next.js then sets the Access and Refresh tokens as HttpOnly, Secure, `SameSite=Lax` cookies. 
  - **Crucial Domain Strategy:** Django and Next.js **must** share a top-level domain (e.g., `app.example.com` and `api.example.com`). Next.js sets the cookie with `Domain=.example.com`, allowing the browser to natively send the HttpOnly cookie directly to Django for client-side API requests. Next.js will NOT proxy all requests, preventing a massive scalability bottleneck.
  - *Why Chosen:* Protects JWTs from XSS attacks while maintaining a stateless Django API, and avoids proxying all traffic through Next.js.
  - *Alternatives:* `localStorage` (vulnerable to XSS) or Session Auth (requires sticky sessions / stateful backend).
- **Authorization:** Handled via DRF Permissions classes (`IsAuthenticated`, custom object-level permissions).

## 2. Web Vulnerability Mitigations
- **CSRF:** Django's `CsrfViewMiddleware` enforced for all POST/PUT/DELETE requests.
- **CORS:** `django-cors-headers` configured to explicitly allow only the production Next.js frontend domain. Wildcards (`*`) are strictly forbidden.
- **CSP (Content Security Policy):** Next.js middleware will inject strict CSP headers preventing inline scripts and restricting asset loading strictly to trusted domains.
- **XSS Prevention:** React natively escapes string variables in JSX. Using `dangerouslySetInnerHTML` is prohibited without a strict code review and HTML sanitization library (like `DOMPurify`).
- **SQL Injection:** Django's ORM parameterizes queries automatically. Raw SQL queries are strictly prohibited unless absolutely necessary and must use parameterized inputs.

## 3. Secrets and Environment Variables
- Secrets must never be hardcoded. Use a `.env` file locally.
- Production secrets are injected at runtime via Docker environment variables from a secure vault (e.g., GitHub Secrets, AWS Secrets Manager).

## 4. Auditing
- Implement dependency scanning in CI/CD (e.g., `npm audit`, `pip-audit`) to prevent supply chain attacks.
- Adhere strictly to mitigating the OWASP Top 10 (Injection, Broken Auth, Sensitive Data Exposure, etc.).
