# Clothing Store — Dream & Work

A full-stack e-commerce web application built for a real clothing brand.

## Live Demo

🔗 Coming soon

## Features

- User authentication (JWT + bcryptjs)
- Product catalog with search and filtering
- Shopping cart and checkout flow
- Payment integration (Stripe / PayPal)
- Admin dashboard for managing products and orders
- Secure API (Helmet, rate limiting, mongoSanitize)

## Tech Stack

**Frontend:** React, React Router, Context API  
**Backend:** Node.js, Express  
**Database:** MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**Payments:** Stripe, PayPal

## Getting Started

Install dependencies and run:

    cd server && npm install && npm start
    cd client && npm install && npm start

Create a `.env` file in `/server` with:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_key
