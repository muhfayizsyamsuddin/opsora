# Wireframe / Screen Specification

Version: 2.0

Status: Draft

Author: Faiz

Last Updated: 2026-08-10

---

# Overview

This document describes the layout and behavior of screens in Opsora.

The goal is to define what each page should contain before visual design and implementation.

This document focuses on:

- Screen purpose
- Components
- User actions
- Navigation
- Validation
- Related User Stories
- Role-based access

---

# Screen Map

```text
Authentication
└── Login

Core Business Operations
├── Dashboard
├── Products
├── Categories
├── Suppliers
├── Customers
├── Inventory
├── Purchases
├── Sales
└── Reports

People Operations
├── Employees
├── Departments
├── Attendance
├── Leave
└── Performance Review

Administration
├── Users
├── Roles & Permissions
└── Settings
```

---

# Global Layout

```text
+------------------------------------------------------------+
|                        Top Navigation                       |
+------------+-----------------------------------------------+
|            |                                               |
|            |                                               |
|  Sidebar   |               Main Content                    |
|            |                                               |
|            |                                               |
+------------+-----------------------------------------------+
```

---

# Common Components

## Sidebar

Core Business Operations
- Dashboard
- Products
- Categories
- Suppliers
- Customers
- Inventory
- Purchases
- Sales
- Reports

People Operations
- Employees
- Departments
- Attendance
- Leave
- Performance Review
Administration
- Users
- Roles & Permissions
- Settings

---

## Top Navigation

Contains:

- Page title
- Search
- Notifications
- Theme Toggle
- User Profile
- Logout

---

# Login Screen

## Purpose

Authenticate users and provide secure access to Opsora based on their assigned role and permissions.

## Related User Stories

- US-001 Login
- US-002 Logout

## Layout

```text
+--------------------------------------+
|              OPSORA                  |
|                                      |
| Email                                |
| [__________________________]         |
|                                      |
| Password                             |
| [__________________________]         |
|                                      |
| Remember Me                          |
|                                      |
|        [ Login Button ]              |
+--------------------------------------+
```

## Components

- Opsora Logo
- Email Input
- Password Input
- Remember Me
- Login Button
- Error Message

## Actions

- Login
- Show validation errors
- Redirect authenticated user to Dashboard
- Logout from authenticated session

## Validation

- Email is required
- Email must use a valid format
- Password is required
- Invalid credentials display an error message
- Inactive users cannot login

## Authentication Behavior

After successful authentication:

1. The system validates the user's credentials.
2. The system identifies the user's role and permissions.
3. The user is redirected to the Dashboard.
4. Available navigation and actions are determined by the user's permissions.

Supported roles include:

- Super Admin
- Owner
- Manager
- Admin
- Staff
- Cashier

---

# Dashboard

## Purpose

Provide a centralized overview of business operations and key people-related information.

The dashboard should help authorized users quickly understand the current state of the business without opening each module individually.

Dashboard content is displayed according to the user's role and permissions.

## Related User Stories

- US-003 Dashboard Summary

## Layout

```text
+-----------------------------------------------------------+
| Dashboard                                                 |
+-----------------------------------------------------------+

+-------------+ +-------------+ +-------------+ +-----------+
| Products    | | Inventory   | | Sales       | | Purchases |
+-------------+ +-------------+ +-------------+ +-----------+

+-------------+ +-------------+ +-------------+
| Customers   | | Suppliers   | | Low Stock   |
+-------------+ +-------------+ +-------------+

+-----------------------------------------------+
| Sales / Revenue Overview                      |
+-----------------------------------------------+

+-----------------------------+-----------------------------+
| Recent Sales                | Recent Purchases           |
+-----------------------------+-----------------------------+

+-----------------------------+-----------------------------+
| Low Stock Products          | Inventory Summary          |
+-----------------------------+-----------------------------+

+-----------------------------------------------------------+
| People Operations Summary                                 |
+-----------------------------------------------------------+

+------------------+------------------+---------------------+
| Employees        | Attendance       | Pending Leave      |
+------------------+------------------+---------------------+

+-----------------------------------------------------------+
| Performance Overview                                      |
+-----------------------------------------------------------+
```

## Components

### KPI Cards
Display key business information such as:

- Total Products
- Current Inventory
- Today's Sales
- Today's Purchases
- Total Customers
- Total Suppliers
- Low Stock Products

### Sales / Revenue Overview
Display business performance over a selected period.
Possible information:

- Sales trend
- Revenue
- Transaction count

### Recent Sales
Display recent sales transactions.
Information may include:

- Transaction number
- Customer
- Total
- Date
- Status

### Recent Purchases
Display recent purchase transactions.
Information may include:

- Purchase number
- Supplier
- Total
- Date
- Status

### Low Stock Products
Display products that have reached or fallen below their minimum stock level.
Information may include:

- Product
- SKU
- Current Stock
- Minimum Stock
- Stock Status

### Inventory Summary
Provide a quick overview of current inventory.
Information may include:

- Total inventory quantity
- Low stock count
- Inventory value
### People Operations Components
People Operations information is displayed only to users with the appropriate permissions.

### Employee Summary
Display:

- Total Employees
- Active Employees
- Inactive Employees

### Attendance Summary
Display:

- Present
- Late
- Absent
- On Leave
- Pending Leave

### Display leave requests requiring review.
Information may include:

- Employee
- Leave Type
- Start Date
- End Date
- Request Status

### Performance Overview
Display high-level performance information when available.
Information may include:

- Employees reviewed
- Average performance score
- Pending reviews

### Role-Based Dashboard
The dashboard adapts to the user's role and permissions.

1. Super Admin
Focus:

- System overview
- User management
- Roles and permissions
- Business overview

2. Owner
Focus:

- Business performance
- Sales
- Purchases
- Inventory
- Reports
- High-level operational information

3. Manager
Focus:

- Team information
- Attendance
- Leave
- Performance
- Operational reports

4. Admin
Focus:

- Operational data
- Inventory
- Products
- Purchases
- Sales
- People Operations administration

5. Staff
Focus:

- Authorized daily operational activities
- Personal attendance
- Personal leave
- Other permitted modules

