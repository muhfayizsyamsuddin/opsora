# API Design

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-11

---

# 1. Overview

This document defines the REST API design for Opsora.

It includes:

- API conventions
- Authentication
- Authorization and RBAC
- Request and response formats
- Error handling
- Endpoint specifications
- Validation rules
- Core Business Operations endpoints
- People Operations endpoints

This document serves as the implementation reference for the backend API.

---

# 2. API Standards

## Base URL

```text
/api/v1
```

## Data Format

All request and response bodies use JSON unless an endpoint explicitly requires another content type, such as product image upload.

## Authentication

Opsora uses JWT-based authentication.

Authenticated requests must include:

```http
Authorization: Bearer <access_token>
```

## Time Format

Date:

```text
2026-08-11
```

Timestamp:

```text
2026-08-11T08:00:00Z
```

## HTTP Methods

| Method | Usage |
|---|---|
| GET | Retrieve resources |
| POST | Create a resource or execute an action |
| PUT | Replace/update a resource |
| PATCH | Partially update a resource when required |
| DELETE | Soft delete a resource where supported |

## Resource Naming

Endpoints use plural resource names and lowercase paths.

Examples:

```text
/api/v1/products
/api/v1/purchases
/api/v1/leave-requests
/api/v1/performance-reviews
```

---

# 3. Authentication

Base URL:

```text
/api/v1/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Authenticate user and issue access token |
| POST | `/logout` | Logout current authenticated user |
| GET | `/me` | Get current authenticated user |
| POST | `/refresh` | Refresh access token when supported |

### Login Request

```json
{
  "email": "admin@opsora.com",
  "password": "********"
}
```

### Login Response

```json
{
  "success": true,
  "data": {
    "access_token": "<jwt>",
    "token_type": "Bearer",
    "refresh_token": "<refresh-jwt>",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@opsora.com",
      "roles": ["ADMIN"],
      "permissions": ["products.read", "products.create"]
    }
  }
}
```

### Refresh Request

```json
{
  "refresh_token": "<refresh-jwt>"
}
```

### Refresh Response

```json
{
  "success": true,
  "data": {
    "access_token": "<new-jwt>",
    "token_type": "Bearer",
    "refresh_token": "<new-refresh-jwt>"
  }
}
```

Refresh token rotation issues a new refresh token each time the endpoint succeeds.
The client must replace its stored refresh token with the newly returned token.
If a previously revoked refresh token is reused, the server rejects the request
and may revoke the user's active refresh-token session.

---

# 4. Authorization and RBAC

Opsora uses Role-Based Access Control.

Authorization should be based on permissions rather than hard-coded role checks inside individual endpoints.

Default roles include:

- SUPER_ADMIN
- OWNER
- ADMIN
- MANAGER
- STAFF
- CASHIER

A user may have one or more roles.

## Authorization Matrix

| Module | Super Admin | Owner | Admin | Manager | Staff | Cashier |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | Full | Full | Full | Read | Read | Read |
| Users | Full | Read | Manage | No | No | No |
| Roles & Permissions | Full | No | Limited | No | No | No |
| Categories | Full | Read | Full | Read | Read | No |
| Products | Full | Read | Full | Read | Read | Read |
| Suppliers | Full | Read | Full | Read | Read | No |
| Customers | Full | Read | Full | Read | Read | Full |
| Purchases | Full | Read | Full | Read | Manage* | No |
| Sales | Full | Read | Full | Read | Manage* | Full |
| Inventory | Full | Read | Full | Read | Manage* | Read |
| Reports | Full | Full | Full | Full | Read | Read |
| Employees | Full | Read | Full | Manage | Read | No |
| Departments | Full | Read | Full | Manage | Read | No |
| Attendance | Full | Read | Full | Manage | Manage* | No |
| Leave | Full | Read | Full | Manage | Own Request | No |
| Performance Reviews | Full | Read | Full | Manage | Read | No |

`*` Access depends on the assigned permission set.

### Access Levels

- **Full** — unrestricted access allowed by the permission set.
- **Manage** — create, update, and operational actions.
- **Read** — view-only access.
- **Own Request** — user may manage their own applicable request.
- **No** — no access.

---

# 5. Standard Response Format

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

For collections:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

# 6. Error Handling

| HTTP | Meaning |
|---:|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Business rule or validation violation |
| 500 | Internal server error |

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": {
      "email": [
        "Email is required."
      ]
    }
  }
}
```

---

# 7. Pagination

List endpoints should support pagination.

Example:

```text
GET /api/v1/products?page=1&per_page=20
```

Recommended query parameters:

| Parameter | Description |
|---|---|
| page | Page number |
| per_page | Number of records per page |
| search | Search keyword |
| sort_by | Sort field |
| sort_order | `asc` or `desc` |

---

# 8. Authentication Endpoints

Base URL:

