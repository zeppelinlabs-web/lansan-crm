# Phase 4 — Finance Management

**Timeline:** 2–3 weeks  
**Depends on:** Phase 1 (Contacts) + Stripe integration  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Add payment processing and invoice management capabilities. Users can connect Stripe to accept payments, charge clients directly, track transaction history, generate invoices, and manage payment statuses.

## Screens Included (2 of 18 total)

10. **Payments** — Stripe connection, transaction history, charge client
11. **Invoices** — Invoice management, PDF generation, payment tracking

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **@stripe/stripe-js** | Stripe frontend SDK | Latest |
| **stripe** (Node) | Stripe backend SDK | Latest |
| **@react-pdf/renderer** | PDF generation for invoices | Latest |
| **react-to-print** | Print/download invoices | Latest |

---

## Database Schema Updates

### New Payment Table
```prisma
model Payment {
  id              String         @id @default(cuid())
  
  // Stripe details
  stripePaymentId String         @unique
  stripeCustomerId String?
  
  // Transaction details
  amount          Decimal        @db.Decimal(12, 2)
  currency        String         @default("USD")
  status          PaymentStatus  @default(PENDING)
  method          PaymentMethod  @default(CARD)
  
  // Client details
  contactId       String
  description     String?
  
  // Invoice reference
  invoiceId       String?        @unique
  
  // Metadata
  refundAmount    Decimal?       @db.Decimal(12, 2)
  refundedAt      DateTime?
  failureReason   String?
  
  createdById     String
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  contact         Contact        @relation(fields: [contactId], references: [id])
  invoice         Invoice?       @relation(fields: [invoiceId], references: [id])
  createdBy       User           @relation("PaymentCreator", fields: [createdById], references: [id])
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum PaymentMethod {
  CARD
  BANK_TRANSFER
  CASH
  CHECK
  OTHER
}
```

### New Invoice Table
```prisma
model Invoice {
  id              String         @id @default(cuid())
  invoiceNumber   String         @unique  // INV-0001, INV-0002, etc.
  
  // Client details
  contactId       String
  
  // Invoice details
  description     String
  amount          Decimal        @db.Decimal(12, 2)
  tax             Decimal        @default(0) @db.Decimal(12, 2)
  total           Decimal        @db.Decimal(12, 2)
  currency        String         @default("USD")
  
  // Dates
  issueDate       DateTime       @default(now())
  dueDate         DateTime
  paidDate        DateTime?
  
  // Status
  status          InvoiceStatus  @default(DRAFT)
  
  // Line items (stored as JSON)
  items           Json           // [{description, quantity, unitPrice, total}]
  
  // Notes
  notes           String?        @db.Text
  terms           String?        @db.Text
  
  // Payment tracking
  paymentId       String?        @unique
  paymentLink     String?        // Stripe payment link
  
  createdById     String
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  contact         Contact        @relation(fields: [contactId], references: [id])
  payment         Payment?
  createdBy       User           @relation("InvoiceCreator", fields: [createdById], references: [id])
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}
```

### Update Contact Model
```prisma
model Contact {
  // ... existing fields ...
  
  // NEW: Stripe details
  stripeCustomerId String?   @unique
  
  // Relations
  payments         Payment[]
  invoices         Invoice[]
}
```

### Update User Model
```prisma
model User {
  // ... existing fields ...
  
  // Relations
  createdPayments  Payment[]  @relation("PaymentCreator")
  createdInvoices  Invoice[]  @relation("InvoiceCreator")
}
```

