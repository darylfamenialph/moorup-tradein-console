/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DetailCardContainer,
  OrderItemStatus,
  OrderItems,
  PRODUCT_TYPES,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { DeviceSection } from './sections';
import OfferSection from './sections/offer-section';
import { ShippingSection } from './sections/shipping-section';

type CollectionProps = {
  orderId: string;
  orderItems: OrderItems[];
  isSingleOrderFlow: boolean;
  setStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const Collection = ({
  orderId,
  orderItems,
  isSingleOrderFlow,
  setStatusModal,
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
    setStatusModal(true);
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
              <button
                onClick={() => handleReceiveOrderItem(item._id)}
                className="px-3 py-1 flex-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
              >
                Mark as Received
              </button>,
            );
          }
          if (isBoxRequired(item?.product_type) && hasPrintLabelPermission) {
            shipmentActions.push(
              <button
                onClick={() => handleSendBox(item?._id)}
                className="px-3 py-1 flex-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
              >
                Send Box
              </button>,
            );
          }
        } else {
          if (isSingleOrderFlow && hasResendLabelPermission) {
            shipmentActions.push(
              <button
                className="flex-1 text-white bg-emerald-800 py-1 px-3 rounded-md hover:bg-emerald-900"
                disabled={isResendingLabel}
                onClick={() => handleResendLabel(item._id)}
              >
                Resend Label
              </button>,
            );
          }
        }

        // Order Item Actions
        const orderItemActions = [];
        if (hasUpdateOrderItemStatusPermission) {
          orderItemActions.push(
            <button
              onClick={() => handleUpdateStatus(item)}
              className="px-3 py-1 flex-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
            >
              Update Status
            </button>,
          );
        }
        if (isSingleOrderFlow && !isCancelled && hasCancelItemPermission) {
          orderItemActions.push(
            <button
              onClick={() => handleCancelOrderItem(item._id)}
              className="px-3 py-1 flex-1 text-white bg-red-700 hover:bg-red-800 rounded-md"
            >
              Cancel Item
            </button>,
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
                <div className="flex flex-row flex-wrap gap-2 pt-1">
                  {shipmentActions}
                </div>
              </>
            )}
            {orderItemActions.length > 0 && (
              <div className="flex flex-row flex-wrap gap-2">
                {orderItemActions}
              </div>
            )}
          </DetailCardContainer>
        );
      })}
    </div>
  );
};

export default Collection;
