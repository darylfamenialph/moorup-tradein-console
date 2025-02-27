/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppButton,
  ButtonWrapper,
  DetailCardContainer,
  LabelPrintPreview,
  MODAL_TYPES,
  OrderItemStatus,
  OrderItems,
  PRODUCT_TYPES,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { DeviceSection } from './sections';
import OfferSection from './sections/offer-section';
import { ShippingSection } from './sections/shipping-section';

type CollectionProps = {
  orderId: string;
  order: any;
  orderItems: OrderItems[];
  isSingleOrderFlow: boolean;
  setGenericModal: (type: string) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const Collection = ({
  orderId,
  order,
  orderItems,
  isSingleOrderFlow,
  setGenericModal,
  setSelectedItem,
}: CollectionProps) => {
  const {
    hasUpdateOrderItemStatusPermission,
    hasMarkAsReceivedPermission,
    hasCancelItemPermission,
    hasResendLabelPermission,
    hasPrintLabelPermission,
  } = usePermission();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>(null);

  const handleAction = (orderItem: OrderItems, type: string) => {
    setSelectedItem(orderItem);
    setGenericModal(type);
  };

  const isBoxRequired = (productType: any) => {
    return [PRODUCT_TYPES.LAPTOPS, PRODUCT_TYPES.TABLETS].includes(productType);
  };

  const getItemShipment = (orderItem: OrderItems) => {
    const shipments = orderItem?.shipment_details || [];

    return shipments?.find((shipment) => shipment?.direction === 'return');
  };

  return (
    <div className="grid min-[2560px]:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 p-2.5 items-start">
      {orderItems?.map((item: OrderItems, idx) => {
        const shipment = getItemShipment(item);
        const isCancelled = item.status === OrderItemStatus.CANCELLED;

        // Shipment-related Actions
        const shipmentActions = [];
        if (!isEmpty(shipment)) {
          if (hasMarkAsReceivedPermission) {
            shipmentActions.push(
              <AppButton
                onClick={() => handleAction(item, MODAL_TYPES.MARK_AS_RECEIVED)}
              >
                Mark as Received
              </AppButton>,
            );
          }

          if (isBoxRequired(item?.product_type) && hasPrintLabelPermission) {
            shipmentActions.push(
              <AppButton
                onClick={() => handleAction(item, MODAL_TYPES.SEND_BOX)}
              >
                Send Box
              </AppButton>,
            );
          }
        } else {
          if (isSingleOrderFlow && hasResendLabelPermission) {
            shipmentActions.push(
              <AppButton
                onClick={() => handleAction(item, MODAL_TYPES.RESEND_LABEL)}
              >
                Resend Label
              </AppButton>,
            );
          }
        }

        // Order Item Actions
        const orderItemActions = [
          <>
            <AppButton
              onClick={() => {
                setShowPreview(true);
                setCurrentOrderItem(item);
              }}
            >
              Print Device Details
            </AppButton>
            <LabelPrintPreview
              order={order}
              orderItem={currentOrderItem}
              showPreview={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </>,
        ];
        if (hasUpdateOrderItemStatusPermission) {
          orderItemActions.push(
            <AppButton
              onClick={() =>
                handleAction(item, MODAL_TYPES.UPDATE_DEVICE_STATUS)
              }
            >
              Update Device Status
            </AppButton>,
          );
        }

        if (!isCancelled && hasCancelItemPermission) {
          orderItemActions.push(
            <AppButton
              variant="error"
              onClick={() => handleAction(item, MODAL_TYPES.CANCEL_ITEM)}
            >
              Cancel Item
            </AppButton>,
          );
        }

        return (
          <DetailCardContainer key={idx} className="min-w-fit flex gap-2">
            <DeviceSection orderItem={item} orderId={orderId} />
            <OfferSection orderItem={item} />
            <ShippingSection orderItem={item} />
            {shipmentActions.length > 0 && !isCancelled && (
              <>
                <hr />
                <ButtonWrapper>{shipmentActions}</ButtonWrapper>
              </>
            )}
            {orderItemActions.length > 0 && (
              <>
                <hr />
                <ButtonWrapper>{orderItemActions}</ButtonWrapper>
              </>
            )}
          </DetailCardContainer>
        );
      })}
    </div>
  );
};

export default Collection;
