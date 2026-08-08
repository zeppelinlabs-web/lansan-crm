# Phase 2 — Growth Tools

**Timeline:** 2–3 weeks  
**Depends on:** Phase 1 (Contacts, Tasks, Dashboard)  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Add lead management and appointment scheduling capabilities. Users can track lead sources, score leads (Hot/Warm/Cold), and manage appointments with calendar integration and public booking functionality.

## Screens Included (2 of 18 total)

5. **Lead Generation** — Lead board with scoring, source filters, conversion tracking
6. **Appointments** — Calendar view, booking link, appointment management

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **date-fns** or **day.js** | Date manipulation and formatting | Latest |
| **react-big-calendar** | Calendar component for appointments view | Latest |
| **@dnd-kit/core** | Drag-and-drop for lead board | Latest |
| **qrcode.react** | QR code generation for booking links | Latest |

---

## Database Schema Updates

### Update Contacts Table
```prisma
model Contact {
  id          String        @id @default(cuid())
  name        String
  company     String?
  email       String?
  phone       String?
  status      ContactStatus @default(LEAD)
  
  // NEW: Lead tracking fields
  leadScore   LeadScore?    @default(COLD)
  leadSource  LeadSource?
  convertedAt DateTime?     // When lead became active contact
  
  createdById String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  createdBy   User          @relation("CreatedBy", fields: [createdById], references: [id])
  deals       Deal[]
  tasks       Task[]        @relation("ContactTasks")
  appointments Appointment[] // NEW
}

enum LeadScore {
  HOT
  WARM
  COLD
}

enum LeadSource {
  WEBSITE
  REFERRAL
  LINKEDIN
  COLD_OUTREACH
  IMPORT
  AD_CAMPAIGN
}
```

### New Appointments Table
```prisma
model Appointment {
  id          String            @id @default(cuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  status      AppointmentStatus @default(PENDING)
  location    String?           // Physical or virtual (Zoom link, etc.)
  
  contactId   String?
  assignedToId String           // User who owns the appointment
  
  // Booking-related fields
  bookedVia   BookingMethod     @default(MANUAL)
  bookingToken String?          @unique // For public booking links
  reminderSent Boolean          @default(false)
  
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations
  contact     Contact?  @relation(fields: [contactId], references: [id])
  assignedTo  User      @relation("AppointmentOwner", fields: [assignedToId], references: [id])
}

enum AppointmentStatus {
  CONFIRMED
  PENDING
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum BookingMethod {
  MANUAL       // Created by user in CRM
  PUBLIC_LINK  // Booked via public booking page
  CALENDAR_SYNC // Synced from external calendar (future)
}
```

