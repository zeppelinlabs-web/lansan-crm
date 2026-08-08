'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconCheck } from '@tabler/icons-react';

export default function SettingsPage() {
  const [coName, setCoName] = useState('Lansan');
  const [coIndustry, setCoIndustry] = useState('CRM Platform & Business Services');
  const [coWebsite, setCoWebsite] = useState('https://lansanconnect.com');
  const [coEmail, setCoEmail] = useState('latoya@lansanconnect.com');

  const [aiModel, setAiModel] = useState('claude-sonnet-4');
  const [aiPersona, setAiPersona] = useState('Lansan AI');
  const [aiInstructions, setAiInstructions] = useState(
    'You are Lansan AI, the built-in assistant for Lansan CRM — serving businesses of all types. Current data context: contacts, pipeline deals, open tasks, automations, campaigns, and invoices. Be concise and practical. Produce ready-to-use email copy.'
  );

  const [savedCo, setSavedCo] = useState(false);
  const [savedAi, setSavedAi] = useState(false);

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

  return (
    <div>
      <div className="two-col">
        <Card title="Company Profile & Settings">
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

        <Card title="AI Assistant Configuration">
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
      </div>
    </div>
  );
}
