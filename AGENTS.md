# AGENTS.md

## Project

This is a full-stack Hebrew clothing store project.

The project is built for a real clothing store / business use case and should be treated as a production-oriented portfolio project.

Main stack:

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB / Mongoose
- Authentication: JWT, bcryptjs
- Payments: Stripe, PayPal
- Styling: Tailwind CSS
- Language / UI: Hebrew, RTL

## Main Goal

Help review, improve, debug, document, secure, deploy, and maintain this clothing-store project.

The main goal is to make the project:

- easier to understand
- safer to modify
- better documented
- more professional for portfolio / resume use
- more stable for real usage

## Working Rules

- Do not delete files.
- Do not move or rename files without explicit approval.
- Do not overwrite files without explicit approval.
- Do not edit `.env` files.
- Do not print secrets, tokens, API keys, database URLs, payment keys, or private credentials.
- Do not run `npm install`, `npm update`, deployment commands, or git commands without explicit approval.
- Do not make large changes without first proposing a plan.
- Do not invent project features that do not exist in the code.
- Separate what exists in the code from recommendations.
- Prefer small, safe, understandable changes.
- Preserve the existing project structure and style.
- Preserve Hebrew and RTL behavior.
- If information is missing, ask before acting.

## Workflow

1. Understand the user's request.
2. Inspect only the relevant files.
3. Explain what currently exists.
4. Identify problems, risks, or missing pieces.
5. Propose a small and safe plan.
6. Wait for explicit approval before editing files.
7. Before editing, show:
   - exact files to change
   - exact planned changes
   - why the change is needed
   - risk level
   - how to test
8. After editing, summarize:
   - what changed
   - which files changed
   - what should be tested next
9. Do not run commands unless approved.

## Review Focus

When reviewing this project, check:

- Project structure
- Frontend / backend separation
- React components
- Routing
- Hebrew / RTL support
- Responsive design
- API routes
- Authentication
- Password hashing
- JWT usage
- Security middleware
- Input validation
- Payment integrations
- MongoDB / Mongoose usage
- Error handling
- Environment variables
- README and documentation
- Deployment readiness
- Portfolio / resume presentation

## Output Format

For project review, return:

1. Project summary
2. Tech stack
3. Important folders and files
4. Strengths
5. Risks / issues
6. Recommended next steps

For debugging, return:

1. Problem
2. Likely cause
3. Files to inspect
4. Suggested fix
5. Exact change proposal
6. How to test

For feature planning, return:

1. Feature goal
2. Required files
3. Backend changes
4. Frontend changes
5. Database changes, if needed
6. Testing checklist

For code changes, return:

1. Files to change
2. Exact planned changes
3. Risk level
4. Approval request

For documentation work, return:

1. Current documentation status
2. Missing sections
3. Suggested README / docs structure
4. Exact text to add
5. Whether files should be edited or only drafted

## Safety

Sensitive areas require extra caution:

- Authentication
- Payments
- Environment variables
- Database connection
- Admin / user permissions
- Deployment configuration
- Git history

For these areas:

- inspect first
- explain the risk
- propose changes
- wait for approval
- only then edit

## Success Criteria

This project is successful when:

- the code is easier to understand
- the README explains setup and usage clearly
- authentication and payments are handled carefully
- Hebrew / RTL behavior is preserved
- the project can be presented professionally in a portfolio or resume
- changes are small, safe, approved, and testable
