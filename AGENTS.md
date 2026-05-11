# AGENTS.md

## Project

This is a full-stack Hebrew RTL clothing store project for Dream & Work.

Treat it as a production-oriented portfolio and real business project. Changes should be small, professional, easy to review, and careful around user, payment, and admin flows.

Main stack:

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express
- Database: MongoDB / Mongoose
- Authentication: JWT, bcryptjs, httpOnly refresh cookie
- Payments: PayPal in the checkout UI, Stripe backend routes
- Uploads: Cloudinary, Multer
- Email: Brevo SMTP
- AI assistant: Groq
- Language / UI: Hebrew, RTL

## Context7

Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service, including well-known tools like React, Vite, Express, Mongoose, Tailwind, Stripe, PayPal, Cloudinary, or Groq.

This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use Context7 even when the answer seems familiar, because package behavior may have changed.

Do not use Context7 for refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

Steps:

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format.
2. Pick the best match by exact name match, description relevance, snippet count, source reputation, and benchmark score. If results do not look right, try alternate names or phrasing.
3. Run `query-docs` with the selected library ID and the user's full question.
4. Answer using the fetched docs.

## Working Rules

- Do not edit `.env` files.
- Do not print secrets, tokens, API keys, database URLs, payment keys, or private credentials.
- Preserve Hebrew text and RTL layout.
- Prefer small, safe, targeted changes over large rewrites.
- Preserve the existing project structure and local code style.
- Separate what exists in the code from recommendations.
- Do not invent project features that do not exist in the code.
- Ask before deleting, moving, renaming, or overwriting files.
- Use the existing React Context state approach unless a requested change clearly requires otherwise.
- Use the Tailwind design tokens in `client/tailwind.config.js` instead of introducing unrelated palettes.

## Workflow

1. Understand the user's request.
2. Inspect the relevant files.
3. Explain important current behavior when it affects the change.
4. Identify risks or missing pieces.
5. Make the smallest useful change.
6. Verify with the most relevant available command.
7. Summarize changed files and what was tested.

## Sensitive Areas

Use extra caution around:

- Authentication
- Payments
- Environment variables
- Database connection and writes
- Admin permissions
- Deployment configuration
- Git history

For these areas, inspect first, explain the risk, keep edits narrowly scoped, and describe how to test.

## Local Development

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Frontend lint:

```bash
cd client
npm run lint
```

No automated test suite is currently configured.

