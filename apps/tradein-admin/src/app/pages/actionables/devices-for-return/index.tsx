/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ACTIONABLES_DEVICES_FOR_RETURN_COLUMNS,
  ACTIONS_COLUMN,
  OrderItemStatus,
  PageSubHeader,
  Pages,
  Table,
  actionablesDevicesForReturnParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export function DevicesForReturnPage() {
  const {
    state: orderState,
    getOrderItems,
    clearOrderItems,
    updateOrderItemsStatus,
    printOutboundLabel,
  } = useOrder();
  const { isFetchingOrderItems, orderItems, isUpdatingOrderItem } = orderState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { setSearchTerm } = useCommon();

  const headers = [
    ...ACTIONABLES_DEVICES_FOR_RETURN_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const filters = {
    page: Pages.DEVICES_FOR_RETURN,
  };

  const addActions = (orderItems: any) => {
    return orderItems.map((orderItem: any) => ({
      ...orderItem,
      returnDeviceAction: () => {
        toast.info('Make sure to Download or Save a copy on your device.', {
          onClose: async () => {
            await updateOrderItemsStatus(
              orderItem?.order_items?._id,
              {
                status: OrderItemStatus.RETURNED,
                admin_id: userDetails?._id,
              },
              filters,
            );
            printOutboundLabel({
              item_id: orderItem?.order_items?._id,
              admin_id: userDetails?._id,
            });
            clearOrderItems({});

            const controller = new AbortController();
            const signal = controller.signal;
            getOrderItems(filters, signal);
          },
        });
      },
    }));
  };

  const formattedOrderItems = addActions(orderItems || []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getOrderItems(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      setSearchTerm('');
      clearOrderItems([]);
    };
  }, [activePlatform]);

  return (
    <>
      <PageSubHeader withSearch />
      <Table
        label="Devices For Return"
        isLoading={isFetchingOrderItems || isUpdatingOrderItem}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesDevicesForReturnParsingConfig}
      />
    </>
  );
}
