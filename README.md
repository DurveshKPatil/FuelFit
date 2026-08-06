# FuelFit Protein - E-Commerce Store

A full-production Next.js e-commerce website for selling protein supplements. Built with TypeScript, Tailwind CSS, Prisma, NextAuth, Zustand, and Stripe.

## Features

- **Product catalog** - Browse, search, filter, and sort protein products by category
- **Product detail pages** - Images, nutrition highlights, ingredients, quantity selector
- **Shopping cart** - Add/remove/update items, free-shipping progress bar, persisted to localStorage
- **Checkout** - Full address capture with Stripe Checkout integration
- **Payment processing** - Stripe payments + webhooks that create orders automatically
- **User accounts** - Register/login (credentials + Google), order history, subscriptions, profile settings
- **Subscriptions** - Recurring protein delivery plans with Stripe billing
- **Admin dashboard** - Manage products (CRUD), view/update orders, customers, and subscriptions
- **Responsive design** - Mobile-first Tailwind UI

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (Credentials + Google)
- **Payments:** Stripe
- **State:** Zustand (with persist)
- **Forms:** React Hook Form + Zod (in admin)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 in dev) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

> **Demo mode (no Stripe keys):** If `STRIPE_SECRET_KEY` is missing or still a
> placeholder, checkout runs in demo mode — clicking **Proceed to Payment**
> completes instantly and skips to the success page (no charge). Add real keys to
> enable live card payments via Stripe Checkout.

### 3. Set up the database

```bash
npx prisma db push   # create tables
npm run db:seed      # seed products + admin user
```

Seed creates an admin account: **admin@fuelfit.com / admin12345**

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

> **No database configured?** The storefront (home, products, product detail) automatically falls back to built-in seed data so you can preview the UI without a database. Admin, accounts, orders, and checkout require a real database + Stripe keys.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed products + admin user |

## Project Structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── (pages)             # Home, products, cart, checkout, about
│   ├── account/            # User dashboard (orders, subscriptions, settings)
│   ├── admin/              # Admin dashboard (products, orders, customers)
│   ├── api/                # REST API routes
│   │   ├── auth/           # NextAuth
│   │   ├── products/       # Product catalog
│   │   ├── checkout/       # Stripe Checkout sessions
│   │   ├── webhooks/       # Stripe webhook handler
│   │   ├── orders/         # User orders
│   │   ├── subscriptions/  # User subscriptions
│   │   └── admin/          # Admin CRUD
├── components/
│   ├── layout/             # Header, Footer, CartDrawer
│   ├── products/           # ProductCard, ProductDetail
│   ├── cart/               # Cart UI
│   ├── admin/              # ProductFormModal
│   └── ui/                 # Toasts
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── stripe.ts           # Stripe helpers
│   ├── prisma.ts           # Prisma client
│   ├── data.ts             # Data layer (with seed fallback)
│   └── seed-data.ts        # Demo products
├── store/                  # Zustand cart store
└── types/                  # TypeScript types
```

## Stripe Testing

Use Stripe's test cards when checking out (4242 4242 4242 4242, any future date, any CVC) and run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` to test webhooks locally.

## Security Features

- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy set on all responses
- **Rate limiting** — per-IP limits on login, registration, checkout, webhooks, and admin routes
- **CSRF protection** — state-changing API routes reject requests whose `Origin` doesn't match the app host
- **Input validation** — Zod schemas on registration, checkout, and admin product/order mutations
- **Password policy** — min 8 chars, uppercase + lowercase + number, common-password blocklist, bcrypt cost 12
- **Login throttling** — per-account (email) and per-IP attempt limits
- **No secret exposure** — Stripe/NextAuth secrets only read server-side; errors return generic messages
