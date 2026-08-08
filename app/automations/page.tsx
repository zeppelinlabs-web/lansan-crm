'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { IconBolt, IconTrash, IconChartBar, IconReceipt } from '@tabler/icons-react';

export default function AutomationsPage() {
  const {
    automations,
    toggleAutomation,
    deleteAutomation,
    automationLogs,
    searchQuery,
  } = useCRM();

  const filteredAutomations = automations.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRuleIcon = (iconStr: string) => {
    if (iconStr === 'ti-chart-bar') return <IconChartBar size={18} color="#0F6E56" />;
    if (iconStr === 'ti-receipt') return <IconReceipt size={18} color="#991b1b" />;
    return <IconBolt size={18} color="#92400e" />;
  };

  return (
    <div>
      <Card title="Active automation workflows">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredAutomations.map((auto) => (
            <div key={auto.id} className="auto-rule">
              <div className="auto-icon" style={{ background: auto.color }}>
                {getRuleIcon(auto.icon)}
              </div>
              <div className="auto-info">
                <div className="auto-name">{auto.name}</div>
                <div className="auto-desc">
                  <strong>When:</strong> {auto.trigger} <br />
                  <strong>Then:</strong> {auto.action}
                </div>
              </div>
              <Toggle on={auto.on} onToggle={() => toggleAutomation(auto.id)} />
              <Button
                variant="danger"
                icon={<IconTrash size={14} />}
                onClick={() => deleteAutomation(auto.id)}
              />
            </div>
          ))}
          {filteredAutomations.length === 0 && (
            <div style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
              No automation rules found.
            </div>
          )}
        </div>
      </Card>

      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">Automation execution audit log</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Triggered By</th>
              <th>Action Taken</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {automationLogs.map((log) => (
              <tr key={log.id}>
                <td>
                  <strong>{log.rule}</strong>
                </td>
                <td>{log.triggeredBy}</td>
                <td style={{ color: '#666' }}>{log.actionTaken}</td>
                <td style={{ color: '#888', fontSize: '11px' }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
