'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconCheck } from '@tabler/icons-react';

export default function SettingsPage() {
  const { currentUser } = useCRM();

  // Company Settings (Admin only)
  const [coName, setCoName] = useState('Lansan');
  const [coIndustry, setCoIndustry] = useState('CRM Platform & Business Services');
  const [coWebsite, setCoWebsite] = useState('https://lansanconnect.com');
  const [coEmail, setCoEmail] = useState('latoya@lansanconnect.com');

  // AI Settings (Admin & Manager)
  const [aiModel, setAiModel] = useState('claude-sonnet-4');
  const [aiPersona, setAiPersona] = useState('Lansan AI');
  const [aiInstructions, setAiInstructions] = useState(
    'You are Lansan AI, the built-in assistant for Lansan CRM — serving businesses of all types. Current data context: contacts, pipeline deals, open tasks, automations, campaigns, and invoices. Be concise and practical. Produce ready-to-use email copy.'
  );

  // User Profile Settings (All roles)
  const [userName, setUserName] = useState(currentUser.name);
  const [userUsername, setUserUsername] = useState(currentUser.username || '');
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPhone, setUserPhone] = useState('');

  // Notification Settings (All roles)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [dealUpdates, setDealUpdates] = useState(true);

  const [savedCo, setSavedCo] = useState(false);
  const [savedAi, setSavedAi] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedNotifs, setSavedNotifs] = useState(false);

  const handleSaveCo = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedCo(true);
    setTimeout(() => setSavedCo(false), 2000);
  };

  const handleSaveAi = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAi(true);
    setTimeout(() => setSavedAi(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleSaveNotifs = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotifs(true);
    setTimeout(() => setSavedNotifs(false), 2000);
  };

  const isAdmin = currentUser.role === 'Admin';
  const isManagerOrAdmin = currentUser.role === 'Admin' || currentUser.role === 'Manager';

  return (
    <div>
      <div className="two-col">
        {/* Admin Only: Company Profile & Settings */}
        {isAdmin && (
          <Card title="Company Profile & Settings">
            <div style={{ 
              padding: '10px 12px', 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#0c4a6e',
              marginBottom: '16px'
            }}>
              🔐 Admin Only Section
            </div>
            <form onSubmit={handleSaveCo}>
              <div className="form-group">
                <div className="form-label">Company Name</div>
                <input type="text" value={coName} onChange={(e) => setCoName(e.target.value)} />
              </div>

              <div className="form-group">
                <div className="form-label">Industry / Business Type</div>
                <input type="text" value={coIndustry} onChange={(e) => setCoIndustry(e.target.value)} />
              </div>

              <div className="form-group">
                <div className="form-label">Website URL</div>
                <input type="url" value={coWebsite} onChange={(e) => setCoWebsite(e.target.value)} />
              </div>

              <div className="form-group">
                <div className="form-label">Default Sender / Support Email</div>
                <input type="email" value={coEmail} onChange={(e) => setCoEmail(e.target.value)} />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button type="submit" variant="primary">
                  Save company settings
                </Button>
                {savedCo && (
                  <span style={{ fontSize: '12px', color: '#0F6E56', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconCheck size={14} /> Saved!
                  </span>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* Admin & Manager: AI Assistant Configuration */}
        {isManagerOrAdmin && (
          <Card title="AI Assistant Configuration">
            <div style={{ 
              padding: '10px 12px', 
              background: '#fef3c7', 
              border: '1px solid #fde047', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#854d0e',
              marginBottom: '16px'
            }}>
              {isAdmin ? '🔐 Admin Only Section' : '👔 Manager Access'}
            </div>
            <form onSubmit={handleSaveAi}>
              <div className="form-group">
                <div className="form-label">AI Model Engine</div>
                <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
                  <option value="claude-sonnet-4">Claude Sonnet 4 (Fast & High Intelligence)</option>
                  <option value="gpt-4o">GPT-4o (Standard Enterprise)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Multimodal)</option>
                </select>
              </div>

              <div className="form-group">
                <div className="form-label">AI Persona Name</div>
                <input type="text" value={aiPersona} onChange={(e) => setAiPersona(e.target.value)} />
              </div>

              <div className="form-group">
                <div className="form-label">System Instructions & Behavior</div>
                <textarea
                  rows={5}
                  style={{ resize: 'vertical' }}
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button type="submit" variant="primary">
                  Save AI settings
                </Button>
                {savedAi && (
                  <span style={{ fontSize: '12px', color: '#0F6E56', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconCheck size={14} /> Saved!
                  </span>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* All Roles: User Profile Settings */}
        <Card title="My Profile Settings">
          <div style={{ 
            padding: '10px 12px', 
            background: '#f0fdf4', 
            border: '1px solid #86efac', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#14532d',
            marginBottom: '16px'
          }}>
            ✅ Available to All Users
          </div>
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <div className="form-label">Full Name</div>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>

            <div className="form-group">
              <div className="form-label">Username (for booking page)</div>
              <input 
                type="text" 
                value={userUsername} 
                onChange={(e) => setUserUsername(e.target.value)}
                placeholder="e.g. latoya or james-wilson"
              />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Your booking page: <strong>/book/{userUsername || 'your-username'}</strong>
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">Email Address</div>
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <div className="form-label">Phone Number</div>
              <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="(555) 000-0000" />
            </div>

            <div className="form-group">
              <div className="form-label">Role</div>
              <input type="text" value={currentUser.role} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Contact your administrator to change your role
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button type="submit" variant="primary">
                Save profile settings
              </Button>
              {savedProfile && (
                <span style={{ fontSize: '12px', color: '#0F6E56', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconCheck size={14} /> Saved!
                </span>
              )}
            </div>
          </form>
        </Card>

        {/* All Roles: Notification Preferences */}
        <Card title="Notification Preferences">
          <div style={{ 
            padding: '10px 12px', 
            background: '#f0fdf4', 
            border: '1px solid #86efac', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#14532d',
            marginBottom: '16px'
          }}>
            ✅ Available to All Users
          </div>
          <form onSubmit={handleSaveNotifs}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={emailNotifs} 
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Email Notifications</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Receive email alerts for important updates</div>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={taskReminders} 
                  onChange={(e) => setTaskReminders(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Task Reminders</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Get reminded about upcoming and overdue tasks</div>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={dealUpdates} 
                  onChange={(e) => setDealUpdates(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Deal Updates</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Notifications when deals move through pipeline stages</div>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button type="submit" variant="primary">
                Save notification settings
              </Button>
              {savedNotifs && (
                <span style={{ fontSize: '12px', color: '#0F6E56', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconCheck size={14} /> Saved!
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