6. Cashier
Focus:

- Sales
- Customers
- Product availability
- Sales transactions

### Dashboard Actions
Depending on permissions, users may:

- View business summaries
- Open recent transactions
- Open low stock products
- Open pending leave requests
- Open attendance information
- Open reports
- Navigate to authorized modules

### Responsive Behavior
- Desktop:
KPI cards displayed in rows
Charts and tables displayed side by side where appropriate
- Tablet:
KPI cards wrap into multiple rows
Dashboard sections become stacked
- Mobile:
KPI cards stack vertically
Tables become horizontally scrollable or use compact cards
Dashboard sections stack vertically

---

# Category Screen

## Purpose

Manage product categories used to organize products within Opsora.

## Related User Stories

- US-004 Create Category
- US-005 Edit Category
- US-006 Delete Category

## Layout

```text
+-----------------------------------------------------------+
| Categories                                                |
+-----------------------------------------------------------+

Search __________________________

                         [+ Add Category]

+-----------------------------------------------------------+
| Name                    | Created At       | Actions      |
+-----------------------------------------------------------+
| Electronics             | 2026-08-10       | Edit Delete  |
| Furniture               | 2026-08-09       | Edit Delete  |
+-----------------------------------------------------------+

                    < 1 2 3 >
```
## Components
- Page Header
- Search Input
- Add Category Button
- Category Table
- Pagination
- Action Menu

## Table Information
Display:

- Category Name
- Created At
- Updated At
- Actions

## Actions
1. Admin
- Create Category
- Edit Category
- Delete Category
- Search Category
2. Owner / Manager
- View Categories
- Search Categories
3. Staff / Cashier
- View categories when required by authorized product operations

## Create / Edit Category
Form fields:

- Category Name
- Description

## Validation
- Category name is required
- Category name must be unique
- Category name must be within the allowed length
- Category cannot be deleted while products are assigned to it

## Delete Behavior
A category with existing products cannot be permanently deleted.
The system should prevent deletion and display an appropriate message.

## Empty State
When no categories exist:
+--------------------------------------+
|                                      |
|        No categories found           |
|                                      |
|       [+ Create Category]            |
|                                      |
+--------------------------------------+

## Responsive Behavior
1. Desktop:
Display category table
Actions displayed in the table
2. Tablet:
Table remains available with horizontal scrolling if necessary
3. Mobile:
Category records may be displayed as compact cards
Search remains accessible
Add Category button remains easily accessible

---

# Product List

## Purpose

Manage and monitor products available in the Opsora inventory system.

## Related User Stories

- US-007 Create Product
- US-008 Edit Product
- US-009 Delete Product
- US-010 Search Product
- US-011 Filter Product

## Layout

```text
+-----------------------------------------------------------+
| Products                                                  |
+-----------------------------------------------------------+

Search __________________________

Category ▼        Stock Status ▼

                         [+ Add Product]

+-----------------------------------------------------------------------+
| Image | SKU | Product | Category | Stock | Price | Status | Actions  |
+-----------------------------------------------------------------------+
|       |     |         |          |       |       |        |          |
|       |     |         |          |       |       |        |          |
+-----------------------------------------------------------------------+

                         < 1 2 3 >
```

## Components
- Page Header
- Search Input
- Category Filter
- Stock Status Filter
- Add Product Button
- Product Table
- Pagination
- Action Menu

## Table Information
Display:

- Product Image
- Product Name
- SKU
- Category
- Current Stock
- Selling Price
- Stock Status
- Actions

## Search
Users can search products by:

- Product Name
- SKU
- Barcode

## Filters
Users can filter products by:
- Category
- Stock Status
Stock status may include:
- In Stock
- Low Stock
- Out of Stock

## Actions
1. Admin
- Add Product
- View Product
- Edit Product
- Delete Product
- Search Product
- Filter Product
2. Owner / Manager
- View Product
- Search Product
- Filter Product
3. Staff
- View Product
- Search Product
- Filter Product
4. Cashier
- View Product
- Search Product
- Filter Product

## Empty State
When no products are available:
+--------------------------------------+
|                                      |
|          No products found           |
|                                      |
|         [+ Add Product]              |
|                                      |
+--------------------------------------+
The Add Product action is only displayed to users with the required permission.

## Delete Behavior
Products use soft delete.
A product that has been used in transactions cannot be permanently deleted.
The system should prevent destructive deletion and preserve historical transaction data.

## Responsive Behavior
1. Desktop:
- Display full product table
- Filters displayed horizontally
2. Tablet:
- Product table supports horizontal scrolling
- Filters may wrap into multiple rows
3. Mobile:
- Product records may be displayed as compact cards
- Search and filters remain accessible
- Add Product button remains accessible to authorized users

---

# Product Form

## Purpose

Create or edit product information used by the inventory system.

## Related User Stories

- US-007 Create Product
- US-008 Edit Product

## Layout

```text
+-----------------------------------------------------------+
| Add Product / Edit Product                                |
+-----------------------------------------------------------+

Product Name
[________________________________________]

SKU
[________________________________________]

Category
[ Select Category ▼ ]

Barcode
[________________________________________]

Purchase Price
[________________]

Selling Price
[________________]

Stock
[________________]

Unit
[ Select Unit ▼ ]

Minimum Stock
[________________]

Product Image
[ Upload Image ]

------------------------------------------------------------

[ Cancel ]                         [ Save Product ]
```

## Components

- Product Name Input
- SKU Input
- Barcode Input
- Category Select
- Purchase Price Input
- Selling Price Input
- Stock Input
- Unit Select
- Minimum Stock Input
- Product Image Upload
- Cancel Button
- Save Button
## Required Fields

- Product Name
- SKU
- Category
- Purchase Price
- Selling Price
- Stock
- Unit

## Validation

- Product name is required
- SKU is required
- SKU must be unique
- Category is required
- Purchase price must be valid
- Selling price must be valid
- Stock cannot be negative
- Minimum stock cannot be negative
- Barcode must be unique when provided

## Create Behavior
When creating a product:
1. Validate product information.
2. Check SKU uniqueness.
3. Check barcode uniqueness when provided.
4. Save the product.
5. Redirect to Product List.

