# Entity Relationship Diagram (ERD)

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-11

---

# Overview

This document defines the database entities and relationships used by Opsora.

Opsora is organized into three major areas:

- Access & Administration
- Core Business Operations
- People Operations

The ERD is designed for the current MVP scope while keeping the structure extensible for future business requirements.

---

# System Domains

```text
OPSORA
│
├── ACCESS & ADMINISTRATION
│   ├── Users
│   ├── Roles
│   ├── Permissions
│   ├── User Roles
│   └── Role Permissions
│
├── CORE BUSINESS OPERATIONS
│   ├── Categories
│   ├── Products
│   ├── Suppliers
│   ├── Customers
│   ├── Purchases
│   ├── Purchase Items
│   ├── Sales
│   ├── Sale Items
│   └── Inventory Movements
│
└── PEOPLE OPERATIONS
    ├── Departments
    ├── Employees
    ├── Attendance
    ├── Leave Requests
    └── Performance Reviews
```

---

# ERD Overview

```text
                              ┌──────────────┐
                              │    USERS     │
                              └──────┬───────┘
                                     │
                                USER_ROLES
                                     │
                                     ▼
                              ┌──────────────┐
                              │    ROLES     │
                              └──────┬───────┘
                                     │
                              ROLE_PERMISSIONS
                                     │
                                     ▼
                              ┌──────────────┐
                              │ PERMISSIONS  │
                              └──────────────┘


┌──────────────┐
│  CATEGORIES  │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│   PRODUCTS   │
└──────┬───────┘
       │
       ├──────────────────────┐
       │                      │
       │ 1:N                  │ 1:N
       ▼                      ▼
┌──────────────┐       ┌─────────────────────┐
│ PURCHASE_    │       │ INVENTORY_MOVEMENTS │
│ ITEMS        │       └─────────────────────┘
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│  PURCHASES   │
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│  SUPPLIERS   │
└──────────────┘


┌──────────────┐
│   PRODUCTS   │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│ SALE_ITEMS   │
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│    SALES     │
└──────┬───────┘
       │ N:1
       ▼
┌──────────────┐
│  CUSTOMERS   │
└──────────────┘


┌──────────────┐
│ DEPARTMENTS  │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│  EMPLOYEES   │
└──────┬───────┘
       │
       ├───────────────┐
       │ 1:N           │ 1:N
       ▼               ▼
┌──────────────┐  ┌──────────────────┐
│ ATTENDANCE   │  │ LEAVE_REQUESTS   │
└──────────────┘  └──────────────────┘
       │
       │ 1:N
       ▼
┌──────────────────────┐
│ PERFORMANCE_REVIEWS  │
└──────────────────────┘
```

---

# Access & Administration

# Users

Stores user accounts that can authenticate and access Opsora.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique user identifier |
| name | VARCHAR | NOT NULL | User display name |
| email | VARCHAR | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR | NOT NULL | Hashed password |
| status | ENUM | NOT NULL | Account status |
| employee_id | UUID | FK, NULL | Optional employee reference |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Status

- ACTIVE
- INACTIVE

### Relationships

```text
Users
  │
  ├── 1:N ── User Roles
  │
  └── 0:1 ── Employee
```

A user account may optionally be associated with an employee.

Not every employee must have a user account.

---

# Roles

Defines access roles within Opsora.

### Default Roles

- Super Admin
- Owner
- Admin
- Manager
- Staff
- Cashier

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique role identifier |
| name | VARCHAR | UNIQUE, NOT NULL | Role name |
| description | TEXT | NULL | Role description |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Relationships

```text
Roles
  │
  ├── N:M ── Users
  │
  └── N:M ── Permissions
```

---

# Permissions

Defines individual actions that can be performed in the system.

### Examples

- products.view
- products.create
- products.update
- products.delete
- sales.view
- sales.create
- purchases.view
- purchases.create
- inventory.view
- inventory.adjust
- employees.view
- employees.create
- attendance.view
- attendance.create
- leave.view
- leave.create
- leave.approve
- performance.view
- performance.create

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique permission identifier |
| name | VARCHAR | UNIQUE, NOT NULL | Permission identifier |
| description | TEXT | NULL | Permission description |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

---

# User Roles

Junction table connecting users and roles.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| user_id | UUID | PK, FK | User reference |
| role_id | UUID | PK, FK | Role reference |
| created_at | TIMESTAMP | NOT NULL | Assignment timestamp |

### Relationship

```text
Users N:M Roles
```

A user may have one or more roles.

---

# Role Permissions

Junction table connecting roles and permissions.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| role_id | UUID | PK, FK | Role reference |
| permission_id | UUID | PK, FK | Permission reference |
| created_at | TIMESTAMP | NOT NULL | Assignment timestamp |