### New StripeAccount Table (for settings)
```prisma
model StripeAccount {
  id              String    @id @default(cuid())
  
  // Stripe connection
  stripeAccountId String    @unique
  accessToken     String    @db.Text
  refreshToken    String?   @db.Text
  connected       Boolean   @default(true)
  
  // Account details
  businessName    String?
  email           String?
  country         String?
  
  connectedAt     DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## API Routes

### Stripe Connection APIs

#### `GET /api/stripe/status`
**Response:**
```typescript
{
  connected: boolean,
  accountDetails?: {
    businessName: string,
    email: string,
    country: string
  }
}
```

#### `POST /api/stripe/connect`
**Effect:** Initiates Stripe OAuth flow
**Response:** Redirect URL to Stripe

#### `GET /api/stripe/callback`
**OAuth callback endpoint**
**Effect:** Stores Stripe credentials

#### `DELETE /api/stripe/disconnect`
**Effect:** Removes Stripe connection

---

### Payment APIs

#### `GET /api/payments`
**Query Parameters:**
- `contactId?: string`
- `status?: string`
- `startDate?: string`
- `endDate?: string`

**Response:**
```typescript
{
  payments: Payment[],
  stats: {
    totalCollected: number,
    thisMonth: number,
    pending: number,
    refunds: number
  }
}
```

#### `GET /api/payments/:id`
**Response:** Single payment with full details

#### `POST /api/payments/charge`
**Body:**
```typescript
{
  contactId: string,
  amount: number,
  description: string,
  currency?: string,
  method: PaymentMethod
}
```
**Effect:**
1. Get/create Stripe customer for contact
2. Create payment intent in Stripe
3. Return client secret for frontend to complete payment
4. Create Payment record in database

#### `POST /api/payments/:id/refund`
**Body:**
```typescript
{
  amount?: number  // Partial refund, or full if omitted
}
```
**Effect:**
1. Process refund in Stripe
2. Update Payment record with refund details

---

### Invoice APIs

#### `GET /api/invoices`
**Query Parameters:**
- `status?: string`
- `contactId?: string`

**Response:**
```typescript
{
  invoices: Invoice[]
}
```

#### `GET /api/invoices/:id`
**Response:** Single invoice with contact details

#### `POST /api/invoices`
**Body:**
```typescript
{
  contactId: string,
  description: string,
  dueDate: string,
  items: Array<{
    description: string,
    quantity: number,
    unitPrice: number
  }>,
  tax?: number,
  notes?: string,
  terms?: string
}
```
**Effect:** Creates invoice, calculates totals, generates invoice number

#### `PATCH /api/invoices/:id`
**Body:** Partial invoice update

#### `DELETE /api/invoices/:id`

#### `POST /api/invoices/:id/send`
**Effect:**
1. Generate payment link in Stripe
2. Send invoice email to contact
3. Update status to SENT

#### `POST /api/invoices/:id/mark-paid`
**Body:**
```typescript
{
  paymentId?: string,
  paidDate?: string
}
```

#### `GET /api/invoices/:id/pdf`
**Response:** PDF file download

---

### Stripe Webhook

#### `POST /api/webhooks/stripe`
**Handles Stripe webhook events:**
- `payment_intent.succeeded` → Update payment status
- `payment_intent.failed` → Update payment status, log error
- `charge.refunded` → Update payment with refund details
- `customer.created` → Store customer ID
- `invoice.paid` → Update invoice status (if using Stripe billing)

---

## Component Structure

### Payments Components

```typescript
components/
├── payments/
│   ├── stripe-connection-banner.tsx   // Connection status + connect button
│   ├── payment-stats-row.tsx          // Stats cards
│   ├── payment-table.tsx              // Transaction history
│   ├── payment-row.tsx                // Single transaction row
│   ├── charge-modal.tsx               // Charge client modal
│   ├── stripe-payment-form.tsx        // Stripe Elements form
│   ├── refund-modal.tsx               // Process refund
│   └── payment-receipt.tsx            // Receipt view/print
```

### Invoice Components

```typescript
components/
├── invoices/
│   ├── invoice-table.tsx              // Invoice list
│   ├── invoice-row.tsx                // Single invoice row
│   ├── invoice-modal.tsx              // Create/edit invoice
│   ├── invoice-line-items.tsx         // Line item editor
│   ├── invoice-preview.tsx            // Preview before sending
│   ├── invoice-pdf.tsx                // PDF template (@react-pdf)
│   ├── invoice-status-badge.tsx       // Status indicator
│   └── send-invoice-modal.tsx         // Send confirmation
```

---

## Page Structure

### `/app/(dashboard)/payments/page.tsx`
**Payments Screen**

```typescript
- Stripe connection banner (if not connected)
- Stats cards:
  - Total collected (all time)
  - This month
  - Pending
  - Refunds
- Recent transactions table:
  - Date, contact, description, amount, status, actions
- "Charge Client" button in topbar
```

### `/app/(dashboard)/invoices/page.tsx`
**Invoices Screen**

```typescript
- Invoices table:
  - Invoice #, client, description, amount, due date, status
  - Actions: view, edit, send, download PDF, delete
- "Create Invoice" button in topbar
```

---

## Zod Validation Schemas

### Payment Validation
```typescript
// lib/validations/payment.ts
import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED"
]);

export const paymentMethodSchema = z.enum([
  "CARD",
  "BANK_TRANSFER",
  "CASH",
  "CHECK",
  "OTHER"
]);

export const chargeClientSchema = z.object({
  contactId: z.string().cuid(),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  currency: z.string().length(3).default("USD"),
  method: paymentMethodSchema
});

export const refundPaymentSchema = z.object({
  amount: z.number().positive().optional()
});
```

### Invoice Validation
```typescript
// lib/validations/invoice.ts
import { z } from "zod";

export const invoiceStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "PAID",
  "OVERDUE",
  "CANCELLED"
]);

export const invoiceLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative()
});

