/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
    ACTIONS_COLUMN,
    InventoryStatus,
    PageSubHeader,
    Pages,
    Table,
    actionablesDevicesForInventoryParsingConfig,
    useAuth,
    useCommon,
    useOrder,
  } from '@tradein-admin/libs';
  import { isEmpty } from 'lodash';
  import { useEffect } from 'react';
  
  export function DevicesForInventoryPage() {
    const {
      state: orderState,
      getOrderItems,
      clearOrderItems,
      updateDeviceInventoryStatus,
    } = useOrder();
    const { isFetchingOrderItems, orderItems, isUpdatingDeviceInventoryStatus } = orderState;
    const { state: authState } = useAuth();
    const { activePlatform, userDetails } = authState;
    const { setSearchTerm } = useCommon();
  
    const headers = [
      ...ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
      ...ACTIONS_COLUMN,
    ];
  
    const filters = {
      inventory_status: InventoryStatus.IN_INVENTORY,
    };
  
    const addActions = (orderItems: any) => {
      return orderItems.map((orderItem: any) => ({
        ...orderItem,
        takeOutOfInventoryAction: () =>
          updateDeviceInventoryStatus(
            orderItem?.order_items?._id,
            {
              inventory_status: InventoryStatus.OUT_OF_INVENTORY,
            },
            filters
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
  
    return (
      <>
        <PageSubHeader withSearch />
        <Table
          label="Devices For Inventory"
          isLoading={isFetchingOrderItems || isUpdatingDeviceInventoryStatus}
          headers={headers}
          rows={formattedOrderItems || []}
          parsingConfig={actionablesDevicesForInventoryParsingConfig}
        />
      </>
    );
  }
  