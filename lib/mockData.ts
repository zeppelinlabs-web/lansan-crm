import {
  Contact,
  Deal,
  TaskItem,
  LeadItem,
  Appointment,
  AutomationRule,
  AutomationLog,
  EmailTemplate,
  Campaign,
  PaymentTransaction,
  Invoice,
  UserMember,
  IntegrationItem,
  ImportHistoryRow
} from './types';

export const initialContacts: Contact[] = [
  { id: 1, name: 'Daria Rowe', company: 'Summit Group', email: 'daria@summit.com', phone: '(555) 234-5678', status: 'Active' },
  { id: 2, name: 'Marcus Vance', company: 'Apex Solutions', email: 'm.vance@apex.io', phone: '(555) 876-5432', status: 'Lead' },
  { id: 3, name: 'Elena Rostova', company: 'TechFlow Inc', email: 'elena@techflow.dev', phone: '(555) 345-6789', status: 'Active' },
];

export const initialDeals: Deal[] = [
  { id: 1, name: 'Call center platform', company: 'Apex Solutions', amount: 24500, stage: 'Negotiation' },
  { id: 2, name: 'Onboarding setup', company: 'TechFlow Inc', amount: 12000, stage: 'Proposal' },
  { id: 3, name: 'Support desk license', company: 'Summit Group', amount: 18200, stage: 'Qualified' },
  { id: 4, name: 'CRM migration consulting', company: 'Vanguard Co', amount: 22000, stage: 'Lead' },
];

export const initialTasks: TaskItem[] = [
  { id: 1, text: 'Follow up with Daria about contract renewal', due: '2026-06-10', priority: 'High', done: false },
  { id: 2, text: 'Send onboarding deck to TechFlow', due: '2026-06-12', priority: 'Medium', done: false },
  { id: 3, text: 'Prepare Q3 revenue report', due: '2026-06-15', priority: 'Low', done: false },
  { id: 4, text: 'Review campaign stats for Spring Outreach', due: '2026-06-05', priority: 'High', done: true },
];

export const initialLeads: LeadItem[] = [
  { id: 1, name: 'Sarah Connor', company: 'Cyberdyne Systems', email: 'sarah@cyberdyne.com', source: 'Website', score: 'Hot', value: 35000, added: '2026-06-01' },
  { id: 2, name: 'David Miller', company: 'Nexus Logistics', email: 'david@nexuslog.com', source: 'LinkedIn', score: 'Hot', value: 18000, added: '2026-06-02' },
  { id: 3, name: 'Amanda Chen', company: 'Vanguard Retail', email: 'amanda@vanguard.com', source: 'Referral', score: 'Warm', value: 12500, added: '2026-06-03' },
  { id: 4, name: 'Carlos Mendez', company: 'Solaris Health', email: 'carlos@solaris.org', source: 'Cold outreach', score: 'Warm', value: 9200, added: '2026-06-04' },
  { id: 5, name: 'Rachel Green', company: 'Bloom Retail', email: 'rachel@bloom.com', source: 'Ad campaign', score: 'Cold', value: 5000, added: '2026-06-05' },
];

export const initialAppointments: Appointment[] = [
  { id: 1, time: '09:00 AM', name: 'Daria Rowe — Summit Contract Review', type: 'Video call', status: 'Confirmed', date: 'Today' },
  { id: 2, time: '11:30 AM', name: 'Marcus Vance — Platform Demo', type: 'Product Demo', status: 'Pending', date: 'Today' },
  { id: 3, time: '02:00 PM', name: 'Elena Rostova — Onboarding Check-in', type: 'Discovery', status: 'Confirmed', date: 'Today' },
  { id: 4, time: '04:15 PM', name: 'Sarah Connor — Discovery Call', type: 'Sales Call', status: 'Cancelled', date: 'Today' },
];

