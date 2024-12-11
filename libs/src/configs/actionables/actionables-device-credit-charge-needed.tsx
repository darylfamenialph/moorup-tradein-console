/* eslint-disable @typescript-eslint/no-explicit-any */
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isUndefined } from 'lodash';
import { AppButton } from '../../components';
import { PaymentStatus } from '../../constants';
import { formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const actionablesDeviceCreditChargeNeededParsingConfig = {
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
  'Payment Status': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['payments'])) return '--';

    const filterForChargeStatus = orderItem['payments'].filter(
      (item: any) => item.status === 'for-charge',
    );
    const latestPayment =
      filterForChargeStatus[filterForChargeStatus.length - 1];

    if (!latestPayment || isEmpty(latestPayment['status'])) return '--';

    return parseStatus(latestPayment['status'], '130px');
  },
  'Order Date': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['createdAt'])) return '--';
    return formatDate(orderItem['createdAt']);
  },
  'Initial Device Value': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isUndefined(orderItem['original_offer'])) return '--';
    return orderItem['original_offer'];
  },
  'Charge Amount': ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['payments'])) return '--';

    const filterForChargeStatus = orderItem['payments'].filter(
      (item: any) => item.status === 'for-charge',
    );
    const latestPayment =
      filterForChargeStatus[filterForChargeStatus.length - 1];

    if (!latestPayment || isUndefined(latestPayment['amount'])) return '--';

    return latestPayment['amount'];
  },
  Actions: ({ row }: ParsingFunctionParams) => {
    const orderItem = row ? row['order_items'] : null;
    if (!orderItem || isEmpty(orderItem['payments'])) return '--';

    const filterForChargeStatus = orderItem['payments'].filter(
      (item: any) => item.status === 'for-charge',
    );
    const latestPayment =
      filterForChargeStatus[filterForChargeStatus.length - 1];

    if (!latestPayment || isEmpty(latestPayment['status'])) return '--';

    let disableRequestPayment = true;

    if (latestPayment && !isEmpty(latestPayment['status'])) {
      const chargeAmount = latestPayment['amount'];
      const isChargeAmountInvalid =
        isUndefined(chargeAmount) || isNaN(chargeAmount) || chargeAmount === 0;

      if (!isChargeAmountInvalid) {
        switch (latestPayment['status']) {
          case PaymentStatus.FOR_CHARGE:
            disableRequestPayment = false;
            break;

          case PaymentStatus.FAILED:
            disableRequestPayment = false;
            break;

          default:
            disableRequestPayment = true;
            break;
        }
      }
    }

    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        <AppButton
          type="button"
          variant="fill"
          width="fit-content"
          padding="4px 20px"
          icon={faReceipt}
          onClick={() => row.requestPayment()}
          disabled={disableRequestPayment}
        >
          Request Payment
        </AppButton>
      </div>
    );
  },
};
