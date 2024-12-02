/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { StyledMenuIcon } from '../components';
import { formatDate, parseStatus } from '../helpers';

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

const ProductChipsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
`;

export const promotionsManagementParsingConfig = {
  'Promotion Reference': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['promotion_reference'])) return '--';
    return row['promotion_reference'];
  },
  'Name': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['name'])) return '--';
    return row['name'];
  },
  'Products': ({ row }: ParsingFunctionParams) => {
    // if (!row || isEmpty(row['claims'])) return '--';
    if (!row || (isEmpty(row['claims']) && isEmpty(row['products']))) return '--';

    // const products = Array.isArray(row['claims']?.products) ? row['claims'].products : [];
    const products = Array.isArray(row['claims']?.products) && row['claims'].products.length > 0 ? row['claims'].products : (Array.isArray(row['products']) ? row['products'] : []);
    const maxItems = 2;

    if (products.length <= maxItems) {
      return (
        <ProductChipsContainer>
          {products.map((product: { name: any; product_name: any }, index: number) => (
            <StyledChip key={index} bgColor='#216A4C' textColor='white'>{product.product_name || product.name}</StyledChip>
          ))}
        </ProductChipsContainer>
      );
    } else {
      const visibleProducts = products.slice(0, maxItems);
      const remainingCount = products.length - maxItems;

      return (
        <ProductChipsContainer>
          {visibleProducts.map((product: { name: any; product_name: any }, index: number) => (
            <StyledChip key={index} bgColor='#216A4C' textColor='white'>{product.product_name || product.name}</StyledChip>
          ))}
          <StyledChip key="more" bgColor='#216A4C' textColor='white'>{`+${remainingCount} more`}</StyledChip>
        </ProductChipsContainer>
      );
    }
  },
  'Start Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['start_date'])) return '--';
    return formatDate(row['start_date']);
  },
  'End Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['end_date'])) return '--';
    return formatDate(row['end_date']);
  },
  'Device Send In Deadline Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['send_in_deadline'])) return '--';
    return formatDate(row['send_in_deadline']);
  },
  'Payment Due Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['payment_due_date'])) return '--';
    return formatDate(row['payment_due_date']);
  },
  'New Device Purchase Start Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['new_device_purchase_start_date'])) return '--';
    return formatDate(row['new_device_purchase_start_date']);
  },
  'New Device Purchase End Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['new_device_purchase_end_date'])) return '--';
    return formatDate(row['new_device_purchase_end_date']);
  },
  'Claim Deadline': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['claim_deadline'])) return '--';
    return formatDate(row['claim_deadline']);
  },
  'Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['promotion_status'])) return '--';
    return parseStatus(row['promotion_status']);
  },
  'Actions': ({ row, menuItems, index }: ParsingFunctionParams) => {
    if (!row || isEmpty(menuItems)) return '--';
    return <StyledMenuIcon menuItems={menuItems} rowData={row} index={index} />;
  },
};
