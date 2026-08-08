# Lansan CRM Development Phases

**Based on:** UI Screens Inventory (18 primary screens)  
**Total Timeline:** 12–16 weeks  
**Approach:** Incremental feature delivery with fully functional modules per phase

---

## Phase 1 — Core Foundation & Main Section
**Timeline:** 3–4 weeks  
**Screens:** 4 screens (Dashboard, Contacts, Pipeline, Tasks)  
**Dependencies:** None (starting point)

### Objective
Build the foundational CRM system with authentication, database, and core workflows. Users can manage contacts, track deals through a pipeline, manage tasks, and view dashboard metrics.

### Screens Included
1. ✅ **Dashboard** — Stats cards, recent activity, tasks, revenue chart
2. ✅ **Contacts** — Table view, add/edit/delete, basic search
3. ✅ **Pipeline** — Kanban board (4 stages), drag-and-drop deals
4. ✅ **Tasks** — Table view, add/complete/reopen, priority filters

### Global UI Components
- ✅ Sidebar navigation (Main section only)
- ✅ Topbar with page title + primary action button
- ✅ Modal overlay system (reusable)
- ✅ Status pill component
- ✅ User authentication + session management

### Technical Setup
- Database schema (Users, Contacts, Deals, Tasks)
- NextAuth.js authentication with roles
- API routes for all CRUD operations
- TanStack Query for data fetching
- Base UI components (Button, Card, Input, etc.)
- Tailwind config with design tokens
- Prisma with PostgreSQL

### Definition of Done
- User can log in and see dashboard with real data
- User can manage contacts (CRUD)
- User can move deals through pipeline stages
- User can create/complete tasks
- All data persists in database
- Deployed to Vercel

---

## Phase 2 — Growth Tools
**Timeline:** 2–3 weeks  
**Screens:** 2 screens (Lead Generation, Appointments)  
**Dependencies:** Phase 1 (Contacts, Tasks)

### Objective
Add lead management and appointment scheduling capabilities. Users can track lead sources, score leads, and manage appointments with calendar integration.

### Screens Included
5. **Lead Generation** — Lead board with Hot/Warm/Cold scoring, source filters
6. **Appointments** — Calendar view, booking link, appointment list

### New Features
- Lead scoring system (Hot/Warm/Cold)
- Lead source tracking (Website, Referral, LinkedIn, etc.)
- Calendar month view with appointment dots
- Appointment booking system with public booking link
- Appointment status (Confirmed/Pending/Cancelled)

### Database Updates
- Add `leadScore` and `leadSource` to Contacts
- Create Appointments table
- Add appointment-contact relations

### Definition of Done
- User can view leads by source and score
- User can convert leads to contacts
- User can schedule appointments
- Calendar shows all appointments
- Public booking link works
- Appointment reminders (email notifications)

---

## Phase 3 — Marketing Automation
**Timeline:** 3–4 weeks  
**Screens:** 3 screens (Automations, Email Templates, Campaigns)  
**Dependencies:** Phase 1 (Contacts) + Email service integration

### Objective
Enable automated workflows, email template management, and campaign execution. Users can create automation rules, design email templates, and run campaigns with tracking.

### Screens Included
7. **Automations** — Rule builder (trigger → action), automation log
8. **Email Templates** — Template library, preview, editor
9. **Campaigns** — Campaign management, stats (sent/opens/CTR)

### New Features
- Automation rule engine (if-this-then-that)
- Email template builder (rich text editor)
- Campaign creation and scheduling
- Email tracking (opens, clicks)
- Campaign analytics

### Database Updates
- Create AutomationRules table
- Create EmailTemplates table
- Create Campaigns table
- Create EmailLogs table (tracking)

### Tech Stack Additions
- Email service provider (Resend or SendGrid)
- Rich text editor (Tiptap or similar)
- Background job processor (for automations)

### Definition of Done
- User can create automation rules
- Rules trigger automatically based on conditions
- User can create email templates
- User can send campaigns to contact segments
- Campaign stats show real open/click rates
- Automation log shows triggered actions

---

