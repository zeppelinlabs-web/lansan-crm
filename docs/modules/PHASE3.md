# Phase 3 — Marketing Automation

**Timeline:** 3–4 weeks  
**Depends on:** Phase 1 (Contacts) + Email service integration  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Enable automated workflows, email template management, and campaign execution. Users can create automation rules (if-this-then-that), design reusable email templates, and run email campaigns with open/click tracking.

## Screens Included (3 of 18 total)

7. **Automations** — Rule builder, automation log, toggle on/off
8. **Email Templates** — Template library with preview
9. **Campaigns** — Campaign management, stats (sent/opens/CTR)

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **Resend** or **SendGrid** | Email delivery service | Latest |
| **@tiptap/react** | Rich text editor for email templates | Latest |
| **node-cron** or **BullMQ** | Background job scheduling for automations | Latest |
| **juice** | Inline CSS for email compatibility | Latest |
| **html-to-text** | Email plain text fallback | Latest |

---

## Database Schema Updates

### New AutomationRule Table
```prisma
model AutomationRule {
  id          String    @id @default(cuid())
  name        String
  description String?
  enabled     Boolean   @default(true)
  
  // Trigger configuration
  trigger     AutomationTrigger
  triggerConfig Json    // Flexible JSON for trigger-specific settings
  
  // Action configuration
  action      AutomationAction
  actionConfig Json     // Flexible JSON for action-specific settings
  
  // Tracking
  timesTriggered Int    @default(0)
  lastTriggered  DateTime?
  
  createdById String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  createdBy   User      @relation("AutomationCreator", fields: [createdById], references: [id])
  logs        AutomationLog[]
}

enum AutomationTrigger {
  CONTACT_CREATED
  CONTACT_STATUS_CHANGED
  DEAL_STAGE_CHANGED
  DEAL_WON
  DEAL_LOST
  TASK_COMPLETED
  TASK_OVERDUE
  APPOINTMENT_SCHEDULED
  APPOINTMENT_COMPLETED
  LEAD_SCORE_CHANGED
}

enum AutomationAction {
  SEND_EMAIL
  CREATE_TASK
  UPDATE_CONTACT
  UPDATE_DEAL
  SEND_NOTIFICATION
  WEBHOOK
}
```

### New AutomationLog Table
```prisma
model AutomationLog {
  id          String    @id @default(cuid())
  ruleId      String
  triggeredBy String    // Contact ID or Deal ID that triggered it
  actionTaken String    // Description of what happened
  success     Boolean
  errorMessage String?
  executedAt  DateTime  @default(now())
  
  // Relations
  rule        AutomationRule @relation(fields: [ruleId], references: [id], onDelete: Cascade)
}
```

### New EmailTemplate Table
```prisma
model EmailTemplate {
  id          String    @id @default(cuid())
  name        String
  subject     String
  body        String    @db.Text  // HTML content
  category    TemplateCategory @default(GENERAL)
  
  // Variable placeholders supported (e.g., {{contact.name}})
  variables   String[]  // ["contact.name", "contact.company", etc.]
  
  createdById String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  createdBy   User      @relation("TemplateCreator", fields: [createdById], references: [id])
  campaigns   Campaign[]
}

enum TemplateCategory {
  GENERAL
  WELCOME
  FOLLOW_UP
  PROMOTION
  REMINDER
  NEWSLETTER
}
```

### New Campaign Table
```prisma
model Campaign {
  id          String         @id @default(cuid())
  name        String
  subject     String         // Can override template subject
  templateId  String?
  
  // Custom content (if not using template)
  customBody  String?        @db.Text
  
  status      CampaignStatus @default(DRAFT)
  scheduledFor DateTime?
  sentAt      DateTime?
  
  // Audience
  recipientSegment Json       // Filter criteria for contacts
  
  // Stats
  totalRecipients  Int       @default(0)
  sent             Int       @default(0)
  delivered        Int       @default(0)
  opened           Int       @default(0)
  clicked          Int       @default(0)
  bounced          Int       @default(0)
  unsubscribed     Int       @default(0)
  
  createdById String
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  template    EmailTemplate? @relation(fields: [templateId], references: [id])
  createdBy   User          @relation("CampaignCreator", fields: [createdById], references: [id])
  logs        EmailLog[]
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}
```

### New EmailLog Table
```prisma
model EmailLog {
  id          String    @id @default(cuid())
  campaignId  String?
  contactId   String
  
  // Email details
  to          String
  subject     String
  
  // Tracking
  sent        Boolean   @default(false)
  delivered   Boolean   @default(false)
  opened      Boolean   @default(false)
  clicked     Boolean   @default(false)
  bounced     Boolean   @default(false)
  
  openedAt    DateTime?
  clickedAt   DateTime?
  sentAt      DateTime?
  
  // Tracking tokens
  trackingId  String    @unique @default(cuid())
  
  createdAt   DateTime  @default(now())
  
  // Relations
  campaign    Campaign? @relation(fields: [campaignId], references: [id])
  contact     Contact   @relation(fields: [contactId], references: [id])
}
```

