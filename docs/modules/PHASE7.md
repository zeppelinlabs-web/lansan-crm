# Phase 7 — Administration & Integrations

**Timeline:** 2–3 weeks  
**Depends on:** All previous phases  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Complete the admin section with user management, third-party integrations, and system settings. Admins can manage team members with role-based access, connect external services (Stripe, Gmail, Calendar, Slack, Zapier, etc.), generate API keys, and configure company settings and AI behavior.

## Screens Included (3 of 18 total)

16. **Users & Licenses** — Team member management, roles, invitations
17. **Integrations** — Third-party service connections, API key management
18. **Settings** — Company profile, AI model configuration

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **@google-cloud/oauth2** | Google OAuth (Gmail, Calendar) | Latest |
| **@slack/web-api** | Slack integration | Latest |
| **nodemailer** | Email sending (if using Gmail) | Latest |
| **ical-generator** | Calendar event generation | Latest |

---

## Database Schema Updates

### Update User Model
```prisma
model User {
  id            String     @id @default(cuid())
  name          String
  email         String     @unique
  passwordHash  String?
  role          UserRole   @default(AGENT)
  status        UserStatus @default(ACTIVE)
  
  // NEW: Invitation
  invitedBy     String?
  invitedAt     DateTime?
  inviteToken   String?    @unique
  inviteAcceptedAt DateTime?
  
  // NEW: Last activity
  lastLoginAt   DateTime?
  lastActiveAt  DateTime?
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relations (existing + new)
  // ... all existing relations ...
  invitedUsers  User[]     @relation("UserInvitations")
  inviter       User?      @relation("UserInvitations", fields: [invitedBy], references: [id])
}
```

### New IntegrationConnection Table
```prisma
model IntegrationConnection {
  id              String            @id @default(cuid())
  
  // Integration type
  provider        IntegrationProvider
  
  // OAuth tokens
  accessToken     String?           @db.Text
  refreshToken    String?           @db.Text
  expiresAt       DateTime?
  
  // Provider-specific data
  providerId      String?           // External user/account ID
  metadata        Json?             // Flexible storage for provider-specific data
  
  // Status
  status          ConnectionStatus  @default(ACTIVE)
  
  // Scope/permissions
  scopes          String[]
  
  // Ownership
  userId          String?           // User-level connection (e.g., personal Gmail)
  organizationWide Boolean          @default(false) // System-wide connection
  
  connectedAt     DateTime          @default(now())
  lastSyncedAt    DateTime?
  updatedAt       DateTime          @updatedAt
  
  // Relations
  user            User?             @relation("UserIntegrations", fields: [userId], references: [id])
  webhooks        IntegrationWebhook[]
}

enum IntegrationProvider {
  STRIPE
  GMAIL
  GOOGLE_CALENDAR
  SLACK
  ZAPIER
  TYPEFORM
  CALENDLY
  HUBSPOT
  APOLLO
  LINKEDIN
  MAKE
  QUICKBOOKS
}

enum ConnectionStatus {
  ACTIVE
  EXPIRED
  REVOKED
  ERROR
}
```

### New IntegrationWebhook Table
```prisma
model IntegrationWebhook {
  id              String      @id @default(cuid())
  connectionId    String
  
  // Webhook details
  event           String      // Event type from provider
  payload         Json        // Full webhook payload
  
  // Processing
  processed       Boolean     @default(false)
  processedAt     DateTime?
  error           String?
  
  receivedAt      DateTime    @default(now())
  
  // Relations
  connection      IntegrationConnection @relation(fields: [connectionId], references: [id])
}
```

