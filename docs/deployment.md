# Production Deployment Guide: Railway & Self-Hosted

This guide outlines step-by-step instructions to deploy BharatBazaar to Railway with PostgreSQL.

---

## 1. Railway Architecture
A production deployment on Railway consists of:
1. **PostgreSQL Service**: Managed database with automated backups and persistent storage volume.
2. **Web Application Service**: Built using the provided multi-stage `Dockerfile`.
3. **Environment Variables**: Injected securely via Railway dashboard.

---

## 2. Step-by-Step Railway Deployment

### Step A: Create a New Project on Railway
1. Log in to [railway.app](https://railway.app).
2. Click **New Project** → **Provision PostgreSQL**.
3. Under the PostgreSQL service settings, note the private connection URL:
   ```
   DATABASE_URL=postgresql://${{PGUSER}}:${{PGPASSWORD}}@${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}
   ```

### Step B: Deploy the Application Service
1. In the same project, click **New Service** → **GitHub Repo** (select this repository).
2. Railway detects `railway.json` and `Dockerfile` automatically.

### Step C: Configure Production Environment Variables
Under the application service **Variables** tab, set:

| Variable | Description | Example / Note |
|---|---|---|
| `DATABASE_URL` | Reference Railway Postgres | `${{Postgres.DATABASE_URL}}` |
| `NEXT_PUBLIC_APP_URL` | Production custom domain | `https://store.yourdomain.in` |
| `APP_ENV` | Environment name | `production` |
| `AUTH_SECRET` | 32+ char secret for JWT | Generate with `openssl rand -hex 32` |
| `RAZORPAY_KEY_ID` | Razorpay Live Key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Key Secret | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | Configured in Razorpay dashboard |
| `RESEND_API_KEY` | Resend production API key | `re_...` |
| `EMAIL_FROM` | Verified sender domain email | `orders@yourdomain.in` |
| `STORAGE_ENDPOINT` | Cloudflare R2 endpoint | `https://<account-id>.r2.cloudflarestorage.com` |
| `STORAGE_BUCKET` | R2 Bucket Name | `bharatbazaar-prod` |
| `STORAGE_ACCESS_KEY_ID` | R2 API Token Key | `...` |
| `STORAGE_SECRET_ACCESS_KEY` | R2 API Token Secret | `...` |
| `STORAGE_PUBLIC_URL` | Custom CDN domain | `https://media.yourdomain.in` |
| `ADMIN_BOOTSTRAP_EMAIL` | Initial admin account | `admin@yourdomain.in` |
| `ADMIN_BOOTSTRAP_PASSWORD` | Strong password | `StrongPassword@2026` |

### Step D: Execute Migrations
Once the deployment connects to PostgreSQL:
```bash
npx prisma migrate deploy
```
To seed initial categories and products into the empty database:
```bash
npm run seed
```

### Step E: Configure Webhooks in Razorpay Dashboard
1. Go to **Razorpay Dashboard** → **Settings** → **Webhooks**.
2. Click **Add New Webhook**.
3. Set Webhook URL: `https://store.yourdomain.in/api/webhooks/razorpay`
4. Set Secret: Enter the exact value from `RAZORPAY_WEBHOOK_SECRET`.
5. Select Active Events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

---

## 3. Database Backup & Disaster Recovery
- **Automated Railway Backups**: Enable automated daily snapshots under Railway Postgres service settings.
- **Manual pg_dump export**:
  ```bash
  pg_dump "$DATABASE_URL" -F c -b -v -f "bharatbazaar_backup_$(date +%Y%m%d).dump"
  ```
- **Restore Procedure**:
  ```bash
  pg_restore -d "$DATABASE_URL" -v "bharatbazaar_backup_YYYYMMDD.dump"
  ```
