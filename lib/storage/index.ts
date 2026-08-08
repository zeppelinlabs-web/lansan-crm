import { readJsonData, writeJsonData } from './jsonStorage';
import {
  Contact,
  Deal,
  TaskItem,
  LeadItem,
  Appointment,
  AutomationRule,
  EmailTemplate,
  Campaign,
  Invoice,
  PaymentTransaction,
  UserMember,
} from '@/lib/types';
import {
  initialContacts,
  initialDeals,
  initialTasks,
  initialLeads,
  initialAppointments,
  initialAutomations,
  initialTemplates,
  initialCampaigns,
  initialInvoices,
  initialPayments,
  initialUsers,
} from '@/lib/mockData';

// Contacts Storage API
export async function getContacts(): Promise<Contact[]> {
  return readJsonData<Contact[]>('contacts.json', initialContacts);
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  return writeJsonData('contacts.json', contacts);
}

// Deals Storage API
export async function getDeals(): Promise<Deal[]> {
  return readJsonData<Deal[]>('deals.json', initialDeals);
}

export async function saveDeals(deals: Deal[]): Promise<void> {
  return writeJsonData('deals.json', deals);
}

// Tasks Storage API
export async function getTasks(): Promise<TaskItem[]> {
  return readJsonData<TaskItem[]>('tasks.json', initialTasks);
}

export async function saveTasks(tasks: TaskItem[]): Promise<void> {
  return writeJsonData('tasks.json', tasks);
}

// Leads Storage API
export async function getLeads(): Promise<LeadItem[]> {
  return readJsonData<LeadItem[]>('leads.json', initialLeads);
}

export async function saveLeads(leads: LeadItem[]): Promise<void> {
  return writeJsonData('leads.json', leads);
}

// Appointments Storage API
export async function getAppointments(): Promise<Appointment[]> {
  return readJsonData<Appointment[]>('appointments.json', initialAppointments);
}

export async function saveAppointments(appts: Appointment[]): Promise<void> {
  return writeJsonData('appointments.json', appts);
}

// Automations Storage API
export async function getAutomations(): Promise<AutomationRule[]> {
  return readJsonData<AutomationRule[]>('automations.json', initialAutomations);
}

export async function saveAutomations(automations: AutomationRule[]): Promise<void> {
  return writeJsonData('automations.json', automations);
}

// Templates Storage API
export async function getTemplates(): Promise<EmailTemplate[]> {
  return readJsonData<EmailTemplate[]>('templates.json', initialTemplates);
}

export async function saveTemplates(templates: EmailTemplate[]): Promise<void> {
  return writeJsonData('templates.json', templates);
}

// Campaigns Storage API
export async function getCampaigns(): Promise<Campaign[]> {
  return readJsonData<Campaign[]>('campaigns.json', initialCampaigns);
}

export async function saveCampaigns(campaigns: Campaign[]): Promise<void> {
  return writeJsonData('campaigns.json', campaigns);
}

// Invoices Storage API
export async function getInvoices(): Promise<Invoice[]> {
  return readJsonData<Invoice[]>('invoices.json', initialInvoices);
}

export async function saveInvoices(invoices: Invoice[]): Promise<void> {
  return writeJsonData('invoices.json', invoices);
}

// Payments Storage API
export async function getPayments(): Promise<PaymentTransaction[]> {
  return readJsonData<PaymentTransaction[]>('payments.json', initialPayments);
}

export async function savePayments(payments: PaymentTransaction[]): Promise<void> {
  return writeJsonData('payments.json', payments);
}

// Users Storage API
export async function getUsers(): Promise<UserMember[]> {
  return readJsonData<UserMember[]>('users.json', initialUsers);
}

export async function saveUsers(users: UserMember[]): Promise<void> {
  return writeJsonData('users.json', users);
}
