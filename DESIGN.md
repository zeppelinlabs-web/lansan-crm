# Design System — Lansan CRM

**Source of truth:** `docs/screens/lansan_crm_v4.html` (inline `<style>` block). Every value below is extracted directly from that file — do not approximate or restyle during rebuild; port these tokens into Tailwind config / CSS variables as-is so the Next.js rebuild is visually identical to the approved prototype.

---

## Foundations

### Font
```
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
No custom web font is loaded for body text — system font stack only. Icon font is **Tabler Icons** (`@tabler/icons-webfont@2.47.0`, loaded via CDN — should be self-hosted or replaced with `@tabler/icons-react` in the rebuild).

Chart library: **Chart.js 4.4.1**.

### Base colors
| Token | Hex | Used for |
|---|---|---|
| `--bg-body` | `#f4f5f7` | App background |
| `--bg-surface` | `#ffffff` | Cards, sidebar, tables, modals |
| `--text-primary` | `#1a1a1a` | Body text (root) |
| `--text-heading` | `#111111` | Headings, names, primary values |
| `--text-body` | `#222222` | Table cell text |
| `--text-secondary` | `#555555` | Nav items, labels |
| `--text-muted` | `#888888` | Sub-labels, meta text |
| `--text-faint` | `#aaaaaa` | Placeholder-level text, disabled |

### Border colors
| Token | Hex | Used for |
|---|---|---|
| `--border-default` | `#e8e8e8` | Card/sidebar/table borders |
| `--border-medium` | `#e0e0e0` | Input, button borders |
| `--border-input` | `#d0d0d0` | Form inputs |
| `--border-light` | `#f0f0f0` | Table header borders |
| `--border-faint` | `#f5f5f5` | Table row dividers |

### Brand color (green)
| Token | Hex | Used for |
|---|---|---|
| `--brand-primary` | `#1D9E75` | Primary buttons, active states, links, chart line |
| `--brand-primary-dark` | `#0F6E56` | Primary button hover, active nav text, borders |
| `--brand-primary-bg` | `#e8f8f2` | Active nav background, light accents, avatar bg |
| `--brand-primary-bg-hover` | `#f0fdf9` | Hover backgrounds |

### Status/pill colors
| Pill | Background | Text |
|---|---|---|
| Green (`pill-green`) | `#e8f8f2` | `#0F6E56` |
| Amber (`pill-amber`) | `#fef3c7` | `#92400e` |
| Blue (`pill-blue`) | `#dbeafe` | `#1e40af` |
| Red (`pill-red`) | `#fee2e2` | `#991b1b` |
| Gray (`pill-gray`) | `#f3f4f6` | `#6b7280` |
| Purple (`pill-purple`) | `#ede9fe` | `#5b21b6` |

**Status → pill mapping** (from `pill()` JS function — replicate exactly):
```
Active, Paid, Won, Succeeded     → green
Lead, Sent, Admin                → blue
Inactive, Draft, Low, Closed, Agent → gray
Overdue, Failed, High            → red
Pending, Medium, In progress     → amber
Manager                          → green
```

### Lead score colors
| Score | Background | Text |
|---|---|---|
| Hot (`score-hot`) | `#fee2e2` | `#991b1b` |
| Warm (`score-warm`) | `#fef3c7` | `#92400e` |
| Cold (`score-cold`) | `#dbeafe` | `#1e40af` |

### Special banners
| Banner | Background | Border | Text |
|---|---|---|---|
| Stripe banner | `#eff6ff` | `#bfdbfe` | title `#1e40af`, body `#3b82f6` |
| License banner | `#f0fdf9` | `#6ee7b7` | title `#064e3b`, body `#059669` |
| Zapier banner | `linear-gradient(135deg,#ff4a00,#ff8c00)` | — | `#ffffff` |
| API code box | `#1e293b` | — | text `#e2e8f0`, comments `#94a3b8`, highlight `#86efac` |
| Danger/destructive | transparent → hover `#fef2f2` | — | `#c0392b` |

### Appointment status dots
| Status | Background | Text |
|---|---|---|
| Confirmed | `#e8f8f2` | `#0F6E56` |
| Pending | `#fef3c7` | `#92400e` |
| Cancelled | `#fee2e2` | `#991b1b` |

---

## Layout

- **App shell:** flex row, `height: 100vh`, no page scroll — sidebar + main split
- **Sidebar:** fixed `width: 210px`, white background, right border `1px solid #e8e8e8`, scrollable if content overflows
- **Main column:** flex column — topbar (fixed) + scrollable content area
- **Topbar:** `padding: 11px 18px`, bottom border, contains page title, search input (`width: 240px`), primary action button
- **Content area:** `padding: 18px`, scrollable independently of sidebar

