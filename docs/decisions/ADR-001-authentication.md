# ADR-001: Authentication Strategy

Status: Accepted

Date: 2026-08-11

Decision Owners: Opsora Engineering Team

---

# Context

Opsora requires authentication to protect application resources and ensure
that only authenticated users can access the system.

The system supports multiple user roles and authorization levels across
Core Business Operations and People Operations.

Authentication must support:

- User login
- User logout
- Session management
- Protected API endpoints
- Role-Based Access Control (RBAC)
- Secure authentication between the frontend and backend

Opsora uses a separate frontend and backend architecture:

    Next.js Frontend
           ↓
    Express.js API
           ↓
    PostgreSQL

---

# Decision

Opsora will use **JSON Web Token (JWT)** based authentication.

The backend authenticates the user's credentials and issues an access
token after successful authentication.

Protected API requests must provide the token using:

    Authorization: Bearer <access_token>

---

# Authentication Flow

    User
      ↓
    Login Page
      ↓
    Enter Email & Password
      ↓
    POST /api/v1/auth/login
      ↓
    Validate Credentials
      ↓
    ┌─────────────┐
    │             │
    Invalid      Valid
      │             │
      ▼             ▼
    Error       Generate JWT
                    │
                    ▼
               Return Token
                    │
                    ▼
            Authenticated Request
                    │
                    ▼
          JWT Authentication
                    │
                    ▼
          Authorization / RBAC
                    │
                    ▼
              API Resource

---

# Authentication Responsibilities

## Frontend

The frontend is responsible for:

- Providing the login interface.
- Sending login credentials to the API.
- Handling authentication state.
- Sending authenticated API requests.
- Redirecting unauthenticated users to the login page.
- Clearing client-side authentication state during logout.

## Backend

The backend is responsible for:

- Validating credentials.
- Verifying passwords.
- Generating JWT access tokens.
- Validating JWT tokens.
- Rejecting expired or invalid tokens.
- Providing authenticated user information.
- Enforcing authorization rules.

---

# Password Security

Passwords must never be stored as plain text.

Passwords must be securely hashed before being stored in PostgreSQL.

Authentication failures must not reveal whether a specific email address
or password was incorrect.

---

# JWT

JWT is used as the authentication mechanism for protected API requests.

The token should contain only the information required to identify the
authenticated user and support authorization.

Sensitive information must not be stored inside the JWT payload.

Example:

    {
      "sub": "user-id",
      "role": "ADMIN"
    }

---

# Token Expiration

JWT access tokens must have an expiration time.

Configuration:

    JWT_EXPIRES_IN=

Expired tokens must be rejected by the authentication middleware.

---

# Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What is the user allowed to do?

Opsora uses Role-Based Access Control (RBAC).

    JWT
     ↓
    Authenticated User
     ↓
    Role / Permission
     ↓
    Authorization Check
     ↓
    Resource Access

---

# Roles

The application supports:

- SUPER_ADMIN
- OWNER
- ADMIN
- MANAGER
- STAFF
- CASHIER

Role responsibilities and module permissions are defined in the system
requirements and API authorization documentation.

---

# Protected Resources

API resources that require authentication must be protected by
authentication middleware.

Examples:

    POST /api/v1/products
    GET  /api/v1/inventory
    POST /api/v1/sales
    GET  /api/v1/reports

---

# Logout

Logout clears the authentication state on the client.

The client removes the active authentication token/session information
and redirects the user to the login page.

Because JWT access tokens are stateless, server-side invalidation is not
required for the basic MVP implementation.

---

# API Authentication Middleware

Protected requests should pass through authentication middleware.

    HTTP Request
         ↓
    Authentication Middleware
         ↓
    Validate JWT
         ↓
    Extract User
         ↓
    Authorization Middleware
         ↓
    Controller

Controllers should not implement JWT verification directly.

---

# Security Requirements

The authentication implementation must:

- Never store plain-text passwords.
- Never log passwords.
- Never log JWT tokens.
- Never expose JWT secrets.
- Reject expired tokens.
- Reject malformed tokens.
- Reject invalid signatures.
- Protect private API endpoints.
- Validate authentication before authorization.
- Use HTTPS in production.
- Store secrets in environment variables.

---

# Environment Variables

    JWT_SECRET=
    JWT_EXPIRES_IN=

Real secret values must never be committed to Git.

---

# Alternatives Considered

## Session-Based Authentication

Advantages:

- Server-side session control.
- Easy token revocation.

Disadvantages:

- Requires server-side session storage.
- Adds additional infrastructure.
- Less aligned with the planned stateless REST API architecture.

## OAuth / Social Login

Advantages:

- External identity management.
- Convenient social authentication.

Disadvantages:

- Additional provider configuration.
- Additional MVP complexity.
- Not required by current business requirements.

## JWT

JWT was selected because it:

- Fits the REST API architecture.
- Works with the Next.js frontend and Express backend.
- Supports stateless API authentication.
- Integrates with RBAC.
- Avoids server-side session storage for the MVP.

---

# Consequences

## Positive

- Stateless authentication.
- Suitable for REST APIs.
- Clear separation between authentication and authorization.
- Works with the planned frontend/backend architecture.

## Negative

- JWT access tokens are difficult to revoke immediately without
  additional infrastructure.
- Token management must be implemented carefully.
- Token expiration and security configuration require attention.

---

# Future Improvements

Possible future authentication features:

- Refresh tokens
- Token rotation
- Token revocation
- Multi-factor authentication
- Password reset
- Email verification
- Login activity tracking
- Audit logs
- Single Sign-On (SSO)

These are outside the current MVP scope.

---

# Related Documents

- requirements.md
- user-stories.md
- user-flow.md
- api-design.md
- architecture.md
- coding-standards.md
- data-dictionary.md

---

# Revision History

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 2026-08-11 | Initial authentication decision |