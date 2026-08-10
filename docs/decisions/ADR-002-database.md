# ADR-002: Database Technology

Status: Accepted

Date: 2026-08-11

Decision Owners: Opsora Engineering Team

---

# Context

Opsora requires a relational database to store application data and
support relationships between business entities.

The database must support:

- Users and roles
- Categories
- Products
- Suppliers
- Customers
- Purchases
- Sales
- Inventory
- Inventory movements
- Employees
- Departments
- Attendance
- Leave
- Performance reviews

The system also requires:

- Strong relational integrity
- Transactions for business operations
- Reliable data consistency
- Structured querying
- Support for Prisma ORM
- Production-ready deployment

Opsora uses a backend architecture based on Express.js and Prisma ORM.

    Express.js
         ↓
    Prisma ORM
         ↓
    PostgreSQL

---

# Decision

Opsora will use **PostgreSQL** as the primary database technology.

Prisma ORM will be used as the database access layer.

The initial production database deployment will use **Neon PostgreSQL**.

---

# Database Architecture

    Next.js Frontend
           ↓
    Express.js API
           ↓
    Service Layer
           ↓
    Prisma ORM
           ↓
    PostgreSQL

---

# Why PostgreSQL

PostgreSQL was selected because it provides:

- Strong relational data modeling
- Foreign key constraints
- Transaction support
- ACID compliance
- Reliable data consistency
- Complex query support
- Good TypeScript ecosystem support
- Prisma compatibility
- Production-ready scalability

These capabilities fit Opsora's transaction-heavy business operations.

---

# Data Integrity

Database relationships should be enforced through foreign keys.

Examples include:

    products
        ↓
    categories

    purchases
        ↓
    purchase_items
        ↓
    products

    sales
        ↓
    sale_items
        ↓
    products

    inventory_movements
        ↓
    products

    employees
        ↓
    departments

Business transactions that modify multiple records must use database
transactions where atomicity is required.

Example:

    Create Purchase
          ↓
    Create Purchase Items
          ↓
    Update Product Stock
          ↓
    Create Inventory Movement
          ↓
    Commit Transaction

If one required operation fails, the transaction should be rolled back.

---

# ORM Decision

Opsora will use **Prisma ORM**.

Prisma is responsible for:

- Database schema definition
- Type-safe database queries
- Database migrations
- Relationship handling
- Transaction support
- Generated TypeScript types

Application code should access the database through the repository
or service layer rather than directly from API controllers.

---

# Migration Strategy

Database schema changes will be managed through Prisma migrations.

Development:

    npx prisma migrate dev

Production:

    npx prisma migrate deploy

Migrations should be reviewed before being applied to production.

Database schema changes must not be performed manually in production
unless required for emergency recovery.

---

# Database Environment

Development, staging, and production should use separate database
connections.

    Development
        ↓
    Development Database

    Staging
        ↓
    Staging Database

    Production
        ↓
    Production Database

Production credentials must never be used in local development.

---

# Primary Keys

Opsora will use UUID values as primary keys.

Example:

    550e8400-e29b-41d4-a716-446655440000

UUIDs provide globally unique identifiers and avoid exposing sequential
database identifiers.

---

# Naming Convention

Database tables use plural `snake_case`.

Examples:

    users
    products
    categories
    purchase_items
    sale_items
    inventory_movements
    employees
    departments
    attendance_records
    leave_requests
    performance_reviews

Columns use `snake_case`.

Examples:

    product_id
    supplier_id
    purchase_price
    selling_price
    minimum_stock
    created_at
    updated_at

---

# Timestamps

Entities should use timestamps where applicable.

Common fields:

    created_at
    updated_at
    deleted_at

Soft deletion should be used for master data where historical references
must remain valid.

---

# Transaction Requirements

Operations that affect multiple related records must use database
transactions when partial execution could produce inconsistent data.

Examples:

## Purchase

    Purchase
       ↓
    Purchase Items
       ↓
    Increase Stock
       ↓
    Inventory Movement

## Sale

    Sale
       ↓
    Sale Items
       ↓
    Decrease Stock
       ↓
    Inventory Movement

These operations should succeed or fail as one logical database
transaction.

---

# Alternatives Considered

## MySQL

Advantages:

- Widely used relational database.
- Large ecosystem.
- Good hosting availability.

Disadvantages:

- PostgreSQL provides stronger alignment with the planned relational
  model and advanced database capabilities.
- PostgreSQL was a better fit for the selected architecture.

---

## MongoDB

Advantages:

- Flexible document structure.
- Easy schema changes.
- Good for document-oriented applications.

Disadvantages:

- Opsora contains many relational entities.
- Transactions and relationships are central to business operations.
- A relational database provides a clearer data model for the system.

---

## SQLite

Advantages:

- Very simple setup.
- Good for local development and small applications.

Disadvantages:

- Not appropriate as the primary production database for Opsora.
- Limited suitability for the expected multi-user deployment.

---

# Consequences

## Positive

- Strong relational integrity.
- Reliable transactions.
- Type-safe database access through Prisma.
- Clear relational data model.
- Suitable for Core Business Operations and People Operations.
- Production-ready PostgreSQL infrastructure.

## Negative

- Requires relational schema planning.
- Schema changes require migrations.
- More structured than a document database.
- Database management requires additional infrastructure.

---

# Future Improvements

The database architecture may later introduce:

- Read replicas
- Connection pooling optimization
- Database backups
- Point-in-time recovery
- Query performance monitoring
- Index optimization
- Redis caching
- Database partitioning when required

These improvements are outside the current MVP scope.

---

# Related Documents

- requirements.md
- erd.md
- data-dictionary.md
- api-design.md
- architecture.md
- deployment.md
- coding-standards.md

---

# Revision History

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 2026-08-11 | Initial database technology decision |