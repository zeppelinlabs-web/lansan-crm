'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconTrash, IconMail } from '@tabler/icons-react';

export default function TemplatesPage() {
  const { templates, deleteTemplate, searchQuery } = useCRM();
  const [selectedId, setSelectedId] = useState<number | null>(templates[0]?.id || null);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTemplate = templates.find((t) => t.id === selectedId);

  return (
    <div>
      <div className="two-col">
        <Card title="Templates list">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === selectedId;
              return (
                <div
                  key={tpl.id}
                  className="tpl-card"
                  style={{
                    borderColor: isSelected ? '#1D9E75' : '#e8e8e8',
                    background: isSelected ? '#f0fdf9' : '#f9fafb',
                  }}
                  onClick={() => setSelectedId(tpl.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="tpl-card-title">{tpl.name}</div>
                      <div className="tpl-card-prev">{tpl.subject}</div>
                    </div>
                    <Button
                      variant="danger"
                      icon={<IconTrash size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(tpl.id);
                        if (selectedId === tpl.id) setSelectedId(null);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {filteredTemplates.length === 0 && (
              <div style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                No templates found.
              </div>
            )}
          </div>
        </Card>

        <Card title="Template preview">
          {activeTemplate ? (
            <div>
              <div style={{ fontSize: '10px', color: '#888', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Subject line
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '16px', padding: '8px 12px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: '7px' }}>
                {activeTemplate.subject}
              </div>

              <div style={{ fontSize: '10px', color: '#888', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Email body preview
              </div>
              <div
                style={{
                  fontSize: '13px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  color: '#333',
                  padding: '14px',
                  background: '#fafafa',
                  border: '1px solid #e8e8e8',
                  borderRadius: '7px',
                  minHeight: '180px',
                }}
              >
                {activeTemplate.body}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#aaa' }}>
              <IconMail size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p style={{ fontSize: '13px' }}>Select a template from the left to preview.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
