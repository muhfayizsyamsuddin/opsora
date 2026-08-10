# Product Requirements

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-10

---

# 1. Overview

Opsora is a web-based Business Operations Management System designed for small
and medium-sized businesses.

The system focuses on two major areas:

- Core Business Operations
- People Operations

Core Business Operations provides inventory, purchasing, sales, and reporting
capabilities.

People Operations provides employee and workforce management capabilities that
complement the core business.

---

# 2. Product Scope

## 2.1 Core Business Operations

The Core Business Operations scope includes:

- Authentication and access control
- Dashboard
- Product management
- Category management
- Supplier management
- Customer management
- Inventory management
- Purchase management
- Sales management
- Reports

## 2.2 People Operations

The People Operations scope includes:

- Employee management
- Department management
- Attendance management
- Leave management
- Performance review management

---

# 3. User Roles

Opsora supports the following primary roles.

## 3.1 Owner

The Owner is responsible for monitoring overall business performance.

Permissions include:

- View dashboard
- View reports
- View inventory
- View sales
- View purchases
- View business information

The Owner does not normally modify operational data.

---

## 3.2 Admin

The Admin is responsible for managing the system and operational data.

Permissions include:

- Manage users
- Manage products
- Manage categories
- Manage suppliers
- Manage customers
- Manage inventory
- Manage purchases
- Manage sales
- Manage employees
- Manage departments
- Manage attendance
- Manage leave
- Manage performance reviews
- View reports
- View dashboard

---

## 3.3 Staff

The Staff role is intended for daily operational activities.

Permissions may include:

- View products
- View inventory
- Create sales
- Create purchases
- Update operational records
- View customers
- View suppliers
- View assigned employee information

Staff cannot manage users or system-level configuration.

---

# 4. Functional Requirements

# 4.1 Authentication & Access

The system shall provide:

- User login
- User logout
- JWT-based authentication
- Role-based authorization
- Protected application routes
- Session handling
- Access control based on user role

---

# 4.2 Dashboard

The dashboard shall provide an overview of business operations.

The dashboard may include:

- Total employees
- Total departments
- Attendance summary
- Leave request summary
- Sales summary
- Purchase summary
- Inventory overview
- Recent activities
- Recent transactions
- Business performance indicators

Dashboard data must be retrieved from the relevant system modules.

---

# 4.3 Product Management

The system shall allow authorized users to manage products.

Features include:

- Create product
- View product
- Update product
- Delete product
- Product image
- SKU
- Barcode
- Product status
- Search products
- Filter products
- Pagination

Products may be associated with categories and inventory records.

---

# 4.4 Category Management

The system shall allow authorized users to manage product categories.

Features include:

- Create category
- View category
- Update category
- Delete category
- Search category
- View products within a category

---

# 4.5 Supplier Management

The system shall allow authorized users to manage suppliers.

Features include:

- Create supplier
- View supplier
- Update supplier
- Delete supplier
- Supplier contact information
- Search suppliers
- View supplier transaction history

---

# 4.6 Customer Management

The system shall allow authorized users to manage customers.

Features include:

- Create customer
- View customer
- Update customer
- Delete customer
- Customer contact information
- Search customers
- View customer transaction history

---

# 4.7 Inventory Management

Inventory management is one of the core capabilities of Opsora.

The system shall provide:

- Current stock information
- Stock movement
- Inventory history
- Stock increase
- Stock decrease
- Stock adjustment
- Inventory transaction records
- Product stock status
- Low stock indication

Inventory changes must be associated with the relevant business transaction
or adjustment.

---

# 4.8 Purchase Management

The system shall support purchasing activities.

Features include:

- Create purchase
- View purchase
- Update purchase
- Purchase details
- Supplier association
- Purchase items
- Purchase quantity
- Purchase price
- Purchase status
- Receive purchased goods
- Increase inventory after receiving goods
- Purchase history

---

# 4.9 Sales Management

The system shall support sales activities.

Features include:

- Create sales transaction
- View sales transaction
- Sales details
- Customer association
- Sales items
- Sales quantity
- Sales price
- Sales status
- Generate invoice information
- Reduce inventory after completed sales
- Sales history

---

# 4.10 Reports

The system shall provide operational reports.

Reports include:

- Daily report
- Monthly report
- Sales report
- Purchase report
- Inventory report

Reports should provide useful summaries and allow users to understand
business activity and inventory conditions.

Export functionality may be introduced in a future release.

---

# 4.11 Employee Management

People Operations shall allow authorized users to manage employees.

Features include:

- Create employee
- View employee
- Update employee
- Delete employee
- Employee information
- Employee status
- Department assignment
- Employee search
- Employee filtering
- Employee history

---

# 4.12 Department Management

The system shall allow authorized users to manage departments.

Features include:

- Create department
- View department
- Update department
- Delete department
- Department information
- Employee assignment
- Department employee list

---

# 4.13 Attendance Management

The system shall provide employee attendance management.

Features include:

- Record attendance
- View attendance
- Attendance status
- Attendance date
- Attendance history
- Employee attendance history
- Attendance summary

