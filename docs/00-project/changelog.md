# Changelog

All notable changes to this project will be documented in this file.

This project follows:

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

---

# [Unreleased]

No changes yet.

---

# [1.2.0] - 2026-09-02

## Added

- People Operations modules:
  - Employees
  - Departments
  - Attendance
  - Leave
  - Performance Reviews
  - Payroll
- System Administration modules:
  - Users
  - Roles
  - Permissions
  - Settings
- Refresh token rotation and reuse detection.
- Product image upload support.
- Barcode support.
- Inventory stock adjustments.
- Purchase return management.
- Sales return management.
- CSV export for business reports.
- Search, advanced filtering, and pagination improvements.
- Inventory transaction history with purchase and sales return references.

## Changed

- Product vision aligned with Opsora as a Business Operations Management
  System.
- Product direction separated into Core Business Operations, People Operations,
  and System Administration.
- Product roadmap updated to reflect completed People Operations work.
- Product requirements updated to include Payroll in the implemented scope.
- Authorization aligned with permission-based RBAC across protected modules.
- User deactivation now preserves historical records instead of deleting users.
- Employee deactivation preserves historical People Operations data.
- Sales, purchase, and profit reports now use net amounts after completed returns.
- Dashboard sales and purchase totals now account for completed returns.

## Fixed

- Hardened authentication and session handling for inactive users.
- Prevented refresh-token rotation race conditions.
- Improved validation and business-rule enforcement across audited modules.
- Cleaned legacy permission naming and React Compiler lint warnings.

## Security

- Enforced inactive-account rejection on authenticated and RBAC-protected routes.
- Added refresh-token reuse detection and active-session revocation.
- Improved authorization checks across Administration and People Operations.

---

# [1.0.0] - TBD

## Added

### Project

- Initial project structure.
- Complete technical documentation.
- Repository standards.
- Engineering guidelines.

### Authentication

- JWT authentication.
- Role-Based Access Control (RBAC).

### Master Data

- User management.
- Category management.
- Product management.
- Supplier management.
- Customer management.

### Inventory

- Inventory tracking.
- Inventory movement history.
- Low stock monitoring.

### Transactions

- Purchase management.
- Sales management.

### Dashboard

- Sales summary.
- Inventory summary.
- Recent transactions.

### Reports

- Sales reports.
- Purchase reports.
- Inventory reports.

---

# [0.2.0] - Documentation Phase

## Added

### Planning

- Requirements
- User Stories
- User Flow
- Wireframe

### Design

- ERD
- Data Dictionary
- API Design
- System Architecture

### Engineering

- Coding Standards
- Git Workflow

### Operations

- Deployment Guide

### Architecture Decision Records

- Authentication Strategy
- Database Technology
- File Upload Strategy

---

# [0.1.0] - Project Initialization

## Added

- Repository created.
- Initial project planning.
- Documentation structure.
- Folder organization.
- Roadmap.
- Vision.
- README.

---

# Release Types

The project uses Semantic Versioning.

MAJOR

Breaking changes.

Example:

2.0.0

---

MINOR

Backward-compatible new features.

Example:

1.1.0

---

PATCH

Backward-compatible bug fixes.

Example:

1.0.1

---

# Change Categories

The following categories are used throughout this changelog.

## Added

New features.

## Changed

Existing functionality updated.

## Deprecated

Features scheduled for removal.

## Removed

Removed functionality.

## Fixed

Bug fixes.

## Security

Security improvements.

---

# Versioning Policy

Major releases

- Breaking API changes
- Significant architecture changes

Minor releases

- New modules
- New endpoints
- Additional business features

Patch releases

- Bug fixes
- Documentation improvements
- Performance improvements

---

# Related Documents

- roadmap.md
- deployment.md
- git-workflow.md

---

# Revision History

| Version | Date | Description |
|----------|------------|-------------|
| 1.0 | 2026-07-27 | Initial version |