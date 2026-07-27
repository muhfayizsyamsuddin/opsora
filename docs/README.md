# 📚 Opsora Documentation

Welcome to the official technical documentation for **Opsora**.

This documentation provides a complete overview of the project, from business requirements to system architecture, engineering standards, and deployment guidelines.

---

# Documentation Roadmap

```
Planning
    ↓
Design
    ↓
Engineering
    ↓
Operations
    ↓
Architecture Decision Records (ADR)
```

It is recommended to read the documents in the order above.

---

# Documentation Structure

```
docs/
│
├── README.md
│
├── 01-planning/
│   ├── requirements.md
│   ├── user-stories.md
│   ├── user-flow.md
│   └── wireframe.md
│
├── 02-design/
│   ├── erd.md
│   ├── data-dictionary.md
│   ├── api-design.md
│   └── architecture.md
│
├── 03-engineering/
│   ├── coding-standards.md
│   └── git-workflow.md
│
├── 04-operations/
│   └── deployment.md
│
└── decisions/
    ├── ADR-001-authentication.md
    ├── ADR-002-database.md
    └── ADR-003-file-upload.md
```

---

# Planning

Planning documents define **what** the system should achieve.

| Document | Description |
|----------|-------------|
| requirements.md | Functional and non-functional requirements |
| user-stories.md | User stories and acceptance criteria |
| user-flow.md | User interaction flows |
| wireframe.md | Low-fidelity UI layouts |

---

# Design

Design documents define **how** the system is structured.

| Document | Description |
|----------|-------------|
| erd.md | Entity Relationship Diagram |
| data-dictionary.md | Database field definitions |
| api-design.md | REST API specification |
| architecture.md | Overall system architecture |

---

# Engineering

Engineering documents define **how the team builds software**.

| Document | Description |
|----------|-------------|
| coding-standards.md | Coding conventions and best practices |
| git-workflow.md | Branching strategy and Git conventions |

---

# Operations

Operations documents define **how the system runs in production**.

| Document | Description |
|----------|-------------|
| deployment.md | Deployment architecture and operational procedures |

---

# Architecture Decision Records (ADR)

Architecture Decision Records explain why important technical decisions were made.

| Document | Decision |
|----------|----------|
| ADR-001 | Authentication strategy |
| ADR-002 | Database technology |
| ADR-003 | File upload strategy |

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 |
| Backend | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | JWT |
| Validation | Zod |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| File Storage | Cloudinary |

---

# Documentation Principles

This documentation follows several principles:

- Single source of truth
- Keep documents concise
- Avoid duplicated information
- Document decisions before implementation
- Update documentation alongside code changes

---

# Version

Current Documentation Version

```
v1.0
```

---

# License

This documentation is maintained as part of the Opsora project.