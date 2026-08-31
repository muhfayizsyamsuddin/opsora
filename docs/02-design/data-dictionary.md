# Data Dictionary

Version: 1.1

Status: Completed

Author: Faiz

Last Updated: 2026-09-01

---

# Overview

This document defines the meaning, format, validation rules, and examples for the database fields used in Opsora.

It complements the Entity Relationship Diagram (ERD) by describing each entity and field in detail.

Opsora is organized into three major areas:

- Access & Administration
- Core Business Operations
- People Operations

---

# Naming Standards

## Table Names

- Use `snake_case`
- Use plural nouns

Examples:

```text
users
products
sale_items
leave_requests
performance_reviews
```

---

## Column Names

- Use `snake_case`

Examples:

```text
purchase_price
minimum_stock
created_at
employee_code
reviewed_by
```

---

## Foreign Keys

Foreign key columns use the related entity name followed by `_id`.

Examples:

```text
product_id
supplier_id
customer_id
employee_id
department_id
user_id
```

---

# Common Fields

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Unique record identifier | `550e8400-e29b-41d4-a716-446655440000` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Record creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 10:30:00` |
| deleted_at | TIMESTAMP NULL | No | Nullable | Soft deletion timestamp | `NULL` |

`deleted_at` is used for entities where historical references should be preserved.

---

# Access & Administration

## Users

Stores system accounts used for authentication and authorization.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Unique user identifier | `550e8400-e29b-41d4-a716-446655440000` |
| name | VARCHAR(150) | Yes | Required | User display name | `Faiz` |
| email | VARCHAR(255) | Yes | Unique, valid email | Login email | `admin@opsora.com` |
| password | VARCHAR(255) | Yes | Hashed value | Stored password hash | `hashed_password` |
| role_id | UUID | Yes | FK → roles.id | Assigned role | `...` |
| is_active | BOOLEAN | Yes | Default `true` | Whether account may access the system | `true` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

---

## Roles

Stores system roles used by RBAC.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Unique role identifier | `...` |
| name | VARCHAR(50) | Yes | Unique | Role name | `ADMIN` |
| description | TEXT | No | Nullable | Role description | `Manages business operations` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### Default Roles

| Value | Description |
|---|---|
| SUPER_ADMIN | Full system access |
| OWNER | Monitors business and operational information |
| ADMIN | Manages system data and business operations |
| MANAGER | Monitors reports and business performance |
| STAFF | Performs authorized daily operational activities |
| CASHIER | Handles authorized sales transactions |

---

## Permissions

Stores individual permissions used by RBAC.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Unique permission identifier | `...` |
| name | VARCHAR(100) | Yes | Unique | Permission identifier | `products.create` |
| description | TEXT | No | Nullable | Permission description | `Create products` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |

### Permission Naming

Permissions use:

```text
resource.action
```

Examples:

```text
products.read
products.create
products.update
products.delete
sales.read
sales.create
purchases.read
purchases.create
inventory.read
inventory.adjust
employees.read
employees.create
attendances.read
attendances.create
leaves.read
leaves.create
leaves.approve
performance_reviews.read
performance_reviews.create
payroll.read
payroll.create
```

---

---

## Settings

Stores application configuration values.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Setting identifier | `...` |
| key | VARCHAR(255) | Yes | Unique | Setting key | `company_name` |
| value | TEXT | Yes | Required | Setting value | `Opsora` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |


---

## Refresh Tokens

Stores refresh-token sessions used for access-token renewal.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Refresh token identifier | `...` |
| token | VARCHAR(255) | Yes | Unique | Stored refresh token | `...` |
| user_id | UUID | Yes | FK → users.id | Token owner | `...` |
| expires_at | TIMESTAMP | Yes | Valid future timestamp | Token expiration time | `2026-09-30T00:00:00Z` |
| revoked_at | TIMESTAMP | No | Nullable timestamp | Revocation time | `NULL` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-09-01 00:30:00` |

### Business Rules

- A refresh token belongs to one user.
- Refresh tokens expire at `expires_at`.
- Revoked refresh tokens cannot be used again.
- Successful refresh rotates the refresh token.
- Reuse of a previously revoked refresh token is treated as token reuse and may revoke active refresh-token sessions.
- Refresh tokens are deleted when their owning user is deleted at the database level.

---


## Role Permissions

Junction table connecting roles and permissions.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| role_id | UUID | Yes | FK → roles.id | Role reference | `...` |
| permission_id | UUID | Yes | FK → permissions.id | Permission reference | `...` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Assignment timestamp | `2026-08-11 08:00:00` |