```text
/api/v1/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Current user |
| POST | `/refresh` | Refresh token |

---

# 9. User Management

Base URL:

```text
/api/v1/users
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List users |
| GET | `/:id` | User detail |
| POST | `/` | Create user |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Soft delete user |
| PUT | `/:id/roles` | Assign roles |
| GET | `/:id/permissions` | View effective permissions |

---

# 10. Roles and Permissions

## Roles

Base URL:

```text
/api/v1/roles
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List roles |
| GET | `/:id` | Role detail |
| POST | `/` | Create role |
| PUT | `/:id` | Update role |
| DELETE | `/:id` | Delete role |
| PUT | `/:id/permissions` | Assign permissions |

## Permissions

Base URL:

```text
/api/v1/permissions
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List available permissions |
| GET | `/:id` | Permission detail |

---

# 11. Categories

Base URL:

```text
/api/v1/categories
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List categories |
| GET | `/:id` | Category detail |
| POST | `/` | Create category |
| PUT | `/:id` | Update category |
| DELETE | `/:id` | Soft delete category |

Validation:

- Name is required.
- Name must be unique.
- Category with referenced products should not be permanently deleted.

---

# 12. Products

Base URL:

```text
/api/v1/products
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List products |
| GET | `/:id` | Product detail |
| POST | `/` | Create product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Soft delete product |
| POST | `/:id/image` | Upload product image |

Supported filters:

```text
GET /api/v1/products?search=mouse
GET /api/v1/products?category_id=<uuid>
GET /api/v1/products?stock_status=LOW
```

Validation:

- SKU is required and unique.
- Barcode is unique when provided.
- Category must exist.
- Prices cannot be negative.
- Stock cannot be negative.
- Minimum stock cannot be negative.

---

# 13. Suppliers

Base URL:

```text
/api/v1/suppliers
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List suppliers |
| GET | `/:id` | Supplier detail |
| POST | `/` | Create supplier |
| PUT | `/:id` | Update supplier |
| DELETE | `/:id` | Soft delete supplier |

---

# 14. Customers

Base URL:

```text
/api/v1/customers
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List customers |
| GET | `/:id` | Customer detail |
| POST | `/` | Create customer |
| PUT | `/:id` | Update customer |
| DELETE | `/:id` | Soft delete customer |

A sales transaction may use a walk-in customer when no registered customer is required.

---

# 15. Purchases

Base URL:

```text
/api/v1/purchases
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List purchases |
| GET | `/:id` | Purchase detail |
| POST | `/` | Create purchase |
| PUT | `/:id` | Update purchase |
| POST | `/:id/complete` | Complete purchase |
| POST | `/:id/cancel` | Cancel purchase |

Supported filters:

```text
GET /api/v1/purchases?supplier_id=<uuid>
GET /api/v1/purchases?date_from=2026-08-01&date_to=2026-08-31
```

Completion behavior:

1. Validate purchase.
2. Validate purchase items.
3. Update product stock.
4. Create inventory movements.
5. Mark purchase as completed.

---

# 16. Sales

Base URL:

```text
/api/v1/sales
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List sales |
| GET | `/:id` | Sale detail |
| POST | `/` | Create sale |
| PUT | `/:id` | Update sale |
| POST | `/:id/pay` | Complete payment |
| POST | `/:id/cancel` | Cancel sale |
| GET | `/:id/invoice` | Get invoice |

Supported filters:

```text
GET /api/v1/sales?date_from=2026-08-01&date_to=2026-08-31
GET /api/v1/sales?customer_id=<uuid>
```

Completion behavior:

1. Validate sale items.
2. Check stock availability.
3. Calculate subtotal.
4. Apply discount.
5. Calculate total.
6. Complete payment.
7. Reduce inventory.
8. Create inventory movements.
9. Generate invoice data.

---

# 17. Inventory

Base URL:

```text
/api/v1/inventory
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stock` | List current stock |
| GET | `/stock/:product_id` | Product stock detail |
| GET | `/movements` | List stock movements |
| GET | `/movements/:id` | Movement detail |
| POST | `/adjustments` | Create stock adjustment |

Stock adjustment request:

```json
{
  "product_id": "uuid",
  "movement_type": "OUT",
  "quantity": 2,
  "reason": "Physical stock correction"
}
```

Business rules:

- Quantity must be greater than zero.
- OUT adjustment cannot result in negative stock.
- Adjustment must record a reason.
- Every adjustment creates an inventory movement.

---

# 18. Reports

Base URL:

```text
/api/v1/reports
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/sales` | Sales report |
| GET | `/purchases` | Purchase report |
| GET | `/inventory` | Inventory report |
| GET | `/profit` | Profit report |
| GET | `/dashboard` | Dashboard summary |

Common filters:

```text
date_from
date_to
```

Example:

```text
GET /api/v1/reports/sales?date_from=2026-08-01&date_to=2026-08-31
```

---

# 19. Departments

Base URL:

