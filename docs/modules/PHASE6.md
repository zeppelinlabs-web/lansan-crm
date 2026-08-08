# Phase 6 — Data Management & AI Tools

**Timeline:** 2–3 weeks  
**Depends on:** Phase 1 (Contacts) + AI API access  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Add bulk data import capabilities, a simple website/landing page builder, and AI-powered assistance. Users can import contacts from CSV files, build and publish landing pages, and get AI suggestions for emails, automations, and campaign ideas.

## Screens Included (3 of 18 total)

13. **Import Data** — 4-step CSV import wizard with validation
14. **Website Builder** — Drag-and-drop page builder with blocks
15. **AI Assistant** — Chat interface with suggested prompts

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **papaparse** | CSV parsing library | Latest |
| **grapesjs** or **craft.js** | Website builder framework | Latest |
| **OpenAI SDK** | AI chat integration | Latest |
| **react-dropzone** | File upload drag-and-drop | Latest |

---

## Database Schema Updates

### New ImportHistory Table
```prisma
model ImportHistory {
  id              String        @id @default(cuid())
  fileName        String
  fileSize        Int           // bytes
  
  // Status
  status          ImportStatus  @default(PROCESSING)
  
  // Results
  totalRows       Int           @default(0)
  successRows     Int           @default(0)
  failedRows      Int           @default(0)
  duplicateRows   Int           @default(0)
  
  // Column mapping (stored as JSON)
  columnMapping   Json          // { csvColumn: dbField }
  
  // Error details
  errors          Json?         // Array of error objects
  
  // User who imported
  importedById    String
  importedAt      DateTime      @default(now())
  completedAt     DateTime?
  
  // Relations
  importedBy      User          @relation("ImportCreator", fields: [importedById], references: [id])
}

enum ImportStatus {
  PROCESSING
  COMPLETED
  FAILED
  ROLLED_BACK
}
```

### New WebsitePage Table
```prisma
model WebsitePage {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique  // URL-friendly title
  
  // Page content (GrapesJS JSON)
  content         Json          @db.Json
  htmlContent     String        @db.Text  // Rendered HTML
  cssContent      String?       @db.Text  // Custom CSS
  
  // SEO
  metaTitle       String?
  metaDescription String?
  ogImage         String?       // Open Graph image URL
  
  // Status
  published       Boolean       @default(false)
  publishedAt     DateTime?
  
  // Template category
  template        PageTemplate  @default(BLANK)
  
  // Analytics
  views           Int           @default(0)
  
  createdById     String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  createdBy       User          @relation("PageCreator", fields: [createdById], references: [id])
  formSubmissions FormSubmission[]
}

enum PageTemplate {
  BLANK
  HERO
  SERVICES
  CONTACT
  LANDING_PAGE
  ABOUT
}
```

### New FormSubmission Table
```prisma
model FormSubmission {
  id          String    @id @default(cuid())
  pageId      String
  
  // Form data (flexible JSON)
  data        Json      // { name, email, message, etc. }
  
  // Tracking
  ipAddress   String?
  userAgent   String?
  
  // Contact creation
  contactId   String?   // Created contact from submission
  
  submittedAt DateTime  @default(now())
  
  // Relations
  page        WebsitePage @relation(fields: [pageId], references: [id])
  contact     Contact?    @relation(fields: [contactId], references: [id])
}
```

### New AIConversation Table
```prisma
model AIConversation {
  id          String    @id @default(cuid())
  userId      String
  
  // Conversation history (stored as JSON)
  messages    Json      // Array of {role: "user"|"assistant", content: string}
  
  // Context
  context     String?   // What the conversation is about
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  user        User      @relation("AIConversations", fields: [userId], references: [id])
}
```

### Update User Model
```prisma
model User {
  // ... existing fields ...
  
  // Relations
  imports          ImportHistory[]   @relation("ImportCreator")
  createdPages     WebsitePage[]     @relation("PageCreator")
  aiConversations  AIConversation[]  @relation("AIConversations")
}
```

### Update Contact Model
```prisma
model Contact {
  // ... existing fields ...
  
  // Relations
  formSubmissions  FormSubmission[]
}
```

---

## API Routes

### Import APIs

#### `POST /api/import/upload`
**Body:** FormData with file
**Response:**
```typescript
{
  uploadId: string,
  fileName: string,
  fileSize: number,
  preview: {
    headers: string[],
    rows: any[][]  // First 5 rows
  }
}
```

#### `POST /api/import/map`
**Body:**
```typescript
{
  uploadId: string,
  columnMapping: {
    [csvColumn: string]: string  // DB field name
  }
}
```
**Response:**
```typescript
{
  importId: string,
  totalRows: number,
  validation: {
    valid: number,
    invalid: number,
    duplicates: number,
    errors: Array<{row: number, message: string}>
  }
}
```

