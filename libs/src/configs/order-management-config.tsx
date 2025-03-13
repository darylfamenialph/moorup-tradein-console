/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { StyledMenuIcon } from '../components';
import { capitalizeFirstLetters, formatDate, parseStatus, parseTypes } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
  index: number;
}

const StyledChip = styled.span<{ value?: string; width?: string; bgColor?: string; textColor?: string }>`
  display: inline-block;
  border-radius: 4px;
  padding: 2px 20px;
  text-decoration: none;
  width: ${(props) => props.width ?? 'auto'};
  text-align: center;
  background-color: ${(props) => props.bgColor ?? (props.value === 'active' ? '#b0d6d0' : '#ffdbd9')};
  color: ${(props) => props.textColor ?? (props.value === 'active' ? '#01463A' : '#f7564a')};
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
`;

export const orderManagementParsingConfig = {
  'Customer Name': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['user_id'])) return '--';
    const userDetails = row ? row['user_id'] : null;
    if (!userDetails || (isEmpty(userDetails['first_name']) && isEmpty(userDetails['last_name']))) return '--';
    const firstName = userDetails['first_name'] || '';
    const lastName = userDetails['last_name'] || '';
    return `${firstName} ${lastName}`;
  },
  'Order Type': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_type'])) return '--';
    return parseTypes(row['order_type'], true);
  },
  'Credit Type': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['credit_type'])) return '--';
    return parseTypes(row['credit_type'], true);
  },
  'Tags': ({ row }: ParsingFunctionParams) => {
    if (!row || (isEmpty(row['tag']))) return '--';

    const tags = Array.isArray(row['tag']) && row['tag'].length > 0 
      ? [...row['tag']].sort((a, b) => a.localeCompare(b)) 
      : [];
    const maxItems = 3;

    if (tags.length <= maxItems) {
      return (
        <ChipsContainer>
          {tags?.map((tag: string, index: number) => {
            if (isEmpty(tag)) return '--';

            return (
              <StyledChip key={index} bgColor='#008080' textColor='white'>{capitalizeFirstLetters(tag)}</StyledChip>
            );
          })}
        </ChipsContainer>
      );
    } else {
      const visibleTags = tags.slice(0, maxItems);
      const remainingCount = tags.length - maxItems;

      return (
        <ChipsContainer>
          {visibleTags?.map((tag: string, index: number) => {
            if (isEmpty(tag)) return '--';
            return (
              <StyledChip key={index} bgColor='#008080' textColor='white'>{capitalizeFirstLetters(tag)}</StyledChip>
            );
          })}
          <StyledChip key="more" bgColor='#008080' textColor='white'>{`+${remainingCount} more`}</StyledChip>
        </ChipsContainer>
      );
    }
  },
  'Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['status'])) return '--';
    return parseStatus(row['status']);
  },
  'Payment Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['payment'])) return '--';
    const paymentDetails = row ? row['payment'] : null;
    if (!paymentDetails || isEmpty(paymentDetails['payment_status'])) return '--';
    return parseStatus(paymentDetails['payment_status']);
  },
  'Order Count': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['order_items'])) return '--';
    const orderItems = row ? row['order_items'] : null;
    const orderCount = orderItems?.length;
    return orderCount;
  },
  'Updated': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['updatedAt'])) return '--';
    return formatDate(row['updatedAt']);
  },
  'Actions': ({ row, menuItems, index }: ParsingFunctionParams) => {
    if (!row || isEmpty(menuItems)) return '--';
    return <StyledMenuIcon menuItems={menuItems} rowData={row} index={index} />;
  },
};
