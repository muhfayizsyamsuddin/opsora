# Data Dictionary

Version: 1.0

Status: Draft

Author: Faiz

Last Updated: 2026-07-27

---

# Overview

This document defines the meaning, format, validation rules, and examples for all database fields used in Opsora.

It complements the Entity Relationship Diagram (ERD) by describing each field in detail.

---

# Naming Standards

### Table Names

- snake_case
- plural

Examples

users

products

sale_items

---

### Column Names

- snake_case

Examples

purchase_price

minimum_stock

created_at

---

### Foreign Keys

Format

<entity>_id

Examples

product_id

supplier_id

customer_id

---

# Common Fields

### id

Description

Primary key.

Type

UUID

---

### created_at

Description

Timestamp when the record was created.

Type

TIMESTAMP

---

### updated_at

Description

Timestamp when the record was last updated.

Type

TIMESTAMP

---

### deleted_at

Description

Soft delete timestamp.

Only used for master data.

Type

TIMESTAMP NULL

---

# Entity Fields

## Common Fields

| Field     | Type          | Description               | Example                               |
|--------   |------         |-------------              |---------                              |
| id        | UUID          | Primary identifier        | 550e8400-e29b-41d4-a716-446655440000  |
| created_at| TIMESTAMP     | Record creation timestamp | 2026-07-27 08:00:00 UTC               |
| updated_at| TIMESTAMP     | Last update timestamp     | 2026-07-27 10:30:00 UTC               |
| deleted_at| TIMESTAMP NULL| Soft delete timestamp     | NULL                                  |

## Products

| Field         | Type          | Required  | Validation | Description                      |
|--------       |------         |---------- |------------|-------------                     | 
| sku           | VARCHAR(50)   | Yes       | Unique            | Product code              |
| barcode       | VARCHAR(100)  | No        | Unique if provided| Product barcode           |
| name          | VARCHAR(150)  | Yes       | Required          | Product name              |
| purchase_price| DECIMAL(15,2) | Yes       | >= 0              | Current purchase price    |
| selling_price | DECIMAL(15,2) | Yes       | >= purchase_price | Current selling price     |
| stock         | INTEGER       | Yes       | >= 0              | Current available stock   |
| minimum_stock | INTEGER       | Yes       | >= 0              | Stock alert threshold     |
| unit          | VARCHAR(20)   | Yes       | Required          | Product unit              |
| image_url     | TEXT          | No        | Valid URL         | Product image             |

## Purchases

| Field             | Type          | Description                   |
|--------           |------         |-------------                  |
| purchase_number   | VARCHAR(50)   | Business purchase identifier  |
| supplier_id       | UUID          | Supplier reference            |
| user_id           | UUID          | User who created transaction  |
| transaction_date  | DATE          | Purchase date                 |
| total_amount      | DECIMAL(15,2) | Sum of purchase items         |
| status            | PurchaseStatus| Purchase status               |
| notes             | TEXT          | Additional notes              |

## Purchase Items

| Field         | Type          | Description               |
|--------       |------         |-------------              |
| purchase_id   | UUID          | Parent purchase           |
| product_id    | UUID          | Purchased product         |
| quantity      | INTEGER       | Purchased quantity        |
| purchase_price| DECIMAL(15,2) | Snapshot purchase price   |
| subtotal      | DECIMAL(15,2) | quantity × purchase_price |

## Sales

| Field             | Type          | Description               |
|--------           |------         |-------------              |
| invoice_number    | VARCHAR(50)   | Business invoice number   |
| customer_id       | UUID          | Customer reference        |
| user_id           | UUID          | Cashier/Admin             |
| transaction_date  | DATE          | Sales date                |
| total_amount      | DECIMAL(15,2) | Sum of sale items         |
| status            | SaleStatus    | Sales status              |
| notes             | TEXT          | Additional notes          |

## Sale Items

| Field         | Type          | Description               |
|--------       |------         |-------------              |
| sale_id       | UUID          | Parent sale               |
| product_id    | UUID          | Sold product              |
| quantity      | INTEGER       | Sold quantity             |
| selling_price | DECIMAL(15,2) | Snapshot selling price    |
| subtotal      | DECIMAL(15,2) | quantity × selling_price  |

## Inventory Movements

| Field         | Type                  | Description                   |
|--------       |------                 |-------------                  |
| product_id    | UUID                  | Product reference             |
| reference_type| InventoryReferenceType| Source transaction            |
| reference_id  | UUID                  | Related transaction           |
| before_stock  | INTEGER               | Stock before movement         |
| quantity      | INTEGER               | Positive or negative movement |
| after_stock   | INTEGER               | Stock after movement          |
| notes         | TEXT                  | Additional notes              |

## UserRole

| Value         | Description                   |
|--------       |-------------                  |
| SUPER_ADMIN   | Full system access            |
| ADMIN         | Manage master and transactions|
| MANAGER       | Reports and monitoring        |
| CASHIER       | Sales transactions            |

---

## PurchaseStatus

| Value     | Description           |
|--------   |-------------          |
| DRAFT     | Not finalized         |
| COMPLETED | Inventory updated     |
| CANCELLED | Cancelled transaction |

---

## SaleStatus

| Value     | Description           |
|--------   |-------------          |
| PENDING   | Waiting for payment   |
| PAID      | Payment completed     |
| VOID      | Cancelled sale        |

---

## InventoryReferenceType

| Value     | Description               |
|--------   |-------------              |
| PURCHASE  | Purchase transaction      |
| SALE      | Sales transaction         |
| ADJUSTMENT| Manual stock adjustment   |

## UserRole

| Value         | Description                   |
|--------       |-------------                  |
| SUPER_ADMIN   | Full system access            |
| ADMIN         | Manage master and transactions|
| MANAGER       | Reports and monitoring        |
| CASHIER       | Sales transactions            |

---

## PurchaseStatus

| Value     | Description           |
|--------   |-------------          |
| DRAFT     | Not finalized         |
| COMPLETED | Inventory updated     |
| CANCELLED | Cancelled transaction |

---

## SaleStatus

| Value     | Description           |
|--------   |-------------          |
| PENDING   | Waiting for payment   |
| PAID      | Payment completed     |
| VOID      | Cancelled sale        |

---

## InventoryReferenceType

| Value     | Description               |
|--------   |-------------              |
| PURCHASE  | Purchase transaction      |
| SALE      | Sales transaction         |
| ADJUSTMENT| Manual stock adjustment   |

## Glossary

| Term               | Definition                              |
| ------------------ | --------------------------------------- |
| SKU                | Stock Keeping Unit, kode unik produk    |
| Barcode            | Kode produk untuk proses scanning       |
| Purchase           | Transaksi pembelian dari supplier       |
| Sale               | Transaksi penjualan ke customer         |
| Inventory Movement | Riwayat perubahan stok                  |
| Walk-in Customer   | Pelanggan umum tanpa data lengkap       |
| Snapshot Price     | Harga yang disimpan pada saat transaksi |
