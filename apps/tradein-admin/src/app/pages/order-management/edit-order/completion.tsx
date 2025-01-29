/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppButton,
  ButtonWrapper,
  DetailCardContainer,
  formatAssessment,
  LabelPrintPreview,
  OrderItems,
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
  setGenericModal: React.Dispatch<React.SetStateAction<string>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const Completion = ({
  orderId,
  order,
  orderItems,
  setGenericModal,
  setSelectedItem,
}: CompletionProps) => {
  const { hasUpdateOrderItemStatusPermission } = usePermission();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>(null);

  const handleStatus = (item: OrderItems) => {
    setGenericModal('edit-form');
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
            <AppButton onClick={() => handleStatus(item)}>
              Update Status
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
