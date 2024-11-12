/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DetailCardContainer,
  OrderItems,
  Badge,
  parseStatus,
  formatDate,
  useOrder,
  CopyToClipboardButton,
  DataLine,
  StyledIcon,
  amountFormatter,
  usePermission,
} from '@tradein-admin/libs';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

type CardItemProps = {
  label: string;
  value: any;
  defaultValue?: string;
  copy?: boolean;
  capitalize?: boolean;
};

export const CardItem = ({
  label,
  value,
  defaultValue = '---',
  copy,
  capitalize = false,
}: CardItemProps) => {
  return (
    <DataLine>
      <dl>{label}</dl>
      <dt className={capitalize ? 'capitalize' : ''}>
        {value || defaultValue}
        {copy && value && <CopyToClipboardButton textToCopy={value} />}
      </dt>
    </DataLine>
  );
};

const CREDIT_TYPE: any = {
  'post-assessment': 'Post Assessment',
  post_assessment: 'Post Assessment',
  upfront: 'Upfront',
  online: 'Online',
};

const PAYMENT_TYPE: any = {
  voucher: 'Gift Card',
  bank: 'Bank',
};

const PAYMENT_STATUS: any = {
  unpaid: 'Unpaid',
  paid: 'paid',
  redeemed: 'Redeemed',
  completed: 'paid',
};

