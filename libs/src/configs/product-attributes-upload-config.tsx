/* eslint-disable @typescript-eslint/no-explicit-any */
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { StyledIcon, withChild } from '../components';
import { defaultTheme } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

const WCReactTooltip = withChild(ReactTooltip);

export const productUploadAttributesParsingConfig = {
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
  'SKU': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['sku'])) return '--';
    return payload['sku'];
  },
  'Attribute ID': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['id'])) return '--';
    return payload['id'];
  },
  'Attribute Name': ({ row }: ParsingFunctionParams) => {
    const payload = row ? row['payload'] : null;
    if (!payload || isEmpty(payload['name'])) return '--';
    return payload['name'];
  }
};
