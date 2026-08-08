'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconInfinity, IconTrash, IconUserPlus } from '@tabler/icons-react';

export default function UsersPage() {
  const { users, deleteUser, openModal, searchQuery } = useCRM();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="license-banner">
        <IconInfinity size={28} color="#059669" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#064e3b' }}>
            Unlimited seats license
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
            Your organization has full access to add unlimited team members with zero extra per-seat fees.
          </div>
        </div>
        <Button variant="primary" className="btn-sm" icon={<IconUserPlus size={14} />} onClick={() => openModal('addUser')}>
          Add user
        </Button>
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">
            Team members (<span id="user-count">{filteredUsers.length}</span>)
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#e8f8f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#0F6E56',
                      }}
                    >
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td style={{ color: '#666' }}>{u.email}</td>
                <td>
                  <Pill status={u.role} />
                </td>
                <td>
                  <Pill status={u.status} />
                </td>
                <td>
                  {users.length > 1 && (
                    <Button
                      variant="danger"
                      icon={<IconTrash size={14} />}
                      onClick={() => deleteUser(u.id)}
                    />
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
