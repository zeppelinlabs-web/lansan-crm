# Phase 1 — Core CRM Foundation

**Timeline:** 3–4 weeks  
**Depends on:** Nothing (starting point)  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Build the foundational CRM system with authentication, database, and core workflows. Replace the static prototype's in-memory JS arrays with a real, persistent, single-organization backend. Get Contacts, Pipeline, Tasks, and Dashboard fully working end-to-end with real data.

## Screens Included (4 of 18 total)

1. **Dashboard** — Stats cards, recent activity, tasks list, revenue chart
2. **Contacts** — Table view, add/edit/delete contact modal
3. **Pipeline** — Kanban board with 4 stages, drag-and-drop deals
4. **Tasks** — Table view, add/complete/reopen tasks

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| **Next.js (App Router)** | Project scaffold — pages/UI as React components, Route Handlers as the API layer | 16.3.0 |
| **PostgreSQL via Prisma** | Primary database — managed, pairs directly with Prisma ORM | Latest |
| **Prisma ORM** | Schema definition + migrations for users, contacts, deals, tasks | Latest |
| **NextAuth.js v5 (beta)** | Login, session handling, role-based access (Admin / Manager / Agent) | 5.0.0-beta |
| **Zod** | Request validation on every route handler | Latest |
| **TailwindCSS** | UI styling matching the existing design | 4.x |
| **TanStack Query** | Client-side data fetching/caching | Latest |
| **@tabler/icons-react** | Icon library (replacing webfont) | Latest |
| **bcryptjs** | Password hashing | Latest |
| **Vercel** | Deployment target — connects directly to Git repo, auto-builds and deploys on push | - |

### Not Included in Phase 1
- ❌ GitHub Actions (Vercel handles CI/CD automatically)
- ❌ Sentry (error tracking - will be added later)

---

## Database Schema

**Single organization — no tenant scoping in Phase 1**

### Users Table
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String?   // null if using OAuth provider
  role          UserRole  @default(AGENT)
  status        UserStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  createdContacts Contact[] @relation("CreatedBy")
  createdDeals    Deal[]    @relation("CreatedBy")
  assignedTasks   Task[]    @relation("AssignedTo")
}

enum UserRole {
  ADMIN
  MANAGER
  AGENT
}

enum UserStatus {
  ACTIVE
  INACTIVE
}
```

### Contacts Table
```prisma
model Contact {
  id          String        @id @default(cuid())
  name        String
  company     String?
  email       String?
  phone       String?
  status      ContactStatus @default(LEAD)
  createdById String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  createdBy   User   @relation("CreatedBy", fields: [createdById], references: [id])
  deals       Deal[]
  tasks       Task[] @relation("ContactTasks")
}

enum ContactStatus {
  LEAD
  ACTIVE
  INACTIVE
}
```

### Deals Table
```prisma
model Deal {
  id          String     @id @default(cuid())
  name        String
  company     String?
  amount      Decimal    @db.Decimal(12, 2)
  stage       DealStage  @default(LEAD)
  contactId   String?
  createdById String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relations
  contact     Contact? @relation(fields: [contactId], references: [id])
  createdBy   User     @relation("CreatedBy", fields: [createdById], references: [id])
  tasks       Task[]   @relation("DealTasks")
}