## Edit Behavior
When editing a product:
1. Load existing product information.
2. Allow authorized fields to be updated.
3. Validate updated information.
4. Save changes.
5. Redirect to Product List.

## Inventory Behavior
Initial stock entered during product creation establishes the product's starting inventory quantity.
Subsequent inventory changes should be performed through inventory transactions or stock adjustments.

## Product Image
Users with the required permission can:
- Upload product image
- Replace product image
- Remove product image

## Actions
1. Admin
- Create Product
- Edit Product
- Upload Product Image
2. Owner / Manager
- View Product Information
3. Staff / Cashier
- View Product Information according to their permissions

## Responsive Behavior
1. Desktop:
- Form displayed in a structured two-column layout where appropriate
2. Tablet:
- Form fields may reduce to a single column
3. Mobile:
- Form displayed in a single column
- Upload control remains accessible
- Action buttons remain visible

---

# Supplier Screen

## Purpose

Manage supplier information used for purchase and inventory operations.

## Related User Stories

- US-012 Create Supplier
- US-013 Edit Supplier
- US-014 Delete Supplier

## Layout

```text
+-----------------------------------------------------------+
| Suppliers                                                 |
+-----------------------------------------------------------+

Search __________________________

                         [+ Add Supplier]

+----------------------------------------------------------------+
| Name | Phone | Email | Address | Created At | Actions         |
+----------------------------------------------------------------+
|      |       |       |         |            | Edit Delete     |
+----------------------------------------------------------------+

                         < 1 2 3 >
```
---
## Components

- Page Header
- Search Input
- Add Supplier Button
- Supplier Table
- Pagination
- Action Menu

## Table Information
Display:
- Supplier Name
- Phone
- Email
- Address
- Created At
- Actions

## Search
Users can search suppliers by:
- Name
- Phone
- Email

## Supplier Form
Fields:
- Supplier Name
- Phone
- Email
- Address

## Validation
- Supplier name is required
- Phone must use a valid format when provided
- Email must use a valid format when provided
- Required supplier information must be validated before saving

## Actions
1. Admin
- Create Supplier
- Edit Supplier
- Delete Supplier
- Search Supplier
2. Owner / Manager
- View Supplier
- Search Supplier
3. Staff
- View Supplier
- Search Supplier
4. Cashier
- View Supplier when required by authorized operations

## Delete Behavior
A supplier with existing purchase history cannot be permanently deleted.
The system should prevent deletion when the supplier is referenced by existing transactions.
Historical purchase records must remain intact.

## Empty State
When no suppliers exist:
+--------------------------------------+
|                                      |
|          No suppliers found          |
|                                      |
|         [+ Add Supplier]             |
|                                      |
+--------------------------------------+
The Add Supplier action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Display supplier table
- Search and actions displayed horizontally
2. Tablet:
- Table supports horizontal scrolling when necessary
3. Mobile:
- Supplier records may be displayed as compact cards
- Search remains accessible
- Add Supplier button remains accessible to authorized users

---

# Customer Screen

## Purpose

Manage customer information used in sales operations.

## Related User Stories

- US-015 Create Customer
- US-016 Edit Customer
- US-017 Delete Customer

## Layout

```text
+-----------------------------------------------------------+
| Customers                                                 |
+-----------------------------------------------------------+

Search __________________________

                         [+ Add Customer]

+----------------------------------------------------------------+
| Name | Phone | Email | Address | Created At | Actions         |
+----------------------------------------------------------------+
|      |       |       |         |            | Edit Delete     |
+----------------------------------------------------------------+

                         < 1 2 3 >
```

## Components
- Page Header
- Search Input
- Add Customer Button
- Customer Table
- Pagination
- Action Menu

## Table Information
Display:
- Customer Name
- Phone
- Email
- Address
- Created At
- Actions

## Search
Users can search customers by:
- Name
- Phone
- Email

## Customer Form
Fields:
- Customer Name
- Phone
- Email
- Address

## Validation
- Customer name is required
- Phone must use a valid format when provided
- Email must use a valid format when provided
- Customer information must be validated before saving

## Actions
1. Admin
- Create Customer
- Edit Customer
- Delete Customer
- Search Customer
2. Owner / Manager
- View Customer
- Search Customer
3. Staff
- View Customer
- Search Customer
4. Cashier
- Create Customer
- View Customer
- Search Customer

## Delete Behavior
A customer with existing sales history cannot be permanently deleted.
The system should prevent deletion when the customer is referenced by existing transactions.
Historical sales records must remain intact.

## Walk-in Customer
The system should support a Walk-in Customer for sales transactions where the buyer is not registered.
Walk-in Customer does not require a full customer profile.

## Empty State
When no customers exist:
+--------------------------------------+
|                                      |
|          No customers found          |
|                                      |
|         [+ Add Customer]             |
|                                      |
+--------------------------------------+
The Add Customer action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Display customer table
- Search and actions displayed horizontally
2. Tablet:
- Table supports horizontal scrolling when necessary
3. Mobile:
- Customer records may be displayed as compact cards
- Search remains accessible
- Add Customer button remains accessible to authorized users

---

# Purchase Screen

## Purpose

Create and manage purchase transactions from suppliers and update inventory when purchased goods are received.

## Related User Stories

- US-018 Create Purchase
- US-019 Purchase History

## Layout

```text
+-----------------------------------------------------------+
| Purchases                                                 |
+-----------------------------------------------------------+

Search ______________________

Supplier ▼        Date Range ▼

                         [+ Create Purchase]

+----------------------------------------------------------------+
| Purchase No | Supplier | Date | Total | Status | Actions      |
+----------------------------------------------------------------+
|             |          |      |       |        | View         |
+----------------------------------------------------------------+

                         < 1 2 3 >
```
## Purchase Form

