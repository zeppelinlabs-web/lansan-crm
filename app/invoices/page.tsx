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
  IconPrinter,
  IconBrandStripe,
  IconCopy,
  IconExternalLink
} from '@tabler/icons-react';
import { Invoice } from '@/lib/types';
import { jsPDF } from 'jspdf';

export default function InvoicesPage() {
  const { invoices, searchQuery, openModal, updateInvoiceStatus, deleteInvoice, showToast, integrations } = useCRM();

  // Check if Stripe is connected
  const stripeIntegration = integrations.find(i => i.name === 'Stripe');
  const isStripeConnected = stripeIntegration?.connected || false;

  // Generate Stripe Payment Link (Ready for Phase 7)
  const handleGeneratePaymentLink = (inv: Invoice) => {
    if (!isStripeConnected) {
      showToast('Please connect Stripe in Integrations to enable payment links.', 'error');
      return;
    }
    
    // TODO: Phase 7 - Call Stripe API to create payment link
    // For now, generate a mock payment link
    const mockPaymentLink = `https://pay.stripe.com/invoice/${inv.id}/preview`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(mockPaymentLink);
    showToast(`💳 Payment link copied! (Connect Stripe in Phase 7 for real links)`, 'info');
  };

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

  // Generate & Print Single Invoice PDF Document
  const handlePrintInvoice = (inv: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to print invoice.', 'error');
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
    showToast(`🖨️ Opening print dialog for Invoice ${inv.id}...`);
  };

  // Download Invoice as PDF (Real PDF file generation using jsPDF)
  const handleDownloadInvoice = async (inv: Invoice) => {
    try {
      const doc = new jsPDF();
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Colors
      const primaryColor = '#1D9E75';
      const darkText = '#0f172a';
      const grayText = '#64748b';
      const lightGray = '#f1f5f9';
      
      // Status colors
      let statusColor = '#d97706';
      let statusBg = '#fef3c7';
      if (inv.status === 'Paid') {
        statusColor = primaryColor;
        statusBg = '#e8f8f2';
      } else if (inv.status === 'Overdue') {
        statusColor = '#dc2626';
        statusBg = '#fee2e2';
      }

      // Load and add company logo
      try {
        const logoImg = new Image();
        logoImg.src = '/images/lansan_crm_logo.png';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
        });
        
        // Add logo image (scaled proportionally)
        const logoHeight = 12;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        doc.addImage(logoImg, 'PNG', 20, 15, logoWidth, logoHeight);
      } catch (error) {
        console.error('Logo loading failed, using fallback:', error);
        // Fallback to letter badge if logo fails to load
        doc.setFillColor(29, 158, 117);
        doc.roundedRect(20, 15, 12, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('L', 26, 24, { align: 'center' });
      }

      // Company Name & Tagline (moved to accommodate logo width)
      doc.setTextColor(15, 23, 42); // darkText
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Lansan CRM', 90, 22);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // grayText
      doc.text('Enterprise Sales & Finance Solutions', 90, 27);

      // Invoice Number & Status (Right Side)
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 158, 117);
      doc.text(inv.id, 200, 22, { align: 'right' });

      // Status Badge
      const statusX = 200 - doc.getTextWidth(inv.status.toUpperCase()) / 2 - 10;
      if (inv.status === 'Paid') {
        doc.setFillColor(232, 248, 242);
        doc.setTextColor(15, 110, 86);
      } else if (inv.status === 'Overdue') {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setFillColor(254, 243, 199);
        doc.setTextColor(217, 119, 6);
      }
      doc.roundedRect(statusX, 26, doc.getTextWidth(inv.status.toUpperCase()) + 8, 6, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(inv.status.toUpperCase(), 200, 30, { align: 'right' });

      // Horizontal Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);

      // Billed To Section (Left)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('BILLED TO', 20, 50);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(inv.client, 20, 57);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(inv.desc, 20, 63);

      // Invoice Details (Right)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('INVOICE DETAILS', 200, 50, { align: 'right' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Issue Date: ${todayStr}`, 200, 57, { align: 'right' });
      doc.text(`Due Date: ${inv.due}`, 200, 63, { align: 'right' });

      // Items Table Header
      const tableTop = 75;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, tableTop, 170, 10, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(20, tableTop + 10, 190, tableTop + 10);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('ITEM DESCRIPTION', 22, tableTop + 6);
      doc.text('QTY', 110, tableTop + 6);
      doc.text('UNIT PRICE', 130, tableTop + 6);
      doc.text('TOTAL AMOUNT', 190, tableTop + 6, { align: 'right' });

      // Table Row
      const rowTop = tableTop + 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(inv.desc, 22, rowTop);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Professional CRM & Account Services', 22, rowTop + 5);

      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text('1', 110, rowTop);
      doc.text(`$${inv.amount.toLocaleString()}`, 130, rowTop);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 110, 86);
      doc.text(`$${inv.amount.toLocaleString()}`, 190, rowTop, { align: 'right' });

      // Bottom Border
      doc.setDrawColor(241, 245, 249);
      doc.line(20, rowTop + 10, 190, rowTop + 10);

      // Totals Section
      const totalsTop = rowTop + 20;
      const totalsX = 135;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal', totalsX, totalsTop);
      doc.text(`$${inv.amount.toLocaleString()}`, 190, totalsTop, { align: 'right' });

      doc.text('Tax (0%)', totalsX, totalsTop + 7);
      doc.text('$0.00', 190, totalsTop + 7, { align: 'right' });

      // Grand Total
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.8);
      doc.line(totalsX, totalsTop + 12, 190, totalsTop + 12);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Total Due', totalsX, totalsTop + 20);
      
      doc.setTextColor(29, 158, 117);
      doc.text(`$${inv.amount.toLocaleString()}`, 190, totalsTop + 20, { align: 'right' });

      // Footer
      const footerTop = 270;
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.3);
      doc.line(20, footerTop, 190, footerTop);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      const footerText = 'Thank you for your business! For payment inquiries, contact finance@lansanconnect.com';
      doc.text(footerText, 105, footerTop + 7, { align: 'center' });

      // Save the PDF
      const fileName = `Invoice_${inv.id}_${inv.client.replace(/\s+/g, '_')}_${todayStr}.pdf`;
      doc.save(fileName);
      
      showToast(`📄 Downloaded ${fileName}`, 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  return (
    <div>
      {/* Stripe Connection Banner (if not connected) */}
      {!isStripeConnected && (
        <div style={{ 
          background: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '12px', 
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IconBrandStripe size={28} color="#635BFF" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '2px' }}>
                Connect Stripe to Accept Payments
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                Enable online payments and automatic invoice status updates when clients pay.
              </div>
            </div>
          </div>
          <a href="/integrations">
            <Button variant="primary" size="sm">
              Connect Stripe
            </Button>
          </a>
        </div>
      )}

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
                    {/* Stripe Payment Link Button */}
                    {inv.status !== 'Paid' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<IconBrandStripe size={14} />}
                        onClick={() => handleGeneratePaymentLink(inv)}
                        title="Generate Stripe Payment Link"
                      >
                        Payment Link
                      </Button>
                    )}
                    
                    <Button
                      variant="default"
                      size="sm"
                      icon={<IconPrinter size={14} />}
                      onClick={() => handlePrintInvoice(inv)}
                      title="Print Invoice"
                    >
                      Print
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      icon={<IconFileTypePdf size={14} />}
                      onClick={() => handleDownloadInvoice(inv)}
                      title="Download Invoice as PDF"
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
