## Ongoing Maintenance

- After any alias or config change, run all tests and type checks (`npm run validate`).
- Use ESLint to catch unresolved imports early.
- Run `node scripts/sync-aliases.cjs` after changing path aliases in `tsconfig.json`.
- Keep setup files minimal and up to date for each runner.

# Testing Conventions for Trade-Pro

## Test File Organization

- **Unit/Component Tests (Vitest):**
  - Location: `src/__tests__/` or alongside components/services
  - Naming: `.test.ts` or `.test.tsx`
  - Runner: Vitest

- **Integration Tests (Jest):**
  - Location: `tests/integration/`
  - Naming: `.integration.test.ts`
  - Runner: Jest

## Why This Structure?

- Clear separation of test types
- Prevents accidental cross-runner execution
- Eases onboarding and maintenance

## How to Run

- **All tests:** `npm test` (runs both unit and integration tests)
- **Unit tests only (Vitest):** `npm run test:unit`
- **Integration tests only (Jest):** `npm run test:integration`

## Adding New Tests

- Place new unit/component tests in `src/__tests__/` or next to the code they test, using
  `.test.ts(x)`
- Place new integration tests in `tests/integration/`, using `.integration.test.ts`

---

For more details, see the main `README.md` or ask the team!