### New ApiKey Table
```prisma
model ApiKey {
  id          String    @id @default(cuid())
  name        String    // User-friendly name
  key         String    @unique  // API key itself (hashed)
  keyPreview  String    // First/last few chars for display
  
  // Permissions
  scopes      String[]  // ["read:contacts", "write:deals", etc.]
  
  // Usage tracking
  lastUsedAt  DateTime?
  usageCount  Int       @default(0)
  
  // Status
  active      Boolean   @default(true)
  expiresAt   DateTime?
  
  createdById String
  createdAt   DateTime  @default(now())
  
  // Relations
  createdBy   User      @relation("ApiKeyCreator", fields: [createdById], references: [id])
}
```

### New CompanySettings Table
```prisma
model CompanySettings {
  id          String    @id @default(cuid())
  
  // Company info
  companyName String
  industry    String?
  website     String?
  
  // Contact info
  email       String?   // Company email
  phone       String?
  address     String?
  
  // Branding
  logo        String?   // Logo URL
  primaryColor String?  // Hex color
  
  // Email settings
  fromEmail   String?
  fromName    String?
  emailSignature String? @db.Text
  
  // AI settings
  aiModel     String    @default("gpt-4")
  aiPersonaName String  @default("AI Assistant")
  aiSystemPrompt String? @db.Text
  
  // Timezone
  timezone    String    @default("America/New_York")
  
  // Feature flags
  features    Json      @default("{}")
  
  updatedAt   DateTime  @updatedAt
}
```

### Update User Relation
```prisma
model User {
  // ... existing fields ...
  
  // Relations
  integrations     IntegrationConnection[] @relation("UserIntegrations")
  createdApiKeys   ApiKey[]               @relation("ApiKeyCreator")
}
```

---

## API Routes

### User Management APIs

#### `GET /api/users`
**Admin only**
**Response:**
```typescript
{
  users: User[],
  stats: {
    total: number,
    active: number,
    inactive: number,
    admins: number,
    managers: number,
    agents: number
  }
}
```

#### `GET /api/users/:id`
**Admin only**

#### `POST /api/users/invite`
**Admin only**
**Body:**
```typescript
{
  email: string,
  name: string,
  role: "ADMIN" | "MANAGER" | "AGENT"
}
```
**Effect:** Creates user with invite token, sends invite email

#### `POST /api/users/accept-invite/:token`
**Public** — Used during onboarding
**Body:**
```typescript
{
  password: string,
  name?: string
}
```

#### `PATCH /api/users/:id`
**Admin only**
**Body:**
```typescript
{
  name?: string,
  role?: UserRole,
  status?: UserStatus
}
```

#### `DELETE /api/users/:id`
**Admin only**

---

### Integration APIs

#### `GET /api/integrations`
**Response:**
```typescript
{
  connections: IntegrationConnection[],
  available: Array<{
    provider: string,
    name: string,
    description: string,
    icon: string,
    connected: boolean
  }>
}
```

#### `GET /api/integrations/:provider/connect`
**Effect:** Initiates OAuth flow, returns redirect URL

#### `GET /api/integrations/:provider/callback`
**OAuth callback** — Stores tokens

#### `DELETE /api/integrations/:id`
**Effect:** Disconnects integration, revokes tokens

#### `POST /api/integrations/:id/test`
**Effect:** Tests connection, returns status

#### `POST /api/integrations/:id/sync`
**Effect:** Manually trigger sync (e.g., import calendar events)

---

### API Key Management

#### `GET /api/api-keys`
**Admin only**
**Response:**
```typescript
{
  keys: ApiKey[]
}
```

#### `POST /api/api-keys`
**Admin only**
**Body:**
```typescript
{
  name: string,
  scopes: string[],
  expiresAt?: string
}
```
**Response:**
```typescript
{
  key: string,  // Full key (shown only once!)
  id: string,
  keyPreview: string
}
```

#### `DELETE /api/api-keys/:id`
**Admin only**

#### `PATCH /api/api-keys/:id/toggle`
**Admin only**
**Body:**
```typescript
{
  active: boolean
}
```

---

### Settings APIs

#### `GET /api/settings`
**Response:**
```typescript
{
  settings: CompanySettings
}
```

