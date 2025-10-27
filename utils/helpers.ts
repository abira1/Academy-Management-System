import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';

// FIX: Changed interface to a type intersection to correctly augment the jsPDF type.
// This ensures that methods like .text() and .save() are recognized by TypeScript.
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

export const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCurrentBangladeshTime = () => {
    return new Date().toLocaleString('en-BD', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const exportToPDF = (columns: string[], data: any[][], title: string, filename: string) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  doc.text(title, 14, 15);
  doc.autoTable({
    head: [columns],
    body: data,
    startY: 20,
  });
  doc.save(`${filename}.pdf`);
};

export const exportToExcel = async (data: any[], filename: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  
  if (data.length > 0) {
    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(row => {
      worksheet.addRow(Object.values(row));
    });
  }
  
  // Generate buffer and create download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
