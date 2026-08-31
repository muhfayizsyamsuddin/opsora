# Git Workflow

Version: 1.1

Status: Completed

Author: Faiz

Last Updated: 2026-09-01

---

# Overview

This document defines the Git workflow used in the Opsora project.

It covers:

- Branch strategy
- Branch naming conventions
- Commit conventions
- Pull request guidelines
- Merge strategy
- Release process
- Repository hygiene

The goal is to keep development history clean, predictable, and easy to
maintain.

---

# Branch Strategy

The `main` branch contains stable code.

Development work should be performed in dedicated branches.

```text
main
│
├── feature/authentication
├── feature/products
├── feature/sales
├── feature/employee-management
├── feature/attendance
├── feature/leave
├── bugfix/login-error
├── hotfix/security
├── docs/erd-update
├── refactor/product-service
└── chore/eslint-config
```

## Main Branch

main is the stable branch.

Rules:

- Do not develop directly on main.
- Do not force push to main.
- Changes should enter main through a Pull Request.
- CI checks should pass before merging.
- Production releases should be based on stable commits on main.

## Branch Naming Convention
| Type          | Format            | Example                    |
| ------------- | ----------------- | -------------------------- |
| Feature       | `feature/<name>`  | `feature/products`         |
| Bug Fix       | `bugfix/<name>`   | `bugfix/login-error`       |
| Hot Fix       | `hotfix/<name>`   | `hotfix/jwt-expiration`    |
| Documentation | `docs/<name>`     | `docs/erd-update`          |
| Refactor      | `refactor/<name>` | `refactor/product-service` |
| Chore         | `chore/<name>`    | `chore/eslint-config`      |
| Test          | `test/<name>`     | `test/sales-service`       |
Branch names should:
Use lowercase.
Use hyphens when multiple words are required.
Clearly describe the work.
Avoid unnecessary long names.

Examples:

feature/product-management
feature/employee-management
bugfix/negative-stock
docs/api-design
refactor/inventory-service
test/purchase-service

## Commit Convention
Opsora follows a Conventional Commits-style format.
Format:
    type(scope): description
Examples:
    feat(products): add product CRUD
    fix(auth): validate expired JWT
    docs(erd): update inventory relationship
    refactor(service): simplify purchase transaction
    test(products): add create product tests
    chore(deps): update Prisma version

## Commit Types
| Type       | Purpose                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New feature                                |
| `fix`      | Bug fix                                    |
| `docs`     | Documentation changes                      |
| `refactor` | Code refactoring without changing behavior |
| `style`    | Formatting or style-only changes           |
| `test`     | Adding or updating tests                   |
| `chore`    | Maintenance tasks                          |
| `perf`     | Performance improvements                   |
| `ci`       | CI/CD changes                              |
| `build`    | Build system changes                       |

## Commit Rules
- One logical change per commit.
- Write commit messages in English.
- Keep commits small and focused.
- Use a clear scope when useful.
- Use imperative descriptions.
- Avoid vague messages.
- Commit working code whenever possible.
- Do not commit secrets.
- Do not commit generated build artifacts.

Good:
    feat(sales): add stock availability validation
Bad:
    update stuff
Bad:
    fix

## Documentation Commits

Documentation changes should use the docs type.
Examples:
    docs(erd): update employee relationships
    docs(user-flow): add leave management flow
    docs(api): add employee endpoints
    docs(wireframes): update dashboard specification
    docs(changelog): record v2 documentation phase

## Pull Request Guidelines

Every Pull Request should clearly describe the purpose and scope of
the change.

## Summary
Describe what the Pull Request changes and why.

## Changes
List the main changes.
- Added product CRUD
- Added product validation
- Added product API endpoints

## Testing
Describe the validation performed.
- Unit tests passed
- API tests passed
- Build passed
- Lint passed

