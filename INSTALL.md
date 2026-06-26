# INSTALL

## Prerequisites
- **Node.js** >= 20 (LTS) – install from <https://nodejs.org/>.
- **Docker** & **Docker‑Compose** – for local PostgreSQL and Redis.
- **Git** – to clone the repository.
- **npm** (bundled with Node) or **yarn** (optional).

## Clone the Repository
```bash
git clone https://github.com/your-org/brewnest.git
cd brewnest
```

## Install Dependencies
```bash
# Front‑end
cd client
npm ci   # installs exact versions from package-lock.json

# Back‑end
cd ../server
npm ci
```

## Configure Environment Variables
```bash
# Copy the example env file and fill in the values
cp .env.example .env
# Edit .env with your preferred editor (VS Code, nano, etc.)
```

## Database Migration & Seeding
```bash
# Start PostgreSQL & Redis containers (Docker Compose)
docker compose up -d db redis

# Run Prisma migrations (creates tables)
npx prisma migrate deploy   # or `npm run db:migrate`

# Seed development data (demo users, menu, loyalty tiers)
npm run db:seed
```

## Start the Application
```bash
# Front‑end (Vite dev server)
cd ../client
npm run dev   # http://localhost:5173

# Back‑end (Express dev server)
cd ../server
npm run dev   # http://localhost:3001
```

## Run Tests
```bash
# Unit / integration tests for backend
cd server
npm run test

# Front‑end tests (Vitest)
cd ../client
npm run test
```

You should now be able to visit **http://localhost:5173** and interact with the full BrewNest application.
