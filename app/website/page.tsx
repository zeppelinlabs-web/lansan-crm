'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import {
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconChartBar,
  IconCalendarEvent,
  IconBolt,
  IconUsers,
  IconShieldCheck,
  IconStar
} from '@tabler/icons-react';

export default function WebsitePage() {
  const [dealsPerMonth, setDealsPerMonth] = useState<number>(15);
  const [avgDealSize, setAvgDealSize] = useState<number>(12000);

  const estimatedLift = Math.round(dealsPerMonth * avgDealSize * 0.28);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Logo size="lg" />

        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', fontWeight: 600, fontSize: '14px', color: '#475569' }}>
          <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
          <a href="#roi" style={{ textDecoration: 'none', color: 'inherit' }}>ROI Calculator</a>
          <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
          <Link href="/book" style={{ textDecoration: 'none', color: '#1D9E75' }}>Public Booking Page</Link>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard">
            <Button variant="sm">Sign In</Button>
          </Link>
          <Link href="/book">
            <Button variant="primary" size="lg">Book Live Demo</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section
        style={{
          padding: '80px 24px 60px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#e8f8f2',
            color: '#0F6E56',
            fontWeight: 700,
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          <IconSparkles size={16} /> ✨ Next-Gen AI-Powered Sales CRM Platform
        </div>

        <h1
          style={{
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '850px',
            margin: '0 auto 24px auto',
            color: '#0f172a',
          }}
        >
          The AI Sales CRM Built to Convert Leads &amp; Close Deals 3x Faster
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
          }}
        >
          Streamline contact management, drag-and-drop deal pipelines, multi-month scheduling, and automated outreach in one unified enterprise platform.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
          <Link href="/dashboard">
            <Button variant="primary" size="lg" icon={<IconArrowRight size={18} />}>
              Open Lansan CRM App
            </Button>
          </Link>
          <Link href="/book">
            <Button variant="sm" size="lg" icon={<IconCalendarEvent size={18} />}>
              Schedule Demo Call
            </Button>
          </Link>
        </div>

        {/* Hero Image Showcase */}
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.15)',
            border: '1px solid #cbd5e1',
            background: '#0f172a',
          }}
        >
          <img
            src="/images/lansan_crm_hero.png"
            alt="Lansan CRM Dashboard Mockup"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* Feature Grid Section */}
      <section
        id="features"
        style={{
          padding: '80px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>
              Everything Your Sales Team Needs to Scale
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', marginTop: '10px' }}>
              Purpose-built tools designed for speed, consistency, and automated deal execution.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f8f2', color: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <IconChartBar size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Kanban Pipeline &amp; Deal Tracking</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                Drag and drop deals across stages (Lead, Qualified, Proposal, Negotiation) with real-time financial totals.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f8f2', color: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <IconCalendarEvent size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Multi-Month Booking Calendar</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                Seamless multi-month continuous navigation with integrated Calendly-style public booking pages.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f8f2', color: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <IconSparkles size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Lansan AI Assistant</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                AI-driven pipeline audits, email copywriting, and automated task suggestions tuned to your CRM data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '24px',
            padding: '48px',
            color: '#ffffff',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Calculate Your Revenue Growth</h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '8px' }}>
              See how Lansan CRM automations &amp; pipeline tracking boost annual revenue.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                  Deals Closed / Month: <strong>{dealsPerMonth}</strong>
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={dealsPerMonth}
                  onChange={(e) => setDealsPerMonth(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#1D9E75' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                  Average Deal Value: <strong>${avgDealSize.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={avgDealSize}
                  onChange={(e) => setAvgDealSize(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#1D9E75' }}
                />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '16px',
                color: '#0f172a',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Estimated Monthly Revenue Boost
              </div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#1D9E75', margin: '12px 0' }}>
                +${estimatedLift.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Based on a verified 28% average pipeline velocity increase.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '40px 24px', textAlign: 'center', background: '#f8fafc' }}>
        <Logo size="md" />
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
          &copy; 2026 Lansan CRM. All rights reserved. Enterprise Sales Automation &amp; Intelligence.
        </p>
      </footer>
    </div>
  );
}
