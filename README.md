# Nestora — Home • Living • Decor E-Commerce Platform

A production-ready e-commerce web application built with Next.js 16 (App Router), Tailwind CSS v4, Prisma ORM, and PostgreSQL.

---

## Features

- **Storefront**: High-aesthetic homepage with hero banner, 6 categories, and featured picks.
- **Product Catalog**: Multi-attribute filtering (categories, availability, price sorting).
- **Product Details**: Multi-angle image gallery, variant swatches, stock counter, and dual CTAs (*Add to Cart* & *Buy Now*).
- **Shopping Cart**: Client & server synchronized cart with instant quantity adjusters.
- **Checkout Flow**: Multi-step checkout (Shipping Address, Payment Method with Razorpay UPI/Card/COD, Order Review).
- **Customer Account**: Profile management, order history, and tracking timeline.
- **Admin Dashboard**: Catalog management, order fulfillment, status transitions, and store settings.

---

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/poojaamulik-ui/E-commerce.git
   cd E-commerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database & Seed Data**:
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:2525](http://localhost:2525) in your browser.

---

## Deploying on Railway

1. **Create a New Project on Railway**:
   - Go to [railway.app](https://railway.app) and click **"New Project"**.
   - Select **"Deploy from GitHub repo"** and choose `poojaamulik-ui/E-commerce`.

2. **Add PostgreSQL Service**:
   - In your Railway project canvas, click **"New"** -> **"Database"** -> **"Add PostgreSQL"**.
   - Railway automatically sets the `DATABASE_URL` environment variable for your connected service.

3. **Set Environment Variables on Railway**:
   In the **Variables** tab of your Next.js service:
   - `AUTH_SECRET`: Any random 32+ character string
   - `NEXT_PUBLIC_APP_URL`: Your Railway domain (e.g. `https://your-app.up.railway.app`)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret

4. **Run Migrations & Seed**:
   Under your service settings, set the **Deploy Command**:
   ```bash
   npx prisma migrate deploy && npm run seed && npm run start
   ```
   Or run database commands from Railway CLI / web console:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

---

## Testing

```bash
npm test
```
