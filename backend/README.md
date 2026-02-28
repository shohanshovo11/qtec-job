# Qtec Jobs — Backend API

REST API for the Qtec job board platform. Built with Express, MongoDB (Mongoose), and TypeScript.

## Tech Stack

- **Runtime**: Node.js + TypeScript (tsx / ts-node)
- **Framework**: Express 4
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: JWT + bcryptjs
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Setup

```bash
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/qtec?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start dev server with nodemon      |
| `npm run build` | Compile TypeScript to `dist/`      |
| `npm start`     | Run compiled production build      |
| `npm run seed`  | Seed the database with sample data |

## API Base URL

```
http://localhost:5000/api
```

## Endpoints

| Method | Route                      | Auth  | Description                       |
| ------ | -------------------------- | ----- | --------------------------------- |
| POST   | `/auth/register`           | —     | Register new user                 |
| POST   | `/auth/login`              | —     | Login, returns JWT                |
| GET    | `/auth/me`                 | User  | Get current user                  |
| GET    | `/jobs`                    | —     | List jobs (filterable, paginated) |
| GET    | `/jobs/:id`                | —     | Get job detail                    |
| POST   | `/jobs`                    | Admin | Create job                        |
| PUT    | `/jobs/:id`                | Admin | Update job                        |
| DELETE | `/jobs/:id`                | Admin | Delete job                        |
| POST   | `/jobs/:id/apply`          | —     | Submit application                |
| GET    | `/applications`            | Admin | List all applications             |
| GET    | `/applications/job/:jobId` | Admin | Applications for a job            |
| DELETE | `/applications/:id`        | Admin | Delete application                |
| GET    | `/categories`              | —     | List categories with job counts   |

## Query Parameters — GET /jobs

| Param      | Example              | Description                        |
| ---------- | -------------------- | ---------------------------------- |
| `search`   | `engineer`           | Search title, company, description |
| `type`     | `Full Time`          | Filter by job type                 |
| `category` | `Engineering`        | Filter by category                 |
| `featured` | `true`               | Featured jobs only                 |
| `sortBy`   | `newest` \| `salary` | Sort order                         |
| `page`     | `1`                  | Page number                        |
| `limit`    | `9`                  | Results per page                   |

## Seed Accounts

After running `npm run seed`:

| Role  | Email | Password |
| ----- | ----- | -------- |
| Admin | admin | admin123 |
| User  | user  | user123  |