### Relationship

```text
Roles N:M Permissions
```

---

# Core Business Operations

# Categories

Stores product categories.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique category identifier |
| name | VARCHAR | UNIQUE, NOT NULL | Category name |
| description | TEXT | NULL | Category description |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Relationships

```text
Category 1:N Products
```

---

# Products

Stores products managed by the inventory system.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique product identifier |
| category_id | UUID | FK, NOT NULL | Product category |
| name | VARCHAR | NOT NULL | Product name |
| sku | VARCHAR | UNIQUE, NOT NULL | Stock Keeping Unit |
| barcode | VARCHAR | UNIQUE, NULL | Product barcode |
| purchase_price | DECIMAL | NOT NULL | Default purchase price |
| selling_price | DECIMAL | NOT NULL | Default selling price |
| stock | DECIMAL | NOT NULL | Current stock quantity |
| minimum_stock | DECIMAL | NOT NULL | Minimum stock threshold |
| unit | VARCHAR | NOT NULL | Product unit |
| image_url | VARCHAR | NULL | Product image URL |
| status | ENUM | NOT NULL | Product status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Status

- ACTIVE
- INACTIVE

### Relationships

```text
Category 1:N Products
Product 1:N Purchase Items
Product 1:N Sale Items
Product 1:N Inventory Movements
```

---

# Suppliers

Stores supplier information.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique supplier identifier |
| name | VARCHAR | NOT NULL | Supplier name |
| phone | VARCHAR | NULL | Supplier phone |
| email | VARCHAR | NULL | Supplier email |
| address | TEXT | NULL | Supplier address |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Relationships

```text
Supplier 1:N Purchases
```

---

# Customers

Stores customer information.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique customer identifier |
| name | VARCHAR | NOT NULL | Customer name |
| phone | VARCHAR | NULL | Customer phone |
| email | VARCHAR | NULL | Customer email |
| address | TEXT | NULL | Customer address |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Relationships

```text
Customer 1:N Sales
```

Walk-in customers may be represented by a designated customer record or by an optional customer relationship depending on the final implementation.

---

# Purchases

Stores purchase transactions from suppliers.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique purchase identifier |
| supplier_id | UUID | FK, NOT NULL | Supplier reference |
| user_id | UUID | FK, NOT NULL | User who created the purchase |
| purchase_date | DATE | NOT NULL | Purchase date |
| total_amount | DECIMAL | NOT NULL | Total purchase amount |
| status | ENUM | NOT NULL | Purchase status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Status

- DRAFT
- COMPLETED
- CANCELLED

### Relationships

```text
Supplier 1:N Purchases
User 1:N Purchases
Purchase 1:N Purchase Items
```

---

# Purchase Items

Stores individual products included in a purchase.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique purchase item identifier |
| purchase_id | UUID | FK, NOT NULL | Purchase reference |
| product_id | UUID | FK, NOT NULL | Product reference |
| quantity | DECIMAL | NOT NULL | Purchased quantity |
| unit_price | DECIMAL | NOT NULL | Purchase price per unit |
| subtotal | DECIMAL | NOT NULL | Quantity × unit price |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

### Relationships

```text
Purchase 1:N Purchase Items
Product 1:N Purchase Items
```

---

# Sales

Stores sales transactions.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique sale identifier |
| customer_id | UUID | FK, NULL | Customer reference |
| user_id | UUID | FK, NOT NULL | User who created the sale |
| sale_date | DATE | NOT NULL | Sale date |
| subtotal | DECIMAL | NOT NULL | Total before discount |
| discount | DECIMAL | NOT NULL | Discount amount |
| total_amount | DECIMAL | NOT NULL | Final sale amount |
| payment_method | ENUM | NOT NULL | Payment method |
| status | ENUM | NOT NULL | Sale status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Payment Methods

- CASH
- TRANSFER
- QRIS

Additional payment methods may be added later.

### Status

- COMPLETED
- CANCELLED

### Relationships

```text
Customer 1:N Sales
User 1:N Sales
Sale 1:N Sale Items
```

---

# Sale Items

Stores individual products included in a sale.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique sale item identifier |
| sale_id | UUID | FK, NOT NULL | Sale reference |
| product_id | UUID | FK, NOT NULL | Product reference |
| quantity | DECIMAL | NOT NULL | Sold quantity |
| unit_price | DECIMAL | NOT NULL | Selling price per unit |
| discount | DECIMAL | NOT NULL | Item discount |
| subtotal | DECIMAL | NOT NULL | Calculated item subtotal |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

### Relationships

```text
Sale 1:N Sale Items
Product 1:N Sale Items
```

---

# Inventory Movements

