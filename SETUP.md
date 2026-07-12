# market.place — full setup guide (cut & paste)

You'll set up four things: a **domain**, **Supabase** (database), **Stripe**
(payments), and **Vercel** (hosting). Total hands-on time ≈ 30–45 min. Every
value you need to copy is called out in `CODE FONT`.

Only three steps genuinely require *you* (your identity / your money): buying the
domain, verifying your Stripe account, and authorizing Vercel. Everything else is
copy-paste.

---

## 1) Buy the domain `market.place`

1. Go to a registrar — **Porkbun**, **Namecheap**, or **Cloudflare Registrar**.
2. Search `market.place`. (`.place` domains are cheap unless it's flagged
   *premium* — if `market.place` is taken or premium, good fallbacks:
   `themarket.place`, `mymarket.place`, or `getmarketplace.com`.)
3. Buy it. You don't need to touch DNS yet — we do that in step 5.

> Whatever domain you land on, remember it — you'll paste it as
> `NEXT_PUBLIC_ROOT_DOMAIN` later (e.g. `market.place`).

---

## 2) Supabase — the database

1. Go to **supabase.com** → **New project**. Name it `marketplace`, pick a region
   near your buyers, set a database password (save it), create.
2. When it's ready, open **SQL Editor** → **New query**. Open the file
   `supabase/schema.sql` from this project, copy the whole thing, paste, and
   click **Run**. You should see "Success". (This creates all tables, security
   rules, the signup trigger, and the photo storage bucket.)
3. Go to **Authentication → Providers → Email** and turn **OFF**
   "Confirm email". (For launch you can turn it back on; off keeps signup
   instant while you test.)
4. Go to **Project Settings → API** and copy these three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 3) Stripe — payments ($4/mo seller membership)

1. Go to **stripe.com** → create an account. Complete **business + identity
   verification** and add your **bank account** (this is the part only you can
   do — it's how payouts reach you).
2. **Products → Add product**: name `Seller membership`, price **$4.00**,
   recurring **monthly**. Save, then copy the **Price ID** (`price_...`) →
   `STRIPE_PRICE_ID`.
3. **Developers → API keys**: copy
   - **Secret key** (`sk_...`) → `STRIPE_SECRET_KEY`
   - **Publishable key** (`pk_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. The **webhook** secret comes *after* deploy (step 6) — leave
   `STRIPE_WEBHOOK_SECRET` blank for now.

> Tip: use **Test mode** keys first (toggle top-right). Switch to live keys when
> you're ready to charge real cards.

---

## 4) Put the code on GitHub

1. Create an empty repo at **github.com/new** called `marketplace`.
2. In this project folder run:
   ```bash
   git init
   git add .
   git commit -m "market.place initial"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/marketplace.git
   git push -u origin main
   ```

---

## 5) Deploy on Vercel + connect the domain

1. Go to **vercel.com** → **Add New → Project** → import your `marketplace` repo.
2. Before deploying, open **Environment Variables** and add every line from
   `.env.example`, using the values you copied. Set
   `NEXT_PUBLIC_ROOT_DOMAIN` to your real domain (e.g. `market.place`). Deploy.
3. In the project → **Settings → Domains**, add **both**:
   - `market.place`
   - `*.market.place`  ← the wildcard is what gives every seller a subdomain
4. Vercel shows you DNS records to add. Go to your registrar's DNS settings and:
   - Add the record Vercel gives for the apex (`market.place`).
   - Add a **CNAME** for `*` (host `*`) pointing to `cname.vercel-dns.com`.
   Wait a few minutes for it to verify (green checkmarks in Vercel).

---

## 6) Finish the Stripe webhook

1. In **Stripe → Developers → Webhooks → Add endpoint**, set the URL to
   `https://market.place/api/stripe/webhook`.
2. Select events: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`. Add it.
3. Copy the endpoint's **Signing secret** (`whsec_...`).
4. Back in **Vercel → Settings → Environment Variables**, set
   `STRIPE_WEBHOOK_SECRET` to that value, then **redeploy** (Deployments → ⋯ →
   Redeploy).

---

## 7) Test it

1. Visit `https://market.place` → **Start selling** → create an account and pick
   a subdomain like `janes`.
2. In the dashboard, add a master category, a channel, then an item with photos.
3. Click **View store** → you land on `https://janes.market.place` with your
   listing. Open a product → **Buy securely** runs the checkout flow.
4. Click **Activate membership** → Stripe checkout → after paying (test card
   `4242 4242 4242 4242`), the banner disappears (webhook flipped you to active).

---

## Running locally

```bash
cp .env.example .env.local   # fill in your values; ROOT_DOMAIN=localhost:3000
npm install
npm run dev
```

Open `http://localhost:3000`. Storefront subdomains work as
`http://janes.localhost:3000` (modern browsers resolve `*.localhost`
automatically).

---

## What's built vs. next

**Working now:** seller accounts, per-seller subdomains, categories/channels,
products with photo upload, public storefronts, product pages, seller $4/mo
Stripe subscription, buyer address-and-pay flow with your Venmo/PayPal/Zelle
links, and row-level security so sellers only see their own data.

**Natural next steps (phase 2):** live card checkout for buyers via **Stripe
Connect** (so money routes to each seller), order records + email receipts,
editing products/categories in place, sales-sheet PDFs, and custom domains per
seller. Ask and I'll build these on top of this foundation.