```text
/api/v1/departments
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List departments |
| GET | `/:id` | Department detail |
| POST | `/` | Create department |
| PUT | `/:id` | Update department |
| DELETE | `/:id` | Soft delete department |

Validation:

- Name is required.
- Name must be unique.

---

# 20. Employees

Base URL:

```text
/api/v1/employees
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List employees |
| GET | `/:id` | Employee detail |
| POST | `/` | Create employee |
| PUT | `/:id` | Update employee |
| DELETE | `/:id` | Soft delete employee |

Supported filters:

```text
GET /api/v1/employees?department_id=<uuid>
GET /api/v1/employees?status=ACTIVE
GET /api/v1/employees?search=john
```

Validation:

- Employee code is required and unique.
- Department must exist.
- Join date is required.

---

# 21. Attendance

Base URL:

```text
/api/v1/attendance
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List attendance records |
| GET | `/:id` | Attendance detail |
| POST | `/` | Record attendance |
| PUT | `/:id` | Update attendance |
| GET | `/employee/:employee_id` | Employee attendance history |

Supported filters:

```text
GET /api/v1/attendance?date=2026-08-11
GET /api/v1/attendance?employee_id=<uuid>
GET /api/v1/attendance?status=PRESENT
```

Business rules:

- Employee must exist.
- Attendance date is required.
- An employee should normally have one attendance record per date.

---

# 22. Leave Requests

Base URL:

```text
/api/v1/leave-requests
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List leave requests |
| GET | `/:id` | Leave request detail |
| POST | `/` | Create leave request |
| PUT | `/:id` | Update request |
| POST | `/:id/approve` | Approve leave |
| POST | `/:id/reject` | Reject leave |
| POST | `/:id/cancel` | Cancel leave request |

Supported filters:

```text
GET /api/v1/leave-requests?employee_id=<uuid>
GET /api/v1/leave-requests?status=PENDING
GET /api/v1/leave-requests?start_date=2026-08-01&end_date=2026-08-31
```

Business rules:

- Employee must exist.
- Start date cannot be later than end date.
- Only authorized users can approve or reject.
- Approval/rejection records the reviewer and review timestamp.

---

# 23. Performance Reviews

Base URL:

```text
/api/v1/performance-reviews
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List performance reviews |
| GET | `/:id` | Review detail |
| POST | `/` | Create review |
| PUT | `/:id` | Update review |
| GET | `/employee/:employee_id` | Employee review history |

Supported filters:

```text
GET /api/v1/performance-reviews?employee_id=<uuid>
GET /api/v1/performance-reviews?review_period=2026-Q3
```

Validation:

- Employee is required.
- Reviewer is required.
- Review period is required.
- Performance score must use the configured valid range.

---

# 24. Dashboard

Base URL:

```text
/api/v1/dashboard
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/summary` | Core business summary |
| GET | `/recent-transactions` | Recent transactions |
| GET | `/low-stock` | Low-stock products |
| GET | `/people-summary` | People operations summary |

Dashboard responses must respect the authenticated user's permissions.

---

# 25. Validation Standards

Validation should occur at the API boundary and in the business/service layer.

## Authentication

- Email required.
- Password required.
- Credentials must be valid.

## Master Data

- Required names cannot be empty.
- Unique identifiers must be enforced.
- Foreign keys must reference existing records.

## Transactions

- Transaction must contain required items.
- Quantities must be greater than zero.
- Prices cannot be negative.
- Stock availability must be checked before reducing inventory.

## People Operations

- Employee must belong to a valid department.
- Attendance must reference an existing employee.
- Leave dates must be valid.
- Only authorized users may approve leave.
- Performance reviews must reference an employee and reviewer.

---

# 26. Business Transaction Integrity

Operations that affect multiple records must be processed atomically.

Example purchase completion:

```text
Complete Purchase
       │
       ▼
Validate Purchase
       │
       ▼
Update Product Stock
       │
       ▼
Create Inventory Movement
       │
       ▼
Mark Purchase Completed
```

If one required operation fails, the transaction should be rolled back.

The same principle applies to sales completion.

---

# 27. API Security

The API must:

- Require authentication for protected endpoints.
- Enforce authorization through permissions.
- Hash passwords securely.
- Validate request payloads.
- Avoid returning password hashes.
- Avoid exposing sensitive internal information in error responses.
- Apply appropriate rate limiting to authentication endpoints.
- Validate uploaded files before storing them.

---

# 28. API Versioning

Current version:

```text
v1
```

Base URL:

```text
/api/v1
```

Breaking changes should use a new API version.

Future example:

```text
/api/v2
```

Backward-compatible changes may be introduced within the current version according to project release policy.

---

# 29. Related Documents

- requirements.md
- user-stories.md
- user-flow.md
- wireframes.md
- erd.md
- data-dictionary.md
- architecture.md
- glossary.md
- changelog.md

---

# 30. Revision History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-07-27 | Initial API design |
| 2.0 | 2026-08-11 | Expanded API design for RBAC, Core Business Operations, and People Operations |
