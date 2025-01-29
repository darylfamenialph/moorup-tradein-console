/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_DEVICE_CREDIT_CHARGE_NEEDED,
  ACTIONS_COLUMN,
  Column,
  CustomizeColumns,
  Divider,
  IconButton,
  MODAL_TYPES,
  PageSubHeader,
  Pages,
  SideModal,
  Table,
  actionablesDeviceCreditChargeNeededParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function DeviceCreditChargeNeededPage() {
  const {
    state: orderState,
    getOrderItems,
    clearOrderItems,
    requestOrderItemPayment,
  } = useOrder();
  const { isFetchingOrderItems, orderItems, isUpdatingOrderItemPaymentStatus } =
    orderState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_PAYMENT_ACTION_NEEDED
    ];
  const defaultColumns = [
    ...ACTIONABLES_DEVICE_CREDIT_CHARGE_NEEDED,
    ...ACTIONS_COLUMN,
  ];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  const filters = {
    page: Pages.PAYMENT_ACTION_NEEDED,
  };

  const addActions = (orderItems: any) => {
    return orderItems.map((orderItem: any) => ({
      ...orderItem,
      requestPayment: () =>
        requestOrderItemPayment(
          {
            item_id: orderItem?.order_items?._id,
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
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_PAYMENT_ACTION_NEEDED:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_PAYMENT_ACTION_NEEDED
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_PAYMENT_ACTION_NEEDED,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Payment Action Needed"
        isLoading={isFetchingOrderItems || isUpdatingOrderItemPaymentStatus}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesDeviceCreditChargeNeededParsingConfig}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
