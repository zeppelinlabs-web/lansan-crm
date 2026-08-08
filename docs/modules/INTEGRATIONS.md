# LanSan CRM Integrations Guide

**Priority Level:** 🔥 Critical (2nd Most Important)  
**Phase:** Phase 7 (Administration & Integrations)  
**Timeline:** 2-3 weeks  
**Status:** 📋 Planned

---

## Overview

Integrations connect LanSan CRM with external tools your team already uses, eliminating manual data entry and enabling automated workflows. This document outlines all 12 planned integrations and their implementation strategies.

---

## Integration Categories

### 🔴 Critical (Must Have)
1. **Stripe** - Payment processing
2. **Gmail** - Email campaigns
3. **Google Calendar** - Appointment sync
4. **Slack** - Team notifications

### 🟡 High Priority (Should Have)
5. **Typeform** - Lead capture
6. **Calendly** - Booking sync
7. **Zapier** - Universal automation

### 🟢 Nice to Have (Can Wait)
8. **HubSpot** - CRM sync
9. **Apollo.io** - Lead enrichment
10. **LinkedIn** - Lead import
11. **Make/Integromat** - Advanced automation
12. **QuickBooks** - Accounting sync

---

## 1. Stripe Integration

### Purpose
Process payments for invoices, track transactions, and manage subscriptions.

### How It Works
```
Invoice Created → Payment Link Generated → Client Pays
                                              ↓
                                    Stripe Webhook
                                              ↓
                            CRM Updates Invoice Status
```

### Implementation Details

**Type:** Webhook-based (Level 2)  
**Priority:** 🔴 Critical  
**Dependencies:** Invoices page, Payments page

**Setup Steps:**
1. Create Stripe account and get API keys
2. Install `stripe` npm package
3. Create webhook endpoint: `/api/webhooks/stripe`
4. Store Stripe customer IDs with contacts
5. Generate payment links for invoices

**Database Schema:**
```prisma
model Payment {
  id          String   @id @default(cuid())
  amount      Float
  status      String   // Succeeded, Failed, Pending
  stripeId    String   @unique
  invoiceId   String?
  invoice     Invoice? @relation(fields: [invoiceId], references: [id])
  contactId   String?
  contact     Contact? @relation(fields: [contactId], references: [id])
  createdAt   DateTime @default(now())
}

model Invoice {
  id            String    @id @default(cuid())
  invoiceNumber String    @unique
  amount        Float
  status        String    // Paid, Pending, Overdue
  stripePaymentUrl String? // Payment link
  payments      Payment[]
  // ... other fields
}
```

**Key Features:**
- Generate Stripe checkout links for invoices
- Auto-update invoice status when payment succeeds
- Store payment history with transaction IDs
- Send payment confirmation emails
- Handle refunds and disputes

**Webhook Events to Handle:**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.failed` - Payment failed
- `charge.refunded` - Refund issued
- `customer.subscription.created` - New subscription

**Environment Variables:**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Code Example:**
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  if (event.type === 'payment_intent.succeeded') {
    const payment = event.data.object as Stripe.PaymentIntent;
    
    await prisma.payment.create({
      data: {
        amount: payment.amount / 100,
        status: 'Succeeded',
        stripeId: payment.id,
      }
    });
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: { stripePaymentUrl: { contains: payment.id } },
      data: { status: 'Paid' }
    });
  }
  
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

---

## 2. Gmail Integration

### Purpose
Send email campaigns from your Gmail account with open/click tracking.

### How It Works
```
Campaign Created → Select Contacts → Choose Template
                                              ↓
                                    Gmail API Sends Emails
                                              ↓
                            Track Opens & Clicks
```

**Type:** OAuth + API (Level 3)  
**Priority:** 🔴 Critical  
**Dependencies:** Campaigns page, Email Templates

**Setup Steps:**
1. Create Google Cloud project
2. Enable Gmail API
3. Set up OAuth 2.0 credentials
4. Implement OAuth flow
5. Store refresh tokens per user

**Database Schema:**
```prisma
model Integration {
  id           String   @id @default(cuid())
  name         String   // "Gmail"
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  accessToken  String   // Encrypted
  refreshToken String   // Encrypted
  expiresAt    DateTime
  connected    Boolean  @default(true)
  createdAt    DateTime @default(now())
  
  @@unique([userId, name])
}