### Update User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String?
  role          UserRole  @default(AGENT)
  status        UserStatus @default(ACTIVE)
  
  // NEW: Booking settings
  bookingEnabled Boolean   @default(true)
  bookingSlug    String?   @unique  // e.g., "john-smith" for booking URL
  bookingBuffer  Int       @default(15) // Minutes between appointments
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  createdContacts Contact[] @relation("CreatedBy")
  createdDeals    Deal[]    @relation("CreatedBy")
  assignedTasks   Task[]    @relation("AssignedTo")
  appointments    Appointment[] @relation("AppointmentOwner") // NEW
}
```

---

## API Routes

### Lead Generation APIs

#### `GET /api/leads`
**Query Parameters:**
- `source?: string` — Filter by lead source
- `score?: string` — Filter by lead score (hot/warm/cold)
- `convertedOnly?: boolean` — Show only converted leads

**Response:**
```typescript
{
  leads: Contact[],
  stats: {
    total: number,
    hot: number,
    warm: number,
    cold: number,
    converted: number,
    avgResponseTime: number // in hours
  },
  bySource: {
    [key: string]: number
  }
}
```

#### `PATCH /api/contacts/:id/score`
**Body:**
```typescript
{
  leadScore: "HOT" | "WARM" | "COLD"
}
```

#### `PATCH /api/contacts/:id/convert`
**Body:**
```typescript
{
  status: "ACTIVE"
}
```
**Effect:** Sets `convertedAt` timestamp, changes status

---

### Appointments APIs

#### `GET /api/appointments`
**Query Parameters:**
- `month?: string` — Filter by month (YYYY-MM)
- `userId?: string` — Filter by assigned user
- `status?: string` — Filter by status

**Response:**
```typescript
{
  appointments: Appointment[],
  stats: {
    today: number,
    upcoming: number,
    thisMonth: number
  }
}
```

#### `POST /api/appointments`
**Body:**
```typescript
{
  title: string,
  description?: string,
  startTime: string, // ISO date
  endTime: string,
  contactId?: string,
  assignedToId: string,
  location?: string,
  status?: "CONFIRMED" | "PENDING"
}
```

#### `GET /api/appointments/:id`
**Response:** Single appointment with contact and user details

#### `PATCH /api/appointments/:id`
**Body:** Partial appointment update

#### `DELETE /api/appointments/:id`

#### `PATCH /api/appointments/:id/status`
**Body:**
```typescript
{
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
}
```

---

### Public Booking APIs

#### `GET /api/booking/:slug`
**Public endpoint** — No auth required

**Response:**
```typescript
{
  user: {
    name: string,
    bookingSettings: {
      buffer: number,
      availableSlots: string[] // Next 30 days of available times
    }
  }
}
```

#### `POST /api/booking/:slug`
**Public endpoint** — No auth required

**Body:**
```typescript
{
  name: string,
  email: string,
  phone?: string,
  startTime: string,
  endTime: string,
  message?: string
}
```

**Effect:** 
1. Creates/finds contact by email
2. Creates appointment with status PENDING
3. Sends confirmation email (if email service configured)
4. Returns booking confirmation

---

## Component Structure

### Lead Generation Components

```typescript
components/
├── leads/
│   ├── lead-board.tsx           // Main board container
│   ├── lead-column.tsx          // Single score column (Hot/Warm/Cold)
│   ├── lead-card.tsx            // Lead card with score badge
│   ├── lead-source-filters.tsx  // Source filter chips
│   ├── lead-stats-row.tsx       // Stats cards
│   └── convert-lead-modal.tsx   // Convert to active contact
```

### Appointments Components

```typescript
components/
├── appointments/
│   ├── calendar-view.tsx              // Month calendar grid
│   ├── calendar-day-cell.tsx          // Single day with appointment dots
│   ├── appointment-list.tsx           // List view (today/upcoming)
│   ├── appointment-card.tsx           // Single appointment card
│   ├── appointment-modal.tsx          // Create/edit appointment
│   ├── booking-link-card.tsx          // Display + copy booking URL
│   └── appointment-status-selector.tsx // Status dropdown
```

### Public Booking Components

```typescript
components/
├── booking/
│   ├── public-booking-page.tsx    // Public-facing booking page
│   ├── time-slot-picker.tsx       // Available time slots
│   ├── booking-form.tsx           // Contact info + message
│   └── booking-confirmation.tsx   // Success screen
```

---

## Page Structure

### `/app/(dashboard)/leads/page.tsx`
**Lead Generation Screen**

```typescript
- Lead stats cards (total, hot, warm, cold, converted, avg response time)
- Source filter chips (All, Website, Referral, LinkedIn, etc.)
- Lead board with 3 columns:
  - Hot leads (red accent)
  - Warm leads (amber accent)
  - Cold leads (blue accent)
- Each card shows: name, company, source badge, days since created
- Drag to move between scores
- Click to view details
- Convert button to make active contact
```

### `/app/(dashboard)/appointments/page.tsx`
**Appointments Screen**

```typescript
- Calendar month view with appointment dots (colored by status)
- Right sidebar:
  - Booking link card (copy URL, QR code, settings)
  - Today's appointments list
  - Upcoming appointments list
- Click day → show appointments for that day
- Click appointment → edit modal
- "Schedule Appointment" button in topbar
```

### `/app/booking/[slug]/page.tsx`
**Public Booking Page** (No auth required, no sidebar/topbar)

```typescript
- User info (name, title, photo)
- Calendar with available dates
- Time slot picker
- Contact form (name, email, phone, message)
- "Book Appointment" button
- Powered by Lansan CRM footer
```

---

## Zod Validation Schemas

### Lead Validation
```typescript
// lib/validations/lead.ts
import { z } from "zod";

export const leadScoreSchema = z.enum(["HOT", "WARM", "COLD"]);
export const leadSourceSchema = z.enum([
  "WEBSITE",
  "REFERRAL", 
  "LINKEDIN",
  "COLD_OUTREACH",
  "IMPORT",
  "AD_CAMPAIGN"
]);

export const updateLeadScoreSchema = z.object({
  leadScore: leadScoreSchema
});

export const convertLeadSchema = z.object({
  status: z.literal("ACTIVE")
});
```

### Appointment Validation
```typescript
// lib/validations/appointment.ts
import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "CONFIRMED",
  "PENDING",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW"
]);

export const createAppointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  contactId: z.string().cuid().optional(),
  assignedToId: z.string().cuid(),
  location: z.string().optional(),
  status: appointmentStatusSchema.optional()
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time"
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const publicBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  message: z.string().optional()
});
```

---

## TanStack Query Hooks

### Lead Hooks
```typescript
// hooks/use-leads.ts
export function useLeads(filters?: LeadFilters) {
  // GET /api/leads with filters
}

