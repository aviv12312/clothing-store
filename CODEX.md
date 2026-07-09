# CODEX.md

This file is synchronized from CLAUDE.md and provides guidance for Codex when working in this repository.

## Project Rules

Dream & Work is an existing full-stack Hebrew RTL clothing-store project with a React/Vite client and an Express/MongoDB server.

- This project existed before workflow docs were added.
- Local code and the actual `package.json` files are the source of truth when docs disagree.
- Do not rewrite the app, replace the architecture, or change stack/dependencies without explicit approval.
- Do not edit `.env` files or print secrets, tokens, database URLs, payment keys, or private credentials.
- Keep changes small, targeted, and easy to review.

## Stack & Layout

- Root: `package.json` exists, contains `@paypal/react-paypal-js`, and has no useful npm scripts.
- Client: React 19, React Router 7, Axios, Vite 8, Tailwind CSS 3, ESLint 9, i18next/react-i18next (bilingual he/en), GSAP.
- Server: Node.js ESM, Express 5, Mongoose 9/MongoDB, JWT, bcryptjs, Stripe, Cloudinary, Multer, Groq SDK, Helmet/CORS/rate-limit/validation/sanitization middleware.
- Main folders: `client/src/`, `server/src/`, `docs/`, `.claude/`.
- Client source areas: `components/`, `context/`, `hooks/`, `pages/`, `services/`, `i18n/`, `data/`.
- Server source areas: `config/`, `controllers/`, `jobs/`, `middleware/`, `models/`, `routes/`, `services/`.

## Architecture

Big-picture flows that span multiple files:

**Server request lifecycle** (`server/src/app.js`): `validateEnv()` runs before anything. Middleware order is load-bearing - `helmet` -> `cors` (allows configured `CLIENT_URL` origins plus any `*.vercel.app`) -> `/api/` rate limiter (100/15min, skips `/auth/me` and all of non-production) -> **`/api/payment/webhook` raw body parser (must come before `express.json()`)** -> `express.json` (250kb) -> `cookieParser` -> custom `sanitizeRequest` (mongo-sanitize) -> `hpp`. Then feature routers mount under `/api/*`, followed by a catch-all 404 and a final JSON error handler. `connectDB()` gates `app.listen`; `checkAbandonedCarts` is scheduled via `setInterval` every hour.

**Route -> controller pattern**: Only `auth`, `products`, and `ai` have dedicated controller files (`server/src/controllers/`); the other routers (`cart`, `orders`, `payment`, `coupons`, `newsletter`, `homepageImages`, `upload`) define their handlers inline. Admin-only endpoints are guarded by chaining `protect, requireAdmin` (see `middleware/auth.js`); file uploads use `multer` memory storage passed to Cloudinary.

**Auth flow**: `protect` verifies `JWT_ACCESS_SECRET` and loads `req.user` (password stripped). Expired access tokens return `{ error, code: 'TOKEN_EXPIRED' }`. The client (`client/src/services/api.js`) has a response interceptor that catches `TOKEN_EXPIRED`, calls `/auth/refresh` (httpOnly refresh cookie, single-flight via `isRefreshing`/`refreshPromise`), stores the new access token, and retries the original request once. `AuthContext` keeps the access token + a cached `user` object in `localStorage` and re-validates via `/auth/me` on mount.

**Cart flow**: `CartContext` is client-first - items live in `localStorage`, and `syncCart` mirrors them to `POST /cart/save` only when a token exists. Stock is resolved through `getProductStock`, which reads nested `product.sizeStock[color][size]`, then `sizeStock[size]`, then flat `product.stock`.

**i18n / RTL**: `client/src/i18n/index.js` initializes i18next with `he`/`en` resources; language is persisted under the `dw_language` localStorage key. `applyDocumentLanguage` sets `document.documentElement.dir` to `rtl` for Hebrew and `ltr` otherwise - RTL is language-driven, not hardcoded. Default/fallback language is `en`. Adoption is partial: some components use `useTranslation`/`t()` with keys in `locales/he.js` & `locales/en.js`, while others still contain literal strings.

