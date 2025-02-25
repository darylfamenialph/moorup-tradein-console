/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash';
import { AppButton } from '../../components';
import { OrderItemStatus } from '../../constants';
import { formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const unsentDevicesManagementParsingConfig = {
  'Order ID': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_number'])) return '--';
    return row['order_number'];
  },
  'Order Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['createdAt'])) return '--';
    return formatDate(row['createdAt']);
  },
  'Order Type': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['credit_type'])) return '--';
    return parseStatus(row['credit_type']);
  },
  'Customer Name': ({ row }: ParsingFunctionParams) => {
    const userDetails = row ? row['user_id'] : null;
    if (
      !userDetails ||
      (isEmpty(userDetails['first_name']) && isEmpty(userDetails['last_name']))
    )
      return '--';
    const firstName = userDetails['first_name'] || '';
    const lastName = userDetails['last_name'] || '';
    return `${firstName} ${lastName}`;
  },
  'Extended Prior': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['isExtended'])) return 'No';
    return row['isExtended'] ? 'Yes' : 'No';
  },
  'Devices Awaiting': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_items'])) return '--';
    const orderItems = row ? row['order_items'] : [];
    const orderCount = orderItems.filter((item: any) => item.status === OrderItemStatus.CREATED)?.length;
    return orderCount;
  },
};

export const unsentDevicesTableParsingConfig = {
  'Device ID': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['line_item_number'])) return '--';
    return row['line_item_number'];
  },
  'Device Name': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['product_name'])) return '--';
    return row['product_name'];
  },
  'IMEI/Serial': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['imei_serial'])) return '--';
    return row['imei_serial'];
  },
  'Extension Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['send_in_deadline_date'])) return '--';
    return formatDate(row['send_in_deadline_date']);
  },
  Actions: ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['_id'])) return '--';
    return (
      <div className='flex gap-2'>
        <AppButton
          type="button"
          variant="fill"
          width="fit-content"
          padding="4px 20px"
          onClick={() => row.extendDeadlineAction()}
        >
          Extend
        </AppButton>
          <AppButton
          type="button"
          variant="outlined"
          width="fit-content"
          padding="4px 20px"
          onClick={() => row.cancelOrderItemAction()}
        >
          Cancel
        </AppButton>
      </div>
    )
  }
};
