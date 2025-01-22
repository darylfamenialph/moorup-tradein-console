/* eslint-disable @typescript-eslint/no-explicit-any */
import { faBoxesPacking, faPrint } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { AppButton } from '../../components';
import { OrderItemStatus } from '../../constants';
import { capitalizeFirstLetter, formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const actionablesManagementParsingConfig = {
  'Order Number': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_number'])) return '--';
    return row['order_number'];
  },
  'Device Number': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['line_item_number'])) return '--';
    return orderItem['line_item_number'];
  },
  Name: ({ row }: ParsingFunctionParams) => {
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
  'Product Name': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['product_name'])) return '--';
    return orderItem['product_name'];
  },
  'Product Type': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['product_type'])) return '--';
    return capitalizeFirstLetter(orderItem['product_type']);
  },
  Status: ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['status'])) return '--';
    return parseStatus(orderItem['status']);
  },
  'Shipment Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['shipmentStatus'])) return parseStatus('To Print');
    return row['shipmentStatus'] === 'box-sent'
      ? parseStatus('done')
      : parseStatus('To Print');
  },
  Created: ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['createdAt'])) return '--';
    return formatDate(row['createdAt']);
  },
  Updated: ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['updatedAt'])) return '--';
    return formatDate(row['updatedAt']);
  },
  Actions: ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['_id'])) return '--';
    switch (row['order_items']?.status) {
      case OrderItemStatus.CREATED:
        return (
          <AppButton
            type="button"
            variant="fill"
            width="fit-content"
            padding="4px 20px"
            icon={faPrint}
            onClick={() => row.printLabelAction()}
          >
            Print Labels
          </AppButton>
        );
      case OrderItemStatus.REVISION_REJECTED:
        return (
          <AppButton
            type="button"
            variant="fill"
            width="fit-content"
            padding="4px 20px"
            icon={faBoxesPacking}
            onClick={() => row.returnDeviceAction()}
          >
            Return Device
          </AppButton>
        );
      default:
        return '--';
    }
  },
};
