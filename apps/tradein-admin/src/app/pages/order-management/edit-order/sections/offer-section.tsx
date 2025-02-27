import { amountFormatter, OrderItems, parseStatus } from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { CardDetail } from './card-detail';

const OfferSection = ({ orderItem }: { orderItem: OrderItems }) => {
  const { original_offer, revision = {}, payment_status } = orderItem;

  return (
    <div>
      <hr />
      <h4>Device Payment</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mt-2 mb-1">
        <CardDetail
          label="Original Quote"
          value={`$ ${amountFormatter(original_offer)}`}
        />
        <CardDetail
          label="Final Offer"
          value={
            !isEmpty(revision)
              ? `$ ${amountFormatter(revision?.price)}`
              : `$ ${amountFormatter(original_offer)}`
          }
        />
        <CardDetail
          label="Payment Status"
          value={payment_status ? parseStatus(payment_status) : '--'}
        />
      </div>
    </div>
  );
};

export default OfferSection;