export const createInvoiceSchema = z.object({
  contactId: z.string().cuid(),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime(),
  items: z.array(invoiceLineItemSchema).min(1, "At least one item required"),
  tax: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  terms: z.string().optional()
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const markPaidSchema = z.object({
  paymentId: z.string().cuid().optional(),
  paidDate: z.string().datetime().optional()
});
```

---

## TanStack Query Hooks

### Payment Hooks
```typescript
// hooks/use-payments.ts
export function usePayments(filters?: PaymentFilters) {
  // GET /api/payments
}

export function usePayment(id: string) {
  // GET /api/payments/:id
}

export function useChargeClient() {
  // POST /api/payments/charge
}

export function useRefundPayment() {
  // POST /api/payments/:id/refund
}

export function useStripeStatus() {
  // GET /api/stripe/status
}
```

### Invoice Hooks
```typescript
// hooks/use-invoices.ts
export function useInvoices(filters?: InvoiceFilters) {
  // GET /api/invoices
}

export function useInvoice(id: string) {
  // GET /api/invoices/:id
}

export function useCreateInvoice() {
  // POST /api/invoices
}

export function useUpdateInvoice() {
  // PATCH /api/invoices/:id
}

export function useDeleteInvoice() {
  // DELETE /api/invoices/:id
}

export function useSendInvoice() {
  // POST /api/invoices/:id/send
}

export function useMarkInvoicePaid() {
  // POST /api/invoices/:id/mark-paid
}
```

---

## Implementation Checklist

### 1. Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys (test and live)
- [ ] Set up Stripe OAuth app
- [ ] Configure webhook endpoint
- [ ] Add Stripe keys to environment variables

### 2. Database Setup
- [ ] Create Payment model
- [ ] Create Invoice model
- [ ] Create StripeAccount model
- [ ] Update Contact model with Stripe customer ID
- [ ] Run migration
- [ ] Update seed script with sample payments/invoices

### 3. Stripe Integration
- [ ] Install Stripe SDKs
- [ ] Create Stripe service utility (`lib/stripe.ts`)
- [ ] Implement OAuth connection flow
- [ ] Implement webhook handler
- [ ] Test Stripe connection

### 4. Payment System
- [ ] Implement `/api/payments` routes
- [ ] Implement `/api/stripe/connect` flow
- [ ] Create charge client functionality
- [ ] Integrate Stripe Elements for card payments
- [ ] Implement refund functionality
- [ ] Build payment stats calculator
- [ ] Test payment processing end-to-end

### 5. Invoice System
- [ ] Implement `/api/invoices` CRUD routes
- [ ] Create invoice number generator
- [ ] Implement line item calculator
- [ ] Create PDF template with @react-pdf
- [ ] Implement send invoice functionality
- [ ] Create payment link generation
- [ ] Test invoice creation and sending

### 6. Payments Screen
- [ ] Build Stripe connection banner
- [ ] Build payment stats cards
- [ ] Build transaction history table
- [ ] Build charge client modal with Stripe form
- [ ] Build refund modal
- [ ] Test full payment flow

### 7. Invoices Screen
- [ ] Build invoices table
- [ ] Build create/edit invoice modal
- [ ] Build line item editor
- [ ] Build invoice preview
- [ ] Build PDF generation
- [ ] Build send invoice functionality
- [ ] Test full invoice flow

### 8. Sidebar Navigation
- [ ] Add "Finance" section to sidebar
- [ ] Add "Payments" nav item
- [ ] Add "Invoices" nav item

### 9. Dashboard Integration
- [ ] Add revenue stats to dashboard
- [ ] Add recent transactions widget
- [ ] Add overdue invoices alert

### 10. Testing
- [ ] Test Stripe connection/disconnection
- [ ] Test payment processing (test mode)
- [ ] Test payment refunds
- [ ] Test invoice creation
- [ ] Test invoice sending with payment link
- [ ] Test invoice PDF generation
- [ ] Test webhook handling
- [ ] Test error scenarios

### 11. Deployment
- [ ] Add Stripe keys to Vercel
- [ ] Configure webhook URL in Stripe dashboard
- [ ] Run database migration in production
- [ ] Test production payments (test mode first)
- [ ] Switch to live mode when ready

---

## Definition of Done

✅ **Stripe Integration:**
- [ ] Stripe account can be connected via OAuth
- [ ] Connection status is displayed
- [ ] Account can be disconnected

✅ **Payments:**
- [ ] Users can charge clients via Stripe
- [ ] Payment processing works with credit cards
- [ ] Transaction history is displayed with stats
- [ ] Payments can be refunded (full or partial)
- [ ] Payment receipts can be viewed/printed
- [ ] All payment statuses are tracked correctly

✅ **Invoices:**
- [ ] Users can create invoices with line items
- [ ] Invoice numbers are auto-generated sequentially
- [ ] Invoices can be edited before sending
- [ ] Invoices can be sent to clients with payment link
- [ ] PDF invoices can be generated and downloaded
- [ ] Invoice status updates automatically when paid
- [ ] Overdue invoices are flagged

✅ **Integration:**
- [ ] Revenue stats appear on dashboard
- [ ] Payments are linked to contacts
- [ ] Invoices are linked to payments when paid
- [ ] Stripe webhooks update payment/invoice status
- [ ] All data persists correctly

---

## Next Steps (Phase 5)

After Phase 4 is complete, proceed to Phase 5 - Analytics & Insights:
- Reports screen (advanced analytics and visualizations)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