### Constraint

```text
PRIMARY KEY (role_id, permission_id)
```

---

# Core Business Operations

## Categories

Stores product categories.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Category identifier | `...` |
| name | VARCHAR(100) | Yes | Unique | Category name | `Electronics` |
| description | TEXT | No | Nullable | Category description | `Electronic products` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |
| deleted_at | TIMESTAMP NULL | No | Nullable | Soft deletion timestamp | `NULL` |

---

## Products

Stores products managed by inventory.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Product identifier | `...` |
| category_id | UUID | Yes | FK → categories.id | Product category | `...` |
| name | VARCHAR(150) | Yes | Required | Product name | `Wireless Mouse` |
| sku | VARCHAR(50) | Yes | Unique | Stock Keeping Unit | `PRD-000001` |
| barcode | VARCHAR(100) | No | Unique if provided | Product barcode | `8991234567890` |
| purchase_price | DECIMAL(15,2) | Yes | >= 0 | Default purchase price | `50000.00` |
| selling_price | DECIMAL(15,2) | Yes | >= 0 | Default selling price | `75000.00` |
| stock | DECIMAL(15,3) | Yes | >= 0 | Current stock quantity | `25` |
| minimum_stock | DECIMAL(15,3) | Yes | >= 0 | Low-stock threshold | `5` |
| unit | VARCHAR(20) | Yes | Required | Product measurement unit | `pcs` |
| image_url | TEXT | No | Valid URL | Product image URL | `https://...` |
| status | ProductStatus | Yes | Valid enum | Product status | `ACTIVE` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |
| deleted_at | TIMESTAMP NULL | No | Nullable | Soft deletion timestamp | `NULL` |

### ProductStatus

| Value | Description |
|---|---|
| ACTIVE | Product is available for normal operations |
| INACTIVE | Product is not available for normal operations |

---

## Suppliers

Stores supplier information.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Supplier identifier | `...` |
| name | VARCHAR(150) | Yes | Required | Supplier name | `PT Supplier Utama` |
| phone | VARCHAR(30) | No | Nullable | Supplier phone | `08123456789` |
| email | VARCHAR(255) | No | Valid email if provided | Supplier email | `supplier@example.com` |
| address | TEXT | No | Nullable | Supplier address | `Jakarta` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |
| deleted_at | TIMESTAMP NULL | No | Nullable | Soft deletion timestamp | `NULL` |

---

## Customers

Stores customer information.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Customer identifier | `...` |
| name | VARCHAR(150) | Yes | Required | Customer name | `John Doe` |
| phone | VARCHAR(30) | No | Nullable | Customer phone | `08123456789` |
| email | VARCHAR(255) | No | Valid email if provided | Customer email | `customer@example.com` |
| address | TEXT | No | Nullable | Customer address | `Jakarta` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |
| deleted_at | TIMESTAMP NULL | No | Nullable | Soft deletion timestamp | `NULL` |

---

## Purchases

Stores purchase transactions from suppliers.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Purchase identifier | `...` |
| supplier_id | UUID | Yes | FK → suppliers.id | Supplier reference | `...` |
| user_id | UUID | Yes | FK → users.id | User who created purchase | `...` |
| purchase_date | DATE | Yes | Valid date | Purchase date | `2026-08-11` |
| total_amount | DECIMAL(15,2) | Yes | >= 0 | Purchase total | `1500000.00` |
| status | PurchaseStatus | Yes | Valid enum | Purchase status | `COMPLETED` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### PurchaseStatus

| Value | Description |
|---|---|
| DRAFT | Purchase has not been finalized |
| COMPLETED | Purchase completed and inventory updated |
| CANCELLED | Purchase cancelled |

---

## Purchase Items

Stores individual products within a purchase.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Purchase item identifier | `...` |
| purchase_id | UUID | Yes | FK → purchases.id | Parent purchase | `...` |
| product_id | UUID | Yes | FK → products.id | Purchased product | `...` |
| quantity | DECIMAL(15,3) | Yes | > 0 | Purchased quantity | `10` |
| unit_price | DECIMAL(15,2) | Yes | >= 0 | Purchase price per unit | `50000.00` |
| subtotal | DECIMAL(15,2) | Yes | Calculated | Quantity × unit price | `500000.00` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |

The purchase item price is a transaction snapshot and should not change when the product's default purchase price changes.

---

## Sales