model CampaignEmail {
  id         String   @id @default(cuid())
  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id])
  contactId  String
  contact    Contact  @relation(fields: [contactId], references: [id])
  sentAt     DateTime @default(now())
  opened     Boolean  @default(false)
  openedAt   DateTime?
  clicked    Boolean  @default(false)
  clickedAt  DateTime?
}
```

**Key Features:**
- OAuth authentication per user
- Send bulk emails via Gmail API
- Track email opens (tracking pixel)
- Track link clicks (redirect tracking)
- Log sent emails to contact timeline
- Auto-refresh expired tokens

**OAuth Flow:**
```typescript
// app/api/integrations/gmail/auth/route.ts
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_URL}/api/integrations/gmail/callback`
);

export async function GET(req: Request) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly'
    ],
    prompt: 'consent'
  });
  
  return Response.redirect(authUrl);
}
```

**Environment Variables:**
```env
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
```

---

## 3. Google Calendar Integration

### Purpose
Two-way sync between CRM appointments and Google Calendar.

### How It Works
```
CRM Appointment ↔ Google Calendar Event
     (Sync every 15 minutes)
```

**Type:** OAuth + Background Sync (Level 3)  
**Priority:** 🔴 Critical  
**Dependencies:** Appointments page

**Setup Steps:**
1. Same OAuth setup as Gmail
2. Enable Google Calendar API
3. Create background sync job (cron/queue)
4. Handle conflict resolution
5. Sync calendar events both ways

**Database Schema:**
```prisma
model Appointment {
  id              String    @id @default(cuid())
  name            String
  time            DateTime
  type            String
  status          String
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  googleEventId   String?   @unique
  syncedToGoogle  Boolean   @default(false)
  lastSyncedAt    DateTime?
}
```

**Key Features:**
- Push CRM appointments to Google Calendar
- Pull Google events into CRM
- Update events in both systems
- Delete events from both systems
- Prevent duplicate bookings

**Sync Logic:**
```typescript
// lib/jobs/calendar-sync.ts
export async function syncCalendar(userId: string) {
  const integration = await prisma.integration.findUnique({
    where: { userId_name: { userId, name: 'Google Calendar' } }
  });
  
  if (!integration) return;
  
  const calendar = google.calendar('v3');
  
  // 1. Push new CRM appointments to Google
  const unsyncedAppts = await prisma.appointment.findMany({
    where: { userId, syncedToGoogle: false }
  });
  
  for (const appt of unsyncedAppts) {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: appt.name,
        start: { dateTime: appt.time.toISOString() },
        end: { dateTime: addHours(appt.time, 1).toISOString() },
      }
    });
    
    await prisma.appointment.update({
      where: { id: appt.id },
      data: { 
        syncedToGoogle: true,
        googleEventId: event.data.id,
        lastSyncedAt: new Date()
      }
    });
  }
  
  // 2. Pull new Google events to CRM
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 100
  });
  
  for (const event of events.data.items || []) {
    const exists = await prisma.appointment.findUnique({
      where: { googleEventId: event.id }
    });
    
    if (!exists && event.start?.dateTime) {
      await prisma.appointment.create({
        data: {
          name: event.summary || 'Untitled',
          time: new Date(event.start.dateTime),
          type: 'Google Calendar',
          status: 'Confirmed',
          userId,
          googleEventId: event.id,
          syncedToGoogle: true,
          lastSyncedAt: new Date()
        }
      });
    }
  }
}
```

**Cron Job (runs every 15 minutes):**
```typescript
// Using Vercel Cron or external service
export async function GET() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    await syncCalendar(user.id);
  }
  
  return new Response('Sync complete', { status: 200 });
}
```

---

## 4. Slack Integration

### Purpose
Send real-time notifications to Slack channels when important events occur.

### How It Works
```
Event in CRM → Trigger Check → Send Slack Message
```

