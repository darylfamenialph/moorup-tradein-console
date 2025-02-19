/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, isUndefined } from 'lodash';
import { StyledMenuIcon } from '../../components';
import { formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const actionablesDeviceCreditChargeNeededParsingConfig = {
  'Customer Name': ({ row }: ParsingFunctionParams) => {
    const userDetails = row ? row['user_details'] : null;
    if (
      !userDetails ||
      (isEmpty(userDetails['first_name']) && isEmpty(userDetails['last_name']))
    )
      return '--';
    const firstName = userDetails['first_name'] || '';
    const lastName = userDetails['last_name'] || '';
    return `${firstName} ${lastName}`;
  },
  'Device ID': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['line_item_number'])) return '--';
    return orderItem['line_item_number'];
  },
  'Device Status': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['status'])) return '--';

    return parseStatus(orderItem['status']);
  },
  'Charge Attempts': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isUndefined(orderItem['payment_attempts'])) return 0;
    return orderItem['payment_attempts'] || 0;
  },
  'Order Creation Date': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['createdAt'])) return '--';
    return formatDate(orderItem['createdAt']);
  },
  'Device Outcome Date': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['updatedAt'])) return '--';
    return formatDate(orderItem['updatedAt']);
  },
  'Initial Device Value': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isUndefined(orderItem['original_offer'])) return '--';
    return orderItem['original_offer'];
  },
  'Charge Value': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || (isEmpty(orderItem['revision']) && isUndefined(orderItem['original_offer']))) return '--';

    if (orderItem['revision']) {
      const revisions = orderItem['revision'];
      return revisions['price'];
    } else {
      return orderItem['original_offer'];
    }
  },
  'Actions': ({ row, menuItems, index }: ParsingFunctionParams) => {
    if (!row || isEmpty(menuItems)) return '--';
    return <StyledMenuIcon menuItems={menuItems} rowData={row} index={index} />;
  },
};
