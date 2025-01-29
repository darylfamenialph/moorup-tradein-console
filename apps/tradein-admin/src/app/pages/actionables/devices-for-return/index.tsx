/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_DEVICES_FOR_RETURN_COLUMNS,
  ACTIONS_COLUMN,
  Column,
  CustomizeColumns,
  Divider,
  IconButton,
  MODAL_TYPES,
  OrderItemStatus,
  PageSubHeader,
  Pages,
  SideModal,
  Table,
  actionablesDevicesForReturnParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
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
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_FOR_RETURN
    ];
  const defaultColumns = [
    ...ACTIONABLES_DEVICES_FOR_RETURN_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

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

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_FOR_RETURN
            }
            defaultColumns={headers}
            onSave={(newColumns: Column[]) => {
              setHeaders(newColumns);
              setSideModalState({
                ...sideModalState,
                open: false,
                view: null,
              });
            }}
          />
        );

      default:
        return;
    }
  };

  const onCloseSideModal = () => {
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });
  };

  return (
    <>
      <PageSubHeader
        withSearch
        rightControls={
          <>
            <IconButton
              tooltipLabel="Customize Columns"
              icon={faSliders}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Devices For Return"
        isLoading={isFetchingOrderItems || isUpdatingOrderItem}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesDevicesForReturnParsingConfig}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