### Grid patterns used across screens
| Pattern | Class | Layout |
|---|---|---|
| Stat cards row | `.stats-row` | `grid-template-columns: repeat(4, 1fr)`, gap `12px` |
| Two-column card layout | `.two-col` | `grid-template-columns: 1fr 1fr`, gap `16px` |
| Pipeline board | `.pipeline-cols` | `grid-template-columns: repeat(4, 1fr)`, gap `12px` |
| Lead gen board | `.lead-cols` | `grid-template-columns: repeat(5, 1fr)`, gap `10px` |
| Integrations grid | `.int-grid` | `grid-template-columns: repeat(3, 1fr)`, gap `14px` |
| Appointments layout | `.appt-grid` | `grid-template-columns: 1fr 320px`, gap `16px` |
| Calendar grid | `.cal-grid` | `grid-template-columns: repeat(7, 1fr)` (7 days) |
| Campaign stats | `.campaign-stats` | `grid-template-columns: repeat(4, 1fr)`, gap `8px` |
| Import column mapping | `.import-map` | `grid-template-columns: 1fr 1fr`, gap `8px` |

---

## Border radius scale
| Size | Value | Used for |
|---|---|---|
| Small | `6–7px` | Inputs, small buttons, icon boxes |
| Medium | `8–9px` | Buttons, deal cards, lead cards |
| Large | `10–12px` | Cards, table wrappers, stat cards, banners |
| XL | `14px` | Modal |
| Pill/full | `20px` / `50%` | Status pills, avatars, toggles |

---

## Component reference

### Buttons
- `.btn` — base: `padding: 7px 13px`, `border-radius: 8px`, `font-size: 13px`, border `1px solid #d0d0d0`, background white, hover `#f5f5f5`
- `.btn-primary` — background `#1D9E75`, border `#0F6E56`, text white; hover background `#0F6E56`
- `.btn-sm` — `padding: 5px 10px`, `font-size: 12px`
- `.btn-danger` — transparent background, text `#c0392b`, no border, `padding: 4px 7px`; hover background `#fef2f2`

### Cards
- `.card` — white background, border `1px solid #e8e8e8`, `border-radius: 12px`, `padding: 16px`
- `.stat-card` — same border/radius pattern, `padding: 14px`; label `11px` gray, value `22px` bold, sub-label `11px` green

### Tables
- `.table-wrap` — white card wrapping a `<table>`, header row `.table-head` with title + actions
- `th` — `11px`, gray, bold, background `#fafafa`, bottom border `#f0f0f0`
- `td` — `13px`, color `#222`, bottom border `#f5f5f5`
- Row hover: background `#fafff9` (very light green tint)

### Forms
- `.form-group` — label (`11px`, bold, `#666`) stacked above input, `gap: 4px`, `margin-bottom: 10px`
- Inputs/selects/textareas — `padding: 7px 10px`, border `1px solid #d0d0d0`, `border-radius: 7px`, `font-size: 13px`; focus state: border becomes `#1D9E75`, no default outline

### Modal
- `.modal-overlay` — fixed, full-screen, `rgba(0,0,0,.45)` backdrop, flex-centered
- `.modal` — white, `border-radius: 14px`, `width: 480px` (max `96vw`), `max-height: 88vh` scrollable, shadow `0 8px 40px rgba(0,0,0,.18)`
- Footer: right-aligned Cancel + Save buttons, top border separator

### Toggle switch
- `.toggle` — `36×20px` pill, gray (`#d1d5db`) off / green (`#1D9E75`) on, white circle knob slides via `left: 2px` → `18px`

### Pipeline / Kanban cards
- `.pipeline-col` — light gray background (`#f7f8fa`), border, `border-radius: 12px`, `min-height: 200px`
- `.deal-card` — white, border `#e0e0e0`, `border-radius: 9px`; hover border turns brand green with subtle shadow

### Chat (AI assistant)
- `.ai-msgs` — fixed height `280px`, scrollable, `gap: 10px`
- Bot avatar: purple tones (`#ede9fe` bg / `#5b21b6` text); user avatar: green tones (`#e8f8f2` bg / `#0F6E56` text)
- Bubbles: bot `#f3f4f6` bg / `#111` text; user `#e8f8f2` bg / `#064e3b` text; `border-radius: 10px`

### Import wizard
- Drop zone: dashed border `2px dashed #d0d0d0`, `border-radius: 12px`, hover/drag-over state turns brand green with `#f0fdf9` background
- Progress bar: `.import-progress` track `#e8f8f2`, fill `#1D9E75`, `height: 8px`

---

## Icons
All icons are **Tabler Icons** (`ti ti-*` classes) — e.g. `ti-layout-dashboard`, `ti-users`, `ti-chart-bar`, `ti-bolt`, `ti-sparkles`, `ti-plug`. When rebuilding in React, use `@tabler/icons-react` and map each `ti-x` class name to its equivalent React component (e.g. `ti-layout-dashboard` → `<IconLayoutDashboard />`) to keep the icon set identical.

---

## Rebuild notes
- Treat every hex value and spacing number above as fixed — these are not placeholders, they are the client-approved visual design
- Convert this token table directly into `tailwind.config.js` `theme.extend.colors` and `borderRadius` rather than reinventing a palette
- Component classes above map roughly 1:1 to what should become reusable React components (`<Button>`, `<Card>`, `<Pill status="...">`, `<Modal>`, `<StatCard>`, `<DealCard>`) — build these once in Phase 1 and reuse across all later phases