## Phase 4 — Finance Management
**Timeline:** 2–3 weeks  
**Screens:** 2 screens (Payments, Invoices)  
**Dependencies:** Phase 1 (Contacts) + Stripe integration

### Objective
Add payment processing and invoice management. Users can charge clients, track payments, and generate invoices.

### Screens Included
10. **Payments** — Stripe connection, transaction history, charge client
11. **Invoices** — Invoice list, create/edit invoices, payment tracking

### New Features
- Stripe integration (payment processing)
- Payment tracking and history
- Invoice generation (PDF)
- Invoice status tracking (Paid/Pending/Overdue)
- Payment reminders

### Database Updates
- Create Payments table
- Create Invoices table
- Add Stripe customer ID to Contacts

### Tech Stack Additions
- Stripe SDK
- PDF generation library (react-pdf or similar)

### Definition of Done
- Stripe account connected
- User can charge clients via Stripe
- Transaction history shows all payments
- User can create and send invoices
- Invoices can be paid online
- Automatic payment reminders for overdue invoices

---

## Phase 5 — Analytics & Insights
**Timeline:** 2 weeks  
**Screens:** 1 screen (Reports)  
**Dependencies:** Phase 1 (all data models), Phase 3 (campaigns)

### Objective
Provide comprehensive analytics and reporting. Users can analyze pipeline performance, revenue trends, campaign effectiveness, and contact growth.

### Screens Included
12. **Reports** — Multi-chart dashboard (pipeline by stage, revenue by month, campaign performance, contact growth)

### New Features
- Advanced analytics queries
- Chart visualizations (Chart.js)
- Date range filters
- Export reports (CSV/PDF)
- Comparative metrics (month-over-month, year-over-year)

### Tech Stack Additions
- Chart.js (already in design system)
- Date range picker component

### Definition of Done
- Dashboard shows 4 key stat cards
- 4 interactive charts with real data
- User can filter by date range
- Reports can be exported
- Performance is optimized for large datasets

---

## Phase 6 — Data Management & AI Tools
**Timeline:** 2–3 weeks  
**Screens:** 3 screens (Import Data, Website Builder, AI Assistant)  
**Dependencies:** Phase 1 (Contacts) + AI API access

### Objective
Add bulk import capabilities, simple website builder, and AI-powered assistance. Users can import data from CSV, build landing pages, and get AI suggestions.

### Screens Included
13. **Import Data** — 4-step wizard (upload, map, preview, done), import history
14. **Website Builder** — Block-based page builder with live preview
15. **AI Assistant** — Chat interface with suggested prompts

### New Features
- CSV import with column mapping
- Import validation and error handling
- Import history and rollback
- Drag-and-drop website builder
- Page templates (Hero, CTA, Services, Contact form)
- AI chat integration (suggestions, draft emails, automation ideas)

### Database Updates
- Create ImportHistory table
- Create WebsitePages table
- Create AIConversations table

### Tech Stack Additions
- CSV parser library
- Website builder framework (GrapesJS or similar)
- AI API (OpenAI GPT or similar)

### Definition of Done
- User can upload CSV and import contacts
- Column mapping works automatically with manual override
- Import validation catches errors
- User can build simple landing pages
- Pages can be published and shared
- AI assistant provides relevant suggestions
- AI can draft emails and automation rules

---

## Phase 7 — Administration & Integrations
**Timeline:** 2–3 weeks  
**Screens:** 3 screens (Users & Licenses, Integrations, Settings)  
**Dependencies:** All previous phases

### Objective
Complete the admin section with user management, third-party integrations, and system settings. Admins can manage team members, connect integrations, and configure the system.

### Screens Included
16. **Users & Licenses** — Team management, role assignment, license tracking
17. **Integrations** — 12 integration cards (Stripe, Gmail, Calendar, Slack, Zapier, etc.), API key management
18. **Settings** — Company settings, AI model configuration

### New Features
- User invitation system
- Role-based permissions (Admin/Manager/Agent)
- Integration connectors (OAuth flows)
- API key generation and management
- Company profile settings
- AI persona customization