### Update Contact Model
```prisma
model Contact {
  // ... existing fields ...
  
  // NEW: Email preferences
  emailOptIn      Boolean   @default(true)
  unsubscribedAt  DateTime?
  
  // Relations
  emailLogs       EmailLog[]
}
```

---

## API Routes

### Automation APIs

#### `GET /api/automations`
**Response:**
```typescript
{
  rules: AutomationRule[],
  stats: {
    total: number,
    enabled: number,
    disabled: number
  }
}
```

#### `POST /api/automations`
**Body:**
```typescript
{
  name: string,
  description?: string,
  trigger: AutomationTrigger,
  triggerConfig: object,
  action: AutomationAction,
  actionConfig: object
}
```

#### `PATCH /api/automations/:id`
**Body:** Partial rule update

#### `DELETE /api/automations/:id`

#### `PATCH /api/automations/:id/toggle`
**Body:**
```typescript
{
  enabled: boolean
}
```

#### `GET /api/automations/logs`
**Query Parameters:**
- `ruleId?: string`
- `limit?: number`

**Response:**
```typescript
{
  logs: AutomationLog[]
}
```

---

### Email Template APIs

#### `GET /api/templates`
**Query Parameters:**
- `category?: string`

**Response:**
```typescript
{
  templates: EmailTemplate[]
}
```

#### `GET /api/templates/:id`
**Response:** Single template with rendered preview

#### `POST /api/templates`
**Body:**
```typescript
{
  name: string,
  subject: string,
  body: string,  // HTML
  category?: TemplateCategory,
  variables?: string[]
}
```

#### `PATCH /api/templates/:id`
**Body:** Partial template update

#### `DELETE /api/templates/:id`

#### `POST /api/templates/:id/preview`
**Body:**
```typescript
{
  contactId: string  // To populate variables
}
```
**Response:** Rendered HTML with variables replaced

---

### Campaign APIs

#### `GET /api/campaigns`
**Query Parameters:**
- `status?: string`

**Response:**
```typescript
{
  campaigns: Campaign[],
  stats: {
    totalCampaigns: number,
    totalSent: number,
    avgOpenRate: number,
    avgClickRate: number
  }
}
```

#### `GET /api/campaigns/:id`
**Response:** Single campaign with full stats

#### `POST /api/campaigns`
**Body:**
```typescript
{
  name: string,
  subject: string,
  templateId?: string,
  customBody?: string,
  recipientSegment: object,  // Filter criteria
  scheduledFor?: string  // ISO datetime
}
```

#### `PATCH /api/campaigns/:id`
**Body:** Partial campaign update

#### `DELETE /api/campaigns/:id`

#### `POST /api/campaigns/:id/send`
**Effect:** 
1. Calculate recipients based on segment
2. Queue emails for sending
3. Update campaign status to SENDING
4. Process queue and send emails
5. Update campaign status to SENT

#### `POST /api/campaigns/:id/test`
**Body:**
```typescript
{
  email: string  // Send test email to this address
}
```

---

### Email Tracking APIs (Public)

#### `GET /api/track/open/:trackingId`
**Public endpoint** — Returns 1x1 transparent pixel
**Effect:** Marks email as opened, records `openedAt`

#### `GET /api/track/click/:trackingId`
**Public endpoint** — Redirects to actual URL
**Query:** `?url=<encoded_url>`
**Effect:** Marks email as clicked, records `clickedAt`, redirects

---

## Component Structure

### Automations Components

```typescript
components/
├── automations/
│   ├── automation-list.tsx           // Table of automation rules
│   ├── automation-row.tsx            // Single rule row with toggle
│   ├── automation-modal.tsx          // Create/edit rule
│   ├── trigger-selector.tsx          // Dropdown for triggers
│   ├── trigger-config.tsx            // Dynamic form for trigger settings
│   ├── action-selector.tsx           // Dropdown for actions
│   ├── action-config.tsx             // Dynamic form for action settings
│   └── automation-log-table.tsx      // Log viewer
```

### Email Template Components

```typescript
components/
├── templates/
│   ├── template-grid.tsx             // Grid of template cards
│   ├── template-card.tsx             // Single template preview card
│   ├── template-modal.tsx            // Create/edit template
│   ├── template-editor.tsx           // Rich text editor (Tiptap)
│   ├── template-preview.tsx          // Live preview panel
│   ├── variable-picker.tsx           // Insert variable dropdown
│   └── template-category-filter.tsx  // Category filter chips
```

### Campaign Components