**Type:** Webhook + API (Level 2)  
**Priority:** 🔴 Critical  
**Dependencies:** Automations page

**Setup Steps:**
1. Create Slack app in workspace
2. Enable Incoming Webhooks
3. Get webhook URL per channel
4. Store webhook URL in integration settings
5. Send POST requests on events

**Database Schema:**
```prisma
model Integration {
  // ... existing fields
  webhookUrl String? // Slack webhook URL
  config     Json?   // Channel settings
}
```

**Key Features:**
- New lead alerts
- Deal stage changes
- Task overdue warnings
- Payment received notifications
- High-value deal alerts
- Daily/weekly summary reports

**Code Example:**
```typescript
// lib/slack.ts
export async function sendSlackNotification(
  message: string,
  webhookUrl: string
) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        }
      ]
    })
  });
}

// Usage example
await sendSlackNotification(
  `🎯 *New Hot Lead!*\nMarcus Vance from Apex Tech\n$24,500 potential value`,
  integration.webhookUrl
);
```

**Message Templates:**
```typescript
// New Lead
🎯 *New Hot Lead!*
{name} from {company}
${amount} potential value
<{crmUrl}|View in CRM>

// Deal Advanced
🚀 *Deal Advanced!*
{name} - {company}
Moved to {stage} stage

// Payment Received
💰 *Payment Received!*
${amount} from {company}
Invoice #{number} now Paid

// Task Overdue
⚠️ *Task Overdue*
"{taskName}"
Assigned to: {userName}
Due: {dueDate}
```

---

## 5. Typeform Integration

### Purpose
Automatically create leads when someone submits a Typeform.

### How It Works
```
Client fills Typeform → Webhook → CRM creates Lead
```

**Type:** Webhook (Level 2)  
**Priority:** 🟡 High  
**Dependencies:** Leads page, Contacts page

**Setup Steps:**
1. Create Typeform account
2. Build form with fields matching CRM
3. Configure webhook in Typeform settings
4. Point webhook to CRM endpoint
5. Map form fields to CRM fields

**Webhook Endpoint:**
```typescript
// app/api/webhooks/typeform/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  const answers = data.form_response.answers;
  
  // Extract form field values
  const name = answers.find(a => a.field.ref === 'name')?.text;
  const email = answers.find(a => a.field.ref === 'email')?.email;
  const company = answers.find(a => a.field.ref === 'company')?.text;
  const budget = answers.find(a => a.field.ref === 'budget')?.number;
  
  // Create lead in CRM
  await prisma.lead.create({
    data: {
      name,
      company,
      email,
      leadScore: budget > 10000 ? 'Hot' : 'Warm',
      source: 'Website Form',
      added: new Date().toISOString().split('T')[0]
    }
  });
  
  // Also create contact
  await prisma.contact.create({
    data: {
      name,
      company,
      email,
      status: 'Lead',
      phone: '—'
    }
  });
  
  // Optional: Send to Slack
  await sendSlackNotification(
    `🎯 *New Form Submission*\n${name} from ${company}\nBudget: $${budget}`
  );
  
  return new Response('OK', { status: 200 });
}
```

**Form Field Mapping:**
| Typeform Field | CRM Field | Required |
|----------------|-----------|----------|
| Name | name | Yes |
| Email | email | Yes |
| Company | company | No |
| Phone | phone | No |
| Budget | leadScore logic | No |
| Message | notes | No |

---

## 6. Calendly Integration

### Purpose
Sync Calendly bookings as CRM appointments.

### How It Works
```
Client books on Calendly → Webhook → CRM Appointment
```

**Type:** Webhook (Level 2)  
**Priority:** 🟡 High  
**Dependencies:** Appointments page

**Setup Steps:**
1. Create Calendly account
2. Set up event types
3. Configure webhook subscriptions
4. Map Calendly events to CRM appointments
5. Create contacts from new bookings