### Database Updates
- Add user invitation tokens
- Create IntegrationConnections table
- Create ApiKeys table
- Create CompanySettings table

### Tech Stack Additions
- OAuth client libraries
- Webhook handlers for integrations
- API documentation generator

### Definition of Done
- Admin can invite users
- Role-based access control works across all screens
- At least 3 integrations are fully functional (Stripe, Gmail, Calendar)
- API keys can be generated and used
- Zapier integration works with webhooks
- Company settings are editable
- AI model can be customized

---

## Phase 8 — Polish & Production Readiness
**Timeline:** 1–2 weeks  
**Screens:** All screens (refinement)  
**Dependencies:** All previous phases

### Objective
Final polish, performance optimization, testing, and production hardening. Ensure the system is production-ready with error handling, monitoring, and documentation.

### Tasks
- [ ] Comprehensive testing (unit, integration, e2e)
- [ ] Performance optimization (query optimization, caching, lazy loading)
- [ ] Error tracking (Sentry integration)
- [ ] Monitoring and logging
- [ ] SEO optimization
- [ ] Accessibility audit (WCAG compliance)
- [ ] Security audit (OWASP best practices)
- [ ] API rate limiting
- [ ] Data backup and recovery procedures
- [ ] User documentation
- [ ] Admin documentation
- [ ] API documentation
- [ ] Onboarding flow for new users
- [ ] Mobile responsiveness refinement
- [ ] Loading states and skeletons everywhere
- [ ] Empty states for all views
- [ ] Error boundaries
- [ ] Toast notifications system
- [ ] Keyboard shortcuts
- [ ] Dark mode (optional)

### Definition of Done
- All screens are fully responsive
- App passes accessibility audit
- Error tracking is operational
- Performance metrics are within targets (Lighthouse score > 90)
- All user flows have been tested
- Documentation is complete
- Production deployment is stable
- Backup and recovery tested

---

## Summary Table

| Phase | Timeline | Screens | Key Features | Dependencies |
|-------|----------|---------|--------------|--------------|
| **Phase 1** | 1 weeks | 4 | Core CRM (Contacts, Pipeline, Tasks, Dashboard) | None |
| **Phase 2** | 1 weeks | 2 | Lead management, Appointments | Phase 1 |
| **Phase 3** | 1 weeks | 3 | Automations, Templates, Campaigns | Phase 1 |
| **Phase 4** | 1-2 weeks | 2 | Payments, Invoices | Phase 1 |
| **Phase 5** | 1 weeks | 1 | Reports & Analytics | Phase 1, 3 |
| **Phase 6** | 2 weeks | 3 | Import, Website Builder, AI Assistant | Phase 1 |
| **Phase 7** | 1–2 weeks | 3 | Users, Integrations, Settings | All |
| **Phase 8** | 1–2 weeks | All | Polish & Production | All |
| **Total** | **8–10 weeks** | **18 screens** | Complete CRM System | - |

---

## Development Approach

### Per-Phase Process
1. **Document** — Review phase requirements and create detailed spec
2. **Database** — Update schema, create migrations
3. **API** — Build route handlers with validation
4. **Components** — Create reusable UI components
5. **Pages** — Assemble pages from components
6. **Integration** — Connect frontend to API with TanStack Query
7. **Test** — Manual testing + automated tests
8. **Deploy** — Push to Vercel for staging review
9. **Review** — Stakeholder feedback and refinements

### Quality Gates (each phase)
- ✅ All screens are functional with real data
- ✅ No console errors or warnings
- ✅ Mobile responsive
- ✅ Loading states implemented
- ✅ Error handling in place
- ✅ API validated with Zod
- ✅ Deployed to staging
- ✅ Passes manual QA

---

## Next Steps

1. **Review this plan** — Approve phase breakdown and timeline
2. **Start Phase 1** — Begin with core foundation
3. **Iterate** — Complete each phase before moving to next
4. **Adjust** — Modify timeline/scope based on feedback

---

**Status:** 📋 Planning Complete - Ready to Begin Phase 1