export function useUpdateLeadScore() {
  // PATCH /api/contacts/:id/score with optimistic update
}

export function useConvertLead() {
  // PATCH /api/contacts/:id/convert
}
```

### Appointment Hooks
```typescript
// hooks/use-appointments.ts
export function useAppointments(filters?: AppointmentFilters) {
  // GET /api/appointments
}

export function useAppointment(id: string) {
  // GET /api/appointments/:id
}

export function useCreateAppointment() {
  // POST /api/appointments
}

export function useUpdateAppointment() {
  // PATCH /api/appointments/:id
}

export function useDeleteAppointment() {
  // DELETE /api/appointments/:id
}

export function useUpdateAppointmentStatus() {
  // PATCH /api/appointments/:id/status
}
```

### Public Booking Hooks
```typescript
// hooks/use-booking.ts
export function useBookingAvailability(slug: string) {
  // GET /api/booking/:slug (no auth)
}

export function useCreateBooking() {
  // POST /api/booking/:slug (no auth)
}
```

---

## Implementation Checklist

### 1. Database Setup
- [ ] Add `leadScore` and `leadSource` to Contacts model
- [ ] Create Appointments model
- [ ] Add booking fields to User model
- [ ] Run migration
- [ ] Update seed script with sample leads and appointments

### 2. API Layer
- [ ] Implement `/api/leads` route with filters
- [ ] Implement `/api/contacts/:id/score` route
- [ ] Implement `/api/contacts/:id/convert` route
- [ ] Implement `/api/appointments` CRUD routes
- [ ] Implement `/api/booking/:slug` public routes
- [ ] Add appointment availability logic
- [ ] Add booking conflict detection

### 3. Lead Generation Screen
- [ ] Create lead board component with drag-and-drop
- [ ] Create lead card component with score badges
- [ ] Create source filter chips
- [ ] Create lead stats cards
- [ ] Implement convert lead modal
- [ ] Add lead detail view

### 4. Appointments Screen
- [ ] Create calendar view component
- [ ] Create appointment list components (today/upcoming)
- [ ] Create appointment modal (schedule/edit)
- [ ] Create booking link card with copy functionality
- [ ] Add QR code generation for booking link
- [ ] Implement appointment status updates
- [ ] Add appointment filters

### 5. Public Booking Page
- [ ] Create public booking layout (no auth)
- [ ] Create time slot picker with availability
- [ ] Create booking form
- [ ] Create booking confirmation page
- [ ] Add conflict detection on booking
- [ ] Style for mobile responsiveness

### 6. Sidebar Navigation
- [ ] Add "Growth" section to sidebar
- [ ] Add "Lead Generation" nav item with badge count
- [ ] Add "Appointments" nav item with badge count

### 7. Testing
- [ ] Test lead score updates
- [ ] Test lead conversion flow
- [ ] Test appointment scheduling
- [ ] Test appointment status changes
- [ ] Test public booking flow (no auth)
- [ ] Test booking conflicts
- [ ] Test calendar navigation
- [ ] Test mobile responsiveness

### 8. Deployment
- [ ] Run database migration in production
- [ ] Test production booking links
- [ ] Verify email notifications (if configured)

---

## Definition of Done

✅ **Lead Generation:**
- [ ] Users can view leads organized by score (Hot/Warm/Cold)
- [ ] Users can filter leads by source
- [ ] Users can drag leads between score columns
- [ ] Users can convert leads to active contacts
- [ ] Lead stats show accurate aggregate data
- [ ] Lead response time is calculated correctly

✅ **Appointments:**
- [ ] Users can view calendar with appointments
- [ ] Users can schedule new appointments
- [ ] Users can edit/delete appointments
- [ ] Users can change appointment status
- [ ] Today's and upcoming appointments are displayed
- [ ] Appointment conflicts are prevented

✅ **Public Booking:**
- [ ] Each user has a unique booking URL
- [ ] Public booking page works without authentication
- [ ] Available time slots are calculated correctly
- [ ] Booking conflicts are detected
- [ ] New bookings create contacts and appointments
- [ ] Confirmation is shown after successful booking
- [ ] QR code can be generated for booking link

✅ **Integration:**
- [ ] Appointments appear on dashboard
- [ ] Appointments can be linked to contacts
- [ ] Lead stats appear on dashboard
- [ ] All data persists correctly

---

## Next Steps (Phase 3)

After Phase 2 is complete, proceed to Phase 3 - Marketing Automation:
- Automations screen (trigger-action rules)
- Email Templates screen (template library)
- Campaigns screen (email campaigns with tracking)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
