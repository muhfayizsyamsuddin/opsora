# Coding Standards

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-11

---

# Overview

This document defines the coding standards for the Opsora project.

It ensures consistency, readability, maintainability, security, and
collaboration across the codebase.

---

# Scope

This standard applies to:

- Backend
- Frontend
- Database
- API
- Git
- Testing

---

# General Principles

- Write clean and readable code.
- Prefer simplicity over cleverness.
- Keep functions small and focused.
- Avoid duplicated logic (DRY).
- Follow SOLID principles where appropriate.
- Use meaningful names.
- Keep business logic inside the service layer.
- Keep database access inside repositories.
- Keep controllers focused on HTTP concerns.
- Validate all external input.
- Do not expose sensitive information.
- Leave the codebase cleaner than you found it.

---

# Naming Conventions

## Variables

Use camelCase.

Examples:

```text
userName
purchasePrice
minimumStock
```

---

### Functions

Use camelCase.
Examples:
createProduct()
calculateTotal()
generateInvoiceNumber()

---

### Components

Use PascalCase.

Examples:
ProductCard
Sidebar
PurchaseTable

---

### Classes

Use PascalCase.

Examples:
ProductService
InventoryService

---

### Constants

Use UPPER_SNAKE_CASE.

Examples:
JWT_SECRET
MAX_UPLOAD_SIZE
DEFAULT_PAGE_SIZE

---

### Database

Use snake_case.

Examples:
products
purchase_items
created_at
supplier_id

### Enum Values

Use UPPER_SNAKE_CASE.

Examples:
SUPER_ADMIN
OWNER
ADMIN
MANAGER
STAFF
CASHIER

PENDING
PAID
VOID

PURCHASE
SALE
ADJUSTMENT

## Folder Structure

1. Backend

src/
├── config/
├── controllers/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── products/
│   ├── suppliers/
│   ├── customers/
│   ├── purchases/
│   ├── sales/
│   ├── inventory/
│   ├── reports/
│   ├── employees/
│   ├── departments/
│   ├── attendance/
│   ├── leave/
│   └── performance-reviews/
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
│   ├── ui/
│   ├── layout/
│   └── features/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
└── utils/

## File Naming

| Item       | Convention              |
| ---------- | ----------------------- |
| Component  | PascalCase.tsx          |
| Hook       | useSomething.ts         |
| Service    | product.service.ts      |
| Repository | product.repository.ts   |
| Validator  | product.validator.ts    |
| Middleware | auth.middleware.ts      |
| Route      | product.route.ts        |
| Controller | product.controller.ts   |
| Type       | product.types.ts        |
| Test       | product.service.test.ts |

## TypeScript Rules

- Enable strict mode.
- Avoid using any.
- Prefer explicit return types for exported functions.
- Use interfaces for extensible object contracts.
- Use type aliases for unions and utility types.
- Reuse shared types whenever possible.
- Avoid unnecessary type assertions.
- Prefer type-safe API contracts.
- Do not suppress TypeScript errors without a documented reason.

## Backend Architecture Rules

Backend code must follow the layered architecture defined in
architecture.md.
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database

## Controller Rules

Controllers should:

- Handle HTTP requests.
- Extract request parameters.
- Call services.
- Return HTTP responses.

Controllers should not:

- Contain complex business logic.
- Directly query Prisma.
- Perform complex database operations.
- Implement authorization rules manually.

## Service Rules

Services are responsible for:

- Business logic.
- Business validation.
- Coordinating repositories.
- Transaction handling.
- Inventory operations.
- Permission-sensitive business operations.

Example:
SaleService
    │
    ├── Validate sale
    ├── Check stock
    ├── Calculate total
    ├── Update inventory
    ├── Create movement
    └── Complete transaction

## Repository Rules

Repositories are responsible for:

- Database queries.
- Database persistence.
- Prisma operations.
- Query composition.

Repositories should not contain business rules.

## Authentication Rules

Authentication uses JWT.
Rules:

- Never store plain-text passwords.
- Passwords must be securely hashed.
- Never log passwords.
- Never log JWT tokens.
- Validate JWT before accessing protected resources.
- Reject expired or invalid tokens.
- Keep authentication logic centralized.

