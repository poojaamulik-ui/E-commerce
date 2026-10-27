# BharatBazaar API Reference

All monetary amounts in request and response payloads are represented in **Paise** (integer minor units, where `₹1.00 = 100 paise`) to prevent floating-point inaccuracies.

---

## 1. Authentication APIs

### `POST /api/auth/login`
- **Request Body**: `{ "email": "admin@bharatbazaar.in", "password": "..." }`
- **Response**: `{ "success": true, "user": { "id": "...", "name": "...", "role": "ADMIN" } }`
- **Cookie**: Sets HTTP-only `bb_session` JWT token.

### `POST /api/auth/register`
- **Request Body**: `{ "name": "Aarav Sharma", "email": "...", "password": "...", "phone": "9876543210" }`
- **Response**: `{ "success": true, "user": { ... } }` (HTTP 201)

### `POST /api/auth/logout`
- **Response**: Clears `bb_session` cookie.

### `GET /api/auth/me`
- **Response**: Returns current session state `{ "authenticated": true, "user": { ... } }`.

---

## 2. Cart & Promotions APIs

### `GET /api/cart`
- Returns cart items, computed unit prices, stock check, and subtotal in paise.

### `POST /api/cart/items`
- **Request Body**: `{ "productId": "...", "quantity": 1 }`
- Revalidates available database stock.

### `PATCH /api/cart/items/[itemId]`
- **Request Body**: `{ "quantity": 2 }`

### `DELETE /api/cart/items/[itemId]`
- Removes item from cart.

### `POST /api/coupons/validate`
- **Request Body**: `{ "code": "NAMASTE10" }`
- **Response**: `{ "success": true, "coupon": { "code": "NAMASTE10", "discountAmountPaise": 30000 } }`

---

## 3. Checkout & Payment APIs

### `POST /api/checkout`
- **Request Body**:
  ```json
  {
    "customerName": "Aarav Sharma",
    "customerEmail": "aarav@example.in",
    "customerPhone": "9876543210",
    "street": "Flat 402, Lotus Residency",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "couponCode": "NAMASTE10"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "order": { "orderNumber": "BB-20261027-1234", "totalAmount": 149900 },
    "payment": {
      "provider": "RAZORPAY",
      "razorpayOrderId": "order_...",
      "razorpayKeyId": "rzp_..."
    }
  }
  ```

### `POST /api/payments/verify`
- Validates cryptographic HMAC-SHA256 signature and captures payment.

### `POST /api/webhooks/razorpay`
- Authoritative server-to-server webhook handler with raw body HMAC verification and idempotency tracking.

---

## 4. Admin Management APIs (Protected by `ADMIN` / `STAFF` Role)

### `PATCH /api/admin/orders/[id]/status`
- **Request Body**: `{ "status": "PROCESSING", "adminNotes": "Packed in dispatch box" }`

### `POST /api/admin/orders/[id]/shipment`
- **Request Body**: `{ "carrier": "Delhivery Express", "trackingNumber": "DLV-12345678" }`

### `POST /api/admin/products`
- **Request Body**: New product details, SKU, prices in paise, stock quantity, category IDs.

### `POST /api/admin/inventory`
- **Request Body**: `{ "productId": "...", "delta": 25, "reason": "RESTOCK" }`

### `POST /api/admin/upload`
- Multipart form data file upload to Cloudflare R2 / S3.

### `GET /api/health`
- Health check route for load balancers and orchestrators.
