# CHANGELOG

All notable changes to **BrewNest** will be documented in this file.

## [1.0.0] - 2026-06-26
### Added
- Complete full‑stack implementation (React + Vite frontend, Express + Prisma backend).
- JWT authentication with refresh tokens and role‑based access control.
- PostgreSQL schema with tables for users, menu, orders, loyalty, reservations, promotions, etc.
- Redis caching layer for menu and loyalty data.
- Docker multi‑stage builds for both frontend and backend.
- Comprehensive CI pipeline (lint, test, build, Docker image).
- Detailed client‑hand‑over documentation (README, INSTALL, DEPLOYMENT, etc.).
- Security hardening (Helmet, CORS, rate‑limiting, CSRF, OWASP compliance).

### Fixed
- Mass‑assignment vulnerability in user profile update.
- N+1 query issues on order retrieval.
- Missing indexes on frequently filtered columns.
- Large Docker image size reduced by 65 MB.

### Changed
- Refactored frontend to lazy‑load routes and memoize components for better performance.
- Updated API to use pagination on list endpoints.

## [Unreleased]
- Future feature ideas, bug fixes, and improvements.
