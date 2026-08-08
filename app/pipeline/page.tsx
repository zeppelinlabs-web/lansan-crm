'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';

export default function PipelinePage() {
  const { deals, contacts, deleteDeal, searchQuery } = useCRM();

  const stages: ('Lead' | 'Qualified' | 'Proposal' | 'Negotiation')[] = [
    'Lead',
    'Qualified',
    'Proposal',
    'Negotiation',
  ];

  const filteredDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="pipeline-cols">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div key={stage} className="pipeline-col">
              <div className="col-header">
                <span>{stage}</span>
                <span className="col-count">{stageDeals.length}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#0F6E56', fontWeight: 600, marginBottom: '10px' }}>
                ${stageTotal.toLocaleString()} total
              </div>

              {stageDeals.map((deal) => {
                const contact = contacts.find(
                  (c) => c.company.toLowerCase() === deal.company.toLowerCase()
                );

                return (
                  <div key={deal.id} className="deal-card">
                    <div className="deal-name">{deal.name}</div>
                    <div className="deal-co">{deal.company}</div>

                    {contact && (
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                        <i className="ti ti-user" style={{ fontSize: '12px', marginRight: '4px', color: '#0F6E56' }}></i>
                        <span>{contact.name}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="deal-amount">${deal.amount.toLocaleString()}</span>
                      <Button
                        variant="danger"
                        style={{ padding: '2px 5px' }}
                        onClick={() => deleteDeal(deal.id)}
                        title="Delete deal"
                      >
                        <i className="ti ti-x"></i>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {stageDeals.length === 0 && (
                <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                  No deals in stage
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
