/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  Column,
  CustomizeColumns,
  DISCREPANCY_MANAGEMENT_COLUMNS,
  Divider,
  IconButton,
  MODAL_TYPES,
  PRODUCT_TYPES,
  PageSubHeader,
  SideModal,
  Table,
  discrepancyManagementParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function DiscrepancyPage() {
  const { state: authState } = useAuth();
  const { activePlatform } = authState;
  const { state, getOrderItems, clearOrderItems } = useOrder();
  const { orderItems, isFetchingOrderItems } = state;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_DISCREPANCY
    ];
  const defaultColumns = [...DISCREPANCY_MANAGEMENT_COLUMNS];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  useEffect(() => {
    const filters = {
      status: 'revised',
      product_type: [
        PRODUCT_TYPES.LAPTOPS,
        PRODUCT_TYPES.TABLETS,
        PRODUCT_TYPES.PHONES,
        PRODUCT_TYPES.WATCHES,
      ].join(','),
    };

    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getOrderItems(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrderItems({});
      setSearchTerm('');
    };
  }, [activePlatform]);

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_DISCREPANCY:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_DISCREPANCY
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_DISCREPANCY,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Discrepancy"
        isLoading={isFetchingOrderItems}
        headers={headers}
        rows={orderItems || []}
        parsingConfig={discrepancyManagementParsingConfig}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
