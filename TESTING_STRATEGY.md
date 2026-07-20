# Testing Strategy

## 1. Scope and Types
- **Unit Testing:** 
  - *Backend:* `pytest` to test isolated Services and Selectors.
  - *Frontend:* `vitest` to test isolated hook logic and pure utility functions.
- **Integration & API Testing:**
  - *Backend:* `pytest-django` with isolated test databases to test DRF endpoints and their interactions with the database.
- **E2E Testing:** Playwright will simulate real user browser sessions against a staging environment.
  - *Why Chosen:* Playwright provides superior cross-browser debugging over Cypress.
- **Accessibility (A11y) Testing:** Axe-core integrated into the CI pipeline to catch structural DOM issues.

## 2. Non-Functional Testing
- **Performance Testing:** Lighthouse CI checks on frontend builds.
- **Load Testing:** k6 used to stress-test critical API endpoints (e.g., login, checkout) prior to major releases.
- **Security Testing:** Bandit (Python) and npm audit run automatically in CI.

## 3. Coverage Requirements
- Minimum **80% overall test coverage** is required for both backend and frontend codebases before merging a PR. Coverage thresholds will be enforced by Codecov or standard GitHub Actions workflows.
- *Trade-offs:* High coverage requirements slow down rapid prototyping, but prevent severe regressions in production.
