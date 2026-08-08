'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export default function LeadGenPage() {
  const { leads, searchQuery } = useCRM();
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const sources = ['All', 'Website', 'Referral', 'LinkedIn', 'Cold outreach', 'Import', 'Ad campaign'];

  const filteredLeads = leads.filter((l) => {
    const matchesSource = selectedSource === 'All' || l.source === selectedSource;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const hotCount = leads.filter((l) => l.score === 'Hot').length;

  return (
    <div>
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
        {['Hot', 'Warm', 'Cold'].map((scoreCategory) => {
          const scoreLeads = filteredLeads.filter((l) => l.score === scoreCategory);

          return (
            <div
              key={scoreCategory}
              style={{
                background: '#f7f8fa',
                border: '1px solid #e8e8e8',
                borderRadius: '12px',
                padding: '12px',
                minHeight: '220px',
                gridColumn: 'span 2',
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
                {scoreLeads.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '9px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{lead.name}</div>
                    <div style={{ fontSize: '11px', color: '#888', margin: '2px 0 6px 0' }}>
                      {lead.company} · {lead.email}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: '#0F6E56', fontWeight: 700 }}>${lead.value.toLocaleString()}</span>
                      <span style={{ color: '#aaa' }}>{lead.source}</span>
                    </div>
                  </div>
                ))}

                {scoreLeads.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                    No {scoreCategory.toLowerCase()} leads
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
