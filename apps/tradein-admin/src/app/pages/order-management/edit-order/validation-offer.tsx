/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DetailCardContainer,
  OrderItems,
  OrderItemStatus,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { capitalize } from 'lodash';
import { CardDetail, DeviceSection } from './sections';
import OfferSection from './sections/offer-section';
import { capitalize } from 'lodash';
import { ShippingSection } from './sections/shipping-section';

type ValidationOfferProps = {
  orderId: any;
  orderItems: OrderItems[];
  setStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setGenericModal: React.Dispatch<React.SetStateAction<string>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const ValidationOffer = ({
  orderId,
  orderItems,
  setStatusModal,
  setGenericModal,
  setSelectedItem,
}: ValidationOfferProps) => {
  const { state, printOutboundLabel, patchOrderItemById } = useOrder();
  const { hasUpdateOrderItemStatusPermission, hasPrintLabelPermission } =
    usePermission();
  const { isGeneratingLabels } = state;
  const { state: authState } = useAuth();
  const { userDetails } = authState;

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
    setStatusModal(true);
    setSelectedItem(item);
  };

  const handleSetLockType = (item: OrderItems) => {
    setGenericModal('set-lock-type');
    setSelectedItem(item);
  };

  const formatQuestion = (question: string) => {
    return question?.replace('-', ' ');
  };

  const deviceValidation = (item: string) => (
    <div className="flex flex-row gap-2">
      <div
        className={`text-sm px-2 rounded-md border-[1px] border-gray-400
        ${item === 'no' ? 'bg-red-500 text-white' : 'bg-white'}`}
      >
        No
      </div>
      <div
        className={`text-sm px-2 rounded-md border-[1px] border-gray-400
        ${item === 'yes' ? 'bg-green-500 text-white' : 'bg-white'}`}
      >
        Yes
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 p-2.5 items-start">
      {orderItems?.map((item: OrderItems, idx) => {
        const { questions_answered = [] } = item;

        const orderItemActions = [];
        if (item.status === OrderItemStatus.REVISION_REJECTED) {
          if (hasPrintLabelPermission) {
            orderItemActions.push(
              <button
                onClick={() => handlePrintLabel(item?._id)}
                disabled={isGeneratingLabels}
                className="px-3 py-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
              >
                Return Device
              </button>,
            );
          }
        } else if (hasUpdateOrderItemStatusPermission) {
          orderItemActions.push(
            <button
              onClick={() => handleStatus(item)}
              className="px-3 py-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
            >
              Update Status
            </button>,
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
                {questions_answered.map((item, idx) => {
                  return (
                    <CardDetail
                      key={idx}
                      label={
                        formatQuestion(item.question)?.toLocaleLowerCase() ===
                        'accessories assessment'
                          ? 'Charger Assessment'
                          : formatQuestion(item.question)
                      }
                      value={deviceValidation(item.answer)}
                    />
                  );
                  // return (
                  //   <span
                  //     key={idx}
                  //     className={`px-2 py-1 text-white rounded-md w-fit
                  //       ${item.answer === 'yes' ? 'bg-green-600' : 'bg-red-600'}
                  //     `}
                  //   >
                  //     {formatQuestion(item.question)}
                  //   </span>
                  // );
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
                {orderItemActions}
                
                 <button
                  onClick={() => handleSetLockType(item)}
                  className="px-3 py-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
                >
                  Set Lock Type
                </button>
              </>
            )}
          </DetailCardContainer>
        );
      })}
    </div>
  );
};

export default ValidationOffer;
