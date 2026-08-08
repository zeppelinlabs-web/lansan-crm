'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconTrash, IconDatabaseImport } from '@tabler/icons-react';

export default function ContactsPage() {
  const { contacts, deleteContact, searchQuery } = useCRM();

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
          <Link href="/import">
            <Button variant="sm" icon={<IconDatabaseImport size={14} />}>
              Import contacts
            </Button>
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>{c.company}</td>
                <td style={{ color: '#666' }}>{c.email}</td>
                <td style={{ color: '#666' }}>{c.phone}</td>
                <td>
                  <Pill status={c.status} />
                </td>
                <td>
                  <Button
                    variant="danger"
                    icon={<IconTrash size={14} />}
                    onClick={() => deleteContact(c.id)}
                  />
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
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