```text
+-----------------------------------------------------------+
| Create Purchase                                            |
+-----------------------------------------------------------+

Supplier
[ Select Supplier ▼ ]

Purchase Date
[ Select Date ]

------------------------------------------------------------

Product
[ Select Product ▼ ]

Quantity
[__________]

Purchase Price
[__________]

                         [+ Add Item]

------------------------------------------------------------

Purchase Items

+-----------------------------------------------------------+
| Product | Quantity | Price | Subtotal | Action            |
+-----------------------------------------------------------+
|         |          |       |          | Remove            |
+-----------------------------------------------------------+

------------------------------------------------------------

Total Purchase
[________________]

[ Cancel ]                         [ Save Purchase ]
```

## Components
- Supplier Select
- Purchase Date
- Product Select
- Quantity Input
- Purchase Price Input
- Add Item Button
- Purchase Items Table
- Total Calculation
- Save Button
- Cancel Button

## Purchase History
Users with the required permission can:
- View purchase history
- Search purchases
- Filter by supplier
- Filter by date
- View purchase details
- Use pagination

## Validation
- Supplier is required
- Purchase date is required
- At least one product is required
- Quantity must be greater than zero
- Purchase price must be valid
- Product must be valid
- Purchase must contain at least one item

## Purchase Behavior
When a purchase is saved:
1. Validate the purchase data.
2. Create the purchase record.
3. Create purchase items.
4. Receive the purchased goods.
5. Increase inventory quantities.
6. Create inventory movement records.
7. Mark the purchase as completed.

## Inventory Integration
A completed purchase increases the stock of the purchased products.
Purchase
    │
    ▼
Purchase Items
    │
    ▼
Receive Goods
    │
    ▼
Increase Inventory
    │
    ▼
Create Stock Movement

## Actions
1. Admin
- Create Purchase
- View Purchase
- Search Purchase
- Filter Purchase
2. Owner
- View Purchase
- Search Purchase
- Filter Purchase
3. Manager
- View Purchase
- Search Purchase
- Filter Purchase
4. Staff
- Create Purchase
- View Purchase
- Search Purchase
- Filter Purchase
5. Cashier
- No purchase access unless explicitly granted permission

## Empty State
When no purchases exist:
+--------------------------------------+
|                                      |
|          No purchases found          |
|                                      |
|         [+ Create Purchase]          |
|                                      |
+--------------------------------------+
The Create Purchase action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Purchase history displayed as a table
- Purchase form uses structured sections
2. Tablet:
- Purchase table supports horizontal scrolling
- Form sections may stack
3. Mobile:
- Purchase form uses a single-column layout
- Purchase items may be displayed as cards
- Product selection and quantity input remain accessible

---

# Sales Screen

## Purpose

Create and manage sales transactions and reduce inventory when a sale is completed.

## Related User Stories

- US-020 Create Sales
- US-021 Print Invoice

## Layout

```text
+-----------------------------------------------------------+
| Sales                                                     |
+-----------------------------------------------------------+

Search ______________________

Date Range ▼        Customer ▼

                         [+ Create Sale]

+----------------------------------------------------------------+
| Invoice No | Customer | Date | Total | Status | Actions        |
+----------------------------------------------------------------+
|           |          |      |       |        | View / Invoice  |
+----------------------------------------------------------------+

                         < 1 2 3 >
```
## Sales Form

```text
+-----------------------------------------------------------+
| Create Sale                                               |
+-----------------------------------------------------------+

Customer
[ Select Customer ▼ ]

or

[ Walk-in Customer ]

------------------------------------------------------------

Search Product
[________________________________________]

------------------------------------------------------------

Cart

+-----------------------------------------------------------+
| Product | Qty | Price | Discount | Subtotal | Action     |
+-----------------------------------------------------------+
|         |     |       |          |          | Remove     |
+-----------------------------------------------------------+

------------------------------------------------------------

Subtotal
[________________]

Discount
[________________]

Grand Total
[________________]

Payment Method

( ) Cash
( ) Transfer
( ) QRIS

------------------------------------------------------------

[ Cancel ]                    [ Complete Transaction ]
```

## Components
- Customer Select
- Walk-in Customer Option
- Product Search
- Product Selection
- Sales Cart
- Quantity Input
- Discount Input
- Subtotal
- Grand Total
- Payment Method
- Complete Transaction Button
- Cancel Button

## Product Search
Products can be searched by:
- Product Name
- SKU
- Barcode

## Stock Availability
Before completing a sale, the system must check whether sufficient stock is available.
Add Product
     │
     ▼
Check Stock
     │
 ┌───┴────────┐
 │            │
Available   Insufficient
 │            │
 ▼            ▼
Continue    Show Error
If stock is insufficient, the transaction cannot be completed.

## Validation
- Customer or Walk-in Customer is required
- At least one product is required
- Quantity must be greater than zero
- Quantity cannot exceed available stock
- Product must be valid
- Payment method is required
- Discount must be valid when provided

## Sales Behavior
When a sale is completed:
1. Validate the sales data.
2. Check stock availability.
3. Calculate subtotal.
4. Apply discount.
5. Calculate grand total.
6. Create the sales record.
7. Create sales items.
8. Reduce inventory quantities.
9. Create inventory movement records.
10. Generate the invoice.

## Inventory Integration
A completed sale reduces the stock of sold products.
Sale
 │
 ▼
Sales Items
 │
 ▼
Check Stock
 │
 ▼
Reduce Inventory
 │
 ▼
Create Stock Movement
 │
 ▼
Generate Invoice

## Invoice
The generated invoice should contain:
- Company information
- Invoice number
- Customer
- Product list
- Quantity
- Price
- Discount
- Total
- Payment method
- Transaction date

## Sales History
Users with the required permission can:
- View sales history
- Search sales
- Filter by customer
- Filter by date
- View sale details
- View invoice
- Print invoice
- Use pagination

## Actions
1. Admin
- Create Sale
- View Sale
- Search Sale
- Filter Sale
- View Invoice
- Print Invoice
2. Owner
- View Sale
- Search Sale
- Filter Sale
- View Invoice
- Print Invoice
3. Manager
- View Sale
- Search Sale
- Filter Sale
- View Invoice
- Print Invoice
4. Staff
- Create Sale
- View Sale
- Search Sale
- Filter Sale
5. Cashier
- Create Sale
- Create Customer
- View Sale
- Search Sale
- View Invoice
- Print Invoice