## Authorization Rules

Opsora uses RBAC with permission-based authorization.
Default roles:
SUPER_ADMIN
OWNER
ADMIN
MANAGER
STAFF
CASHIER

Authorization should be checked through centralized middleware or
authorization services.
Example permissions:
products.read
products.create
products.update
products.delete

sales.read
sales.create
sales.update
sales.void

employees.read
employees.create
employees.update
employees.delete

attendance.read
attendance.create
attendance.update

leave.read
leave.create
leave.approve
leave.reject

Do not duplicate role checks throughout controllers.
Prefer permission checks such as:
requirePermission('products.create')
instead of hardcoding role-specific logic in every endpoint.

## Validation

All external input must be validated.
Validate:

- Request body
- Route parameters
- Query parameters
- Uploaded files

Zod is the standard validation library.
HTTP Request
     │
     ▼
Zod Validation
     │
 ┌───┴────┐
 │        │
Valid   Invalid
 │        │
 ▼        ▼
Service  Error Response
Never trust client-side validation alone.

## Business Rule Validation

Validation that depends on database state belongs in the service layer.
Examples:

- SKU uniqueness.
- Product existence.
- Stock availability.
- Supplier existence.
- Customer existence.
- Employee existence.
- Duplicate attendance records.
- Valid leave requests.
- Transaction status rules.

## API Rules

- Follow REST conventions.
- Use plural resource names.
- Use HTTP methods correctly.
- Return JSON responses.
- Use appropriate HTTP status codes.
- Keep response structures consistent.
- Version APIs under /api/v1.
- Do not expose internal implementation details.

Base API:
/api/v1

## API Response Format

Successful responses should follow a consistent structure.

Example:
```json
{
  "success": true,
  "data": {}
}
```
Error responses should follow:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed."
  }
}
```

## Error Handling

- Use typed application errors.
- Use centralized error middleware.
- Never expose stack traces in production.
- Never expose database credentials.
- Never expose sensitive internal information.
- Use consistent error codes.
- Distinguish validation errors from business rule violations.

## Database Rules

- Use UUID as primary keys.
- Use foreign keys where appropriate.
- Use snake_case naming.
- Use Prisma ORM for database access.
- Avoid direct database access from controllers.
- Use transactions for multi-step business operations.
- Use soft delete for applicable master data.
- Preserve transaction history.
- Store transaction snapshot prices.

## Transaction Rules

Business operations that modify multiple records must be atomic.
Examples:

1. Purchase
Create Purchase
      ↓
Create Purchase Items
      ↓
Update Stock
      ↓
Create Inventory Movement
      ↓
Complete Purchase
2. Sale
Create Sale
      ↓
Create Sale Items
      ↓
Check Stock
      ↓
Update Stock
      ↓
Create Inventory Movement
      ↓
Complete Sale
If one required operation fails, the entire transaction should roll back.

## Inventory Rules

Inventory changes must always be traceable.
Stock-changing operations include:

- Purchase
- Sale
- Stock Adjustment

Every stock change must create an inventory movement.
Inventory movement should contain:

- Product
- Reference type
- Reference ID
- Before stock
- Quantity
- After stock
- Notes

Do not modify stock without recording the corresponding movement.

## Frontend Rules

- Keep components small.
- Prefer composition over inheritance.
- Separate UI from business logic.
- Reuse components whenever possible.
- Avoid duplicated API calls.
- Use TanStack Query for server state.
- Use Zustand for appropriate client state.
- Keep API calls inside service modules.
- Do not place direct API calls throughout UI components.
- Handle loading, error, and empty states.

## Component Rules

Components should have a single clear responsibility.

Prefer:
ProductTable
ProductFilters
ProductForm
ProductDialog

over one large component containing all product functionality.
Shared UI components should be placed under:
components/ui/

Feature-specific components should be placed under:
components/features/

## State Management

1. Use TanStack Query for:

- API data
- Server state
- Caching
- Refetching
- Loading states

Use Zustand for appropriate client-side state such as:

- UI preferences
- Temporary application state
- Client-side workflow state

Do not duplicate the same server data in Zustand unless there is a
specific reason.

## Formatting

| Rule           | Value          |
| -------------- | -------------- |
| Indentation    | 2 spaces       |
| Quotes         | Single quotes  |
| Semicolons     | Always         |
| Trailing Comma | Yes            |
| Line Length    | 100 characters |
Formatting should be automated using project tooling.

Recommended tools:
ESLint
Prettier

## Import Order

Use the following order:
```typescript
// 1. External packages
import { z } from 'zod';

