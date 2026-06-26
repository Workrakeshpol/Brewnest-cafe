# BrewNest

## Project Overview
BrewNest is a full‑stack coffee‑house web application that lets customers browse the menu, place orders, manage reservations, and earn loyalty points. Staff and administrators have dedicated dashboards for menu management, order processing, and analytics.

## Features
- User registration, email verification, JWT‑based authentication (access + refresh tokens)
- Interactive menu with categories, variants, and real‑time availability
- Shopping cart, checkout with Stripe integration (mocked for dev)
- Loyalty program with tiers and point redemption
- Table reservations with calendar view
- Admin panel for CRUD operations on menu, orders, promotions, and users
- Role‑based access control (admin, manager, staff, customer)
- Comprehensive API with OpenAPI‑style documentation

## Screenshots (placeholders)
![Home page placeholder](./docs/screenshots/home.png)
![Menu page placeholder](./docs/screenshots/menu.png)
![Admin dashboard placeholder](./docs/screenshots/admin.png)

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React‑Router, Zustand (state), Zod (validation)
- **Backend**: Node 20, Express, TypeScript, Prisma (PostgreSQL ORM), Zod, JWT, Redis (caching & session store)
- **Database**: PostgreSQL (hosted locally or via Docker)
- **Containerisation**: Docker & Docker‑Compose
- **CI/CD**: GitHub Actions (lint, test, build, Docker image)

## Folder Structure
```
BrewNest/
├─ client/                # React frontend
│   ├─ src/
│   └─ public/
├─ server/                # Express backend
│   ├─ src/
│   │   ├─ config/       # env & DB config
│   │   ├─ middleware/   # auth, rbac, error handling
│   │   ├─ routes/       # API route modules
│   │   ├─ controllers/  # request handlers
│   │   └─ utils/        # logger, response helpers
│   └─ prisma/            # Prisma schema & migrations
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

## Local Setup
1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/brewnest.git
   cd brewnest
   ```
2. **Create a `.env` file** (copy from `.env.example` and fill values).
3. **Start services** with Docker Compose:
   ```bash
   docker compose up -d
   ```
4. **Install dependencies**
   ```bash
   # Frontend
   cd client && npm ci && npm run dev
   # Backend
   cd ../server && npm ci && npm run dev
   ```
5. Open `http://localhost:5173` for the frontend and `http://localhost:3001/api/v1/healthz` for the backend health check.

## Deployment Links
- **Frontend**: <https://brewnest.example.com> (Vercel / Netlify)
- **Backend**: <https://api.brewnest.example.com> (AWS ECS, Fly.io, Render, etc.)
- **Database**: Managed PostgreSQL on Supabase / AWS RDS

## Environment Variables
See the dedicated **`.env.example`** file for a full list and description of each variable.

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Customer | `demo@example.com` | `Password123!` |
| Staff | `staff@brewnest.com` | `Password123!` |
| Manager | `manager@brewnest.com` | `Password123!` |
| Admin | `admin@brewnest.com` | `Password123!` |

These accounts are seeded in the development database.