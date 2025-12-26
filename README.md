# 🚀 Frontend Starter Template

A production-ready frontend template using modern tooling:

- 🧑‍💻 Framework: Next.js / Vite (adjust as needed)
- 🧪 Testing: Vitest (unit) + Playwright (e2e)
- 🧹 Linting: Biome
- 🧾 Typing: TypeScript
- 🚦 CI/CD: GitHub Actions
- 🧩 Commit Style: Conventional Commits (w/ linting)
- 🚀 Release: Semantic Release (auto versioning + changelog)
- 📦 Package Manager: pnpm

---

## 🛠️ Getting Started

```bash
pnpm install
pnpm dev
```

---

## 📦 Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Run the dev server |
| `pnpm build` | Build the app |
| `pnpm lint` | Run Biome (lint + format) |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm release` | Trigger Semantic Release (usually via CI) |

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

To install Playwright browsers for CI:
```bash
pnpm test:e2e:install:ci
```

---

## ✅ Git Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) + commitlint.

Example:

```bash
git commit -m "feat(auth): add login flow (#123)"
```

> Make sure to include the task ID in your commit message if using Jira.

---

## 🔄 Releases

We use [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) for automated versioning and changelogs.

### To manually trigger a release (locally or CI):
```bash
pnpm release
```

> Releasing is automatically triggered on `main` via GitHub Actions.

---

## 🔧 GitHub Actions CI

- ✅ Linting (Biome)
- ✅ TypeScript type checking
- ✅ Vitest tests
- ✅ Playwright tests
- ✅ Semantic release (on push to `main`)
- ✅ Deploy (optional)

Check `.github/workflows/` for full config.

---

## 🧩 Project Structure (example)

```
.
├── apps/
│   └── dashboard/           # Main app
├── packages/
│   └── ui/                  # Shared component lib
├── .github/
│   └── workflows/           # CI config
├── .biome.json              # Biome config
├── vitest.config.ts         # Vitest config
├── playwright.config.ts     # Playwright config
└── package.json
```

---

## 🛡️ Security

- ✅ Biome security checks
- ✅ Playwright E2E auth flows
- 🔒 Add tools like Snyk, CodeQL for deeper scans (optional)

---

## 📋 Changelog

Maintained by `semantic-release` in [`CHANGELOG.md`](./CHANGELOG.md)

---

## 📦 Versioning

Semantic release automatically:
- Bumps version based on commit history
- Updates `CHANGELOG.md`
- Creates GitHub release

---

## 🧠 License

MIT © [Your Name or Team]
