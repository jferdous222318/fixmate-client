# FixMate — Device & Appliance Repair Platform (Client)

FixMate is a role-based repair service platform. Verified technicians list the repair services they offer, customers send repair requests and follow each job step by step, and payment happens **only after the job is completed**. Admins approve listings, manage users, monitor every job and track Stripe revenue.

- **Live site:** https://fixmate-client-umber.vercel.app/


## Test accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fixmate.com | Fixmate123|
| Technician | tech1@fixmate.com | Fixmate123 |
| Customer | customer1@fixmate.com | Fixmate123|

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- **Three roles** (Customer, Technician, Admin) with BetterAuth + MongoDB adapter. Admin can never be chosen at sign up (forced to customer on the server).
- **Protected routes:** `proxy.ts` sends logged-out users to `/sign-in?redirect=…`, every dashboard layout re-checks the session on the server (reloading never logs you out), and opening another role's dashboard redirects with a "Forbidden" toast.
- **Server-side search, filter, sort & pagination** on `/services`; filters live in the URL, so they survive a reload.
- **Repair request flow** with read-only name/email, date validation and a duplicate active request guard.
- **Job status pipeline:** Requested → Accepted → In Progress → Completed (or Rejected / Cancelled); only valid next actions are shown and the server rejects everything else.
- **Pay after service with Stripe Checkout:** Pay Now appears only for completed + unpaid jobs; the amount always comes from the database; duplicate-safe payment saving.
- **Dashboards** with a collapsible role-based sidebar, reusable stat cards and hand-built SVG charts.
- **Technician tools:** add services with ImgBB upload, edit (goes back to pending), delete, availability toggle, final-amount modal.
- **Admin tools:** role management (cannot change own role), pending-first service approval, all-bookings monitor, transactions with total revenue.
- **Update Profile** for every role; new name and photo appear instantly without logging out.
- **Extras:** job timeline tracker, server-side pagination, custom 404 / error / loading pages, skeletons, empty states, confirmation modals and toasts.

## Tech & npm packages

`next` 16 (App Router, Turbopack), `react` 19, `typescript`, `tailwindcss` 4, `better-auth`, `mongodb`, `jsonwebtoken`, `lucide-react`, `sonner`, `clsx`.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in every value
npm run dev
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Express API base URL |
| `BETTER_AUTH_URL` | This site's URL |
| `BETTER_AUTH_SECRET` | BetterAuth secret |
| `MONGODB_URI`, `DB_NAME` | Same database as the server |
| `JWT_SECRET` | Must match the server's `JWT_SECRET` |
| `IMGBB_API_KEY` | ImgBB key, used only on the server side by `/api/upload` |
