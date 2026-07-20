# DevOps and Deployment

## 1. Environments
- **Local Development:** Managed entirely via `docker-compose.yml` to ensure parity across developer machines (PostgreSQL, Redis, Django, Next.js).
- **Production Deployment:** Containerized deployment onto a VPS or managed Kubernetes/ECS cluster depending on scale.

## 2. Web Server and Application Servers
- **Nginx:** Acts as the reverse proxy, terminating SSL, serving static/media files directly, and proxying API requests to Gunicorn and frontend requests to the Node runtime.
- **Gunicorn:** WSGI HTTP Server for UNIX serving the Django application. Tuned to `(2 x num_cores) + 1` workers.
- **Node Runtime:** Runs the Next.js standalone server build (`node server.js`).
  - *Why Chosen:* The `standalone` build minimizes Docker image size drastically.

## 3. SSL and Security
- **Domain Strategy:** The Next.js frontend and Django API must be deployed on subdomains of the same root domain (e.g., `app.domain.com` and `api.domain.com`) to facilitate seamless HttpOnly cookie sharing.
- **SSL:** Automated via Let's Encrypt / Certbot. Strict HTTP-to-HTTPS redirects managed by Nginx.
- **Firewall:** UFW configured to only allow ports 80 (HTTP), 443 (HTTPS), and 22 (SSH via key-only authentication).

## 4. CI/CD Pipeline
- **Tool:** GitHub Actions.
- **Workflow:**
  1. Lint (Ruff, Biome).
  2. Test (pytest, vitest).
  3. Build Docker images.
  4. Push to Container Registry.
  5. Trigger production webhooks to pull and restart containers.
- *Why Chosen:* GitHub Actions provides deep integration with the source code repository.

## 5. Monitoring, Rollback, and DR
- **Monitoring:** Sentry for application-level error tracking (Frontend & Backend). Prometheus + Grafana for server metrics.
- **Rollback Strategy:** Blue/Green deployments via Docker tags. If a release fails, Nginx is quickly repointed to the previous container tag.
- **Disaster Recovery:** Automated daily volume snapshots (EBS) and automated Postgres backups dumped to external encrypted S3 storage.
