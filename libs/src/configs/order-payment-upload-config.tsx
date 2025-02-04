/* eslint-disable @typescript-eslint/no-explicit-any */
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { StyledIcon, withChild } from '../components';
import { defaultTheme } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index?: number;
}

const WCReactTooltip = withChild(ReactTooltip);

export const orderPaymentUploadParsingConfig = {
  'Errors': ({ row, index }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['errors'])) return '--';
    return (
      <>
        <StyledIcon data-tooltip-id={String(index)} icon={faCircleExclamation} color={defaultTheme.danger.text} disabled />
        <WCReactTooltip id={String(index)} place="right" variant="error" render={() => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {row['errors'].map((error: string, idx: number) => (
                <span key={idx}>{error}</span>
              ))}
            </div>
          )} />
      </>
    );
  },
  'Device ID': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['deviceId'])) return '--';
    return payload['deviceId'];
  },
  'Customer Name': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['customerName'])) return '--';
    return payload['customerName'];
  },
  'Customer Email Address': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['customerEmailAddress'])) return '--';
    return payload['customerEmailAddress'];
  },
  'Payment Amount': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['paymentAmount'])) return '--';
    return payload['paymentAmount'];
  },
  'Payment Type': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['paymentType'])) return '--';
    return payload['paymentType'];
  },
  'Payment Reference': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['paymentReference'])) return '--';
    return payload['paymentReference'];
  },
  'Evaluated Date': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['updatedAt'])) return '--';
    return payload['updatedAt'];
  },
};