Records every inventory change.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique movement identifier |
| product_id | UUID | FK, NOT NULL | Product reference |
| user_id | UUID | FK, NOT NULL | User responsible for movement |
| movement_type | ENUM | NOT NULL | IN or OUT |
| reference_type | ENUM | NOT NULL | Source of movement |
| reference_id | UUID | NULL | Related transaction identifier |
| quantity | DECIMAL | NOT NULL | Quantity changed |
| before_stock | DECIMAL | NOT NULL | Stock before movement |
| after_stock | DECIMAL | NOT NULL | Stock after movement |
| reason | TEXT | NULL | Reason for manual adjustment |
| created_at | TIMESTAMP | NOT NULL | Movement timestamp |

### Movement Type

- IN
- OUT

### Reference Type

- PURCHASE
- SALE
- ADJUSTMENT

### Relationships

```text
Product 1:N Inventory Movements
User 1:N Inventory Movements
```

`reference_id` identifies the related business transaction when applicable.

The exact reference resolution strategy will be defined in the API and implementation design.

---

# People Operations

# Departments

Stores organizational departments.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique department identifier |
| name | VARCHAR | UNIQUE, NOT NULL | Department name |
| description | TEXT | NULL | Department description |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Relationships

```text
Department 1:N Employees
```

A department should not be permanently deleted while referenced by active or historical employee records.

---

# Employees

Stores employee information.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique employee identifier |
| department_id | UUID | FK, NOT NULL | Department reference |
| employee_code | VARCHAR | UNIQUE, NOT NULL | Employee identifier |
| full_name | VARCHAR | NOT NULL | Employee full name |
| email | VARCHAR | NULL | Employee email |
| phone | VARCHAR | NULL | Employee phone |
| position | VARCHAR | NULL | Employee position |
| join_date | DATE | NOT NULL | Employment start date |
| status | ENUM | NOT NULL | Employment status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Status

- ACTIVE
- INACTIVE

### Relationships

```text
Department 1:N Employees
Employee 1:N Attendance
Employee 1:N Leave Requests
Employee 1:N Performance Reviews
Employee 0:1 User
```

An employee may optionally have one user account.

---

# Attendance

Stores employee attendance records.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique attendance identifier |
| employee_id | UUID | FK, NOT NULL | Employee reference |
| attendance_date | DATE | NOT NULL | Attendance date |
| check_in | TIME | NULL | Check-in time |
| check_out | TIME | NULL | Check-out time |
| status | ENUM | NOT NULL | Attendance status |
| notes | TEXT | NULL | Attendance notes |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Status

- PRESENT
- LATE
- ABSENT
- LEAVE

### Relationships

```text
Employee 1:N Attendance
```

### Business Constraint

An employee should have at most one attendance record for a given date unless the implementation explicitly supports multiple attendance sessions.

---

# Leave Requests

Stores employee leave requests and their approval status.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique leave request identifier |
| employee_id | UUID | FK, NOT NULL | Employee reference |
| leave_type | ENUM | NOT NULL | Leave category |
| start_date | DATE | NOT NULL | Leave start date |
| end_date | DATE | NOT NULL | Leave end date |
| reason | TEXT | NULL | Leave reason |
| status | ENUM | NOT NULL | Request status |
| reviewed_by | UUID | FK, NULL | User who reviewed request |
| reviewed_at | TIMESTAMP | NULL | Review timestamp |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Leave Types

- ANNUAL
- SICK
- PERSONAL
- OTHER

### Status

- PENDING
- APPROVED
- REJECTED
- CANCELLED

### Relationships

```text
Employee 1:N Leave Requests
User 1:N Leave Requests
```

`reviewed_by` references the user who approved or rejected the request.

### Business Rules

- Start date cannot be later than end date.
- Only authorized users may approve or reject requests.
- A user should not approve their own leave request.
- Historical leave decisions should remain available.

---

# Performance Reviews

Stores employee performance review records.

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique performance review identifier |
| employee_id | UUID | FK, NOT NULL | Employee reference |
| reviewer_id | UUID | FK, NOT NULL | User who performed the review |
| review_period | VARCHAR | NOT NULL | Review period |
| performance_score | DECIMAL | NOT NULL | Performance score |
| review_notes | TEXT | NULL | Review notes |
| review_date | DATE | NOT NULL | Review date |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

### Relationships

```text
Employee 1:N Performance Reviews
User 1:N Performance Reviews
```

`reviewer_id` references the user who created the performance review.

### Business Rules

- Employee is required.
- Review period is required.
- Performance score must be within the configured valid range.
- Only authorized users may create or edit reviews.

---

# Relationship Summary

