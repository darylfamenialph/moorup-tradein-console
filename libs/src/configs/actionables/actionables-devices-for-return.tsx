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
    if (!orderItem || isEmpty(orderItem['payments'])) return '--';

    const latestPayment = orderItem['payments'].sort(
      (
        a: { timestamp: string | number | Date },
        b: { timestamp: string | number | Date },
      ) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0];

    if (!latestPayment || isEmpty(latestPayment['status'])) return '--';

    return parseStatus(latestPayment['status'], '130px');
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
