'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';
import {
  IconSparkles,
  IconSend,
  IconPlus,
  IconMessage,
  IconCopy,
  IconCheck,
  IconTrash,
  IconBulb,
  IconChartBar,
  IconMail,
  IconBolt,
  IconReceipt,
  IconRobot
} from '@tabler/icons-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  category?: string;
}

interface ChatThread {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export default function AIAssistantPage() {
  const { contacts, deals, tasks, automations, showToast, addTask } = useCRM();

  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      title: 'Pipeline Deal Audit & Forecast',
      date: 'Today, 02:45 PM',
      messages: [
        {
          id: 1,
          sender: 'bot',
          text: 'Hello LaToya! I am Lansan AI, your CRM Sales Intelligence Assistant.\n\nI have real-time access to your 4 active contacts, $76,700 pipeline deals, and automated workflows. How can I help you accelerate conversions today?',
          time: '02:45 PM',
        },
      ],
    },
    {
      id: 'thread-2',
      title: 'Draft Follow-up for Summit Group',
      date: 'Yesterday',
      messages: [
        {
          id: 101,
          sender: 'user',
          text: 'Draft a follow-up email for Daria Rowe at Summit Group regarding contract renewal.',
          time: '04:12 PM',
        },
        {
          id: 102,
          sender: 'bot',
          text: 'Subject: Summit Group Contract Renewal — Next Steps\n\nHi Daria,\n\nI hope you are having a productive week! Following our recent discussion regarding the contract renewal for Summit Group ($18,200 deal value), I wanted to confirm if you had any questions on the proposal schedule.\n\nWould Thursday at 10:00 AM work for a brief 15-minute call to finalize the agreement?\n\nBest regards,\nLaToya',
          time: '04:13 PM',
        },
      ],
    },
    {
      id: 'thread-3',
      title: 'Automation & Lead Scoring Strategy',
      date: 'June 4, 2026',
      messages: [
        {
          id: 201,
          sender: 'bot',
          text: 'AI Recommendation: Enable automatic email triggers when leads reach "Hot" score tag on the Lead Generation board.',
          time: '01:00 PM',
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentThread.messages, isTyping]);

  const promptChips = [
    { icon: <IconChartBar size={14} />, text: 'Summarize pipeline deals' },
    { icon: <IconMail size={14} />, text: 'Draft follow-up email' },
    { icon: <IconBulb size={14} />, text: 'Campaign subject lines' },
    { icon: <IconBolt size={14} />, text: 'Automation ideas' },
    { icon: <IconReceipt size={14} />, text: 'Invoice reminder email' },
  ];

  const handleNewChat = () => {
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New AI Conversation',
      date: 'Just now',
      messages: [
        {
          id: Date.now(),
          sender: 'bot',
          text: 'Hello LaToya! I am Lansan AI. Ask me to audit your pipeline, generate cold emails, or automate CRM tasks.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    showToast('New AI Chat session started.');
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = (overrideText || inputVal).trim();
    if (!textToSend) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: timeStr,
    };

    // Update active thread with user message
    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThreadId) {
          const isFirstUserMsg = t.messages.filter((m) => m.sender === 'user').length === 0;
          return {
            ...t,
            title: isFirstUserMsg ? textToSend.slice(0, 32) + (textToSend.length > 32 ? '...' : '') : t.title,
            messages: [...t.messages, userMsg],
          };
        }
        return t;
      })
    );

    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      const lower = textToSend.toLowerCase();

      const totalPipeline = deals.reduce((sum, d) => sum + d.amount, 0);

      if (lower.includes('pipeline') || lower.includes('deal') || lower.includes('summarize')) {
        replyText = `📊 **Lansan CRM Pipeline Summary & Forecast**\n\n- **Total Active Deals**: ${deals.length} deals\n- **Total Pipeline Value**: $${totalPipeline.toLocaleString()}\n\n**Stage Breakdown**:\n` +
          deals.map((d) => `  • **${d.name}** (${d.company}): $${d.amount.toLocaleString()} in *${d.stage}* stage`).join('\n') +
          `\n\n💡 **AI Recommendation**: Daria Rowe (Summit Group) is in Negotiation ($18,200). Focus follow-up effort here to close this month!`;
      } else if (lower.includes('email') || lower.includes('draft') || lower.includes('follow')) {
        replyText = `✉️ **Generated Sales Email Draft**\n\n**Subject**: Quick follow-up regarding our CRM partnership\n\nHi Daria,\n\nI hope your week is off to a great start! Following up on our contract proposal for Summit Group ($18,200), I wanted to see if your team had a chance to review the terms.\n\nWe can have your onboarding scheduled for next Tuesday. Do you have 10 minutes open tomorrow for a quick call?\n\nBest regards,\nLaToya\nLansan CRM Team`;
      } else if (lower.includes('automation') || lower.includes('rule')) {
        replyText = `⚡ **Suggested CRM Automation Rules**\n\n1. **High-Value Deal Alert**: When a deal over $20,000 moves to Proposal, automatically create a high-priority task for team review.\n2. **Lead Re-engagement**: Automatically send email template #2 if no activity occurs for 7 days.\n3. **Overdue Invoice Escalation**: Auto-trigger payment reminder 3 days past due date.`;
      } else {
        replyText = `🤖 **Lansan AI Analysis**:\n\nBased on your CRM data (${contacts.length} contacts, ${tasks.length} tasks, ${automations.length} automation rules):\n\n- I recommend prioritizing high-score Warm and Hot leads on the Lead Board.\n- Would you like me to auto-generate follow-up tasks or draft campaign copy for this outreach?`;
      }

      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setThreads((prevThreads) =>
        prevThreads.map((t) =>
          t.id === activeThreadId ? { ...t, messages: [...t.messages, botMsg] } : t
        )
      );
      setIsTyping(false);
    }, 650);
  };

  const copyMessage = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createFollowUpTaskFromAI = (text: string) => {
    addTask({
      text: `AI Action Item: ${text.slice(0, 45)}...`,
      due: new Date().toISOString().split('T')[0],
      priority: 'High',
    });
    showToast('✅ High-priority Task created from AI recommendation!');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '16px',
        height: 'calc(100vh - 120px)',
        minHeight: '620px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
      }}
    >
      {/* Left Chat Sidebar (Threads & History) */}
      <div
        style={{
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ padding: '16px' }}>
          <Button
            variant="primary"
            icon={<IconPlus size={16} />}
            onClick={handleNewChat}
            style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}
          >
            New AI Chat
          </Button>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}
          >
            Recent Conversations
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '420px' }}>
            {threads.map((t) => {
              const isSelected = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? '#e8f8f2' : 'transparent',
                    color: isSelected ? '#0F6E56' : '#334155',
                    border: isSelected ? '1px solid #6ee7b7' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <IconMessage size={16} color={isSelected ? '#1D9E75' : '#94a3b8'} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {t.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
            }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Lansan AI Engine</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>v4.5 Turbo &bull; Connected</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
        {/* Chat Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(29, 158, 117, 0.25)',
              }}
            >
              <IconSparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{currentThread.title}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Real-time CRM Data & Analytics Context</div>
            </div>
          </div>

          <Button
            variant="sm"
            icon={<IconTrash size={14} />}
            onClick={() => {
              setThreads((prev) =>
                prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [] } : t))
              );
              showToast('Chat history cleared.');
            }}
          >
            Clear Thread
          </Button>
        </div>

        {/* Scrollable Message History */}
        <div
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: '#fafafb',
          }}
        >
          {currentThread.messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      boxShadow: '0 2px 8px rgba(29, 158, 117, 0.3)',
                      flexShrink: 0,
                    }}
                  >
                    <IconRobot size={18} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      background: isUser ? '#1D9E75' : '#ffffff',
                      color: isUser ? '#ffffff' : '#0f172a',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      boxShadow: isUser
                        ? '0 4px 14px rgba(29, 158, 117, 0.25)'
                        : '0 2px 8px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Message Action Bar */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.time}</span>
                    {!isUser && (
                      <>
                        <button
                          onClick={() => copyMessage(msg.id, msg.text)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {copiedId === msg.id ? <IconCheck size={12} color="#10b981" /> : <IconCopy size={12} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => createFollowUpTaskFromAI(msg.text)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1D9E75',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          + Create Task
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    LA
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconSparkles size={18} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '16px 16px 16px 2px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span className="dot-typing">Lansan AI is analyzing your CRM data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input Control */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
          {/* Quick Prompt Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
            {promptChips.map((chip) => (
              <button
                key={chip.text}
                onClick={() => handleSend(chip.text)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e8f8f2';
                  e.currentTarget.style.color = '#0F6E56';
                  e.currentTarget.style.borderColor = '#6ee7b7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {chip.icon}
                <span>{chip.text}</span>
              </button>
            ))}
          </div>

          {/* Input Field Bar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask Lansan AI to audit pipeline, write email copy, or trigger automations..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '12px 18px',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
              }}
            />
            <Button
              variant="primary"
              size="lg"
              icon={<IconSend size={18} />}
              onClick={() => handleSend()}
              style={{ borderRadius: '12px' }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
