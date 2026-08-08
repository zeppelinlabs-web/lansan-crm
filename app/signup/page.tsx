'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/components/providers/CRMProvider';
import { Logo } from '@/components/ui/Logo';
import { IconArrowRight, IconBuilding, IconCheck, IconMail, IconSparkles, IconUser } from '@tabler/icons-react';

export default function SignupPage() {
  const router = useRouter();
  const { showToast, addUser } = useCRM();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [teamSize, setTeamSize] = useState('1-10 members');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      showToast('Please fill in your name and work email.', 'error');
      return;
    }

    setIsLoading(true);

    // Register user in CRM state
    addUser({
      name: fullName,
      email: email,
      role: 'Admin',
    });

    setTimeout(() => {
      showToast(`🎉 Account created for ${fullName} (${company || 'Lansan Account'})! Welcome to Lansan CRM.`);
      router.push('/dashboard');
    }, 600);
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
      {/* Left Pane: Hero */}
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
            <IconSparkles size={16} /> 14-Day Free Trial — No Credit Card Needed
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
            Start scaling your sales pipeline today.
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6 }}>
            Join thousands of sales teams automating lead generation, deals pipelines, PDF invoicing, and customer intelligence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>Full Access to Kanban Pipeline &amp; Lead Board</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>Automated PDF Invoicing &amp; CSV Data Engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <IconCheck size={18} color="#34d399" />
              <span>Built-in AI Assistant Copilot Workspace</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ zIndex: 1, fontSize: '12px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
          &copy; {new Date().getFullYear()} Lansan CRM Inc. SSL Encrypted Registration.
        </div>
      </div>

      {/* Right Pane: Signup Form */}
      <div
        style={{
          background: '#0d1630',
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Create your Lansan CRM Account
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
            Get started in 60 seconds with full admin access.
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <IconUser size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="LaToya Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Work Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <IconMail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="latoya@company.com"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Company Name
                </label>
                <div style={{ position: 'relative' }}>
                  <IconBuilding size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#131e3d',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="1-10 members">1-10 members</option>
                  <option value="11-50 members">11-50 members</option>
                  <option value="51-200 members">51-200 members</option>
                  <option value="200+ members">200+ members</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Create Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
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
              {isLoading ? 'Creating Account...' : <>Complete Signup &amp; Launch CRM <IconArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
              Sign in &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
