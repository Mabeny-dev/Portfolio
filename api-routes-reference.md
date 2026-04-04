# API Routes Reference

> **Portfolio Backend** — Express + Prisma + JWT
> Base URL: `http://localhost:4000/api`

---

## Authentication

All **admin** endpoints require the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Auth (`/api/auth`)

### `POST /api/auth/login` — Login

**Access:** Public

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "John Mabeny"
  }
}
```

**Errors:** `400` missing fields · `401` invalid credentials

---

### `GET /api/auth/me` — Get current admin

**Access:** 🔒 Admin

**Response (200):**
```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "John Mabeny",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

### `PUT /api/auth/password` — Change password

**Access:** 🔒 Admin

**Request:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password-min-8-chars"
}
```

**Response (200):**
```json
{ "message": "Password updated successfully" }
```

**Errors:** `400` missing fields / too short · `401` wrong current password

---

## 2. Hero (`/api/hero`)

### `GET /api/hero` — Get hero content

**Access:** Public

**Response (200):**
```json
{
  "id": "uuid",
  "badge": "Fullstack Developer",
  "name": "John",
  "highlight": "Mabeny",
  "phrases": ["performant APIs.", "clean React apps.", "scalable backends.", "minimal interfaces."],
  "subtitle": "I design and build modern web applications...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

### `PUT /api/hero` — Update hero content

**Access:** 🔒 Admin

**Request:**
```json
{
  "badge": "Fullstack Developer",
  "name": "John",
  "highlight": "Mabeny",
  "phrases": ["performant APIs.", "clean React apps."],
  "subtitle": "Updated subtitle text..."
}
```

**Response (200):** Updated hero object

---

## 3. Projects (`/api/projects`)

### `GET /api/projects` — List published projects

**Access:** Public

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce solution...",
    "tags": ["Next.js", "Prisma", "PostgreSQL"],
    "year": "2025",
    "image": null,
    "githubUrl": null,
    "liveUrl": null,
    "status": "PUBLISHED",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/projects/all` — List all projects (including drafts)

**Access:** 🔒 Admin

**Response (200):** Array of all projects

---

### `GET /api/projects/:id` — Get single project

**Access:** Public

**Response (200):** Single project object · **Errors:** `404`

---

### `POST /api/projects` — Create project

**Access:** 🔒 Admin

**Request:**
```json
{
  "title": "New Project",
  "description": "Project description...",
  "tags": ["React", "Node.js"],
  "year": "2025",
  "image": "https://...",
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "status": "DRAFT"
}
```

**Required fields:** `title`, `description`, `year`
**Response (201):** Created project object

---

### `PUT /api/projects/:id` — Update project

**Access:** 🔒 Admin

**Request:** Same shape as POST (all fields optional)
**Response (200):** Updated project object

---

### `DELETE /api/projects/:id` — Delete project

**Access:** 🔒 Admin

**Response (200):**
```json
{ "message": "Project deleted" }
```

---

## 4. Articles (`/api/articles`)

### `GET /api/articles` — List published articles

**Access:** Public

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Building Scalable APIs with Express and Prisma",
    "content": "Full article content...",
    "tag": "Backend",
    "image": null,
    "status": "PUBLISHED",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/articles/all` — List all articles (including drafts)

**Access:** 🔒 Admin

---

### `GET /api/articles/:id` — Get single article

**Access:** Public · **Errors:** `404`

---

### `POST /api/articles` — Create article

**Access:** 🔒 Admin

**Request:**
```json
{
  "title": "Article Title",
  "content": "Markdown or HTML content...",
  "tag": "Frontend",
  "image": "https://...",
  "status": "DRAFT"
}
```

**Required fields:** `title`, `tag`
**Response (201):** Created article object

---

### `PUT /api/articles/:id` — Update article

**Access:** 🔒 Admin · **Response (200):** Updated article

---

### `DELETE /api/articles/:id` — Delete article

**Access:** 🔒 Admin · **Response (200):** `{ "message": "Article deleted" }`

---

## 5. Testimonials (`/api/testimonials`)

### `GET /api/testimonials` — List all testimonials

**Access:** Public

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Sarah Kimani",
    "role": "Product Manager, Finova",
    "text": "John delivered a complex dashboard...",
    "image": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### `POST /api/testimonials` — Create testimonial

**Access:** 🔒 Admin

**Request:**
```json
{
  "name": "Client Name",
  "role": "CEO, Company",
  "text": "Testimonial text...",
  "image": "https://..."
}
```

**Required fields:** `name`, `role`, `text`
**Response (201):** Created testimonial

---

### `PUT /api/testimonials/:id` — Update testimonial

**Access:** 🔒 Admin · **Response (200):** Updated testimonial

---

### `DELETE /api/testimonials/:id` — Delete testimonial

**Access:** 🔒 Admin · **Response (200):** `{ "message": "Testimonial deleted" }`

---

## 6. About (`/api/about`)

### `GET /api/about` — Get full about content

**Access:** Public

**Response (200):**
```json
{
  "id": "uuid",
  "bio": "I'm John Mabeny — a fullstack JavaScript developer...",
  "createdAt": "...",
  "updatedAt": "...",
  "skills": [
    { "id": "uuid", "category": "Frontend", "items": ["React", "TypeScript", "Tailwind CSS"] }
  ],
  "experiences": [
    { "id": "uuid", "role": "Fullstack Developer", "company": "Freelance", "period": "2023 – Present", "description": "..." }
  ],
  "educations": [
    { "id": "uuid", "degree": "B.Sc. Computer Science", "school": "University of Technology", "year": "2020 – 2024" }
  ],
  "achievements": [
    { "id": "uuid", "title": "Best Developer Award", "issuer": "Tech Community Kenya", "year": "2024" }
  ],
  "languages": [
    { "id": "uuid", "name": "English", "proficiency": "Native" }
  ]
}
```

---

### `PUT /api/about` — Update bio

**Access:** 🔒 Admin

**Request:**
```json
{ "bio": "Updated bio text..." }
```

**Response (200):** Full about object with all relations

---

### `PUT /api/about/skills` — Replace all skills

**Access:** 🔒 Admin

**Request:**
```json
{
  "skills": [
    { "category": "Frontend", "items": ["React", "TypeScript"] },
    { "category": "Backend", "items": ["Node.js", "Express"] }
  ]
}
```

**Response (200):** `{ "message": "Skills updated" }`

---

### `PUT /api/about/experiences` — Replace all experiences

**Access:** 🔒 Admin

**Request:**
```json
{
  "experiences": [
    { "role": "Developer", "company": "Acme", "period": "2023–2025", "description": "..." }
  ]
}
```

---

### `PUT /api/about/educations` — Replace all educations

**Access:** 🔒 Admin (same pattern as experiences)

---

## 7. Contact (`/api/contact`)

### `POST /api/contact` — Submit contact message

**Access:** Public

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hi, I'd love to work together!"
}
```

**Validation:** All fields required · valid email format · message ≤ 2000 chars

**Response (201):**
```json
{ "message": "Message sent successfully", "id": "uuid" }
```

---

### `GET /api/contact` — List all messages

**Access:** 🔒 Admin

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hi, I'd love to work together!",
    "read": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### `PATCH /api/contact/:id/read` — Mark message as read

**Access:** 🔒 Admin

**Response (200):** Updated message object

---

### `DELETE /api/contact/:id` — Delete message

**Access:** 🔒 Admin · **Response (200):** `{ "message": "Message deleted" }`

---

## 8. Health Check

### `GET /api/health`

**Access:** Public

**Response (200):**
```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```

---

## Error Response Format

All errors follow the same shape:

```json
{ "error": "Human-readable error message" }
```

| Status | Meaning                           |
|--------|-----------------------------------|
| `400`  | Bad request / validation failed   |
| `401`  | Unauthorized / invalid token      |
| `404`  | Resource not found                |
| `500`  | Internal server error             |

---

## Quick Setup

```bash
# 1. Copy the server folder and install
cd server
npm install

# 2. Set up your .env (copy from .env.example)
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Run migrations and seed
npx prisma migrate dev --name init
node prisma/seed.js

# 4. Start the server
npm run dev
```