| Entity | Relationship | Entity |
|---|---|---|
| User | N:M | Role |
| Role | N:M | Permission |
| User | 0:1 | Employee |
| Category | 1:N | Product |
| Supplier | 1:N | Purchase |
| Purchase | 1:N | Purchase Item |
| Product | 1:N | Purchase Item |
| Customer | 1:N | Sale |
| User | 1:N | Sale |
| Sale | 1:N | Sale Item |
| Product | 1:N | Sale Item |
| Product | 1:N | Inventory Movement |
| User | 1:N | Inventory Movement |
| Department | 1:N | Employee |
| Employee | 1:N | Attendance |
| Employee | 1:N | Leave Request |
| User | 1:N | Leave Request |
| Employee | 1:N | Performance Review |
| User | 1:N | Performance Review |

---

# Data Integrity Rules

## Products

- SKU must be unique.
- Barcode must be unique when provided.
- Product stock cannot be negative.
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

- A purchase must reference a valid supplier.
- A purchase must contain at least one purchase item.
- Purchase item quantity must be greater than zero.
- Purchase item price cannot be negative.

---

## Sales

- A sale must contain at least one sale item.
- Sale quantity must be greater than zero.
- Sale quantity cannot exceed available stock.
- Sale total must be calculated from sale items and discount.
- A completed sale creates an inventory movement.

---

## Inventory

Inventory changes must be recorded through inventory movements.

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

The `before_stock` and `after_stock` values provide an audit trail for stock changes.

---

## Employees

- Employee code must be unique.
- Every employee belongs to a department.
- Employee records referenced by historical People Operations data should not be permanently deleted.

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
- Approved and rejected requests should preserve their decision history.

---

## Performance Reviews

- Employee must exist.
- Reviewer must be an authorized user.
- Performance score must use the configured valid range.
- Review history should remain available.

---

# Soft Delete Strategy

The following entities support soft deletion where historical references may exist:

- Users
- Categories
- Products
- Suppliers
- Customers
- Departments
- Employees

Soft-deleted records remain in the database but are excluded from normal active queries.

Transactional and historical records should not be physically deleted when doing so would compromise business history.

---

# Audit Considerations

The current ERD records responsible users for important operational activities through `user_id` or equivalent fields.

Examples:

- Purchase creator
- Sale creator
- Inventory movement creator
- Leave reviewer
- Performance review reviewer

A dedicated audit log may be introduced in a future release if more detailed system auditing is required.

---

# MVP Scope

The current ERD supports:

### Access & Administration

- Authentication users
- Roles
- Permissions
- User-role assignments
- Role-permission assignments

### Core Business Operations

- Categories
- Products
- Suppliers
- Customers
- Purchases
- Sales
- Inventory movements
- Business reports based on transactional data

### People Operations

- Employees
- Departments
- Attendance
- Leave
- Performance reviews

---

# Out of Scope

The following entities are intentionally excluded from the current MVP ERD:

- Payroll
- Multi-company
- Multi-warehouse
- Warehouse transfers
- Purchase returns
- Sales returns
- Product variants
- Accounting
- Tax management
- CRM
- E-commerce integrations
- AI forecasting

These may require additional entities and relationships in future versions.

---

# Future Extension

The ERD should remain extensible for future modules.

Possible future relationships include:

```text
Future
│
├── Warehouses
│   └── Warehouse Transfers
│
├── Returns
│   ├── Purchase Returns
│   └── Sales Returns
│
├── Payroll
│   └── Employee Payroll
│
├── Multi Company
│   └── Company / Organization
│
└── Product Variants
    └── Product Variant Inventory
```

These structures should not be implemented in the MVP unless the product scope is explicitly expanded.

---

# Design Decisions

## Separate User and Employee Entities

Users represent system accounts.

Employees represent people working within the business.

An employee may have a user account, but a user account is not required for every employee.

---

## Role-Based Access Control

Opsora uses roles and permissions rather than relying only on hard-coded role checks.

This allows permissions to evolve as the system grows.

Default roles remain:

- Super Admin
- Owner
- Admin
- Manager
- Staff
- Cashier

---

## Inventory Movement History

Inventory changes are recorded as movements rather than relying only on the current product stock value.

This allows the system to maintain a history of stock changes.

---

## Transaction History Preservation

Business transactions should remain available for historical reporting.

Records referenced by transactions should therefore use soft deletion or another preservation strategy instead of destructive deletion.

---

# Related Documents

- vision.md
- requirements.md
- user-stories.md
- user-flow.md
- wireframes.md
- data-dictionary.md
- api-design.md
- architecture.md

---

# Revision History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-07-27 | Initial ERD |
| 2.0 | 2026-08-11 | Expanded ERD for Access & Administration, Core Business Operations, and People Operations |
