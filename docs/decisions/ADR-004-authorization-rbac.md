# ADR-004: Authorization and Role-Based Access Control

Status: Accepted

Date: 2026-08-11

Decision Owners: Opsora Engineering Team

---

# Context

Opsora requires authorization to control what authenticated users are
allowed to access and manage within the application.

Authentication determines who the user is.

Authorization determines what the authenticated user is allowed to do.

Opsora contains multiple business modules and different operational
responsibilities. Therefore, users must not automatically receive full
system access after authentication.

The system requires role-based access control across:

- Core Business Operations
- People Operations
- Reports
- User Management
- System Settings

---

# Decision

Opsora will use **Role-Based Access Control (RBAC)**.

Each authenticated user is assigned a role.

The role determines the modules and actions that the user is allowed
to access.

Authorization will be enforced by the backend API.

The frontend may hide unavailable menus and actions for better user
experience, but frontend restrictions must not be considered a security
boundary.

---

# Roles

Opsora will support the following roles:

- SUPER_ADMIN
- ADMIN
- MANAGER
- CASHIER

---

# Role Responsibilities

## SUPER_ADMIN

SUPER_ADMIN has full system access.

Responsibilities include:

- Manage users
- Manage roles and permissions
- Manage master data
- Manage business transactions
- Manage inventory
- Access all reports
- Manage system settings

---

## ADMIN

ADMIN manages operational data and business transactions.

Responsibilities include:

- Manage products
- Manage categories
- Manage suppliers
- Manage customers
- Manage purchases
- Manage sales
- Manage inventory
- Access reports
- Manage operational data

ADMIN does not have unrestricted system-level authority.

---

## MANAGER

MANAGER primarily monitors business operations and reports.

Responsibilities include:

- View products
- View categories
- View suppliers
- View customers
- View purchases
- View sales
- View inventory
- Access reports

MANAGER does not perform unrestricted CRUD operations on operational
master data.

---

## CASHIER

CASHIER is responsible primarily for sales operations.

Responsibilities include:

- View customers
- Manage customer information where permitted
- Create sales
- Process sales payments
- View relevant sales information

CASHIER does not manage products, suppliers, purchases, or inventory
adjustments.

---

# Authorization Matrix

| Module | SUPER_ADMIN | ADMIN | MANAGER | CASHIER |
| --- | :---: | :---: | :---: | :---: |
| Products | Full | Full | Read | None |
| Categories | Full | Full | Read | None |
| Suppliers | Full | Full | Read | None |
| Customers | Full | Full | Read | Full |
| Purchases | Full | Full | Read | None |
| Sales | Full | Full | Read | Full |
| Inventory | Full | Full | Read | None |
| Reports | Full | Full | Full | Read |

Legend:

- Full = Create, Read, Update, Delete or applicable operational actions
- Read = View information only
- None = No access

---

# Authorization Flow

    User
      ↓
    Login
      ↓
    JWT Authentication
      ↓
    Identify User
      ↓
    Read User Role
      ↓
    Authorization Middleware
      ↓
    Check Required Permission
      ↓
    ┌──────────────┐
    │              │
    Allowed       Denied
      │              │
      ▼              ▼
    Controller     403 Forbidden
      │
      ▼
    Service
      │
      ▼
    Database

---

# Backend Authorization

Authorization must be enforced on protected API endpoints.

Example:

    POST /api/v1/products

The backend checks:

1. Is the user authenticated?
2. What role does the user have?
3. Does the role have permission to create products?
4. If allowed, continue to the controller.
5. If denied, return HTTP 403 Forbidden.

---

# Authentication vs Authorization

Authentication:

    Who is the user?

Authorization:

    What can the user do?

The two responsibilities must remain separate.

Example:

    JWT
     ↓
    Authentication
     ↓
    User = ADMIN
     ↓
    Authorization
     ↓
    Can ADMIN create products?
     ↓
    Yes
     ↓
    Allow Request

---

# Frontend Authorization

The frontend should use the authenticated user's role to control the
visibility of:

- Sidebar menus
- Navigation items
- Action buttons
- Create buttons
- Edit buttons
- Delete buttons
- Operational actions

Example:

    ADMIN
      ↓
    Products
      ↓
    Show Add / Edit / Delete

    MANAGER
      ↓
    Products
      ↓
    Show View Only

Frontend authorization improves usability but does not replace backend
authorization.

---

# Forbidden Access

When an authenticated user attempts to access a resource that their role
does not permit, the API must return:

    HTTP 403 Forbidden

The response must not expose sensitive internal authorization details.

Example:

    {
      "success": false,
      "message": "Forbidden"
    }

---

# Unauthenticated Access

If a request does not contain valid authentication credentials, the API
must return:

    HTTP 401 Unauthorized

Authentication must be checked before authorization.

---

# Permission Checking

Authorization logic should be centralized in middleware or a dedicated
authorization layer.

Controllers should not contain repeated role-checking logic.

Example concept:

    authenticate()
        ↓
    authorize("PRODUCT_CREATE")
        ↓
    productController.create()

This keeps authorization consistent across the API.

---

# Role Assignment

A user must have one assigned role.

The role must be stored as part of the user's authorization data.

Example:

    User
      ↓
    role
      ↓
    ADMIN

Role changes must be restricted to users with appropriate authority.

---

# Security Requirements

The authorization implementation must:

- Never trust role information supplied by the frontend.
- Never rely only on hidden frontend menus.
- Validate authorization on the backend.
- Return 401 for unauthenticated requests.
- Return 403 for authenticated but unauthorized requests.
- Centralize authorization rules.
- Prevent users from modifying their own role unless explicitly allowed.
- Protect administrative functions from unauthorized users.
- Keep authorization logic consistent across all API modules.

---

# Alternatives Considered

## Permission-Based Access Control Only

Advantages:

- Highly flexible.
- Fine-grained permissions.

Disadvantages:

- More complex to manage for the MVP.
- Requires more permission configuration.
- More difficult to maintain during initial development.

---

## Attribute-Based Access Control

Advantages:

- Supports complex authorization rules.
- Can evaluate multiple user and resource attributes.

Disadvantages:

- Higher implementation complexity.
- Not required for the current business requirements.
- More difficult to maintain for the MVP.

---

## Role-Based Access Control

RBAC was selected because it:

- Matches the defined Opsora user roles.
- Is simple to understand.
- Is easy to maintain.
- Works well with the current module structure.
- Provides sufficient authorization control for the MVP.

---

# Consequences

## Positive

- Clear separation of responsibilities.
- Centralized access control.
- Easier frontend navigation control.
- Consistent backend authorization.
- Simple role management for the MVP.
- Reduced risk of unauthorized operations.

## Negative

- Role-based rules can become complex as the application grows.
- Some future business requirements may require more granular permissions.
- Changing role definitions may require updates across authorization
  configuration.

---

# Future Improvements

Possible future improvements include:

- Fine-grained permissions
- Permission groups
- Custom roles
- Resource-level permissions
- Department-based authorization
- Approval workflows
- Audit logs for permission changes
- Attribute-Based Access Control where required

These improvements are outside the current MVP scope.

---

# Related Documents

- requirements.md
- user-stories.md
- user-flow.md
- data-dictionary.md
- api-design.md
- architecture.md
- coding-standards.md
- git-workflow.md
- deployment.md

---

# Revision History

| Version | Date | Description |
| --- | --- | --- |
| 1.0 | 2026-08-11 | Initial authorization and RBAC decision |