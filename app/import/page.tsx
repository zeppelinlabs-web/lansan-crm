'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import {
  IconUpload,
  IconFileDownload,
  IconArrowRight,
  IconCircleCheck,
  IconTable,
  IconCheck,
  IconFileCheck,
  IconTrash
} from '@tabler/icons-react';

export default function ImportPage() {
  const { addContact, importHistory, addImportHistory, clearImportHistory, deleteImportHistoryRow, showToast } = useCRM();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('sample_contacts.csv');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [headers, setHeaders] = useState<string[]>(['name', 'company', 'email', 'phone', 'status', 'source']);
  const [rawRows, setRawRows] = useState<string[][]>([
    ['Jane Smith', 'Acme Corp', 'jane@acme.com', '(555) 000-0001', 'Lead', 'Website'],
    ['John Doe', 'Beta LLC', 'john@beta.com', '(555) 000-0002', 'Active', 'Referral'],
    ['Robert Vance', 'Vance Refrigeration', 'robert@vance.com', '(555) 111-2222', 'Lead', 'Cold outreach'],
    ['Pam Beesly', 'Dunder Mifflin', 'pam@dundermifflin.com', '(555) 333-4444', 'Active', 'Import'],
    ['Jim Halpert', 'Athlead', 'jim@athlead.com', '(555) 555-6666', 'Lead', 'LinkedIn'],
    ['Michael Scott', 'Michael Scott Paper Co', 'michael@mspc.com', '(555) 777-8888', 'Lead', 'Direct'],
    ['Dwight Schrute', 'Schrute Farms', 'dwight@schrutefarms.com', '(555) 999-0000', 'Active', 'Referral'],
  ]);

  const lansanFields = ['name', 'company', 'email', 'phone', 'status', 'source', '— skip —'];

  const [mappings, setMappings] = useState<Record<string, string>>({
    name: 'name',
    company: 'company',
    email: 'email',
    phone: 'phone',
    status: 'status',
    source: 'source',
  });

  const [targetEntity, setTargetEntity] = useState<string>('Contacts');

  // Parse CSV text string into header array and data rows
  const parseCSVText = (text: string, fileLabel: string) => {
    const lines = text
      .split(/\r\n|\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      showToast('Uploaded CSV file appears to be empty.', 'error');
      return;
    }

    const parseLine = (line: string) => {
      // Split by comma ignoring quotes
      return line.split(',').map((cell) => cell.replace(/^["']|["']$/g, '').trim());
    };

    const parsedHeaders = parseLine(lines[0]);
    const parsedRows = lines.slice(1).map(parseLine).filter((r) => r.length > 0);

    if (parsedHeaders.length === 0 || parsedRows.length === 0) {
      showToast('Could not parse valid records from CSV file.', 'error');
      return;
    }

    setFileName(fileLabel);
    setHeaders(parsedHeaders);
    setRawRows(parsedRows);

    // Auto-map matching field names
    const newMappings: Record<string, string> = {};
    parsedHeaders.forEach((h) => {
      const lower = h.toLowerCase();
      if (lower.includes('name') || lower.includes('contact')) newMappings[h] = 'name';
      else if (lower.includes('company') || lower.includes('org') || lower.includes('business')) newMappings[h] = 'company';
      else if (lower.includes('email') || lower.includes('mail')) newMappings[h] = 'email';
      else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('tel')) newMappings[h] = 'phone';
      else if (lower.includes('status') || lower.includes('stage')) newMappings[h] = 'status';
      else if (lower.includes('source') || lower.includes('origin')) newMappings[h] = 'source';
      else newMappings[h] = '— skip —';
    });

    setMappings(newMappings);
    setStep(2);
    showToast(`📄 Parsed ${parsedRows.length} records from "${fileLabel}"!`);
  };

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        parseCSVText(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (content) {
          parseCSVText(content, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = 'Full Name,Company,Email Address,Phone Number,Status,Source\nJane Smith,Acme Corp,jane@acme.com,(555) 000-0001,Lead,Website\nJohn Doe,Beta LLC,john@beta.com,(555) 000-0002,Active,Referral\nRobert Vance,Vance Refrigeration,robert@vance.com,(555) 111-2222,Lead,Cold outreach';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lansan_contacts_import_template.csv';
    a.click();
    showToast('Downloaded sample CSV template!');
  };

  const handleRunImport = () => {
    // Find mapped column indexes
    const nameIdx = headers.findIndex((h) => mappings[h] === 'name');
    const companyIdx = headers.findIndex((h) => mappings[h] === 'company');
    const emailIdx = headers.findIndex((h) => mappings[h] === 'email');
    const phoneIdx = headers.findIndex((h) => mappings[h] === 'phone');
    const statusIdx = headers.findIndex((h) => mappings[h] === 'status');

    rawRows.forEach((row) => {
      const nameVal = nameIdx !== -1 ? row[nameIdx] : 'Imported Contact';
      const companyVal = companyIdx !== -1 ? row[companyIdx] : '—';
      const emailVal = emailIdx !== -1 ? row[emailIdx] : '—';
      const phoneVal = phoneIdx !== -1 ? row[phoneIdx] : '—';
      const statusVal = statusIdx !== -1 ? row[statusIdx] : 'Lead';

      addContact({
        name: nameVal || 'Imported Contact',
        company: companyVal || '—',
        email: emailVal || '—',
        phone: phoneVal || '—',
        status: (statusVal as any) || 'Lead',
      });
    });

    addImportHistory({
      filename: fileName,
      count: rawRows.length,
      target: targetEntity,
      date: new Date().toISOString().split('T')[0],
      status: 'Success',
    });

    setStep(4);
    showToast(`🚀 Successfully imported ${rawRows.length} contacts into Lansan CRM!`);
  };

  return (
    <div>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Wizard Steps Indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { n: 1, label: '1. Upload CSV' },
          { n: 2, label: '2. Column mapping' },
          { n: 3, label: '3. Preview data' },
          { n: 4, label: '4. Done' },
        ].map((st) => (
          <div
            key={st.n}
            onClick={() => {
              if (st.n < step || (st.n === 2 && rawRows.length > 0) || (st.n === 3 && rawRows.length > 0)) {
                setStep(st.n);
              }
            }}
            style={{
              flex: 1,
              padding: '12px 10px',
              borderRadius: '10px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: step === st.n ? '#e8f8f2' : '#ffffff',
              color: step === st.n ? '#0F6E56' : '#64748b',
              border: step === st.n ? '2px solid #1D9E75' : '1px solid #e2e8f0',
              boxShadow: step === st.n ? '0 4px 12px rgba(29, 158, 117, 0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {st.label}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <Card title="Step 1: Upload CSV file">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px dashed #1D9E75' : '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '50px 20px',
              textAlign: 'center',
              background: isDragging ? '#e8f8f2' : '#fafafa',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <IconUpload size={44} color="#1D9E75" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Drag &amp; drop your CSV file here
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Supports CSV or TXT files up to 25MB (Unlimited records)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose file
              </Button>
              <Button
                variant="default"
                size="lg"
                icon={<IconFileDownload size={16} />}
                onClick={handleDownloadTemplate}
              >
                Download sample CSV
              </Button>
            </div>
          </div>

          {/* Quick Demo Pre-fill Option */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconFileCheck size={20} color="#1D9E75" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Use Lansan Sample Contacts ({rawRows.length} records)</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Test the import workflow instantly with pre-loaded lead data.</div>
              </div>
            </div>
            <Button variant="sm" onClick={() => setStep(2)}>
              Proceed with Sample Data <IconArrowRight size={14} style={{ marginLeft: '4px' }} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <Card title={`Step 2: Map columns for "${fileName}"`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Match the columns from your CSV to Lansan CRM contact fields.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Target entity:</span>
              <select
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}
              >
                <option value="Contacts">Contacts Database</option>
                <option value="Leads">Lead Generation Board</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {headers.map((h) => (
              <div
                key={h}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#f8fafc',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{h}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Sample value: &quot;{rawRows[0]?.[headers.indexOf(h)] || '—'}&quot;
                  </div>
                </div>

                <IconArrowRight size={18} color="#94a3b8" />

                <select
                  value={mappings[h] || '— skip —'}
                  onChange={(e) => setMappings({ ...mappings, [h]: e.target.value })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    flex: 1,
                    background: '#ffffff',
                  }}
                >
                  {lansanFields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="default" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
              Continue to preview <IconArrowRight size={16} style={{ marginLeft: '4px' }} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <Card title={`Step 3: Preview records (${rawRows.length} total)`}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Here is a sample preview of the records ready to import into your Lansan CRM database.
          </p>

          <div className="table-wrap" style={{ marginBottom: '20px' }}>
            <table>
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>
                      {h} <span style={{ fontSize: '11px', color: '#1D9E75', fontWeight: 600 }}>({mappings[h] || 'skip'})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="default" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" onClick={handleRunImport}>
              Run import now ({rawRows.length} records)
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#e8f8f2',
                color: '#1D9E75',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <IconCircleCheck size={40} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Import Complete!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Successfully imported <strong>{rawRows.length}</strong> contacts from <strong>{fileName}</strong> into your Lansan CRM database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Button variant="default" onClick={() => setStep(1)}>
                Import another file
              </Button>
              <Link href="/contacts">
                <Button variant="primary" icon={<IconTable size={16} />}>
                  View all contacts
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Import History Table */}
      <div className="table-wrap" style={{ marginTop: '24px' }}>
        <div className="table-head">
          <div className="table-head-title">Import history ({importHistory.length})</div>
          {importHistory.length > 0 && (
            <Button
              variant="danger"
              icon={<IconTrash size={14} />}
              onClick={clearImportHistory}
              title="Clear all import history logs"
            >
              Clear history
            </Button>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Record Count</th>
              <th>Target</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {importHistory.map((row, idx) => (
              <tr key={`history-row-${idx}`}>
                <td style={{ fontWeight: 600 }}>{row.filename}</td>
                <td>{row.count}</td>
                <td>{row.target}</td>
                <td style={{ color: '#666' }}>{row.date}</td>
                <td>
                  <Pill status={row.status} />
                </td>
                <td>
                  <Button
                    variant="danger"
                    icon={<IconTrash size={12} />}
                    onClick={() => deleteImportHistoryRow(idx)}
                    title="Delete record from history"
                  />
                </td>
              </tr>
            ))}
            {importHistory.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No import history logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
