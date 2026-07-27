# Coding Standards

Version: 1.0

Status: Draft

Author: Faiz

Last Updated: 2026-07-27

---

# Overview

This document defines the coding standards for the Opsora project.

It ensures consistency, readability, maintainability, and collaboration across the codebase.

---

# Scope

This standard applies to:

- Backend
- Frontend
- Database
- Git
- Testing

## General Principles

- Write clean and readable code.
- Prefer simplicity over cleverness.
- Keep functions small and focused.
- Avoid duplicated logic (DRY).
- Follow SOLID principles where appropriate.
- Use meaningful names.
- Leave the codebase cleaner than you found it.

## Naming Conventions

### Variables

camelCase

Example

userName

purchasePrice

minimumStock

---

### Functions

camelCase

createProduct()

calculateTotal()

generateInvoiceNumber()

---

### Components

PascalCase

ProductCard

Sidebar

PurchaseTable

---

### Classes

PascalCase

ProductService

InventoryService

---

### Constants

UPPER_SNAKE_CASE

JWT_SECRET

MAX_UPLOAD_SIZE

DEFAULT_PAGE_SIZE

---

### Database

snake_case

products

purchase_items

created_at

supplier_id

## Folder Structure

1. Backend
src/
├── config/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── validators/
├── utils/
└── prisma/
2. Frontend
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
└── utils/

## File Naming
| Item       | Convention            |
| ---------- | --------------------- |
| Component  | PascalCase.tsx        |
| Hook       | useSomething.ts       |
| Service    | product.service.ts    |
| Repository | product.repository.ts |
| Validator  | product.validator.ts  |
| Middleware | auth.middleware.ts    |
| Route      | product.route.ts      |
| Controller | product.controller.ts |

## TypeScript Rules

- Avoid using any.
- Prefer explicit return types for exported functions.
- Use interfaces for API contracts.
- Use type aliases for unions and utility types.
- Enable strict mode.
- Reuse shared types whenever possible.

## Error Handling

- Throw typed errors.
- Never expose stack traces to clients.
- Use a centralized error middleware.
- Return consistent error responses.

## Validation

- Validate every request.
- Validate route params.
- Validate query parameters.
- Validate request body.
- Never trust client input.

## API Rules

- Use REST conventions.
- Return JSON only.
- Use plural resource names.
- Use proper HTTP status codes.
- Keep response format consistent.

## Database Rules

- Use UUID as primary key.
- Use foreign keys.
- Never hard delete master data.
- Wrap transactional operations in database transactions.
- Store transaction snapshots.

## Frontend Rules

- Keep components small.
- Prefer composition over inheritance.
- Separate UI from business logic.
- Reuse components whenever possible.
- Avoid duplicated API calls.

## Formatting
| Rule           | Value          |
| -------------- | -------------- |
| Indentation    | 2 spaces       |
| Quotes         | Single quotes  |
| Semicolons     | Always         |
| Trailing Comma | Yes            |
| Line Length    | 100 characters |

## Import Order
// 1. External packages
import { z } from 'zod';

// 2. Internal aliases
import { prisma } from '@/lib/prisma';

// 3. Relative imports
import { calculateTotal } from '../utils/calculate-total';

## Comments

Write comments only when explaining why.
Avoid comments that explain what the code does if the code is already clear.
- Goood
// Prevent overselling by validating stock before creating the transaction.
- Bad
// Increment i.
i++;

## Logging
Log:

- Unexpected errors
- Authentication failures
- Important business events

Do not log:

- Passwords
- JWT tokens
- Sensitive user data

## Testing

- Test business logic.
- Mock external services.
- Keep tests deterministic.
- Use descriptive test names.

## Commit Quality
Satu commit = satu perubahan logis.
Hindari commit yang mencampur refactor, fitur baru, dan bug fix sekaligus.
Commit harus dapat dipahami tanpa membaca seluruh riwayat.

## Pull Request Checklist

- Code builds successfully.
- Lint passes.
- Tests pass.
- No unused imports.
- No console.log.
- Documentation updated if needed.