// src/lib/import-utils.ts
import * as XLSX from "xlsx";

/**
 * Generate a CSV template for lead imports
 * Includes example rows to show proper format
 */
export function generateLeadTemplate(): string {
  const headers = [
    'Company Name',      // Required
    'Email',
    'Phone',
    'Website',
    'Location',
    'Business Type',     // SIGN_COMPANY, BILLBOARD_OPERATOR, WRAP_INSTALLER, PROPERTY_MANAGER, PRINT_SHOP, AGENCY, OTHER
    'Has Inventory',     // YES, NO, UNKNOWN
    'Does Installs',     // YES, NO, UNKNOWN
    'Estimated Spaces',  // Number
    'Notes',
  ];

  // Example rows to show format
  const exampleRows = [
    [
      'ABC Billboard Co',
      'contact@abcbillboards.com',
      '(555) 123-4567',
      'https://abcbillboards.com',
      'Los Angeles, CA',
      'BILLBOARD_OPERATOR',
      'YES',
      'YES',
      '25',
      'Found on Google Maps. Has 25 boards in LA area.',
    ],
    [
      'City Signs LLC',
      'info@citysigns.com',
      '555-987-6543',
      'citysigns.com',
      'San Diego, CA',
      'SIGN_COMPANY',
      'UNKNOWN',
      'YES',
      '',
      'Referral from John. Does installations.',
    ],
    [
      'Quick Wraps',
      '',
      '(555) 456-7890',
      '',
      'Phoenix, AZ',
      'WRAP_INSTALLER',
      'NO',
      'YES',
      '',
      'Vehicle wrap installer only, no inventory.',
    ],
  ];

  const allRows = [headers, ...exampleRows];

  // Convert to CSV
  return allRows.map(row =>
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  ).join('\n');
}

/**
 * Download the CSV template file
 */
export function downloadTemplate(): void {
  const csv = generateLeadTemplate();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'elaview-lead-import-template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download Excel (.xlsx) template
 */
export function downloadExcelTemplate(): void {
  const headers = [
    'Company Name',
    'Email',
    'Phone',
    'Website',
    'Location',
    'Business Type',
    'Has Inventory',
    'Does Installs',
    'Estimated Spaces',
    'Notes',
  ];

  const exampleRows = [
    [
      'ABC Billboard Co',
      'contact@abcbillboards.com',
      '(555) 123-4567',
      'https://abcbillboards.com',
      'Los Angeles, CA',
      'BILLBOARD_OPERATOR',
      'YES',
      'YES',
      25,
      'Found on Google Maps. Has 25 boards in LA area.',
    ],
    [
      'City Signs LLC',
      'info@citysigns.com',
      '555-987-6543',
      'citysigns.com',
      'San Diego, CA',
      'SIGN_COMPANY',
      'UNKNOWN',
      'YES',
      '',
      'Referral from John. Does installations.',
    ],
    [
      'Quick Wraps',
      '',
      '(555) 456-7890',
      '',
      'Phoenix, AZ',
      'WRAP_INSTALLER',
      'NO',
      'YES',
      '',
      'Vehicle wrap installer only, no inventory.',
    ],
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Company Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 25 }, // Website
    { wch: 20 }, // Location
    { wch: 20 }, // Business Type
    { wch: 15 }, // Has Inventory
    { wch: 15 }, // Does Installs
    { wch: 15 }, // Estimated Spaces
    { wch: 40 }, // Notes
  ];

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');

  // Generate buffer and download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'elaview-lead-import-template.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse TriState values from CSV
 */
export function parseTriState(value: string | undefined): 'YES' | 'NO' | 'UNKNOWN' {
  if (!value) return 'UNKNOWN';
  const upper = value.toUpperCase().trim();
  if (upper === 'YES' || upper === 'Y' || upper === 'TRUE' || upper === '1') return 'YES';
  if (upper === 'NO' || upper === 'N' || upper === 'FALSE' || upper === '0') return 'NO';
  return 'UNKNOWN';
}
