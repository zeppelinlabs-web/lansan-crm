'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSparkles, IconSend } from '@tabler/icons-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

export default function AIAssistantPage() {
  const { contacts, deals, tasks, automations } = useCRM();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello LaToya! I am Lansan AI, your CRM assistant. How can I help you optimize your sales workflow or draft communications today?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const promptChips = [
    'Summarize pipeline deals',
    'Draft follow-up email',
    'Campaign subject lines',
    'Automation ideas',
    'Invoice reminder email',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal.trim();
    if (!q) return;

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let reply = `I analyzed your CRM data (${contacts.length} contacts, ${deals.length} active deals totaling $${deals.reduce((s, d) => s + d.amount, 0).toLocaleString()}). Here is a customized recommendation for "${q}":\n\n- Recommended Action: Follow up with high-priority leads.\n- Expected Outcome: Increased conversion rate by ~15%.`;

      if (q.toLowerCase().includes('pipeline')) {
        reply = `Pipeline Breakdown:\n- Total Active Deals: ${deals.length}\n- Combined Value: $${deals.reduce((s, d) => s + d.amount, 0).toLocaleString()}\n- Lead Stage: ${deals.filter((d) => d.stage === 'Lead').length} deals\n- Negotiation: ${deals.filter((d) => d.stage === 'Negotiation').length} deals ($${deals.filter((d) => d.stage === 'Negotiation').reduce((s, d) => s + d.amount, 0).toLocaleString()})`;
      } else if (q.toLowerCase().includes('email') || q.toLowerCase().includes('follow')) {
        reply = `Subject: Quick follow-up regarding our recent discussion\n\nHi [First Name],\n\nI wanted to touch base following our conversation regarding [Service/Product]. We are eager to help [Company] achieve its growth goals this quarter.\n\nDo you have 10 minutes available this Thursday for a quick check-in?\n\nBest regards,\nLaToya`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
    }, 400);
  };

  return (
    <div>
      <Card title="Suggested AI Prompts">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid #dbeafe',
                background: '#eff6ff',
                color: '#1e40af',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              <IconSparkles size={14} color="#2563eb" />
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Lansan AI Assistant">
        <div
          style={{
            height: '320px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '12px',
            background: '#fafafa',
            borderRadius: '10px',
            border: '1px solid #e8e8e8',
            marginBottom: '16px',
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#ede9fe',
                      color: '#5b21b6',
                      fontWeight: 700,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    AI
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    background: isUser ? '#e8f8f2' : '#ffffff',
                    color: isUser ? '#0F6E56' : '#111111',
                    border: isUser ? '1px solid #6ee7b7' : '1px solid #e0e0e0',
                  }}
                >
                  {msg.text}
                </div>
                {isUser && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#e8f8f2',
                      color: '#0F6E56',
                      fontWeight: 700,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    LA
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ask Lansan AI anything about your CRM data, templates, or outreach..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Button variant="primary" icon={<IconSend size={16} />} onClick={() => handleSend()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