```typescript
components/
├── campaigns/
│   ├── campaign-grid.tsx             // Grid of campaign cards
│   ├── campaign-card.tsx             // Single campaign with stats
│   ├── campaign-modal.tsx            // Create/edit campaign
│   ├── campaign-stats.tsx            // Stats display (sent/opens/CTR)
│   ├── recipient-selector.tsx        // Segment builder
│   ├── campaign-preview.tsx          // Preview before send
│   └── send-confirmation-modal.tsx   // Confirm send action
```

---

## Page Structure

### `/app/(dashboard)/automations/page.tsx`
**Automations Screen**

```typescript
- Automation rules table:
  - Name, trigger → action, enabled toggle, last triggered time
  - Edit and delete actions
- "New Rule" button in topbar
- Automation log section below (recent 20)
```

### `/app/(dashboard)/templates/page.tsx`
**Email Templates Screen**

```typescript
- Template grid (cards with preview thumbnail)
- Category filter chips
- Click card → preview panel slides in
- "New Template" button in topbar
- Preview panel shows:
  - Subject line
  - Rendered HTML preview
  - Edit and Delete buttons
```

### `/app/(dashboard)/campaigns/page.tsx`
**Campaigns Screen**

```typescript
- Campaign cards grid:
  - Name, date, status badge
  - Stats: sent count, opens (with %), clicks (with %)
  - "Send Now" button (if draft)
  - Edit/Delete actions
- "New Campaign" button in topbar
```

---

## Zod Validation Schemas

### Automation Validation
```typescript
// lib/validations/automation.ts
import { z } from "zod";

export const automationTriggerSchema = z.enum([
  "CONTACT_CREATED",
  "CONTACT_STATUS_CHANGED",
  "DEAL_STAGE_CHANGED",
  "DEAL_WON",
  "DEAL_LOST",
  "TASK_COMPLETED",
  "TASK_OVERDUE",
  "APPOINTMENT_SCHEDULED",
  "APPOINTMENT_COMPLETED",
  "LEAD_SCORE_CHANGED"
]);

export const automationActionSchema = z.enum([
  "SEND_EMAIL",
  "CREATE_TASK",
  "UPDATE_CONTACT",
  "UPDATE_DEAL",
  "SEND_NOTIFICATION",
  "WEBHOOK"
]);

export const createAutomationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  trigger: automationTriggerSchema,
  triggerConfig: z.object({}).passthrough(),
  action: automationActionSchema,
  actionConfig: z.object({}).passthrough()
});

export const updateAutomationSchema = createAutomationSchema.partial();
```

### Template Validation
```typescript
// lib/validations/template.ts
import { z } from "zod";

export const templateCategorySchema = z.enum([
  "GENERAL",
  "WELCOME",
  "FOLLOW_UP",
  "PROMOTION",
  "REMINDER",
  "NEWSLETTER"
]);

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  category: templateCategorySchema.optional(),
  variables: z.array(z.string()).optional()
});

export const updateTemplateSchema = createTemplateSchema.partial();
```

### Campaign Validation
```typescript
// lib/validations/campaign.ts
import { z } from "zod";

export const campaignStatusSchema = z.enum([
  "DRAFT",
  "SCHEDULED",
  "SENDING",
  "SENT",
  "FAILED"
]);

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  templateId: z.string().cuid().optional(),
  customBody: z.string().optional(),
  recipientSegment: z.object({}).passthrough(),
  scheduledFor: z.string().datetime().optional()
}).refine(data => data.templateId || data.customBody, {
  message: "Either templateId or customBody must be provided"
});

export const updateCampaignSchema = createCampaignSchema.partial();
```

---

## TanStack Query Hooks

### Automation Hooks
```typescript
// hooks/use-automations.ts
export function useAutomations() {
  // GET /api/automations
}

export function useCreateAutomation() {
  // POST /api/automations
}

export function useUpdateAutomation() {
  // PATCH /api/automations/:id
}

export function useDeleteAutomation() {
  // DELETE /api/automations/:id
}

export function useToggleAutomation() {
  // PATCH /api/automations/:id/toggle
}

export function useAutomationLogs(ruleId?: string) {
  // GET /api/automations/logs
}
```

### Template Hooks
```typescript
// hooks/use-templates.ts
export function useTemplates(category?: string) {
  // GET /api/templates
}

export function useTemplate(id: string) {
  // GET /api/templates/:id
}

export function useCreateTemplate() {
  // POST /api/templates
}

export function useUpdateTemplate() {
  // PATCH /api/templates/:id
}

export function useDeleteTemplate() {
  // DELETE /api/templates/:id
}

export function usePreviewTemplate() {
  // POST /api/templates/:id/preview
}
```

