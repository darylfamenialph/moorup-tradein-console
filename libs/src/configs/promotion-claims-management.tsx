/* eslint-disable @typescript-eslint/no-explicit-any */
import { faEdit, faEye } from '@fortawesome/free-regular-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isString, isUndefined } from 'lodash';
import styled from 'styled-components';
import { IconButton } from '../components';
import { formatDate, parseStatus } from '../helpers';

interface ParsingFunctionParams {
  row: { [key: string]: any };
  menuItems?: any;
}

const StyledLink = styled.a`
  text-decoration: underline;
  color: #216a4c;
  display: inline-block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
`;

const StyledChip = styled.span<{
  value?: string;
  width?: string;
  bgColor?: string;
  textColor?: string;
}>`
  display: inline-block;
  border-radius: 4px;
  padding: 2px 20px;
  text-decoration: none;
  width: ${(props) => props.width ?? 'auto'};
  text-align: center;
  background-color: ${(props) =>
    props.bgColor ?? (props.value === 'active' ? '#b0d6d0' : '#ffdbd9')};
  color: ${(props) =>
    props.textColor ?? (props.value === 'active' ? '#01463A' : '#f7564a')};
`;

const ProductChipsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
`;

export const promotionClaimsManagementParsingConfig = {
  'Promotion Reference': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['promotion_reference'])) return '--';
    return promotionDetails['promotion_reference'];
  },
  'Promotion Name': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['name'])) return '--';
    return promotionDetails['name'];
  },
  'Promotion Link': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (
      !promotionDetails ||
      isEmpty(promotionDetails['slug']) ||
      isEmpty(row['platformOrigin'])
    )
      return '--';

    const promotionLink = `${row['platformOrigin']}/promotions/${promotionDetails?.slug}`;
    return (
      <StyledLink
        href={promotionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link
      </StyledLink>
    );
  },
  'Receipt Number': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['receipt_number'])) return '--';
    return row['receipt_number'];
  },
  'Claim Number': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['claim_number'])) return '--';
    return row['claim_number'];
  },
  'Claim Creation Date': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['createdAt'])) return '--';
    return formatDate(row['createdAt']);
  },
  'Promotion Start Date': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['start_date'])) return '--';
    return formatDate(promotionDetails['start_date']);
  },
  'Promotion End Date': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['end_date'])) return '--';
    return formatDate(promotionDetails['end_date']);
  },
  'Device Send-in Deadline': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['send_in_deadline'])) return '--';
    return formatDate(promotionDetails['send_in_deadline']);
  },
  'Claim Deadline': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['claim_deadline'])) return '--';
    return formatDate(promotionDetails['claim_deadline']);
  },
  'Device Purchase Start Date': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['new_device_purchase_start_date'])) return '--';
    return formatDate(promotionDetails['new_device_purchase_start_date']);
  },
  'Device Purchase End Date': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['new_device_purchase_end_date'])) return '--';
    return formatDate(promotionDetails['new_device_purchase_end_date']);
  },
  'Promotion Payout Date': ({ row }: ParsingFunctionParams) => {
    const promotionDetails = row ? row['promotion_id'] : null;
    if (!promotionDetails || isEmpty(promotionDetails['payment_due_date'])) return '--';
    return formatDate(promotionDetails['payment_due_date']);
  },
  'Moorup Approval Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['moorup_status'])) return '--';
    return parseStatus(row['moorup_status']);
  },
  'Partner Approval Status': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['status'])) return '--';

    return parseStatus(row['status']);
  },
  'Trade-in Device Model': ({ row }: ParsingFunctionParams) => {
    const orderDetails = row ? row['order_id'] : null;
    if (!orderDetails || isEmpty(orderDetails['order_number'])) return '--';

    const orderItems =
      Array.isArray(orderDetails?.order_items) &&
      orderDetails?.order_items?.length > 0
        ? orderDetails.order_items
        : [];
    const maxItems = 2;

    if (orderItems.length <= maxItems) {
      return (
        <ProductChipsContainer>
          {orderItems.map(
            (
              item: { product_variant_id: { product_id: { model: any } } },
              index: number,
            ) =>
              item.product_variant_id ? (
                <StyledChip key={index} bgColor="#216A4C" textColor="white">
                  {item?.product_variant_id?.product_id?.model}
                </StyledChip>
              ) : (
                '--'
              ),
          )}
        </ProductChipsContainer>
      );
    } else {
      const visibleItems = orderItems.slice(0, maxItems);
      const remainingCount = orderItems.length - maxItems;

      return (
        <ProductChipsContainer>
          {visibleItems?.map(
            (
              item: { product_variant_id: { product_id: { model: any } } },
              index: number,
            ) =>
              item.product_variant_id ? (
                <StyledChip key={index} bgColor="#216A4C" textColor="white">
                  {item?.product_variant_id?.product_id?.model}
                </StyledChip>
              ) : (
                '--'
              ),
          )}
          <StyledChip
            key="more"
            bgColor="#216A4C"
            textColor="white"
          >{`+${remainingCount} more`}</StyledChip>
        </ProductChipsContainer>
      );
    }
  },
  'Actions': ({ row }: ParsingFunctionParams) => {
    if (!row || isEmpty(row['receipt_number']) || !isString(row['receipt_number'])) return '--';
    if (isUndefined(row.viewAction) && isUndefined(row.editAction) && isUndefined(row.uploadAction)) return '--';

    return (
      <>
        {
          (row.viewAction && !isEmpty(row.receipt_url)) && (
            <IconButton
              tooltipLabel="View"
              icon={faEye}
              onClick={() => row.viewAction(row)}
            />
          )
        }
        {
          (row.editAction) && (
            <IconButton
              tooltipLabel="Edit"
              icon={faEdit}
              onClick={() => row.editAction(row)}
            />
          )
        }
        {
          (row.uploadAction && isEmpty(row.receipt_url)) && (
            <IconButton
              tooltipLabel="Attach Receipt"
              icon={faUpload}
              onClick={() => row.uploadAction(row)}
            />
          )
        }
      </>
    )
  },
};
