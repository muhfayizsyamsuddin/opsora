# Wireframe / Screen Specification

Version: 1.0

Status: Draft

Author: Faiz

Last Updated: 2026-07-27

---

# Overview

This document describes the layout and behavior of every screen in Opsora.

The goal is to define what each page should contain before visual design and implementation begin.

This document focuses on:

- Screen purpose
- Components
- User actions
- Navigation
- Validation
- Related User Stories

---

# Screen Map

```text
Authentication
└── Login

Dashboard
├── Dashboard
├── Categories
├── Products
├── Suppliers
├── Customers
├── Purchases
├── Sales
├── Inventory
├── Reports
└── Settings
```

---

# Global Layout

All authenticated pages use the same layout.

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

Menu

- Dashboard
- Categories
- Products
- Suppliers
- Customers
- Purchases
- Sales
- Inventory
- Reports
- Settings

---

## Top Navigation

Contains

- Search
- Notification
- Theme Toggle
- User Profile
- Logout

---

# Login Screen

## Purpose

Authenticate users.

## Related User Stories

- US-001
- US-002

## Layout

```text
+--------------------------------------+
|              Opsora Logo             |
|                                      |
| Email                                |
| [__________________________]          |
|                                      |
| Password                             |
| [__________________________]          |
|                                      |
| Remember Me              Forgot?     |
|                                      |
|        [ Login Button ]              |
+--------------------------------------+
```

## Components

- Logo
- Email Input
- Password Input
- Remember Me
- Login Button

## Actions

- Login

## Validation

- Email required
- Password required
- Invalid credentials

---

# Dashboard

## Purpose

Provide business overview.

## Related User Stories

- US-003

## Layout

```text
+-----------------------------------------------------------+
| Dashboard                                                  |
+-----------------------------------------------------------+

+-----------+ +-----------+ +-----------+ +-----------+
| Products  | | Revenue   | | Purchases | | Customers |
+-----------+ +-----------+ +-----------+ +-----------+

+-------------------------------------------+
| Revenue Chart                             |
+-------------------------------------------+

+----------------------+--------------------+
| Recent Sales         | Low Stock Products |
+----------------------+--------------------+
```

## Components

- KPI Cards
- Revenue Chart
- Recent Transactions
- Low Stock Table

---

# Category Screen

## Purpose

Manage product categories.

## Layout

```text
-------------------------------------------------------------
Search ____________

                [+ Add Category]

-------------------------------------------------------------
| Name | Created At | Action |
-------------------------------------------------------------
|      |            | Edit Delete |
-------------------------------------------------------------
```

## Actions

- Create
- Edit
- Delete
- Search

---

# Product List

## Purpose

Manage products.

## Layout

```text
Search _______________________

Category ▼

Stock ▼

              [+ Add Product]

----------------------------------------------------------------------
| Image | SKU | Product | Category | Stock | Price | Status | Action |
----------------------------------------------------------------------

Pagination
```

## Components

- Search
- Filter
- Table
- Pagination

## Actions

- Add Product
- Edit Product
- Delete Product
- View Product

---

# Product Form

## Purpose

Create or edit products.

## Layout

```text
Product Name

[____________________________]

SKU

[____________________________]

Category

[ Dropdown ]

Purchase Price

[________]

Selling Price

[________]

Stock

[________]

Unit

[ Dropdown ]

Image

[ Upload ]

------------------------

Cancel        Save
```

## Validation

- Required fields
- SKU unique
- Positive prices
- Positive stock

---

# Supplier Screen

## Components

- Supplier Table
- Search
- Add Button
- Pagination

CRUD Supplier

---

# Customer Screen

## Components

- Customer Table
- Search
- Add Button
- Pagination

CRUD Customer

---

# Purchase Screen

## Layout

```text
Supplier

[ Dropdown ]

Purchase Date

[ Date ]

---------------------------------

Product

Qty

Price

+ Add Item

---------------------------------

Total

[ Save ]
```

## System Behavior

After saving

- Increase stock
- Create purchase record
- Create stock movement

---

# Sales Screen

## Layout

```text
Customer

[ Dropdown ]

--------------------------------

Search Product

--------------------------------

Cart

--------------------------------

Subtotal

Discount

Grand Total

--------------------------------

Cash

Transfer

QRIS

--------------------------------

Complete Transaction
```

## System Behavior

After saving

- Reduce stock
- Generate invoice
- Save transaction
- Create stock movement

---

# Inventory Screen

## Components

- Inventory Table
- Search
- Filter
- Stock Adjustment
- Stock Movement

---

# Reports Screen

## Components

Cards

- Sales Report
- Purchase Report
- Inventory Report
- Profit Report

Filters

- Date Range
- Export PDF
- Export Excel

---

# Settings Screen

## Components

- Company Profile
- User Management
- Roles & Permissions
- Change Password
- System Preferences

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

# Design Principles

- Minimal interface
- Fast navigation
- Consistent spacing
- Accessible colors
- Mobile-first responsive design

---

# Future Screens

- Barcode Scanner
- QR Inventory
- Warehouse Transfer
- AI Forecast
- Notification Center
- Audit Logs

---

# Related Documents

- requirements.md
- user-stories.md
- user-flow.md
- erd.md

---

# Revision History

| Version | Date | Description |
|----------|------------|----------------|
| 1.0 | 2026-07-27 | Initial version |