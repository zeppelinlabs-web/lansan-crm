'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/components/providers/CRMProvider';
import { Logo } from '@/components/ui/Logo';
import { IconArrowRight, IconEye, IconEyeOff, IconLock, IconMail, IconSparkles, IconCheck } from '@tabler/icons-react';

export default function LoginPage() {
  const router = useRouter();
  const { showToast, switchUser } = useCRM();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your work email.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      showToast(`Welcome back, ${email.split('@')[0]}! Logged into Lansan CRM.`);
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickDemoLogin = (demoRole: 'Admin' | 'Manager' | 'Agent') => {
    setIsLoading(true);
    let userId = 1;
    let demoName = 'LaToya';

    if (demoRole === 'Manager') {
      userId = 2;
      demoName = 'James Wilson';
    } else if (demoRole === 'Agent') {
      userId = 3;
      demoName = 'Sofia Rodriguez';
    }

    switchUser(userId);

    setTimeout(() => {
      showToast(`⚡ Signed in as ${demoName} (${demoRole})!`);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: '#0b1329',
        color: '#ffffff',
      }}
    >
      {/* Left Pane: Branding & Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #080d1e 100%)',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(29, 158, 117, 0.2) 0%, rgba(11, 19, 41, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo Header */}
        <Link href="/" style={{ textDecoration: 'none', zIndex: 1 }}>
          <Logo size="lg" lightMode={true} />
        </Link>

        {/* Hero Copy */}
        <div style={{ zIndex: 1, margin: '40px 0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(29, 158, 117, 0.12)',
              border: '1px solid rgba(29, 158, 117, 0.3)',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <IconSparkles size={16} /> Enterprise Sales Authentication Portal
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
            Welcome back to your Sales Command Center.
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6 }}>
            Track revenue pipelines, generate client invoices, automate lead campaigns, and query your AI Assistant.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>Real-time Lead Board &amp; Kanban Deal Sync</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>Printable PDF Invoices &amp; Stripe Billing Integration</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>AI Copilot Trained on Corporate Accounts</span>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div style={{ zIndex: 1, fontSize: '12px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
          &copy; {new Date().getFullYear()} Lansan CRM Inc. Security Verified &amp; Encrypted.
        </div>
      </div>

      {/* Right Pane: Form */}
      <div
        style={{
          background: '#0d1630',
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Sign in to Lansan CRM
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
            Enter your credentials or click a quick demo login account below.
          </p>

          {/* Quick Demo Login Bar */}
          <div
            style={{
              background: 'rgba(29, 158, 117, 0.08)',
              border: '1px solid rgba(29, 158, 117, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ One-Click Demo Sign In
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Admin')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  background: '#1D9E75',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                LaToya (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Manager')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                James (Manager)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Agent')}
                style={{
                  padding: '10px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(192, 132, 252, 0.4)',
                  background: 'rgba(124, 58, 237, 0.3)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Sofia (Agent)
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Work Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <IconMail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="latoya@lansanconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                  Password
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to email.', 'info'); }} style={{ fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <IconLock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
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
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Signing in...' : <>Sign in to Dashboard <IconArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#94a3b8' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
              Create an account free &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
