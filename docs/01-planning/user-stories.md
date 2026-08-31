# User Stories

Version: 1.1

Project: Opsora

Last Updated: 2026-09-01

---

# Overview

This document describes the functional needs of Opsora users using User Stories.

User Stories are organized according to the two major areas of Opsora:

- Core Business Operations
- People Operations

Format:

> As a [user],
> I want [capability],
> So that [benefit].

---

# User Roles

| Role | Description |
| --- | --- |
| Super Admin | Manages users, roles, permissions, and system-level configuration. |
| Owner | Monitors overall business performance and operational information. |
| Manager | Monitors and supervises business and people operations. |
| Admin | Manages business data and operational activities. |
| Staff | Performs authorized daily operational activities. |
| Cashier | Handles sales transactions and related customer operations. |

---

# Epic 1: Authentication & Access

## US-001 Login

**As a** user

**I want** to log in using my email and password

**So that** I can securely access the system.

### Acceptance Criteria

- User can enter email and password.
- Valid credentials allow access to the application.
- Invalid credentials display an error message.
- Authentication state is established after successful login.
- User is redirected to the dashboard after successful login.
- Access is restricted according to the user's role.

---

## US-002 Logout

**As a** user

**I want** to log out

**So that** my authenticated session cannot be used by others.

### Acceptance Criteria

- User can log out from the application.
- Client authentication state is cleared.
- User is redirected to the login page.
- Protected pages cannot be accessed after logout.

---

# Epic 2: Dashboard

## US-003 View Dashboard

**As a** user

**I want** to see an overview of business operations

**So that** I can quickly understand current business activity.

### Acceptance Criteria

Dashboard may display:

- Sales summary
- Purchase summary
- Inventory overview
- Low stock products
- Recent transactions
- Employee summary
- Attendance summary
- Leave summary

The displayed information must reflect current system data.

---

# Epic 3: Category Management

## US-004 Create Category

**As an** Admin

**I want** to create a product category

**So that** products can be organized properly.

### Acceptance Criteria

- Category name is required.
- Category name must be unique.
- Successful creation displays the new category.

---

## US-005 Update Category

**As an** Admin

**I want** to update a category

**So that** category information remains accurate.

### Acceptance Criteria

- Admin can update category information.
- Category name must remain unique.
- Invalid data is rejected.

---

## US-006 Delete Category

**As an** Admin

**I want** to delete a category

**So that** unused categories can be removed.

### Acceptance Criteria

- Category can be deleted when it is not associated with products.
- Category with existing products cannot be deleted.
- System displays an appropriate error when deletion is not allowed.

---

# Epic 4: Product Management

## US-007 Create Product

**As an** Admin

**I want** to create a product

**So that** the product can be managed in inventory.

### Acceptance Criteria

Product information includes:

- Name
- SKU
- Category
- Purchase price
- Selling price
- Unit
- Barcode
- Product image

Required fields must be validated before saving.

---

## US-008 Update Product

**As an** Admin

**I want** to update product information

**So that** product data remains accurate.

### Acceptance Criteria

- Admin can update product information.
- SKU uniqueness is maintained.
- Invalid data is rejected.

---

## US-009 Delete Product

**As an** Admin

**I want** to remove a product

**So that** discontinued products no longer appear as active products.

### Acceptance Criteria

- Product deletion follows the system's deletion policy.
- Products referenced by business transactions cannot be permanently removed.
- Historical transaction records remain intact.

---

## US-010 Search Product

**As a** user

**I want** to search products

**So that** I can quickly find a product.

### Acceptance Criteria

Products can be searched by:

- Name
- SKU
- Barcode

---

## US-011 Filter Products

**As a** user

**I want** to filter products

**So that** I can find products matching specific conditions.

### Acceptance Criteria

Products can be filtered by:

- Category
- Stock status

---

# Epic 5: Supplier Management

## US-012 Create Supplier

**As an** Admin

**I want** to create a supplier

**So that** supplier information can be used in purchasing.

### Acceptance Criteria

