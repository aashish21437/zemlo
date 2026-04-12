import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateItineraryPDF = (id: string, code: string, days: any[], total: number) => {
  const doc = new jsPDF();

  // 1. Header Section (Clean & Minimal)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("TRAVEL PLAN", 15, 25);
  
  // Separator Line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, 30, 195, 30);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`REFERENCE: #${id}`, 15, 40);
  doc.text(`VERSION: ${code.toUpperCase()}`, 15, 45);

  // Consolidated Total Price (Prominent)
  doc.setFontSize(14);
  doc.text(`TOTAL ESTIMATED COST: JPY ${total.toLocaleString()}`, 15, 55);

  // 2. Build Table Data (Prices removed from activities)
  const tableRows: any[] = [];

  days.forEach((day, index) => {
    // We only map the names now, no individual prices
    const activities = day.activities
      .map((a: any) => `• ${a.name_en}`)
      .join("\n\n"); // Double spacing for readability

    tableRows.push([
      `DAY 0${index + 1}`,
      day.stay.toUpperCase(),
      activities
    ]);
  });

  // 3. Generate Table (Consolidated View)
  autoTable(doc, {
    startY: 65,
    head: [["DAY", "STAY LOCATION", "SIGHTSEEING & ACTIVITIES"]],
    body: tableRows,
    theme: "grid",
    headStyles: { 
      fillColor: [0, 0, 0], 
      textColor: [255, 255, 255], 
      fontSize: 10, 
      fontStyle: "bold",
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: "bold", halign: 'center' },
      1: { cellWidth: 45, fontStyle: "bold" },
      2: { cellWidth: "auto" },
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 8, 
      valign: 'middle',
      overflow: 'linebreak' 
    },
    // Adding a bit of breathing room between rows
    margin: { left: 15, right: 15 }
  });

  // 4. Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Zemlo Itinerary Management System - Page ${i} of ${pageCount}`, 15, 285);
  }

  // 5. Download
  doc.save(`Itinerary_Plan_${code}.pdf`);
};