**Webhook Endpoint:**
```typescript
// app/api/webhooks/calendly/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  
  if (data.event === 'invitee.created') {
    const invitee = data.payload;
    
    // Find user by Calendly username
    const user = await prisma.user.findFirst({
      where: { calendlyUsername: invitee.event.owner.slug }
    });
    
    // Create appointment
    await prisma.appointment.create({
      data: {
        name: `${invitee.name} — ${invitee.event.name}`,
        time: new Date(invitee.scheduled_event.start_time),
        type: invitee.event.name,
        status: 'Confirmed',
        userId: user?.id,
        calendlyEventId: invitee.uri
      }
    });
    
    // Create contact if new
    const existingContact = await prisma.contact.findFirst({
      where: { email: invitee.email }
    });
    
    if (!existingContact) {
      await prisma.contact.create({
        data: {
          name: invitee.name,
          email: invitee.email,
          company: invitee.company || 'Unknown',
          status: 'Lead',
          phone: invitee.phone || '—'
        }
      });
    }
    
    // Send Slack notification
    await sendSlackNotification(
      `📅 *New Calendly Booking*\n${invitee.name}\n${invitee.event.name}\n${new Date(invitee.scheduled_event.start_time).toLocaleString()}`
    );
  }
  
  return new Response('OK', { status: 200 });
}
```

**Database Fields:**
```prisma
model Appointment {
  // ... existing fields
  calendlyEventId String? @unique
}

model User {
  // ... existing fields
  calendlyUsername String? // e.g., "sofia-rodriguez"
}
```

---

## 7. Zapier Integration

### Purpose
Connect LanSan CRM to 6,000+ apps via Zapier workflows.

### How It Works
```
Trigger (Any App) → Zapier → Action in LanSan CRM
```

**Type:** External Link + Webhooks (Level 1/2)  
**Priority:** 🟡 High  
**Dependencies:** API endpoints

**Setup Steps:**
1. Build public API endpoints
2. Create API key authentication
3. Register as Zapier partner (optional)
4. Provide webhook URLs for triggers
5. Document API endpoints for Zapier

**API Endpoints Needed:**
```
POST /api/v1/contacts     - Create contact
POST /api/v1/leads        - Create lead
POST /api/v1/deals        - Create deal
POST /api/v1/tasks        - Create task
POST /api/v1/appointments - Create appointment
GET  /api/v1/contacts     - List contacts (for Zapier searches)
```

**Example Zapier Workflow:**
```
Facebook Lead Ad → Zapier → POST /api/v1/leads
                                    ↓
                          Lead created in CRM
```

**Webhook Triggers (for Zapier):**
```typescript
// Send webhook to Zapier when events occur
export async function sendZapierWebhook(
  webhookUrl: string,
  data: any
) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// Example: Notify Zapier when deal is won
if (deal.stage === 'Won') {
  await sendZapierWebhook(user.zapierWebhookUrl, {
    event: 'deal.won',
    deal: {
      id: deal.id,
      name: deal.name,
      company: deal.company,
      amount: deal.amount
    }
  });
}
```

---

## 8. HubSpot Integration

### Purpose
Two-way sync between LanSan CRM and HubSpot.

### How It Works
```
Contact in LanSan ↔ Contact in HubSpot
    (Sync every 15 min)
```

**Type:** OAuth + Background Sync (Level 3)  
**Priority:** 🟢 Nice to Have  
**Dependencies:** Contacts, Deals pages

**Setup Steps:**
1. Create HubSpot app
2. Implement OAuth flow
3. Build sync engine
4. Handle conflict resolution
5. Map fields between systems

**Field Mapping:**
| LanSan | HubSpot |
|--------|---------|
| name | firstname + lastname |
| company | company.name |
| email | email |
| phone | phone |
| status | lifecyclestage |
| deals | deals |

**Sync Strategy:**
- Pull HubSpot changes every 15 minutes
- Push LanSan changes immediately
- Last-write-wins for conflicts
- Log all sync operations

---

## 9. Apollo.io Integration

### Purpose
Enrich contact data with company information.

### How It Works
```
Contact with Email → Apollo API → Full Profile Returned
```

**Type:** API (Level 2)  
**Priority:** 🟢 Nice to Have  
**Dependencies:** Contacts page

