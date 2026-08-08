# Quick Reference — Lansan CRM Development

## 📊 Project Overview

**Total Screens:** 18 primary screens  
**Total Timeline:** 12-16 weeks  
**Development Phases:** 8 phases  
**Current Phase:** Phase 1 (Core Foundation)

---

## 📋 Phase Breakdown

| Phase | Weeks | Screens | Docs | Status |
|-------|-------|---------|------|--------|
| **Phase 1: Core Foundation** | 3-4 | Dashboard, Contacts, Pipeline, Tasks | [PHASE1.md](./PHASE1.md) | 📝 Planning |
| **Phase 2: Growth Tools** | 2-3 | Lead Generation, Appointments | [PHASE2.md](./PHASE2.md) | ⏸️ Not Started |
| **Phase 3: Marketing Automation** | 3-4 | Automations, Templates, Campaigns | [PHASE3.md](./PHASE3.md) | ⏸️ Not Started |
| **Phase 4: Finance Management** | 2-3 | Payments, Invoices | [PHASE4.md](./PHASE4.md) | ⏸️ Not Started |
| **Phase 5: Analytics & Insights** | 2 | Reports | [PHASE5.md](./PHASE5.md) | ⏸️ Not Started |
| **Phase 6: Data & AI Tools** | 2-3 | Import, Website Builder, AI Assistant | [PHASE6.md](./PHASE6.md) | ⏸️ Not Started |
| **Phase 7: Administration** | 2-3 | Users, Integrations, Settings | [PHASE7.md](./PHASE7.md) | ⏸️ Not Started |
| **Phase 8: Polish & Production** | 1-2 | All screens (refinement) | [PHASE8.md](./PHASE8.md) | ⏸️ Not Started |

---

## 🎯 Phase 1 — Current Focus

### Core Features
- ✅ User Authentication (login/logout)
- ✅ Role-based Access (Admin/Manager/Agent)
- ✅ Dashboard with real-time stats
- ✅ Contact Management (CRUD)
- ✅ Pipeline/Deal Management (Kanban)
- ✅ Task Management

### Tech Stack (Phase 1)
```
Frontend:  Next.js 16.3 + React 19 + TailwindCSS 4
Backend:   Next.js API Routes + Prisma ORM
Database:  PostgreSQL (Prisma Postgres)
Auth:      NextAuth.js v5
Icons:     Tabler Icons React
Data:      TanStack Query
Deploy:    Vercel
```

### Database Models (Phase 1)
- `User` — Authentication and role management
- `Contact` — Customer/lead information
- `Deal` — Sales opportunities
- `Task` — To-do items

### Implementation Checklist (38 tasks)
1. **Environment Setup** (7 tasks) — Database, Prisma, environment variables
2. **Design System** (4 tasks) — Tailwind config, UI components
3. **Database & Auth** (6 tasks) — Prisma schema, NextAuth setup
4. **API Layer** (7 tasks) — Route handlers, Zod validation
5. **Frontend Layout** (4 tasks) — Sidebar, topbar, navigation
6. **Frontend Features** (5 tasks) — All 4 screens
7. **Data Fetching** (6 tasks) — TanStack Query hooks
8. **Testing & Deployment** (4 tasks) — QA, Vercel deploy

---

## 📁 Key Files & Locations

### Documentation
```
docs/
├── modules/
│   ├── DEVELOPMENT-PHASES.md    # Master plan (all 8 phases)
│   ├── PHASE1.md                # Detailed Phase 1 implementation
│   └── QUICK-REFERENCE.md       # This file
└── screens/
    ├── DESIGN.md                # Design system (colors, components)
    └── ui-screens-inventory.md  # All 18 screens list
```

### Source Code (Phase 1 structure)
```
app/
├── (auth)/login/               # Login page
├── (dashboard)/                # Main app (4 screens)
│   ├── page.tsx               # Dashboard
│   ├── contacts/              # Contacts screen
│   ├── pipeline/              # Pipeline screen
│   └── tasks/                 # Tasks screen
└── api/                       # API routes
    ├── auth/[...nextauth]/    # NextAuth
    ├── contacts/              # Contacts API
    ├── deals/                 # Deals API
    ├── tasks/                 # Tasks API
    └── dashboard/stats/       # Dashboard stats API
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# Initialize database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Build for production
npm run build

# Deploy to Vercel
git push origin main  # Vercel auto-deploys
```

---

## 🔑 Environment Variables

```env
DATABASE_URL="prisma+postgres://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

---

## 🎨 Design Tokens (from DESIGN.md)

### Brand Colors
```
Primary:   #1D9E75 (green)
Dark:      #0F6E56 (hover)
Light BG:  #e8f8f2 (active states)
```

### Status Colors
```
Green:  Active, Won, Paid
Blue:   Lead, Admin
Gray:   Inactive, Low priority
Red:    Overdue, High priority, Failed
Amber:  Pending, Medium priority
```

### Component Sizes
```
Border Radius:  6-7px (small), 8-9px (medium), 10-12px (large)
Button Padding: 7px 13px (normal), 5px 10px (small)
Input Padding:  7px 10px
Card Padding:   16px
Stat Padding:   14px
```

---

## 📦 Dependencies (Phase 1)

```json
{
  "dependencies": {
    "next": "16.3.0",
    "react": "19.2.8",
    "@prisma/client": "latest",
    "@tanstack/react-query": "latest",
    "next-auth": "5.0.0-beta",
    "zod": "latest",
    "@tabler/icons-react": "latest",
    "bcryptjs": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "@types/bcryptjs": "latest",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## ✅ Phase 1 Definition of Done

**Functionality:**
- [ ] User can log in with email/password
- [ ] Dashboard shows real aggregate stats
- [ ] User can create/edit/delete contacts
- [ ] User can create/move/delete deals in pipeline
- [ ] User can create/complete/reopen tasks
- [ ] All data persists after server restart

**Technical:**
- [ ] Database migrations are clean
- [ ] API routes have Zod validation
- [ ] No console errors or warnings
- [ ] Mobile responsive design
- [ ] Loading states everywhere
- [ ] Error handling in place

**Deployment:**
- [ ] Deployed to Vercel
- [ ] Production database connected
- [ ] Environment variables set
- [ ] Seed data loaded

---

## 📞 Support & Resources

### Documentation Links
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://authjs.dev
- TanStack Query: https://tanstack.com/query
- Tailwind: https://tailwindcss.com/docs
- Tabler Icons: https://tabler.io/icons

### Internal Docs
- Design System: `docs/screens/DESIGN.md`
- Full Phase Plan: `docs/modules/DEVELOPMENT-PHASES.md`
- Phase 1 Details: `docs/modules/PHASE1.md`

---

**Last Updated:** Phase 1 Planning Complete  
**Next Action:** Begin Phase 1 Implementation
