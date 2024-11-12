/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ORDER_MANAGEMENT_COLUMNS,
  PageSubHeader,
  Table,
  orderManagementParsingConfig,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function OrderManagementPage() {
  const navigate = useNavigate();
  const {
    state: authState,
    getPlatformConfig,
    clearPlatformConfig,
  } = useAuth();
  const { activePlatform, platformConfig } = authState;
  const { state, fetchOrders, clearOrders } = useOrder();
  const { orders, isFetchingOrders } = state;
  const { setSearchTerm } = useCommon();
  const { hasViewOrderDetailsPermission } = usePermission();

  const headers = [...ORDER_MANAGEMENT_COLUMNS];

  const addViewUrlToOrders = (orders: any) => {
    return orders.map((order: any) => ({
      ...order,
      ...(hasViewOrderDetailsPermission && {
        viewURL: `/dashboard/order/${order._id}`,
      }),
    }));
  };

  const ordersWithViewUrl = addViewUrlToOrders(orders || []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform) || isEmpty(platformConfig)) {
      fetchOrders(signal);
      getPlatformConfig(activePlatform, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrders();
      setSearchTerm('');
      clearPlatformConfig({});
    };
  }, [activePlatform]);

  return (
    <>
      <PageSubHeader withSearch courierCode={platformConfig?.courier} />
      <Table
        label="Orders"
        isLoading={isFetchingOrders}
        headers={headers}
        rows={ordersWithViewUrl || []}
        parsingConfig={orderManagementParsingConfig}
        menuItems={[
          {
            label: 'View',
            action: (value: any) => navigate(`/dashboard/order/${value._id}`),
          },
        ]}
      />
    </>
  );
}