Stores sales transactions.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Sale identifier | `...` |
| customer_id | UUID | No | FK → customers.id | Customer reference | `...` |
| user_id | UUID | Yes | FK → users.id | User who created sale | `...` |
| sale_date | DATE | Yes | Valid date | Sale date | `2026-08-11` |
| subtotal | DECIMAL(15,2) | Yes | >= 0 | Total before discount | `100000.00` |
| discount | DECIMAL(15,2) | Yes | >= 0 | Discount amount | `5000.00` |
| total_amount | DECIMAL(15,2) | Yes | Calculated | Final sale total | `95000.00` |
| payment_method | PaymentMethod | Yes | Valid enum | Payment method | `CASH` |
| status | SaleStatus | Yes | Valid enum | Sale status | `COMPLETED` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### PaymentMethod

| Value | Description |
|---|---|
| CASH | Cash payment |
| TRANSFER | Bank transfer |
| QRIS | QRIS payment |

### SaleStatus

| Value | Description |
|---|---|
| COMPLETED | Sale completed and inventory reduced |
| CANCELLED | Sale cancelled |

A walk-in customer can be represented by leaving `customer_id` NULL, depending on the final application implementation.

---

## Sale Items

Stores individual products within a sale.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Sale item identifier | `...` |
| sale_id | UUID | Yes | FK → sales.id | Parent sale | `...` |
| product_id | UUID | Yes | FK → products.id | Sold product | `...` |
| quantity | DECIMAL(15,3) | Yes | > 0 | Sold quantity | `2` |
| unit_price | DECIMAL(15,2) | Yes | >= 0 | Selling price per unit | `75000.00` |
| discount | DECIMAL(15,2) | Yes | >= 0 | Item discount | `5000.00` |
| subtotal | DECIMAL(15,2) | Yes | Calculated | Calculated item subtotal | `145000.00` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |

The sale item price is a transaction snapshot and should not change when the product's default selling price changes.

---

## Inventory Movements

Records every inventory change.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Movement identifier | `...` |
| product_id | UUID | Yes | FK → products.id | Product reference | `...` |
| user_id | UUID | Yes | FK → users.id | User responsible for movement | `...` |
| movement_type | InventoryMovementType | Yes | Valid enum | Direction of stock change | `IN` |
| reference_type | InventoryReferenceType | Yes | Valid enum | Source of movement | `PURCHASE` |
| reference_id | UUID | No | Valid reference if applicable | Related transaction identifier | `...` |
| quantity | DECIMAL(15,3) | Yes | > 0 | Quantity changed | `10` |
| before_stock | DECIMAL(15,3) | Yes | >= 0 | Stock before movement | `20` |
| after_stock | DECIMAL(15,3) | Yes | >= 0 | Stock after movement | `30` |
| reason | TEXT | No | Required for adjustment where applicable | Movement reason | `Stock count correction` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Movement timestamp | `2026-08-11 08:00:00` |

### InventoryMovementType

| Value | Description |
|---|---|
| IN | Stock increases |
| OUT | Stock decreases |

### InventoryReferenceType

| Value | Description |
|---|---|
| PURCHASE | Purchase transaction |
| SALE | Sales transaction |
| ADJUSTMENT | Manual stock adjustment |

For `ADJUSTMENT`, `reason` should explain why the stock was changed.

---

# People Operations

## Departments

Stores organizational departments.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Department identifier | `...` |
| name | VARCHAR(100) | Yes | Unique | Department name | `Operations` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

---

## Employees

Stores employee information.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Employee identifier | `...` |
| employee_code | VARCHAR(50) | Yes | Unique | Employee identifier | `EMP-000001` |
| name | VARCHAR(150) | Yes | Required | Employee name | `John Doe` |
| email | VARCHAR(255) | Yes | Unique, valid email | Employee email | `john@example.com` |
| position | VARCHAR(100) | Yes | Required | Employee position | `Sales Staff` |
| salary | FLOAT | Yes | >= 0 | Employee base salary | `5000000` |
| hire_date | TIMESTAMP | Yes | Valid timestamp | Employment start date | `2026-01-10T00:00:00Z` |
| status | EmployeeStatus | Yes | Valid enum | Employment status | `ACTIVE` |
| department_id | UUID | Yes | FK → departments.id | Department reference | `...` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### EmployeeStatus

| Value | Description |
|---|---|
| ACTIVE | Employee is active |
| INACTIVE | Employee is inactive |

---

## Attendance