Supplier information includes:

- Name
- Phone
- Email
- Address

---

## US-013 Update Supplier

**As an** Admin

**I want** to update supplier information

**So that** supplier records remain accurate.

---

## US-014 Delete Supplier

**As an** Admin

**I want** to remove an unused supplier

**So that** supplier data remains clean.

### Acceptance Criteria

- Supplier with purchase history cannot be permanently removed.
- Historical purchase records remain intact.

---

# Epic 6: Customer Management

## US-015 Create Customer

**As an** Admin or Staff

**I want** to create a customer

**So that** customer information can be associated with sales.

### Acceptance Criteria

Customer information includes:

- Name
- Phone
- Email
- Address

---

## US-016 Update Customer

**As an** Admin or Staff

**I want** to update customer information

**So that** customer records remain accurate.

---

## US-017 Delete Customer

**As an** Admin

**I want** to remove an unused customer

**So that** customer data remains clean.

### Acceptance Criteria

- Customer with sales history cannot be permanently removed.
- Historical sales records remain intact.

---

# Epic 7: Purchase Management

## US-018 Create Purchase

**As an** Admin or Staff

**I want** to record a purchase

**So that** incoming goods can be tracked.

### Acceptance Criteria

A purchase includes:

- Supplier
- Products
- Quantities
- Purchase prices
- Purchase date

The purchase must contain at least one product.

---

## US-019 Receive Purchase

**As an** Admin or Staff

**I want** to receive purchased goods

**So that** received quantities are added to inventory.

### Acceptance Criteria

- Received products update inventory quantities.
- Inventory movement is created.
- Purchase status is updated accordingly.
- Receiving cannot process invalid quantities.

---

## US-020 View Purchase History

**As a** user

**I want** to view purchase history

**So that** I can track previous purchases.

### Acceptance Criteria

Purchase history supports:

- Search
- Pagination
- Date filtering
- Supplier filtering

---

# Epic 8: Sales Management

## US-021 Create Sale

**As a** Cashier or Staff

**I want** to record a sale

**So that** customer purchases can be processed.

### Acceptance Criteria

A sale includes:

- Customer
- Products
- Quantities
- Selling prices

The system must:

- Validate product availability.
- Calculate the transaction total.
- Prevent sales exceeding available stock.
- Reduce inventory after a completed sale.
- Create an inventory movement record.

---

## US-022 View Sales History

**As a** user

**I want** to view sales history

**So that** I can track previous sales transactions.

### Acceptance Criteria

Sales history supports:

- Search
- Pagination
- Date filtering
- Customer filtering

---

# Epic 9: Inventory Management

## US-023 View Inventory

**As a** user

**I want** to view current inventory

**So that** I know how much stock is available.

### Acceptance Criteria

Inventory displays:

- Product
- Current stock
- Minimum stock
- Stock status

---

## US-024 Adjust Stock

**As an** Admin

**I want** to adjust stock

**So that** inventory records can be corrected when necessary.

### Acceptance Criteria

An adjustment requires:

- Adjustment type
- Quantity
- Reason

The system must:

- Update inventory.
- Create an inventory movement.
- Preserve the adjustment history.

---

## US-025 View Stock Movement

**As a** user

**I want** to view stock movements

**So that** I can understand how inventory changed.

### Acceptance Criteria

Movement history records relevant inventory events such as:

- Purchase receiving
- Sale
- Stock adjustment

---

# Epic 10: Reports

## US-026 View Sales Report

**As an** Owner, Manager, or authorized Admin

**I want** to view reports

**So that** I can monitor business performance and operational activity.

### Acceptance Criteria

Sales reports support:

- Daily filtering
- Monthly filtering
- Date range filtering

---

## US-027 View Purchase Report

**As an** Owner or Admin

**I want** to view purchase reports

**So that** I can understand purchasing activity.

### Acceptance Criteria

Purchase reports support:

- Date filtering
- Supplier filtering

---

## US-028 View Inventory Report

**As an** Owner or Admin

**I want** to view inventory reports

