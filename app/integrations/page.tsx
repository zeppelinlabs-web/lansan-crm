'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  IconBrandStripe,
  IconBrandGmail,
  IconBrandGoogle,
  IconBrandSlack,
  IconBolt,
  IconForms,
  IconCalendarEvent,
  IconCircleLetterH,
  IconRocket,
  IconBrandLinkedin,
  IconTopologyStar,
  IconCalculator,
  IconKey,
  IconExternalLink,
  IconCheck,
} from '@tabler/icons-react';

export default function IntegrationsPage() {
  const { integrations, toggleIntegration, searchQuery } = useCRM();
  const [apiKey, setApiKey] = useState('lan_live_89f2a41d90e2b467c1');
  const [copiedKey, setCopiedKey] = useState(false);

  const getIntegrationIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'ti-brand-stripe': return <IconBrandStripe size={20} color={color} />;
      case 'ti-brand-gmail': return <IconBrandGmail size={20} color={color} />;
      case 'ti-brand-google': return <IconBrandGoogle size={20} color={color} />;
      case 'ti-brand-slack': return <IconBrandSlack size={20} color={color} />;
      case 'ti-bolt': return <IconBolt size={20} color={color} />;
      case 'ti-forms': return <IconForms size={20} color={color} />;
      case 'ti-calendar-event': return <IconCalendarEvent size={20} color={color} />;
      case 'ti-circle-letter-h': return <IconCircleLetterH size={20} color={color} />;
      case 'ti-rocket': return <IconRocket size={20} color={color} />;
      case 'ti-brand-linkedin': return <IconBrandLinkedin size={20} color={color} />;
      case 'ti-topology-star': return <IconTopologyStar size={20} color={color} />;
      case 'ti-calculator': return <IconCalculator size={20} color={color} />;
      default: return <IconBolt size={20} color={color} />;
    }
  };

  const filteredIntegrations = integrations.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 18 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`lan_live_${randomHex}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div>
      <div className="zapier-banner">
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>Connect 6,000+ apps with Zapier</div>
          <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
            Trigger automated workflows in Lansan from any app or push new lead data seamlessly.
          </div>
        </div>
        <a
          href="https://zapier.com/developer/public-invite/242513/339575cbc8defa190ce1c1b20f72bdd5/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="default" className="btn-sm" icon={<IconExternalLink size={14} />}>
            Open Zapier Integration
          </Button>
        </a>
      </div>

      <div className="int-grid" style={{ marginBottom: '20px' }}>
        {filteredIntegrations.map((int) => (
          <div
            key={int.name}
            style={{
              background: '#ffffff',
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: int.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIntegrationIcon(int.icon, int.ic)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{int.name}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                {int.desc}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '11px', color: int.connected ? '#0F6E56' : '#aaa', fontWeight: int.connected ? 600 : 400 }}>
                {int.connected ? '● Connected' : 'Not connected'}
              </span>
              <Button
                variant={int.connected ? 'default' : 'primary'}
                className="btn-sm"
                onClick={() => {
                  if (int.url) {
                    window.open(int.url, '_blank');
                  } else {
                    toggleIntegration(int.name);
                  }
                }}
              >
                {int.connected ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Card title="Developer API Access">
        <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
          Use the REST API to programmatically sync contacts, trigger workflows, and fetch pipeline records.
        </div>

        <div
          style={{
            background: '#1e293b',
            borderRadius: '10px',
            padding: '16px',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: '#94a3b8', marginBottom: '6px' }}>// Sample API Request — Create Contact</div>
          <div>
            <span style={{ color: '#86efac' }}>POST</span> https://api.lansanconnect.com/v1/contacts
          </div>
          <div style={{ color: '#94a3b8', marginTop: '4px' }}>
            Authorization: Bearer {apiKey}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="primary" className="btn-sm" icon={<IconKey size={14} />} onClick={handleGenerateKey}>
            Generate new API key
          </Button>
          <Button variant="default" className="btn-sm" icon={copiedKey ? <IconCheck size={14} /> : null} onClick={handleCopyKey}>
            {copiedKey ? 'Copied key' : 'Copy API key'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
