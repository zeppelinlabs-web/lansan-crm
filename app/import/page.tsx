'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCRM } from '@/components/providers/CRMProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { IconUpload, IconFileDownload, IconArrowRight, IconCircleCheck, IconTable } from '@tabler/icons-react';

export default function ImportPage() {
  const { addContact, importHistory, addImportHistory } = useCRM();

  const [step, setStep] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('sample_contacts.csv');
  const [importRows, setImportRows] = useState<string[][]>([
    ['Jane Smith', 'Acme Corp', 'jane@acme.com', '(555) 000-0001', 'Lead', 'Website'],
    ['John Doe', 'Beta LLC', 'john@beta.com', '(555) 000-0002', 'Active', 'Referral'],
    ['Robert Vance', 'Vance Refrigeration', 'robert@vance.com', '(555) 111-2222', 'Lead', 'Cold outreach'],
    ['Pam Beesly', 'Dunder Mifflin', 'pam@dundermifflin.com', '(555) 333-4444', 'Active', 'Import'],
    ['Jim Halpert', 'Athlead', 'jim@athlead.com', '(555) 555-6666', 'Lead', 'LinkedIn'],
  ]);

  const headers = ['name', 'company', 'email', 'phone', 'status', 'source'];
  const lansanFields = ['name', 'company', 'email', 'phone', 'status', 'source', 'notes', '— skip —'];

  const [mappings, setMappings] = useState<Record<string, string>>({
    name: 'name',
    company: 'company',
    email: 'email',
    phone: 'phone',
    status: 'status',
    source: 'source',
  });

  const handleDownloadTemplate = () => {
    const csv = 'name,company,email,phone,status,source\nJane Smith,Acme Corp,jane@acme.com,(555)000-0001,Lead,Website\nJohn Doe,Beta LLC,john@beta.com,(555)000-0002,Active,Referral';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lansan_import_template.csv';
    a.click();
  };

  const handleRunImport = () => {
    importRows.forEach((row) => {
      addContact({
        name: row[0] || 'Unknown',
        company: row[1] || '—',
        email: row[2] || '—',
        phone: row[3] || '—',
        status: (row[4] as any) || 'Lead',
      });
    });

    addImportHistory({
      filename: fileName,
      count: importRows.length,
      target: 'Contacts',
      date: new Date().toISOString().split('T')[0],
      status: 'Success',
    });

    setStep(4);
  };

  return (
    <div>
      {/* Wizard Steps Indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { n: 1, label: '1. Upload CSV' },
          { n: 2, label: '2. Column mapping' },
          { n: 3, label: '3. Preview data' },
          { n: 4, label: '4. Done' },
        ].map((st) => (
          <div
            key={st.n}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              background: step === st.n ? '#e8f8f2' : '#ffffff',
              color: step === st.n ? '#0F6E56' : '#888',
              border: step === st.n ? '1px solid #1D9E75' : '1px solid #e8e8e8',
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
            style={{
              border: '2px dashed #d0d0d0',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              background: '#fafafa',
              marginBottom: '16px',
            }}
          >
            <IconUpload size={36} color="#1D9E75" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
              Drag & drop your CSV file here
            </h4>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
              Supports CSV, XLS, XLSX up to 25MB (Unlimited records)
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="primary" onClick={() => setStep(2)}>
                Choose file
              </Button>
              <Button variant="default" icon={<IconFileDownload size={14} />} onClick={handleDownloadTemplate}>
                Download sample CSV
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <Card title={`Step 2: Map columns for "${fileName}"`}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
            Match the columns from your CSV to Lansan CRM contact fields.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {headers.map((h) => (
              <div
                key={h}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#fafafa',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                }}
              >
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: '#111' }}>{h}</span>
                <IconArrowRight size={16} color="#aaa" />
                <select
                  value={mappings[h]}
                  onChange={(e) => setMappings({ ...mappings, [h]: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d0d0d0',
                    fontSize: '13px',
                    flex: 1,
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="default" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
              Continue to preview
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <Card title={`Step 3: Preview records (${importRows.length} total)`}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
            Here is a sample of the first 5 records ready to import into your contacts database.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table>
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="default" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" onClick={handleRunImport}>
              Run import now
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <IconCircleCheck size={48} color="#1D9E75" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>
              Import complete!
            </h3>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>
              Successfully imported <strong>{importRows.length}</strong> contacts into your Lansan CRM database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Button variant="default" onClick={() => setStep(1)}>
                Import another file
              </Button>
              <Link href="/contacts">
                <Button variant="primary" icon={<IconTable size={14} />}>
                  View all contacts
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Import History */}
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">Import history</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Record Count</th>
              <th>Target</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {importHistory.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{row.filename}</td>
                <td>{row.count}</td>
                <td>{row.target}</td>
                <td style={{ color: '#666' }}>{row.date}</td>
                <td>
                  <Pill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