#### `PATCH /api/settings`
**Admin only**
**Body:** Partial settings update

---

### Webhook Endpoints

#### `POST /api/webhooks/zapier`
**Handles Zapier webhooks**

#### `POST /api/webhooks/slack`
**Handles Slack events**

#### `POST /api/webhooks/typeform`
**Handles Typeform submissions**

---

## Component Structure

### User Management Components

```typescript
components/
├── users/
│   ├── user-table.tsx                 // Team members list
│   ├── user-row.tsx                   // Single user row
│   ├── invite-user-modal.tsx          // Invite form
│   ├── edit-user-modal.tsx            // Edit role/status
│   ├── license-banner.tsx             // License info
│   └── user-activity-status.tsx       // Last active indicator
```

### Integration Components

```typescript
components/
├── integrations/
│   ├── integration-grid.tsx           // Grid of integration cards
│   ├── integration-card.tsx           // Single integration
│   ├── zapier-banner.tsx              // Special Zapier banner
│   ├── api-access-card.tsx            // API key management
│   ├── api-key-list.tsx               // List of API keys
│   ├── create-api-key-modal.tsx       // Generate new key
│   ├── api-docs-link.tsx              // Link to API docs
│   └── integration-settings-modal.tsx // Configure integration
```

### Settings Components

```typescript
components/
├── settings/
│   ├── company-settings-form.tsx      // Company info form
│   ├── ai-settings-form.tsx           // AI configuration
│   ├── email-settings-form.tsx        // Email configuration
│   ├── branding-settings.tsx          // Logo, colors
│   └── timezone-selector.tsx          // Timezone picker
```

---

## Page Structure

### `/app/(dashboard)/admin/users/page.tsx`
**Users & Licenses Screen**

```typescript
- License banner: "Unlimited licenses" (or actual limit)
- Team members table:
  - Name, Email, Role, Status, Last Active
  - Actions: Edit, Delete
- "Invite User" button in topbar
```

### `/app/(dashboard)/admin/integrations/page.tsx`
**Integrations Screen**

```typescript
- Zapier banner with external connect link

- Native integrations grid (3 columns):
  - Stripe (connected/disconnected toggle + settings)
  - Gmail (connect with OAuth)
  - Google Calendar (connect with OAuth)
  - Slack (connect with OAuth)
  - Typeform (webhook setup)
  - Calendly (webhook setup)
  - HubSpot (OAuth)
  - Apollo.io (API key)
  - LinkedIn (OAuth)
  - Make/Integromat (webhook)
  - QuickBooks (OAuth)

- API Access card:
  - API key list
  - "Generate API Key" button
  - "View API Docs" link (external)
  - Sample API request code block
```

### `/app/(dashboard)/admin/settings/page.tsx`
**Settings Screen**

```typescript
- Two-column form layout:
  
  Left column:
    - Company Settings section:
      - Company name
      - Industry dropdown
      - Website URL
      - Email, phone, address
      - Logo upload
    
    - Email Settings section:
      - From email
      - From name
      - Email signature (rich text)
  
  Right column:
    - AI Model Settings section:
      - Model selector (GPT-4, GPT-3.5, etc.)
      - AI persona name
      - System instructions (textarea)
    
    - Regional Settings:
      - Timezone selector
      - Date format
      - Currency

- Save button at bottom
```

---

## Integration Implementations

### Stripe Integration
Already implemented in Phase 4 — just add connection management UI

### Gmail Integration
```typescript
// OAuth scopes: gmail.send, gmail.readonly
// Use for:
- Sending emails from campaigns
- Syncing sent emails
- Reading email replies
```

### Google Calendar Integration
```typescript
// OAuth scopes: calendar.events, calendar.readonly
// Use for:
- Syncing appointments to Google Calendar
- Importing calendar events as appointments
- Sending calendar invites
```