#### `POST /api/import/:id/execute`
**Effect:** Processes import, creates contacts
**Response:**
```typescript
{
  success: true,
  stats: {
    total: number,
    success: number,
    failed: number,
    duplicates: number
  }
}
```

#### `GET /api/import/history`
**Response:**
```typescript
{
  imports: ImportHistory[]
}
```

#### `POST /api/import/:id/rollback`
**Effect:** Deletes contacts created by this import

#### `GET /api/import/template`
**Response:** Downloads CSV template file

---

### Website Builder APIs

#### `GET /api/pages`
**Response:**
```typescript
{
  pages: WebsitePage[]
}
```

#### `GET /api/pages/:id`
**Response:** Single page with full content

#### `POST /api/pages`
**Body:**
```typescript
{
  title: string,
  slug?: string,  // Auto-generated if not provided
  template?: PageTemplate
}
```

#### `PATCH /api/pages/:id`
**Body:**
```typescript
{
  title?: string,
  content?: object,  // GrapesJS JSON
  cssContent?: string,
  metaTitle?: string,
  metaDescription?: string
}
```

#### `DELETE /api/pages/:id`

#### `POST /api/pages/:id/publish`
**Effect:** 
1. Render HTML from GrapesJS JSON
2. Set published = true
3. Set publishedAt timestamp

#### `POST /api/pages/:id/unpublish`

#### `GET /api/pages/:id/preview`
**Response:** HTML preview

---

### Public Page APIs

#### `GET /p/:slug`
**Public page** — No auth required
**Response:** Rendered HTML page

#### `POST /api/pages/:id/submit`
**Public form submission** — No auth required
**Body:**
```typescript
{
  name: string,
  email: string,
  [key: string]: any  // Other form fields
}
```
**Effect:**
1. Create/update contact from email
2. Store form submission
3. Send notification (optional)

---

### AI Assistant APIs

#### `GET /api/ai/conversations`
**Response:**
```typescript
{
  conversations: AIConversation[]
}
```

#### `GET /api/ai/conversations/:id`
**Response:** Single conversation with messages

#### `POST /api/ai/chat`
**Body:**
```typescript
{
  conversationId?: string,  // Create new if not provided
  message: string,
  context?: string  // "pipeline", "email", "automation", etc.
}
```
**Response:**
```typescript
{
  conversationId: string,
  reply: string
}
```

#### `GET /api/ai/suggestions`
**Query Parameters:**
- `type: "email" | "automation" | "campaign" | "subject"`

**Response:**
```typescript
{
  suggestions: string[]
}
```

---

## Component Structure

### Import Components

```typescript
components/
├── import/
│   ├── import-wizard.tsx              // 4-step wizard container
│   ├── import-step1-upload.tsx        // Drag-and-drop upload
│   ├── import-step2-mapping.tsx       // Column mapping
│   ├── import-step3-preview.tsx       // Preview and validate
│   ├── import-step4-complete.tsx      // Success screen
│   ├── import-history-table.tsx       // Past imports
│   ├── column-mapper.tsx              // Map CSV column to DB field
│   ├── import-validation-errors.tsx   // Show validation errors
│   └── import-progress.tsx            // Progress bar
```

### Website Builder Components

```typescript
components/
├── website/
│   ├── page-list.tsx                  // Grid of pages
│   ├── page-card.tsx                  // Single page card
│   ├── page-editor.tsx                // GrapesJS editor wrapper
│   ├── page-settings-panel.tsx        // SEO and settings
│   ├── page-preview.tsx               // Live preview
│   ├── block-picker.tsx               // Block library sidebar
│   ├── publish-modal.tsx              // Publish confirmation
│   └── form-submissions-table.tsx     // View form submissions
```

### AI Assistant Components

```typescript
components/
├── ai/
│   ├── ai-chat.tsx                    // Chat interface
│   ├── ai-message.tsx                 // Single message bubble
│   ├── ai-suggested-prompts.tsx       // Prompt chips
│   ├── ai-input.tsx                   // Chat input
│   └── ai-typing-indicator.tsx        // Loading indicator
```

---

## Page Structure

### `/app/(dashboard)/import/page.tsx`
**Import Data Screen**

```typescript
- 4-step wizard:
  Step 1: Upload
    - Drag-and-drop zone
    - File browser fallback
    - File format info (CSV, max 10MB, etc.)
    - Download template button
  
  Step 2: Map Columns
    - Preview table (first 5 rows)
    - Dropdowns to map CSV columns to DB fields
    - Auto-detection suggestions
  
  Step 3: Preview
    - Validation results
    - First 5 mapped rows preview
    - Error list (if any)
    - Total record count
  
  Step 4: Complete
    - Success message
    - Import stats (total, success, failed, duplicates)
    - "Import Another File" button
    - "View Contacts" button

- Below wizard:
  - Import history table
```

