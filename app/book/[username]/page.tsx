'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import {
  IconCalendar,
  IconClock,
  IconVideo,
  IconCheck,
  IconUser,
  IconMail,
  IconBuilding,
  IconPhone,
  IconArrowLeft
} from '@tabler/icons-react';

export default function UserBookingPage({ params }: { params: Promise<{ username: string }> }) {
  const { addAppointment, addContact, contacts, showToast, users, currentUser } = useCRM();
  
  // Unwrap the params Promise
  const { username } = use(params);

  // Find the team member by username
  const bookingUser = users.find(u => u.username === username) || currentUser;

  // Booking Form State
  const [meetingType, setMeetingType] = useState<{
    id: string;
    name: string;
    duration: string;
    desc: string;
  }>({
    id: 'meeting',
    name: '30-Min Team Meeting',
    duration: '30 mins',
    desc: `Discussion with ${bookingUser.name} about LanSan CRM features and workflows.`,
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-06-15');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [booked, setBooked] = useState(false);

  const meetingTypes = [
    {
      id: 'intro',
      name: '15-Min Quick Call',
      duration: '15 mins',
      desc: `Quick intro call with ${bookingUser.name} to discuss your needs and answer questions.`,
    },
    {
      id: 'meeting',
      name: '30-Min Team Meeting',
      duration: '30 mins',
      desc: `Discussion with ${bookingUser.name} about LanSan CRM features and workflows.`,
    },
    {
      id: 'strategy',
      name: '60-Min Strategy Session',
      duration: '60 mins',
      desc: `Deep dive with ${bookingUser.name} on process optimization and planning.`,
    },
  ];

  const availableTimeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '11:30 AM',
    '01:30 PM',
    '02:30 PM',
    '03:30 PM',
    '04:30 PM',
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Please enter your full name and email address.', 'error');
      return;
    }

    // 1. Add Appointment to CRM
    addAppointment({
      name: `${name.trim()} — ${meetingType.name}`,
      time: selectedTime,
      type: meetingType.name,
      status: 'Confirmed',
      date: selectedDate,
    });

    // 2. Auto-create Contact if not already existing
    const exists = contacts.some((c) => c.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      addContact({
        name: name.trim(),
        company: company.trim() || 'Booked Client',
        email: email.trim(),
        phone: phone.trim() || '—',
        status: 'Lead',
      });
    }

    setBooked(true);
    showToast(`🎉 Appointment booked with ${bookingUser.name} for ${selectedDate} at ${selectedTime}!`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#0f172a',
        padding: '30px 20px',
      }}
    >
      {/* Header Bar */}
      <header
        style={{
          maxWidth: '1000px',
          margin: '0 auto 30px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo size="lg" lightMode={true} />
        </Link>
        <Link href="/dashboard">
          <Button variant="sm">
            <IconArrowLeft size={16} style={{ marginRight: '4px' }} />
            Return to Dashboard
          </Button>
        </Link>
      </header>

      {/* Main Booking Container */}
      <main
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {!booked ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              minHeight: '560px',
            }}
          >
            {/* Left Sidebar: Host Info & Meeting Type Selector */}
            <div
              style={{
                background: '#faf7f2',
                padding: '32px 28px',
                borderRight: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: bookingUser.avatarColor || '#1D9E75',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {bookingUser.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{bookingUser.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{bookingUser.role} @ LanSan</div>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
                Select Meeting Type
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meetingTypes.map((mt) => {
                  const isSelected = meetingType.id === mt.id;
                  return (
                    <div
                      key={mt.id}
                      onClick={() => setMeetingType(mt)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #1D9E75' : '1px solid #cbd5e1',
                        background: isSelected ? '#e8f8f2' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? '#0F6E56' : '#1e293b' }}>
                        {mt.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        <IconClock size={13} /> {mt.duration} &bull; <IconVideo size={13} /> Google Meet
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '30px', padding: '16px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Selected Details
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '6px', color: '#1D9E75' }}>
                  {meetingType.name}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', lineHeight: 1.4 }}>
                  {meetingType.desc}
                </div>
              </div>
            </div>

            {/* Right Main Form: Date, Time & Details */}
            <div style={{ padding: '32px 36px' }}>
              <form onSubmit={handleBooking}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                  Select Date & Time
                </h2>

                {/* Date & Time Pickers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconCalendar size={15} color="#1D9E75" /> Select Date
                    </div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconClock size={15} color="#1D9E75" /> Available Time Slot
                    </div>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {availableTimeSlots.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts} (EST)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
                  Your Details
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconUser size={15} color="#64748b" /> Full Name *
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconMail size={15} color="#64748b" /> Email Address *
                    </div>
                    <input
                      type="email"
                      placeholder="e.g. sarah@cyberdyne.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconBuilding size={15} color="#64748b" /> Company / Organization
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Cyberdyne Systems"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconPhone size={15} color="#64748b" /> Phone Number
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. (555) 019-2831"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">Meeting Notes / Special Topics</div>
                  <textarea
                    rows={3}
                    placeholder="Please share anything that will help prepare for our meeting..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Button variant="primary" size="lg" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                    Confirm & Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Booking Confirmation State */
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#e8f8f2',
                color: '#1D9E75',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <IconCheck size={40} />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              You're Scheduled!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto 28px auto' }}>
              A calendar invitation with video call details has been sent to <strong>{email}</strong>. {bookingUser.name} will join you at the scheduled time.
            </p>

            <div
              style={{
                maxWidth: '460px',
                margin: '0 auto 32px auto',
                background: '#faf7f2',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#1D9E75', marginBottom: '8px' }}>
                {meetingType.name}
              </div>
              <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <IconCalendar size={16} color="#1D9E75" /> <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>
              </div>
              <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <IconUser size={16} color="#1D9E75" /> {name} ({company || 'Client'})
              </div>
              <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconVideo size={16} color="#1D9E75" /> Google Meet Video Link
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => setBooked(false)}>
                Book Another Meeting
              </Button>
              <Link href="/appointments">
                <Button variant="sm">
                  View in LanSan CRM
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
