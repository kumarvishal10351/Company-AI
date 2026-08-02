const safeStr = (val, fallback = 'N/A') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val.trim() || fallback;
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : fallback;
  return String(val);
};

export async function generatePDF(report) {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF('p', 'mm', 'a4');
  const W = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = W - margin * 2;
  let y = 15;

  const colors = {
    accent: [82, 141, 255],
    accentSecondary: [79, 219, 200],
    dark: [14, 19, 35],
    cardBg: [22, 27, 43],
    text: [222, 225, 249],
    muted: [140, 144, 159],
    white: [255, 255, 255],
    error: [255, 180, 171],
  };

  // Background
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), 'F');

  // Header top accent line
  doc.setFillColor(...colors.accent);
  doc.rect(0, 0, W, 6, 'F');

  // Document Title
  y = 18;
  doc.setFontSize(8);
  doc.setTextColor(...colors.muted);
  doc.text('RELU CONSULTANCY SYNTHESIS REPORT', margin, y);

  y += 8;
  doc.setFontSize(20);
  doc.setTextColor(...colors.white);
  doc.text(safeStr(report?.companyName, 'Company Research'), margin, y);

  // Company info card
  y += 10;
  doc.setFillColor(...colors.cardBg);
  doc.roundedRect(margin, y, contentW, 40, 3, 3, 'F');

  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(...colors.accent);
  doc.text('COMPANY METADATA & CONTACT', margin + 6, y);

  y += 7;
  doc.setFontSize(9);
  const infoRows = [
    ['Website:', safeStr(report?.website)],
    ['Industry:', safeStr(report?.industry)],
    ['Phone:', safeStr(report?.phone, 'Not publicly listed')],
    ['Address:', safeStr(report?.address, 'Not publicly listed')],
    ['Emails:', safeStr(report?.emails, 'Not listed')],
  ];

  for (const [lbl, val] of infoRows) {
    doc.setTextColor(...colors.muted);
    doc.text(lbl, margin + 6, y);
    doc.setTextColor(...colors.white);
    const splitVal = doc.splitTextToSize(val, contentW - 40);
    doc.text(splitVal[0] || 'N/A', margin + 32, y);
    y += 5.5;
  }

  // Executive Summary
  y += 6;
  if (y > 240) { addPage(doc, colors); y = 18; }
  doc.setFontSize(9);
  doc.setTextColor(...colors.accent);
  doc.text('EXECUTIVE SUMMARY', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  const summaryText = safeStr(report?.summary, 'No summary text available.');
  const summaryLines = doc.splitTextToSize(summaryText, contentW);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 6;

  // Products & Services
  if (y > 230) { addPage(doc, colors); y = 18; }
  doc.setFontSize(9);
  doc.setTextColor(...colors.accent);
  doc.text('CORE PRODUCTS & SERVICES', margin, y);
  y += 6;
  const products = Array.isArray(report?.productsAndServices) ? report.productsAndServices : [];
  if (products.length === 0) {
    doc.setTextColor(...colors.muted);
    doc.text('No product data listed.', margin + 8, y);
    y += 6;
  } else {
    for (const p of products) {
      if (y > 270) { addPage(doc, colors); y = 18; }
      doc.setTextColor(...colors.accentSecondary);
      doc.text('•', margin + 2, y);
      doc.setTextColor(...colors.text);
      const pLines = doc.splitTextToSize(safeStr(p), contentW - 10);
      doc.text(pLines, margin + 8, y);
      y += pLines.length * 4.5 + 2;
    }
  }

  // AI Pain Points
  y += 4;
  if (y > 230) { addPage(doc, colors); y = 18; }
  doc.setFontSize(9);
  doc.setTextColor(...colors.accent);
  doc.text('AI PAIN POINTS & STRATEGIC CHALLENGES', margin, y);
  y += 6;
  const painPoints = Array.isArray(report?.painPoints) ? report.painPoints : [];
  if (painPoints.length === 0) {
    doc.setTextColor(...colors.muted);
    doc.text('No pain point data listed.', margin + 8, y);
    y += 6;
  } else {
    for (const pp of painPoints) {
      if (y > 265) { addPage(doc, colors); y = 18; }
      doc.setTextColor(...colors.error);
      doc.text('!', margin + 2, y);
      doc.setTextColor(...colors.text);
      const ppLines = doc.splitTextToSize(safeStr(pp), contentW - 10);
      doc.text(ppLines, margin + 8, y);
      y += ppLines.length * 4.5 + 3;
    }
  }

  // Competitors Table
  y += 4;
  if (y > 210) { addPage(doc, colors); y = 18; }
  doc.setFontSize(9);
  doc.setTextColor(...colors.accent);
  doc.text('COMPETITOR ANALYSIS', margin, y);
  y += 4;

  const competitors = Array.isArray(report?.competitors) ? report.competitors : [];
  if (competitors.length > 0) {
    const renderTable = autoTable?.default || autoTable || doc.autoTable;
    if (typeof renderTable === 'function') {
      renderTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [['Competitor', 'Website', 'Reason / Similarity']],
        body: competitors.map(c => [safeStr(c?.name), safeStr(c?.website), safeStr(c?.reason, 'Direct market competitor')]),
        theme: 'plain',
        styles: {
          fontSize: 8,
          textColor: [222, 225, 249],
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [37, 41, 58],
          textColor: [82, 141, 255],
          fontStyle: 'bold',
          fontSize: 8,
        },
        bodyStyles: {
          fillColor: [22, 27, 43],
        },
        alternateRowStyles: {
          fillColor: [14, 19, 35],
        },
      });
    }
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...colors.muted);
    doc.text(`Relu Consultancy v1.0 — Generated ${new Date().toLocaleDateString()}`, margin, 290);
    doc.text(`Page ${i} of ${pageCount}`, W - margin - 20, 290);
  }

  return doc;
}

function addPage(doc, colors) {
  doc.addPage();
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
}

export async function downloadPDF(report) {
  const doc = await generatePDF(report);
  const safeName = safeStr(report?.companyName, 'company').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  doc.save(`${safeName}-research-report.pdf`);
  return doc;
}

export async function getPDFBase64(report) {
  const doc = await generatePDF(report);
  return doc.output('datauristring').split(',')[1];
}