export const initialAutomations: AutomationRule[] = [
  { id: 1, name: 'New lead welcome email', trigger: 'Contact added with status Lead', action: 'Send welcome email template', icon: 'ti-bolt', color: '#fef3c7', iconColor: '#92400e', on: true },
  { id: 2, name: 'Deal moved to Proposal notification', trigger: 'Deal moved to Proposal', action: 'Send internal notification', icon: 'ti-chart-bar', color: '#e8f8f2', iconColor: '#0F6E56', on: true },
  { id: 3, name: 'Overdue invoice reminder', trigger: 'Invoice overdue 3 days', action: 'Send payment reminder email', icon: 'ti-receipt', color: '#fee2e2', iconColor: '#991b1b', on: false },
];

export const initialAutomationLogs: AutomationLog[] = [
  { id: 1, rule: 'New lead welcome email', triggeredBy: 'Marcus Vance (Apex)', actionTaken: 'Sent email template: Welcome', time: '10 mins ago' },
  { id: 2, rule: 'Deal moved to Proposal notification', triggeredBy: 'Onboarding setup (TechFlow)', actionTaken: 'Slack notification posted to #sales', time: '1 hour ago' },
  { id: 3, rule: 'New lead welcome email', triggeredBy: 'Sarah Connor (Cyberdyne)', actionTaken: 'Sent email template: Welcome', time: 'Yesterday' },
];

export const initialTemplates: EmailTemplate[] = [
  { id: 1, name: 'Welcome new lead', subject: 'Welcome to Lansan Connect, {{first_name}}!', body: 'Hi {{first_name}},\n\nThank you for reaching out! We\'re thrilled to learn more about {{company}} and help you streamline your sales operations.\n\nWould you have 15 minutes for a brief call tomorrow?\n\nBest regards,\nLaToya' },
  { id: 2, name: 'Follow-up email', subject: 'Checking in — {{company}}', body: 'Hi {{first_name}},\n\nI wanted to follow up on our recent conversation. Do you have 15 minutes this week to reconnect?\n\nLooking forward to hearing from you.\n\nBest,\nLaToya' },
  { id: 3, name: 'Proposal sent', subject: 'Your proposal from Lansan Connect', body: 'Hi {{first_name}},\n\nPlease find attached your custom proposal for {{service}}. I\'m confident this solution will deliver measurable results for {{company}}.\n\nLet me know if you have any questions.\n\nWarm regards,\nLaToya' },
  { id: 4, name: 'Invoice reminder', subject: 'Invoice #{{invoice_id}} due soon', body: 'Hi {{first_name}},\n\nThis is a friendly reminder that invoice #{{invoice_id}} for ${{amount}} is due on {{due_date}}.\n\nPlease use the payment link below to complete your payment.\n\nThank you,\nLansan Connect Finance Team' },
];

export const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Q2 Spring Outreach', status: 'Sent', sent: 420, opens: 162, clicks: 48, date: '2026-05-28' },
  { id: 2, name: 'AI Automation Launch', status: 'Sent', sent: 310, opens: 134, clicks: 61, date: '2026-06-01' },
  { id: 3, name: 'Summer Service Promo', status: 'Draft', sent: 0, opens: 0, clicks: 0, date: '—' },
];

export const initialInvoices: Invoice[] = [
  { id: 'INV-001', client: 'Apex Solutions', desc: 'Call center services — April', amount: 8200, due: '2026-05-01', status: 'Paid' },
  { id: 'INV-002', client: 'TechFlow Inc', desc: 'Platform onboarding — Q1', amount: 4500, due: '2026-05-15', status: 'Paid' },
  { id: 'INV-003', client: 'Summit Group', desc: 'Services — April', amount: 11800, due: '2026-06-01', status: 'Overdue' },
  { id: 'INV-004', client: 'Apex Solutions', desc: 'Call center services — May', amount: 8200, due: '2026-06-15', status: 'Pending' },
];

