/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash';
import { formatDate, parseStatus } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
}

export const promotionClaimsPaymentManagementParsingConfig = {  
  'Order Number': ({ row }: ParsingFunctionParams) => {
    const orderDetails = row ? row['order_id'] : null;
    if (!orderDetails || isEmpty(orderDetails['order_number'])) return '--';
    return orderDetails['order_number'];
  },
  'Promotion Name': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['name'])) return '--';
    return promotionDetails['name'];
  },
  'Claim Number': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['claim_number'])) return '--';
    return row['claim_number'];
  },
  'Moorup Approval Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['moorup_status'])) return '--';
    return parseStatus(row['displayMoorupStatus'] || row['moorup_status']);
  },
  'Partner Approval Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['status'])) return '--';

    return parseStatus(row['displayStatus'] || row['status']);
  },
  'Claim Creation Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['createdAt'])) return '--';
    return formatDate(row['createdAt']);
  },
};
