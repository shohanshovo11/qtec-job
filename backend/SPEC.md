# Qtec Job Board — Backend API Specification

## 1. Overview

A RESTful API built with **Express.js** and **MongoDB** (Mongoose) serving the Qtec Job Board frontend (Next.js). The API supports two user roles:

| Role  | Capabilities                             |
| ----- | ---------------------------------------- |
| Admin | Full CRUD on jobs, view all applications |
| User  | Browse/search jobs, submit applications  |

Base URL: `http://localhost:5000/api`

---

## 2. Technology Stack

| Concern    | Choice                        |
| ---------- | ----------------------------- |
| Runtime    | Node.js 20+                   |
| Framework  | Express.js 4.x                |
| Database   | MongoDB (Mongoose ODM)        |
| Auth       | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator             |
| Env Config | dotenv                        |
| Dev Tools  | nodemon, eslint               |

---

## 3. Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/qtec_jobs
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 4. Database Models

### 4.1 User

```
User {
  _id        : ObjectId  (auto)
  name       : String,   required
  email      : String,   required, unique, lowercase
  password   : String,   required, bcrypt-hashed
  role       : String,   enum: ["admin", "user"], default: "user"
  createdAt  : Date,     default: Date.now
}
```

### 4.2 Job

Derived from the frontend `Job` and `JobDetail` interfaces in `data.ts`.

```
Job {
  _id             : ObjectId  (auto)
  title           : String,   required
  company         : String,   required
  logo            : String    (URL or relative path)
  location        : String,   required
                    enum: [
                      "Remote", "New York, US", "San Francisco, US",
                      "London, UK", "Berlin, Germany", "Madrid, Spain",
                      "Toronto, Canada", "Sydney, Australia", "Singapore"
                    ]
  type            : String,   required
                    enum: ["Full Time", "Part Time", "Remote", "Contract", "Internship"]
  category        : String,   required
                    enum: [
                      "Design", "Engineering", "Marketing", "Finance",
                      "Technology", "Sales", "Business", "Human Resource"
                    ]
  salary          : String,   required          // e.g. "$120k – $150k"
  description     : String,   required
  tags            : [String]
  featured        : Boolean,  default: false
  postedAt        : String                      // e.g. "2 days ago"
  createdAt       : Date,     default: Date.now

  // JobDetail fields (shown on the job detail page)
  aboutCompany    : String
  experience      : String                      // e.g. "3-5 years"
  companySize     : String                      // e.g. "1000-5000 employees"
  companyWebsite  : String                      // valid URL
  applicants      : Number,   default: 0
  responsibilities : [String]
  requirements    : [String]
  niceToHave      : [String]
  benefits        : [String]
}
```

### 4.3 Application

Derived from the frontend `ApplyForm.tsx` form state and validation rules.

```
Application {
  _id         : ObjectId  (auto)
  job         : ObjectId, ref: "Job", required   // indexed
  name        : String,   required
  email       : String,   required
  resumeUrl   : String,   required               // must be a valid URL
  coverNote   : String,   required, minLength: 50, maxLength: 1000
  createdAt   : Date,     default: Date.now
}
```

**Relationship:** Job → Applications (one-to-many). Index the `job` field for fast lookups.

---

## 5. Authentication Endpoints

| Method | Path               | Access  | Description              |
| ------ | ------------------ | ------- | ------------------------ |
| POST   | /api/auth/register | Public  | Register a new user      |
| POST   | /api/auth/login    | Public  | Login, returns JWT token |
| GET    | /api/auth/me       | Private | Get current user profile |

---

### POST /api/auth/register

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user"
}
```

**Validation:**
| Field | Rule |
|------------|-----------------------------------|
| `name` | Required |
| `email` | Required, valid email format |
| `password` | Required, minimum 6 characters |
| `role` | Optional, defaults to `"user"` |

**Success 201:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "", "name": "", "email": "", "role": "" }
}
```

**Errors:** `400` validation failure | `409` email already exists

---

### POST /api/auth/login

**Request body:**

```json
{ "email": "jane@example.com", "password": "password123" }
```