export const initialPayments: PaymentTransaction[] = [
  { id: 'ch_001', client: 'Apex Solutions', desc: 'INV-001', amount: 8200, date: '2026-05-02', status: 'Succeeded' },
  { id: 'ch_002', client: 'TechFlow Inc', desc: 'INV-002', amount: 4500, date: '2026-05-16', status: 'Succeeded' },
  { id: 'ch_003', client: 'Apex Solutions', desc: 'INV-004 partial', amount: 3800, date: '2026-06-03', status: 'Succeeded' },
];

export const initialUsers: UserMember[] = [
  { id: 1, name: 'LaToya', email: 'latoya@lansanconnect.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'James Wilson', email: 'j.wilson@lansanconnect.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Sofia Rodriguez', email: 'sofia@lansanconnect.com', role: 'Agent', status: 'Active' },
];

export const initialIntegrations: IntegrationItem[] = [
  { name: 'Stripe', desc: 'Accept payments, send invoices, and manage subscriptions directly in Lansan.', icon: 'ti-brand-stripe', bg: '#e0f2fe', ic: '#0369a1', connected: true },
  { name: 'Gmail', desc: 'Sync emails, log conversations to contacts, and send campaigns from your Gmail account.', icon: 'ti-brand-gmail', bg: '#fee2e2', ic: '#dc2626', connected: false },
  { name: 'Google Calendar', desc: 'Sync appointments and tasks with Google Calendar. Two-way real-time sync.', icon: 'ti-brand-google', bg: '#fef3c7', ic: '#d97706', connected: false },
  { name: 'Slack', desc: 'Get deal alerts, task reminders, and automation notifications in your Slack channels.', icon: 'ti-brand-slack', bg: '#ede9fe', ic: '#7c3aed', connected: true },
  { name: 'Zapier', desc: 'Connect Lansan to 6,000+ apps. Trigger workflows from any event in the CRM.', icon: 'ti-bolt', bg: '#fff7ed', ic: '#ea580c', connected: false, url: 'https://zapier.com/developer/public-invite/242513/339575cbc8defa190ce1c1b20f72bdd5/' },
  { name: 'Typeform', desc: 'Automatically create leads in Lansan when someone completes your Typeform.', icon: 'ti-forms', bg: '#f0fdf9', ic: '#0F6E56', connected: false },
  { name: 'Calendly', desc: 'Sync Calendly bookings as appointments and auto-create contacts for new bookings.', icon: 'ti-calendar-event', bg: '#f0fdf9', ic: '#0891b2', connected: false },
  { name: 'HubSpot', desc: 'Two-way sync contacts, deals, and notes between HubSpot and Lansan.', icon: 'ti-circle-letter-h', bg: '#fff7ed', ic: '#c2410c', connected: false },
  { name: 'Apollo.io', desc: 'Push enriched lead data from Apollo directly into Lansan contacts and pipeline.', icon: 'ti-rocket', bg: '#f5f3ff', ic: '#6d28d9', connected: false },
  { name: 'LinkedIn', desc: 'Import lead profiles and company data from LinkedIn Sales Navigator.', icon: 'ti-brand-linkedin', bg: '#dbeafe', ic: '#1e40af', connected: false },
  { name: 'Make (Integromat)', desc: 'Build advanced multi-step automations between Lansan and hundreds of apps.', icon: 'ti-topology-star', bg: '#fdf4ff', ic: '#a21caf', connected: false },
  { name: 'QuickBooks', desc: 'Sync invoices and payments between Lansan and QuickBooks automatically.', icon: 'ti-calculator', bg: '#f0fdf9', ic: '#15803d', connected: false },
];

export const initialImportHistory: ImportHistoryRow[] = [
  { filename: 'q1_leads_batch.csv', count: 142, target: 'Contacts', date: '2026-05-10', status: 'Success' },
  { filename: 'trade_show_contacts.csv', count: 68, target: 'Contacts', date: '2026-04-22', status: 'Success' },
];
