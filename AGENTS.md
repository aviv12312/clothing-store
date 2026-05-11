# AGENTS.md

## Project Rules

Dream & Work is an existing full-stack Hebrew RTL clothing-store project. It has a React/Vite client and an Express/MongoDB server.

- This project existed before workflow docs were added.
- Local code and the actual `package.json` files are the source of truth when docs disagree.
- Do not rewrite the app, replace the architecture, or change stack/dependencies without explicit approval.
- Do not edit `.env` files or print secrets, tokens, database URLs, payment keys, or private credentials.
- Keep changes small, targeted, and easy to review.

## Stack & Structure

- Root: `package.json` exists, contains `@paypal/react-paypal-js`, and has no useful npm scripts.
- Client: React 19, React Router 7, Axios, Vite 8, Tailwind CSS 3, ESLint 9.
- Server: Node.js ESM, Express 5, Mongoose 9/MongoDB, JWT, bcryptjs, Stripe, Cloudinary, Multer, Groq SDK, Helmet/CORS/rate-limit/validation/sanitization middleware.
- Key folders: `client/src/`, `server/src/`, `docs/`, `.claude/`.
- Client areas: `components/`, `context/`, `hooks/`, `pages/`, `services/`.
- Server areas: `config/`, `controllers/`, `jobs/`, `middleware/`, `models/`, `routes/`, `services/`.

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

- Preserve Hebrew user-facing text and RTL layout.
- Preserve existing React Router routes unless explicitly changing routing.
- Use existing React Context state: `AuthContext`, `CartContext`, `WishlistContext`.
- Use `client/src/services/api.js` for API calls unless there is a clear reason not to.
- Preserve token refresh and route guard behavior.
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

