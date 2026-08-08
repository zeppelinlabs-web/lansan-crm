'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';

export default function ContactsPage() {
  const { contacts, deals, deleteContact, convertContactToLead, openModal, searchQuery } = useCRM();

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => {
              const contactDeals = deals.filter(
                (d) => d.company.toLowerCase() === c.company.toLowerCase()
              );
              const dealTotal = contactDeals.reduce((sum, d) => sum + d.amount, 0);

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
                    <Pill status={c.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <Button
                        variant="sm"
                        onClick={() => openModal('addDeal')}
                        title="Create new pipeline deal for this company"
                      >
                        <i className="ti ti-chart-bar" style={{ marginRight: '4px' }}></i>
                        Add Deal
                      </Button>
                      {c.status !== 'Lead' && (
                        <Button
                          variant="sm"
                          onClick={() => convertContactToLead(c.id)}
                          title="Promote contact to Lead generation board"
                        >
                          <i className="ti ti-target" style={{ marginRight: '4px' }}></i>
                          Add to Leads
                        </Button>
                      )}
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
                <td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
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
