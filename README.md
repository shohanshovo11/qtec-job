# Qtec Jobs

A full-stack job board platform. Browse listings, apply for jobs, and manage everything through an admin panel.

## Structure

```
qtec/
├── backend/    # Express + MongoDB REST API
└── frontend/   # Next.js 14 App Router
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

---

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/qtec?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the dev server:

```bash
npm run dev
```

API runs at `http://localhost:5000`

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## Seed Accounts

| Role  | Username | Password |
|-------|----------|----------|
| Admin | admin    | admin123 |
| User  | user     | user123  |

---

## Quick Start (both servers)

Open two terminals:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```