## Empty State
When no sales exist:
+--------------------------------------+
|                                      |
|            No sales found            |
|                                      |
|           [+ Create Sale]             |
|                                      |
+--------------------------------------+
The Create Sale action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Sales form and cart displayed in structured sections
- Sales history displayed as a table
2. Tablet:
- Cart and form sections may stack
- Sales table supports horizontal scrolling
3. Mobile:
- Product search remains accessible
- Cart items use compact cards
- Payment section stacks vertically
- Complete Transaction button remains easily accessible

---

# Inventory Screen

## Purpose

Monitor current inventory levels and track all stock movements within Opsora.

## Related User Stories

- US-022 Inventory List
- US-023 Stock Adjustment
- US-024 Stock Movement

## Layout

```text
+-----------------------------------------------------------+
| Inventory                                                 |
+-----------------------------------------------------------+

Search __________________________

Category ▼        Stock Status ▼

+-----------------------------------------------------------------------+
| SKU | Product | Category | Current Stock | Min Stock | Status | Action |
+-----------------------------------------------------------------------+
|     |         |          |               |           |        | View   |
+-----------------------------------------------------------------------+

                         < 1 2 3 >

------------------------------------------------------------

[ Stock Adjustment ]    [ Stock Movement History ]
```

## Components
- Page Header
- Search Input
- Category Filter
- Stock Status Filter
- Inventory Table
- Pagination
- Stock Adjustment Button
- Stock Movement History
- Action Menu

## Inventory Table
Display:
- Product
- SKU
- Category
- Current Stock
- Minimum Stock
- Stock Status
- Unit
- Actions

## Search
Users can search inventory by:
- Product Name
- SKU
- Barcode

## Filters
Users can filter inventory by:
- Category
- Stock Status
Stock status includes:
- In Stock
- Low Stock
- Out of Stock

## Stock Status
The system determines stock status based on current stock and minimum stock level.
Current Stock > Minimum Stock
        │
        ▼
     In Stock

Current Stock <= Minimum Stock
        │
        ▼
     Low Stock

Current Stock = 0
        │
        ▼
   Out of Stock

## Stock Adjustment
Authorized users can adjust inventory quantities.
Inventory
    │
    ▼
Stock Adjustment
    │
    ▼
Select Product
    │
    ▼
Select Adjustment Type
    │
    ▼
Enter Quantity
    │
    ▼
Enter Reason
    │
    ▼
Validate Adjustment
    │
    ▼
Update Inventory
    │
    ▼
Create Stock Movement

## Stock Adjustment Form

```text
+----------------------------------------------+
| Stock Adjustment                             |
+----------------------------------------------+

Product
[ Select Product ▼ ]

Adjustment Type
[ Increase / Decrease ▼ ]

Quantity
[________________]

Reason
[____________________________]

[ Cancel ]                  [ Save Adjustment ]
```

## Validation
- Product is required
- Adjustment type is required
- Quantity must be greater than zero
- Reason is required
- Decrease quantity cannot exceed available stock

## Stock Movement History
Display all inventory movements.
+-------------------------------------------------------------------+
| Date | Product | Type | Quantity | Reference | User              |
+-------------------------------------------------------------------+
|      |         |      |          |           |                   |
+-------------------------------------------------------------------+
Movement types include:
- Purchase
- Sale
- Stock Adjustment

## Inventory Movement Detail
A movement record should contain:
- Date
- Product
- Movement Type
- Quantity
- Previous Stock
- Resulting Stock
- Reference Transaction
- User

## Actions
1. Admin
- View Inventory
- Search Inventory
- Filter Inventory
- Create Stock Adjustment
- View Stock Movement
2. Owner
- View Inventory
- Search Inventory
- Filter Inventory
- View Stock Movement
3. Manager
- View Inventory
- Search Inventory
- Filter Inventory
- Create Stock Adjustment
- View Stock Movement
4. Staff
- View Inventory
- Search Inventory
- Filter Inventory
- Create Stock Adjustment when authorized
5. Cashier
- View Product Availability
- Search Inventory when required for sales
Cashier cannot perform stock adjustments unless explicitly granted permission.

## Empty State
When no inventory records exist:
+--------------------------------------+
|                                      |
|        No inventory records found    |
|                                      |
+--------------------------------------+

## Responsive Behavior
1. Desktop:
- Inventory table displayed with filters
- Stock movement accessible from the inventory page
2. Tablet:
- Table supports horizontal scrolling
- Filters may wrap into multiple rows
3. Mobile:
- Inventory records may use compact cards
- Stock adjustment form uses a single-column layout
- Movement history supports horizontal scrolling or compact records

---

# Reports Screen

## Purpose

Provide business reports that help authorized users monitor sales, purchases, inventory, and profitability.

## Related User Stories

- US-025 Sales Report
- US-026 Purchase Report
- US-027 Inventory Report
- US-028 Profit Report

## Layout

```text
+-----------------------------------------------------------+
| Reports                                                   |
+-----------------------------------------------------------+

+----------------------+----------------------+----------------------+
| Sales Report         | Purchase Report      | Inventory Report     |
+----------------------+----------------------+----------------------+

+----------------------+
| Profit Report        |
+----------------------+

------------------------------------------------------------

Date Range

[ Start Date ]  [ End Date ]

[ Generate Report ]

------------------------------------------------------------

Report Result

+-----------------------------------------------------------+
|                    Report Data                            |
|                                                           |
|                                                           |
+-----------------------------------------------------------+

[ Export PDF ]                         [ Export Excel ]
```

## Report Types
### Sales Report
Displays sales performance within the selected period.
Information may include:
- Transaction count
- Total sales
- Revenue
- Sales by date
- Sales by product
- Sales by customer
Filters:
- Daily
- Weekly
- Monthly
- Yearly
- Custom date range

### Purchase Report
Displays purchase activity within the selected period.
Information may include:
- Purchase count
- Total purchases
- Purchases by date
- Purchases by supplier
- Purchased products
Filters:
- Daily
- Weekly
- Monthly
- Yearly
- Custom date range

### Inventory Report
Displays the current inventory condition.
Information may include:
- Inventory quantity
- Inventory value
- Low stock products
- Out of stock products
- Stock by product
- Stock by category

