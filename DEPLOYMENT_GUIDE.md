# Render and Neon Deployment Guide

This backend is prepared for deployment on Render with a Neon PostgreSQL database.

## Backend Deployment on Render

1. Push this repository to GitHub.
2. In Render, create a new **Web Service** from the backend repository.
3. Use these settings:

```text
Runtime: Node
Build Command: npm ci --include=dev && npm run render-build
Start Command: npm start
Health Check Path: /health
```

If you use Render Blueprints, the included `render.yaml` already defines these settings.

## Backend Environment Variables

Add these environment variables in the Render backend service:

```text
NODE_ENV=production
DATABASE_URL=your_neon_pooled_connection_string
JWT_SECRET=generate_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://your-frontend.onrender.com
REQUEST_BODY_LIMIT=50mb
GITHUB_TOKEN=optional_github_token
```

Use the Neon pooled connection string for `DATABASE_URL` and make sure it includes SSL, for example:

```text
postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
```

`CLIENT_URLS` should contain the deployed frontend origin. For multiple frontend domains, separate them with commas:

```text
CLIENT_URLS=https://your-site.com,https://www.your-site.com,https://your-frontend.onrender.com
```

## Database Migrations

The Render build command runs:

```bash
npm run db:generate
npm run db:deploy
```

This generates the Prisma client and applies the committed Prisma migrations to Neon. Use `db:deploy` in production, not `db:migrate`.

## Optional Seed Data

After the first deployment, you can run the seed script from Render Shell if you want starter product data:

```bash
npm run db:seed
```

Only run this if you actually want the sample records in production.

## Frontend Deployment on Render

Create a separate Render service for the frontend. For most frontend frameworks, use a **Static Site** if it builds to static files, or a **Web Service** if it needs a Node server.

Set the frontend API base URL to the deployed backend URL:

```text
VITE_API_URL=https://your-backend.onrender.com
```

Use the variable name your frontend already expects. Common names are `VITE_API_URL`, `NEXT_PUBLIC_API_URL`, or `REACT_APP_API_URL`.

After the frontend is deployed, copy its public URL into the backend `CLIENT_URLS` variable and redeploy the backend.

## Production Checks

After deployment, verify:

```text
GET https://your-backend.onrender.com/health
GET https://your-backend.onrender.com/api/public/projects
```

The health route should return:

```json
{ "status": "ok" }
```

If browser requests fail with CORS errors, update `CLIENT_URLS` in Render to exactly match the frontend origin, including `https://` and without a trailing slash.

## Notes

- Render provides `PORT` automatically, so you do not need to set it manually.
- Keep `JWT_SECRET` private.
- Keep `DATABASE_URL` private.
- The admin registration route is available at `/api/admin/register`; after creating your production admin account, consider protecting or removing public registration.
