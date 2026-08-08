'use client';

import React, { useState } from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';

export default function PipelinePage() {
  const { deals, contacts, moveDeal, deleteDeal, searchQuery } = useCRM();
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, dealId: number) => {
    e.dataTransfer.setData('text/plain', String(dealId));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation') => {
    e.preventDefault();
    const dealIdStr = e.dataTransfer.getData('text/plain');
    const dealId = parseInt(dealIdStr, 10);
    if (!isNaN(dealId)) {
      moveDeal(dealId, targetStage);
    }
    setDragOverStage(null);
    setDraggedDealId(null);
  };

  return (
    <div>
      <div className="pipeline-cols">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);
          const isOver = dragOverStage === stage;

          return (
            <div
              key={stage}
              className="pipeline-col"
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
              style={{
                border: isOver ? '2px dashed #1D9E75' : '1px solid #e8e8e8',
                background: isOver ? '#f0fdf9' : '#f7f8fa',
                transition: 'all 0.15s ease',
              }}
            >
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
                const displayName = deal.contactName && deal.contactName !== '—' ? deal.contactName : contact?.name;
                const isDragging = draggedDealId === deal.id;

                return (
                  <div
                    key={deal.id}
                    className="deal-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    onDragEnd={() => {
                      setDraggedDealId(null);
                      setDragOverStage(null);
                    }}
                    style={{
                      opacity: isDragging ? 0.4 : 1,
                      cursor: 'grab',
                      transform: isDragging ? 'scale(0.98)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="deal-name">{deal.name}</div>
                      <i className="ti ti-grip-vertical" style={{ color: '#aaa', fontSize: '14px', cursor: 'grab' }}></i>
                    </div>
                    <div className="deal-co">{deal.company}</div>

                    {displayName && (
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                        <i className="ti ti-user" style={{ fontSize: '12px', marginRight: '4px', color: '#0F6E56' }}></i>
                        <span>{displayName}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="deal-amount">${deal.amount.toLocaleString()}</span>
                      <Button
                        variant="danger"
                        style={{ padding: '2px 5px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDeal(deal.id);
                        }}
                        title="Delete deal"
                      >
                        <i className="ti ti-x"></i>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {stageDeals.length === 0 && (
                <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', padding: '30px 0' }}>
                  Drop deal here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
