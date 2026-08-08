'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useCRM } from '@/components/providers/CRMProvider';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconSend,
  IconCalendar,
  IconCheck,
  IconSparkles
} from '@tabler/icons-react';

export default function PublicContactPage() {
  const { showToast } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill in your name and email address.', 'error');
      return;
    }
    setSubmitted(true);
    showToast(`📩 Thank you, ${name}! Your inquiry has been sent to the LanSan team.`);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#0f172a', background: '#0b1329', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(11, 19, 41, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="md" lightMode={true} />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Home
            </Link>
            <Link href="/features" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Features
            </Link>
            <Link href="/about" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              About Us
            </Link>
            <Link href="/contact" style={{ color: '#34d399', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Contact
            </Link>
            <Link href="/book" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Book Meeting
            </Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login">
              <button style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Sign In
              </button>
            </Link>
            <Link href="/dashboard">
              <button style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(29, 158, 117, 0.4)' }}>
                Launch Platform
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Contact Layout */}
      <section style={{ padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(29, 158, 117, 0.12)', border: '1px solid rgba(29, 158, 117, 0.3)', color: '#34d399', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
            <IconMail size={16} /> Get In Touch
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
            Contact LanSan Team
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about our CRM features, user access, or need technical support? We're here to help.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Left Column: Contact Form */}
          <div style={{ background: '#0d1630', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '20px' }}>
              Send an Inquiry
            </h2>

            {submitted ? (
              <div style={{ background: 'rgba(29, 158, 117, 0.12)', border: '1px solid rgba(29, 158, 117, 0.4)', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#34d399' }}>
                <IconCheck size={40} style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Inquiry Submitted!</h3>
                <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
                  Thank you, <strong>{name}</strong>. A LanSan team member will get back to you shortly at <strong>{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="LaToya Admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="support@lansan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Lansan Connect Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Message / Request Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can assist your sales team..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(29, 158, 117, 0.4)',
                  }}
                >
                  <IconSend size={18} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '20px' }}>
                Corporate Contact Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconMail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Email Support</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>support@lansan.com</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconPhone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Phone / Sales Hotline</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>(555) 019-2834</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconMapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Corporate Headquarters</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#cbd5e1' }}>100 LanSan Plaza, Suite 400<br />New York, NY 10001</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)', borderRadius: '20px', padding: '32px', color: '#ffffff', boxShadow: '0 8px 24px rgba(29, 158, 117, 0.3)' }}>
              <IconCalendar size={32} style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Schedule a Meeting with Our Team</h3>
              <p style={{ fontSize: '14px', color: '#e8f8f2', lineHeight: 1.5, marginBottom: '20px' }}>
                Book a time to meet with a LanSan team member directly on their calendar.
              </p>
              <Link href="/book">
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ffffff', color: '#0F6E56', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
                  View Team Calendar &rarr;
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>&copy; {new Date().getFullYear()} LanSan Company. Internal CRM Platform.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Team Sign In</Link>
            <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link>
            <Link href="/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700 }}>Launch CRM &rarr;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
