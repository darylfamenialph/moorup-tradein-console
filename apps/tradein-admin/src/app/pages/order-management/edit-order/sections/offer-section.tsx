import { isEmpty } from 'lodash';
import { CardDetail } from './card-detail';
import { amountFormatter, OrderItems } from '@tradein-admin/libs';

const OfferSection = ({ orderItem }: { orderItem: OrderItems }) => {
  const { original_offer, revision = {} } = orderItem;
  return (
    <div>
      <hr />
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
      </div>
    </div>
  );
};

export default OfferSection;
