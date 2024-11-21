/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
    ACTIONS_COLUMN,
    InventoryStatus,
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
  
  export function DevicesForInventoryPage() {
    const {
      state: orderState,
      getOrderItems,
      clearOrderItems,
    } = useOrder();
    const { isFetchingOrderItems, orderItems, isUpdatingOrderItem } = orderState;
    const { state: authState } = useAuth();
    const { activePlatform, userDetails } = authState;
    const { setSearchTerm } = useCommon();
  
    const headers = [
      ...ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS,
      ...ACTIONS_COLUMN,
    ];
  
    const filters = {
      page: Pages.DEVICES_FOR_INVENTORY,
      inventory_status: InventoryStatus.IN_INVENTORY,
    };
  
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
          isLoading={isFetchingOrderItems || isUpdatingOrderItem}
          headers={headers}
          rows={orderItems || []}
          parsingConfig={actionablesDevicesForReturnParsingConfig}
        />
      </>
    );
  }
  