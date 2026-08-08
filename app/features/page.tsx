'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  IconUsers,
  IconChartBar,
  IconReceipt,
  IconRobot,
  IconBolt,
  IconCalendar,
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconShieldCheck,
  IconDatabaseImport,
  IconMail
} from '@tabler/icons-react';

export default function PublicFeaturesPage() {
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
            <Link href="/features" style={{ color: '#34d399', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Features
            </Link>
            <Link href="/about" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
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

      {/* Hero Header */}
      <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #0b1329 0%, #080d1e 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(29, 158, 117, 0.12)', border: '1px solid rgba(29, 158, 117, 0.3)', color: '#34d399', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
            <IconSparkles size={16} /> Enterprise Platform Capabilities
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '20px' }}>
            Engineered for Modern Corporate Sales Operations
          </h1>
          <p style={{ fontSize: '17px', color: '#94a3b8', lineHeight: 1.6 }}>
            Discover how Lansan CRM unifies account tracking, visual deal pipelines, client invoicing, and AI copilot automation into one unified platform.
          </p>
        </div>
      </section>

      {/* Deep-Dive Feature Modules */}
      <section style={{ padding: '60px 24px 90px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Module 1: Lead Board & Contact DB */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconUsers size={26} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Lead Generation Board &amp; Account DB
              </h2>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                Capture hot, warm, and cold leads dynamically. Contacts added as leads automatically map onto your Kanban Lead Generation board with live score badges and contact details.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Drag-and-drop lead score categorization</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> One-click lead-to-deal pipeline conversion</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Role-isolated account view per sales agent</li>
              </ul>
              <Link href="/leads">
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#ffffff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Explore Lead Board <IconArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '24px', color: '#0f172a', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', marginBottom: '12px' }}>LIVE LEAD BOARD PREVIEW</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1, padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#991b1b' }}>🔥 HOT LEADS (2)</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '6px' }}>Marcus Vance</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Apex Tech • $24,500</div>
                </div>
                <div style={{ flex: 1, padding: '12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#92400e' }}>⚡ WARM LEADS (2)</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '6px' }}>Sarah Connor</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Cyberdyne • $18,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: Invoices & PDF Generator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '24px', color: '#0f172a', boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F6E56', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F6E56' }}>LANSAN CONNECT INC</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>INVOICE #INV-005</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 900, color: '#0F6E56' }}>$12,700.00</div>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>Billed to: <strong>Cyberdyne Systems</strong></div>
              <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#166534' }}>
                <span>Status: Paid via Stripe</span>
                <span>Printable PDF Ready</span>
              </div>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconReceipt size={26} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Corporate PDF Invoicing &amp; Stripe Payments
              </h2>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                Issue branded corporate invoices with sequential auto-numbering (`INV-005`). Export raw invoice CSV data or generate formatted client-side PDF documents with one click.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Auto-generated sequential invoice numbers</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Instant PDF download &amp; client print view</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Bulk CSV export for financial accounting</li>
              </ul>
              <Link href="/invoices">
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#ffffff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  View Invoices <IconArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          {/* Module 3: AI Copilot Assistant */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconRobot size={26} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Context-Aware AI Sales Copilot
              </h2>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                A multi-thread professional chat interface trained directly on your CRM accounts. Ask your AI Copilot to draft personalized outreach emails, analyze deal velocity, or recommend next actions.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Multi-thread conversation history</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> One-click copy email responses to clipboard</li>
                <li><IconCheck size={16} color="#34d399" style={{ marginRight: '8px' }} /> Contextual CRM data understanding</li>
              </ul>
              <Link href="/ai">
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#ffffff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Open AI Assistant <IconArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '14px' }}>
                <IconRobot size={20} color="#a78bfa" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>AI Sales Copilot</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
                &ldquo;Draft a follow-up proposal email for Marcus Vance at Apex Tech highlighting the $24,500 contract value.&rdquo;
              </div>
              <div style={{ background: 'rgba(29, 158, 117, 0.15)', border: '1px solid rgba(29, 158, 117, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#34d399', lineHeight: 1.5 }}>
                ✨ Drafted tailored executive summary email for Marcus Vance. Click &ldquo;Copy Response&rdquo; to send!
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>&copy; {new Date().getFullYear()} Lansan CRM Inc. Single Company Platform.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link>
            <Link href="/dashboard" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700 }}>Open App &rarr;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