### `/app/(dashboard)/website/page.tsx`
**Website Builder Screen**

```typescript
- Page list grid (published and draft pages)
- Click page → Opens editor
- "New Page" button in topbar
```

### `/app/(dashboard)/website/[id]/edit/page.tsx`
**Page Editor**

```typescript
- Left panel: Block picker (Hero, Text, CTA, Services, Contact form)
- Center: GrapesJS canvas
- Right panel: Settings (SEO, styles, publish)
- Topbar: Save, Preview, Publish buttons
```

### `/app/(dashboard)/ai/page.tsx`
**AI Assistant Screen**

```typescript
- Suggested prompt chips at top:
  - "Summarize my pipeline"
  - "Draft a follow-up email"
  - "Generate campaign subject lines"
  - "Suggest automation ideas"
  - "Write an invoice reminder"

- Chat message thread (scrollable)
  - Bot messages (left, purple avatar)
  - User messages (right, green avatar)

- Chat input at bottom with send button
```

### `/app/p/[slug]/page.tsx`
**Public Published Page** (No auth, no sidebar)

```typescript
- Rendered HTML from page content
- Form submission handling
- View tracking
```

---

## Implementation Checklist

### 1. Database Setup
- [ ] Create ImportHistory model
- [ ] Create WebsitePage model
- [ ] Create FormSubmission model
- [ ] Create AIConversation model
- [ ] Run migration
- [ ] Update seed script

### 2. Import System
- [ ] Install CSV parsing library (papaparse)
- [ ] Implement file upload API
- [ ] Create column auto-detection logic
- [ ] Implement validation logic
- [ ] Create import processor
- [ ] Build 4-step wizard UI
- [ ] Build import history view
- [ ] Test with various CSV formats

### 3. Website Builder
- [ ] Choose and install builder framework (GrapesJS)
- [ ] Set up builder configuration
- [ ] Create pre-built block templates
- [ ] Implement page CRUD APIs
- [ ] Create page editor UI
- [ ] Implement publish/unpublish functionality
- [ ] Create public page renderer
- [ ] Implement form submission handling
- [ ] Test page building and publishing

### 4. AI Assistant
- [ ] Set up OpenAI API account
- [ ] Install OpenAI SDK
- [ ] Create AI service utility
- [ ] Implement chat API
- [ ] Create suggested prompts
- [ ] Build chat UI
- [ ] Add context awareness (pipeline, contacts, etc.)
- [ ] Test AI responses

### 5. Sidebar Navigation
- [ ] Add "Tools" section to sidebar
- [ ] Add "Import Data" nav item
- [ ] Add "Website Builder" nav item
- [ ] Add "AI Assistant" nav item

### 6. Testing
- [ ] Test CSV import with valid data
- [ ] Test CSV import with invalid data
- [ ] Test CSV import with duplicates
- [ ] Test import rollback
- [ ] Test website page creation
- [ ] Test page publishing
- [ ] Test public page access
- [ ] Test form submissions
- [ ] Test AI chat responses
- [ ] Test error handling

### 7. Optimization
- [ ] Implement chunked CSV processing for large files
- [ ] Add progress updates during import
- [ ] Cache AI responses for common queries
- [ ] Optimize page rendering

---

## Definition of Done

✅ **Import Data:**
- [ ] Users can upload CSV files via drag-and-drop
- [ ] Column mapping works with auto-detection
- [ ] Validation catches errors before import
- [ ] Import successfully creates contacts
- [ ] Duplicate detection works correctly
- [ ] Import history is tracked
- [ ] Imports can be rolled back
- [ ] CSV template can be downloaded

✅ **Website Builder:**
- [ ] Users can create new pages from templates
- [ ] Drag-and-drop editor works smoothly
- [ ] Pre-built blocks are available (Hero, CTA, Services, Contact Form)
- [ ] Pages can be saved as drafts
- [ ] Pages can be published
- [ ] Public URLs work without authentication
- [ ] Form submissions are captured
- [ ] Form submissions create contacts
- [ ] SEO settings can be configured

✅ **AI Assistant:**
- [ ] Chat interface works with message history
- [ ] Suggested prompts are helpful and relevant
- [ ] AI provides useful responses for:
  - Pipeline summaries
  - Email drafts
  - Campaign subject lines
  - Automation suggestions
- [ ] Context awareness works (knows about user's data)
- [ ] Conversation history is saved
- [ ] Error handling for API failures

✅ **Integration:**
- [ ] Imported contacts appear in Contacts screen
- [ ] Form submissions from pages create contacts
- [ ] AI can access real CRM data for context
- [ ] All data persists correctly

---

## Next Steps (Phase 7)

After Phase 6 is complete, proceed to Phase 7 - Administration:
- Users & Licenses screen (team management)
- Integrations screen (third-party connectors)
- Settings screen (company and AI configuration)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