---

# 4.14 Leave Management

The system shall provide employee leave management.

Features include:

- Create leave request
- View leave request
- Update leave request
- Delete leave request
- Leave type
- Leave period
- Leave reason
- Leave status
- Leave history
- Leave approval status

---

# 4.15 Performance Review

The system shall provide employee performance review management.

Features include:

- Create performance review
- View performance review
- Update performance review
- Delete performance review
- Employee association
- Review period
- Performance score
- Review notes
- Review history

---

# 5. Business Rules

## Inventory

- Inventory quantities must remain consistent with completed inventory
  transactions.
- Purchase receiving increases available stock.
- Completed sales decrease available stock.
- Inventory adjustments must be recorded in inventory history.
- Negative stock should be prevented unless explicitly supported by business
  configuration.

## Purchases

- A purchase must contain one or more purchase items.
- Purchase items must reference valid products.
- Received purchases update inventory.

## Sales

- A sales transaction must contain one or more sales items.
- Sales items must reference valid products.
- Completed sales update inventory.
- Sales should not exceed available stock unless the system explicitly
  supports negative inventory.

## Employees

- An employee may belong to a department.
- Attendance records must reference an employee.
- Leave requests must reference an employee.
- Performance reviews must reference an employee.

---

# 6. Non-Functional Requirements

## 6.1 Performance

The system should:

- Provide responsive page interactions.
- Optimize database queries.
- Avoid unnecessary API requests.
- Support pagination for large datasets.

---

## 6.2 Security

The system shall provide:

- Secure authentication
- Password hashing
- JWT authentication
- Role-based authorization
- Protected API endpoints
- Protected application routes
- Input validation
- Secure handling of sensitive information

---

## 6.3 Scalability

The system should support future expansion through:

- Modular architecture
- RESTful API
- Clear domain separation
- Reusable components
- Database relationships designed for future growth

---

## 6.4 Maintainability

The codebase should follow:

- TypeScript
- Modular architecture
- Consistent folder structure
- Reusable components
- Clear naming conventions
- Separation of concerns
- Documented important business rules

---

## 6.5 Reliability

The system should:

- Preserve transaction history.
- Maintain consistent inventory data.
- Validate business transactions.
- Handle API failures gracefully.
- Provide meaningful error messages.

---

## 6.6 User Experience

The application should provide:

- Clean and consistent interface
- Responsive layout
- Clear navigation
- Consistent forms
- Clear validation messages
- Loading states
- Empty states
- Error states
- Confirmation for destructive actions

---

# 7. Technical Requirements

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Reusable UI components

## Backend

- Node.js
- TypeScript
- RESTful API
- JWT authentication

## Database

- PostgreSQL
- Prisma ORM

## Infrastructure

- Docker
- Docker Compose
- Nginx
- CI/CD pipeline

---

# 8. Deployment Requirements

The system should support deployment of:

- Web application
- Backend API
- PostgreSQL database

The deployment environment should provide:

- Environment configuration
- Secure secrets management
- Database connectivity
- Application health monitoring
- Production build

---

# 9. MVP Boundary

The first stable release prioritizes Core Business Operations.

MVP capabilities include:

- Authentication
- User and role management
- Products
- Categories
- Suppliers
- Customers
- Inventory
- Purchases
- Sales
- Dashboard
- Reports

People Operations is part of the broader Opsora product direction but is
delivered separately from the Core Business MVP.

---

# 10. Out of Scope

The following capabilities are outside the current product scope:

- Accounting system
- Payroll
- Multi-company
- Multi-currency
- Multi-warehouse
- Offline mode
- AI forecasting
- Email marketing
- E-commerce integration

These capabilities may be considered for future releases.

---

# 11. Future Requirements

Potential future capabilities include:

- Barcode scanner integration
- QR code support
- Multi-warehouse management
- Warehouse transfer
- Multi-company support
- Branch management
- Activity logs
- Audit trail
- Notification system
- Mobile application
- AI sales prediction
- Demand forecasting
- Accounting integration
- Public API

---

# 12. Success Criteria

The product requirements are considered successfully implemented when:

- Authentication works correctly.
- Role-based access control is enforced.
- Core business modules are operational.
- Inventory is updated correctly by business transactions.
- Purchase and sales transactions are recorded accurately.
- Dashboard information reflects operational data.
- Reports provide accurate business information.
- People Operations modules work consistently.
- The system can be built and deployed successfully.
- The application remains maintainable as new modules are introduced.

---

# 13. Related Documents

- [Vision](../00-project/vision.md)
- [Roadmap](../00-project/roadmap.md)
- [User Flow](./user-flow.md)
- [User Stories](./user-stories.md)
- [Wireframes](./wireframes.md)
- [Architecture](../02-design/architecture.md)
- [API Design](../02-design/api-design.md)
- [Data Dictionary](../02-design/data-dictionary.md)
- [ERD](../02-design/erd.md)

---

# Revision History

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 2026-07-27 | Initial requirements |
| 2.0 | 2026-08-10 | Aligned requirements with Core Business Operations and People Operations |