**Success 200:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "", "name": "", "email": "", "role": "" }
}
```

**Error `401`:** Invalid credentials

---

### GET /api/auth/me

Requires `Authorization: Bearer <token>` header.

**Success 200:**

```json
{ "_id": "", "name": "", "email": "", "role": "", "createdAt": "" }
```

---

### Auth Middleware

- **`protect`** — Verifies the JWT token and attaches `req.user` to the request.
- **`adminOnly`** — Calls `next()` only if `req.user.role === "admin"`, otherwise returns `403`.

---

## 6. Jobs Endpoints

| Method | Path          | Access     | Description                             |
| ------ | ------------- | ---------- | --------------------------------------- |
| GET    | /api/jobs     | Public     | List all jobs (filtering + pagination)  |
| GET    | /api/jobs/:id | Public     | Get a single job with all detail fields |
| POST   | /api/jobs     | Admin only | Create a new job                        |
| PUT    | /api/jobs/:id | Admin only | Update a job (partial updates accepted) |
| DELETE | /api/jobs/:id | Admin only | Delete a job (cascades to applications) |

---

### GET /api/jobs

**Query parameters (all optional):**

| Param      | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| `search`   | string  | Keyword — matches `title`, `company`, `description`, `tags` |
| `category` | string  | Exact match, e.g. `Design`                                  |
| `type`     | string  | Exact match, e.g. `Full Time`                               |
| `location` | string  | Exact match, e.g. `Remote`                                  |
| `featured` | boolean | `true` → return featured jobs only                          |
| `sortBy`   | string  | `newest` (default, by `createdAt`) or `salary`              |
| `page`     | number  | Default `1`                                                 |
| `limit`    | number  | Default `9` — matches frontend `JOBS_PER_PAGE = 9`          |

**Success 200:**

```json
{
  "success": true,
  "count": 9,
  "total": 24,
  "totalPages": 3,
  "currentPage": 1,
  "data": []
}
```

---

### GET /api/jobs/:id

Returns the full job object including all `JobDetail` fields.

**Success 200:**

```json
{
  "success": true,
  "data": {}
}
```

**Error `404`:** Job not found

---

### POST /api/jobs _(Admin)_

Requires `Authorization: Bearer <admin-token>`.

**Request body:**

```json
{
  "title": "Senior Product Designer",
  "company": "Stripe",
  "logo": "/icons/FeaturedJobs/Company Logo.svg",
  "location": "San Francisco, US",
  "type": "Full Time",
  "category": "Design",
  "salary": "$90k – $120k",
  "description": "...",
  "tags": ["Design", "Figma", "UI/UX"],
  "featured": true,
  "experience": "4+ years",
  "companySize": "4,000 – 6,000 employees",
  "companyWebsite": "https://stripe.com",
  "aboutCompany": "...",
  "responsibilities": ["..."],
  "requirements": ["..."],
  "niceToHave": ["..."],
  "benefits": ["..."]
}
```

**Validation:**
| Field | Rule |
|---------------|---------------------------------------|
| `title` | Required |
| `company` | Required |
| `location` | Required, must be a valid enum value |
| `type` | Required, must be a valid enum value |
| `category` | Required, must be a valid enum value |
| `salary` | Required |
| `description` | Required |
| `companyWebsite` | Valid URL if provided |

**Success 201:**

```json
{ "success": true, "data": {} }
```

---

### PUT /api/jobs/:id _(Admin)_

Partial updates accepted. Returns the updated job.

**Success 200:**

```json
{ "success": true, "data": {} }
```

**Error `404`:** Job not found

---

### DELETE /api/jobs/:id _(Admin)_

Deletes the job **and all associated `Application` documents** (cascade delete).

**Success 200:**

```json
{ "success": true, "message": "Job deleted successfully" }
```

**Error `404`:** Job not found

---

## 7. Applications Endpoints

| Method | Path                         | Access     | Description                         |
| ------ | ---------------------------- | ---------- | ----------------------------------- |
| POST   | /api/applications            | Public     | Submit a job application            |
| GET    | /api/applications            | Admin only | List all applications (paginated)   |
| GET    | /api/applications/job/:jobId | Admin only | All applications for a specific job |
| GET    | /api/applications/:id        | Admin only | Get a single application            |
| DELETE | /api/applications/:id        | Admin only | Delete an application               |

---

### POST /api/applications

This is the real implementation for the `ApplyForm.tsx` component's simulated API call.

**Request body:**

```json
{
  "jobId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "resumeUrl": "https://drive.google.com/file/jane-resume",
  "coverNote": "I am excited to apply for this role because..."
}
```

**Validation (mirrors `ApplyForm.tsx` rules exactly):**
| Field | Rule |
|-------------|-------------------------------------------------------|
| `jobId` | Required, valid MongoDB ObjectId, job must exist |
| `name` | Required, non-empty string |
| `email` | Required, valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `resumeUrl` | Required, valid URL (passes `new URL()` check) |
| `coverNote` | Required, minimum 50 characters, maximum 1000 characters |

**Duplicate guard:** Same `email` + `jobId` combination returns `409 Conflict`.

**Side effect:** Increments `job.applicants` counter by 1 on success.

**Success 201:**

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {}
}
```

