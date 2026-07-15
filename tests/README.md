# Test Suite Setup

## Framework: Vitest

This project uses **Vitest** for unit and integration tests. E2E tests use **Playwright**.

## Setup

```bash
# Install test dependencies (if not already present)
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom jsdom
npm install -D @playwright/test

# Run unit tests
npx vitest run

# Run tests in watch mode
npx vitest

# Run with coverage
npx vitest run --coverage

# Run E2E tests
npx playwright test
```

## Test File Structure

```
tests/
├── unit/
│   ├── calculations.test.ts      # BDT format, date, salary math
│   └── mismatch.test.ts          # Mismatch detection logic
├── integration/
│   └── document-pipeline.test.ts # Full render → PDF → DOCX flow
└── e2e/
    └── document-generation.spec.ts # Playwright: fill form, export, verify
```

## Writing Tests

### Unit Tests
- Test pure functions (`calculations.ts`, `mismatch.ts`)
- No DOM or API dependencies
- Fast, isolated

### Integration Tests
- Test API routes with test database
- Verify full document pipeline
- Use Prisma test database or SQLite in-memory

### E2E Tests
- Use Playwright to drive browser
- Test actual user flows: select doc → fill form → export PDF
- Run against dev server (`npm run dev`)

## CI Integration

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

## Guidelines

1. **Test one thing per test case** — clear, focused assertions
2. **Use descriptive test names** — `should detect mismatched salary fields`
3. **Mock external dependencies** — don't hit real APIs in unit tests
4. **Use test data factories** — helper functions for common test data
5. **Keep tests fast** — unit tests < 100ms each, integration < 5s each

## Current Status
- [x] Unit test scaffolding created
- [x] Integration test scaffolding created
- [ ] Vitest configuration finalized
- [ ] Playwright configuration finalized
- [ ] CI pipeline configured
