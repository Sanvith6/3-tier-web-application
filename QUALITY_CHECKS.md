# Quality Checks

## Tools Overview

| #   | Tool                         | Where Used                                           | Why Used                            | How It Improves the Project                                                                                  |
| --- | ---------------------------- | ---------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **Prettier**                 | `backend/`, `frontend/`                              | Enforce consistent code style       | Eliminates style debates in code reviews; every file looks the same regardless of who wrote it               |
| 2   | **ESLint**                   | `backend/`, `frontend/`                              | Catch code bugs before runtime      | Flags unused variables, undefined references, and bad patterns before they reach production                  |
| 3   | **Husky + lint-staged**      | Root `.husky/pre-commit`                             | Block bad commits at the source     | Runs lint & format on staged files automatically on every `git commit` — broken code can't enter git history |
| 4   | **Jest**                     | `backend/tests/`                                     | Unit test backend API logic         | Proves that individual functions and API endpoints behave correctly without needing a running database       |
| 5   | **Vitest**                   | `frontend/tests/`                                    | Unit test React components          | Verifies UI components render and behave correctly in isolation                                              |
| 6   | **Coverage Threshold (70%)** | `backend/jest.config.cjs`, `frontend/vite.config.js` | Enforce minimum test coverage       | CI fails if less than 70% of code is covered by tests — prevents shipping untested features                  |
| 7   | **Hadolint**                 | `.hadolint.yaml` + CI                                | Lint Dockerfiles for best practices | Catches issues like running as root, using `latest` tags, or bad layer ordering before images are built      |
| 8   | **npm audit**                | CI pipeline                                          | Scan npm packages for known CVEs    | Blocks merges if any dependency has a HIGH or CRITICAL security vulnerability                                |
| 9   | **Trivy**                    | CI pipeline                                          | Scan built Docker images for CVEs   | Detects OS-level and package-level vulnerabilities inside the final container image — not just npm packages  |

---

## Where Each Tool Lives

```
project-devops/
├── .husky/
│   └── pre-commit          ← Husky hook (runs lint-staged on commit)
├── .hadolint.yaml          ← Hadolint config (Dockerfile linter rules)
├── .github/
│   └── workflows/
│       └── ci.yml          ← GitHub Actions (runs ALL checks on push/PR)
├── backend/
│   ├── eslint.config.js    ← ESLint rules for backend
│   ├── .prettierrc.json    ← Prettier rules for backend
│   └── jest.config.cjs     ← Jest config + 70% coverage threshold
└── frontend/
    ├── eslint.config.js    ← ESLint rules for frontend
    ├── .prettierrc.json    ← Prettier rules for frontend
    └── vite.config.js      ← Vitest config + 70% coverage threshold
```

---

## When Each Check Runs

| Check               | On `git commit`   | On push/PR to GitHub         |
| ------------------- | ----------------- | ---------------------------- |
| Prettier            | ✅ Auto via Husky | ✅ CI `format` job           |
| ESLint              | ✅ Auto via Husky | ✅ CI `lint` job             |
| Jest / Vitest tests | ❌ Manual         | ✅ CI `test` job             |
| Coverage threshold  | ❌ Manual         | ✅ CI `test` job             |
| npm audit           | ❌ Manual         | ✅ CI `dependency-audit` job |
| Hadolint            | ❌ Manual         | ✅ CI `dockerfile-lint` job  |
| Docker build        | ❌ Manual         | ✅ CI `docker-build` job     |
| Trivy scan          | ❌ Manual         | ✅ CI `trivy-scan` job       |

> **Rule:** If any check fails on a Pull Request, the PR **cannot be merged** until the issue is fixed.
