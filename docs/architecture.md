# BharatBazaar Architecture & System Design

## 1. Overview
BharatBazaar is a production-ready, full-stack Indian e-commerce platform built on Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

The platform is designed to sell authentic Indian heritage products, handicrafts, organic spices, and Ayurvedic formulations. All prices, taxes, and shipping rules are authoritatively calculated and enforced on the server in Indian Rupees (INR, minor units in paise).

---

## 2. Technology Stack & Key Libraries
- **Application Framework**: Next.js 16 (App Router with Server Components & Server Actions)
- **Frontend Engine**: React 19, Tailwind CSS, Lucide React icons
- **Validation**: Zod with strict schemas
- **Database & ORM**: PostgreSQL with Prisma ORM 6 (schema, migrations, transactions, connection pooling)
- **Authentication**: Stateless, cryptographically signed HTTP-only JWT cookies (`jose`, `bcryptjs`)
- **Payment Processing**: Razorpay (server order creation, client checkout, HMAC-SHA256 signature verification, and idempotent webhook handlers)
- **Object Storage**: S3-compatible Cloudflare R2 abstraction with local fallback
- **Transactional Email**: Resend SDK with HTML order confirmation templates
- **Testing**: Vitest with unit test suites for currency, PIN code, and shipping calculations

---

## 3. High-Level System Architecture Diagram

```
+-------------------------------------------------------------+
|                     Next.js Storefront / Admin              |
|   (Customer Pages, Cart Drawer, Checkout, Admin Dashboard)   |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON APIs
                              |
                              v
+-------------------------------------------------------------+
|                     Next.js Route Handlers                  |
|    /api/auth/*  |  /api/cart/*  |  /api/checkout            |
|    /api/payments/verify         |  /api/webhooks/razorpay   |
|    /api/admin/*                 |  /api/health              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     Core Service Layer                      |
|  productService  |  cartService    |  orderService          |
|  couponService   |  adminService   |  settingsService       |
|  shippingService |  razorpayService|  emailService          |
+-------------------------------------------------------------+
           |                                  |
           v                                  v
+-----------------------+         +-----------------------+
|  PostgreSQL Database  |         |   External Providers  |
|  - Users & Addresses  |         |   - Razorpay API      |
|  - Products & Images  |         |   - Resend Email      |
|  - Orders & Items     |         |   - Cloudflare R2     |
|  - Payments & Logs    |         +-----------------------+
+-----------------------+
```

---

## 4. Key Architectural Guarantees
1. **Server Authority**: The browser is never trusted for totals, item prices, or discounts. All totals are calculated in integer paise.
2. **Atomic Inventory Control**: Deducting stock during checkout and restoring stock upon order cancellation occurs inside `prisma.$transaction`.
3. **Historical Snapshots**: Every order creates permanent snapshots of product name, SKU, price, and primary image. Later edits to products never alter past orders.
4. **Idempotent Webhooks**: All incoming webhook events are recorded in `WebhookEvent`. Duplicate webhooks are ignored immediately.
