# CONTRIBUTING

## How to Contribute
We welcome contributions from the community! Whether you want to fix a bug, add a feature, improve documentation, or refactor code, please follow the guidelines below.

### 1. Fork the Repository
- Click the **Fork** button on the GitHub repository page.
- Clone your fork locally:
  ```bash
  git clone https://github.com/<your-username>/brewnest.git
  cd brewnest
  ```

### 2. Create a Feature Branch
```bash
git checkout -b <type>/<short-description>
# e.g., feat/add-payment-webhook or fix/menu-pagination
```

### 3. Development Workflow
1. **Install dependencies** (`npm ci`) for both `client` and `server` as described in `INSTALL.md`.
2. **Run the development environment** using Docker Compose:
   ```bash
   docker compose up -d db redis
   ```
3. **Start the services**:
   ```bash
   # Frontend
   cd client && npm run dev
   # Backend
   cd ../server && npm run dev
   ```
4. **Write tests** for any new code. Backend uses Vitest + Supertest, frontend uses Vitest + React Testing Library.
5. **Lint** your changes:
   ```bash
   npm run lint   # from the repository root (runs both frontend and backend linters)
   ```
6. **Commit** your changes with a clear, conventional commit message (see below).

### 4. Commit Message Format
We follow the **Conventional Commits** specification:
```
<type>(<scope>): <short summary>

<body>

<footer>
```
- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **scope**: optional, e.g., `menu`, `auth`, `docker`.
- **footer**: include `BREAKING CHANGE:` if applicable.

### 5. Run the Test Suite
```bash
npm run test   # runs both backend and frontend tests
```
All tests must pass before opening a Pull Request.

### 6. Open a Pull Request
- Push your branch to your fork:
  ```bash
  git push origin <type>/<short-description>
  ```
- Open a PR against the `main` branch of the upstream repository.
- Fill out the PR template, linking any related issues.
- Respond to any reviewer comments promptly.

### 7. Code Review & Merge
- At least one maintainer must approve the PR.
- Ensure CI passes (lint, tests, build).
- Once approved, the maintainer will merge using **Squash and Merge** to keep a clean history.

### 8. Release Process (maintainers only)
- Update `CHANGELOG.md` following the Keep a Changelog format.
- Tag a new version (`vX.Y.Z`) and push the tag.
- CI will automatically build Docker images and publish them.

---
**Thank you for contributing!** 🎉