const QuoteDetails = () => {
  const { state, getGiftCardStatus, cancelGiftCard } = useOrder();
  const { hasCancelGiftCardsPermission } = usePermission();
  const [voucherDetails, setVoucherDetails] = useState<any>([]);
  const {
    order = {},
    giftCard = {},
    isFetchingGiftCard,
    isUpdatingGiftCard,
  } = state;
  const [activeGiftCard, setActiveGiftCard] = useState();

  const userId = order?.user_id || {};
  const address = order?.address || {};
  const orderItems = order?.order_items || [];
  const payment = order?.payment || {};
  const bankDetails = userId?.bank_details || [];

  const completeAddress = [
    address?.line_1,
    address?.suburb,
    address?.city,
    address?.zipcode,
    address?.state,
  ].join(', ');
  const accountName = bankDetails ? bankDetails[0]?.account_name : '';
  const fullName = `${userId?.first_name} ${userId?.last_name}`;
  const products = orderItems.map((item: OrderItems, idx: number) => {
    return <Badge key={idx}>{item?.product_name}</Badge>;
  });
  const hasGiftCard =
    payment?.payment_type === 'voucher' || !isEmpty(voucherDetails);

  const refreshGiftCardStatus = (voucher: any) => {
    const params = {
      pan: voucher?.pan,
      pin: voucher?.pin,
      txId: voucher?.txId,
      currency: voucher?.currency,
    };
    setActiveGiftCard(voucher?.pan);
    getGiftCardStatus(order?._id, params);
  };

  const onCancelGiftCard = (voucher: any, id: number) => {
    setActiveGiftCard(voucher?.pan);
    cancelGiftCard(order?._id, voucher?.pan);
  };

  const giftCardStatus = (voucher: any, id: number) => {
    return (
      <div className="flex items-center justify-between gap-2">
        {(isFetchingGiftCard || isUpdatingGiftCard) &&
        voucher.pan === activeGiftCard ? (
          'Loading...'
        ) : (
          <>
            {voucher?.status || '---'}
            <div className="flex items-center gap-2">
              <StyledIcon
                icon={faRefresh}
                color="#666666"
                onClick={() => refreshGiftCardStatus(voucher)}
              />
              {(voucher?.provider === 'ezipay' ||
                voucher?.provider === 'blackhawk') && (
                <button
                  className="bg-red-500 py-[2px] px-2 rounded text-xs text-white place-self-end self-end"
                  onClick={() => onCancelGiftCard(voucher, id)}
                  disabled={isUpdatingGiftCard}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (payment?.additional_info && payment?.additional_info?.length > 0) {
      // clarify how to handle multiple vouchers
      const vouchers: any = [];
      payment?.additional_info.forEach((voucher: any) => {
        let params = {};
        if (voucher?.voucherProvider === 'prezzee') {
          params = {
            pan: voucher?.voucherUuid,
            txId: voucher?.voucherReference,
            currency: voucher?.voucherCurrency,
            amount: voucher?.voucherBalance,
            status: voucher?.vouchersStatus,
            itemNumber: voucher?.voucherOrderNumber,
            provider: voucher?.voucherProvider,
          };
        } else {
          params = {
            pan: voucher?.voucherPan,
            pin: voucher?.voucherPin,
            txId: voucher?.voucherReference,
            currency: voucher?.voucherCurrency,
            amount: voucher?.voucherBalance,
            status: voucher?.voucherStatus,
            itemNumber: voucher?.voucherOrderNumber,
            provider: voucher?.voucherProvider,
          };
        }
        vouchers.push(params);
      });
      setVoucherDetails(vouchers);
    }
  }, [order, payment]);

  useEffect(() => {
    if (!isEmpty(giftCard)) {
      let voucher = {};
      let index = -1;
      voucherDetails.forEach((item: any, idx: number) => {
        if (item.pan === activeGiftCard) {
          voucher = item;
          index = idx;
        }
      });
      if (index !== -1) {
        const vouchers = [...voucherDetails];
        vouchers[index] = {
          ...voucher,
          amount: giftCard?.balance?.currency?.balance,
          status: giftCard?.status || giftCard?.resulttext,
        };
        setVoucherDetails(vouchers);
      }
    }
  }, [giftCard]);

  return (
    <div
      className={`grid md:grid-cols-1 lg:grid-cols-2 gap-2 ${!hasGiftCard && '2xl:grid-cols-3'}`}
    >
      <DetailCardContainer className="lg:col-span-2 2xl:col-span-1">
        <h4>Quote Information</h4>
        <CardItem label="Quote #" value={order.order_number} copy />
        <CardItem label="Quote Status" value={parseStatus(order.status)} />
        <CardItem
          label="Products"
          value={<div className="flex flex-wrap gap-1">{products}</div>}
        />
        <CardItem
          label="Date Created"
          value={formatDate(order.createdAt, 'DD/MM/YYYY HH:mm A')}
        />
        <CardItem
          label="Last Updated"
          value={formatDate(order.updatedAt, 'DD/MM/YYYY HH:mm A')}
        />
        <CardItem capitalize label="Order Type" value={order?.order_type} />
      </DetailCardContainer>
      <DetailCardContainer className="lg:col-span-1">
        <h4>Account Information</h4>
        <CardItem label="Name" value={fullName} copy />
        <CardItem label="Address" value={completeAddress} copy />
        <CardItem label="Email" value={userId?.email} copy />
        <CardItem
          label="Email Verified"
          value={userId?.is_verified ? 'Yes' : 'No'}
        />
        <CardItem label="Mobile" value={userId?.mobile_number} copy />
        <CardItem label="Account" value={accountName} copy />
      </DetailCardContainer>
      <DetailCardContainer className="lg:col-span-1">
        <h4>Payment Details</h4>
        <CardItem
          label="Credit Timeframe"
          value={CREDIT_TYPE[order.credit_type]}
        />
        <CardItem
          label="Payment Status"
          value={PAYMENT_STATUS[payment.payment_status]}
          defaultValue={PAYMENT_STATUS.unpaid}
          capitalize
        />
        <CardItem
          label="Payment Type"
          value={PAYMENT_TYPE[payment?.payment_type]}
          capitalize
        />
        <CardItem
          label="Bank Account Name"
          value={order?.consumer_bank_details?.account_name}
          copy
        />
        <CardItem
          label="Bank Account Number"
          value={order?.consumer_bank_details?.account_number}
          copy
        />
        <CardItem
          label="Bank BSB"
          value={order?.consumer_bank_details?.bsb}
          copy
        />
      </DetailCardContainer>
      {hasGiftCard && (
        <DetailCardContainer className="lg:col-span-2 2xl:col-span-1">
          <h4>Gift Card</h4>
          <div className="w-full mx-auto">
            <div className="overflow-x-auto max-w-full pb-2 text-sm">
              <table className="w-full text-nowrap border-t-[1px]">
                <thead className="text-left text-gray-700">
                  <th className="p-2 font-medium">Order Item Number</th>
                  <th className="p-2 font-medium">Card PAN</th>
                  <th className="p-2 font-medium">Balance</th>
                  <th className="p-2 font-medium">Status</th>
                </thead>
                {voucherDetails.map((voucher: any, idx: number) => (
                  <tr className="border-t-[1px]" key={idx}>
                    <td className="p-2">{voucher?.itemNumber}</td>
                    <td className="p-2">{voucher?.pan}</td>
                    <td className="p-2">
                      {amountFormatter(voucher?.amount / 100)}
                    </td>
                    <td className="p-2">{giftCardStatus(voucher, idx)}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </DetailCardContainer>
      )}
    </div>
  );
};

export default QuoteDetails;
