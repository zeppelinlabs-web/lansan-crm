# Phase 5 — Analytics & Insights

**Timeline:** 2 weeks  
**Depends on:** Phase 1 (all data models), Phase 3 (campaigns), Phase 4 (payments)  
**Part of:** [8-Phase Development Plan](./DEVELOPMENT-PHASES.md)

## Objective

Provide comprehensive analytics and reporting dashboards. Users can analyze pipeline performance, revenue trends, campaign effectiveness, contact growth, and other key metrics with interactive visualizations and date range filtering.

## Screens Included (1 of 18 total)

12. **Reports** — Multi-chart analytics dashboard with key performance indicators

See [UI Screens Inventory](../screens/ui-screens-inventory.md) for complete screen list.

---

## Tech Stack Additions

| Technology | Purpose | Version |
|---|---|---|
| **Chart.js** | Chart visualization library (already in design system) | Latest |
| **react-chartjs-2** | React wrapper for Chart.js | Latest |
| **date-fns** | Date manipulation for filtering | Latest |
| **recharts** (alternative) | Alternative charting library if preferred | Latest |

---

## Database Additions

No new tables needed. This phase uses existing data from:
- Contacts
- Deals
- Payments/Invoices
- Campaigns
- Tasks
- Appointments

### New Analytics Views (Optional Optimization)

For performance, consider creating database views for common aggregations:

```sql
-- Deal pipeline summary by stage
CREATE VIEW deal_pipeline_summary AS
SELECT 
  stage,
  COUNT(*) as count,
  SUM(amount) as total_value
FROM Deal
GROUP BY stage;

-- Revenue by month
CREATE VIEW revenue_by_month AS
SELECT 
  DATE_TRUNC('month', createdAt) as month,
  SUM(amount) as total
FROM Payment
WHERE status = 'SUCCEEDED'
GROUP BY month
ORDER BY month;

-- Campaign performance summary
CREATE VIEW campaign_performance AS
SELECT
  id,
  name,
  sent,
  opened,
  clicked,
  CASE WHEN sent > 0 THEN (opened::float / sent * 100) ELSE 0 END as open_rate,
  CASE WHEN opened > 0 THEN (clicked::float / opened * 100) ELSE 0 END as ctr
FROM Campaign
WHERE status = 'SENT';

-- Contact growth over time
CREATE VIEW contact_growth AS
SELECT
  DATE_TRUNC('month', createdAt) as month,
  COUNT(*) as new_contacts
FROM Contact
GROUP BY month
ORDER BY month;
```

---

## API Routes

### Reports APIs

#### `GET /api/reports/overview`
**Query Parameters:**
- `startDate?: string` — ISO date
- `endDate?: string` — ISO date

**Response:**
```typescript
{
  stats: {
    dealsWon: number,
    winRate: number,  // percentage
    avgDealSize: number,
    emailOpenRate: number  // percentage
  }
}
```

#### `GET /api/reports/pipeline`
**Query Parameters:**
- `startDate?: string`
- `endDate?: string`

**Response:**
```typescript
{
  byStage: Array<{
    stage: string,
    count: number,
    value: number
  }>,
  chartData: {
    labels: string[],  // Stage names
    datasets: [{
      label: "Deal Count",
      data: number[]
    }, {
      label: "Deal Value",
      data: number[]
    }]
  }
}
```

#### `GET /api/reports/revenue`
**Query Parameters:**
- `startDate?: string`
- `endDate?: string`
- `groupBy?: "day" | "week" | "month" | "quarter"`

**Response:**
```typescript
{
  total: number,
  data: Array<{
    period: string,  // Date string
    amount: number
  }>,
  chartData: {
    labels: string[],
    datasets: [{
      label: "Revenue",
      data: number[]
    }]
  }
}
```

#### `GET /api/reports/campaigns`
**Query Parameters:**
- `startDate?: string`
- `endDate?: string`

**Response:**
```typescript
{
  summary: {
    totalCampaigns: number,
    totalSent: number,
    avgOpenRate: number,
    avgCtr: number
  },
  campaigns: Array<{
    name: string,
    sent: number,
    opened: number,
    clicked: number,
    openRate: number,
    ctr: number
  }>,
  chartData: {
    labels: string[],  // Campaign names
    datasets: [{
      label: "Open Rate %",
      data: number[]
    }, {
      label: "CTR %",
      data: number[]
    }]
  }
}
```

