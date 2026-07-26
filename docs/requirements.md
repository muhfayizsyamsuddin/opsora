# Opsora

## Version

1.0.0

---

# 1. Project Overview

## Project Name

Opsora

## Tagline

Smart Inventory & Operations Management for Growing Businesses.

## Description

Opsora is a web-based inventory and operations management platform designed to help businesses manage products, inventory, suppliers, customers, purchases, and sales in one centralized system. The platform provides real-time inventory tracking, transaction history, and business insights through an intuitive dashboard.

---

# 2. Background

Many small and medium-sized businesses still rely on spreadsheets or manual processes to manage inventory and daily operations. This often leads to inaccurate stock records, duplicate data, delayed reporting, and difficulty tracking inventory movements.

Opsora aims to digitize these business processes by providing a centralized platform that improves operational efficiency, inventory accuracy, and business visibility.

---

# 3. Problem Statement

Businesses often face the following challenges:

- Stock quantities are difficult to monitor in real time.
- Inventory movements are not properly recorded.
- Purchase and sales records are scattered.
- Business reports require manual calculations.
- Product information is inconsistent.
- Business owners have limited visibility into daily operations.

---

# 4. Project Goals

The project aims to:

- Centralize inventory management.
- Improve stock accuracy.
- Simplify purchase and sales processes.
- Provide real-time business dashboards.
- Reduce manual work.
- Support business growth through better operational management.

---

# 5. Target Users

Opsora is designed for:

- Retail Stores
- Coffee Shops
- Fashion Stores
- Furniture Stores
- Electronics Stores
- Pharmacies
- Small & Medium Enterprises (SMEs)

---

# 6. User Roles

## Owner

Responsible for monitoring business performance.

Permissions:

- View Dashboard
- View Reports
- View Inventory
- View Sales
- View Purchases

Cannot modify operational data.

---

## Admin

Responsible for managing the system.

Permissions:

- Full CRUD
- Manage Users
- Manage Products
- Manage Inventory
- Manage Purchases
- Manage Sales
- Manage Suppliers
- Manage Customers

---

## Staff

Responsible for daily operations.

Permissions:

- Create Sales
- Create Purchases
- Update Inventory
- View Products
- View Customers
- View Suppliers

Cannot manage users.

---

# 7. Functional Requirements

Authentication

- Login
- Logout
- JWT Authentication
- Role-Based Access Control

Dashboard

- Sales Summary
- Purchase Summary
- Revenue Overview
- Low Stock Products
- Recent Transactions

Product Management

- Create Product
- Update Product
- Delete Product
- Product Image
- SKU
- Barcode
- Search
- Filter
- Pagination

Category Management

- CRUD Category

Supplier Management

- CRUD Supplier

Customer Management

- CRUD Customer

Purchase Management

- Create Purchase Order
- Receive Goods
- Increase Inventory

Sales Management

- Create Sales Order
- Generate Invoice
- Reduce Inventory

Inventory Management

- Inventory History
- Stock Adjustment
- Stock Movement

Reports

- Daily Report
- Monthly Report
- Sales Report
- Purchase Report
- Inventory Report

---

# 8. Non-Functional Requirements

Performance

- Fast response time
- Optimized database queries

Security

- JWT Authentication
- Password Hashing
- Authorization

Scalability

- Modular architecture
- RESTful API

Maintainability

- TypeScript
- Prisma ORM
- Clean Folder Structure

Deployment

- Docker
- Docker Compose
- GitHub Actions
- Nginx
- AWS EC2

---

# 9. Success Criteria

The project is considered complete when:

- User authentication works correctly.
- Role-based authorization is implemented.
- Product management is fully functional.
- Purchase and sales modules are operational.
- Inventory updates automatically.
- Dashboard displays accurate business data.
- Reports are generated correctly.
- Docker deployment works successfully.
- CI/CD pipeline deploys automatically.
- Application is accessible through a public domain.

---

# 10. Out of Scope (MVP)

The following features are excluded from the initial release:

- Mobile Application
- Accounting System
- Payroll
- AI Forecasting
- Multi Company
- Multi Currency
- Offline Mode
- Email Marketing

These features may be considered in future versions.

---

# 11. Future Roadmap

Version 2

- Barcode Scanner
- QR Code Support
- Warehouse Transfer
- Notification System

Version 3

- Mobile App
- AI Sales Prediction
- Demand Forecasting
- Multi Company Support