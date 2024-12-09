/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, isUndefined } from 'lodash';
import { StyledMenuIcon } from '../../components';
import { formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const actionablesLockedDevicesForRetestParsingConfig = {
  'Order Number': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_number'])) return '--';
    return row['order_number'];
  },
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
    const orderItem = row ? row['order_item'] : null;
    if (!orderItem || isEmpty(orderItem['line_item_number'])) return '--';
    return orderItem['line_item_number'];
  },
  'Lock Type': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_item'] : null;
    if (!orderItem || isEmpty(orderItem['lock'])) return '--';

    const lock = orderItem ? orderItem['lock'] : null;
    if (!lock || isEmpty(lock['type'])) return '--';

    return parseStatus(lock['type']);
  },
  'Prior Lock Check': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_item'] : null;
    if (!orderItem || isEmpty(orderItem['lock'])) return '--';

    const lock = orderItem ? orderItem['lock'] : null;
    if (!lock || isUndefined(lock['retestCount'])) return 'No';

    return lock['retestCount'] && 'Yes';
  },
  'Retest Count': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_item'] : null;
    if (!orderItem || isEmpty(orderItem['lock'])) return '--';

    const lock = orderItem ? orderItem['lock'] : null;
    if (!lock || isUndefined(lock['retestCount'])) return 0;
    return lock['retestCount'] || 0;
  },
  'Order Date': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_item'] : null;
    if (!orderItem || isEmpty(orderItem['createdAt'])) return '--';
    return formatDate(orderItem['createdAt']);
  },
  'Actions': ({ row, menuItems, index }: ParsingFunctionParams) => {
    if (!row || isEmpty(menuItems)) return '--';
    return <StyledMenuIcon menuItems={menuItems} rowData={row} index={index} />;
  },
};