#### `GET /api/reports/contacts`
**Query Parameters:**
- `startDate?: string`
- `endDate?: string`
- `groupBy?: "day" | "week" | "month"`

**Response:**
```typescript
{
  total: number,
  growth: Array<{
    period: string,
    newContacts: number,
    cumulative: number
  }>,
  bySource: Array<{
    source: string,
    count: number
  }>,
  byStatus: Array<{
    status: string,
    count: number
  }>,
  chartData: {
    labels: string[],
    datasets: [{
      label: "New Contacts",
      data: number[]
    }]
  }
}
```

#### `GET /api/reports/team`
**Query Parameters:**
- `startDate?: string`
- `endDate?: string`

**Response:**
```typescript
{
  byUser: Array<{
    userId: string,
    userName: string,
    contactsCreated: number,
    dealsCreated: number,
    dealsWon: number,
    tasksCompleted: number,
    appointmentsHeld: number
  }>
}
```

#### `POST /api/reports/export`
**Body:**
```typescript
{
  reportType: "pipeline" | "revenue" | "campaigns" | "contacts",
  format: "csv" | "pdf",
  startDate?: string,
  endDate?: string
}
```
**Response:** File download

---

## Component Structure

### Reports Components

```typescript
components/
├── reports/
│   ├── report-stats-row.tsx           // KPI stat cards
│   ├── date-range-picker.tsx          // Date filter
│   ├── pipeline-chart.tsx             // Pipeline by stage
│   ├── revenue-chart.tsx              // Revenue over time
│   ├── campaign-chart.tsx             // Campaign performance
│   ├── contact-growth-chart.tsx       // Contact growth
│   ├── team-performance-table.tsx     // Team member stats
│   ├── export-button.tsx              // Export reports
│   └── chart-wrapper.tsx              // Reusable chart container
```

---

## Page Structure

### `/app/(dashboard)/reports/page.tsx`
**Reports Screen**

```typescript
- Date range picker (in topbar or page header)
- Stats cards row:
  - Deals won (count + value)
  - Win rate (percentage)
  - Avg deal size
  - Email open rate
  
- Two-column grid:
  Left column:
    - Pipeline by stage chart (bar/column chart)
    - Campaign performance chart (grouped bar chart)
  
  Right column:
    - Revenue by month chart (line chart)
    - Contact growth chart (area chart)

- Team performance table (below charts):
  - User name, contacts created, deals won, tasks completed, etc.

- Export button (CSV/PDF)
```

---

## Zod Validation Schemas

### Report Validation
```typescript
// lib/validations/report.ts
import { z } from "zod";

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "Start date must be before end date"
});

export const groupBySchema = z.enum(["day", "week", "month", "quarter"]);

export const exportReportSchema = z.object({
  reportType: z.enum(["pipeline", "revenue", "campaigns", "contacts"]),
  format: z.enum(["csv", "pdf"]),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
```

---

## TanStack Query Hooks

### Report Hooks
```typescript
// hooks/use-reports.ts
export function useReportOverview(dateRange?: DateRange) {
  // GET /api/reports/overview
}

export function usePipelineReport(dateRange?: DateRange) {
  // GET /api/reports/pipeline
}

export function useRevenueReport(dateRange?: DateRange, groupBy?: string) {
  // GET /api/reports/revenue
}

export function useCampaignReport(dateRange?: DateRange) {
  // GET /api/reports/campaigns
}

export function useContactReport(dateRange?: DateRange, groupBy?: string) {
  // GET /api/reports/contacts
}

export function useTeamReport(dateRange?: DateRange) {
  // GET /api/reports/team
}

export function useExportReport() {
  // POST /api/reports/export
}
```

---

## Chart Configurations

### Pipeline Chart (Bar Chart)
```typescript
{
  type: 'bar',
  data: {
    labels: ['Lead', 'Qualified', 'Proposal', 'Won'],
    datasets: [
      {
        label: 'Number of Deals',
        data: [15, 12, 8, 5],
        backgroundColor: '#1D9E75'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
}
```

### Revenue Chart (Line Chart)
```typescript
{
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#1D9E75',
        backgroundColor: 'rgba(29, 158, 117, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value.toLocaleString()
        }
      }
    }
  }
}
```

