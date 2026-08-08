'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import {
  IconUsers,
  IconChartBar,
  IconTarget,
  IconReceipt,
  IconUser,
  IconCheck,
  IconClock,
  IconPlus,
  IconSparkles,
  IconShieldCheck,
  IconPhoneCall,
  IconTrophy,
  IconBriefcase
} from '@tabler/icons-react';

export default function DashboardPage() {
  const {
    currentUser,
    users,
    switchUser,
    userContacts,
    userDeals,
    userTasks,
    userLeads,
    userAppointments,
    userInvoices,
    searchQuery,
    openModal,
    toggleTask
  } = useCRM();

  const filteredTasks = userTasks.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBilled = userInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = userInvoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pipelineValue = userDeals.reduce((sum, d) => sum + d.amount, 0);
  const openTaskCount = userTasks.filter((t) => !t.done).length;

  return (
    <div>

      {/* ========================================================================= */}
      {/* 1. ADMIN DASHBOARD SCREEN (LaToya) */}
      {/* ========================================================================= */}
      {currentUser.role === 'Admin' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Company Accounts" value={userContacts.length} sub="+14% vs last month" />
            <StatCard label="Pipeline Value" value={`$${pipelineValue.toLocaleString()}`} sub={`${userDeals.length} active deals`} />
            <StatCard label="Global Leads" value={userLeads.length} sub="across all rep channels" />
            <StatCard label="Paid Revenue" value={`$${totalPaid.toLocaleString()}`} sub={`billed: $${totalBilled.toLocaleString()}`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <Card title="Executive Company Revenue &amp; Growth Chart">
              <div style={{ height: '210px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '20px 10px 0 10px' }}>
                {[
                  { month: 'Jan', val: 5200, height: '40%', color: '#e8f8f2' },
                  { month: 'Feb', val: 7800, height: '62%', color: '#b8e6d5' },
                  { month: 'Mar', val: 6100, height: '50%', color: '#d4f1e8' },
                  { month: 'Apr', val: 9900, height: '82%', color: '#a3ddc8' },
                  { month: 'May', val: 8700, height: '70%', color: '#c2eedf' },
                  { month: 'Jun', val: totalPaid || 12700, height: '96%', color: '#8fd4ba' },
                ].map((bar) => (
                  <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>${(bar.val / 1000).toFixed(1)}k</div>
                    <div style={{ width: '100%', height: bar.height, background: bar.color, borderRadius: '8px 8px 0 0' }} />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', fontWeight: 600 }}>{bar.month}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Team Rep Performance">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {users.map((u) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.avatarColor || '#1D9E75', color: '#fff', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.role}</div>
                      </div>
                    </div>
                    <Pill status={u.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="table-wrap">
              <div className="table-head"><div className="table-head-title">Global Accounts Database ({userContacts.length})</div></div>
              <table>
                <thead>
                  <tr><th>Contact</th><th>Company</th><th>Assigned Rep</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {userContacts.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>{c.company}</td>
                      <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#0F6E56' }}>{c.assignedToName || 'LaToya'}</span></td>
                      <td><Pill status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-wrap">
              <div className="table-head"><div className="table-head-title">Global Invoices ({userInvoices.length})</div></div>
              <table>
                <thead>
                  <tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {userInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ color: '#1e40af', fontWeight: 700, fontFamily: 'monospace' }}>{inv.id}</td>
                      <td><strong>{inv.client}</strong></td>
                      <td style={{ fontWeight: 800, color: '#0F6E56' }}>${inv.amount.toLocaleString()}</td>
                      <td><Pill status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MANAGER DASHBOARD SCREEN (James Wilson) */}
      {/* ========================================================================= */}
      {currentUser.role === 'Manager' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Manager Team Deals" value={userDeals.length} sub={`$${pipelineValue.toLocaleString()} active value`} />
            <StatCard label="Managed Team Leads" value={userLeads.length} sub="assigned to sales team" />
            <StatCard label="Team Tasks Pending" value={userTasks.length} sub={`${openTaskCount} require action`} />
            <StatCard label="Managed Billed Invoices" value={`$${totalBilled.toLocaleString()}`} sub={`${userInvoices.length} team invoices`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <Card title="Sales Pipeline Stage Funnel (Manager Scope)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
                {[
                  { stage: 'Negotiation', count: userDeals.filter(d => d.stage === 'Negotiation').length, val: userDeals.filter(d => d.stage === 'Negotiation').reduce((s,d)=>s+d.amount,0), color: '#1D9E75', width: '85%' },
                  { stage: 'Proposal', count: userDeals.filter(d => d.stage === 'Proposal').length, val: userDeals.filter(d => d.stage === 'Proposal').reduce((s,d)=>s+d.amount,0), color: '#0284c7', width: '65%' },
                  { stage: 'Qualified', count: userDeals.filter(d => d.stage === 'Qualified').length, val: userDeals.filter(d => d.stage === 'Qualified').reduce((s,d)=>s+d.amount,0), color: '#7c3aed', width: '45%' },
                  { stage: 'Lead', count: userDeals.filter(d => d.stage === 'Lead').length, val: userDeals.filter(d => d.stage === 'Lead').reduce((s,d)=>s+d.amount,0), color: '#d97706', width: '30%' },
                ].map((s) => (
                  <div key={s.stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      <span>{s.stage} ({s.count} deals)</span>
                      <span style={{ color: s.color }}>${s.val.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: s.width, height: '100%', background: s.color, borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Managed Accounts Summary">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userContacts.map((c) => (
                  <div key={c.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{c.company} — {c.email}</div>
                  </div>
                ))}
                {userContacts.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No manager accounts assigned.</div>
                )}
              </div>
            </Card>
          </div>

          <div className="table-wrap">
            <div className="table-head"><div className="table-head-title">Manager Pipeline Deals ({userDeals.length})</div></div>
            <table>
              <thead>
                <tr><th>Deal Name</th><th>Company</th><th>Amount</th><th>Stage</th><th>Assigned Rep</th></tr>
              </thead>
              <tbody>
                {userDeals.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.name}</td>
                    <td>{d.company}</td>
                    <td style={{ fontWeight: 800, color: '#0F6E56' }}>${d.amount.toLocaleString()}</td>
                    <td><Pill status={d.stage} /></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>James Wilson</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AGENT DASHBOARD SCREEN (Sofia Rodriguez) */}
      {/* ========================================================================= */}
      {currentUser.role === 'Agent' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="My Personal Deals" value={userDeals.length} sub={`$${pipelineValue.toLocaleString()} value`} />
            <StatCard label="My Active Tasks" value={openTaskCount} sub="tasks requiring action" />
            <StatCard label="My Next Meeting" value={userAppointments[0]?.time || '04:15 PM'} sub={userAppointments[0]?.name || 'Discovery Call'} />
            <StatCard label="My Assigned Leads" value={userLeads.length} sub="leads to follow up" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <Card title="My Personal Tasks Checklist">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {userTasks.map((t) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: t.done ? '#94a3b8' : '#0f172a', textDecoration: t.done ? 'line-through' : 'none' }}>
                        {t.text}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Due date: {t.due}</div>
                    </div>
                    <Pill status={t.priority} />
                  </div>
                ))}
                {userTasks.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No tasks assigned to Sofia.</div>
                )}
              </div>
            </Card>

            <Card title="My Sales Appointments Today">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {userAppointments.map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{a.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{a.type} — {a.time}</div>
                    </div>
                    <Pill status={a.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="table-wrap">
            <div className="table-head"><div className="table-head-title">My Personal Pipeline Deals ({userDeals.length})</div></div>
            <table>
              <thead>
                <tr><th>Deal Name</th><th>Company</th><th>Amount</th><th>Stage</th></tr>
              </thead>
              <tbody>
                {userDeals.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.name}</td>
                    <td>{d.company}</td>
                    <td style={{ fontWeight: 800, color: '#0F6E56' }}>${d.amount.toLocaleString()}</td>
                    <td><Pill status={d.stage} /></td>
                  </tr>
                ))}
                {userDeals.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>No active deals assigned to Sofia.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
