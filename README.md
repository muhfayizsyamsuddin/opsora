# Opsora

Enterprise Business Operations Management System.

[Live Demo](https://opsora.faizms.com)

## Overview

Opsora is an enterprise business operations management system covering inventory, purchasing, sales, HR, payroll, performance management, and role-based administration.


## Key Engineering Highlights

- Role-Based Access Control (RBAC)
- JWT authentication
- Inventory & warehouse management
- Purchasing & sales workflow
- HR, attendance, payroll, performance review
- Search, filtering, and pagination
- PostgreSQL + Prisma
- Dockerized deployment
- GitHub Actions CI/CD
- Traefik reverse proxy

## Architecture

Next.js Frontend
        ↓
Express REST API
        ↓
Prisma ORM
        ↓
PostgreSQL

## Features

### Business Operations

- Product and category management
- Supplier management
- Customer management
- Purchasing
- Purchase returns
- Sales
- Sales returns
- Inventory tracking
- Stock adjustments
- Inventory movement history
- Barcode support
- Product image upload
- Business reports
- Report export
- Search, filtering, and pagination

### People Operations

- Employee management
- Department management
- Attendance
- Leave requests
- Payroll
- Performance reviews

### Administration

- JWT authentication
- Role-based access control
- Roles and permissions
- User management
- Profile management
- Application settings

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma

### Database
- PostgreSQL

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Traefik

### Documentation

Technical documentation is available in:
docs/

Start with:
docs/README.md

The documentation covers:
- project vision and roadmap
- requirements and user stories
- user flows and wireframes
- architecture
- database design
- API design
- coding standards
- Git workflow
- deployment
- architecture decision records

## Deployment

Production:
https://opsora.faizms.com

### Release

- Current stable release:
v1.2

- See:
docs/00-project/changelog.md
docs/00-project/roadmap.md