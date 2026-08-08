'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';

export default function InvoicesPage() {
  const { invoices, searchQuery } = useCRM();

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">
            All invoices (<span id="inv-count">{filteredInvoices.length}</span>)
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ color: '#1e40af', fontWeight: 700, fontFamily: 'monospace' }}>{inv.id}</td>
                <td>
                  <strong>{inv.client}</strong>
                </td>
                <td style={{ color: '#666' }}>{inv.desc}</td>
                <td style={{ fontWeight: 700, color: '#0F6E56' }}>${inv.amount.toLocaleString()}</td>
                <td style={{ color: '#666' }}>{inv.due}</td>
                <td>
                  <Pill status={inv.status} />
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
