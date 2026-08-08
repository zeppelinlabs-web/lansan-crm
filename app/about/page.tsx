'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  IconShieldCheck,
  IconUsers,
  IconBuilding,
  IconLock,
  IconArrowRight,
  IconSparkles,
  IconTrophy,
  IconCheck
} from '@tabler/icons-react';

export default function PublicAboutPage() {
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
            <Link href="/about" style={{ color: '#34d399', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              About Us
            </Link>
            <Link href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Contact
            </Link>
            <Link href="/book" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Book Demo
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

      {/* Hero Banner */}
      <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #0b1329 0%, #080d1e 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(29, 158, 117, 0.12)', border: '1px solid rgba(29, 158, 117, 0.3)', color: '#34d399', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
            <IconBuilding size={16} /> Corporate Profile &amp; Platform Mission
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '20px' }}>
            Empowering Lansan Connect Sales Excellence
          </h1>
          <p style={{ fontSize: '17px', color: '#94a3b8', lineHeight: 1.6 }}>
            Lansan CRM is the dedicated enterprise sales management system engineered for high-velocity revenue growth, role-isolated account management, and automated client invoicing.
          </p>
        </div>
      </section>

      {/* Corporate Leadership Team */}
      <section style={{ padding: '60px 24px 80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
            Sales Executive &amp; Management Leadership
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8' }}>
            Role-isolated access ensures each team member operates with complete clarity and focused tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            {
              name: 'LaToya',
              role: 'System Administrator & Executive',
              email: 'latoya@lansanconnect.com',
              avatarColor: '#1D9E75',
              desc: 'Oversees global company operations, financial invoicing revenue, system-wide integrations, and administrative governance.',
            },
            {
              name: 'James Wilson',
              role: 'Sales Manager',
              email: 'j.wilson@lansanconnect.com',
              avatarColor: '#0284c7',
              desc: 'Manages sales team performance, pipeline stage funnels, rep deal assignments, and quarterly revenue target tracking.',
            },
            {
              name: 'Sofia Rodriguez',
              role: 'Senior Sales Agent',
              email: 's.rodriguez@lansanconnect.com',
              avatarColor: '#7c3aed',
              desc: 'Drives direct client acquisition, lead follow-ups, daily appointment scheduling, and personal pipeline closing.',
            },
          ].map((leader, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: leader.avatarColor, color: '#ffffff', fontWeight: 900, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                {leader.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{leader.name}</h3>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>{leader.role}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', fontFamily: 'monospace' }}>{leader.email}</div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{leader.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Infrastructure */}
      <section style={{ padding: '60px 24px 80px 24px', background: '#080d1e', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
              Enterprise Security &amp; Data Isolation
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8' }}>
              Built with bank-grade encryption, local persistence, and role-scoped permissions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Role Data Isolation', desc: 'Each user accesses strictly scoped contacts, deals, and tasks based on their assigned role.' },
              { title: 'Printable PDF Audit', desc: 'Invoice receipts and contract records generate client-side with tamper-proof formatting.' },
              { title: 'Stripe Payment Gateway', desc: 'PCI-DSS compliant credit card processing for client retainer billing and payments.' },
              { title: 'AI Copilot Protection', desc: 'AI queries stay completely private and securely bounded within company CRM context.' },
            ].map((sec, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                <IconShieldCheck size={28} color="#34d399" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{sec.title}</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>&copy; {new Date().getFullYear()} Lansan CRM Inc. Single Company Platform.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact Support</Link>
            <Link href="/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700 }}>Open App &rarr;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
