# Deployment

Version: 1.1

Status: Completed

Author: Faiz

Last Updated: 2026-09-01

---

# Overview

This document describes the deployment environments, infrastructure,
configuration, and deployment flow used by Opsora.

The deployment architecture consists of:

- Next.js frontend
- Express.js backend
- PostgreSQL database
- Cloudinary file storage

---

# Environments

Opsora uses three deployment environments.

| Environment | Purpose |
| ----------- | ------- |
| Development | Local development and testing |
| Staging | Pre-production testing |
| Production | Live application |

---

# Development

The development environment is used by developers during implementation.

Typical services:

- Next.js frontend
- Express.js backend
- PostgreSQL
- Cloudinary development resources

Developers should use environment variables for local configuration.

Example:

```text
.env
.env.local
```

# Staging

The staging environment is used to verify changes before production.

Staging should be as close as practical to the production environment.

Staging is used for:

- Integration testing
- API testing
- Database migration testing
- UI testing
- Acceptance testing
- Release verification

Staging should use separate credentials and configuration from
production.

# Production

Production is the live Opsora environment.

Production deployment should only occur after:

- Tests pass
- Build succeeds
- Required migrations are verified
- Pull Request is reviewed
- Changes are merged into main

## Frontend
Platform
    Vercel
The Next.js frontend is deployed through Vercel.

Responsibilities:
- Build Next.js application
- Serve frontend pages
- Handle production deployments
- Manage frontend environment variables

## Backend
Primary Platform
    Railway
The Express.js backend is deployed through Railway.

Responsibilities:
- Run Express API
- Handle authentication
- Process business logic
- Communicate with PostgreSQL
- Communicate with Cloudinary

Alternative Platform
Render may be used as an alternative backend deployment platform.
The application should remain platform-independent where practical.

## Database
PostgreSQL

Opsora uses PostgreSQL as the primary relational database.
Primary deployment option:
Neon PostgreSQL

Responsibilities:
- Store application data
- Store users and roles
- Store master data
- Store transactions
- Store inventory data
- Store People Operations data
Database access is handled through Prisma ORM.

## File Storage
Cloudinary
Cloudinary is used for product image storage.
The application should store the Cloudinary URL in the database rather
than storing image binary data directly in PostgreSQL.

Upload flow:
User
  ↓
Frontend
  ↓
Backend
  ↓
Cloudinary
  ↓
Image URL
  ↓
PostgreSQL

## Environment Variables

Environment variables must be configured separately for each environment.

Required variables include:

DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_API_URL=

## Environment Variable Rules
- Never commit .env files.
- Never commit production secrets.
- Never expose backend secrets to the frontend.
- Use different credentials for development, staging, and production.
- Keep .env.example updated.
- Rotate credentials when they are compromised.

Example .env.example:

DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_API_URL=

No real credentials should be included.

## Database Migration

Database schema changes must be managed through Prisma migrations.

Development:
```bash
npx prisma migrate dev
```
Production deployment should use:
```bash
npx prisma migrate deploy
```
Database migrations must be reviewed before applying them to production.

# Build Process
## Frontend

The frontend should be built before deployment.
```bash
npm run build
```
The resulting Next.js application is deployed through Vercel.

## Backend

The backend must successfully compile before deployment.

Example:
```bash
npm run build
```

The production server should then start using the project's production
start command.

# Deployment Flow
Developer
    ↓
Git Branch
    ↓
Pull Request
    ↓
Code Review
    ↓
CI Checks
    ↓
Merge to main
    ↓
Deployment
    ├── Vercel
    │     ↓
    │   Next.js Frontend
    │
    └── Railway
          ↓
        Express API
          ↓
        Neon PostgreSQL
          ↓
        Cloudinary

# Release Flow
Development
    ↓
Feature Branch
    ↓
Testing
    ↓
Pull Request
    ↓
Staging
    ↓
Acceptance Testing
    ↓
Merge to main
    ↓
Production Deployment
    ↓
Monitoring

# Deployment Checklist

Before production deployment:

 - Pull Request approved
 - Build succeeds
 - Lint passes
 - Tests pass
 - Environment variables configured
 - Database migration reviewed
 - Database backup strategy verified
 - API health check verified
 - Frontend deployment verified
 - Backend deployment verified
 - Cloudinary configuration verified

# Post-Deployment Verification

After deployment:

- Verify application loads.
- Verify login works.
- Verify API health.
- Verify database connection.
- Verify product management.
- Verify purchase transactions.
- Verify sales transactions.
- Verify inventory updates.
- Verify employee and People Operations modules.
- Verify product image uploads.
- Verify reports.
- Check application logs for unexpected errors.

# Rollback

If a production deployment causes a critical issue:

Production Issue
      ↓
Identify Deployment
      ↓
Stop Further Changes
      ↓
Rollback Application
      ↓
Verify Database State
      ↓
Verify Application
      ↓
Investigate Root Cause

Database migrations require additional caution because application
rollback does not automatically mean database rollback.

# Security

Production deployment must:
- Use HTTPS.
- Protect environment variables.
- Use strong JWT secrets.
- Restrict database credentials.
- Never expose internal secrets.
- Keep dependencies updated.
- Restrict access to production infrastructure.
- Avoid logging sensitive information.

# Monitoring

Production should monitor:
- Application availability
- API errors
- Database connectivity
- Authentication failures
- Server errors
- Resource usage
- File upload failures
Detailed monitoring tooling may be introduced as the project grows.

# Infrastructure
| Component           | Technology      |
| ------------------- | --------------- |
| Frontend            | Vercel          |
| Backend             | Railway         |
| Backend Alternative | Render          |
| Database            | Neon PostgreSQL |
| ORM                 | Prisma          |
| File Storage        | Cloudinary      |
| API                 | Express.js      |
| Frontend Framework  | Next.js         |

# Related Documentation
- architecture.md
- git-workflow.md
- coding-standards.md
- api-design.md
- erd.md
- data-dictionary.md
- changelog.md

# Revision History
| Version | Date       | Description                                                                                                |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| 1.0     | 2026-07-27 | Initial deployment documentation                                                                           |
| 2.0     | 2026-08-11 | Expanded deployment environments, configuration, migration, release, security, and verification procedures |