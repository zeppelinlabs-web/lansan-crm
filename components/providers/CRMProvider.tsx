'use client';

import React, { createContext, useContext, useState } from 'react';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
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
  currentUser: UserMember;
  switchUser: (userId: number) => void;

  // Raw global state (for Admin management)
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: number) => void;
  convertContactToLead: (contactId: number) => void;
  updateContactLeadScore: (contactId: number, targetScore: 'Hot' | 'Warm' | 'Cold' | 'Remove') => void;
  updateContactStatus: (contactId: number, newStatus: string) => void;

  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  moveDeal: (id: number, stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation') => void;
  deleteDeal: (id: number) => void;

  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'done'>) => void;
  toggleTask: (id: number) => void;
  updateTaskPriority: (id: number, priority: 'High' | 'Medium' | 'Low') => void;
  updateTaskStatus: (id: number, done: boolean) => void;
  deleteTask: (id: number) => void;

  leads: LeadItem[];
  addLead: (lead: Omit<LeadItem, 'id' | 'added'>) => void;
  moveLead: (id: number, score: 'Hot' | 'Warm' | 'Cold') => void;
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
  addInvoice: (inv: Omit<Invoice, 'status'> & { status?: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled' }) => void;
  updateInvoiceStatus: (id: string, status: string) => void;
  deleteInvoice: (id: string) => void;

  payments: PaymentTransaction[];
  addPayment: (payment: Omit<PaymentTransaction, 'id' | 'date' | 'status'>) => void;

  users: UserMember[];
  addUser: (user: Omit<UserMember, 'id' | 'status'>) => void;
  deleteUser: (id: number) => void;

  integrations: IntegrationItem[];
  toggleIntegration: (name: string) => void;

  importHistory: ImportHistoryRow[];
  addImportHistory: (row: ImportHistoryRow) => void;
  clearImportHistory: () => void;
  deleteImportHistoryRow: (index: number) => void;

  // Strictly Scoped Data views based on active currentUser role & isolation
  userContacts: Contact[];
  userDeals: Deal[];
  userTasks: TaskItem[];
  userLeads: LeadItem[];
  userAppointments: Appointment[];
  userInvoices: Invoice[];

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;

  prefillContact: Contact | null;
  openAddDealForContact: (contact: Contact) => void;

  selectedAppointmentDate: string;
  openAddAppointmentForDate: (dateStr: string) => void;

  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserMember[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserMember>(initialUsers[0]); // Default: LaToya (Admin)

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
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [importHistory, setImportHistory] = useState<ImportHistoryRow[]>(initialImportHistory);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [prefillContact, setPrefillContact] = useState<Contact | null>(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<string>('2026-06-08');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUser = (userId: number) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`👤 Switched workspace view to ${found.name} (${found.role})`, 'info');
    }
  };

  // Role-Based Strict Data Isolation Filters
  const userContacts = React.useMemo(() => {
    if (currentUser.role === 'Admin') return contacts;
    return contacts.filter((c) => c.assignedToId === currentUser.id);
  }, [contacts, currentUser]);

  const userDeals = React.useMemo(() => {
    if (currentUser.role === 'Admin') return deals;
    return deals.filter((d) => d.assignedToId === currentUser.id);
  }, [deals, currentUser]);

  const userTasks = React.useMemo(() => {
    if (currentUser.role === 'Admin') return tasks;
    return tasks.filter((t) => t.assignedToId === currentUser.id);
  }, [tasks, currentUser]);

  const userLeads = React.useMemo(() => {
    if (currentUser.role === 'Admin') return leads;
    return leads.filter((l) => l.assignedToId === currentUser.id);
  }, [leads, currentUser]);

  const userAppointments = React.useMemo(() => {
    if (currentUser.role === 'Admin') return appointments;
    return appointments.filter((a) => a.assignedToId === currentUser.id);
  }, [appointments, currentUser]);

  const userInvoices = React.useMemo(() => {
    if (currentUser.role === 'Admin') return invoices;
    return invoices.filter((i) => i.assignedToId === currentUser.id);
  }, [invoices, currentUser]);

  const openModal = (modal: ModalType) => {
    setPrefillContact(null);
    setActiveModal(modal);
  };

  const openAddDealForContact = (contact: Contact) => {
    setPrefillContact(contact);
    setActiveModal('addDeal');
  };

  const openAddAppointmentForDate = (dateStr: string) => {
    setSelectedAppointmentDate(dateStr);
    setActiveModal('addAppointment');
  };

  const closeModal = () => {
    setActiveModal(null);
    setPrefillContact(null);
  };

  // Contacts
  const addContact = (data: Omit<Contact, 'id'>) => {
    const nextId = contacts.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    const newContact: Contact = {
      id: nextId,
      assignedToId: currentUser.id,
      assignedToName: currentUser.name,
      ...data,
    };

    setContacts((prev) => [newContact, ...prev]);
    showToast(`Contact "${data.name}" added successfully!`);

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
            assignedToId: currentUser.id,
            assignedToName: currentUser.name,
          },
          ...prevLeads,
        ];
      });

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
    const target = contacts.find((c) => c.id === id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    showToast(`Contact "${target?.name || ''}" deleted.`, 'info');
  };

  const convertContactToLead = (contactId: number) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: 'Lead' } : c))
    );

    setLeads((prevLeads) => {
      const existingIdx = prevLeads.findIndex(
        (l) =>
          l.email.toLowerCase() === contact.email.toLowerCase() ||
          l.name.toLowerCase() === contact.name.toLowerCase()
      );

      if (existingIdx !== -1) {
        const updated = [...prevLeads];
        updated[existingIdx] = { ...updated[existingIdx], score: 'Hot' };
        return updated;
      }

      const nextLeadId = prevLeads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      const addedDate = new Date().toISOString().split('T')[0];
      return [
        {
          id: nextLeadId,
          name: contact.name,
          company: contact.company,
          email: contact.email,
          source: 'Direct',
          score: 'Warm',
          value: 12500,
          added: addedDate,
          assignedToId: currentUser.id,
          assignedToName: currentUser.name,
        },
        ...prevLeads,
      ];
    });

    showToast(`🎯 Contact "${contact.name}" (${contact.company}) is now on the Lead Generation board!`);
  };

  const updateContactLeadScore = (contactId: number, targetScore: 'Hot' | 'Warm' | 'Cold' | 'Remove') => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    if (targetScore === 'Remove') {
      setLeads((prevLeads) =>
        prevLeads.filter(
          (l) =>
            l.email.toLowerCase() !== contact.email.toLowerCase() &&
            l.name.toLowerCase() !== contact.name.toLowerCase()
        )
      );
      showToast(`Removed "${contact.name}" from Lead Board.`, 'info');
      return;
    }

    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: 'Lead' } : c))
    );

    setLeads((prevLeads) => {
      const existingIdx = prevLeads.findIndex(
        (l) =>
          l.email.toLowerCase() === contact.email.toLowerCase() ||
          l.name.toLowerCase() === contact.name.toLowerCase()
      );

      if (existingIdx !== -1) {
        const updated = [...prevLeads];
        updated[existingIdx] = { ...updated[existingIdx], score: targetScore };
        return updated;
      }

      const nextLeadId = prevLeads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      const addedDate = new Date().toISOString().split('T')[0];
      return [
        {
          id: nextLeadId,
          name: contact.name,
          company: contact.company,
          email: contact.email,
          source: 'Direct',
          score: targetScore,
          value: 15000,
          added: addedDate,
          assignedToId: currentUser.id,
          assignedToName: currentUser.name,
        },
        ...prevLeads,
      ];
    });

    showToast(`🎯 Updated "${contact.name}" to ${targetScore} Lead on the Lead Board!`);
  };

  const updateContactStatus = (contactId: number, newStatus: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: newStatus as any } : c))
    );

    showToast(`Status for "${contact.name}" updated to "${newStatus}".`, 'info');
  };

  // Deals
  const addDeal = (data: Omit<Deal, 'id'>) => {
    const nextId = deals.reduce((m, d) => Math.max(m, d.id), 0) + 1;
    const newDeal = {
      id: nextId,
      assignedToId: currentUser.id,
      assignedToName: currentUser.name,
      ...data,
    };
    setDeals((prev) => [newDeal, ...prev]);

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
      const contactName = data.contactName && data.contactName !== '—' ? data.contactName : `${cleanCompany} Representative`;
      return [
        {
          id: nextContactId,
          name: contactName,
          company: cleanCompany,
          email: `contact@${domain || 'company'}.com`,
          phone: '(555) 000-0000',
          status: data.stage === 'Lead' ? 'Lead' : 'Active',
          assignedToId: currentUser.id,
          assignedToName: currentUser.name,
        },
        ...prevContacts,
      ];
    });

    showToast(`💼 Deal "${data.name}" ($${data.amount.toLocaleString()}) created for ${data.company}!`);
  };

  const moveDeal = (id: number, newStage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation') => {
    const target = deals.find((d) => d.id === id);
    if (!target || target.stage === newStage) return;

    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage: newStage } : d))
    );

    if (newStage !== 'Lead') {
      setContacts((prev) =>
        prev.map((c) =>
          c.company.toLowerCase() === target.company.toLowerCase()
            ? { ...c, status: 'Active' }
            : c
        )
      );
    }

    showToast(`💼 Deal "${target.name}" moved to ${newStage}!`);
  };

  const deleteDeal = (id: number) => {
    const target = deals.find((d) => d.id === id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deal "${target?.name || ''}" deleted.`, 'info');
  };

  // Tasks
  const addTask = (data: Omit<TaskItem, 'id' | 'done'>) => {
    const nextId = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    setTasks((prev) => [
      {
        id: nextId,
        done: false,
        assignedToId: currentUser.id,
        assignedToName: currentUser.name,
        ...data,
      },
      ...prev,
    ]);
    showToast('Task added successfully!');
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.done;
          showToast(nextState ? '✅ Task completed!' : 'Task reopened.', 'info');
          return { ...t, done: nextState };
        }
        return t;
      })
    );
  };

  const updateTaskPriority = (id: number, priority: 'High' | 'Medium' | 'Low') => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
    showToast(`⚡ Priority updated to ${priority} for task "${target.text}"`);
  };

  const updateTaskStatus = (id: number, done: boolean) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done } : t))
    );
    showToast(done ? `✅ Task "${target.text}" marked Closed` : `Task "${target.text}" marked In progress`, 'info');
  };

  const deleteTask = (id: number) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Task "${target?.text || ''}" deleted.`, 'info');
  };

  // Leads
  const addLead = (data: Omit<LeadItem, 'id' | 'added'>) => {
    const nextId = leads.reduce((m, l) => Math.max(m, l.id), 0) + 1;
    const added = new Date().toISOString().split('T')[0];
    const newLead: LeadItem = {
      id: nextId,
      added,
      assignedToId: currentUser.id,
      assignedToName: currentUser.name,
      ...data,
    };

    setLeads((prev) => [newLead, ...prev]);

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
          assignedToId: currentUser.id,
          assignedToName: currentUser.name,
        },
        ...prevContacts,
      ];
    });

    showToast(`🎯 Lead "${data.name}" added to Lead board!`);
  };

  const moveLead = (id: number, newScore: 'Hot' | 'Warm' | 'Cold') => {
    const target = leads.find((l) => l.id === id);
    if (!target || target.score === newScore) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, score: newScore } : l))
    );

    showToast(`🎯 Lead "${target.name}" moved to ${newScore} leads!`);
  };

  const deleteLead = (id: number) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead removed.', 'info');
  };

  const convertLeadToDeal = (leadId: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const nextDealId = deals.reduce((m, d) => Math.max(m, d.id), 0) + 1;
    const newDeal: Deal = {
      id: nextDealId,
      name: `${lead.company} Contract`,
      company: lead.company,
      contactName: lead.name,
      amount: lead.value || 15000,
      stage: 'Qualified',
      assignedToId: currentUser.id,
      assignedToName: currentUser.name,
    };
    setDeals((prev) => [newDeal, ...prev]);

    setContacts((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === lead.email.toLowerCase()
          ? { ...c, status: 'Active' }
          : c
      )
    );

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    showToast(`🚀 Converted "${lead.name}" to Active Contact & created Qualified Deal ($${(lead.value || 15000).toLocaleString()})!`);
  };

  // Appointments
  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const nextId = appointments.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    setAppointments((prev) => [
      {
        id: nextId,
        assignedToId: currentUser.id,
        assignedToName: currentUser.name,
        ...data,
      },
      ...prev,
    ]);
    showToast(`📅 Appointment scheduled for "${data.name}" on ${data.date}!`);
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
    showToast(`⚡ Automation rule "${data.name}" created!`);
  };

  const toggleAutomation = (id: number) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextState = !a.on;
          showToast(`Automation rule ${nextState ? 'enabled' : 'disabled'}.`, 'info');
          return { ...a, on: nextState };
        }
        return a;
      })
    );
  };

  const deleteAutomation = (id: number) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    showToast('Automation rule deleted.', 'info');
  };

  // Templates
  const addTemplate = (data: Omit<EmailTemplate, 'id'>) => {
    const nextId = templates.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    setTemplates((prev) => [{ id: nextId, ...data }, ...prev]);
    showToast(`✉️ Email template "${data.name}" saved!`);
  };

  const deleteTemplate = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template deleted.', 'info');
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
    showToast(`📢 Campaign "${data.name}" created!`);
  };

  const sendCampaign = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const sent = contacts.length * 10 + Math.floor(Math.random() * 200);
          const opens = Math.floor(sent * 0.38);
          const clicks = Math.floor(opens * 0.18);
          showToast(`🚀 Campaign "${c.name}" sent to ${sent.toLocaleString()} recipients!`);
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
    showToast('Campaign deleted.', 'info');
  };

  // Invoices
  const addInvoice = (data: Omit<Invoice, 'status'> & { status?: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled' }) => {
    setInvoices((prev) => [
      {
        status: data.status || 'Pending',
        assignedToId: currentUser.id,
        ...data,
      },
      ...prev,
    ]);
    showToast(`🧾 Invoice ${data.id} ($${data.amount.toLocaleString()}) issued to ${data.client}!`);
  };

  const updateInvoiceStatus = (id: string, status: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: status as any } : inv))
    );
    showToast(`Invoice ${id} status updated to ${status}.`, 'info');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast(`Invoice ${id} deleted.`, 'info');
  };

  // Payments
  const addPayment = (data: Omit<PaymentTransaction, 'id' | 'date' | 'status'>) => {
    const id = `ch_${String(payments.length + 4).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    setPayments((prev) => [{ id, date, status: 'Succeeded', ...data }, ...prev]);
    showToast(`💳 Charged $${data.amount.toLocaleString()} to ${data.client} via Stripe!`);
  };

  // Users
  const addUser = (data: Omit<UserMember, 'id' | 'status'>) => {
    const nextId = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
    const colors = ['#1D9E75', '#0284c7', '#7c3aed', '#ea580c'];
    const avatarColor = colors[nextId % colors.length];
    const newUser: UserMember = { id: nextId, status: 'Active', avatarColor, ...data };

    setUsers((prev) => [...prev, newUser]);
    showToast(`👤 Team member "${data.name}" added as ${data.role}!`);
  };

  const deleteUser = (id: number) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Team member removed.', 'info');
  };

  // Integrations
  const toggleIntegration = (name: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.name === name) {
          const nextState = !item.connected;
          showToast(`${name} integration ${nextState ? 'connected' : 'disconnected'}.`, nextState ? 'success' : 'info');
          return { ...item, connected: nextState };
        }
        return item;
      })
    );
  };

  // Import History
  const addImportHistory = (row: ImportHistoryRow) => {
    setImportHistory((prev) => [row, ...prev]);
  };

  const clearImportHistory = () => {
    setImportHistory([]);
    showToast('Import history cleared.', 'info');
  };

  const deleteImportHistoryRow = (index: number) => {
    setImportHistory((prev) => prev.filter((_, i) => i !== index));
    showToast('Import record removed.', 'info');
  };

  return (
    <CRMContext.Provider
      value={{
        currentUser,
        switchUser,
        contacts,
        addContact,
        deleteContact,
        convertContactToLead,
        updateContactLeadScore,
        updateContactStatus,
        deals,
        addDeal,
        moveDeal,
        deleteDeal,
        tasks,
        addTask,
        toggleTask,
        updateTaskPriority,
        updateTaskStatus,
        deleteTask,
        leads,
        addLead,
        moveLead,
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
        updateInvoiceStatus,
        deleteInvoice,
        payments,
        addPayment,
        users,
        addUser,
        deleteUser,
        integrations,
        toggleIntegration,
        importHistory,
        addImportHistory,
        clearImportHistory,
        deleteImportHistoryRow,
        userContacts,
        userDeals,
        userTasks,
        userLeads,
        userAppointments,
        userInvoices,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
        prefillContact,
        openAddDealForContact,
        selectedAppointmentDate,
        openAddAppointmentForDate,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within a CRMProvider');
  return ctx;
};
