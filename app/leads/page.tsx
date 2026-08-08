'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconForms, IconPlus, IconExternalLink } from '@tabler/icons-react';

export default function LeadGenPage() {
  const { leads, moveLead, convertLeadToDeal, deleteLead, searchQuery, integrations, showToast } = useCRM();
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  // Check if Typeform is connected
  const typeformIntegration = integrations.find(i => i.name === 'Typeform');
  const isTypeformConnected = typeformIntegration?.connected || false;

  const sources = ['All', 'Website', 'Referral', 'LinkedIn', 'Cold outreach', 'Import', 'Ad campaign', 'Direct'];

  const filteredLeads = leads.filter((l) => {
    const matchesSource = selectedSource === 'All' || l.source === selectedSource;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const hotCount = leads.filter((l) => l.score === 'Hot').length;

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData('text/plain', String(leadId));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCategory !== category) {
      setDragOverCategory(category);
    }
  };

  const handleDrop = (e: React.DragEvent, targetScore: 'Hot' | 'Warm' | 'Cold') => {
    e.preventDefault();
    const leadIdStr = e.dataTransfer.getData('text/plain');
    const leadId = parseInt(leadIdStr, 10);
    if (!isNaN(leadId)) {
      moveLead(leadId, targetScore);
    }
    setDragOverCategory(null);
    setDraggedLeadId(null);
  };

  return (
    <div>
      {/* Typeform Integration Banner */}
      {!isTypeformConnected && (
        <div style={{ 
          background: '#f0fdf9', 
          border: '1px solid #6ee7b7', 
          borderRadius: '12px', 
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IconForms size={28} color="#0F6E56" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#064e3b', marginBottom: '2px' }}>
                Auto-capture Leads from Typeform
              </div>
              <div style={{ fontSize: '12px', color: '#059669' }}>
                Connect Typeform to automatically create leads when someone submits your forms.
              </div>
            </div>
          </div>
          <a href="/integrations">
            <Button variant="primary" size="sm" icon={<IconForms size={16} />}>
              Connect Typeform
            </Button>
          </a>
        </div>
      )}

      <div className="stats-row">
        <StatCard label="Total leads" value={leads.length} sub="Active prospects" />
        <StatCard label="Hot leads" value={hotCount} sub="High purchase intent" />
        <StatCard label="Converted rate" value="14%" sub="+2.4% this month" />
        <StatCard label="Avg response time" value="12 mins" sub="Automated routing" />
      </div>

      <Card title="Source filter">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sources.map((src) => {
            const active = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: active ? '1px solid #0F6E56' : '1px solid #e0e0e0',
                  background: active ? '#e8f8f2' : '#fff',
                  color: active ? '#0F6E56' : '#555',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {src}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="lead-cols">
        {(['Hot', 'Warm', 'Cold'] as const).map((scoreCategory) => {
          const scoreLeads = filteredLeads.filter((l) => l.score === scoreCategory);
          const isOver = dragOverCategory === scoreCategory;

          return (
            <div
              key={scoreCategory}
              onDragOver={(e) => handleDragOver(e, scoreCategory)}
              onDragLeave={() => setDragOverCategory(null)}
              onDrop={(e) => handleDrop(e, scoreCategory)}
              style={{
                background: isOver ? '#f0fdf9' : '#f7f8fa',
                border: isOver ? '2px dashed #1D9E75' : '1px solid #e8e8e8',
                borderRadius: '12px',
                padding: '12px',
                minHeight: '220px',
                gridColumn: 'span 2',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e8e8e8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Pill status={scoreCategory} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                    {scoreCategory} leads
                  </span>
                </div>
                <span
                  style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    padding: '1px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#666',
                  }}
                >
                  {scoreLeads.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scoreLeads.map((lead, lIdx) => {
                  const isDragging = draggedLeadId === lead.id;

                  return (
                    <div
                      key={`lead-${lead.id}-${lIdx}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={() => {
                        setDraggedLeadId(null);
                        setDragOverCategory(null);
                      }}
                      style={{
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '9px',
                        padding: '12px',
                        opacity: isDragging ? 0.4 : 1,
                        cursor: 'grab',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="ti ti-grip-vertical" style={{ color: '#aaa', fontSize: '14px', cursor: 'grab' }}></i>
                            <span>{lead.name}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#888', margin: '2px 0 6px 20px' }}>
                            {lead.company} · {lead.email}
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(lead.id);
                          }}
                          title="Delete lead"
                          style={{ padding: '2px 4px' }}
                        >
                          <i className="ti ti-x"></i>
                        </Button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '8px' }}>
                        <span style={{ color: '#0F6E56', fontWeight: 700 }}>${lead.value.toLocaleString()}</span>
                        <span style={{ color: '#aaa' }}>{lead.source}</span>
                      </div>

                      <div style={{ paddingTop: '6px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="primary"
                          className="btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            convertLeadToDeal(lead.id);
                          }}
                          title="Convert lead into active deal in Pipeline"
                        >
                          <i className="ti ti-arrow-right" style={{ marginRight: '4px' }}></i>
                          Convert to Deal
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {scoreLeads.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                    Drag lead here to set as {scoreCategory.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
