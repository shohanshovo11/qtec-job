# Qtec Jobs — Frontend

Job board web application built with Next.js 14 App Router, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand (auth persistence)
- **HTTP**: Axios
- **UI Components**: Radix UI primitives via shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on port 5000

### Setup

```bash
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── jobs/                 # Public job listing + detail + apply
│   ├── login/                # Login page
│   ├── signup/               # Register page
│   ├── admin/                # Protected admin panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── jobs/             # Job management + applicants
│   │   ├── users/            # User management
│   │   └── _components/      # AdminSidebar, JobForm
│   └── components/           # Shared landing page sections
├── components/ui/            # shadcn/ui primitives
├── lib/api.ts                # Axios API client + typed helpers
├── store/authStore.ts        # Zustand auth store
└── context/AuthContext.tsx   # Legacy shim (deprecated)
```

## Features

- **Landing page**: Hero search, featured jobs, latest jobs, category browser
- **Jobs page**: Keyword search, filters (type, category, location), sort, pagination
- **Job detail**: Full description, requirements, benefits, apply form
- **Auth**: JWT stored in Zustand with localStorage persistence
- **Admin panel**: Job CRUD, applicant management per job, user list

