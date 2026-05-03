# Clothing Store - Dream & Work

A full-stack Hebrew RTL e-commerce web application for a clothing store.

This project is built as a production-oriented portfolio project for a real clothing-store use case.

## Features

- Hebrew RTL storefront
- User authentication with JWT and bcryptjs
- Access token refresh with an httpOnly refresh cookie
- Product catalog with search, filtering, variants, colors, sizes, and stock
- Cart, wishlist, checkout, and order success flow
- Admin dashboard for products and orders
- PayPal checkout flow
- Stripe backend payment intent and webhook support
- MongoDB/Mongoose persistence
- Cloudinary product image uploads
- Newsletter subscribe/unsubscribe flow
- Abandoned cart reminder and discount email job
- AI shopping assistant using Groq
- Cookie consent and legal pages

## Tech Stack

**Frontend:** React, Vite, React Router, Context API, Tailwind CSS, Axios

**Backend:** Node.js, Express, Mongoose

**Database:** MongoDB

**Authentication:** JWT, bcryptjs, httpOnly refresh cookie

**Payments:** PayPal, Stripe

**Uploads:** Cloudinary, Multer

**Email:** Brevo SMTP API

**AI:** Groq

## Project Structure

```text
client/                React/Vite frontend
client/src/pages/      Storefront, auth, profile, checkout, admin, legal pages
client/src/context/    Auth, cart, and wishlist state
client/src/services/   API and analytics helpers
server/                Express backend
server/src/app.js      Backend entry point and middleware setup
server/src/routes/     API route modules
server/src/models/     Mongoose models
server/src/controllers Route controllers
server/src/services/   Email service
server/src/jobs/       Abandoned cart job
```

## Environment

Create `server/.env` from `server/.env.example`.

Required core variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
```

Payment variables:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

Optional service variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GROQ_API_KEY=your_groq_api_key
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM=store@example.com
EMAIL_USER=admin@example.com
```

Client environment:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Local Development

Install dependencies separately in `server/` and `client/`, then run each app from its own folder.

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Current Notes

- The checkout UI currently uses PayPal.
- Stripe backend routes exist for payment intents and webhooks, but the visible checkout page does not currently render a Stripe payment form.
- Automated tests are not configured yet.
- Stock checks exist, but stock updates are not fully transactional.
- Sensitive values should stay in `.env` files and should never be committed or printed.
