import {
  CopyToClipboardButton,
  formatSlug,
  OrderItems,
} from '@tradein-admin/libs';
import { CardDetail } from './card-detail';

export const DeviceSection = ({
  orderItem,
  orderId,
}: {
  orderItem: OrderItems;
  orderId: string;
}) => {
  return (
    <div>
      <h3 className="sm:col-span-2 mb-2 font-bold text-primary">
        <a
          href={orderItem.product_variant_id?.image_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {orderItem.product_variant_id?.name}
        </a>
        <CopyToClipboardButton
          textToCopy={orderItem.product_variant_id?.name}
        />
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 items-start md:items-center">
        <img
          className="w-28"
          src={orderItem?.product_variant_id?.image_url}
          alt={orderItem?.product_variant_id?.sku}
        />
        <div className="grid grid-cols-1 sm:grid-cols-fitLabel sm:gap-2 max-w-[360px]">
          <CardDetail
            label="IMEI/Serial"
            value={orderItem?.imei_serial}
            orderItem={orderItem}
            orderId={orderId}
            copy
            edit={orderItem?.status !== 'evaluated'}
          />
          <CardDetail
            label="TI SKU"
            value={orderItem?.product_variant_id?.sku}
            copy
          />
          <CardDetail
            label="Device ID"
            value={orderItem?.line_item_number}
            copy
          />
          <CardDetail
            label="Device Status"
            value={formatSlug(orderItem?.status)}
          />
        </div>
      </div>
    </div>
  );
};
