# ADR-003: File Upload Strategy

Status: Accepted

Date: 2026-07-27

---

# Context

Products require image uploads.

Images should not be stored directly in PostgreSQL.

---

# Decision

Use Cloudinary.

Only store:

image_url

inside PostgreSQL.

---

# Consequences

Advantages

- CDN delivery.
- Image optimization.
- Automatic resizing.
- Reduced server storage.

Disadvantages

- External dependency.
- Free tier limitations.

---

# Alternatives

Local Storage

Rejected because:

- Harder deployment.
- Poor scalability.

Amazon S3

Rejected because:

- More setup for MVP.