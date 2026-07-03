# Portfolio Backend

Express and Prisma backend for my portfolio website. It provides public portfolio content APIs, admin-only content management APIs, contact message and newsletter subscriber storage, and visitor analytics.

[Visite My Website](https://www.johnmabeny.com/)

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
- `REQUEST_BODY_LIMIT`: Maximum JSON/form payload size. Defaults to `50mb`.
- `GITHUB_USERNAME`: GitHub username used for homepage commit stats. Defaults to `Mabeny-dev`.
- `GITHUB_TOKEN`: Optional GitHub token for higher GitHub API rate limits.
- `GITHUB_STATS_CACHE_MINUTES`: How long the backend caches GitHub stats. Defaults to `5`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`: SMTP server connection settings.
- `SMTP_USER`, `SMTP_PASS`: Credentials for the mailbox or transactional email provider.
- `MAIL_FROM_NAME`, `MAIL_FROM_EMAIL`, `MAIL_REPLY_TO`: Welcome-email sender details.
- `WEBSITE_URL`: Public website URL used in newsletter emails and as a CORS fallback.

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

## Performance Notes

- Public product and service queries are indexed by `status`, `isVisible`, and descending `createdAt`.
- Newsletter emails are normalized to lowercase and uniquely indexed to prevent duplicate subscribers.
- Public endpoints return only published/visible content where applicable, keeping payloads small.
- `REQUEST_BODY_LIMIT` defaults to `50mb`; the frontend also compresses uploaded images before sending them.

## API Overview

Public routes are mounted under `/api/public`.

| Method | Route           | Purpose                        |
| ------ | --------------- | ------------------------------ |
| `GET`  | `/hero`         | Get hero content               |
| `GET`  | `/projects`     | Get published visible projects |
| `GET`  | `/services`     | Get published visible services |
| `GET`  | `/products`     | Get published visible products |
| `GET`  | `/articles`     | Get published articles         |
| `GET`  | `/testimonials` | Get visible testimonials       |
| `GET`  | `/about`        | Get about page content         |
| `GET`  | `/gitHubStats`  | Get current-year GitHub stats  |
| `POST` | `/messages`     | Submit a contact message       |
| `POST` | `/subscribe`    | Subscribe an email to the newsletter |
| `POST` | `/visit`        | Record a site visit            |

Admin routes are mounted under `/api/admin`. Protected routes require an `Authorization: Bearer <token>` header.

| Method                         | Route                      | Purpose                                                                                          |
| ------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `POST`                         | `/register`                | Create an admin account                                                                          |
| `POST`                         | `/login`                   | Log in and receive a token                                                                       |
| `POST`                         | `/logout`                  | Clear the auth cookie                                                                            |
| `GET`, `PUT`                   | `/hero`                    | Read/update hero content                                                                         |
| `GET`, `POST`, `PUT`, `DELETE` | `/projects`                | Manage projects                                                                                  |
| `GET`, `POST`, `PUT`, `DELETE` | `/services`                | Manage services                                                                                  |
| `GET`, `POST`, `PUT`, `DELETE` | `/products`                | Manage products                                                                                  |
| `GET`, `POST`, `PUT`, `DELETE` | `/articles`                | Manage articles                                                                                  |
| `GET`, `POST`, `PUT`, `DELETE` | `/testimonials`            | Manage testimonials                                                                              |
| `GET`, `POST`, `PUT`, `DELETE` | `/about`                   | Manage about content                                                                             |
| `GET`                          | `/messages`                | View contact messages                                                                            |
| `GET`                          | `/messages/stats`          | View message totals                                                                              |
| `PUT`                          | `/messages/:id`            | Mark a message as read                                                                           |
| `DELETE`                       | `/messages/:id`            | Delete a contact message                                                                         |
| `GET`                          | `/subscribers`             | List newsletter subscribers                                                                      |
| `DELETE`                       | `/subscribers/:id`         | Delete a newsletter subscriber                                                                   |
| `GET`                          | `/analytics/site-visits`   | View visit analytics                                                                             |

For `PUT` and `DELETE` routes that operate on a single item, pass the item id as `/:id`.

## Newsletter Flow

Public signup accepts:

```http
POST /api/public/subscribe
Content-Type: application/json

{
  "email": "reader@example.com"
}
```

Emails are trimmed and lowercased before storage. Repeating an existing signup is safe and returns the existing subscriber instead of creating a duplicate. When available, the API stores a country, city, country code, and visitor relation alongside the subscription.

After a new subscription, the API sends a branded HTML and plain-text welcome email from `info@johnmabeny.com`. Successful delivery is recorded in `welcomeEmailSentAt`; if SMTP is temporarily unavailable, the subscriber remains saved and a later signup attempt can retry the welcome email.

The domain currently uses Zoho Mail, so the included defaults use `smtp.zoho.com` on port `587` with `SMTP_SECURE=false`. Set `SMTP_PASS` to a Zoho app password for `info@johnmabeny.com`. Port `465` can also be used with `SMTP_SECURE=true`. Never commit the real mailbox password or app password.

The protected admin endpoints return subscribers newest first and allow records to be removed:

```text
GET    /api/admin/subscribers
DELETE /api/admin/subscribers/:id
```

## Security Notes

- Keep `JWT_SECRET` private and rotate it if it is ever exposed.
- Restrict `CLIENT_URLS` to your deployed frontend domains in production.
- Public routes, including newsletter signup, use the shared API rate limiter.
- The admin registration route is available at `/api/admin/register`; remove or protect it after creating your production admin account if public self-registration is not desired.

## Notes

- `notes.md` and `setup.md` are intentionally kept in the repository folder for project reference.
- The generated Prisma client lives in `src/generated/prisma/` and is ignored by Git. Generate it during setup or deployment.
- Visitor geolocation uses `ip-api.com`; local loopback addresses are stored as `Unknown`.
