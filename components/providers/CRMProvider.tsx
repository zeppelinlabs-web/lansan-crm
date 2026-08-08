'use client';

import React, { createContext, useContext, useState } from 'react';
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
} from '@/lib/types';
import {
  initialContacts,
  initialDeals,
  initialTasks,
  initialLeads,
  initialAppointments,
  initialAutomations,
  initialAutomationLogs,
  initialTemplates,
  initialCampaigns,
  initialInvoices,
  initialPayments,
  initialUsers,
  initialIntegrations,
  initialImportHistory
} from '@/lib/mockData';

export type ModalType =
  | 'addContact'
  | 'addDeal'
  | 'addTask'
  | 'addLead'
  | 'addAppointment'
  | 'addAutomation'
  | 'addTemplate'
  | 'addCampaign'
  | 'addInvoice'
  | 'chargeClient'
  | 'addUser'
  | null;

interface CRMContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: number) => void;
  convertContactToLead: (contactId: number) => void;

  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  deleteDeal: (id: number) => void;

  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'done'>) => void;
  toggleTask: (id: number) => void;

  leads: LeadItem[];
  addLead: (lead: Omit<LeadItem, 'id' | 'added'>) => void;
  convertLeadToDeal: (leadId: number) => void;
  deleteLead: (id: number) => void;

  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id'>) => void;

  automations: AutomationRule[];
  addAutomation: (auto: Omit<AutomationRule, 'id' | 'color' | 'iconColor' | 'on'>) => void;
  toggleAutomation: (id: number) => void;
  deleteAutomation: (id: number) => void;

  automationLogs: AutomationLog[];

  templates: EmailTemplate[];
  addTemplate: (tpl: Omit<EmailTemplate, 'id'>) => void;
  deleteTemplate: (id: number) => void;

  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'status' | 'sent' | 'opens' | 'clicks'>) => void;
  sendCampaign: (id: number) => void;
  deleteCampaign: (id: number) => void;

  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'status'>) => void;

  payments: PaymentTransaction[];
  addPayment: (payment: Omit<PaymentTransaction, 'id' | 'date' | 'status'>) => void;

  users: UserMember[];
  addUser: (user: Omit<UserMember, 'id' | 'status'>) => void;
  deleteUser: (id: number) => void;

  integrations: IntegrationItem[];
  toggleIntegration: (name: string) => void;

  importHistory: ImportHistoryRow[];
  addImportHistory: (row: ImportHistoryRow) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [automations, setAutomations] = useState<AutomationRule[]>(initialAutomations);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(initialAutomationLogs);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [users, setUsers] = useState<UserMember[]>(initialUsers);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [importHistory, setImportHistory] = useState<ImportHistoryRow[]>(initialImportHistory);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  // Contacts
  const addContact = (data: Omit<Contact, 'id'>) => {
    const nextId = contacts.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    const newContact: Contact = { id: nextId, ...data };

    setContacts((prev) => [newContact, ...prev]);

    // Bi-directional standard: If contact is created with status "Lead", sync automatically to Leads board
    if (data.status === 'Lead') {
      setLeads((prevLeads) => {
        const exists = prevLeads.some((l) => l.email.toLowerCase() === data.email.toLowerCase());
        if (exists) return prevLeads;
        const nextLeadId = prevLeads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
        const addedDate = new Date().toISOString().split('T')[0];
        return [
          {
            id: nextLeadId,
            name: data.name,
            company: data.company,
            email: data.email,
            source: 'Direct',
            score: 'Warm',
            value: 10000,
            added: addedDate,
          },
          ...prevLeads,
        ];
      });

      // Log automation audit entry if active rule exists
      setAutomationLogs((prevLogs) => [
        {
          id: prevLogs.reduce((m, l) => Math.max(m, l.id), 0) + 1,
          rule: 'New lead welcome email',
          triggeredBy: `${data.name} (${data.company})`,
          actionTaken: 'Auto-created Lead board record & queued email',
          time: 'Just now',
        },
        ...prevLogs,
      ]);
    }
  };

  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const convertContactToLead = (contactId: number) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    // Update status to Lead
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: 'Lead' } : c))
    );

    // Sync to Leads board
    setLeads((prevLeads) => {
      const exists = prevLeads.some((l) => l.email.toLowerCase() === contact.email.toLowerCase());
      if (exists) return prevLeads;
      const nextLeadId = prevLeads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      const addedDate = new Date().toISOString().split('T')[0];
      return [
        {
          id: nextLeadId,
          name: contact.name,
          company: contact.company,
          email: contact.email,
          source: 'Website',
          score: 'Warm',
          value: 12000,
          added: addedDate,
        },
        ...prevLeads,
      ];
    });
  };

  // Deals
  const addDeal = (data: Omit<Deal, 'id'>) => {
    const nextId = deals.reduce((m, d) => Math.max(m, d.id), 0) + 1;
    const newDeal = { id: nextId, ...data };
    setDeals((prev) => [newDeal, ...prev]);

    // CRM Standard Consistency: Auto-ensure matching Contact exists & status is synced
    setContacts((prevContacts) => {
      const exists = prevContacts.some(
        (c) => c.company.toLowerCase() === data.company.toLowerCase()
      );
      if (exists) {
        if (data.stage !== 'Lead') {
          return prevContacts.map((c) =>
            c.company.toLowerCase() === data.company.toLowerCase()
              ? { ...c, status: 'Active' }
              : c
          );
        }
        return prevContacts;
      }

      const nextContactId = prevContacts.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      const cleanCompany = data.company.trim() || 'New Account';
      const domain = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
      return [
        {
          id: nextContactId,
          name: `${cleanCompany} Representative`,
          company: cleanCompany,
          email: `contact@${domain || 'company'}.com`,
          phone: '(555) 000-0000',
          status: data.stage === 'Lead' ? 'Lead' : 'Active',
        },
        ...prevContacts,
      ];
    });
  };
  const deleteDeal = (id: number) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  // Tasks
  const addTask = (data: Omit<TaskItem, 'id' | 'done'>) => {
    const nextId = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    setTasks((prev) => [{ id: nextId, done: false, ...data }, ...prev]);
  };
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Leads
  const addLead = (data: Omit<LeadItem, 'id' | 'added'>) => {
    const nextId = leads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
    const added = new Date().toISOString().split('T')[0];
    const newLead: LeadItem = { id: nextId, added, ...data };

    setLeads((prev) => [newLead, ...prev]);

    // Bi-directional standard: Automatically ensure contact exists in Contacts table
    setContacts((prevContacts) => {
      const exists = prevContacts.some((c) => c.email.toLowerCase() === data.email.toLowerCase());
      if (exists) return prevContacts;
      const nextContactId = prevContacts.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      return [
        {
          id: nextContactId,
          name: data.name,
          company: data.company,
          email: data.email,
          phone: '—',
          status: 'Lead',
        },
        ...prevContacts,
      ];
    });
  };

  const deleteLead = (id: number) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Standard Lead Conversion Workflow: Lead -> Deal & Active Contact
  const convertLeadToDeal = (leadId: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // 1. Create new Deal in Pipeline under "Qualified" stage
    const nextDealId = deals.reduce((m, d) => Math.max(m, d.id), 0) + 1;
    const newDeal: Deal = {
      id: nextDealId,
      name: `${lead.company} Contract`,
      company: lead.company,
      amount: lead.value || 15000,
      stage: 'Qualified',
    };
    setDeals((prev) => [newDeal, ...prev]);

    // 2. Update contact status to "Active"
    setContacts((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === lead.email.toLowerCase()
          ? { ...c, status: 'Active' }
          : c
      )
    );

    // 3. Remove from Lead board or update score
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  // Appointments
  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const nextId = appointments.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    setAppointments((prev) => [{ id: nextId, ...data }, ...prev]);
  };

  // Automations
  const addAutomation = (data: Omit<AutomationRule, 'id' | 'color' | 'iconColor' | 'on'>) => {
    const nextId = automations.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    setAutomations((prev) => [
      {
        id: nextId,
        ...data,
        color: '#fef3c7',
        iconColor: '#92400e',
        on: true,
      },
      ...prev,
    ]);
  };
  const toggleAutomation = (id: number) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, on: !a.on } : a))
    );
  };
  const deleteAutomation = (id: number) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  // Templates
  const addTemplate = (data: Omit<EmailTemplate, 'id'>) => {
    const nextId = templates.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    setTemplates((prev) => [{ id: nextId, ...data }, ...prev]);
  };
  const deleteTemplate = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Campaigns
  const addCampaign = (data: Omit<Campaign, 'id' | 'status' | 'sent' | 'opens' | 'clicks'>) => {
    const nextId = campaigns.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    setCampaigns((prev) => [
      {
        id: nextId,
        status: 'Draft',
        sent: 0,
        opens: 0,
        clicks: 0,
        ...data,
      },
      ...prev,
    ]);
  };
  const sendCampaign = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const sent = contacts.length * 10 + Math.floor(Math.random() * 200);
          const opens = Math.floor(sent * 0.38);
          const clicks = Math.floor(opens * 0.18);
          return {
            ...c,
            status: 'Sent',
            sent,
            opens,
            clicks,
            date: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );
  };
  const deleteCampaign = (id: number) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Invoices
  const addInvoice = (data: Omit<Invoice, 'id' | 'status'>) => {
    const num = invoices.length + 5;
    const id = `INV-${String(num).padStart(3, '0')}`;
    setInvoices((prev) => [{ id, status: 'Pending', ...data }, ...prev]);
  };

  // Payments
  const addPayment = (data: Omit<PaymentTransaction, 'id' | 'date' | 'status'>) => {
    const id = `ch_${String(payments.length + 4).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    setPayments((prev) => [{ id, date, status: 'Succeeded', ...data }, ...prev]);
  };

  // Users
  const addUser = (data: Omit<UserMember, 'id' | 'status'>) => {
    const nextId = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
    setUsers((prev) => [{ id: nextId, status: 'Active', ...data }, ...prev]);
  };
  const deleteUser = (id: number) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Integrations
  const toggleIntegration = (name: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.name === name ? { ...item, connected: !item.connected } : item))
    );
  };

  // Import History
  const addImportHistory = (row: ImportHistoryRow) => {
    setImportHistory((prev) => [row, ...prev]);
  };

  return (
    <CRMContext.Provider
      value={{
        contacts,
        addContact,
        deleteContact,
        convertContactToLead,
        deals,
        addDeal,
        deleteDeal,
        tasks,
        addTask,
        toggleTask,
        leads,
        addLead,
        convertLeadToDeal,
        deleteLead,
        appointments,
        addAppointment,
        automations,
        addAutomation,
        toggleAutomation,
        deleteAutomation,
        automationLogs,
        templates,
        addTemplate,
        deleteTemplate,
        campaigns,
        addCampaign,
        sendCampaign,
        deleteCampaign,
        invoices,
        addInvoice,
        payments,
        addPayment,
        users,
        addUser,
        deleteUser,
        integrations,
        toggleIntegration,
        importHistory,
        addImportHistory,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within a CRMProvider');
  return ctx;
};
