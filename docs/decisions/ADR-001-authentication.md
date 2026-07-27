# ADR-001: Authentication Strategy

Status: Accepted

Date: 2026-07-27

Decision Makers:
- Project Team

---

# Context

Opsora requires secure authentication and role-based authorization.

The authentication mechanism must:

- Support multiple user roles.
- Be simple to implement.
- Work well with REST APIs.
- Be compatible with Next.js frontend.
- Be easy to deploy.

---

# Decision

The project will use:

- JSON Web Token (JWT)
- Bearer Authentication
- Role-Based Access Control (RBAC)

The backend issues an access token after successful login.

The frontend stores the token securely and includes it in every authenticated request.

---

# Consequences

Advantages

- Stateless authentication.
- Easy horizontal scaling.
- Widely supported.
- Simple integration.

Disadvantages

- Token revocation is harder.
- Token expiration must be handled properly.
- Requires HTTPS in production.

---

# Alternatives Considered

Session Authentication

Rejected because:

- Requires server-side session storage.
- Less suitable for REST APIs.

OAuth Only

Rejected because:

- Adds unnecessary complexity for MVP.

---

# Related Documents

- api-design.md
- architecture.md