Stores employee attendance records.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Attendance identifier | `...` |
| employee_id | UUID | Yes | FK → employees.id | Employee reference | `...` |
| check_in | TIMESTAMP | Yes | Valid timestamp | Employee check-in time | `2026-08-11 08:05:00` |
| check_out | TIMESTAMP | No | Nullable, valid timestamp | Employee check-out time | `2026-08-11 17:00:00` |
| status | AttendanceStatus | Yes | Valid enum | Attendance status | `PRESENT` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:05:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 17:00:00` |

### AttendanceStatus

| Value | Description |
|---|---|
| PRESENT | Employee attended |
| LATE | Employee attended but arrived late |
| ABSENT | Employee did not attend |
| LEAVE | Employee was on approved leave |

### Constraint

Normally, an employee should have at most one attendance record for a given date.

---

## Leave Requests

Stores employee leave requests.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Leave request identifier | `...` |
| employee_id | UUID | Yes | FK → employees.id | Employee reference | `...` |
| reviewer_id | UUID | No | FK → users.id | Reviewer user | `...` |
| start_date | TIMESTAMP | Yes | Valid timestamp | Leave start date | `2026-08-20T00:00:00Z` |
| end_date | TIMESTAMP | Yes | >= start_date | Leave end date | `2026-08-22T00:00:00Z` |
| reason | TEXT | Yes | Required | Leave reason | `Family event` |
| status | LeaveStatus | Yes | Valid enum | Request status | `PENDING` |
| reviewed_at | TIMESTAMP | No | Nullable | Review timestamp | `NULL` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### LeaveStatus

| Value | Description |
|---|---|
| PENDING | Waiting for review |
| APPROVED | Leave approved |
| REJECTED | Leave rejected |
| CANCELLED | Leave request cancelled |

### Business Rules

- `start_date` cannot be later than `end_date`.
- Employee must be active when creating a leave request.
- Overlapping leave requests are not allowed where applicable.
- Only authorized users may approve or reject leave.
- `reviewer_id` and `reviewed_at` should be set when the request is reviewed.
- Only pending leave requests may be edited where applicable.
- Historical leave decisions should remain available.

---

## Performance Reviews

Stores employee performance review records.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Review identifier | `...` |
| employee_id | UUID | Yes | FK → employees.id | Employee reference | `...` |
| reviewer_id | UUID | No | FK → users.id, nullable | Reviewer user | `...` |
| review_period | VARCHAR(50) | No | Nullable | Review period | `2026-Q3` |
| score | INTEGER | Yes | Valid configured range | Performance score | `85` |
| comments | TEXT | No | Nullable | Review comments | `Consistently meets targets` |
| review_date | TIMESTAMP | Yes | Valid timestamp | Review date | `2026-08-11T00:00:00Z` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-11 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-11 08:00:00` |

### Business Rules

- Employee must exist and be active when creating a review.
- Reviewer must be an authorized user when provided.
- Score must be within the valid configured range.
- Duplicate reviews for the same employee and review period are not allowed where applicable.
- Review history should remain available.

---

## Payroll

Stores monthly employee payroll records.

| Field | Type | Required | Validation | Description | Example |
|---|---|---:|---|---|---|
| id | UUID | Yes | Primary key | Payroll identifier | `...` |
| employee_id | UUID | Yes | FK → employees.id | Employee reference | `...` |
| month | INTEGER | Yes | 1–12 | Payroll month | `8` |
| year | INTEGER | Yes | Valid year | Payroll year | `2026` |
| base_salary | FLOAT | Yes | >= 0 | Base salary for the payroll period | `5000000` |
| bonus | FLOAT | Yes | >= 0 | Additional bonus | `500000` |
| deduction | FLOAT | Yes | >= 0 | Payroll deduction | `250000` |
| total_salary | FLOAT | Yes | Calculated | Final salary amount | `5250000` |
| created_at | TIMESTAMP | Yes | Valid timestamp | Creation timestamp | `2026-08-31 08:00:00` |
| updated_at | TIMESTAMP | Yes | Valid timestamp | Last update timestamp | `2026-08-31 08:00:00` |

### Constraints

```text
UNIQUE (employee_id, month, year)
```

### Business Rules

- Employee must exist and be active when creating payroll.
- Month must be between 1 and 12.
- Base salary, bonus, and deduction cannot be negative.
- Only one payroll record may exist for the same employee, month, and year.
- total_salary is calculated from base salary, bonus, and deduction.
- Historical payroll records should remain available.

---

# Entity Field Summary

