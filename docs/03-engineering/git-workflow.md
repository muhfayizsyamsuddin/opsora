# Git Workflow

Version: 1.0

Status: Draft

Author: Faiz

Last Updated: 2026-07-27

---

# Overview

This document defines the Git workflow used in the Opsora project.

It covers:

- Branch strategy
- Naming conventions
- Commit conventions
- Pull request guidelines
- Merge strategy
- Release process

## Branch Strategy
main
│
├── feature/authentication
├── feature/products
├── feature/sales
├── bugfix/login
├── hotfix/security
└── docs/api-design

## Branch Naming Convention
| Type          | Format            | Example                    |
| ------------- | ----------------- | -------------------------- |
| Feature       | `feature/<name>`  | `feature/products`         |
| Bug Fix       | `bugfix/<name>`   | `bugfix/login-error`       |
| Hot Fix       | `hotfix/<name>`   | `hotfix/jwt-expiration`    |
| Documentation | `docs/<name>`     | `docs/erd-update`          |
| Refactor      | `refactor/<name>` | `refactor/product-service` |
| Chore         | `chore/<name>`    | `chore/eslint-config`      |

## Commit Convention
| Type     | Purpose                  |
| -------- | ------------------------ |
| feat     | New feature              |
| fix      | Bug fix                  |
| docs     | Documentation            |
| refactor | Code refactoring         |
| style    | Formatting only          |
| test     | Add or update tests      |
| chore    | Maintenance tasks        |
| perf     | Performance improvements |
| ci       | CI/CD changes            |
contoh:
feat(products): add product CRUD
fix(auth): validate expired JWT
docs(erd): update inventory relationship
refactor(service): simplify purchase transaction
test(products): add create product tests
chore(deps): update Prisma version

## Commit Rules
- One logical change per commit.
- Write commit messages in English.
- Keep commits small and focused.
- Commit frequently during development.
- Never commit broken code.

## Pull Request Guidelines
## Summary

Describe the change.

---

## Changes

-

-

-

---

## Testing

-

-

---

## Checklist

- [ ] Build passed

- [ ] Tests passed

- [ ] Documentation updated
## Merge Strategy
Squash and Merge
Keuntungan:
History lebih bersih.
Satu feature menjadi satu commit di main.
Mudah dibaca.
## Versioning
| Version | Meaning          |
| ------- | ---------------- |
| MAJOR   | Breaking changes |
| MINOR   | New features     |
| PATCH   | Bug fixes        |
contoh:
v1.0.0
v1.1.0
v1.1.1
v2.0.0
## Release Workflow
Development
↓
Feature Branch
↓
Pull Request
↓
Review
↓
Merge
↓
Deploy
## Git Ignore
node_modules/
.env
.next/
dist/
coverage/
.vscode/
.DS_Store
## Best Practices
Pull perubahan terbaru sebelum mulai bekerja.
Jangan commit file hasil build.
Jangan commit .env.
Jangan force push ke main.
Hapus branch yang sudah selesai di-merge.