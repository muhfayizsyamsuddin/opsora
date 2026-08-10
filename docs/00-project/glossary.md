# Glossary

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-10

---

# Overview

This glossary defines the business and technical terms used throughout the Opsora
documentation.

It ensures consistent terminology across planning, design, engineering, and
operations documents.

Opsora uses two major business areas:

- Core Business Operations
- People Operations

---

# Business Terms

## Attendance

A record of an employee's presence and attendance activity.

---

## Barcode

A machine-readable code used to uniquely identify a product.

---

## Category

A classification used to group similar products.

Examples:

- Electronics
- Furniture
- Office Supplies

---

## Customer

An individual or organization that purchases products.

---

## Dashboard

The main page that summarizes important business information such as sales,
purchases, inventory, and operational activity.

---

## Department

An organizational unit used to group employees within a business.

---

## Employee

A person who works for the business and is managed through the People
Operations module.

---

## Inventory

The quantity of products currently available for sale or storage.

---

## Inventory Movement

Any event that changes product stock.

Examples:

- Purchase receiving
- Sale
- Stock adjustment
- Return

---

## Leave

An employee's approved or requested absence from work.

---

## Low Stock

A condition where available stock is below the configured minimum stock level.

---

## Performance Review

A formal evaluation of an employee's performance during a defined review
period.

---

## Product

An item managed within the inventory system.

---

## Purchase

A transaction where products are acquired from a supplier.

---

## Purchase Item

A single product included in a purchase transaction.

---

## Role

A set of permissions that determines what actions a user can perform within
the system.

Opsora currently defines the following primary roles:

- Owner
- Admin
- Staff

---

## Sale

A transaction where products are sold to a customer.

---

## Sale Item

A single product included in a sales transaction.

---

## SKU (Stock Keeping Unit)

A unique identifier assigned to a product for inventory management.

Example:

PRD-000001

---

## Stock Adjustment

A manual correction made to inventory quantities.

---

## Supplier

A company or individual providing products to the business.

---

## Transaction

A recorded business operation that affects inventory, purchasing, sales, or
other operational records.

---

## Unit

The measurement used for a product.

Examples:

- pcs
- box
- pack
- bottle
- kilogram

---

## Walk-in Customer

A customer who makes a purchase without being registered in the system.

---

# Business Areas

## Core Business Operations

The primary business area of Opsora covering inventory, products, purchasing,
sales, customers, suppliers, and reporting.

---

## People Operations

The business area covering employee and workforce management.

People Operations includes:

- Employees
- Departments
- Attendance
- Leave
- Performance Review

---

# Technical Terms

## API

Application Programming Interface.

A set of endpoints used for communication between the frontend and backend.

---

## Authentication

The process of verifying a user's identity.

---

## Authorization

The process of determining what actions an authenticated user is allowed to
perform.

---

## Cloudinary

A cloud-based service used to store and optimize product images.

---

## Controller

The application layer responsible for handling HTTP requests and responses.

---

## CRUD

Create, Read, Update, Delete.

The four fundamental database operations.

---

## Endpoint

A specific URL exposed by the REST API.

Example:

POST /api/v1/products

---

## JWT

JSON Web Token.

Used for stateless user authentication.

---

## Middleware

Software that executes before or after request processing.

Examples:

- Authentication
- Authorization
- Error handling

---

## Migration

A version-controlled database schema change.

---

## Prisma

The ORM used by Opsora to communicate with PostgreSQL.

---

## Repository

A layer responsible for interacting with the database.

---

## REST API

An API architecture based on HTTP methods and resources.

---

## Service

A layer responsible for implementing business logic.

---

## Soft Delete

A deletion strategy where data is marked as deleted instead of being
permanently removed.

---

## Validation

The process of checking whether incoming data satisfies business and
technical rules.

---

# Acronyms

| Acronym | Meaning |
| ------- | ------- |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DB | Database |
| ERD | Entity Relationship Diagram |
| HTTP | Hypertext Transfer Protocol |
| JWT | JSON Web Token |
| ORM | Object Relational Mapping |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SKU | Stock Keeping Unit |
| UI | User Interface |
| UUID | Universally Unique Identifier |

---

# Naming Conventions

Throughout the documentation:

- "Product" refers to an inventory item.
- "Purchase" refers to buying from a supplier.
- "Sale" refers to selling to a customer.
- "Inventory" refers to current product stock.
- "Transaction" refers to a recorded business operation.
- "Employee" refers to a person managed through People Operations.
- "Department" refers to an organizational unit containing employees.
- "Attendance" refers to employee attendance records.
- "Leave" refers to employee absence requests or records.
- "Performance Review" refers to an employee performance evaluation.
- "Core Business Operations" refers to the primary inventory and business
  transaction capabilities of Opsora.
- "People Operations" refers to employee and workforce management capabilities.

These terms should be used consistently across all documents.

---

# Related Documents

- [Vision](./vision.md)
- [Roadmap](./roadmap.md)
- [Requirements](../01-planning/requirements.md)
- [Data Dictionary](../02-design/data-dictionary.md)
- [API Design](../02-design/api-design.md)
- [Architecture](../02-design/architecture.md)

---

# Revision History

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 2026-07-27 | Initial glossary |
| 2.0 | 2026-08-10 | Aligned terminology with Core Business Operations and People Operations |