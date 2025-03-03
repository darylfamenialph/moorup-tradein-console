/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppButton,
  ButtonWrapper,
  DetailCardContainer,
  formatAssessment,
  LabelPrintPreview,
  MODAL_TYPES,
  OrderItems,
  OrderItemStatus,
  parseStatus,
  usePermission,
} from '@tradein-admin/libs';
import { useState } from 'react';
import { CardDetail, DeviceSection } from './sections';
import OfferSection from './sections/offer-section';
import { ShippingSection } from './sections/shipping-section';

type CompletionProps = {
  orderId: any;
  order: any;
  orderItems: OrderItems[];
  setGenericModal: (type: string) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const Completion = ({
  orderId,
  order,
  orderItems,
  setGenericModal,
  setSelectedItem,
}: CompletionProps) => {
  const { hasUpdateOrderItemStatusPermission, hasPrintLabelPermission } =
    usePermission();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>(null);

  const handleAction = (item: OrderItems, type: string) => {
    setGenericModal(type);
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

        if (item.status === OrderItemStatus.REVISION_REJECTED) {
          if (hasPrintLabelPermission) {
            orderItemActions.push(
              <AppButton
                onClick={() => handleAction(item, MODAL_TYPES.RETURN_DEVICE)}
              >
                Return Device
              </AppButton>,
            );
          }
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
                      )}
                    />
                  );
                })}
              </div>
            </div>
            {orderItemActions.length > 0 && (
              <ButtonWrapper>{orderItemActions}</ButtonWrapper>
            )}
          </DetailCardContainer>
        );
      })}
    </div>
  );
};

export default Completion;