**So that** I can monitor stock conditions.

### Acceptance Criteria

Inventory reports display relevant information such as:

- Inventory quantity
- Low stock products
- Stock value

---

# Epic 11: Employee Management

## US-033 Create Employee

**As an** Admin

**I want** to create employee records

**So that** employee information can be managed in Opsora.

### Acceptance Criteria

- Employee name is required
- Employee number must be unique
- Department is required
- Position is required
- Contact information can be recorded
- Employee status can be set
- Employee record is saved successfully

---

## US-034 Edit Employee

**As an** Admin

**I want** to update employee information

**So that** employee records remain accurate.

### Acceptance Criteria

- Update employee information
- Change department
- Change position
- Update contact information
- Update employee status
- Changes are validated before saving

---

## US-035 View Employee

**As a** Manager

**I want** to view employee information

**So that** I can monitor my team.

### Acceptance Criteria

- View employee list
- Search employees
- Filter employees
- View employee details
- View department
- View employee status

---

## US-036 Delete Employee

**As an** Admin

**I want** to remove an employee record

**So that** inactive employee records can be managed.

### Acceptance Criteria

- Employee records should use soft delete or inactive status
- Employee with existing operational history should not be permanently deleted
- Deleted or inactive employees should not appear in active employee lists

---

# Epic 12: Department Management

## US-037 Create Department

**As an** Admin

**I want** to create departments

**So that** employees can be organized into business units.

### Acceptance Criteria

- Department name is required
- Department name must be unique
- Department description can be added
- Department is saved successfully

---

## US-038 Edit Department

**As an** Admin

**I want** to update department information

**So that** the organizational structure remains accurate.

### Acceptance Criteria

- Update department name
- Update department description
- Department name must remain unique
- Changes are validated before saving

---

## US-039 View Department

**As a** Manager

**I want** to view department information

**So that** I can understand the organizational structure.

### Acceptance Criteria

- View department list
- Search departments
- View department details
- View employees assigned to a department
- View department status

---

## US-040 Delete Department

**As an** Admin

**I want** to remove an unused department

**So that** outdated organizational data can be managed.

### Acceptance Criteria

- Department cannot be deleted if employees are assigned to it
- Department with existing operational history should not be permanently deleted
- Deleted or inactive departments should not appear in active department lists

---

# Epic 13: Attendance Management

## US-041 Record Attendance

**As a** Staff

**I want** to record my attendance

**So that** my daily attendance is recorded in the system.

### Acceptance Criteria

- Employee is identified from the authenticated user
- Attendance date is recorded
- Attendance status is required
- Attendance record is saved successfully
- Duplicate attendance for the same employee and date is prevented

---

## US-042 View Own Attendance

**As a** Staff

**I want** to view my attendance history

**So that** I can monitor my attendance records.

### Acceptance Criteria

- View attendance history
- Filter by date
- View attendance status
- View attendance details

---

## US-043 Monitor Team Attendance

**As a** Manager

**I want** to view team attendance

**So that** I can monitor employee attendance.

### Acceptance Criteria

- View attendance of assigned employees
- Filter by date
- Filter by attendance status
- Search employees
- View attendance history

---

## US-044 Manage Attendance Records

**As an** Admin

**I want** to manage attendance records

**So that** attendance data remains accurate.

### Acceptance Criteria

- View all attendance records
- Search attendance records
- Filter by employee
- Filter by date
- Filter by attendance status
- Correct attendance records when necessary
- Attendance changes are validated before saving

---

# Epic 14: Leave Management

## US-045 Create Leave Request

**As a** Staff

**I want** to submit a leave request

**So that** my leave can be formally recorded and reviewed.

### Acceptance Criteria

- Employee is identified from the authenticated user
- Leave type is required
- Start date is required
- End date is required
- Leave reason can be provided
- End date cannot be earlier than start date
- Leave request is saved with a pending status
- Submitted request can be viewed by the employee

---

## US-046 View Own Leave

**As a** Staff

**I want** to view my leave requests

