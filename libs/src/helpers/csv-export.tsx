/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';
import { ExportOptions, PromotionClaimsExportData } from '../constants';
import { formatDate } from './helpers';

export function exportPromotionClaims({ data, exportOptions }: { data: PromotionClaimsExportData[]; exportOptions: ExportOptions }) {
  const headers = [
    'Promotion Name',
    'Claim Number',
    'Full Name',
    'Email',
    'Order Number',
    'Order Line Item ID',
    'Order Line Item Status',
    'Moorup Validation',
    'Partner Validation',
    'Claim Status',
    'Claim Amount',
    'Claim Created Date',
    'Claim Updated Date',
  ];

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = data?.map(item => {
      const promotionName = item?.promotion_id ? item?.promotion_id.name : '';
      const row = [
        promotionName,
        item?.claim_number || '',
        `${item?.user_id?.first_name} ${item?.user_id?.last_name}` || '',
        item?.user_id?.email || '',
        item?.order_id?.order_number || '',
        item?.order_id?.order_items.map(orderItem => orderItem?.line_item_number).join(','),
        item?.order_id?.order_items.map(orderItem => orderItem?.status).join(','),
        item?.moorup_status || '',
        '', // Partner Validation
        item?.status || '',
        '', // Claim Amount
        formatDate(new Date(item?.createdAt)) || '',
        formatDate(new Date(item?.updatedAt)) || '',
      ];

      return row;
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...worksheetData]);
    const rangeRef = worksheet['!ref'];
    if (rangeRef) {
      const range = XLSX.utils.decode_range(rangeRef);
      for (let i = 0; i < range.e.c + 1; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
        worksheet[cellAddress].s = { font: { bold: true } };
      }
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const fileName = 'data.xlsx';
    XLSX.writeFile(workbook, fileName);
  }

  const exportCsv = () => {
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    data?.forEach(item => {
      if (item?.order_id?.order_items) {
        const promotionName = item?.promotion_id ? item?.promotion_id.name : '';
        const row = [
          promotionName,
          item?.claim_number || '',
          `${item?.user_id?.first_name} ${item?.user_id?.last_name}` || '',
          item?.user_id?.email || '',
          item?.order_id?.order_number || '',
          item?.order_id?.order_items.map(orderItem => orderItem?.line_item_number).join('|'),
          item?.order_id?.order_items.map(orderItem => orderItem?.status).join('|'),
          item?.moorup_status || '',
          '', // Partner Validation
          item?.status || '',
          '', // Claim Amount
          formatDate(new Date(item?.createdAt)) || '',
          formatDate(new Date(item?.updatedAt)) || '',
        ];

        csvRows.push(row?.join(','));
      }
    });

    const csvData = csvRows.join('\n');
    const fileName = 'data.csv';
    const blob = new Blob([csvData], {
      type: 'text/csv,'
    });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  switch (exportOptions.format) {
    case 'csv':
      exportCsv();
      break;

    case 'excel':
      exportExcel();
      break;
  
    default:
      throw new Error('Invalid format!');
  }
};
