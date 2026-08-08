'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Modal } from '@/components/ui/Modal';

export const GlobalModals: React.FC = () => {
  const {
    contacts,
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
    showToast,
    prefillContact,
    selectedAppointmentDate,
  } = useCRM();

  // Contact Form State
  const [cName, setCName] = useState('');
  const [cCompany, setCCompany] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cStatus, setCStatus] = useState<string>('Lead');
  const [cCustomStatus, setCCustomStatus] = useState('');

  // Deal Form State
  const [dName, setDName] = useState('');
  const [dContactName, setDContactName] = useState('');
  const [dCompany, setDCompany] = useState('');
  const [dAmount, setDAmount] = useState('');
  const [dStage, setDStage] = useState<string>('Lead');
  const [dCustomStage, setDCustomStage] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  React.useEffect(() => {
    if (prefillContact && activeModal === 'addDeal') {
      setSelectedContactId(String(prefillContact.id));
      setDContactName(prefillContact.name);
      setDCompany(prefillContact.company);
      setDName(`${prefillContact.company} Contract`);
    }
  }, [prefillContact, activeModal]);

  // Task Form State
  const [tText, setTText] = useState('');
  const [tDue, setTDue] = useState('');
  const [tPriority, setTPriority] = useState<string>('Medium');
  const [tCustomPriority, setTCustomPriority] = useState('');

  // Lead Form State
  const [lName, setLName] = useState('');
  const [lCompany, setLCompany] = useState('');
  const [lEmail, setLEmail] = useState('');
  const [lSource, setLSource] = useState<string>('Website');
  const [lCustomSource, setLCustomSource] = useState('');
  const [lScore, setLScore] = useState<string>('Warm');
  const [lCustomScore, setLCustomScore] = useState('');
  const [lValue, setLValue] = useState('');

  // Appointment Form State
  const [aName, setAName] = useState('');
  const [aTime, setATime] = useState('09:00 AM');
  const [aCustomTime, setACustomTime] = useState('');
  const [aDate, setADate] = useState('2026-06-08');
  const [aType, setAType] = useState('Product Demo');
  const [aCustomType, setACustomType] = useState('');
  const [aStatus, setAStatus] = useState<string>('Confirmed');
  const [aCustomStatus, setACustomStatus] = useState('');
  const [selectedApptContactId, setSelectedApptContactId] = useState<string>('');

  React.useEffect(() => {
    if (activeModal === 'addAppointment') {
      if (selectedAppointmentDate) {
        setADate(selectedAppointmentDate);
      }
    }
  }, [selectedAppointmentDate, activeModal]);

  // Automation Form State
  const [autoName, setAutoName] = useState('');
  const [autoTrig, setAutoTrig] = useState('Contact added with status Lead');
  const [autoCustomTrig, setAutoCustomTrig] = useState('');
  const [autoAct, setAutoAct] = useState('Send welcome email template');
  const [autoCustomAct, setAutoCustomAct] = useState('');

  // Template Form State
  const [tplName, setTplName] = useState('');
  const [tplSubj, setTplSubj] = useState('');
  const [tplBody, setTplBody] = useState('');

  // Campaign Form State
  const [campName, setCampName] = useState('');
  const [campTpl, setCampTpl] = useState('');
  const [campCustomTpl, setCampCustomTpl] = useState('');
  const [campAud, setCampAud] = useState('All contacts');
  const [campCustomAud, setCampCustomAud] = useState('');
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
  const [uRole, setURole] = useState<string>('Agent');
  const [uCustomRole, setUCustomRole] = useState('');

  if (!activeModal) return null;

  return (
    <>
      {/* Add Contact Modal */}
      <Modal
        isOpen={activeModal === 'addContact'}
        title="Add contact"
        onClose={closeModal}
        onSave={() => {
          if (!cName.trim()) {
            showToast('Please enter the contact full name.', 'error');
            return;
          }
          const finalStatus = (cStatus === 'Other' ? cCustomStatus.trim() : cStatus) || 'Lead';
          addContact({
            name: cName.trim(),
            company: cCompany.trim() || '—',
            email: cEmail.trim() || '—',
            phone: cPhone.trim() || '—',
            status: finalStatus as any,
          });
          setCName('');
          setCCompany('');
          setCEmail('');
          setCPhone('');
          setCCustomStatus('');
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
          <select value={cStatus} onChange={(e) => setCStatus(e.target.value)}>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Other">Other (Custom...)</option>
          </select>
          {cStatus === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom status (e.g. VIP Partner)..."
              value={cCustomStatus}
              onChange={(e) => setCCustomStatus(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
        </div>
      </Modal>

      {/* Add Deal Modal */}
      <Modal
        isOpen={activeModal === 'addDeal'}
        title="Add deal"
        onClose={closeModal}
        onSave={() => {
          if (!dName.trim()) {
            showToast('Please enter a deal name.', 'error');
            return;
          }
          if (!dCompany.trim() && !dContactName.trim()) {
            showToast('Please select a contact or enter a company name.', 'error');
            return;
          }
          const finalStage = (dStage === 'Other' ? dCustomStage.trim() : dStage) || 'Lead';
          addDeal({
            name: dName.trim(),
            company: dCompany.trim() || '—',
            contactName: dContactName.trim() || '—',
            amount: parseInt(dAmount) || 0,
            stage: finalStage as any,
          });
          setDName('');
          setDContactName('');
          setDCompany('');
          setDAmount('');
          setDCustomStage('');
          setSelectedContactId('');
          closeModal();
        }}
      >
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <div className="form-label">Link Contact Person (Select from Contacts)</div>
          <select
            value={selectedContactId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedContactId(val);
              if (val && val !== 'custom') {
                const contact = contacts.find((c) => c.id === parseInt(val));
                if (contact) {
                  setDContactName(contact.name);
                  setDCompany(contact.company);
                }
              }
            }}
          >
            <option value="">-- Select Contact Person --</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
            <option value="custom">+ Add new / custom contact person...</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Deal name</div>
            <input type="text" placeholder="e.g. Call center platform" value={dName} onChange={(e) => setDName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="form-label">Contact Person Name</div>
            <input type="text" placeholder="e.g. Daria Rowe" value={dContactName} onChange={(e) => setDContactName(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Company</div>
            <input
              type="text"
              placeholder="e.g. Summit Group"
              list="company-list-options"
              value={dCompany}
              onChange={(e) => setDCompany(e.target.value)}
            />
            <datalist id="company-list-options">
              {Array.from(new Set(contacts.map((c) => c.company))).map((co) => (
                <option key={co} value={co} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <div className="form-label">Amount ($)</div>
            <input type="number" placeholder="15000" value={dAmount} onChange={(e) => setDAmount(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">Stage</div>
          <select value={dStage} onChange={(e) => setDStage(e.target.value)}>
            <option value="Lead">Lead</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Other">Other (Custom stage...)</option>
          </select>
          {dStage === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom pipeline stage..."
              value={dCustomStage}
              onChange={(e) => setDCustomStage(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={activeModal === 'addTask'}
        title="Add task"
        onClose={closeModal}
        onSave={() => {
          if (!tText) return;
          const finalPriority = (tPriority === 'Other' ? tCustomPriority.trim() : tPriority) || 'Medium';
          addTask({
            text: tText,
            due: tDue || 'TBD',
            priority: finalPriority as any,
          });
          setTText('');
          setTDue('');
          setTCustomPriority('');
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
            <select value={tPriority} onChange={(e) => setTPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Other">Other (Custom priority...)</option>
            </select>
            {tPriority === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom priority (e.g. Urgent)..."
                value={tCustomPriority}
                onChange={(e) => setTCustomPriority(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
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
          const finalSource = (lSource === 'Other' ? lCustomSource.trim() : lSource) || 'Website';
          const finalScore = (lScore === 'Other' ? lCustomScore.trim() : lScore) || 'Warm';
          addLead({
            name: lName,
            company: lCompany || '—',
            email: lEmail || '—',
            source: finalSource as any,
            score: finalScore as any,
            value: parseInt(lValue) || 5000,
          });
          setLName('');
          setLCompany('');
          setLEmail('');
          setLValue('');
          setLCustomSource('');
          setLCustomScore('');
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
            <select value={lSource} onChange={(e) => setLSource(e.target.value)}>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold outreach">Cold outreach</option>
              <option value="Import">Import</option>
              <option value="Ad campaign">Ad campaign</option>
              <option value="Direct">Direct</option>
              <option value="Other">Other (Custom source...)</option>
            </select>
            {lSource === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom source (e.g. Trade Show)..."
                value={lCustomSource}
                onChange={(e) => setLCustomSource(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
          </div>
          <div className="form-group">
            <div className="form-label">Score tag</div>
            <select value={lScore} onChange={(e) => setLScore(e.target.value)}>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Other">Other (Custom score...)</option>
            </select>
            {lScore === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom score (e.g. Qualified)..."
                value={lCustomScore}
                onChange={(e) => setLCustomScore(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={activeModal === 'addAppointment'}
        title="Schedule appointment"
        onClose={closeModal}
        onSave={() => {
          if (!aName.trim()) {
            showToast('Please enter an appointment title.', 'error');
            return;
          }
          if (!aDate) {
            showToast('Please select a date for the appointment.', 'error');
            return;
          }
          const finalTime = aTime === 'Other' ? aCustomTime.trim() || '09:00 AM' : aTime;
          const finalType = aType === 'Other' ? aCustomType.trim() || 'Meeting' : aType;
          const finalStatus = aStatus === 'Other' ? aCustomStatus.trim() || 'Confirmed' : aStatus;

          addAppointment({
            name: aName.trim(),
            time: finalTime,
            type: finalType,
            status: finalStatus as any,
            date: aDate,
          });
          setAName('');
          setACustomTime('');
          setACustomType('');
          setACustomStatus('');
          setSelectedApptContactId('');
          closeModal();
        }}
      >
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <div className="form-label">Link Contact Person (Optional)</div>
          <select
            value={selectedApptContactId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedApptContactId(val);
              if (val) {
                const contact = contacts.find((c) => c.id === parseInt(val));
                if (contact) {
                  setAName(`${contact.name} — ${contact.company} Call`);
                }
              }
            }}
          >
            <option value="">-- Select Contact from CRM --</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="form-label">Appointment title / details</div>
          <input
            type="text"
            placeholder="e.g. Daria Rowe — Summit Contract Review"
            value={aName}
            onChange={(e) => setAName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Date</div>
            <input
              type="date"
              value={aDate}
              onChange={(e) => setADate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-label">Time slot</div>
            <select value={aTime} onChange={(e) => setATime(e.target.value)}>
              <option value="08:00 AM">08:00 AM</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="01:30 PM">01:30 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="Other">Other (Custom time...)</option>
            </select>
            {aTime === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom time (e.g. 06:15 PM)..."
                value={aCustomTime}
                onChange={(e) => setACustomTime(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <div className="form-label">Appointment Type</div>
            <select value={aType} onChange={(e) => setAType(e.target.value)}>
              <option value="Video call">Video call</option>
              <option value="Product Demo">Product Demo</option>
              <option value="Discovery">Discovery</option>
              <option value="Sales Call">Sales Call</option>
              <option value="Contract Review">Contract Review</option>
              <option value="Onboarding Check-in">Onboarding Check-in</option>
              <option value="Other">Other (Custom type...)</option>
            </select>
            {aType === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom appointment type..."
                value={aCustomType}
                onChange={(e) => setACustomType(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
          </div>
          <div className="form-group">
            <div className="form-label">Initial Status</div>
            <select value={aStatus} onChange={(e) => setAStatus(e.target.value)}>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Other">Other (Custom status...)</option>
            </select>
            {aStatus === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom status..."
                value={aCustomStatus}
                onChange={(e) => setACustomStatus(e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
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
          const finalTrig = autoTrig === 'Other' ? autoCustomTrig.trim() || 'Trigger' : autoTrig;
          const finalAct = autoAct === 'Other' ? autoCustomAct.trim() || 'Action' : autoAct;
          addAutomation({
            name: autoName,
            trigger: finalTrig,
            action: finalAct,
            icon: 'ti-bolt',
          });
          setAutoName('');
          setAutoCustomTrig('');
          setAutoCustomAct('');
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
            <option value="Other">Other (Custom trigger...)</option>
          </select>
          {autoTrig === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom automation trigger..."
              value={autoCustomTrig}
              onChange={(e) => setAutoCustomTrig(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
        </div>
        <div className="form-group">
          <div className="form-label">Action (do this...)</div>
          <select value={autoAct} onChange={(e) => setAutoAct(e.target.value)}>
            <option value="Send welcome email template">Send welcome email template</option>
            <option value="Send follow-up email template">Send follow-up email template</option>
            <option value="Create follow-up task">Create follow-up task</option>
            <option value="Send internal notification">Send internal notification</option>
            <option value="Send payment reminder email">Send payment reminder email</option>
            <option value="Other">Other (Custom action...)</option>
          </select>
          {autoAct === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom automation action..."
              value={autoCustomAct}
              onChange={(e) => setAutoCustomAct(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
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
          const finalAud = campAud === 'Other' ? campCustomAud.trim() || 'Audience' : campAud;
          addCampaign({
            name: campName,
            date: campDate || 'Scheduled',
          });
          setCampName('');
          setCampCustomAud('');
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
            <option value="Other">Other (Custom template...)</option>
          </select>
          {campTpl === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom template name..."
              value={campCustomTpl}
              onChange={(e) => setCampCustomTpl(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
        </div>
        <div className="form-group">
          <div className="form-label">Audience</div>
          <select value={campAud} onChange={(e) => setCampAud(e.target.value)}>
            <option value="All contacts">All contacts</option>
            <option value="Leads only">Leads only</option>
            <option value="Active clients">Active clients</option>
            <option value="Other">Other (Custom segment...)</option>
          </select>
          {campAud === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom audience segment..."
              value={campCustomAud}
              onChange={(e) => setCampCustomAud(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
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
          const finalRole = uRole === 'Other' ? uCustomRole.trim() || 'Agent' : uRole;
          addUser({
            name: uName,
            email: uEmail || '—',
            role: finalRole as any,
          });
          setUName('');
          setUEmail('');
          setUCustomRole('');
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
          <select value={uRole} onChange={(e) => setURole(e.target.value)}>
            <option value="Agent">Agent</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
            <option value="Other">Other (Custom role...)</option>
          </select>
          {uRole === 'Other' && (
            <input
              type="text"
              placeholder="Enter custom role title..."
              value={uCustomRole}
              onChange={(e) => setUCustomRole(e.target.value)}
              style={{ marginTop: '6px' }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
