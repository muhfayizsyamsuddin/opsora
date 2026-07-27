# User Flow

> Version: 1.0
> Project: Opsora
> Last Updated: July 2026

---

# Overview

This document describes how each user interacts with the Opsora system to complete common business processes.

---

# User Roles

| Role | Description |
|------|-------------|
| Super Admin | Full system access and configuration |
| Admin | Manages inventory and business data |
| Cashier | Handles sales transactions |
| Manager | Monitors reports and business performance |

---

# Authentication Flow

```
Open Login Page
        │
        ▼
Enter Email & Password
        │
        ▼
Validate Credentials
        │
   ┌────┴────┐
   │         │
Success    Failed
   │         │
   ▼         ▼
Dashboard  Show Error
```

---

# Dashboard Flow

```
Login
   │
   ▼
Dashboard
   │
   ├── Products
   ├── Categories
   ├── Suppliers
   ├── Customers
   ├── Purchases
   ├── Sales
   ├── Inventory
   ├── Reports
   └── Settings
```

---

# Category Management

```
Category List
      │
      ▼
Click Add
      │
      ▼
Fill Form
      │
      ▼
Save
      │
      ▼
Validation
      │
 ┌────┴─────┐
 │          │
Success   Failed
 │          │
 ▼          ▼
List     Show Error
```

---

# Product Management

```
Product List
      │
      ▼
Add Product
      │
      ▼
Fill Product Form
      │
      ▼
Save Product
      │
      ▼
Validation
      │
 ┌────┴────┐
 │         │
Valid   Invalid
 │         │
 ▼         ▼
Saved   Error Message
```

---

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
Select Products
      │
      ▼
Enter Quantity
      │
      ▼
Save Purchase
      │
      ▼
Update Inventory
      │
      ▼
Purchase Completed
```

---

# Sales Flow

```
Sales Page
     │
     ▼
Select Customer
     │
     ▼
Add Products
     │
     ▼
Input Quantity
     │
     ▼
Calculate Total
     │
     ▼
Choose Payment Method
     │
     ▼
Confirm Transaction
     │
     ▼
Reduce Stock
     │
     ▼
Generate Invoice
```

---

# Inventory Flow

```
Inventory
     │
     ├── View Stock
     ├── Search Product
     ├── Filter Product
     ├── Stock Adjustment
     └── Stock Movement
```

---

# Report Flow

```
Reports
    │
    ├── Sales Report
    ├── Purchase Report
    ├── Inventory Report
    └── Profit Report
         │
         ▼
Select Date Range
         │
         ▼
Generate Report
         │
         ├── View
         ├── Export PDF
         └── Export Excel
```

---

# Logout Flow

```
Click Profile
      │
      ▼
Logout
      │
      ▼
Remove Session
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
  ├─────────────┐
  │             │
Manage Data     Transactions
  │             │
  │             ├── Purchase
  │             └── Sales
  │
  ▼
Inventory Updated
  │
  ▼
Reports
  │
  ▼
Logout
```

---

# Future User Flows

- Barcode Scanning
- QR Inventory
- Multi Warehouse
- AI Demand Forecast
- Notification Center