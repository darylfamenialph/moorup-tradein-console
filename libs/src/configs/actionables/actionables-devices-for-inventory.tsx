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

export const actionablesDevicesForInventoryParsingConfig = {
  'IMEI/Serial': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['imei_serial'])) return '--';
    return orderItem['imei_serial'];
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
  'Device Model': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['product_name'])) return '--';
    return orderItem['product_name'];
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
        onClick={() => row.takeOutOfInventoryAction()}
      >
        Take Out of Inventory
      </AppButton>
    );
  },
};
