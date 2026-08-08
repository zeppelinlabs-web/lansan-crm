# Lansan CRM

A modern, full-featured Customer Relationship Management system built with Next.js, PostgreSQL, and Prisma.

## 📋 Project Status

**Current Phase:** Phase 1 of 8 - Core CRM Foundation  
**Status:** 📝 Documentation Complete - Ready for Implementation  
**Total Timeline:** 12-16 weeks for complete system

See [docs/modules/DEVELOPMENT-PHASES.md](./docs/modules/DEVELOPMENT-PHASES.md) for the complete 8-phase roadmap covering all 18 screens.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16.3 (App Router)
- **Database:** PostgreSQL via Prisma Postgres
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Validation:** Zod
- **Data Fetching:** TanStack Query
- **Styling:** TailwindCSS 4
- **Icons:** Tabler Icons React
- **Deployment:** Vercel

---

## 🏗️ Features (Phase 1)

- ✅ User authentication with role-based access (Admin, Manager, Agent)
- ✅ Contact management (CRUD operations)
- ✅ Pipeline/Deal management with kanban board
- ✅ Task management system
- ✅ Dashboard with real-time statistics
- ✅ User management (Admin only)

---

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- A Prisma Postgres account ([get one here](https://console.prisma.io/))

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lansan-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   - `DATABASE_URL`: Your Prisma Postgres connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Database Schema

The application uses a single-organization model with the following entities:

- **Users** - System users with role-based permissions
- **Contacts** - Customer/lead information
- **Deals** - Sales opportunities in the pipeline
- **Tasks** - To-do items linked to contacts or deals

See [docs/modules/PHASE1.md](./docs/modules/PHASE1.md) for detailed schema definitions.

---

## 🎨 Design System

All UI components follow the design system documented in [docs/screens/DESIGN.md](./docs/screens/DESIGN.md).

Key design tokens:
- **Colors:** Brand green (#1D9E75), status colors, text hierarchy
- **Typography:** System font stack
- **Spacing:** Consistent padding and gaps
- **Components:** Reusable UI elements matching the prototype

---

## 📁 Project Structure

```
lansan-crm/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── [feature]/        # Feature-specific components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── validations/      # Zod schemas
├── prisma/               # Database schema and migrations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── docs/                 # Project documentation
```

---

## 🔐 Authentication

The application uses NextAuth.js v5 with credential-based authentication and role-based access control:

- **Admin:** Full system access, user management
- **Manager:** Access to all CRM features
- **Agent:** Access to own contacts, deals, and tasks

Default credentials after seeding:
- Admin: `admin@lansan.com` / `admin123`
- Manager: `manager@lansan.com` / `manager123`
- Agent: `agent@lansan.com` / `agent123`

---

## 🚀 Deployment

This project is configured for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (auto-set by Vercel)
3. **Deploy** - Automatic on push to main branch

---

## 📚 Documentation

- [Development Phases (Master Plan)](./docs/modules/DEVELOPMENT-PHASES.md) — 8 phases covering all 18 screens
- [Phase 1 Implementation Plan](./docs/modules/PHASE1.md) — Core CRM foundation
- [Design System](./docs/screens/DESIGN.md) — Colors, typography, components
- [UI Screens Inventory](./docs/screens/ui-screens-inventory.md) — Complete screen list

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema changes
npx prisma db seed         # Seed database
npx prisma migrate dev     # Create a migration
```

---

## 📝 License

Private project - All rights reserved

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

---

**Built with ❤️ using Next.js and Prisma**
