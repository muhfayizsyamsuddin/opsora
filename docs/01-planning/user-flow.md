# User Flow

Version: 2.0

Project: Opsora

Last Updated: 2026-08-10

---

# Overview

This document describes how users interact with Opsora to complete common
business and people operations.

Opsora is organized into two major areas:

- Core Business Operations
- People Operations

---

# User Roles

| Role | Description |
| --- | --- |
| Owner | Monitors business performance and operational information. |
| Admin | Manages system data and business operations. |
| Staff | Performs authorized daily operational activities. |

---

# Authentication Flow

```text
Open Login Page
        │
        ▼
Enter Email & Password
        │
        ▼
Validate Credentials
        │
   ┌────┴─────┐
   │          │
Success     Failed
   │          │
   ▼          ▼
Dashboard   Show Error
---

# Dashboard Flow

```
Login
  │
  ▼
Dashboard
  │
  ├── Core Business Operations
  │     ├── Products
  │     ├── Categories
  │     ├── Suppliers
  │     ├── Customers
  │     ├── Inventory
  │     ├── Purchases
  │     ├── Sales
  │     └── Reports
  │
  └── People Operations
        ├── Employees
        ├── Departments
        ├── Attendance
        ├── Leave
        └── Performance Review
```

---

# Category Management

```
Category List
      │
      ├── Search
      │
      └── Add Category
              │
              ▼
        Fill Category Form
              │
              ▼
          Validate Data
              │
         ┌────┴─────┐
         │          │
       Valid      Invalid
         │          │
         ▼          ▼
       Save      Show Error
         │
         ▼
     Category List
```

---

# Product Management

```
Product List
      │
      ├── Search / Filter
      │
      └── Add Product
              │
              ▼
        Fill Product Form
              │
              ▼
          Validate Data
              │
         ┌────┴─────┐
         │          │
       Valid      Invalid
         │          │
         ▼          ▼
       Save      Show Error
         │
         ▼
     Product List
```

---
# Supplier Management

```
Supplier List
      │
      ▼
Add / Edit Supplier
      │
      ▼
Fill Supplier Information
      │
      ▼
Validate Data
      │
 ┌────┴─────┐
 │          │
Valid     Invalid
 │          │
 ▼          ▼
Save     Show Error
 │
 ▼
Supplier List
```

# Customer Management

```
Customer List
      │
      ▼
Add / Edit Customer
      │
      ▼
Fill Customer Information
      │
      ▼
Validate Data
      │
 ┌────┴─────┐
 │          │
Valid     Invalid
 │          │
 ▼          ▼
Save     Show Error
 │
 ▼
Customer List
```

# Purchase Flow

```
Purchase List
      │
      ▼
Create Purchase
      │
      ▼
Select Supplier
      │
      ▼
Add Products
      │
      ▼
Enter Quantities & Prices
      │
      ▼
Save Purchase
      │
      ▼
Receive Goods
      │
      ▼
Update Inventory
      │
      ▼
Record Inventory Movement
      │
      ▼
Purchase Completed
```

---

# Sales Flow

```
Sales List
      │
      ▼
Create Sale
      │
      ▼
Select Customer
      │
      ▼
Add Products
      │
      ▼
Enter Quantities
      │
      ▼
Check Stock Availability
      │
 ┌────┴─────┐
 │          │
Available  Insufficient
 │          │
 ▼          ▼
Continue   Show Error
 │
 ▼
Calculate Total
 │
 ▼
Confirm Sale
 │
 ▼
Reduce Inventory
 │
 ▼
Record Inventory Movement
 │
 ▼
Sale Completed
```

---

# Inventory Flow

```
Inventory
    │
    ├── View Stock
    │
    ├── Search Product
    │
    ├── Filter Product
    │
    ├── View Stock Movement
    │
    ├── View Inventory History
    │
    └── Stock Adjustment
            │
            ▼
       Enter Adjustment
            │
            ▼
       Validate Quantity
            │
            ▼
       Update Inventory
            │
            ▼
    Record Stock Movement
```

# Employee Management Flow

```
Employee List
      │
      ├── Search / Filter
      │
      └── Add Employee
              │
              ▼
        Fill Employee Form
              │
              ▼
          Select Department
              │
              ▼
          Validate Data
              │
         ┌────┴─────┐
         │          │
       Valid      Invalid
         │          │
         ▼          ▼
       Save      Show Error
         │
         ▼
     Employee List
```

# Department Management Flow

```
Department List
      │
      ▼
Add / Edit Department
      │
      ▼
Fill Department Information
      │
      ▼
Validate Data
      │
 ┌────┴─────┐
 │          │
Valid     Invalid
 │          │
 ▼          ▼
Save     Show Error
 │
 ▼
Department List
```

# Attendance Management Flow

```
Attendance
    │
    ▼
Select Employee
    │
    ▼
Record Attendance
    │
    ▼
Select Attendance Status
    │
    ▼
Save Attendance
    │
    ▼
Attendance History
```

# Leave Management Flow

```
Leave List
    │
    ▼
Create Leave Request
    │
    ▼
Select Employee
    │
    ▼
Enter Leave Information
    │
    ▼
Submit Request
    │
    ▼
Validate Request
    │
 ┌──┴──────┐
 │         │
Valid    Invalid
 │         │
 ▼         ▼
Save     Show Error
 │
 ▼
Leave History
```

# Performance Review Flow

```
Performance Review
        │
        ▼
Select Employee
        │
        ▼
Select Review Period
        │
        ▼
Enter Performance Score
        │
        ▼
Enter Review Notes
        │
        ▼
Save Review
        │
        ▼
Performance Review History
```
---

# Report Flow

```
Reports
    │
    ├── Sales Report
    ├── Purchase Report
    └── Inventory Report
           │
           ▼
     Select Date Range
           │
           ▼
      Generate Report
           │
           ▼
       View Report
```

---

# Logout Flow

```
Application
     │
     ▼
Open User Menu
     │
     ▼
Logout
     │
     ▼
Clear Session
     │
     ▼
Redirect to Login
```

---

# Overall User Journey

```
Login
  │
  ▼
Dashboard
  │
  ├───────────────────────────┐
  │                           │
  ▼                           ▼
Core Business            People Operations
  │                           │
  ├── Products                ├── Employees
  ├── Categories              ├── Departments
  ├── Suppliers               ├── Attendance
  ├── Customers               ├── Leave
  ├── Purchases               └── Performance Review
  ├── Sales
  ├── Inventory
  └── Reports
  │
  ▼
Logout
```

---

# Future User Flows

- Barcode scanning
- Stock adjustment improvements
- Purchase returns
- Sales returns
- Multi-warehouse operations
- Warehouse transfers
- Notifications
- Multi-company operations