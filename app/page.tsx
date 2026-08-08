'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconChartBar,
  IconUsers,
  IconReceipt,
  IconBolt,
  IconCalendar,
  IconRobot,
  IconShieldCheck
} from '@tabler/icons-react';

export default function PublicLandingPage() {
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
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Official Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="md" lightMode={true} />
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/features" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Features
            </Link>
            <Link href="/about" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              About Us
            </Link>
            <Link href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Contact
            </Link>
            <Link href="/book" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              Book Meeting
            </Link>
          </nav>

          {/* Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login">
              <button
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(29, 158, 117, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                Launch Platform
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '90px 24px 70px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(29, 158, 117, 0.18) 0%, rgba(11, 19, 41, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(29, 158, 117, 0.12)',
              border: '1px solid rgba(29, 158, 117, 0.3)',
              color: '#34d399',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            <IconSparkles size={16} /> Enterprise Sales &amp; AI Automation Platform
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              marginBottom: '24px',
            }}
          >
            LanSan Internal CRM System — <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #1D9E75 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Sales Hub</span>
          </h1>

          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '36px', maxWidth: '720px', margin: '0 auto 36px auto' }}>
            The internal sales command center for LanSan company. Our team uses this platform to manage lead generation, track deal pipelines, generate invoices, and automate customer outreach workflows.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <button
                style={{
                  padding: '16px 36px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(29, 158, 117, 0.4)',
                }}
              >
                Launch CRM Workspace <IconArrowRight size={18} />
              </button>
            </Link>
            <Link href="/book">
              <button
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <IconCalendar size={18} /> Schedule Meeting
              </button>
            </Link>
          </div>

          {/* Proof points */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCheck size={16} color="#34d399" /> Role-based team access
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCheck size={16} color="#34d399" /> Internal company tool
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCheck size={16} color="#34d399" /> PDF Invoicing &amp; AI Assistant
            </span>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div style={{ maxWidth: '1050px', margin: '60px auto 0 auto', position: 'relative' }}>
          <div
            style={{
              borderRadius: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                borderRadius: '12px',
                background: '#ffffff',
                padding: '16px',
                textAlign: 'left',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginLeft: '12px' }}>Lansan CRM — Executive Control Center</span>
                </div>
                <Link href="/dashboard">
                  <span style={{ fontSize: '12px', color: '#1D9E75', fontWeight: 700, textDecoration: 'none' }}>Live Workspace &rarr;</span>
                </Link>
              </div>

              <img
                src="/images/lansan_crm_hero.png"
                alt="Lansan CRM Executive Control Center Hero Preview"
                style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '80px 24px', background: '#080d1e' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
              Everything Our Sales Team Uses Daily
            </h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto' }}>
              Purpose-built to streamline our team's lead acquisition, pipeline management, and client invoicing workflows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: <IconUsers size={28} color="#34d399" />,
                title: 'Team Contacts Database',
                desc: 'Organize client contacts with custom lead scores, statuses, activity timelines, and real-time sync across our team.',
                link: '/contacts',
              },
              {
                icon: <IconChartBar size={28} color="#60a5fa" />,
                title: 'Sales Pipeline Board',
                desc: 'Track deals across stages (Lead, Qualified, Proposal, Negotiation) with automated value totals for our team.',
                link: '/pipeline',
              },
              {
                icon: <IconReceipt size={28} color="#f59e0b" />,
                title: 'Invoice Generator',
                desc: 'Issue sequential client invoices with auto-numbering, payment tracking, and PDF document generation.',
                link: '/invoices',
              },
              {
                icon: <IconRobot size={28} color="#a78bfa" />,
                title: 'AI Sales Assistant',
                desc: 'Internal AI assistant trained on our CRM data to generate follow-up emails, answer queries, and analyze leads.',
                link: '/ai',
              },
              {
                icon: <IconBolt size={28} color="#f43f5e" />,
                title: 'Workflow Automations',
                desc: 'Trigger automated welcome emails, Slack alerts, and pipeline updates without manual work from our team.',
                link: '/automations',
              },
              {
                icon: <IconCalendar size={28} color="#38bdf8" />,
                title: 'Team Booking Pages',
                desc: 'Each team member gets a personalized booking link for clients to schedule video calls and discovery meetings.',
                link: '/book',
              },
            ].map((f, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>{f.desc}</p>
                <Link href={f.link} style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Explore feature <IconArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        MULTI-TENANT PRICING PREPARATION (COMMENTED OUT FOR SINGLE COMPANY SCOPE)
        ========================================================================
        <section id="pricing" style={{ padding: '90px 24px', background: '#0b1329' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
              Transparent Pricing for Every Growth Stage
            </h2>
            ...
          </div>
        </section>
      */}

      {/* Public Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>&copy; {new Date().getFullYear()} LanSan Company. Internal CRM Platform.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Team Sign In</Link>
            <Link href="/signup" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register Account</Link>
            <Link href="/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700 }}>Launch CRM &rarr;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
