# API Design

Version: 1.0

Status: Draft

Author: Faiz

Last Updated: 2026-07-27

---

# Overview

This document defines the REST API design for Opsora.

It includes:

- API conventions
- Authentication
- Request/Response format
- Error handling
- Endpoint specifications
- Validation rules

This document serves as the implementation reference for the backend.

## 2. API Standards
## Base URL

/api/v1

---

## Data Format

JSON

---

## Authentication

Bearer Token (JWT)

Authorization: Bearer <access_token>

---

## Time Format

ISO 8601

Example

2026-07-27T08:00:00Z

## 3. Authentication

## 4. Response Standards

## 5. Error Handling
| HTTP | Meaning |
|-------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Business Rule Violation |
| 500 | Internal Server Error |

---

## 6. Authorization Matrix

| Module | Super Admin | Admin | Manager | Cashier |
|----------|:----------:|:-----:|:-------:|:-------:|
| Products | ✅ | ✅ | 👀 | ❌ |
| Categories | ✅ | ✅ | 👀 | ❌ |
| Suppliers | ✅ | ✅ | 👀 | ❌ |
| Customers | ✅ | ✅ | 👀 | ✅ |
| Purchases | ✅ | ✅ | 👀 | ❌ |
| Sales | ✅ | ✅ | 👀 | ✅ |
| Inventory | ✅ | ✅ | 👀 | ❌ |
| Reports | ✅ | ✅ | ✅ | 👀 |

Legenda:

- ✅ Full Access
- 👀 Read Only
- ❌ No Access

Dengan satu tabel ini, kita tidak perlu mengulang aturan role di setiap endpoint.

---

## 7. Modules

1. Authentication
Base URL

/api/v1/auth

| Method| Endpoint  | Description                   |
|-------|---------- |-------------                  |
| POST  | /login    | Authenticate user             |
| POST  | /logout   | Logout current user           |
| GET   | /me       | Get current authenticated user|
2. Users
3. Categories

Base URL

/api/v1/categories

| Method| Endpoint  | Description |
|-------|---------- |-------------|
| GET   | /         | List categories |
| GET   | /:id      | Category detail |
| POST  | /         | Create category |
| PUT   | /:id      | Update category |
| DELETE| /:id      | Soft delete category |
4. Products

Base URL

/api/v1/products

| Method| Endpoint  | Description |
|-------|---------- |-------------|
| GET   | /         | List products |
| GET   | /:id      | Product detail |
| POST  | /         | Create product |
| PUT   | /:id      | Update product |
| DELETE| /:id      | Soft delete product |
| POST  | /:id/image| Upload product image |
5. Suppliers

GET    /
GET    /:id
POST   /
PUT    /:id
DELETE /:id
6. Customers

GET    /
GET    /:id
POST   /
PUT    /:id
DELETE /:id
7. Purchases

GET    /
GET    /:id
POST   /
PUT    /:id
POST   /:id/complete
POST   /:id/cancel
8. Sales

GET    /
GET    /:id
POST   /
PUT    /:id
POST   /:id/pay
POST   /:id/void
9. Inventory

GET /stock
GET /movements
GET /movements/:id
POST /adjustments
10. Reports

GET /sales
GET /purchases
GET /inventory
GET /dashboard

## 8. API Versioning

Current Version

v1

Base URL

/api/v1

Breaking changes

Future versions will use:

/api/v2

## 9. Related Documents

## 10. Revision History