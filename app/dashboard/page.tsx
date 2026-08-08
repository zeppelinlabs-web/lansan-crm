'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { contacts, deals, tasks, searchQuery } = useCRM();

  const filteredTasks = tasks
    .filter((t) => !t.done)
    .filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const pipelineTotal = deals.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="stats-row">
        <StatCard label="Total contacts" value={contacts.length} sub="Unlimited capacity" />
        <StatCard label="Pipeline value" value={`$${pipelineTotal.toLocaleString()}`} sub="Active deals" />
        <StatCard label="Revenue collected" value="$24,500" sub="Via Stripe" />
        <StatCard label="Emails sent" value="1,240" sub="This month" />
      </div>

      <div className="two-col">
        <Card title="Recent activity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#555' }}>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
              <i className="ti ti-bolt" style={{ color: '#d97706', fontSize: '16px' }}></i>
              <span>Automation fired — New lead welcome email</span>
            </div>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
              <i className="ti ti-speakerphone" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <span>Campaign sent — Q2 Spring Outreach (420 recipients)</span>
            </div>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
              <i className="ti ti-receipt" style={{ color: '#1D9E75', fontSize: '16px' }}></i>
              <span>Invoice paid — INV-004 · $8,200</span>
            </div>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
              <i className="ti ti-user-plus" style={{ color: '#2563eb', fontSize: '16px' }}></i>
              <span>Contact added — Daria Rowe</span>
            </div>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
              <i className="ti ti-chart-bar" style={{ color: '#d85a30', fontSize: '16px' }}></i>
              <span>Deal moved to Negotiation — Summit Group</span>
            </div>
          </div>
        </Card>

        <Card title="Upcoming tasks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTasks.map((task) => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px' }}>
                <i className="ti ti-point-filled" style={{ color: '#1D9E75', fontSize: '12px' }}></i>
                <span style={{ flex: 1, color: '#222' }}>{task.text}</span>
                <span style={{ color: '#aaa', fontSize: '11px' }}>{task.due}</span>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div style={{ fontSize: '13px', color: '#aaa' }}>No upcoming tasks.</div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Revenue overview — 2026">
        <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '20px 10px 0 10px' }}>
          {[
            { month: 'Jan', val: 4200, height: '35%' },
            { month: 'Feb', val: 6800, height: '55%' },
            { month: 'Mar', val: 5100, height: '42%' },
            { month: 'Apr', val: 9400, height: '78%' },
            { month: 'May', val: 8200, height: '68%' },
            { month: 'Jun', val: 11200, height: '95%' },
          ].map((bar) => (
            <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F6E56', marginBottom: '6px' }}>${bar.val.toLocaleString()}</div>
              <div
                style={{
                  width: '100%',
                  height: bar.height,
                  background: 'linear-gradient(180deg, #1D9E75 0%, #e8f8f2 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s ease',
                }}
              />
              <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>{bar.month}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
