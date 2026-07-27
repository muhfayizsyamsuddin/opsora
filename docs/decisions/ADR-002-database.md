# ADR-002: Database Technology

Status: Accepted

Date: 2026-07-27

---

# Context

Opsora requires a relational database to manage products, inventory, purchases, and sales.

---

# Decision

Use:

- PostgreSQL
- Prisma ORM

Reasons

- ACID compliance.
- Excellent relational support.
- Strong ecosystem.
- Prisma improves developer productivity.
- Supports UUID and transactions.

---

# Consequences

Advantages

- Reliable transactions.
- Mature tooling.
- Easy migrations.
- Excellent performance.

Disadvantages

- Slightly steeper learning curve than SQLite.

---

# Alternatives

SQLite

Rejected because:

- Not suitable for production inventory systems.

MongoDB

Rejected because:

- Business domain is highly relational.