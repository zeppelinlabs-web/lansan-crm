'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconPlus, IconX, IconWorldUpload, IconDeviceDesktop } from '@tabler/icons-react';

interface Block {
  id: number;
  type: 'hero' | 'text' | 'cta' | 'services' | 'contact';
}

export default function WebsiteBuilderPage() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'hero' },
    { id: 2, type: 'services' },
    { id: 3, type: 'contact' },
  ]);

  const blockDefs = {
    hero: {
      label: 'Hero section',
      render: () => (
        <div style={{ textAlign: 'center', padding: '30px 20px', background: '#fafafa', borderRadius: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px', color: '#111' }}>
            Welcome to Lansan Connect
          </h1>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', maxWidth: '420px', margin: '0 auto 16px auto' }}>
            Powerful business tools built around your growth and sales pipeline.
          </p>
          <button style={{ background: '#1D9E75', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '7px', fontWeight: 700, cursor: 'pointer' }}>
            Get started
          </button>
        </div>
      ),
    },
    text: {
      label: 'Text block',
      render: () => (
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.7 }}>
            Add your custom messaging here. Share your mission, target clients, and key offerings with your website visitors.
          </p>
        </div>
      ),
    },
    cta: {
      label: 'Call to action',
      render: () => (
        <div style={{ textAlign: 'center', padding: '24px', background: '#e8f8f2', borderRadius: '10px', border: '1px solid #6ee7b7' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F6E56', marginBottom: '8px' }}>
            Ready to scale your business?
          </h2>
          <button style={{ background: '#0F6E56', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '7px', fontWeight: 700, cursor: 'pointer' }}>
            Contact our team today
          </button>
        </div>
      ),
    },
    services: {
      label: 'Services list',
      render: () => (
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginBottom: '10px' }}>
            Our core services
          </h2>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#444', lineHeight: 2.2 }}>
            <li>Sales & account management</li>
            <li>Client onboarding automation</li>
            <li>AI-powered customer support</li>
            <li>Lead generation & qualification</li>
          </ul>
        </div>
      ),
    },
    contact: {
      label: 'Contact form',
      render: () => (
        <div style={{ padding: '20px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginBottom: '12px' }}>
            Get in touch
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input type="text" placeholder="Your name" style={{ padding: '9px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
            <input type="email" placeholder="Email address" style={{ padding: '9px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
            <textarea placeholder="Tell us about your needs..." rows={3} style={{ padding: '9px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', resize: 'none' }} />
            <button style={{ background: '#1D9E75', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
              Send message
            </button>
          </div>
        </div>
      ),
    },
  };

  const addBlock = (type: keyof typeof blockDefs) => {
    setBlocks([...blocks, { id: Date.now(), type }]);
  };

  const removeBlock = (id: number) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handlePublish = () => {
    if (blocks.length === 0) {
      alert('Add at least one block first.');
      return;
    }
    alert('🎉 Site published! Your Lansan Connect website is live at https://lansanconnect.com');
  };

  return (
    <div>
      <div className="two-col">
        <Card title="Page Builder Blocks">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {(Object.keys(blockDefs) as (keyof typeof blockDefs)[]).map((type) => (
              <Button
                key={type}
                variant="sm"
                icon={<IconPlus size={12} />}
                onClick={() => addBlock(type)}
              >
                {blockDefs[type].label}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>
              Active Layout Stack ({blocks.length})
            </div>
            {blocks.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  background: '#f7f8fa',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#888', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
                    Section {idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#111' }}>{blockDefs[b.type].label}</span>
                </div>
                <Button variant="danger" icon={<IconX size={14} />} onClick={() => removeBlock(b.id)} />
              </div>
            ))}
            {blocks.length === 0 && (
              <div style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                Click a block button above to start building.
              </div>
            )}
          </div>
        </Card>

        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconDeviceDesktop size={18} color="#0F6E56" />
              <span>Live Website Preview</span>
            </div>
          }
          action={
            <Button variant="primary" className="btn-sm" icon={<IconWorldUpload size={14} />} onClick={handlePublish}>
              Publish site
            </Button>
          }
        >
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              background: '#ffffff',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {blocks.map((b) => (
              <React.Fragment key={b.id}>{blockDefs[b.type].render()}</React.Fragment>
            ))}
            {blocks.length === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#aaa', fontSize: '13px' }}>
                No content blocks added yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
