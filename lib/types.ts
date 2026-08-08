export type StatusType = 
  | 'Active' | 'Lead' | 'Inactive' | 'Paid' | 'Overdue' | 'Pending'
  | 'Sent' | 'Draft' | 'Won' | 'Succeeded' | 'Failed' | 'High'
  | 'Medium' | 'Low' | 'In progress' | 'Closed' | 'Admin' | 'Manager' | 'Agent';

export interface Contact {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Lead' | 'Inactive';
}

export interface Deal {
  id: number;
  name: string;
  company: string;
  contactName?: string;
  contactId?: number;
  amount: number;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation';
}

export interface TaskItem {
  id: number;
  text: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  done: boolean;
}

export interface LeadItem {
  id: number;
  name: string;
  company: string;
  email: string;
  source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold outreach' | 'Import' | 'Ad campaign' | 'Direct';
  score: 'Hot' | 'Warm' | 'Cold';
  value: number;
  added: string;
}

export interface Appointment {
  id: number;
  time: string;
  name: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  date: string;
}

export interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  icon: string;
  color: string;
  iconColor: string;
  on: boolean;
}

export interface AutomationLog {
  id: number;
  rule: string;
  triggeredBy: string;
  actionTaken: string;
  time: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  sent: number;
  opens: number;
  clicks: number;
  date: string;
}

export interface PaymentTransaction {
  id: string;
  client: string;
  desc: string;
  amount: number;
  date: string;
  status: 'Succeeded' | 'Failed' | 'Pending';
}

export interface Invoice {
  id: string;
  client: string;
  desc: string;
  amount: number;
  due: string;
  status: 'Paid' | 'Overdue' | 'Pending';
}

export interface UserMember {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Agent';
  status: 'Active' | 'Inactive';
}

export interface IntegrationItem {
  name: string;
  desc: string;
  icon: string;
  bg: string;
  ic: string;
  connected: boolean;
  url?: string;
}

export interface WebsiteBlock {
  id: number;
  type: 'hero' | 'text' | 'cta' | 'services' | 'contact';
}

export interface ImportHistoryRow {
  filename: string;
  count: number;
  target: string;
  date: string;
  status: 'Success' | 'Failed';
}
