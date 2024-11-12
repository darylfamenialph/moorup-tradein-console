/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ACTIONABLES_MANAGEMENT_COLUMNS,
  ACTIONS_COLUMN,
  OrderItemStatus,
  PageSubHeader,
  ProductTypes,
  // ProductTypes,
  Table,
  actionablesManagementParsingConfig,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function ActionablesPage() {
  const { hasPrintLabelPermission } = usePermission();
  const {
    state,
    getOrderItems,
    clearOrderItems,
    printLabels,
    printOutboundLabel,
    updateOrderItemsStatus,
  } = useOrder();
  const { state: authState } = useAuth();
  const { orderItems, isFetchingOrderItems } = state;
  const { activePlatform, userDetails } = authState;

  const [shippingStatus, setShippingStatus] = useState('todo');

  const headers = [
    ...ACTIONABLES_MANAGEMENT_COLUMNS,
    ...(hasPrintLabelPermission ? ACTIONS_COLUMN : []),
  ];

  const filters = {
    status: [OrderItemStatus.CREATED, OrderItemStatus.REVISION_REJECTED]?.join(
      ',',
    ),
    shipping_status: shippingStatus,
  };

  const addPrintLabelAction = (orderItems: any) => {
    return orderItems
      .filter(
        (orderItem: any) =>
          orderItem?.order_items?.product_type === ProductTypes.TABLETS ||
          orderItem?.order_items?.product_type === ProductTypes.LAPTOPS ||
          orderItem?.order_items?.product_type === ProductTypes.GAME_CONSOLES,
      )
      .map((orderItem: any) => ({
        ...orderItem,
        action: () =>
          printLabels({
            item_id: orderItem?.order_items?._id,
            admin_id: userDetails?._id,
          }),
        printLabelAction: () => {
          printLabels({
            item_id: orderItem?.order_items?._id,
            admin_id: userDetails?._id,
          });
          clearOrderItems({});
          const controller = new AbortController();
          const signal = controller.signal;
          getOrderItems(filters, signal);
        },
        returnDeviceAction: () => {
          toast.info('Make sure to Download or Save a copy on your device.', {
            onClose: async () => {
              await updateOrderItemsStatus(orderItem?.order_items?._id, {
                status: OrderItemStatus.DEVICE_RETURNED,
                admin_id: userDetails?._id,
              });
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

  // const addPrintLabelAction = (orderItems: any) => {
  //   const filteredOrderItems = orderItems.filter(
  //     (orderItem: any) =>
  //       orderItem?.order_items?.status === OrderItemStatus.REVISION_REJECTED,
  //     //  ||
  //     // ((orderItem?.order_items?.product_type === ProductTypes.TABLETS ||
  //     //   orderItem?.order_items?.product_type === ProductTypes.LAPTOPS) &&
  //     //   orderItem?.order_items?.status === OrderItemStatus.CREATED),
  //   );
  //   return filteredOrderItems.map((orderItem: any) => ({
  //     ...orderItem,
  //     action: () => printLabels({ item_id: orderItem?.order_items?._id }),
  //     printLabelAction: () =>
  //       printLabels({ item_id: orderItem?.order_items?._id }),
  //     returnDeviceAction: () => {
  //       toast.info('Make sure to Download or Save a copy on your device.', {
  //         onClose: async () => {
  //           await updateOrderItemsStatus(orderItem?.order_items?._id, {
  //             status: OrderItemStatus.DEVICE_RETURNED,
  //           });
  //           printOutboundLabel({ item_id: orderItem?.order_items?._id });
  //           clearOrderItems({});

  //           const controller = new AbortController();
  //           const signal = controller.signal;
  //           getOrderItems(filters, signal);
  //         },
  //       });
  //     },
  //   }));
  // };

  const formattedOrderItems = addPrintLabelAction(orderItems || []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getOrderItems(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrderItems({});
    };
  }, [activePlatform, shippingStatus]);

  return (
    <>
      <PageSubHeader withSearch />
      <Table
        label="Actionables"
        isLoading={isFetchingOrderItems}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesManagementParsingConfig}
        filterControls={
          <div className="flex gap-2">
            <button
              className={`px-4 py-1 rounded-md font-medium text-sm ${shippingStatus === 'todo' ? 'bg-emerald-800 text-white' : 'bg-green-100 text-green-600'}`}
              onClick={() => setShippingStatus('todo')}
            >
              TODO
            </button>
            <button
              className={`px-4 py-1 rounded-md font-medium text-sm ${shippingStatus === 'done' ? 'bg-emerald-800 text-white' : 'bg-green-100 text-green-600'} `}
              onClick={() => setShippingStatus('done')}
            >
              DONE
            </button>
          </div>
        }
      />
    </>
  );
}
