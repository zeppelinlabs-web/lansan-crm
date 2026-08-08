'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Modal } from '@/components/ui/Modal';

export const GlobalModals: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addContact,
    addDeal,
    addTask,
    addLead,
    addAppointment,
    addAutomation,
    addTemplate,
    addCampaign,
    addInvoice,
    addPayment,
    addUser,
    templates,
  } = useCRM();

  // Contact Form State
  const [cName, setCName] = useState('');
  const [cCompany, setCCompany] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cStatus, setCStatus] = useState<'Active' | 'Lead' | 'Inactive'>('Lead');

  // Deal Form State
  const [dName, setDName] = useState('');
  const [dCompany, setDCompany] = useState('');
  const [dAmount, setDAmount] = useState('');
  const [dStage, setDStage] = useState<'Lead' | 'Qualified' | 'Proposal' | 'Negotiation'>('Lead');

  // Task Form State
  const [tText, setTText] = useState('');
  const [tDue, setTDue] = useState('');
  const [tPriority, setTPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Lead Form State
  const [lName, setLName] = useState('');
  const [lCompany, setLCompany] = useState('');
  const [lEmail, setLEmail] = useState('');
  const [lSource, setLSource] = useState<'Website' | 'Referral' | 'LinkedIn' | 'Cold outreach' | 'Import' | 'Ad campaign'>('Website');
  const [lScore, setLScore] = useState<'Hot' | 'Warm' | 'Cold'>('Warm');
  const [lValue, setLValue] = useState('');

  // Appointment Form State
  const [aName, setAName] = useState('');
  const [aTime, setATime] = useState('09:00 AM');
  const [aType, setAType] = useState('Product Demo');
  const [aStatus, setAStatus] = useState<'Confirmed' | 'Pending' | 'Cancelled'>('Confirmed');

  // Automation Form State
  const [autoName, setAutoName] = useState('');
  const [autoTrig, setAutoTrig] = useState('Contact added with status Lead');
  const [autoAct, setAutoAct] = useState('Send welcome email template');

  // Template Form State
  const [tplName, setTplName] = useState('');
  const [tplSubj, setTplSubj] = useState('');
  const [tplBody, setTplBody] = useState('');

  // Campaign Form State
  const [campName, setCampName] = useState('');
  const [campTpl, setCampTpl] = useState('');
  const [campAud, setCampAud] = useState('All contacts');
  const [campDate, setCampDate] = useState('');

  // Invoice Form State
  const [invClient, setInvClient] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invDesc, setInvDesc] = useState('');
  const [invDue, setInvDue] = useState('');

  // Charge Client State
  const [chClient, setChClient] = useState('');
  const [chAmount, setChAmount] = useState('');
  const [chDesc, setChDesc] = useState('');

  // User Form State
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<'Admin' | 'Manager' | 'Agent'>('Agent');

  if (!activeModal) return null;

  return (
    <>
      {/* Add Contact Modal */}
      <Modal
        isOpen={activeModal === 'addContact'}
        title="Add contact"
        onClose={closeModal}
        onSave={() => {
          if (!cName) return;
          addContact({
            name: cName,
            company: cCompany || '—',
            email: cEmail || '—',
            phone: cPhone || '—',
            status: cStatus,
          });
          setCName('');
          setCCompany('');
          setCEmail('');
          setCPhone('');
          closeModal();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Full name</div>
            <input type="text" placeholder="Jane Smith" value={cName} onChange={(e) => setCName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Company</div>
            <input type="text" placeholder="Acme Corp" value={cCompany} onChange={(e) => setCCompany(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Email</div>
            <input type="email" placeholder="jane@acme.com" value={cEmail} onChange={(e) => setCEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Phone</div>
            <input type="text" placeholder="(555) 000-0000" value={cPhone} onChange={(e) => setCPhone(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Status</div>
          <select value={cStatus} onChange={(e) => setCStatus(e.target.value as any)}>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Modal>

      {/* Add Deal Modal */}
      <Modal
        isOpen={activeModal === 'addDeal'}
        title="Add deal"
        onClose={closeModal}
        onSave={() => {
          if (!dName) return;
          addDeal({
            name: dName,
            company: dCompany || '—',
            amount: parseInt(dAmount) || 0,
            stage: dStage,
          });
          setDName('');
          setDCompany('');
          setDAmount('');
          closeModal();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Deal name</div>
            <input type="text" placeholder="Cloud license" value={dName} onChange={(e) => setDName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Company</div>
            <input type="text" placeholder="Beta LLC" value={dCompany} onChange={(e) => setDCompany(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Amount ($)</div>
            <input type="number" placeholder="15000" value={dAmount} onChange={(e) => setDAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Stage</div>
            <select value={dStage} onChange={(e) => setDStage(e.target.value as any)}>
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={activeModal === 'addTask'}
        title="Add task"
        onClose={closeModal}
        onSave={() => {
          if (!tText) return;
          addTask({
            text: tText,
            due: tDue || 'TBD',
            priority: tPriority,
          });
          setTText('');
          setTDue('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Task description</div>
          <input type="text" placeholder="Follow up with..." value={tText} onChange={(e) => setTText(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Due date</div>
            <input type="date" value={tDue} onChange={(e) => setTDue(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Priority</div>
            <select value={tPriority} onChange={(e) => setTPriority(e.target.value as any)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add Lead Modal */}
      <Modal
        isOpen={activeModal === 'addLead'}
        title="Add lead"
        onClose={closeModal}
        onSave={() => {
          if (!lName) return;
          addLead({
            name: lName,
            company: lCompany || '—',
            email: lEmail || '—',
            source: lSource,
            score: lScore,
            value: parseInt(lValue) || 5000,
          });
          setLName('');
          setLCompany('');
          setLEmail('');
          setLValue('');
          closeModal();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Lead name</div>
            <input type="text" placeholder="Michael Scott" value={lName} onChange={(e) => setLName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Company</div>
            <input type="text" placeholder="Dunder Mifflin" value={lCompany} onChange={(e) => setLCompany(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Source</div>
            <select value={lSource} onChange={(e) => setLSource(e.target.value as any)}>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold outreach">Cold outreach</option>
              <option value="Import">Import</option>
              <option value="Ad campaign">Ad campaign</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Score tag</div>
            <select value={lScore} onChange={(e) => setLScore(e.target.value as any)}>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={activeModal === 'addAppointment'}
        title="Schedule appointment"
        onClose={closeModal}
        onSave={() => {
          if (!aName) return;
          addAppointment({
            name: aName,
            time: aTime,
            type: aType,
            status: aStatus,
            date: 'Today',
          });
          setAName('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Appointment title / contact</div>
          <input type="text" placeholder="John Doe — Discovery Call" value={aName} onChange={(e) => setAName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Time</div>
            <input type="text" value={aTime} onChange={(e) => setATime(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Type</div>
            <input type="text" value={aType} onChange={(e) => setAType(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Add Automation Modal */}
      <Modal
        isOpen={activeModal === 'addAutomation'}
        title="New automation rule"
        onClose={closeModal}
        onSave={() => {
          if (!autoName) return;
          addAutomation({
            name: autoName,
            trigger: autoTrig,
            action: autoAct,
            icon: 'ti-bolt',
          });
          setAutoName('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Rule name</div>
          <input type="text" placeholder="e.g. New lead welcome" value={autoName} onChange={(e) => setAutoName(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Trigger (when this happens...)</div>
          <select value={autoTrig} onChange={(e) => setAutoTrig(e.target.value)}>
            <option value="Contact added with status Lead">Contact added with status Lead</option>
            <option value="Deal moved to Proposal">Deal moved to Proposal</option>
            <option value="Deal moved to Won">Deal moved to Won</option>
            <option value="No activity for 7 days">No activity for 7 days</option>
            <option value="Invoice overdue 3 days">Invoice overdue 3 days</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Action (do this...)</div>
          <select value={autoAct} onChange={(e) => setAutoAct(e.target.value)}>
            <option value="Send welcome email template">Send welcome email template</option>
            <option value="Send follow-up email template">Send follow-up email template</option>
            <option value="Create follow-up task">Create follow-up task</option>
            <option value="Send internal notification">Send internal notification</option>
            <option value="Send payment reminder email">Send payment reminder email</option>
          </select>
        </div>
      </Modal>

      {/* Add Template Modal */}
      <Modal
        isOpen={activeModal === 'addTemplate'}
        title="New email template"
        onClose={closeModal}
        onSave={() => {
          if (!tplName) return;
          addTemplate({
            name: tplName,
            subject: tplSubj,
            body: tplBody,
          });
          setTplName('');
          setTplSubj('');
          setTplBody('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Template name</div>
          <input type="text" placeholder="Re-engagement email" value={tplName} onChange={(e) => setTplName(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Subject line</div>
          <input type="text" placeholder="Use {{first_name}}, {{company}} variables" value={tplSubj} onChange={(e) => setTplSubj(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Body</div>
          <textarea rows={5} placeholder="Hi {{first_name}}..." value={tplBody} onChange={(e) => setTplBody(e.target.value)} />
        </div>
      </Modal>

      {/* Add Campaign Modal */}
      <Modal
        isOpen={activeModal === 'addCampaign'}
        title="New campaign"
        onClose={closeModal}
        saveLabel="Create campaign"
        onSave={() => {
          if (!campName) return;
          addCampaign({
            name: campName,
            date: campDate || 'Scheduled',
          });
          setCampName('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Campaign name</div>
          <input type="text" placeholder="Summer Promo" value={campName} onChange={(e) => setCampName(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Email template</div>
          <select value={campTpl} onChange={(e) => setCampTpl(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Audience</div>
          <select value={campAud} onChange={(e) => setCampAud(e.target.value)}>
            <option value="All contacts">All contacts</option>
            <option value="Leads only">Leads only</option>
            <option value="Active clients">Active clients</option>
          </select>
        </div>
      </Modal>

      {/* Add Invoice Modal */}
      <Modal
        isOpen={activeModal === 'addInvoice'}
        title="Create invoice"
        onClose={closeModal}
        saveLabel="Create & send invoice"
        onSave={() => {
          if (!invClient) return;
          addInvoice({
            client: invClient,
            desc: invDesc || 'Services rendered',
            amount: parseInt(invAmount) || 0,
            due: invDue || 'TBD',
          });
          setInvClient('');
          setInvAmount('');
          setInvDesc('');
          closeModal();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Client name</div>
            <input type="text" placeholder="Acme Corp" value={invClient} onChange={(e) => setInvClient(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Amount ($)</div>
            <input type="number" placeholder="5000" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Description</div>
          <input type="text" placeholder="Services rendered — June 2026" value={invDesc} onChange={(e) => setInvDesc(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Due date</div>
          <input type="date" value={invDue} onChange={(e) => setInvDue(e.target.value)} />
        </div>
      </Modal>

      {/* Charge Client Modal */}
      <Modal
        isOpen={activeModal === 'chargeClient'}
        title="Charge client via Stripe"
        onClose={closeModal}
        saveLabel="Charge now"
        onSave={() => {
          if (!chClient) return;
          addPayment({
            client: chClient,
            desc: chDesc || 'Direct charge',
            amount: parseInt(chAmount) || 0,
          });
          setChClient('');
          setChAmount('');
          setChDesc('');
          closeModal();
        }}
      >
        <div className="form-group">
          <div className="form-label">Client name or email</div>
          <input type="text" placeholder="Apex Solutions" value={chClient} onChange={(e) => setChClient(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Amount ($)</div>
          <input type="number" placeholder="1000" value={chAmount} onChange={(e) => setChAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Description</div>
          <input type="text" placeholder="Invoice #, service description..." value={chDesc} onChange={(e) => setChDesc(e.target.value)} />
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={activeModal === 'addUser'}
        title="Add team member"
        onClose={closeModal}
        onSave={() => {
          if (!uName) return;
          addUser({
            name: uName,
            email: uEmail || '—',
            role: uRole,
          });
          setUName('');
          setUEmail('');
          closeModal();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Full name</div>
            <input type="text" placeholder="John Smith" value={uName} onChange={(e) => setUName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Email</div>
            <input type="email" placeholder="john@lansan.com" value={uEmail} onChange={(e) => setUEmail(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Role</div>
          <select value={uRole} onChange={(e) => setURole(e.target.value as any)}>
            <option value="Agent">Agent</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </Modal>
    </>
  );
};