**Provider nesting** (`client/src/App.jsx`): `AuthProvider` -> `WishlistProvider` -> `CartProvider` -> `BrowserRouter`. Protected routes wrap elements in `ProtectedRoute`; admin routes (`/admin/*`) in `AdminRoute`. A cross-tab `SplashScreen` gate is coordinated through `dw_splash`/`dw_tabs` localStorage counters.

## Commands

Install only with explicit approval:

```bash
npm install
cd client && npm install
cd server && npm install
```

Client:

```bash
cd client && npm run dev
cd client && npm run build
cd client && npm run lint
cd client && npm run preview
```

Server:

```bash
cd server && npm run dev
cd server && npm start
cd server && npm test
```

Missing/placeholder commands:

- No root dev/build/lint/test scripts.
- No client test script.
- No server lint or build script.
- `cd server && npm test` is a placeholder that prints `Error: no test specified` and exits with failure. Do not treat it as a real test suite.

## Verification

Use the smallest relevant verification for changed files.

Client changes:

```bash
cd client && npm run lint
cd client && npm run build
```

Server JavaScript changes:

```bash
cd server && node --check src/app.js
```

Replace `src/app.js` with the touched server file when checking another file.

Behavior changes:

- Run `cd server && npm run dev` and `cd client && npm run dev` when runtime verification is needed.
- Manually check the affected page, route, API call, auth flow, admin flow, payment flow, or upload flow.
- Check browser console and server logs for obvious runtime errors.
- Record only actually-run commands/checks in `docs/verification.md`.

## Client Rules

- The app is bilingual (Hebrew/English) via i18next; RTL is applied automatically for Hebrew. For components already using `useTranslation`, add user-facing strings as keys in both `locales/he.js` and `locales/en.js` rather than hardcoding. Do not break existing Hebrew text or RTL layout.
- Preserve existing React Router routes unless explicitly changing routing.
- Use existing React Context state: `AuthContext`, `CartContext`, `WishlistContext`.
- Use `client/src/services/api.js` for API calls unless there is a clear reason not to.
- Preserve token refresh and `ProtectedRoute`/`AdminRoute` behavior.
- Use Tailwind and `client/tailwind.config.js` design tokens.
- Avoid unrelated redesigns and broad UI rewrites.

## Server Rules

- Preserve the current Express route/module structure.
- Preserve env validation in `server/src/config/validateEnv.js`.
- Use ESM imports/exports; do not use `require`.
- Preserve auth middleware behavior in `server/src/middleware/auth.js`.
- Preserve Stripe webhook raw body ordering before `express.json()`.
- Preserve Mongoose model compatibility unless schema/migration work is explicitly approved.
- Use existing controllers, routes, middleware, models, and services before adding abstractions.
- Treat auth, payments, env vars, database writes, and admin permissions as sensitive.

## Auth & Payments

- Auth uses JWT access tokens and an httpOnly refresh cookie.
- The client stores the access token in `localStorage` and refreshes through `client/src/services/api.js`.
- Do not add a second token refresh mechanism.
- Stripe webhook handling depends on raw request bodies before JSON parsing.
- PayPal and Stripe changes require careful client/server verification.

## Documentation Rules

- `docs/PRD.md`: product direction and scope. Change only when explicitly requested.
- `docs/plans/`: use for large, risky, sensitive, or multi-file plans.
- `docs/implementation-log.md`: update only after real implementation work.
- `docs/verification.md`: update only after real verification.
- Do not create fake plan, implementation, or verification entries.

## MCP Rules

- Use Context7 for library/framework/SDK/API/CLI/cloud documentation and version-specific questions, including React, Vite, Express, Mongoose, Tailwind, Stripe, PayPal, Cloudinary, and Groq.
- Context7 flow: `resolve-library-id`, choose the best match, then `query-docs` with the full question.
- Do not use Context7 for refactoring, business logic debugging, code review, or general programming concepts.
- Use GitHub MCP only for GitHub-specific tasks: repositories, issues, pull requests, branches, commits, CI checks, or publishing GitHub changes.
- For local code inspection, prefer local files and commands over GitHub MCP.