### Campaign Performance Chart (Grouped Bar)
```typescript
{
  type: 'bar',
  data: {
    labels: ['Campaign 1', 'Campaign 2', 'Campaign 3'],
    datasets: [
      {
        label: 'Open Rate %',
        data: [45, 38, 52],
        backgroundColor: '#1D9E75'
      },
      {
        label: 'CTR %',
        data: [12, 15, 18],
        backgroundColor: '#0F6E56'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: { 
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%'
        }
      }
    }
  }
}
```

### Contact Growth Chart (Area Chart)
```typescript
{
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Contacts',
        data: [25, 35, 42, 38, 45, 55],
        borderColor: '#1D9E75',
        backgroundColor: 'rgba(29, 158, 117, 0.2)',
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
}
```

---

## Implementation Checklist

### 1. API Layer
- [ ] Implement `/api/reports/overview` route
- [ ] Implement `/api/reports/pipeline` route
- [ ] Implement `/api/reports/revenue` route
- [ ] Implement `/api/reports/campaigns` route
- [ ] Implement `/api/reports/contacts` route
- [ ] Implement `/api/reports/team` route
- [ ] Implement `/api/reports/export` route
- [ ] Optimize queries with indexes
- [ ] Consider caching for expensive queries

### 2. Chart Setup
- [ ] Install Chart.js and react-chartjs-2
- [ ] Create reusable chart wrapper component
- [ ] Configure chart defaults (colors, fonts from design system)
- [ ] Create chart utility functions

### 3. Reports Screen
- [ ] Build date range picker component
- [ ] Build KPI stats cards
- [ ] Build pipeline chart component
- [ ] Build revenue chart component
- [ ] Build campaign performance chart
- [ ] Build contact growth chart
- [ ] Build team performance table
- [ ] Build export functionality

### 4. Data Calculations
- [ ] Implement win rate calculator
- [ ] Implement average deal size calculator
- [ ] Implement open rate calculator
- [ ] Implement growth rate calculator
- [ ] Implement date grouping logic

### 5. Sidebar Navigation
- [ ] Add "Insights" section to sidebar
- [ ] Add "Reports" nav item

### 6. Dashboard Integration
- [ ] Consider adding mini-reports to dashboard
- [ ] Add quick links to full reports

### 7. Testing
- [ ] Test all date range filters
- [ ] Test chart rendering with various data sets
- [ ] Test empty state (no data)
- [ ] Test export functionality (CSV and PDF)
- [ ] Test performance with large datasets
- [ ] Test responsive layout

### 8. Optimization
- [ ] Add loading skeletons for charts
- [ ] Implement query caching
- [ ] Add database indexes for report queries
- [ ] Consider pagination for large data sets

---

## Definition of Done

✅ **Overview Stats:**
- [ ] KPI cards show accurate metrics
- [ ] Stats update based on date range filter
- [ ] Loading states are shown during calculation

✅ **Charts:**
- [ ] Pipeline chart shows deals by stage
- [ ] Revenue chart shows income over time
- [ ] Campaign chart shows performance metrics
- [ ] Contact growth chart shows new contacts over time
- [ ] All charts are interactive and responsive
- [ ] Charts handle empty data gracefully
- [ ] Charts follow design system colors

✅ **Date Filtering:**
- [ ] Date range picker works correctly
- [ ] All reports respect date filters
- [ ] Common presets work (Last 7 days, Last 30 days, This month, etc.)

✅ **Team Performance:**
- [ ] Table shows metrics per user
- [ ] Data is accurate
- [ ] Can be sorted by different columns

✅ **Export:**
- [ ] Reports can be exported as CSV
- [ ] Reports can be exported as PDF
- [ ] Exported files include date range in filename
- [ ] Exports include all relevant data

✅ **Performance:**
- [ ] Page loads in under 2 seconds
- [ ] Charts render smoothly
- [ ] Large datasets don't crash the page
- [ ] Queries are optimized

---

## Next Steps (Phase 6)

After Phase 5 is complete, proceed to Phase 6 - Data & AI Tools:
- Import Data screen (CSV import wizard)
- Website Builder screen (page builder)
- AI Assistant screen (chat interface)

See [DEVELOPMENT-PHASES.md](./DEVELOPMENT-PHASES.md) for the complete roadmap.

---

**Status:** 📋 Planning Complete - Ready for Implementation