## Checklist
Before submitting a Pull Request:

 - [ ] Code builds successfully
 - [ ] Lint passes
 - [ ] Tests pass
 - [ ] No unused imports
 - [ ] No unnecessary console logs
 - [ ] No secrets committed
 - [ ] Authorization is implemented where required
 - [ ] Validation is implemented
 - [ ] Documentation updated when necessary

## Pull Request Rules
- Keep Pull Requests focused.
- Avoid unrelated changes.
- Explain significant architectural decisions.
- Resolve review comments before merging.
- Ensure CI checks pass.
- Keep the Pull Request reasonably sized.
Large changes should be divided into smaller logical Pull Requests when
possible.

## Merge Strategy

Opsora uses:
Squash and Merge
Advantages:

- Keeps main history clean.
- Groups one feature into a logical commit.
- Makes release history easier to read.
- Avoids unnecessary intermediate commits.

Example:
feature/products
      │
      ├── commit 1
      ├── commit 2
      ├── commit 3
      │
      ▼
Pull Request
      │
      ▼
Squash and Merge
      │
      ▼
main



## Release Versioning

Opsora follows Semantic Versioning.
MAJOR.MINOR.PATCH
| Version | Meaning                          |
| ------- | -------------------------------- |
| MAJOR   | Breaking changes                 |
| MINOR   | Backward-compatible new features |
| PATCH   | Backward-compatible bug fixes    |
Examples:
    v1.0.0
    v1.1.0
    v1.1.1
    v2.0.0

## Release Workflow
Development
    ↓
Feature Branch
    ↓
Implementation
    ↓
Testing
    ↓
Pull Request
    ↓
Code Review
    ↓
CI Checks
    ↓
Squash and Merge
    ↓
main
    ↓
Version Tag
    ↓
Deploy

## Version Tags

Releases should use Git tags following Semantic Versioning.
Examples:
    v1.0.0
    v1.1.0
    v1.1.1
    v2.0.0
Tags should only be created for stable releases.

## Hotfix Workflow

Critical production issues may use a hotfix branch.
main
 │
 ▼
hotfix/security
 │
 ▼
Fix
 │
 ▼
Test
 │
 ▼
Pull Request
 │
 ▼
Merge
 │
 ▼
Release Patch
Example:
    hotfix/jwt-expiration
Hotfixes should remain focused on the critical issue being resolved.

## Git Ignore
The following files and directories should not be committed:

node_modules/
.env
.env.local
.next/
dist/
coverage/
.vscode/
.DS_Store
*.log

Environment configuration should use .env.example without real
secret values.

## Repository Hygiene

Developers should:
- Pull the latest changes before starting new work.
- Keep branches up to date when necessary.
- Remove completed branches after merging.
- Avoid committing generated files.
- Avoid committing local configuration.
- Keep .gitignore updated.
- Keep commit history meaningful.

## Working With Remote Changes

Before starting new work:
```bash
git checkout main
git pull origin main
```
Create a new branch:
```bash
git checkout -b feature/example
```
After completing the work:
```bash
git add .
git commit -m "feat(example): implement example feature"
git push -u origin feature/example
```
Then create a Pull Request.

## Do Not

Never:
- Force push to main.
- Commit .env files containing secrets.
- Commit passwords or API keys.
- Commit large generated build directories.
- Rewrite shared branch history without agreement.
- Mix unrelated changes in one Pull Request.
- Use vague commit messages.

## Recommended Development Flow
Pull latest main
       ↓
Create branch
       ↓
Implement change
       ↓
Run lint
       ↓
Run tests
       ↓
Review changes
       ↓
Commit
       ↓
Push branch
       ↓
Create Pull Request
       ↓
Code Review
       ↓
CI
       ↓
Squash and Merge
       ↓
Delete branch

## Related Documents
- coding-standards.md
- changelog.md
- deployment.md
- architecture.md

## Rivison History
| Version | Date       | Description                                                  |
| ------- | ---------- | ------------------------------------------------------------ |
| 1.0     | 2026-07-27 | Initial Git workflow                                         |
| 2.0     | 2026-08-11 | Updated branch, commit, PR, release, and repository workflow |