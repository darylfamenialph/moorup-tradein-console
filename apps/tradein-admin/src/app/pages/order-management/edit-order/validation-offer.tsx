/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppButton,
  ButtonWrapper,
  DetailCardContainer,
  formatAssessment,
  InventoryStatus,
  LabelPrintPreview,
  OrderItems,
  OrderItemStatus,
  parseStatus,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { capitalize } from 'lodash';
import { useState } from 'react';
import { CardDetail, DeviceSection } from './sections';
import OfferSection from './sections/offer-section';
import { ShippingSection } from './sections/shipping-section';

type ValidationOfferProps = {
  orderId: any;
  order: any;
  orderItems: OrderItems[];
  setGenericModal: React.Dispatch<React.SetStateAction<string>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const ValidationOffer = ({
  orderId,
  order,
  orderItems,
  setGenericModal,
  setSelectedItem,
}: ValidationOfferProps) => {
  const { state, printOutboundLabel, patchOrderItemById } = useOrder();
  const {
    hasUpdateOrderItemStatusPermission,
    hasPrintLabelPermission,
    hasTakeDeviceForInventoryPermission,
  } = usePermission();
  const { isGeneratingLabels } = state;
  const { state: authState } = useAuth();
  const { userDetails } = authState;
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>(null);

  const handlePrintLabel = (orderItemId: any) => {
    printOutboundLabel({
      item_id: orderItemId,
      admin_id: userDetails?._id,
    });

    patchOrderItemById(orderItemId, {
      status: OrderItemStatus.RETURNED,
      admin_id: userDetails?._id,
    });
  };

  const handleStatus = (item: OrderItems) => {
    setGenericModal('edit-form');
    setSelectedItem(item);
  };

  const handleSetLockType = (item: OrderItems) => {
    setGenericModal('set-lock-type');
    setSelectedItem(item);
  };

  const handleTakeDeviceForInventory = (item: OrderItems) => {
    setGenericModal('take-for-inventory');
    setSelectedItem(item);
  };

  return (
    <div className="grid min-[2560px]:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 p-2.5 items-start">
      {orderItems?.map((item: OrderItems, idx) => {
        const { questions_answered = [] } = item;

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

        if (item.status === OrderItemStatus.REVISION_REJECTED) {
          if (hasPrintLabelPermission) {
            orderItemActions.push(
              <AppButton
                onClick={() => handlePrintLabel(item?._id)}
                disabled={isGeneratingLabels}
              >
                Return Device
              </AppButton>,
            );
          }
        }

        if (item.status === OrderItemStatus.RECEIVED) {
          orderItemActions.push(
            <AppButton onClick={() => handleSetLockType(item)}>
              Set Lock Type
            </AppButton>,
          );
        }

        if (hasUpdateOrderItemStatusPermission) {
          orderItemActions.push(
            <AppButton onClick={() => handleStatus(item)}>
              Update Status
            </AppButton>,
          );
        }

        if (
          hasTakeDeviceForInventoryPermission &&
          item.inventory_status !== InventoryStatus.IN_INVENTORY
        ) {
          orderItemActions.push(
            <AppButton onClick={() => handleTakeDeviceForInventory(item)}>
              Take for Inventory
            </AppButton>,
          );
        }

        return (
          <DetailCardContainer key={idx} className="min-w-fit flex gap-2">
            <DeviceSection orderItem={item} orderId={orderId} />
            <OfferSection orderItem={item} />
            <ShippingSection orderItem={item} />
            <hr />
            <div>
              <h4>Validation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {questions_answered?.map((item, idx) => {
                  return (
                    <CardDetail
                      key={idx}
                      label={
                        formatAssessment(item.question, item.answer)
                          .formattedQuestion
                      }
                      value={parseStatus(
                        formatAssessment(item.question, item.answer)
                          .formattedAnswer,
                        '150px',
                      )}
                    />
                  );
                })}
              </div>
            </div>
            {item?.lock && (
              <>
                <hr />
                <div>
                  <h4>Lock Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <CardDetail
                      key={idx}
                      label="Lock Status"
                      value={capitalize(item?.lock?.status)}
                    />
                    <CardDetail
                      key={idx}
                      label="Lock Type"
                      value={capitalize(item?.lock?.type)}
                    />
                  </div>
                </div>
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

export default ValidationOffer;
