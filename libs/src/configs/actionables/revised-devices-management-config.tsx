/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize, isEmpty } from 'lodash';
import { AppButton } from '../../components';
import { OrderItemStatus } from '../../constants';
import { formatDate, parseStatus } from '../../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const revisedDevicesManagementParsingConfig = {
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
    return parseStatus(row['credit_type'], '150px');
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
  'Devices Revised': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_items'])) return '--';
    const orderItems = row ? row['order_items'] : [];
    const orderCount = orderItems.filter((item: any) => item.status === OrderItemStatus.REVISED)?.length;
    return orderCount;
  },
};

const formatConditionAssessment = (questions: any[]) => {
  const assessments: any = [];
  questions?.forEach((item: any) => {
    const criteria = item?.question?.replace('-assessment', '');
    assessments.push(`${capitalize(criteria)}: ${capitalize(item?.answer)}`)
  })
  return assessments.join(' | ');
}

export const revisedDevicesTableParsingConfig = {
  'Device ID': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['line_item_number'])) return '--';
    return row['line_item_number'];
  },
  'Provided Device Details': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['product_name'])) return '--';
    return row['product_name'];
  },
  'Condition Assessment': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['questions_answered'])) return '--';
    return formatConditionAssessment(row['questions_answered']);
  },
  'IMEI/Serial': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['imei_serial'])) return '--';
    return row['imei_serial'];
  },
  'Quote': ({ row }: ParsingFunctionParams) => {
    if (!row) return '--';
    return row['original_offer'];
  },
  'Moorup Assessment': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['revision'])) return '--';
    return row['revision']?.product?.name || row['product_name'];
  },
  'Revised Condition Assessment': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['revision'])) return '--';
    return formatConditionAssessment(row['revision']?.questions_answered || row['questions_answered']);
  },
  'Condition Notes (Reason)': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['revision']?.reasons)) return '--';
    return row['revision']?.reasons?.join(', ');
  },
  'Revised IMEI/Serial': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['imei_serial'])) return '--';
    return row['imei_serial'];
  },
  'Revised Quote': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['revision'])) return '--';
    return row['revision']?.price;
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
          onClick={() => row.acceptRevisionAction()}
        >
          Accept
        </AppButton>
          <AppButton
          type="button"
          variant="outlined"
          width="fit-content"
          padding="4px 20px"
          onClick={() => row.returnDeviceAction()}
        >
          Return
        </AppButton>
      </div>
    )
  }
};
