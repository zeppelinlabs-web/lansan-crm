'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';

export default function ReportsPage() {
  return (
    <div>
      <div className="stats-row">
        <StatCard label="Deals won" value="18" sub="This quarter" />
        <StatCard label="Win rate" value="64%" sub="+5% vs target" />
        <StatCard label="Avg deal size" value="$18,400" sub="Higher tier contracts" />
        <StatCard label="Email open rate" value="38.4%" sub="Industry avg: 21%" />
      </div>

      <div className="two-col">
        <Card title="Pipeline by stage">
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0' }}>
            {[
              { stage: 'Lead', val: 7200, bg: '#e8f8f2', color: '#1D9E75', height: '20%' },
              { stage: 'Qualified', val: 9500, bg: '#dbeafe', color: '#3b82f6', height: '32%' },
              { stage: 'Proposal', val: 18000, bg: '#fef3c7', color: '#d97706', height: '58%' },
              { stage: 'Negotiation', val: 42000, bg: '#ede9fe', color: '#7c3aed', height: '95%' },
            ].map((col) => (
              <div key={col.stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: col.color, marginBottom: '4px' }}>${(col.val / 1000).toFixed(1)}k</div>
                <div
                  style={{
                    width: '100%',
                    height: col.height,
                    background: col.bg,
                    border: `1.5px solid ${col.color}`,
                    borderRadius: '6px 6px 0 0',
                  }}
                />
                <div style={{ fontSize: '11px', color: '#666', marginTop: '6px', fontWeight: 600 }}>{col.stage}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue by month">
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '10px 0' }}>
            {[
              { m: 'Jan', v: 4.2 },
              { m: 'Feb', v: 6.8 },
              { m: 'Mar', v: 5.1 },
              { m: 'Apr', v: 9.4 },
              { m: 'May', v: 8.2 },
              { m: 'Jun', v: 11.2 },
            ].map((bar) => (
              <div key={bar.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#0F6E56', marginBottom: '4px' }}>${bar.v}k</div>
                <div
                  style={{
                    width: '100%',
                    height: `${(bar.v / 12) * 90}%`,
                    background: '#e8f8f2',
                    border: '1.5px solid #1D9E75',
                    borderRadius: '5px 5px 0 0',
                  }}
                />
                <div style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>{bar.m}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Campaign performance">
          <div style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            {[
              { name: 'Q2 Spring Outreach', opens: 162, clicks: 48 },
              { name: 'AI Launch', opens: 134, clicks: 61 },
              { name: 'Summer Promo', opens: 0, clicks: 0 },
            ].map((c) => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{c.name}</span>
                  <span style={{ color: '#888' }}>{c.opens} opens · {c.clicks} clicks</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${(c.opens / 200) * 100}%`, background: '#3b82f6', height: '100%' }} />
                  <div style={{ width: `${(c.clicks / 200) * 100}%`, background: '#7c3aed', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Contact growth trend">
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '10px 0' }}>
            {[
              { m: 'Jan', c: 12 },
              { m: 'Feb', c: 18 },
              { m: 'Mar', c: 24 },
              { m: 'Apr', c: 29 },
              { m: 'May', c: 35 },
              { m: 'Jun', c: 42 },
            ].map((pt) => (
              <div key={pt.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>+{pt.c}</div>
                <div
                  style={{
                    width: '8px',
                    height: `${(pt.c / 50) * 90}%`,
                    background: '#7c3aed',
                    borderRadius: '4px',
                  }}
                />
                <div style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>{pt.m}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
