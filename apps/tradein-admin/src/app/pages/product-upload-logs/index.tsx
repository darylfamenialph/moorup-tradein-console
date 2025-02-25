/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  Column,
  CustomizeColumns,
  Divider,
  IconButton,
  MODAL_TYPES,
  PRODUCT_UPLOAD_LOGS_COLUMNS,
  PageSubHeader,
  SideModal,
  Table,
  productUploadLogsParsingConfig,
  useAuth,
  useCommon,
  useProduct,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function ProductUploadLogsPage() {
  const { state, getProductUploadLogs, clearProductUploadLogs } = useProduct();
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const { state: authState } = useAuth();
  const { isFetchingProductUploadLogs, productUploadLogs } = state;
  const { activePlatform } = authState;

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_PRODUCT_MANAGEMENT_UPLOAD_LOGS
    ];
  const defaultColumns = [...PRODUCT_UPLOAD_LOGS_COLUMNS];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getProductUploadLogs({}, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearProductUploadLogs({});
      setSearchTerm('');
    };
  }, [activePlatform]);

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_PRODUCT_MANAGEMENT_UPLOAD_LOGS:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_PRODUCT_MANAGEMENT_UPLOAD_LOGS
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_PRODUCT_MANAGEMENT_UPLOAD_LOGS,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Product Upload Logs"
        isLoading={isFetchingProductUploadLogs}
        headers={headers}
        rows={productUploadLogs || []}
        parsingConfig={productUploadLogsParsingConfig}
      />
      <SideModal isOpen={sideModalState?.open} onClose={onCloseSideModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
