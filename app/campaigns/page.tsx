'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconSend, IconTrash, IconBrandGmail, IconAlertCircle } from '@tabler/icons-react';

export default function CampaignsPage() {
  const { campaigns, sendCampaign, deleteCampaign, searchQuery, integrations, showToast } = useCRM();

  // Check if Gmail is connected
  const gmailIntegration = integrations.find(i => i.name === 'Gmail');
  const isGmailConnected = gmailIntegration?.connected || false;

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendCampaign = (campId: number) => {
    if (!isGmailConnected) {
      showToast('Please connect Gmail in Integrations to send campaigns.', 'error');
      return;
    }
    sendCampaign(campId);
  };

  return (
    <div>
      {/* Gmail Connection Banner (if not connected) */}
      {!isGmailConnected && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fca5a5', 
          borderRadius: '12px', 
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IconAlertCircle size={28} color="#dc2626" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b', marginBottom: '2px' }}>
                Gmail Not Connected
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626' }}>
                Connect your Gmail account to send email campaigns with open/click tracking.
              </div>
            </div>
          </div>
          <a href="/integrations">
            <Button variant="primary" size="sm" icon={<IconBrandGmail size={16} />}>
              Connect Gmail
            </Button>
          </a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredCampaigns.map((camp) => {
          const openRate = camp.sent > 0 ? Math.round((camp.opens / camp.sent) * 100) : 0;
          const ctr = camp.opens > 0 ? Math.round((camp.clicks / camp.opens) * 100) : 0;

          return (
            <div key={camp.id} className="campaign-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{camp.name}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{camp.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Pill status={camp.status} />
                  {camp.status === 'Draft' && (
                    <Button
                      variant="primary"
                      className="btn-sm"
                      icon={<IconSend size={14} />}
                      onClick={() => handleSendCampaign(camp.id)}
                    >
                      Send now
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    icon={<IconTrash size={14} />}
                    onClick={() => deleteCampaign(camp.id)}
                  />
                </div>
              </div>

              <div className="campaign-stats">
                <div className="c-stat">
                  <div className="c-stat-val">{camp.sent.toLocaleString()}</div>
                  <div className="c-stat-label">Sent</div>
                </div>
                <div className="c-stat">
                  <div className="c-stat-val">{camp.opens.toLocaleString()}</div>
                  <div className="c-stat-label">Opens</div>
                </div>
                <div className="c-stat">
                  <div className="c-stat-val">{openRate}%</div>
                  <div className="c-stat-label">Open rate</div>
                </div>
                <div className="c-stat">
                  <div className="c-stat-val">{ctr}%</div>
                  <div className="c-stat-label">CTR</div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>
            No campaigns found.
          </div>
        )}
      </div>
    </div>
  );
}
