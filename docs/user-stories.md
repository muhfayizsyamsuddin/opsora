# User Stories

> Version: 1.0
> Project: Opsora
> Last Updated: July 2026

---

# Overview

This document describes the functional needs of each user role in Opsora using User Stories.

Format:

> As a <role>,
> I want <feature>,
> So that <benefit>.

---

# User Roles

| Role | Description |
|------|-------------|
| Super Admin | Has full access to all company data and system settings. |
| Admin | Manages inventory, products, purchases, and reports. |
| Cashier | Handles sales transactions. |
| Manager | Monitors reports and business performance. |

---

# Epic 1 Authentication

## US-001 Login

**As a** user

**I want** to login using my email and password

**So that** I can securely access the system.

### Acceptance Criteria

- Login with email & password
- Password is encrypted
- JWT token generated
- Invalid credential returns error
- Remember session

---

## US-002 Logout

**As a** user

**I want** to logout

**So that** nobody can access my account.

### Acceptance Criteria

- Session removed
- JWT invalidated on client
- Redirect to Login page

---

# Epic 2 Dashboard

## US-003 Dashboard Summary

As an Admin

I want to see business statistics

So that I know business performance.

Acceptance Criteria

Display:

- Total Products
- Total Categories
- Total Suppliers
- Total Customers
- Today's Sales
- Monthly Revenue
- Low Stock Products

---

# Epic 3 Categories

## US-004 Create Category

As an Admin

I want to create categories

So products are organized.

Acceptance Criteria

- Category name required
- Name must be unique

---

## US-005 Edit Category

Acceptance Criteria

- Update category name

---

## US-006 Delete Category

Acceptance Criteria

- Cannot delete category with existing products

---

# Epic 4 Products

## US-007 Create Product

As an Admin

I want to add products

So inventory can be managed.

Acceptance Criteria

Required fields:

- Name
- SKU
- Category
- Purchase Price
- Selling Price
- Stock
- Unit

---

## US-008 Edit Product

Acceptance Criteria

- Update product information

---

## US-009 Delete Product

Acceptance Criteria

- Soft Delete
- Cannot delete product used in transactions

---

## US-010 Search Product

Acceptance Criteria

Search by:

- Name
- SKU
- Barcode

---

## US-011 Filter Product

Acceptance Criteria

Filter by:

- Category
- Stock Status

---

# Epic 5 Suppliers

## US-012 Create Supplier

Acceptance Criteria

Supplier contains:

- Name
- Phone
- Email
- Address

---

## US-013 Edit Supplier

Acceptance Criteria

Update supplier information.

---

## US-014 Delete Supplier

Acceptance Criteria

Cannot delete supplier with purchase history.

---

# Epic 6 Customers

## US-015 Create Customer

Acceptance Criteria

Customer contains:

- Name
- Phone
- Email
- Address

---

## US-016 Edit Customer

Acceptance Criteria

Customer information updated.

---

## US-017 Delete Customer

Acceptance Criteria

Cannot delete customer with sales history.

---

# Epic 7 Purchases

## US-018 Create Purchase

As an Admin

I want to record purchases

So stock increases automatically.

Acceptance Criteria

Purchase includes:

- Supplier
- Product
- Quantity
- Purchase Price
- Purchase Date

System automatically:

- Updates Stock
- Creates Stock Movement

---

## US-019 Purchase History

Acceptance Criteria

Supports

- Search
- Pagination
- Date Filter
- Supplier Filter

---

# Epic 8 Sales

## US-020 Create Sales

As a Cashier

I want to record customer purchases

So products can be sold.

Acceptance Criteria

Sales includes

- Customer
- Products
- Quantity
- Discount
- Payment Method

System automatically

- Calculates Total
- Reduces Stock
- Creates Stock Movement

---

## US-021 Print Invoice

Acceptance Criteria

Invoice contains

- Company
- Customer
- Product List
- Total
- Payment
- Date

---

# Epic 9 Inventory

## US-022 Inventory List

Acceptance Criteria

Display

- Product
- Current Stock
- Minimum Stock
- Stock Status

---

## US-023 Stock Adjustment

Acceptance Criteria

Requires

- Adjustment Type
- Quantity
- Reason

Creates Stock Movement.

---

## US-024 Stock Movement

Acceptance Criteria

History records

- Purchase
- Sale
- Adjustment

---

# Epic 10 Reports

## US-025 Sales Report

Acceptance Criteria

Filter

- Daily
- Weekly
- Monthly
- Yearly

Export

- Excel
- PDF

---

## US-026 Purchase Report

Acceptance Criteria

Date filtering.

---

## US-027 Inventory Report

Acceptance Criteria

Display

- Stock Value
- Low Stock
- Inventory Quantity

---

## US-028 Profit Report

Acceptance Criteria

Display

- Revenue
- Cost of Goods Sold
- Gross Profit
- Net Profit

---

# Future User Stories

- Barcode Scanner
- QR Code Inventory
- Multi Warehouse
- Multi Company
- AI Forecasting
- Notification Center
- Audit Trail