# Trade-Pro Codespace Setup Guide

## 1. Initial Setup (One-Time)

- Clone the repository or open in GitHub Codespaces.
- Install all dependencies:
  For the frontend (root directory):
  ```bash
  npm install
  ```
  For the backend API (server directory):
  ```bash
  cd server && npm install && cd ..
  ```
- Set up your Git user/email:
  ```bash
  git config --global user.name "Krishan-B"
  git config --global user.email "krishanthan.balasubramaniam@gmail.com"
  ```
- Install recommended VS Code extensions (should be automatic in Codespaces):
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## 2. Database Setup

- Run Supabase migrations and seed the database:
  ```bash
  bash scripts/db-migrate-seed.sh
  ```
  (Uses `npx supabase` for compatibility)

## 3. Development Servers

- Start the frontend (React/Vite):
  ```bash
  npm run dev
  ```
- Start the backend API:
  ```bash
  cd server && npm run dev
  ```

## 4. Code Quality & Pre-commit Hooks

- Pre-commit hooks are set up with Husky and lint-staged.
- To manually lint/format:
  ```bash
  npm run lint
  npx prettier --write .
  ```

## 5. Testing

- Run all tests:
  ```bash
  npm test
  # or for Vitest
  npm run test:unit
  ```
- Health check scripts:
  ```bash
  node test-health.ts
  bash scripts/health-check-all.sh
  ```

## 6. Troubleshooting

- If Supabase CLI is not found, use `npx supabase ...` instead of `supabase ...`.
- If migrations fail, check your network and Supabase project credentials.
- For extension issues, re-run:
  ```bash
  npm run extensions:install
  ```
- For Codespace-specific issues, see `scripts/diagnose-vscode-environment.sh` and modular
  diagnostics in `scripts/diagnostics/`.

## 7. Quick Reference

- **Lint:** `npm run lint`
- **Format:** `npx prettier --write .`
- **Test:** `npm test` or `npm run test:unit`
- **Start frontend:** `npm run dev`
- **Start backend:** `cd server && npm run dev`
- **Migrate/seed DB:** `bash scripts/db-migrate-seed.sh`
- **Generate Supabase Types:** `npm run supabase:gen-types YOUR_SUPABASE_ACCESS_TOKEN` (replace `YOUR_SUPABASE_ACCESS_TOKEN` with your actual token)

## 8. Security & Best Practices

- Never commit secrets or credentials.
- Use environment variables for sensitive config.
- Review RLS policies in `supabase/` for data security.
- Pre-commit hooks enforce lint/format on commit.

---

For more, see `README.md`, `docs/`, and `scripts/` for advanced usage and diagnostics.
