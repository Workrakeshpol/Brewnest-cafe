# DEPLOYMENT

## Overview
The BrewNest platform consists of three deployable services:
1. **Frontend** – a static React application built with Vite.
2. **Backend API** – an Express server written in TypeScript.
3. **PostgreSQL database** – stores all persistent data (users, orders, menu, etc.).

Both services can be hosted on any cloud provider that supports Docker containers (AWS ECS/Fargate, Fly.io, Render, Railway, etc.). The database can be a managed PostgreSQL instance (Supabase, AWS RDS, Neon) or the Docker‑Compose‑provided instance for staging.

---

## 1. Deploy Frontend
1. **Build**
   ```bash
   cd client
   npm run build   # Generates ./dist with immutable assets
   ```
2. **Host** – upload the `dist` folder to a static‑site host (Vercel, Netlify, AWS S3 + CloudFront, etc.).
3. **Environment Variables** – expose only public variables prefixed with `VITE_` (e.g., `VITE_API_URL`). Configure them in the host UI.
4. **HTTPS** – the host provides TLS automatically. Ensure the `VITE_API_URL` uses `https://` in production.

---

## 2. Deploy Backend API
### Docker Container (recommended)
1. **Dockerfile** – already includes a multi‑stage build that produces a minimal `node:20-alpine` image.
2. **Build & Push**
   ```bash
   cd server
   docker build -t your‑registry/brewnest-api:latest .
   docker push your‑registry/brewnest-api:latest
   ```
3. **Run** (Docker‑Compose example for production):
   ```yaml
   version: "3.9"
   services:
     api:
       image: your-registry/brewnest-api:latest
       restart: unless-stopped
       env_file: .env.production
       ports:
         - "3001:3001"
       depends_on:
         - db
         - redis
     db:
       image: postgres:15-alpine
       environment:
         POSTGRES_USER: ${POSTGRES_USER}
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
         POSTGRES_DB: ${POSTGRES_DB}
       volumes:
         - pgdata:/var/lib/postgresql/data
     redis:
       image: redis:7-alpine
       command: ["redis-server", "--appendonly", "yes"]
   volumes:
     pgdata:
   ```
4. **Health Checks** – the API exposes `GET /api/v1/healthz`. Docker healthcheck example:
   ```Dockerfile
   HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
     CMD curl -f http://localhost:3001/api/v1/healthz || exit 1
   ```
5. **TLS Termination** – place the API behind a reverse proxy (NGINX, Traefik, AWS ALB) that terminates TLS and forwards traffic to port 3001.
6. **Scaling** – the container is stateless; horizontal scaling works out‑of‑the‑box. Redis stores session data for refresh‑token handling.

---

## 3. Deploy PostgreSQL
- **Managed Service** – preferred for production. Provide connection string in `DATABASE_URL`.
- **Docker** – for staging:
  ```bash
  docker run -d \
    -e POSTGRES_USER=brewnest \
    -e POSTGRES_PASSWORD=brewnest \
    -e POSTGRES_DB=brewnest \
    -p 5432:5432 \
    --name brewnest-db \
    postgres:15-alpine
  ```
- **Backups** – enable automated snapshots in the cloud provider or schedule `pg_dump`.

---

## 4. SSL & Domain Setup
- Obtain a certificate via **Let’s Encrypt** (or use your provider’s certificate).
- Configure the reverse proxy (NGINX example):
  ```nginx
  server {
    listen 443 ssl;
    server_name api.brewnest.example.com;
    ssl_certificate /etc/letsencrypt/live/api.brewnest.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.brewnest.example.com/privkey.pem;

    location / {
      proxy_pass http://api:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
  ```
- Redirect HTTP → HTTPS for both frontend and backend.

---

## 5. Rollback Strategy
1. **Docker images** – tag each release (`v1.2.3`). Rolling back is a matter of redeploying the previous tag.
2. **Database migrations** – use Prisma's `migrate reset` only on non‑production environments. For production, create forward‑only migrations; roll back by applying a new migration that reverses the change.
3. **Feature flags** – optional; wrap new features behind a flag that can be toggled via an environment variable.

---

## 6. Post‑Deployment Checklist
- [ ] Verify `GET /api/v1/healthz` returns `OK`.
- [ ] Confirm frontend API base URL points to the secure backend.
- [ ] Run a smoke test: register a demo user, place a test order.
- [ ] Check logs (`docker logs`) for any uncaught errors.
- [ ] Ensure backups are scheduled and retention policy is set.

---

*For detailed CI/CD pipeline configuration, see the GitHub Actions workflow files in `.github/workflows/`.*
