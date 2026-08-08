# UI Screens Inventory — Lansan CRM Prototype

Source: `lansan_crm_v4.html`. This lists every screen (nav item / panel) in the prototype, grouped exactly as they appear in the sidebar navigation, plus shared/global UI elements. Use this as the screen checklist when rebuilding in Next.js.

---

## Global / shared UI (present on every screen)
- **Sidebar navigation** — logo, grouped nav sections, active-state highlighting, badge counters (Tasks, Appointments)
- **Topbar** — dynamic page title, global search input, context-aware primary action button (e.g. "Add contact" on Contacts, "New rule" on Automations)
- **Modal overlay** — shared Add/Edit modal used across Contacts, Deals, Tasks, Automations, Templates, Campaigns, Invoices, Users, Appointments
- **Pill/badge component** — status indicators (Active, Lead, Paid, Overdue, High/Medium/Low priority, etc.)
- **User row** — sidebar footer showing logged-in user name/role

---

## Section: Main

### 1. Dashboard
- Stat cards: Total contacts, Pipeline value, Revenue collected, Emails sent
- Recent activity feed
- Upcoming tasks list
- Revenue overview chart (line chart, Chart.js)

### 2. Contacts
- Contacts table (Name, Company, Email, Phone, Status, actions)
- Add contact (modal)
- Delete contact
- Link to Import

### 3. Pipeline
- Kanban board across stages: Lead, Qualified, Proposal, Negotiation
- Deal cards (name, company, amount)
- Add/delete deal

### 4. Tasks
- Tasks table (task, due date, priority, status, actions)
- Add task (modal)
- Toggle complete/reopen

---

## Section: Growth

### 5. Lead generation
- Stat cards: Total leads, Hot leads, Converted, Avg. response time
- Source filter chips (All, Website, Referral, LinkedIn, Cold outreach, Import, Ad campaign)
- Lead columns/board with score badges (Hot/Warm/Cold)

### 6. Appointments
- Calendar grid (month view) with appointment dots (confirmed/pending/cancelled)
- Today's appointments sidebar list
- Upcoming appointments sidebar list
- Booking link box (copyable public booking URL)
- All appointments table
- Schedule appointment (modal)

---

## Section: Marketing

### 7. Automations
- Automation rules list (trigger → action, on/off toggle, delete)
- New rule (modal)
- Automation log table (rule, triggered by, action taken, time)

### 8. Email templates
- Template list (cards, click to preview)
- Template preview panel (subject + body)
- New template (modal)
- Delete template

### 9. Campaigns
- Campaign cards: name, date, status, stats (sent, opens, open rate, CTR)
- Send now action
- New campaign (modal)
- Delete campaign

---

## Section: Finance

### 10. Payments
- Stripe connection banner
- Stat cards: Total collected, This month, Pending, Refunds
- Recent transactions table
- Charge client (modal)

### 11. Invoices
- Invoices table (invoice #, client, description, amount, due date, status)
- Create invoice (modal)

---

## Section: Insights

### 12. Reports
- Stat cards: Deals won, Win rate, Avg deal size, Email open rate
- Charts: Pipeline by stage, Revenue by month, Campaign performance, Contact growth (all Chart.js)

---

## Section: Tools

### 13. Import data
- Step 1: Upload — drag & drop zone, file browser, format/limit info cards
- Step 2: Column mapping — auto-guessed field mapping, manual override dropdowns
- Step 3: Preview — first 5 rows preview table, total record count
- Step 4: Done — success screen, import count, "import another file" / "view contacts" actions
- Download template (CSV)
- Import history table

### 14. Website builder
- Page builder panel — block picker (Hero, Text, CTA, Services, Contact form)
- Live preview panel
- Publish action

### 15. AI assistant
- Suggested prompt chips (Summarize pipeline, Draft follow-up email, Campaign subject line, Automation ideas, Invoice reminder email)
- Chat message thread (user/bot bubbles)
- Chat input + send

---

## Section: Admin

### 16. Users & licenses
- Unlimited licenses banner
- Team members table (name, email, role, status, actions)
- Add user (modal)

### 17. Integrations
- Zapier banner (external connect link)
- Native integrations grid (12 cards: Stripe, Gmail, Google Calendar, Slack, Zapier, Typeform, Calendly, HubSpot, Apollo.io, LinkedIn, Make/Integromat, QuickBooks) — connect/disconnect toggle per card
- API access card — sample API request box, "Generate API key", "View API docs"

### 18. Settings
- Company settings form (company name, industry, website URL, from email)
- AI model settings form (model selector, AI persona name, system instructions textarea)

---

## Screen count summary
- **18 primary screens/panels**
- **1 shared modal system** reused across ~9 of them
- **4 sub-steps** within the Import screen (effectively a 4-step wizard, not a single screen)
- **6 charts** across Dashboard and Reports
