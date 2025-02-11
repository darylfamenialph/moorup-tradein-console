import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { isEmpty } from 'lodash';
import { CooldownButton } from '../components';
import { LogTypes } from '../constants';
import { capitalizeFirstLetters, formatDate, formatToReadable, parseStatus } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

export const orderLogsParsingConfig = {
  'Initiated By': ({ row }: ParsingFunctionParams) => {
    switch (row['type']) {
      case LogTypes.SYSTEM: {
        return capitalizeFirstLetters(LogTypes.SYSTEM);
      }

      case LogTypes.USER: {
        if (!row || isEmpty(row['triggered_by'])) return '--';
        return row['triggered_by'];
      }
    
      default:
        return '--';
    }
  },
  'Description': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['description'])) return '--';

    if (!isEmpty(row['identifier'])) {
      return `${capitalizeFirstLetters(formatToReadable(row['description']))}: ${row['identifier']}`
    }

    return capitalizeFirstLetters(formatToReadable(row['description']));
  },
  'Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['status'])) return '--';
    return parseStatus(row['status']);
  },
  'Timestamp': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['createdAt'])) return '--';
    return formatDate(row['createdAt'], 'DD/MM/YYYY - hh:mmA');
  },
  'Actions': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['email'])) return '--';
    
    return (
      <CooldownButton
        buttonText="Resend"
        cooldownDuration={30}
        onAction={row.resendEmailAction}
        icon={faPaperPlane}
      />
    );
  },
};
