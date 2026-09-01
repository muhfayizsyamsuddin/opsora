# Deployment

Version: 3.0

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

Production deployment occurs after:

- Type checking passes
- Production builds succeed
- Docker Compose configuration is valid
- Required database migrations are reviewed
- Environment variables are configured
- Changes are merged into `main`

## Production Architecture

```text
Internet
   ↓
Traefik
   ├── opsora.faizms.com
   │      ↓
   │   Web Container
   │
   ├── api-opsora.faizms.com
   │      ↓
   │   API Container
   │
   └── db-opsora.faizms.com
          ↓
       Adminer

API
 ↓
PostgreSQL

API
 ↓
Cloudinary
```

## Frontend
The Next.js frontend runs in a Docker container.

Production URL:
https://opsora.faizms.com

The frontend image is built and pushed to Docker Hub by GitHub Actions.

## Backend
The Express.js API runs in a Docker container.

Production URL:

https://api-opsora.faizms.com

Health endpoint:

https://api-opsora.faizms.com/health

The API container is only exposed externally through Traefik.

## Database
Opsora uses PostgreSQL 16 running as a Docker container.

The database:

- Is not exposed directly to the public internet
- Uses a persistent Docker volume
- Is accessed internally through the Docker network
- Is managed through Prisma ORM

## Database Administration
Adminer connects to PostgreSQL through the internal Docker network.

## File Storage
Cloudinary is used for product image storage.

The application stores the resulting Cloudinary URL in PostgreSQL rather than storing image binary data directly.

## Reverse Proxy

Traefik is used as the production reverse proxy.

Responsibilities include:

- HTTPS termination
- TLS certificate management
- Domain routing
- Forwarding traffic to internal Docker services

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

Prisma migrations are executed using the one-shot Docker service:
migrate

The service runs:
pnpm exec prisma migrate deploy

Migration order:

db healthy
   ↓
migrate
   ↓
seed
   ↓
api
   ↓
web

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

# CI/CD

Production deployment is triggered by a push to:

main

The GitHub Actions workflow:

- Checks out the repository.
- Logs in to Docker Hub.
- Builds the frontend Docker image.
- Builds the API runtime image.
- Builds the migration image.
- Pushes all images to Docker Hub.
- Connects to the VPS through SSH.
- Writes the production docker-compose.yml.
- Pulls the latest production images.
- Runs Docker Compose.

# Deployment Flow
Feature Branch
      ↓
develop
      ↓
Validation
      ↓
main
      ↓
GitHub Actions
      ↓
Docker Build
      ↓
Docker Hub
      ↓
SSH Deployment
      ↓
VPS
      ↓
Docker Compose
      ↓
Database Migration
      ↓
Seed
      ↓
API
      ↓
Web

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

| Component | Technology |
| --- | --- |
| Frontend | Next.js 16 |
| Backend API | Express.js |
| Database | PostgreSQL 16 |
| ORM | Prisma ORM |
| File Storage | Cloudinary |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Reverse Proxy | Traefik |
| CI/CD | GitHub Actions |
| Container Registry | Docker Hub |
| Production Host | VPS |

# Related Documentation
- architecture.md
- git-workflow.md
- coding-standards.md
- api-design.md
- erd.md
- data-dictionary.md
- changelog.md

# Revision History

| Version | Date | Description |
| --- | --- | --- |
| 1.0 | 2026-07-27 | Initial deployment documentation |
| 2.0 | 2026-08-11 | Expanded deployment environments, configuration, migration, release, security, and verification procedures |
| 3.0 | 2026-09-02 | Updated production deployment to Docker Compose, GitHub Actions, Docker Hub, Traefik, and VPS infrastructure |