**Setup Steps:**
1. Get Apollo.io API key
2. Create "Enrich" button on contact page
3. Call Apollo API with email
4. Auto-fill returned data
5. Store enrichment timestamp

**API Example:**
```typescript
// lib/apollo.ts
export async function enrichContact(email: string) {
  const response = await fetch('https://api.apollo.io/v1/people/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.APOLLO_API_KEY!
    },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  return {
    name: data.person.name,
    title: data.person.title,
    company: data.person.organization.name,
    phone: data.person.phone_numbers[0]?.sanitized_number,
    linkedin: data.person.linkedin_url,
    companySize: data.person.organization.estimated_num_employees,
    revenue: data.person.organization.estimated_annual_revenue
  };
}
```

---

## 10. LinkedIn Integration

### Purpose
Import leads from LinkedIn Sales Navigator.

### How It Works
```
Export CSV from LinkedIn → Upload to CRM → Import as Leads
```

**Type:** CSV Import (Level 1)  
**Priority:** 🟢 Nice to Have  
**Dependencies:** Import page, Leads page

**Setup Steps:**
1. Export leads CSV from LinkedIn
2. Use existing Import wizard
3. Map LinkedIn columns to CRM fields
4. Tag all imports with "LinkedIn" source
5. Auto-assign lead score based on title

**CSV Column Mapping:**
| LinkedIn Column | CRM Field |
|-----------------|-----------|
| First Name + Last Name | name |
| Company | company |
| Position | title |
| Email | email |
| Phone | phone |

---

## 11. Make (Integromat) Integration

### Purpose
Advanced multi-step automation workflows.

### How It Works
```
Trigger → Make Scenario → Multiple Actions
```

**Type:** Webhooks + API (Level 2)  
**Priority:** 🟢 Nice to Have  
**Dependencies:** Same as Zapier

**Setup:**
Same API endpoints as Zapier integration. Make offers more advanced features like:
- Conditional logic (if/then/else)
- Multiple parallel actions
- Data transformation
- Error handling

**Example Scenario:**
```
1. Watch for new contacts in CRM
2. IF company size > 100
   → Tag as "Enterprise"
   → Assign to James (Manager)
   → Create task "Enterprise onboarding"
3. ELSE
   → Tag as "SMB"
   → Assign to Sofia (Agent)
   → Send welcome email
4. Add to Mailchimp list
5. Post to Slack
```

---

## 12. QuickBooks Integration

### Purpose
Sync invoices and payments with QuickBooks for accounting.

### How It Works
```
Invoice in CRM ↔ Invoice in QuickBooks
Payment received → Updates both systems
```

**Type:** OAuth + Background Sync (Level 3)  
**Priority:** 🟢 Nice to Have  
**Dependencies:** Invoices, Payments pages

**Setup Steps:**
1. Create QuickBooks app
2. Implement OAuth flow
3. Map invoice fields
4. Sync invoices and payments
5. Handle tax calculations

**Field Mapping:**
| LanSan | QuickBooks |
|--------|------------|
| invoiceNumber | DocNumber |
| client | CustomerRef |
| amount | TotalAmt |
| status | Balance (0 = Paid) |
| dueDate | DueDate |

---

## Implementation Priority Order

### Phase 7 — Week 1
1. **Stripe** (Critical - 3 days)
   - Payment processing
   - Webhook setup
   - Invoice integration

2. **Slack** (Critical - 2 days)
   - Basic notifications
   - Webhook configuration
   - Message templates

### Phase 7 — Week 2
3. **Gmail** (Critical - 4 days)
   - OAuth implementation
   - Campaign sending
   - Email tracking

4. **Google Calendar** (Critical - 3 days)
   - OAuth implementation
   - Two-way sync
   - Background jobs

### Phase 7 — Week 3
5. **Typeform** (High - 1 day)
   - Webhook endpoint
   - Lead creation

6. **Calendly** (High - 1 day)
   - Webhook endpoint
   - Appointment sync

7. **Zapier** (High - 2 days)
   - API documentation
   - Webhook triggers

### Future Phases
8-12. **Others** as needed based on demand

