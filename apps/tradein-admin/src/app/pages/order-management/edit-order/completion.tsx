/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DetailCardContainer,
  OrderItems,
  usePermission,
} from '@tradein-admin/libs';
import { CardDetail, DeviceSection } from './sections';
import OfferSection from './sections/offer-section';

type CompletionProps = {
  orderId: any;
  orderItems: OrderItems[];
  setStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderItems>>;
};

const Completion = ({
  orderId,
  orderItems,
  setStatusModal,
  setSelectedItem,
}: CompletionProps) => {
  const { hasUpdateOrderItemStatusPermission } = usePermission();

  const formatQuestion = (question: string) => {
    return question?.replace('-', ' ');
  };

  const handleStatus = (item: OrderItems) => {
    setStatusModal(true);
    setSelectedItem(item);
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

        return (
          <DetailCardContainer key={idx} className="min-w-fit flex gap-2">
            <DeviceSection orderItem={item} orderId={orderId} />
            <OfferSection orderItem={item} />
            <hr />
            <div>
              <h4>Validation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {questions_answered.map((item, idx) => {
                  return (
                    <CardDetail
                      key={idx}
                      label={formatQuestion(item?.question)}
                      value={deviceValidation(item?.answer)}
                    />
                  );
                })}
              </div>
            </div>
            {hasUpdateOrderItemStatusPermission && (
              <>
                <hr />
                <button
                  onClick={() => handleStatus(item)}
                  className="px-3 py-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
                >
                  Update Status
                </button>
              </>
            )}
          </DetailCardContainer>
        );
      })}
    </div>
  );
};

export default Completion;
