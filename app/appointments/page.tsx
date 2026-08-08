'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { IconCopy, IconCheck, IconCalendarEvent, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function AppointmentsPage() {
  const { appointments, openModal, openAddAppointmentForDate, searchQuery } = useCRM();
  const [copied, setCopied] = useState(false);

  // Calendar State: Default to June 2026
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(5); // 0-indexed: 5 = June
  const [selectedDay, setSelectedDay] = useState<number>(8); // Default selected day: 8

  const bookingUrl = 'https://lansanconnect.com/book/latoya';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month Navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  // Calendar Math
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Helper to format YYYY-MM-DD
  const formatFormattedDate = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const selectedDateStr = formatFormattedDate(viewYear, viewMonth, selectedDay);

  // Appointments matching search & selected date
  const filteredAppts = appointments.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDayAppointments = (day: number) => {
    const dateStr = formatFormattedDate(viewYear, viewMonth, day);
    return appointments.filter((a) => {
      if (a.date) return a.date === dateStr || (a.date === 'Today' && viewYear === 2026 && viewMonth === 5 && day === 8);
      return viewYear === 2026 && viewMonth === 5 && day === 8;
    });
  };

  const selectedDayAppts = getDayAppointments(selectedDay).filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grid Cells Construction
  const gridCells = [];

  // Previous month padding days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    gridCells.push({
      type: 'prev',
      day: daysInPrevMonth - i,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({
      type: 'current',
      day: d,
    });
  }

  // Next month padding days to complete grid (multiples of 7)
  const remainingCells = (7 - (gridCells.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    gridCells.push({
      type: 'next',
      day: n,
    });
  }

  return (
    <div>
      {/* Public Booking Link Banner */}
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
        {/* Continuous Multi-Month Calendar */}
        <Card title="">
          {/* Calendar Header Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e8e8e8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>
                {monthNames[viewMonth]} {viewYear}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  background: '#e8f8f2',
                  color: '#0F6E56',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 600,
                }}
              >
                {daysInMonth} Days
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Button variant="sm" onClick={handleToday} title="Jump to Today">
                Today
              </Button>
              <Button variant="sm" onClick={handlePrevMonth} title="Previous Month">
                <IconChevronLeft size={16} />
              </Button>
              <Button variant="sm" onClick={handleNextMonth} title="Next Month">
                <IconChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Days of Week Header */}
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

          {/* Dynamic Month Grid */}
          <div className="cal-grid" style={{ gap: '4px' }}>
            {gridCells.map((cell, idx) => {
              if (cell.type !== 'current') {
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#f9f9f9',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      minHeight: '56px',
                      padding: '6px',
                      fontSize: '11px',
                      color: '#ccc',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: 0.6,
                    }}
                  >
                    <span>{cell.day}</span>
                  </div>
                );
              }

              const dayNum = cell.day;
              const isSelected = selectedDay === dayNum;
              const isToday = viewYear === 2026 && viewMonth === 5 && dayNum === 8;
              const dayAppts = getDayAppointments(dayNum);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(dayNum)}
                  style={{
                    background: isSelected
                      ? '#e8f8f2'
                      : isToday
                      ? '#f0fdf9'
                      : '#fafafa',
                    border: isSelected
                      ? '2px solid #1D9E75'
                      : isToday
                      ? '1px solid #6ee7b7'
                      : '1px solid #e8e8e8',
                    borderRadius: '8px',
                    minHeight: '56px',
                    padding: '6px',
                    fontSize: '12px',
                    color: isSelected || isToday ? '#0F6E56' : '#333',
                    fontWeight: isSelected || isToday ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{dayNum}</span>
                    {isToday && (
                      <span style={{ fontSize: '9px', background: '#1D9E75', color: '#fff', padding: '1px 4px', borderRadius: '4px' }}>
                        Today
                      </span>
                    )}
                  </div>

                  {dayAppts.length > 0 && (
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {dayAppts.map((appt) => (
                        <span
                          key={appt.id}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background:
                              appt.status === 'Confirmed'
                                ? '#1D9E75'
                                : appt.status === 'Pending'
                                ? '#d97706'
                                : '#991b1b',
                          }}
                          title={`${appt.name} (${appt.time})`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Schedule Sidebar */}
        <div>
          <Card title={`Schedule — ${monthNames[viewMonth]} ${selectedDay}, ${viewYear}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#666' }}>
                {selectedDayAppts.length} {selectedDayAppts.length === 1 ? 'appointment' : 'appointments'}
              </span>
              <Button variant="sm" onClick={() => openAddAppointmentForDate(selectedDateStr)}>
                + Add
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedDayAppts.map((appt) => (
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

              {selectedDayAppts.length === 0 && (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '30px 0', fontSize: '12px' }}>
                  No appointments scheduled for {monthNames[viewMonth]} {selectedDay}.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* All Scheduled Appointments Table */}
      <div className="table-wrap" style={{ marginTop: '16px' }}>
        <div className="table-head">
          <div className="table-head-title">
            All scheduled appointments ({filteredAppts.length})
          </div>
          <Button variant="sm" onClick={() => openAddAppointmentForDate(selectedDateStr)}>
            <i className="ti ti-plus" style={{ marginRight: '4px' }}></i>
            New appointment
          </Button>
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
            {filteredAppts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No scheduled appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
