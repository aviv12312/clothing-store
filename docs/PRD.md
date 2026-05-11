# PRD - Clothing Store

## What

This project is a full-stack clothing store web application.

The application allows users to browse clothing products and interact with the store through a web interface.

## Why

The goal of this project is to build a working online clothing store that can be developed, improved, and maintained in a structured way.

The project already exists, so this PRD documents the current direction and prevents uncontrolled changes while continuing development.

## Who

The users are:

- Customers who browse clothing products
- Store/admin users if admin functionality exists
- The developer maintaining and improving the project

## Current State

The project already includes:

- A client application under `client/`
- A server application under `server/`
- Server source code under `server/src/`
- Upload handling under `server/uploads/`
- Environment configuration through `server/.env` and `server/.env.example`
- Existing homepage/layout work in the client
- Existing `AGENTS.md`
- Existing `CLAUDE.md`

## Must-Have for V1

The first stable version should include:

- Client app runs successfully
- Server app runs successfully
- Homepage displays correctly
- Existing product/store functionality keeps working
- Client and server communicate correctly
- Environment variables are documented in `server/.env.example`
- Main pages do not show obvious runtime errors
- Project structure remains understandable and maintainable

## Won't-Have for V1

The first stable version should not include:

- Do not replace the existing architecture without approval
- Do not add Docker unless explicitly requested
- Do not add CI/CD unless explicitly requested
- Do not add new payment integrations unless explicitly requested
- Do not add new major dependencies without approval
- Do not redesign unrelated pages unless part of an approved task
- Do not rewrite the entire project from scratch
- Do not change the selected stack without approval

## Stack

The current stack is based on the existing `package.json` files.

- Root project:
  - `package.json` exists
  - `@paypal/react-paypal-js` is listed as a dependency
  - No useful root npm scripts are currently configured
- Client:
  - React
  - React DOM
  - React Router DOM
  - Axios
  - Vite
  - Tailwind CSS
  - PostCSS
  - Autoprefixer
  - ESLint
- Server:
  - Node.js with ES modules
  - Express
  - Mongoose / MongoDB
  - dotenv
  - bcryptjs
  - jsonwebtoken
  - Stripe
  - Cloudinary
  - Multer
  - Groq SDK
  - Helmet
  - CORS
  - cookie-parser
  - express-rate-limit
  - express-validator
  - express-mongo-sanitize
  - hpp
  - nodemon for development

The project uses a Hebrew RTL React client and an Express/MongoDB server.

## Success Criteria

The project is considered stable when:

- Client install succeeds
- Server install succeeds
- Client lint passes
- Client build passes
- Server starts successfully
- Existing main pages still work
- No obvious runtime errors appear in the browser console
- No obvious runtime errors appear in the server logs
- Baseline server syntax checks pass for touched server files
- Server `npm test` is documented as a placeholder until a real test suite is added
- Verification commands are documented in `docs/verification.md`
- New implementation work is documented in `docs/implementation-log.md`

## Open Questions

- What real automated test setup should be added for the client?
- What real automated test setup should be added for the server?
- Is authentication already implemented?
- Is there an admin panel?
- Which current features are already complete?
- Which current features are still incomplete?
- Should root-level npm scripts be added for common project commands?
