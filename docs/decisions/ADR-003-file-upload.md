# ADR-003: File Upload and Storage Strategy

Status: Accepted

Date: 2026-08-11

Decision Owners: Opsora Engineering Team

---

# Context

Opsora requires file storage for application assets, primarily product
images.

The system must support:

- Product image upload
- Image storage
- Image URL storage
- Image retrieval
- Secure file handling
- Integration with the Next.js frontend and Express.js backend

The selected architecture separates the application frontend, backend,
database, and file storage.

    Next.js Frontend
           ↓
    Express.js API
           ↓
    Cloudinary
           ↓
    Image URL
           ↓
    PostgreSQL

Storing image binary data directly inside PostgreSQL is not preferred for
the current application architecture.

---

# Decision

Opsora will use **Cloudinary** as the primary file and image storage
service.

The Express.js backend will handle upload requests and communicate with
Cloudinary.

The database will store the resulting Cloudinary URL and related file
metadata rather than storing the image binary itself.

---

# File Upload Flow

    User
      ↓
    Select Product Image
      ↓
    Next.js Frontend
      ↓
    Express.js API
      ↓
    Validate File
      ↓
    Upload to Cloudinary
      ↓
    Cloudinary
      ↓
    Return Image URL
      ↓
    Save URL to PostgreSQL
      ↓
    Product Record Updated

---

# Responsibilities

## Frontend

The frontend is responsible for:

- Providing the image upload interface.
- Allowing the user to select an image.
- Displaying upload progress when applicable.
- Displaying validation errors.
- Displaying the uploaded image preview.
- Sending the selected file to the backend.

## Backend

The backend is responsible for:

- Authenticating the request.
- Authorizing the user.
- Validating the uploaded file.
- Validating file type.
- Validating file size.
- Uploading the file to Cloudinary.
- Handling Cloudinary errors.
- Returning the resulting file URL.
- Saving the file reference to the database.

## Cloudinary

Cloudinary is responsible for:

- File storage.
- Image delivery.
- Image URL generation.
- Image transformation and optimization when required.

## PostgreSQL

PostgreSQL stores references to uploaded files.

For product images, the database stores:

- Image URL
- Related product reference
- Relevant file metadata when required

The database does not store the image binary itself.

---

# Supported File Types

The initial MVP should support common product image formats:

- JPEG
- PNG
- WebP

Other file types are outside the initial MVP scope unless explicitly
required.

---

# File Validation

Every upload must be validated before being stored.

Validation must include:

- File exists.
- File type is allowed.
- MIME type is valid.
- File size is within the configured limit.
- User has permission to upload the file.

Invalid uploads must be rejected before being stored.

---

# File Size

The maximum upload size must be configurable through environment
variables.

Example:

    MAX_UPLOAD_SIZE=

The application should reject files exceeding the configured limit.

---

# File Naming

Application-generated file identifiers should be used instead of relying
on the original filename.

The original filename must not be trusted as a unique identifier.

Cloudinary should manage the final stored asset identifier.

---

# Product Image Storage

The product entity may store an image URL.

Example:

    image_url

The URL points to the corresponding Cloudinary asset.

The application should not assume that the original local filename is the
permanent file identifier.

---

# Image Replacement

When a product image is replaced:

    Existing Image
          ↓
    Upload New Image
          ↓
    Update Product
          ↓
    New Image URL

The previous Cloudinary asset should be removed when it is no longer
required and when safe deletion can be confirmed.

The database must always reference the currently active image.

---

# Image Deletion

When a master record containing an image is deleted or its image is
replaced, the related Cloudinary asset should be considered for deletion.

Deletion must not leave the database pointing to an invalid active image.

Soft-deleted master records should not automatically cause destructive
file deletion unless the application has confirmed that the asset is no
longer required.

---

# Security Requirements

The file upload implementation must:

- Require authentication for protected uploads.
- Enforce authorization.
- Validate MIME type.
- Validate file size.
- Reject unsupported file types.
- Never trust the original filename.
- Never expose Cloudinary secrets to the frontend.
- Store Cloudinary credentials in environment variables.
- Never log sensitive credentials.
- Prevent unauthorized file replacement or deletion.

---

# Environment Variables

Cloudinary configuration must be stored in environment variables.

    CLOUDINARY_URL=

Real credentials must never be committed to Git.

---

# API Endpoint

Product image uploads are handled through the product API.

Example:

    POST /api/v1/products/:id/image

The endpoint must:

1. Authenticate the user.
2. Check authorization.
3. Validate the product.
4. Validate the uploaded file.
5. Upload the file to Cloudinary.
6. Save the resulting image reference.
7. Return the updated product information.

---

# Error Handling

The API should return an appropriate error when:

- No file is provided.
- The file type is unsupported.
- The file is too large.
- The product does not exist.
- The user does not have permission.
- Cloudinary upload fails.
- Database update fails.

The backend must not expose internal Cloudinary credentials or
implementation details in error responses.

---

# Alternatives Considered

## Local File Storage

Advantages:

- Simple for local development.
- No external storage provider required.

Disadvantages:

- Difficult to scale across multiple application instances.
- Requires persistent storage management.
- More complicated deployment.
- Not ideal for production asset delivery.

---

## PostgreSQL Binary Storage

Advantages:

- Files and application data can be stored together.
- Database backup can include the stored files.

Disadvantages:

- Increases database size significantly.
- Can negatively affect database performance.
- Less suitable for image delivery and transformation.
- Adds unnecessary database storage overhead.

---

## Amazon S3

Advantages:

- Highly scalable object storage.
- Widely adopted.
- Flexible storage architecture.

Disadvantages:

- Requires additional AWS configuration.
- More infrastructure and configuration for the MVP.
- Cloudinary provides more image-specific functionality for the current
  requirements.

---

## Cloudinary

Cloudinary was selected because it:

- Provides dedicated image and media storage.
- Supports image delivery.
- Provides image transformation capabilities.
- Integrates well with web applications.
- Reduces the need to manage file infrastructure directly.
- Fits the current Opsora MVP requirements.

---

# Consequences

## Positive

- Images are separated from the primary database.
- Reduced PostgreSQL storage requirements.
- Dedicated image delivery infrastructure.
- Easier image transformation and optimization.
- Suitable for the current Next.js and Express.js architecture.

## Negative

- Introduces an external service dependency.
- Requires Cloudinary configuration.
- Requires network access for file operations.
- Storage and bandwidth may introduce external service costs.

---

# Future Improvements

Possible future improvements include:

- Direct browser-to-Cloudinary uploads using signed uploads.
- Automatic image optimization.
- Multiple product images.
- Image thumbnails.
- Image deletion jobs.
- Upload retry mechanisms.
- CDN optimization.
- Additional file storage providers.

These improvements are outside the current MVP scope.

---

# Related Documents

- requirements.md
- user-stories.md
- user-flow.md
- wireframes.md
- data-dictionary.md
- api-design.md
- architecture.md
- deployment.md
- coding-standards.md

---

# Revision History

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 2026-08-11 | Initial file upload and storage decision |