# API Specification

This document defines the rules for the RESTful API communication between the Next.js frontend and Django backend.

## 1. Versioning Strategy
- **Rule:** API endpoints must include the version in the URL path: `/api/v1/users/`.
- **Why Chosen:** The simplest and most visible way to track versions and route traffic via Nginx.
- **Alternatives Considered:** Header-based versioning (`Accept: application/vnd.app.v1+json`).
- **Trade-offs:** URL versioning is less "REST-pure" but drastically easier to debug in a browser or curl.

## 2. Endpoint Naming Conventions
- **Rule:** Use plural nouns and `kebab-case`. Examples: `/api/v1/user-profiles/`, NOT `/api/v1/getUserProfile/`.
- **Why Chosen:** Standard REST convention. Actions belong in HTTP methods (GET, POST, PUT, DELETE), not URLs.

## 3. Response Formats
**Success (2xx):**
```json
{
  "data": { ... },
  "meta": { "pagination": { ... } } 
}
```
**Error (4xx/5xx):**
```json
{
  "error": {
    "code": "validation_failed",
    "message": "Invalid input data.",
    "details": { "email": ["This field must be unique."] }
  }
}
```
- **Why Chosen:** A standardized envelope ensures the frontend can universally parse responses using a single interceptor.
- **Alternatives:** Raw arrays or objects without an envelope.
- **Trade-offs:** Adds slight payload overhead but significantly improves frontend predictability.

## 4. Pagination
- **Strategy:** **Limit/Offset pagination** is the strict default for all endpoints. Cursor pagination will only be implemented when a specific feature (like an infinite-scroll feed) explicitly demands it.
- **Why Chosen:** Limit/Offset is drastically simpler to implement and debug (KISS principle). Defaulting to Cursor pagination everywhere violates YAGNI.
- **Alternatives:** Page-number pagination, Cursor-first approach.
- **Trade-offs:** Limit/Offset can suffer from data skipping if items are inserted during pagination, but this is an acceptable trade-off for initial velocity and simplicity.

## 5. Filtering and Sorting
- **Strategy:** Query parameters. `?sort=-created_at` (descending) or `?status=active`. Use Django-Filter package.

## 6. Authentication & Authorization
- **Strategy:** JWT stored in HttpOnly secure cookies. The frontend sends credentials to a BFF (Next.js route), which negotiates the JWT with Django and sets the cookie.
- **Why Chosen:** Completely eliminates XSS attacks targeting `localStorage` JWTs.

## 7. Rate Limiting and Idempotency
- **Strategy:** Redis-backed rate limiting via DRF `AnonRateThrottle` and `UserRateThrottle`. 
- **Idempotency:** POST requests for sensitive actions (e.g., payments) must include an `Idempotency-Key` header.
- **Why Chosen:** Prevents double-charging and mitigates brute-force attacks.

## 8. OpenAPI Generation
- **Strategy:** Auto-generated using `drf-spectacular`. 
- **Why Chosen:** Ensures frontend types can be generated directly from backend schemas.