### Slack Integration
```typescript
// OAuth scopes: chat:write, incoming-webhook
// Use for:
- Sending notifications for new leads
- Deal status changes
- Task reminders
- Daily summaries
```

### Zapier Integration
```typescript
// Webhook endpoints for:
- New contact created
- Deal stage changed
- Task completed
- Payment received
// Zapier handles the rest
```

---

## Implementation Checklist

### 1. Database Setup
- [ ] Update User model with invitation fields
- [ ] Create IntegrationConnection model
- [ ] Create IntegrationWebhook model
- [ ] Create ApiKey model
- [ ] Create CompanySettings model
- [ ] Run migration
- [ ] Update seed script

### 2. User Management
- [ ] Implement user CRUD APIs (admin only)
- [ ] Implement user invitation system
- [ ] Create invite email template
- [ ] Build user table UI
- [ ] Build invite user modal
- [ ] Build edit user modal
- [ ] Add role-based permissions checks
- [ ] Test invitation flow

### 3. Integrations Setup
- [ ] Set up OAuth apps for Google, Slack, etc.
- [ ] Implement OAuth flow handler
- [ ] Create integration service utilities
- [ ] Implement webhook handlers
- [ ] Build integration grid UI
- [ ] Build connection flow for each integration
- [ ] Test each integration connection

### 4. API Key Management
- [ ] Implement API key generation (with hashing)
- [ ] Implement API key authentication middleware
- [ ] Create API documentation
- [ ] Build API key management UI
- [ ] Build create API key modal
- [ ] Test API key authentication

### 5. Settings
- [ ] Implement settings CRUD API
- [ ] Build company settings form
- [ ] Build AI settings form
- [ ] Build email settings form
- [ ] Implement logo upload
- [ ] Test settings updates

### 6. Sidebar Navigation
- [ ] Add "Admin" section to sidebar
- [ ] Add "Users" nav item (admin only)
- [ ] Add "Integrations" nav item
- [ ] Add "Settings" nav item

### 7. Integration Features
- [ ] Implement Gmail email sending
- [ ] Implement Calendar sync
- [ ] Implement Slack notifications
- [ ] Implement Zapier webhooks
- [ ] Test each integration end-to-end

### 8. Testing
- [ ] Test user invitation flow
- [ ] Test role-based access control
- [ ] Test each integration connection
- [ ] Test API key generation and usage
- [ ] Test settings updates
- [ ] Test webhook handling
- [ ] Test error scenarios

---

## Definition of Done

✅ **User Management:**
- [ ] Admins can invite users
- [ ] Invite emails are sent correctly
- [ ] Users can accept invitations and set passwords
- [ ] Admins can edit user roles and status
- [ ] Admins can delete users
- [ ] Role-based permissions work across all screens
- [ ] Last login time is tracked

✅ **Integrations:**
- [ ] At least 3 integrations are fully functional (Stripe, Gmail, Calendar)
- [ ] OAuth flows work correctly
- [ ] Connections can be established and disconnected
- [ ] Integration settings can be configured
- [ ] Webhook handlers process events correctly
- [ ] Zapier webhooks are functional

✅ **API Access:**
- [ ] API keys can be generated
- [ ] API keys authenticate requests correctly
- [ ] API keys can be revoked
- [ ] API documentation is accessible
- [ ] Sample API requests work

✅ **Settings:**
- [ ] Company settings can be updated
- [ ] AI model can be configured
- [ ] Email settings work correctly
- [ ] Branding (logo, colors) can be customized
- [ ] All settings persist correctly

✅ **Security:**
- [ ] Only admins can access admin features
- [ ] OAuth tokens are stored securely
- [ ] API keys are hashed
- [ ] Sensitive data is not exposed in API responses

---

## Next Steps (Phase 8)

After Phase 7 is complete, proceed to Phase 8 - Polish & Production Readiness:
- Final testing and QA
- Performance optimization
- Documentation
- Production deployment preparation

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
