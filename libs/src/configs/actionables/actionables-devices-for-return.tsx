/* eslint-disable @typescript-eslint/no-explicit-any */
import { faBoxesPacking } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { AppButton } from '../../components';
import { OrderItemStatus } from '../../constants';
import { formatDate, parseStatus, parseTypes } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const actionablesDevicesForReturnParsingConfig = {
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
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['line_item_number'])) return '--';
    return orderItem['line_item_number'];
  },
  'Payment Type': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['credit_type'])) return '--';
    return parseTypes(row['credit_type'], true);
  },
  'Payment Status': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['payment'])) return '--';

    const payment = orderItem ? orderItem['payment'] : null;
    if (!payment || isEmpty(payment['status'])) return '--';

    return parseStatus(payment['status']);
  },
  'Order Date': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['createdAt'])) return '--';
    return formatDate(orderItem['createdAt']);
  },
  Actions: ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['_id'])) return '--';

    return (
      <AppButton
        type="button"
        variant="fill"
        width="fit-content"
        padding="4px 20px"
        icon={faBoxesPacking}
        onClick={() => row.returnDeviceAction()}
        disabled={orderItem.status !== OrderItemStatus.FOR_RETURN}
      >
        Return
      </AppButton>
    );
  },
};
