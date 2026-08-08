'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';

export default function ContactsPage() {
  const {
    contacts,
    deals,
    leads,
    deleteContact,
    updateContactLeadScore,
    updateContactStatus,
    openModal,
    openAddDealForContact,
    openAddInvoiceForContact,
    searchQuery,
  } = useCRM();

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">
            All contacts (<span id="contact-count">{filteredContacts.length}</span>)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="sm" onClick={() => openModal('addContact')}>
              <i className="ti ti-plus" style={{ marginRight: '4px' }}></i>
              Add contact
            </Button>
            <Link href="/import">
              <Button variant="sm">
                <i className="ti ti-database-import" style={{ marginRight: '4px' }}></i>
                Import contacts
              </Button>
            </Link>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Pipeline Value</th>
              <th>Lead Board Status</th>
              <th>Contact Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => {
              const contactDeals = deals.filter(
                (d) => d.company.toLowerCase() === c.company.toLowerCase()
              );
              const dealTotal = contactDeals.reduce((sum, d) => sum + d.amount, 0);

              const matchingLead = leads.find(
                (l) => l.email.toLowerCase() === c.email.toLowerCase() || l.name.toLowerCase() === c.name.toLowerCase()
              );

              const leadScore = matchingLead ? matchingLead.score : 'Remove';

              const leadBg =
                leadScore === 'Hot'
                  ? '#fee2e2'
                  : leadScore === 'Warm'
                  ? '#fef3c7'
                  : leadScore === 'Cold'
                  ? '#dbeafe'
                  : '#f3f4f6';

              const leadColor =
                leadScore === 'Hot'
                  ? '#991b1b'
                  : leadScore === 'Warm'
                  ? '#92400e'
                  : leadScore === 'Cold'
                  ? '#1e40af'
                  : '#6b7280';

              const statusBg =
                c.status === 'Active'
                  ? '#e8f8f2'
                  : c.status === 'Lead'
                  ? '#dbeafe'
                  : '#f3f4f6';

              const statusColor =
                c.status === 'Active'
                  ? '#0F6E56'
                  : c.status === 'Lead'
                  ? '#1e40af'
                  : '#6b7280';

              return (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.company}</td>
                  <td style={{ color: '#666' }}>{c.email}</td>
                  <td style={{ color: '#666' }}>{c.phone}</td>
                  <td>
                    {contactDeals.length > 0 ? (
                      <div>
                        <span style={{ fontWeight: 700, color: '#0F6E56' }}>
                          ${dealTotal.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '11px', color: '#888', marginLeft: '6px' }}>
                          ({contactDeals.length} {contactDeals.length === 1 ? 'deal' : 'deals'})
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '12px' }}>No deals</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={leadScore}
                      onChange={(e) => updateContactLeadScore(c.id, e.target.value as any)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: leadBg,
                        color: leadColor,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      title="Update status on Lead Board"
                    >
                      <option value="Remove">Not on Lead Board</option>
                      <option value="Hot">🔥 Hot Lead</option>
                      <option value="Warm">⚡ Warm Lead</option>
                      <option value="Cold">❄️ Cold Lead</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) => updateContactStatus(c.id, e.target.value)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: statusBg,
                        color: statusColor,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="Lead">Lead</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <Button
                        variant="sm"
                        onClick={() => openAddDealForContact(c)}
                        title={`Create new deal for ${c.name} (${c.company})`}
                      >
                        <i className="ti ti-chart-bar" style={{ marginRight: '4px' }}></i>
                        Add Deal
                      </Button>

                      <Button
                        variant="sm"
                        onClick={() => openAddInvoiceForContact(c)}
                        title={`Create invoice for ${c.name} (${c.company})`}
                      >
                        <i className="ti ti-file-invoice" style={{ marginRight: '4px' }}></i>
                        Invoice
                      </Button>

                      <Button
                        variant="sm"
                        onClick={() =>
                          updateContactLeadScore(
                            c.id,
                            matchingLead
                              ? matchingLead.score === 'Hot'
                                ? 'Warm'
                                : 'Hot'
                              : 'Warm'
                          )
                        }
                        title="Add to or promote on Lead generation board"
                      >
                        <i className="ti ti-target" style={{ marginRight: '4px' }}></i>
                        {matchingLead ? 'Update Lead' : 'Add to Leads'}
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => deleteContact(c.id)}
                        title="Delete contact"
                      >
                        <i className="ti ti-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
