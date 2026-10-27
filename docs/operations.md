# Store Operations & Admin Runbook

## 1. Daily Fulfillment Routine
1. Log in to the Admin Dashboard at `/admin` using your administrator or staff credentials.
2. Review the **Store Performance Overview**:
   - Check the **Awaiting Dispatch** count.
   - Check the **Low Stock Alerts** banner.
3. Open **Orders & Fulfillment** (`/admin/orders`):
   - Filter by status `CONFIRMED`.
   - Print packaging slips and pack items with protective packaging.
   - Hand parcels to the courier partner (India Post / Delhivery).
   - Click **Dispatch**, input the carrier name and AWB tracking number, and click **Confirm Dispatch**.
   - This automatically updates the order status to `SHIPPED` and dispatches an automated customer notification email.

---

## 2. Inventory Restocking Routine
1. Navigate to **Inventory & Alerts** (`/admin/inventory`).
2. Identify products flagged as **Low Stock** or **Out of Stock**.
3. Once a new shipment arrives from the artisan cooperative:
   - Click **Adjust** on the relevant product.
   - Enter the positive unit count (e.g., `+25`).
   - Select reason `Restock from Artisan Cluster`.
   - Submit. This automatically increments live stock and logs an immutable record in `InventoryMovement`.

---

## 3. Creating Seasonal Promotions
1. Navigate to **Coupons & Discounts** (`/admin/coupons`).
2. Create codes such as `DIWALI20` (Percentage or Flat discount).
3. Specify minimum order values and redemption limits to prevent coupon abuse.
