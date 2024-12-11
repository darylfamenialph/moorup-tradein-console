/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppButton,
  ButtonWrapper,
  DetailCardContainer,
  LabelPrintPreview,
  OrderItemStatus,
  OrderItems,
  PRODUCT_TYPES,
  useAuth,
  useOrder,
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
  setGenericModal: React.Dispatch<React.SetStateAction<string>>;
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
    state,
    receiveOrderItemById,
    cancelOrderItemById,
    resendShipmentLabel,
    sendBox,
  } = useOrder();
  const {
    hasUpdateOrderItemStatusPermission,
    hasMarkAsReceivedPermission,
    hasCancelItemPermission,
    hasResendLabelPermission,
    hasPrintLabelPermission,
  } = usePermission();
  const { state: authState } = useAuth();
  const { userDetails } = authState;
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>(null);

  const {
    isResendingLabel,
    // isUpdatingOrderItem,
  } = state;

  const handleReceiveOrderItem = (orderItemId: string) => {
    receiveOrderItemById(orderItemId, { admin_id: userDetails?._id });
  };

  const handleSendBox = (orderItemId: string) => {
    sendBox(orderId, {
      item_id: orderItemId,
      admin_id: userDetails?._id,
    });
  };

  const handleResendLabel = (orderItemId: any) => {
    resendShipmentLabel(orderItemId);
  };

  const handleUpdateStatus = (orderItem: OrderItems) => {
    setGenericModal('edit-form');
    setSelectedItem(orderItem);
  };

  const handleCancelOrderItem = (orderItemId: string) => {
    cancelOrderItemById(orderItemId);
  };

  const isBoxRequired = (productType: any) => {
    return [PRODUCT_TYPES.LAPTOPS, PRODUCT_TYPES.TABLETS].includes(productType);
  };

  const getItemShipment = (orderItem: OrderItems) => {
    const shipments = orderItem?.shipment_details || [];

    return shipments?.find((shipment) => shipment?.direction === 'return');
  };

  return (
    <div className="flex gap-2 p-2.5 items-start">
      {orderItems?.map((item: OrderItems, idx) => {
        const shipment = getItemShipment(item);
        const isCancelled = item.status === OrderItemStatus.CANCELLED;

        // Shipment-related Actions
        const shipmentActions = [];
        if (!isEmpty(shipment)) {
          if (hasMarkAsReceivedPermission) {
            shipmentActions.push(
              <AppButton onClick={() => handleReceiveOrderItem(item._id)}>
                Mark as Received
              </AppButton>,
            );
          }

          if (isBoxRequired(item?.product_type) && hasPrintLabelPermission) {
            shipmentActions.push(
              <AppButton onClick={() => handleSendBox(item?._id)}>
                Send Box
              </AppButton>,
            );
          }
        } else {
          if (isSingleOrderFlow && hasResendLabelPermission) {
            shipmentActions.push(
              <AppButton
                disabled={isResendingLabel}
                onClick={() => handleResendLabel(item._id)}
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
            <AppButton onClick={() => handleUpdateStatus(item)}>
              Update Status
            </AppButton>,
          );
        }
        if (isSingleOrderFlow && !isCancelled && hasCancelItemPermission) {
          orderItemActions.push(
            <AppButton
              variant="error"
              onClick={() => handleCancelOrderItem(item._id)}
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
