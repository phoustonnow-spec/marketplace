# market.place

A multi-tenant marketplace where every seller gets their own storefront on their
own subdomain — `you.market.place`. Sellers manage inventory (categories,
channels, products with photos), buyers browse each store and check out.

**Stack:** Next.js (App Router) · Supabase (Postgres + Auth + Storage) · Stripe
(seller subscriptions) · Tailwind · deploys to Vercel.

## What's here

```
app/
  page.tsx                     landing page (apex domain)
  login/, signup/              seller auth
  dashboard/                   seller admin — inventory, categories, settings, subscribe
  s/[subdomain]/               a seller's public storefront (served on their subdomain)
    p/[id]/                     product page
    checkout/[id]/              buyer checkout (address → pay)
  api/stripe/                  subscription checkout + webhook
lib/
  subdomain.ts                 maps host → seller subdomain
  supabase/                    server / browser / admin clients
  stripe.ts
middleware.ts                  rewrites jane.market.place → /s/jane + refreshes auth
supabase/schema.sql            paste into Supabase SQL editor
```

## Setup

See **[SETUP.md](./SETUP.md)** for the full cut-and-paste guide (domain,
Supabase, Stripe, Vercel). Short version:

1. `cp .env.example .env.local` and fill in your keys.
2. Create a Supabase project; run `supabase/schema.sql` in its SQL editor.
3. Create a Stripe $4/mo price; add keys to `.env.local`.
4. `npm install && npm run dev` → open `http://localhost:3000`.

Locally, storefront subdomains work at `http://<name>.localhost:3000`.
