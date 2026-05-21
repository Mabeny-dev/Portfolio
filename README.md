# Mabeny Portfolio Backend

Express and Prisma backend for the Mabeny portfolio website. It provides public portfolio content APIs, admin-only content management APIs, contact message storage, and basic visitor analytics.

## Tech Stack

- Node.js `^20.19 || ^22.12 || >=24.0`
- Express 5
- Prisma 7
- PostgreSQL
- JWT authentication

## Project Structure

```text
src/
  controllers/
    admin/      Admin dashboard handlers
    public/     Public website handlers
  middleware/   Auth and error middleware
  routes/       API route definitions
  utils/        Shared helpers
prisma/
  migrations/   Database migrations
  schema.prisma Prisma data model
  seed.js       Optional seed data
```

## Environment Variables

Create a local `.env` from `.env.example`.

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Long random secret used to sign admin tokens.

Optional variables:

- `PORT`: API port. Defaults to `3000`.
- `NODE_ENV`: Use `production` in deployment.
- `CLIENT_URLS`: Comma-separated allowed frontend origins for CORS.
- `JWT_EXPIRES_IN`: Token lifetime. Defaults to `7d`.

## Scripts

```bash
npm run dev          # Start the local API with nodemon
npm start            # Start the API for production
npm run db:generate  # Generate the Prisma client
npm run db:migrate   # Create/apply local development migrations
npm run db:deploy    # Apply migrations in production
npm run db:seed      # Seed optional starting content
npm run db:studio    # Open Prisma Studio
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env` with your PostgreSQL `DATABASE_URL`, `JWT_SECRET`, and allowed frontend origins.

3. Generate Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Optionally seed starter content:

```bash
npm run db:seed
```

5. Start the API:

```bash
npm run dev
```

Health check:

```text
GET /health
```

## Deployment Checklist

- Set `NODE_ENV=production`.
- Set `DATABASE_URL` to the production PostgreSQL connection string.
- Set a strong `JWT_SECRET`; do not reuse the example value.
- Set `CLIENT_URLS` to the deployed frontend origin or origins.
- Run `npm install`, `npm run db:generate`, and `npm run db:deploy`.
- Start with `npm start`.

## API Overview

Public routes are mounted under `/api/public`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/hero` | Get hero content |
| `GET` | `/projects` | Get published visible projects |
| `GET` | `/articles` | Get published articles |
| `GET` | `/testimonials` | Get visible testimonials |
| `GET` | `/about` | Get about page content |
| `POST` | `/messages` | Submit a contact message |
| `POST` | `/visit` | Record a site visit |

Admin routes are mounted under `/api/admin`. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Create an admin account |
| `POST` | `/login` | Log in and receive a token |
| `POST` | `/logout` | Clear the auth cookie |
| `GET`, `PUT` | `/hero` | Read/update hero content |
| `GET`, `POST`, `PUT`, `DELETE` | `/projects` | Manage projects |
| `GET`, `POST`, `PUT`, `DELETE` | `/articles` | Manage articles |
| `GET`, `POST`, `PUT`, `DELETE` | `/testimonials` | Manage testimonials |
| `GET`, `POST`, `PUT`, `DELETE` | `/about` | Manage about content |
| `GET` | `/messages` | View contact messages |
| `GET` | `/messages/stats` | View message totals |
| `PUT` | `/messages/:id` | Mark a message as read |
| `GET` | `/analytics/site-visits` | View visit analytics |

For `PUT` and `DELETE` routes that operate on a single item, pass the item id as `/:id`.

## Security Notes

- Keep `JWT_SECRET` private and rotate it if it is ever exposed.
- Restrict `CLIENT_URLS` to your deployed frontend domains in production.
- The admin registration route is available at `/api/admin/register`; remove or protect it after creating your production admin account if public self-registration is not desired.

## Notes

- `notes.md` and `setup.md` are intentionally kept in the repository folder for project reference.
- The generated Prisma client lives in `src/generated/prisma/` and is ignored by Git. Generate it during setup or deployment.
- Visitor geolocation uses `ip-api.com`; local loopback addresses are stored as `Unknown`.