| Entity | Main Purpose |
|---|---|
| users | System authentication accounts |
| roles | Access roles |
| permissions | Individual system permissions |
| user_roles | User-role assignments |
| role_permissions | Role-permission assignments |
| categories | Product categories |
| products | Inventory products |
| suppliers | Product suppliers |
| customers | Sales customers |
| purchases | Purchase transactions |
| purchase_items | Products within purchases |
| sales | Sales transactions |
| sale_items | Products within sales |
| inventory_movements | Inventory change history |
| departments | Employee departments |
| employees | Employee records |
| attendance | Employee attendance |
| leave_requests | Employee leave requests |
| performance_reviews | Employee performance evaluations |

---

# Data Integrity Rules

## Products

- SKU must be unique.
- Barcode must be unique when provided.
- Stock cannot be negative.
- Purchase price cannot be negative.
- Selling price cannot be negative.
- Minimum stock cannot be negative.

---

## Categories

- Category name must be unique.
- Categories referenced by products should not be permanently deleted.

---

## Suppliers

- Suppliers referenced by purchase history should not be permanently deleted.

---

## Customers

- Customers referenced by sales history should not be permanently deleted.

---

## Purchases

- Purchase must reference a valid supplier.
- Purchase should contain at least one purchase item before completion.
- Purchase item quantity must be greater than zero.
- Purchase item price cannot be negative.
- Completed purchases increase inventory.

---

## Sales

- Sale should contain at least one sale item before completion.
- Sale quantity must be greater than zero.
- Sale quantity cannot exceed available stock.
- Sale total must be calculated from sale items and discount.
- Completed sales decrease inventory.

---

## Inventory

Inventory changes must be represented by inventory movements.

```text
Purchase
   │
   ▼
IN Movement
   │
   ▼
Increase Product Stock


Sale
   │
   ▼
OUT Movement
   │
   ▼
Decrease Product Stock


Adjustment
   │
   ▼
IN / OUT Movement
   │
   ▼
Update Product Stock
```

---

## Employees

- Employee code must be unique.
- Every employee belongs to a department.
- Historical employee data should be preserved.

---

## Attendance

- Employee must exist.
- Attendance date is required.
- An employee should normally have one attendance record per date.

---

## Leave Requests

- Employee must exist.
- Start date must not be later than end date.
- Only authorized users may approve or reject requests.
- Historical decisions should remain available.

---

## Performance Reviews

- Employee must exist.
- Reviewer must be an authorized user.
- Performance score must use the configured valid range.
- Review history should remain available.

---

# Data Preservation Strategy

Opsora preserves historical data using either soft deletion or status-based
deactivation depending on the entity.

## Soft Delete

Entities supporting `deleted_at`:

- Categories
- Products
- Suppliers
- Customers

Soft-deleted records remain in the database so historical transactions can
retain their references.

## Status-Based Deactivation

Entities using an active/inactive state instead of `deleted_at`:

- Users
- Employees

Inactive users cannot authenticate or access protected application resources.

Inactive employees remain available for historical People Operations records
but are not eligible for new operational records where an active employee is
required.

## Restricted Deletion

Departments do not use `deleted_at`.

A department may only be deleted when it has no associated employees.

Transactional and historical records should not be physically deleted when
doing so would compromise business or operational history.

---

# Data Type Standards

## UUID

Used for primary keys and foreign keys.

---

## VARCHAR

Used for short textual values such as:

- Names
- Codes
- Emails
- Status identifiers

---

## TEXT

Used for longer free-form text such as:

- Descriptions
- Addresses
- Notes
- Review comments

---

## DECIMAL

Used for:

- Monetary values
- Quantities where fractional units may be supported
- Performance scores

Money should use a fixed precision such as:

```text
DECIMAL(15,2)
```

---

## DATE

Used when only the calendar date is required.

Examples:

```text
purchase_date
sale_date
join_date
attendance_date
review_date
```

---

## TIME

Used for time-of-day values.

Examples:

```text
check_in
check_out
```

---

## TIMESTAMP

Used when date and time are both required.

Examples:

```text
created_at
updated_at
reviewed_at
```

---

# Related Documents

- vision.md
- requirements.md
- user-stories.md
- user-flow.md
- wireframes.md
- erd.md
- api-design.md
- architecture.md
- glossary.md

---

# Revision History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-07-27 | Initial data dictionary |
| 2.0 | 2026-08-11 | Expanded dictionary for Access & Administration, Core Business Operations, and People Operations |
