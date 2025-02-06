/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
  ACTIONS_COLUMN,
  Column,
  CustomizeColumns,
  Divider,
  IconButton,
  InventoryStatus,
  MODAL_TYPES,
  PageSubHeader,
  SideModal,
  Table,
  actionablesDevicesForInventoryParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function DevicesForInventoryPage() {
  const {
    state: orderState,
    getOrderItems,
    clearOrderItems,
    updateDeviceInventoryStatus,
  } = useOrder();
  const { isFetchingOrderItems, orderItems, isUpdatingDeviceInventoryStatus } =
    orderState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY
    ];
  const defaultColumns = [
    ...ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  const filters = {
    inventory_status: InventoryStatus.IN_INVENTORY,
  };

  const addActions = (orderItems: any) => {
    const filterOrderItemStatus = (status?: string) => {
      return !['aligned', 'revision-accepted', 'recycled'].includes(
        status || '',
      );
    };
    return orderItems
      .filter((orderItem: any) =>
        filterOrderItemStatus(orderItem?.order_items?.status),
      )
      .map((orderItem: any) => ({
        ...orderItem,
        takeOutOfInventoryAction: () =>
          updateDeviceInventoryStatus(
            orderItem?.order_items?._id,
            {
              inventory_status: InventoryStatus.OUT_OF_INVENTORY,
              admin_id: userDetails?._id,
            },
            filters,
          ),
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
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Devices For Inventory"
        isLoading={isFetchingOrderItems || isUpdatingDeviceInventoryStatus}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesDevicesForInventoryParsingConfig}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