### Profit Report
Displays profitability information based on available sales and purchase data.
Information may include:
- Revenue
- Cost of Goods Sold
- Gross Profit
- Net Profit
The system must clearly distinguish calculated values from directly recorded transaction values.

## Filters
Reports support:
- Date range
- Product
- Category
- Supplier
- Customer
Available filters depend on the selected report type.

## Report Actions
Authorized users can:
- Select report type
- Apply filters
- Generate report
- View report
- Export PDF
- Export Excel

## Role-Based Access
1. Super Admin
- View reports
- Generate reports
- Export reports
2. Owner
- View reports
- Generate reports
- Export reports
3. Manager
- View reports
- Generate reports
- Export reports
4. Admin
- View reports
- Generate reports
- Export reports
5. Staff
- View reports only when explicitly authorized
6. Cashier
- View sales-related reports when explicitly authorized

## Empty State
When no data matches the selected filters:
+--------------------------------------+
|                                      |
|       No report data available       |
|                                      |
|      Try changing the filters.       |
|                                      |
+--------------------------------------+

## Responsive Behavior
1. Desktop:
- Report cards displayed in a grid
- Filters displayed horizontally
- Report data displayed in tables or charts
2. Tablet:
- Report cards wrap into multiple rows
- Filters may stack
3. Mobile:
- Report cards stack vertically
- Filters use a single-column layout
- Report tables support horizontal scrolling
- Export actions remain accessible

---

# Settings Screen

## Purpose

Manage company information, users, roles, permissions, account settings, and system preferences.

## Layout

```text
+-----------------------------------------------------------+
| Settings                                                   |
+-----------------------------------------------------------+

+----------------------+------------------------------------+
| Settings Menu        | Settings Content                   |
+----------------------+------------------------------------+
| Company Profile      |                                    |
| User Management      |                                    |
| Roles & Permissions  |                                    |
| Account              |                                    |
| System Preferences   |                                    |
+----------------------+------------------------------------+
```

## Settings Sections
### Company Profile
Manage basic business information.
Fields:
- Company Name
- Company Logo
- Phone
- Email
- Address
Used by:
- Dashboard
- Reports
- Invoices

### User Management
Manage users who can access Opsora.
+----------------------------------------------------------------+
| Name | Email | Role | Status | Created At | Actions            |
+----------------------------------------------------------------+
|      |       |      | Active |            | Edit / Disable     |
+----------------------------------------------------------------+

                         [+ Add User]
Actions:
- Create User
- Edit User
- Assign Role
- Activate User
- Deactivate User
- Search User
- Filter User
- Pagination
A user account should not be permanently deleted when it is referenced by historical operational data.

### Roles & Permissions
Manage access to system modules and actions.
Default roles:
- Super Admin
- Owner
- Admin
- Manager
- Staff
- Cashier
Permissions may be organized by module:
Core Business
├── Products
├── Categories
├── Suppliers
├── Customers
├── Purchases
├── Sales
├── Inventory
└── Reports

People Operations
├── Employees
├── Departments
├── Attendance
├── Leave
└── Performance Review

Administration
├── Users
├── Roles & Permissions
└── Settings
Permission actions may include:
- View
- Create
- Update
- Delete
- Export
- Approve

### Account
Manage the currently authenticated user's account.
Actions:
- View Profile
- Change Password
- Update Account Information

### System Preferences
Manage general application preferences.
Possible settings:
- Theme Preference
- Default Currency
- Default Date Format
- Default Time Format
Only settings supported by the current deployment should be displayed.

## Role-Based Access
1. Super Admin
- Full access to Settings
- Manage Users
- Manage Roles & Permissions
- Manage Company Profile
- Manage System Preferences
2. Owner
- View Company Profile
- View Users
- View Roles & Permissions
- Manage selected business settings when authorized
- Owner should not automatically receive unrestricted system administration access.
3. Admin
- Manage Users when authorized
- Manage operational settings
- View Company Profile
- Manage selected system preferences
- Admin cannot modify protected system-level permissions unless explicitly authorized.
4. Manager
- View relevant business configuration
- Manage settings related to assigned operational responsibilities
5. Staff
- Access only personal account settings
6. Cashier
- Access only personal account settings

## Security
Sensitive settings require appropriate authorization.
Examples:
- Changing user roles
- Changing permissions
- Deactivating users
- Changing protected system settings
Unauthorized actions must return an appropriate authorization error.

## Empty State
When a settings section has no configurable data:
+--------------------------------------+
|                                      |
|       No settings available          |
|                                      |
+--------------------------------------+

## Responsive Behavior
1. Desktop:
- Settings navigation displayed as a sidebar
- Content displayed in the main panel
2. Tablet:
- Settings navigation may become collapsible
3. Mobile:
- Settings sections displayed as a list
- Selecting a section opens its settings
- Forms use a single-column layout

---

# Responsive Behavior

Desktop

- Sidebar expanded

Tablet

- Sidebar collapsible

Mobile

- Hamburger menu
- Responsive tables
- Cards stacked vertically

---

# Employee Screen

## Purpose

Manage employee records used by People Operations.

## Related User Stories

- US-029 Create Employee
- US-030 Edit Employee
- US-031 View Employee

## Layout

```text
+-----------------------------------------------------------+
| Employees                                                 |
+-----------------------------------------------------------+

Search __________________________

Department ▼        Status ▼

                         [+ Add Employee]

+-------------------------------------------------------------------+
| Employee | Department | Position | Status | Joined Date | Actions |
+-------------------------------------------------------------------+
|          |            |          |        |             | View     |
+-------------------------------------------------------------------+

                         < 1 2 3 >
```
## Components
- Search Input
- Department Filter
- Status Filter
- Employee Table
- Pagination
- Add Employee Button
- Action Menu

## Employee Form
+-----------------------------------------------------------+
| Add Employee                                               |
+-----------------------------------------------------------+

Full Name
[____________________________]

Employee Code
[____________________________]

Email
[____________________________]

Phone
[____________________________]

Department
[ Select Department ▼ ]

Position
[____________________________]