enum DealStage {
  LEAD
  QUALIFIED
  PROPOSAL
  WON
  LOST
}
```

### Tasks Table
```prisma
model Task {
  id          String       @id @default(cuid())
  text        String
  dueDate     DateTime?
  priority    TaskPriority @default(MEDIUM)
  done        Boolean      @default(false)
  assignedToId String?
  contactId   String?
  dealId      String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  assignedTo  User?    @relation("AssignedTo", fields: [assignedToId], references: [id])
  contact     Contact? @relation("ContactTasks", fields: [contactId], references: [id])
  deal        Deal?    @relation("DealTasks", fields: [dealId], references: [id])
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

---

## Project Structure

```
lansan-crm/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── layout.tsx            # Auth layout (centered, no sidebar)
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Main app layout (sidebar + topbar)
│   │   ├── page.tsx              # Dashboard (/)
│   │   ├── contacts/
│   │   │   ├── page.tsx          # Contacts list
│   │   │   └── [id]/page.tsx    # Contact detail
│   │   ├── pipeline/
│   │   │   └── page.tsx          # Pipeline kanban view
│   │   ├── tasks/
│   │   │   └── page.tsx          # Tasks list
│   │   └── settings/
│   │       └── users/
│   │           └── page.tsx      # User management (Admin only)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth.js API route
│   │   ├── contacts/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET (detail), PATCH (update), DELETE
│   │   ├── deals/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE
│   │   ├── users/
│   │   │   ├── route.ts          # GET (list), POST (create - Admin only)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE (Admin only)
│   │   └── dashboard/
│   │       └── stats/
│   │           └── route.ts      # GET dashboard stats
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + design tokens
├── components/
│   ├── ui/
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   ├── modal.tsx             # Modal component
│   │   ├── pill.tsx              # Status pill component
│   │   ├── stat-card.tsx         # Dashboard stat card
│   │   ├── table.tsx             # Table wrapper component
│   │   ├── form-group.tsx        # Form field wrapper
│   │   ├── input.tsx             # Input component
│   │   ├── select.tsx            # Select component
│   │   ├── textarea.tsx          # Textarea component
│   │   └── toggle.tsx            # Toggle switch component
│   ├── layout/
│   │   ├── sidebar.tsx           # App sidebar navigation
│   │   ├── topbar.tsx            # Page topbar
│   │   └── main-layout.tsx       # Combined layout component
│   ├── contacts/
│   │   ├── contacts-table.tsx    # Contacts list table
│   │   ├── contact-modal.tsx     # Create/edit contact modal
│   │   └── contact-card.tsx      # Contact detail card
│   ├── pipeline/
│   │   ├── pipeline-board.tsx    # Kanban board
│   │   ├── pipeline-column.tsx   # Single stage column
│   │   └── deal-card.tsx         # Deal card in kanban
│   ├── tasks/
│   │   ├── task-list.tsx         # Tasks list
│   │   └── task-modal.tsx        # Create/edit task modal
│   └── dashboard/
│       ├── stats-row.tsx         # Dashboard stat cards row
│       └── recent-activity.tsx   # Recent activity widget
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client singleton
│   ├── validations/
│   │   ├── contact.ts            # Contact Zod schemas
│   │   ├── deal.ts               # Deal Zod schemas
│   │   ├── task.ts               # Task Zod schemas
│   │   └── user.ts               # User Zod schemas
│   └── utils/
│       ├── api.ts                # API helper functions
│       ├── date.ts               # Date formatting utilities
│       └── cn.ts                 # classNames utility
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Database migrations
├── hooks/
│   ├── use-contacts.ts           # TanStack Query hooks for contacts
│   ├── use-deals.ts              # TanStack Query hooks for deals
│   ├── use-tasks.ts              # TanStack Query hooks for tasks
│   └── use-dashboard.ts          # TanStack Query hooks for dashboard
├── types/
│   ├── index.ts                  # Shared TypeScript types
│   └── api.ts                    # API request/response types
├── docs/
│   ├── modules/
│   │   └── PHASE1.md             # This file
│   └── screens/
│       ├── DESIGN.md             # Design system reference
│       └── ui-screens-inventory.md # Screen inventory
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Environment variables example
├── package.json
├── tsconfig.json
├── tailwind.config.ts            # Tailwind configuration with design tokens
├── next.config.ts
└── README.md
```

---

## Implementation Checklist

### 1. Environment Setup
- [x] Install dependencies
- [ ] Create `.env.example` with required variables
- [ ] Create `.env.local` with actual values
- [ ] Initialize Prisma
- [ ] Create database schema
- [ ] Run initial migration
- [ ] Create seed script

### 2. Design System Setup
- [ ] Configure Tailwind with design tokens from DESIGN.md
- [ ] Create base UI components (Button, Card, Modal, etc.)
- [ ] Set up CSS variables in globals.css
- [ ] Import Tabler Icons

### 3. Database & Auth
- [ ] Set up Prisma client singleton
- [ ] Configure NextAuth.js with credentials provider
- [ ] Create auth API routes
- [ ] Implement login page
- [ ] Set up session management
- [ ] Implement role-based middleware

### 4. API Layer
- [ ] Create Zod validation schemas
- [ ] Implement Contacts API routes (CRUD)
- [ ] Implement Deals API routes (CRUD)
- [ ] Implement Tasks API routes (CRUD)
- [ ] Implement Users API routes (Admin only)
- [ ] Implement Dashboard stats API route
- [ ] Add error handling middleware

### 5. Frontend - Layout
- [ ] Create main app layout with sidebar
- [ ] Implement sidebar navigation
- [ ] Implement topbar component
- [ ] Add route protection

### 6. Frontend - Features
- [ ] **Dashboard:** Stats cards + recent activity
- [ ] **Contacts:** List view with table, create/edit modal, delete
- [ ] **Pipeline:** Kanban board with drag-and-drop, deal cards
- [ ] **Tasks:** List view, create/complete/reopen, filters
- [ ] **Settings > Users:** User management (Admin only)

### 7. Data Fetching
- [ ] Set up TanStack Query provider
- [ ] Implement custom hooks for contacts
- [ ] Implement custom hooks for deals
- [ ] Implement custom hooks for tasks
- [ ] Implement custom hooks for dashboard
- [ ] Add optimistic updates
- [ ] Add error handling

### 8. Testing & Deployment
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test role-based access
- [ ] Test data persistence
- [ ] Deploy to Vercel
- [ ] Test production build

---

## Environment Variables

```env
# Database (Prisma Postgres)
DATABASE_URL="prisma+postgres://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# For production
VERCEL_URL="your-production-url.vercel.app"
```

---

## Seed Data

Create initial admin user and sample data:
- 1 Admin user
- 2 Manager users
- 3 Agent users
- 20 sample contacts
- 15 sample deals across all stages
- 25 sample tasks

---

## Definition of Done

✅ **Core Functionality:**
- A logged-in user can view the dashboard with real aggregate stats
- Admin can create/edit/delete users
- All users can create/edit/delete contacts
- All users can create/move/delete deals through pipeline stages
- All users can create/complete/reopen tasks
- All data persists in PostgreSQL and survives server restart

✅ **Authentication:**
- Users can log in with email/password
- Sessions are managed securely
- Role-based access control (Admin, Manager, Agent)
- Unauthorized access is properly blocked

✅ **UI/UX:**
- Design matches the approved prototype (DESIGN.md)
- All components use the design system tokens
- Responsive layout works on desktop
- Loading states and error messages are shown

✅ **Deployment:**
- App is deployed to Vercel
- Production database is set up
- Environment variables are configured
- Automatic deployments work on push to main

---

## Next Steps (Phase 2)

After Phase 1 is complete, proceed to Phase 2 - Growth Tools:
- Lead Generation screen (lead scoring, source tracking)
- Appointments screen (calendar, booking link)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete 8-phase roadmap.

---

## Dependencies Installed

```json
{
  "dependencies": {
    "@prisma/client": "latest",
    "@tanstack/react-query": "latest",
    "next-auth": "5.0.0-beta",
    "zod": "latest",
    "@tabler/icons-react": "latest",
    "bcryptjs": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "@types/bcryptjs": "latest"
  }
}
```

---

**Status:** 📝 Documentation Complete - Ready for Implementation
