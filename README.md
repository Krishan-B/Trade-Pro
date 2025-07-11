# Multi Asset CFD Simulated Trading Platform

## Overview

This project is a comprehensive web-based Multi Asset CFD (Contract for Difference) simulated trading platform. It enables users to practice trading strategies across multiple asset classes without financial risk, featuring real-time market data simulation, advanced order management, analytics, and educational tools.

## Key Documents

- [Product Requirements Document (PRD)](./PRD.md)
- [Development Roadmap](./Roadmap.md)
- [Technology Stack & Infrastructure](./TechStack.md)

## Technology Stack & Infrastructure

See [TechStack.md](./TechStack.md) for full details.

**Frontend:** React, TypeScript, Vite, Radix UI (shadcn/ui), Tailwind CSS, TradingView Charting Library, Redux Toolkit/Zustand, React Router, React Hook Form, Framer Motion, and more.

**Backend/BaaS:** Supabase (PostgreSQL, Auth, Storage, Realtime), Supabase Edge Functions, RESTful API, SQL migrations, seed data.

**Testing & Quality:** Vitest, React Testing Library, ESLint, Prettier, TypeScript.

**DevOps & Tooling:** npm, Husky, EditorConfig, GitHub Actions, custom scripts.

**Monitoring & Security:** Supabase dashboard, custom logging, alerting, RLS, security policies, CODEOWNERS.

**Documentation:** Markdown docs (`docs/`), PRD, Roadmap, TechStack.

---

### Best Practices

- All dependencies are kept up-to-date and compatible.
- Scripts are optimized for build, lint, typecheck, health, and diagnostics.
- VS Code extensions and settings are recommended and configured.
- Environment variables are used for all secrets and endpoints.
- Modular scripts and documentation for onboarding and troubleshooting.
- Pre-commit hooks enforce code quality.
- CI/CD pipelines for validation and deployment.

---

This README and all documentation are auto-generated and should be updated as the stack evolves.