Join Date
[ Select Date ]

Status
[ Active ▼ ]

------------------------------------------------------------

[ Cancel ]                         [ Save Employee ]

## Validation
- Full name is required
- Employee code is required
- Employee code must be unique
- Department is required
- Join date is required
- Status is required
- Email must be valid when provided

## Employee Actions
Authorized users can:
- Create employee
- View employee
- Edit employee
- Search employee
- Filter employee
- View employee history

## Role-Based Access
1. Super Admin
- Full access
2. Owner
- View employees
3. Admin
- Create employee
- View employee
- Edit employee
- Search employee
- Filter employee
4. Manager
- View employees
- Search employee
- Filter employee
5. Staff
- View employee information when authorized
6. Cashier
- No employee management access by default

## Empty State
+--------------------------------------+
|                                      |
|        No employees found            |
|                                      |
|          [+ Add Employee]            |
|                                      |
+--------------------------------------+
The Add Employee action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Employee records displayed as a table
- Form displayed in structured sections
2. Tablet:
- Table supports horizontal scrolling
- Filters may wrap
3. Mobile:
- Employee records may use compact cards
- Form uses a single-column layout

---

# Department Screen

## Purpose

Manage departments used to organize employees within People Operations.

## Related User Stories

- US-032 Create Department
- US-033 Edit Department
- US-034 View Department

## Layout

```text
+-----------------------------------------------------------+
| Departments                                               |
+-----------------------------------------------------------+

Search __________________________

                         [+ Add Department]

+----------------------------------------------------------------+
| Department Name | Description | Employees | Created At | Actions |
+----------------------------------------------------------------+
|                 |             |           |            | Edit    |
+----------------------------------------------------------------+

                         < 1 2 3 >
```
## Components
- Search Input
- Add Department Button
- Department Table
- Employee Count
- Pagination
- Action Menu

## Department Form
+-----------------------------------------------------------+
| Add Department                                             |
+-----------------------------------------------------------+

Department Name
[____________________________]

Description
[____________________________]
[____________________________]

------------------------------------------------------------

[ Cancel ]                       [ Save Department ]

## Validation
- Department name is required
- Department name must be unique
- Description is optional

## Department Actions
Authorized users can:
- Create department
- View department
- Edit department
- Search department
- View employees assigned to a department
- Delete department

## Delete Behavior
A department that has employees assigned to it should not be permanently deleted.
The system should prevent deletion while the department is referenced by employee records.
Historical employee data must remain intact.

## Role-Based Access
1. Super Admin
- Full access
2. Owner
- View departments
- View employees by department
3. Admin
- Create department
- View department
- Edit department
- Search department
- View employees by department
4. Manager
- View departments
- Search departments
- View employees by department
5. Staff
- View department information when authorized
6. Cashier
- No department management access by default

## Empty State
+--------------------------------------+
|                                      |
|       No departments found           |
|                                      |
|         [+ Add Department]           |
|                                      |
+--------------------------------------+
The Add Department action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Department records displayed as a table
- Employee count displayed in the table
2. Tablet:
- Table supports horizontal scrolling
- Search and actions may wrap
3. Mobile:
- Department records may use compact cards
- Department form uses a single-column layout

---

# Attendance Screen

## Purpose

Record and monitor employee attendance within People Operations.

## Related User Stories

- US-035 Record Attendance
- US-036 View Attendance History

## Layout

```text
+-----------------------------------------------------------+
| Attendance                                                |
+-----------------------------------------------------------+

Date
[ Select Date ]

Department
[ All Departments ▼ ]

Status
[ All Status ▼ ]

Search Employee
[____________________________]

+----------------------------------------------------------------+
| Employee | Department | Date | Check In | Check Out | Status   |
+----------------------------------------------------------------+
|          |            |      |          |           | Present  |
+----------------------------------------------------------------+

                         < 1 2 3 >
```
## Components
- Date Selector
- Department Filter
- Attendance Status Filter
- Employee Search
- Attendance Table
- Pagination
- Record Attendance Button
## Attendance Form
+-----------------------------------------------------------+
| Record Attendance                                         |
+-----------------------------------------------------------+

Employee
[ Select Employee ▼ ]

Date
[ Select Date ]

Attendance Status
[ Present ▼ ]

Check In
[ Select Time ]

Check Out
[ Select Time ]

Notes
[____________________________]
[____________________________]

------------------------------------------------------------

[ Cancel ]                       [ Save Attendance ]
## Attendance Status
The system supports the following attendance statuses:
- Present
- Late
- Absent
- Leave
Additional statuses may be introduced in future releases.

## Validation
- Employee is required
- Date is required
- Attendance status is required
- Check-in time must be valid when provided
- Check-out time must be valid when provided
- Check-out time cannot be earlier than check-in time

## Attendance Actions
Authorized users can:
- Record attendance
- View attendance
- Search attendance
- Filter by date
- Filter by department
- Filter by status
- View attendance history

## Attendance History
Attendance history displays:
- Employee
- Department
- Date
- Check-in
- Check-out
- Status
- Notes
Historical attendance records should remain available for reporting and auditing.

## Role-Based Access
1. Super Admin
- Full access
2. Owner
- View attendance
- Search attendance
- Filter attendance
3. Admin
- Record attendance
- View attendance
- Edit attendance when authorized
- Search attendance
- Filter attendance
4. Manager
- Record attendance for assigned employees
- View attendance
- Search attendance
- Filter attendance
5. Staff
- View own attendance
- Record own attendance when supported by the implementation
6. Cashier
- No attendance management access by default
- May view own attendance when supported by the implementation

## Empty State
+--------------------------------------+
|                                      |
|       No attendance records found    |
|                                      |
|        [+ Record Attendance]         |
|                                      |
+--------------------------------------+
The Record Attendance action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Attendance records displayed as a table
- Filters displayed horizontally
2. Tablet:
- Attendance table supports horizontal scrolling
- Filters may wrap
3. Mobile:
- Attendance records may use compact cards
- Attendance form uses a single-column layout
- Date and status filters remain accessible

---

# Leave Screen

## Purpose

Manage employee leave requests and track leave history within People Operations.

## Related User Stories

