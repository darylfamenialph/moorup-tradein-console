/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  Column,
  CustomizeColumns,
  Divider,
  Dropdown,
  IconButton,
  MODAL_TYPES,
  ORDER_FILTERS_TABS,
  ORDER_MANAGEMENT_COLUMNS,
  PageSubHeader,
  SideModal,
  Table,
  Tags,
  orderManagementParsingConfig,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function OrderManagementPage() {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { activePlatform, platformConfig } = authState;
  const { state, fetchOrders, clearOrders, clearOrder } = useOrder();
  const { orders, isFetchingOrders } = state;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const { hasViewOrderDetailsPermission, hasViewTestOrders } = usePermission();

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_ORDERS];
  const defaultColumns = [...ORDER_MANAGEMENT_COLUMNS];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  const addViewUrlToOrders = (orders: any) => {
    const filteredOrders = hasViewTestOrders
      ? orders
      : orders.filter((order: any) => {
          return !order?.tag?.includes(Tags.TEST);
        });

    return filteredOrders.map((order: any) => ({
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

    if (!isEmpty(activePlatform)) fetchOrders({ tag: Tags.LIVE }, signal);

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrders();
      setSearchTerm('');
    };
  }, [activePlatform]);

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_ORDERS:
        return (
          <CustomizeColumns
            storageKey={MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_ORDERS}
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

  const pageTabs: any = hasViewTestOrders
    ? [...ORDER_FILTERS_TABS]
    : [...ORDER_FILTERS_TABS.filter((filter) => filter.value !== Tags.TEST)];

  const handleSelectTab = (value: any) => {
    switch (value) {
      case Tags.TEST:
        clearOrders();
        setSearchTerm('');
        fetchOrders({ tag: Tags.TEST });
        break;

      case Tags.ALL:
        clearOrders();
        setSearchTerm('');
        fetchOrders({});
        break;

      case Tags.LIVE:
        clearOrders();
        setSearchTerm('');
        fetchOrders({ tag: Tags.LIVE });
        break;

      case Tags.DONATED:
        clearOrders();
        setSearchTerm('');
        fetchOrders({ tag: Tags.DONATED });
        break;

      default:
        throw new Error('Case Exception');
    }
  };

  return (
    <>
      <PageSubHeader
        withSearch
        courierCode={platformConfig?.courier}
        tabs={
          <Dropdown
            key={activePlatform}
            defaultLabel="Live"
            loading={isFetchingOrders}
            menuItems={pageTabs}
            onSelect={handleSelectTab}
          />
        }
        rightControls={
          <>
            <IconButton
              tooltipLabel="Customize Columns"
              icon={faSliders}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_ORDERS,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Orders"
        isLoading={isFetchingOrders}
        headers={headers}
        rows={ordersWithViewUrl || []}
        parsingConfig={orderManagementParsingConfig}
        menuItems={[
          {
            label: 'View',
            action: (value: any) => {
              navigate(`/dashboard/order/${value._id}`);
            },
          },
        ]}
        onRowClick={(value: any) => {
          clearOrder();
          navigate(`/dashboard/order/${value._id}`);
        }}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