### Campaign Hooks
```typescript
// hooks/use-campaigns.ts
export function useCampaigns(status?: string) {
  // GET /api/campaigns
}

export function useCampaign(id: string) {
  // GET /api/campaigns/:id
}

export function useCreateCampaign() {
  // POST /api/campaigns
}

export function useUpdateCampaign() {
  // PATCH /api/campaigns/:id
}

export function useDeleteCampaign() {
  // DELETE /api/campaigns/:id
}

export function useSendCampaign() {
  // POST /api/campaigns/:id/send
}

export function useSendTestEmail() {
  // POST /api/campaigns/:id/test
}
```

---

## Implementation Checklist

### 1. Email Service Setup
- [ ] Choose email provider (Resend or SendGrid)
- [ ] Set up account and get API key
- [ ] Configure email sending in environment variables
- [ ] Create email service utility (`lib/email.ts`)
- [ ] Test email sending

### 2. Database Setup
- [ ] Create AutomationRule and AutomationLog models
- [ ] Create EmailTemplate model
- [ ] Create Campaign and EmailLog models
- [ ] Update Contact model with email preferences
- [ ] Run migration
- [ ] Update seed script with sample data

### 3. Automation System
- [ ] Implement automation engine (`lib/automation-engine.ts`)
- [ ] Create trigger handlers for each trigger type
- [ ] Create action handlers for each action type
- [ ] Implement `/api/automations` CRUD routes
- [ ] Implement automation log API
- [ ] Set up background job processor (cron or queue)
- [ ] Test automation execution

### 4. Email Templates
- [ ] Implement `/api/templates` CRUD routes
- [ ] Set up rich text editor (Tiptap)
- [ ] Implement variable replacement system
- [ ] Create template preview functionality
- [ ] Build template grid UI
- [ ] Build template editor modal
- [ ] Test template rendering

### 5. Campaigns
- [ ] Implement `/api/campaigns` CRUD routes
- [ ] Create recipient segment calculator
- [ ] Implement send campaign logic with queueing
- [ ] Set up email tracking (open/click)
- [ ] Create public tracking endpoints
- [ ] Build campaign grid UI
- [ ] Build campaign creation modal
- [ ] Build campaign stats dashboard

### 6. Automations Screen
- [ ] Build automation rules table
- [ ] Build automation modal with trigger/action config
- [ ] Build automation log table
- [ ] Implement enable/disable toggle
- [ ] Test rule creation and execution

### 7. Templates Screen
- [ ] Build template grid with cards
- [ ] Build template preview panel
- [ ] Build template editor modal
- [ ] Add category filters
- [ ] Test template CRUD operations

### 8. Campaigns Screen
- [ ] Build campaign cards grid
- [ ] Build campaign creation modal
- [ ] Build recipient selector
- [ ] Build send confirmation modal
- [ ] Add campaign stats visualization
- [ ] Test campaign creation and sending

### 9. Sidebar Navigation
- [ ] Add "Marketing" section to sidebar
- [ ] Add "Automations" nav item
- [ ] Add "Templates" nav item
- [ ] Add "Campaigns" nav item

### 10. Testing
- [ ] Test automation triggers fire correctly
- [ ] Test automation actions execute properly
- [ ] Test email template rendering
- [ ] Test campaign sending
- [ ] Test email tracking (opens/clicks)
- [ ] Test unsubscribe functionality
- [ ] Test error handling and logs

### 11. Deployment
- [ ] Add email service API keys to Vercel
- [ ] Run database migration in production
- [ ] Test email delivery in production
- [ ] Monitor automation execution

---

## Definition of Done

✅ **Automations:**
- [ ] Users can create automation rules with triggers and actions
- [ ] Rules can be enabled/disabled
- [ ] Automation log shows execution history
- [ ] At least 3 triggers and 3 actions are working
- [ ] Background processing executes automations

✅ **Email Templates:**
- [ ] Users can create/edit/delete email templates
- [ ] Rich text editor allows formatting
- [ ] Variable placeholders can be inserted
- [ ] Templates can be previewed with real data
- [ ] Templates are categorized

✅ **Campaigns:**
- [ ] Users can create email campaigns
- [ ] Campaigns can use templates or custom content
- [ ] Recipients can be selected by segment
- [ ] Campaigns can be sent immediately or scheduled
- [ ] Email tracking shows opens and clicks
- [ ] Campaign stats are accurate
- [ ] Test emails can be sent before campaign

✅ **Integration:**
- [ ] Campaigns appear on dashboard stats
- [ ] Automations can send emails from templates
- [ ] Email logs are properly stored
- [ ] Unsubscribe functionality works
- [ ] All data persists correctly

---

## Next Steps (Phase 4)

After Phase 3 is complete, proceed to Phase 4 - Finance Management:
- Payments screen (Stripe integration)
- Invoices screen (invoice generation and tracking)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
