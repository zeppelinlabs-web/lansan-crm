'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { StatCard } from '@/components/ui/StatCard';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconBrandStripe, IconPlus } from '@tabler/icons-react';

export default function PaymentsPage() {
  const { payments, openModal, searchQuery } = useCRM();

  const filteredPayments = payments.filter(
    (p) =>
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = payments
    .filter((p) => p.status === 'Succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="stripe-banner">
        <IconBrandStripe size={28} color="#0369a1" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af' }}>
            Stripe account connected
          </div>
          <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>
            Ready to accept credit cards, Apple Pay, and automated ACH deposits.
          </div>
        </div>
        <Button variant="primary" className="btn-sm" icon={<IconPlus size={14} />} onClick={() => openModal('chargeClient')}>
          Charge client
        </Button>
      </div>

      <div className="stats-row">
        <StatCard label="Total collected" value={`$${totalCollected.toLocaleString()}`} sub="Lifetime Stripe total" />
        <StatCard label="This month" value="$12,700" sub="+18% vs last month" />
        <StatCard label="Pending payouts" value="$3,800" sub="Deposits tomorrow" />
        <StatCard label="Refunds" value="$0" sub="0.0% refund rate" />
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">Recent Stripe transactions</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Charge ID</th>
              <th>Client</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id}>
                <td style={{ color: '#1e40af', fontSize: '12px', fontFamily: 'monospace' }}>{p.id}</td>
                <td>
                  <strong>{p.client}</strong>
                </td>
                <td style={{ color: '#666' }}>{p.desc}</td>
                <td style={{ fontWeight: 700, color: '#0F6E56' }}>${p.amount.toLocaleString()}</td>
                <td style={{ color: '#666' }}>{p.date}</td>
                <td>
                  <Pill status={p.status} />
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