- US-037 Create Leave Request
- US-038 Review Leave Request
- US-039 View Leave History

## Layout

```text
+-----------------------------------------------------------+
| Leave                                                      |
+-----------------------------------------------------------+

Search ______________________

Department ▼       Status ▼       Leave Type ▼

                         [+ Create Leave Request]

+------------------------------------------------------------------------+
| Employee | Leave Type | Start Date | End Date | Status | Actions       |
+------------------------------------------------------------------------+
|          |            |            |          | Pending| View / Review |
+------------------------------------------------------------------------+

                         < 1 2 3 >
```
## Components
- Employee Search
- Department Filter
- Leave Type Filter
- Status Filter
- Leave Request Table
- Pagination
- Create Leave Request Button
- Action Menu
## Leave Request Form
+-----------------------------------------------------------+
| Create Leave Request                                      |
+-----------------------------------------------------------+

Employee
[ Select Employee ▼ ]

Leave Type
[ Select Leave Type ▼ ]

Start Date
[ Select Date ]

End Date
[ Select Date ]

Reason
[____________________________]
[____________________________]

------------------------------------------------------------

[ Cancel ]                     [ Submit Request ]
## Leave Types
The system supports common leave categories such as:
- Annual Leave
- Sick Leave
- Personal Leave
- Other
The exact leave types may be configured according to the business requirements.

## Leave Status
A leave request can have the following statuses:
- Pending
- Approved
- Rejected
- Cancelled
## Validation
- Employee is required
- Leave type is required
- Start date is required
- End date is required
- End date cannot be earlier than start date
- Reason is required when applicable

## Leave Request Flow
Create Leave Request
        │
        ▼
Enter Leave Information
        │
        ▼
Submit Request
        │
        ▼
      Pending
        │
   ┌────┴─────┐
   │          │
Approve     Reject
   │          │
   ▼          ▼
Approved    Rejected
## Leave Actions
Authorized users can:
- Create leave request
- View leave request
- Search leave requests
- Filter leave requests
- Approve leave request
- Reject leave request
- View leave history
## Role-Based Access
1. Super Admin
- Full access
2. Owner
- View leave requests
- View leave history
- Review leave requests when authorized
3. Admin
- Create leave request
- View leave requests
- Edit pending requests when authorized
- Approve leave requests when authorized
- Reject leave requests when authorized
- View leave history
4. Manager
- View leave requests for assigned employees
- Approve leave requests for assigned employees
- Reject leave requests for assigned employees
- View leave history
5. Staff
- Create own leave request
- View own leave requests
- View own leave history
6. Cashier
- Create own leave request
- View own leave requests
- View own leave history
## Approval Rules
A user should not approve their own leave request.
Approval permissions depend on the user's role and assigned organizational responsibility.
## Leave History
Leave history displays:
- Employee
- Department
- Leave Type
- Start Date
- End Date
- Reason
- Status
- Approved/Rejected By
- Decision Date
## Empty State
+--------------------------------------+
|                                      |
|       No leave requests found        |
|                                      |
|      [+ Create Leave Request]        |
|                                      |
+--------------------------------------+
The Create Leave Request action is only displayed to users with the required permission.

## Responsive Behavior
1. Desktop:
- Leave requests displayed as a table
- Filters displayed horizontally
2. Tablet:
- Table supports horizontal scrolling
- Filters may wrap
3. Mobile:
- Leave requests may use compact cards
- Leave form uses a single-column layout
- Approval actions remain accessible to authorized users

---

# Performance Review Screen

## Purpose

Record and monitor employee performance reviews within People Operations.

## Related User Stories

- US-040 Create Performance Review
- US-041 View Performance Review
- US-042 Edit Performance Review

## Layout

```text
+-----------------------------------------------------------+
| Performance Reviews                                       |
+-----------------------------------------------------------+

Search ______________________

Department ▼       Review Period ▼

                         [+ Add Performance Review]

+------------------------------------------------------------------------+
| Employee | Department | Period | Score | Reviewer | Date | Actions    |
+------------------------------------------------------------------------+
|          |            |        |       |          |      | View / Edit |
+------------------------------------------------------------------------+

                         < 1 2 3 >
```
## Components
- Employee Search
- Department Filter
- Review Period Filter
- Performance Review Table
- Pagination
- Add Performance Review Button
- Action Menu
## Performance Review Form
+-----------------------------------------------------------+
| Add Performance Review                                   |
+-----------------------------------------------------------+

Employee
[ Select Employee ▼ ]

Review Period
[ Select Period ▼ ]

Performance Score
[________ / 100]

Review Notes
[____________________________________________]
[____________________________________________]
[____________________________________________]

------------------------------------------------------------

[ Cancel ]                     [ Save Review ]
## Validation
- Employee is required
- Review period is required
- Performance score is required
- Performance score must be within the configured valid range
- Review notes are required when applicable
## Performance Review Actions
Authorized users can:
- Create performance review
- View performance review
- Edit performance review
- Search performance reviews
- Filter by department
- Filter by review period
- View employee performance history
## Role-Based Access
1. Super Admin
   - Full access
2. Owner
   - View performance reviews
   - View employee performance history
3. Admin
   - Create performance review
   - View performance review
   - Edit performance review
   - Search performance reviews
   - Filter performance reviews
4. Manager
   - Create performance review for assigned employees
   - View performance reviews
   - Edit performance reviews for assigned employees
   - View employee performance history
5. Staff
   - View own performance reviews
6. Cashier
   - View own performance reviews
## Performance History
Employee performance history displays:
- Employee
- Department
- Review Period
- Performance Score
- Reviewer
- Review Date
- Review Notes
## Empty State
+--------------------------------------+
|                                      |
|    No performance reviews found      |
|                                      |
|       [+ Add Performance Review]     |
|                                      |
+--------------------------------------+
The Add Performance Review action is only displayed to users with the required permission.
## Responsive Behavior
1. Desktop:
- Performance reviews displayed as a table
- Filters displayed horizontally
2. Tablet:
- Table supports horizontal scrolling
- Filters may wrap
3. Mobile:
- Reviews may use compact cards
- Form uses a single-column layout