'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  IconFileDownload,
  IconFileTypePdf,
  IconPlus,
  IconTrash,
  IconReceipt,
  IconCheck,
  IconAlertCircle,
  IconPrinter
} from '@tabler/icons-react';
import { Invoice } from '@/lib/types';

export default function InvoicesPage() {
  const { invoices, searchQuery, openModal, updateInvoiceStatus, deleteInvoice, showToast } = useCRM();

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial Stats
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalOutstanding = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  // Download All Invoices CSV
  const handleExportInvoicesCSV = () => {
    if (invoices.length === 0) {
      showToast('No invoices to export.', 'info');
      return;
    }

    const headers = 'Invoice #,Client Name,Description,Amount ($),Due Date,Status\n';
    const rows = invoices
      .map((i) => `"${i.id}","${i.client}","${i.desc}",${i.amount},"${i.due}","${i.status}"`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lansan_invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast(`📄 Exported ${invoices.length} invoices to CSV!`);
  };

  // Generate & Print / Save Single Invoice PDF Document
  const handleDownloadInvoicePDF = (inv: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to generate invoice PDF.', 'error');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const statusColor = inv.status === 'Paid' ? '#0F6E56' : inv.status === 'Overdue' ? '#dc2626' : '#d97706';
    const statusBg = inv.status === 'Paid' ? '#e8f8f2' : inv.status === 'Overdue' ? '#fee2e2' : '#fef3c7';

    const pdfHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${inv.id} — ${inv.client}</title>
          <style>
            body {
              font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
              margin: 0;
              padding: 40px;
              color: #0f172a;
              background: #ffffff;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 40px;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.05);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 24px;
              margin-bottom: 30px;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .logo-badge {
              background: #1D9E75;
              color: white;
              font-weight: 900;
              font-size: 20px;
              padding: 10px 14px;
              border-radius: 10px;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }
            .brand-sub {
              font-size: 12px;
              color: #64748b;
            }
            .inv-title {
              text-align: right;
            }
            .inv-id {
              font-size: 24px;
              font-weight: 900;
              color: #1D9E75;
              font-family: monospace;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              margin-top: 8px;
              background: ${statusBg};
              color: ${statusColor};
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 36px;
            }
            .section-title {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #94a3b8;
              margin-bottom: 6px;
            }
            .client-name {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
            }
            .client-desc {
              font-size: 13px;
              color: #64748b;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #f8fafc;
              text-align: left;
              padding: 12px 16px;
              font-size: 12px;
              font-weight: 700;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
            }
            td {
              padding: 16px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 14px;
              color: #334155;
            }
            .text-right {
              text-align: right;
            }
            .totals-table {
              width: 320px;
              margin-left: auto;
              margin-bottom: 40px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
              color: #64748b;
            }
            .totals-grand {
              font-size: 20px;
              font-weight: 900;
              color: #0f172a;
              border-top: 2px solid #0f172a;
              padding-top: 12px;
              margin-top: 8px;
            }
            .footer {
              border-top: 1px solid #f1f5f9;
              padding-top: 24px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
            }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="brand">
                <div class="logo-badge">L</div>
                <div>
                  <div class="brand-name">Lansan CRM</div>
                  <div class="brand-sub">Enterprise Sales & Finance Solutions</div>
                </div>
              </div>
              <div class="inv-title">
                <div class="inv-id">${inv.id}</div>
                <div class="status-badge">${inv.status}</div>
              </div>
            </div>

            <div class="details-grid">
              <div>
                <div class="section-title">Billed To</div>
                <div class="client-name">${inv.client}</div>
                <div class="client-desc">${inv.desc}</div>
              </div>
              <div class="text-right">
                <div class="section-title">Invoice Details</div>
                <div style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Issue Date:</strong> ${todayStr}</div>
                <div style="font-size: 13px; color: #475569;"><strong>Due Date:</strong> ${inv.due}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th class="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${inv.desc}</strong>
                    <div style="font-size: 12px; color: #64748b;">Professional CRM & Account Services</div>
                  </td>
                  <td>1</td>
                  <td>$${inv.amount.toLocaleString()}</td>
                  <td class="text-right" style="font-weight: 800; color: #0F6E56;">$${inv.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals-table">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>$${inv.amount.toLocaleString()}</span>
              </div>
              <div class="totals-row">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div class="totals-row totals-grand">
                <span>Total Due</span>
                <span style="color: #1D9E75;">$${inv.amount.toLocaleString()}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for your business! For payment inquiries, contact finance@lansanconnect.com
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(pdfHTML);
    printWindow.document.close();
    showToast(`📄 Generating PDF document for Invoice ${inv.id}...`);
  };

  return (
    <div>
      {/* Financial Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconReceipt size={22} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Billed</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>${totalBilled.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e8f8f2', color: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Paid Revenue</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1D9E75' }}>${totalPaid.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconAlertCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Outstanding Balance</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>${totalOutstanding.toLocaleString()}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Invoices Table */}
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">
            All Invoices (<span id="inv-count">{filteredInvoices.length}</span>)
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="default"
              icon={<IconFileDownload size={16} />}
              onClick={handleExportInvoicesCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={<IconPlus size={16} />}
              onClick={() => openModal('addInvoice')}
            >
              Create invoice
            </Button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv, idx) => (
              <tr key={`inv-${inv.id}-${idx}`}>
                <td style={{ color: '#1e40af', fontWeight: 700, fontFamily: 'monospace' }}>{inv.id}</td>
                <td>
                  <strong>{inv.client}</strong>
                </td>
                <td style={{ color: '#64748b' }}>{inv.desc}</td>
                <td style={{ fontWeight: 800, color: '#0F6E56' }}>${inv.amount.toLocaleString()}</td>
                <td style={{ color: '#64748b' }}>{inv.due}</td>
                <td>
                  <select
                    value={inv.status}
                    onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: inv.status === 'Paid' ? '#e8f8f2' : inv.status === 'Overdue' ? '#fee2e2' : '#f1f5f9',
                      color: inv.status === 'Paid' ? '#0F6E56' : inv.status === 'Overdue' ? '#991b1b' : '#334155',
                    }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      variant="default"
                      size="sm"
                      icon={<IconFileTypePdf size={14} />}
                      onClick={() => handleDownloadInvoicePDF(inv)}
                      title="Download/Print Invoice PDF Document"
                    >
                      PDF
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<IconTrash size={14} />}
                      onClick={() => deleteInvoice(inv.id)}
                      title="Delete invoice"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>
                  No invoices found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