**Errors:** `400` validation | `404` job not found | `409` already applied

---

### GET /api/applications _(Admin)_

**Query parameters:** `page` (default 1), `limit` (default 20), `jobId` (optional filter).

Returns applications with `job.title` and `job.company` populated.

**Success 200:**

```json
{
  "success": true,
  "count": 10,
  "total": 47,
  "totalPages": 5,
  "currentPage": 1,
  "data": []
}
```

---

### GET /api/applications/job/:jobId _(Admin)_

**Success 200:**

```json
{ "success": true, "count": 5, "data": [] }
```

---

### GET /api/applications/:id _(Admin)_

Returns the application with the related job fields populated.

**Success 200:**

```json
{ "success": true, "data": {} }
```

---

### DELETE /api/applications/:id _(Admin)_

**Success 200:**

```json
{ "success": true, "message": "Application deleted" }
```

---

## 8. Categories Endpoint

| Method | Path            | Access | Description                          |
| ------ | --------------- | ------ | ------------------------------------ |
| GET    | /api/categories | Public | List categories with live job counts |

Returns the 8 categories from the frontend `CategorySection.tsx`, with live counts aggregated from the `Job` collection.

**Implementation:** MongoDB `$group` aggregation on the `Job` collection by `category`.

**Success 200:**

```json
{
  "success": true,
  "data": [
    { "name": "Design", "jobCount": 4 },
    { "name": "Engineering", "jobCount": 7 },
    { "name": "Marketing", "jobCount": 3 },
    { "name": "Finance", "jobCount": 2 },
    { "name": "Technology", "jobCount": 3 },
    { "name": "Sales", "jobCount": 2 },
    { "name": "Business", "jobCount": 2 },
    { "name": "Human Resource", "jobCount": 2 }
  ]
}
```

---

## 9. Error Response Format

All errors return a consistent envelope:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": []
}
```

| Status | Meaning                               |
| ------ | ------------------------------------- |
| 400    | Validation failure / bad request      |
| 401    | Not authenticated (missing/bad token) |
| 403    | Forbidden — admin access required     |
| 404    | Resource not found                    |
| 409    | Conflict (duplicate resource)         |
| 500    | Internal server error                 |

---

## 10. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                   # Mongoose connection setup
│   ├── middleware/
│   │   ├── auth.js                 # protect + adminOnly middleware
│   │   └── errorHandler.js         # global Express error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── categoryController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── categoryRoutes.js
│   ├── seed.js                     # Seeds DB with all 24 jobs from data.ts
│   └── server.js                   # Express app entry point
├── .env
├── .gitignore
└── package.json
```

---

## 11. Seed Script

`src/seed.js` populates MongoDB with all 24 enriched jobs from the frontend's
`dummyJobs` + `jobDetails` data, so the frontend works immediately after
switching from static data to the live API.

Run with:

```bash
node src/seed.js
```

---

## 12. CORS Configuration

| Environment | Allowed Origin                |
| ----------- | ----------------------------- |
| Development | `http://localhost:3000`       |
| Production  | Deployed frontend domain only |

---

## 13. Frontend Integration Notes

| Current frontend behaviour                     | Required backend change                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| `ApplyForm.tsx` — `setTimeout` simulates API   | Replace with real `POST /api/applications`               |
| Jobs listing page — filters from local array   | Map filter state to query params on `GET /api/jobs`      |
| Job detail page — static `enrichedJobs` lookup | Replace with `GET /api/jobs/:id`                         |
| Category section — hardcoded `jobCount`        | Replace with `GET /api/categories` for live counts       |
| Featured jobs (homepage)                       | `GET /api/jobs?featured=true&limit=8`                    |
| Latest jobs (homepage)                         | `GET /api/jobs?sortBy=newest&limit=8`                    |
| Pagination — `JOBS_PER_PAGE = 9`               | Pass `?page=N&limit=9` on every listing request          |
| `generateStaticParams` in job detail page      | Switch to dynamic rendering or ISR once API is connected |