---

## Security Considerations

### Token Storage
```typescript
// Encrypt sensitive data before storing
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Webhook Verification
```typescript
// Always verify webhook signatures
function verifyStripeSignature(payload: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}
```

### Rate Limiting
```typescript
// Limit API calls to prevent abuse
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each API key to 100 requests per window
});
```

### Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Gmail & Google Calendar
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Apollo.io
APOLLO_API_KEY=...

# Encryption
ENCRYPTION_KEY=... # 64 hex characters (32 bytes)

# API Keys
API_KEY_SECRET=... # For generating/validating API keys
```

---

## Testing Strategy

### Unit Tests
```typescript
// Test each integration function
describe('Stripe Integration', () => {
  it('should create payment on webhook', async () => {
    const payload = { /* webhook data */ };
    const result = await handleStripeWebhook(payload);
    expect(result.success).toBe(true);
  });
  
  it('should update invoice status', async () => {
    // Test invoice update logic
  });
});
```

### Integration Tests
```typescript
// Test full workflows
describe('Gmail Campaign Flow', () => {
  it('should send campaign emails', async () => {
    const campaign = await createCampaign({ /* data */ });
    await sendCampaign(campaign.id);
    
    const emails = await getCampaignEmails(campaign.id);
    expect(emails.length).toBeGreaterThan(0);
  });
});
```

### Manual Testing Checklist
- [ ] Stripe payment completes and updates invoice
- [ ] Gmail sends campaign and tracks opens
- [ ] Google Calendar syncs appointments both ways
- [ ] Slack sends notifications on events
- [ ] Typeform submission creates lead
- [ ] Calendly booking creates appointment
- [ ] Zapier receives webhook triggers
- [ ] API keys authenticate correctly
- [ ] OAuth flows work for all services
- [ ] Webhooks verify signatures properly

---

## Monitoring & Logging

### Integration Logs
```prisma
model IntegrationLog {
  id            String   @id @default(cuid())
  integrationId String
  integration   Integration @relation(fields: [integrationId], references: [id])
  event         String   // "webhook_received", "sync_completed", "error"
  status        String   // "success", "error"
  data          Json     // Event details
  errorMessage  String?
  createdAt     DateTime @default(now())
}
```

### Metrics to Track
- Webhook success/failure rate
- Sync latency (time to sync)
- API call volume per integration
- Token refresh failures
- Data conflicts resolved

---

## Troubleshooting Guide

### Common Issues

**Issue: Stripe webhook not receiving events**
- Check webhook URL is publicly accessible
- Verify webhook secret matches
- Check Stripe dashboard for delivery attempts
- Look for SSL/TLS issues

**Issue: OAuth token expired**
- Implement automatic token refresh
- Use refresh token to get new access token
- Store expiry time and refresh proactively

**Issue: Calendar sync duplicating events**
- Check `googleEventId` uniqueness
- Implement better conflict detection
- Add `lastSyncedAt` timestamp checks

**Issue: Slack notifications not sending**
- Verify webhook URL is correct
- Check Slack app permissions
- Test webhook manually with curl

---

## API Documentation

### Authentication
```
Authorization: Bearer {apiKey}
```

### Endpoints

**Create Contact**
```
POST /api/v1/contacts
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "company": "Example Corp",
  "phone": "(555) 123-4567",
  "status": "Lead"
}
```

**Create Lead**
```
POST /api/v1/leads
Content-Type: application/json

{
  "name": "Jane Doe",
  "company": "Tech Corp",
  "email": "jane@techcorp.com",
  "leadScore": "Hot",
  "source": "Website"
}
```

**List Contacts**
```
GET /api/v1/contacts?limit=50&offset=0
```

---

## Success Metrics

### KPIs to Track
- Number of active integrations per user
- Webhooks processed per day
- API calls per month
- Integration uptime %
- Average sync latency
- User satisfaction with integrations

### Goals
- 95%+ webhook success rate
- < 5 minute sync latency
- 99.9% integration uptime
- 80%+ users using at least one integration

---

**Status:** Ready for Phase 7 Implementation 🚀
