'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { IconCopy, IconCheck, IconCalendarEvent } from '@tabler/icons-react';

export default function AppointmentsPage() {
  const { appointments, searchQuery } = useCRM();
  const [copied, setCopied] = useState(false);

  const bookingUrl = 'https://lansanconnect.com/book/latoya';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredAppts = appointments.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="card booking-link-box" style={{ marginBottom: '16px' }}>
        <IconCalendarEvent size={20} color="#0F6E56" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F6E56', textTransform: 'uppercase' }}>
            Public booking link
          </div>
          <div className="booking-url">{bookingUrl}</div>
        </div>
        <Button variant="sm" icon={copied ? <IconCheck size={14} /> : <IconCopy size={14} />} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy link'}
        </Button>
      </div>

      <div className="appt-grid">
        <Card title="June 2026 Calendar">
          <div className="cal-grid" style={{ gap: '4px', marginBottom: '8px' }}>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#888',
                  padding: '4px 0',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="cal-grid" style={{ gap: '4px' }}>
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 1; // Start month offset
              const isValidDay = dayNum >= 1 && dayNum <= 30;
              const isToday = dayNum === 8;

              return (
                <div
                  key={i}
                  style={{
                    background: isToday ? '#e8f8f2' : isValidDay ? '#fafafa' : 'transparent',
                    border: isValidDay ? '1px solid #e8e8e8' : 'none',
                    borderRadius: '8px',
                    minHeight: '52px',
                    padding: '6px',
                    fontSize: '12px',
                    color: isToday ? '#0F6E56' : '#333',
                    fontWeight: isToday ? 700 : 500,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {isValidDay && <span>{dayNum}</span>}
                  {isValidDay && dayNum % 3 === 0 && (
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#1D9E75',
                        }}
                      />
                      {dayNum % 6 === 0 && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#d97706',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div>
          <Card title="Today's schedule">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredAppts.map((appt) => (
                <div
                  key={appt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                  }}
                >
                  <div className="appt-time">{appt.time}</div>
                  <div className="appt-info">
                    <div className="appt-name">{appt.name}</div>
                    <div className="appt-type">{appt.type}</div>
                  </div>
                  <Pill status={appt.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">All scheduled appointments ({filteredAppts.length})</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appointment / Contact</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppts.map((appt) => (
              <tr key={appt.id}>
                <td style={{ fontWeight: 600, color: '#0F6E56' }}>{appt.time}</td>
                <td>
                  <strong>{appt.name}</strong>
                </td>
                <td style={{ color: '#666' }}>{appt.type}</td>
                <td>
                  <Pill status={appt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
