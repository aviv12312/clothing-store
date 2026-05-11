# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dream & Work** — Hebrew-language fashion e-commerce store (editorial menswear). The UI is in Hebrew with RTL layout. Error messages and user-facing strings are written in Hebrew throughout the codebase.

## Development Commands

### Server (Express + MongoDB)
```bash
cd server
npm run dev      # nodemon, hot-reload
npm start        # production
```

### Client (React + Vite)
```bash
cd client
npm run dev      # Vite dev server (default: http://localhost:5173)
npm run build    # production build
npm run lint     # ESLint
```

Both `client` and `server` are independent npm workspaces with their own `package.json`. There is no root-level package.json — run commands from within each directory.

## Environment Variables

The server validates env vars on startup via [server/src/config/validateEnv.js](server/src/config/validateEnv.js). Required:
- `PORT`, `MONGODB_URI`, `CLIENT_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

Optional groups (missing keys log a warning but don't crash):
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **PayPal**: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **AI chat**: `GROQ_API_KEY`
- **Email**: `BREVO_API_KEY`, `EMAIL_USER`

## Architecture

### Client (`client/src/`)

- **`context/`** — Three React context providers wrapping the app in order: `AuthProvider → WishlistProvider → CartProvider`. Read via `useAuth()`, etc.
- **`services/api.js`** — Single axios instance for all API calls. Attaches `Authorization: Bearer <token>` from `localStorage`. Implements silent token refresh on `TOKEN_EXPIRED` responses (one concurrent refresh, deduped with a promise).
- **`components/ProtectedRoute.jsx` / `AdminRoute.jsx`** — Route guards checking `useAuth()`.
- **`pages/admin/Dashboard.jsx`** — Admin-only panel, accessed via `/admin/*`.
- **`hooks/useCookieConsent.js`** — GDPR/cookie consent state.

Auth state: access token in `localStorage` (`accessToken` key), refresh token in httpOnly cookie set by the server.

### Server (`server/src/`)

- **`app.js`** — Entry point. Registers middleware in order: `helmet → cors → rateLimit → raw body for Stripe webhook → json → cookieParser → mongoSanitize → hpp`, then mounts all routes. Starts abandoned cart job on interval after DB connects.
- **`middleware/auth.js`** — `protect` (JWT verify → attach `req.user`) and `requireAdmin` (role check). Error codes: `TOKEN_EXPIRED` triggers client-side refresh.
- **`middleware/rateLimiters.js`** — Stricter limiter for auth routes (`authLimiter`), global 100 req/15 min on `/api/`.
- **`middleware/validators.js`** — `express-validator` rule sets + `validate()` runner.
- **`routes/`** — One file per resource: `auth`, `products`, `orders`, `payment`, `ai`, `upload`, `newsletter`, `cart`, `coupons`.
- **`services/emailService.js`** — All transactional email via Brevo REST API (`fetch`, not SDK). Sends: welcome, order confirmation, status update, abandoned cart (plain + with 10% discount coupon), newsletter welcome, password reset, admin alerts.
- **`jobs/abandonedCartJob.js`** — Runs hourly via `setInterval`. Sends first reminder at 1 hour, discount coupon at 24 hours.

### Data Models

- **User** — name, email, password (bcrypt, `select: false`), role (`user`|`admin`), address, wishlist (ref Product), newsletter, reset token fields.
- **Product** — name, price, salePrice, category (`חתן ומלווים`|`Casual`|`Formal`), tags, sizes, colors, images, `colorImages` (mixed), `variants` (color+size+stock+sku+images), `stock`, `sizeStock` (mixed — keyed by size or by `color→size`), isActive, featured. Full-text index on name/description/tags.
- **Order** — user ref, items (product+name+price+size+color+qty+image), subtotalPrice, discountAmount, totalPrice, couponCode, shippingAddress, paymentMethod (`stripe`|`paypal`), paymentId, paymentStatus, orderStatus (Hebrew string), stockDeducted flag.
- **AbandonedCart**, **Coupon**, **Newsletter** — supporting models.

### Stock Management

Stock is multi-layered. Resolution order in `getAvailableStock` (payment route):
1. `sizeStock[color][size]` if both color and size present
2. `sizeStock[size]` if only size present
3. `product.stock` fallback

Stock is only decremented at payment confirmation (`finalizePaidOrder`), guarded by `stockDeducted` flag to prevent double-deduction on webhook retries.

### Payments

- **Stripe**: client calls `/api/payment/stripe/create-intent` → receives `clientSecret` → Stripe.js confirms on client → webhook `payment_intent.succeeded` finalizes order + sends email.
- **PayPal**: client calls `create-order` → receives `paypalOrderId` → PayPal SDK approves on client → client calls `capture-order` → server captures + finalizes.
- **Critical**: `/api/payment/webhook` receives raw body — it must be mounted before `express.json()` middleware (already correct in `app.js`).

### Tailwind & Design Tokens

The design system uses a warm neutral palette (`background: #faf8f4`, `primary: #1b2e4b`, `gold: #b8963e`). Fonts: `Olondona` (brand serif, loaded from `/public/fonts/Olondona.otf`), `Noto Serif` (headline), `Manrope` (body). All tokens are in [client/tailwind.config.js](client/tailwind.config.js).