**So that** I can monitor their status.

### Acceptance Criteria

- View leave request history
- View leave type
- View leave dates
- View leave reason
- View request status
- View manager's decision when available

---

## US-047 Review Leave Request

**As a** Manager

**I want** to review employee leave requests

**So that** I can approve or reject leave requests from my team.

### Acceptance Criteria

- View pending leave requests from assigned employees
- View employee information
- View leave details
- Approve a leave request
- Reject a leave request
- Rejection reason can be provided
- Request status is updated after the decision

---

## US-048 Monitor Team Leave

**As a** Manager

**I want** to view team leave history

**So that** I can monitor employee availability.

### Acceptance Criteria

- View leave history of assigned employees
- Filter by employee
- Filter by leave type
- Filter by date
- Filter by request status

---

## US-049 Manage Leave Records

**As an** Admin

**I want** to manage leave records

**So that** leave data remains accurate and properly maintained.

### Acceptance Criteria

- View all leave requests
- Search leave records
- Filter by employee
- Filter by leave type
- Filter by date
- Filter by status
- Correct leave records when necessary
- Cancel or deactivate invalid records when necessary

---

# Epic 15: Performance Review

## US-050 View Own Performance Review

**As a** Staff

**I want** to view my performance reviews

**So that** I can understand my performance and evaluation results.

### Acceptance Criteria

- View performance review history
- View review period
- View performance score
- View review notes
- View reviewer information
- Staff can only view their own performance reviews

---

## US-051 Create Performance Review

**As a** Manager

**I want** to create a performance review for an employee

**So that** employee performance can be evaluated regularly.

### Acceptance Criteria

- Select employee
- Select review period
- Enter performance score
- Enter review notes
- Review score is required
- Review period is required
- Review is saved successfully
- Manager can only review authorized employees

---

## US-052 Edit Performance Review

**As a** Manager

**I want** to update a performance review

**So that** evaluation information can be corrected when necessary.

### Acceptance Criteria

- Update performance score
- Update review notes
- Changes are validated before saving
- Manager can only update authorized reviews

---

## US-053 View Team Performance

**As a** Manager

**I want** to view employee performance reviews

**So that** I can monitor team performance.

### Acceptance Criteria

- View performance review history
- Search employees
- Filter by department
- Filter by review period
- View performance scores
- View review notes

---

## US-054 Manage Performance Reviews

**As an** Admin

**I want** to manage performance review records

**So that** performance data remains accurate and properly maintained.

### Acceptance Criteria

- View all performance reviews
- Search performance reviews
- Filter by employee
- Filter by department
- Filter by review period
- Correct records when necessary
- Deactivate invalid records when necessary

---

# Epic 16: User & Access Management

## US-055 Manage Users

**As a** Super Admin

**I want** to manage system users

**So that** I can control who can access Opsora.

### Acceptance Criteria

- View user list
- Create user
- Update user information
- Deactivate user
- Assign user role
- Search users
- Filter users by role
- User email must be unique
- Deactivated users cannot login

---

## US-056 Manage Roles

**As a** Super Admin

**I want** to manage user roles

**So that** users can be assigned appropriate access levels.

### Acceptance Criteria

- View available roles
- Create custom role
- Update role
- Assign permissions to role
- Prevent deletion of roles currently assigned to users

---

## US-057 Manage Permissions

**As a** Super Admin

**I want** to manage permissions

**So that** access to system modules can be controlled.

### Acceptance Criteria

Permissions can control access to:

- Dashboard
- Products
- Categories
- Suppliers
- Customers
- Inventory
- Purchases
- Sales
- Reports
- Employees
- Departments
- Attendance
- Leave
- Performance Review
- User Management
- Role Management
- System Configuration

The system must enforce permissions on protected operations.

---

# Future User Stories

Future releases may introduce user stories for:

- Barcode scanning
- Purchase returns
- Sales returns
- Multi-warehouse operations
- Warehouse transfers
- Notifications
- Multi-company operations
- Audit trail
- Advanced reporting