// 2. Internal aliases
import { prisma } from '@/lib/prisma';

// 3. Relative imports
import { calculateTotal } from '../utils/calculate-total';
```
Keep imports organized and remove unused imports.

## Comments

Write comments only when explaining why.

Avoid comments that simply explain what obvious code is doing.

Good:

// Prevent overselling by validating stock before creating the transaction.

Bad:

// Increment i.
i++;

Prefer readable code over excessive comments.

## Logging
Log:

- Unexpected errors
- Authentication failures
- Authorization failures
- Important business events
- Critical system events

Do not log:

- Passwords
- JWT tokens
- API secrets
- Database credentials
- Sensitive personal information

## File Upload Rules

Uploaded files must be validated before being stored.
Validate:

- File type
- File size
- Upload result

Product images should be stored in Cloudinary.
The database should store the resulting URL rather than the binary file.

## Testing

Tests should cover:

- Business logic
- Validation
- Authorization
- Critical API endpoints
- Inventory operations
- Purchase transactions
- Sales transactions

Testing principles:

- Keep tests deterministic.
- Use descriptive test names.
- Mock external services.
- Avoid relying on production services.
- Test failure cases as well as success cases.

## Test Naming

Use descriptive test names.

Good:
should reject sale when stock is insufficient

Bad:
test sale

## Security Standards

Developers must:

- Never commit secrets.
- Never hardcode credentials.
- Never expose passwords.
- Never expose JWT secrets.
- Validate external input.
- Validate uploaded files.
- Use HTTPS in production.
- Apply authorization to protected resources.
- Avoid leaking internal errors.
Environment variables should be used for secrets.

## Environment Variables

Example:
```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_API_URL=
```
Secrets must not be committed to Git.
Maintain an .env.example file containing variable names without
real secret values.

## Git Commit Quality

Satu commit harus merepresentasikan satu perubahan logis.
Hindari mencampur:

- Fitur baru
- Refactor besar
- Bug fix
- Dokumentasi tidak terkait

dalam satu commit.
Commit message harus jelas dan mudah dipahami.
Recommended format:
type: description

Examples:
feat: add product management
fix: prevent negative inventory
docs: update API design
refactor: simplify inventory service
test: add sales service tests
chore: update dependencies

## Pull Request Checklist

Before creating a pull request:

- Code builds successfully.
- Lint passes.
- Tests pass.
- No unused imports.
- No unnecessary console.log.
- No hardcoded secrets.
- Authorization rules are applied.
- Validation is implemented.
- Database transactions are used where required.
- Documentation is updated when necessary.

## Code Review Principles

Reviewers should check:

- Correctness
- Readability
- Maintainability
- Security
- Performance
- Validation
- Authorization
- Database integrity
- Test coverage
Code review should focus on the code rather than the person.

## Documentation Rules

Documentation must be updated when changes affect:

- API behavior
- Database schema
- User flows
- User stories
- Architecture
- Security
- Deployment
- Business rules
Related documentation should remain consistent with the implementation.

## Related Documents
- requirements.md
- user-stories.md
- user-flow.md
- wireframes.md
- erd.md
- data-dictionary.md
- api-design.md
- architecture.md
- git-workflow.md
- deployment.md
- glossary.md
- changelog.md

## Revision History
| Version | Date       | Description                                                                                                              |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | 2026-07-27 | Initial coding standards                                                                                                 |
| 2.0     | 2026-08-11 | Updated standards for v2 architecture, RBAC, People Operations, API conventions, security, and modular backend structure |
