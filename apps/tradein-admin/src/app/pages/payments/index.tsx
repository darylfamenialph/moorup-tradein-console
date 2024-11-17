/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  AppButton,
  clearOrderPaymentItems,
  Divider,
  DropdownButton,
  FormGroup,
  FormWrapper,
  IconButton,
  MODAL_TYPES,
  ORDER_PAYMENTS_MANAGEMENT_COLUMNS,
  orderPaymentParsingConfig,
  PageSubHeader,
  SideModal,
  StyledDateRange,
  Table,
  UploadFileModal,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { activePlatform } = authState;
  const {
    state,
    fetchOrderPayments,
    downloadOrderPaymentFileRange,
    importPaymentsFlatFile,
  } = useOrder();
  const {
    paymentsItem,
    isFetchingPayments,
    isDownloadingPaymentFile,
    isImportingPaymentsFlatFile,
    importPaymentsFlatFileError,
  } = state;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const [exportDate, setExportDate] = useState<any>();
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);

  const [exportDateFrom, setExportDateFrom] = useState<Date | null>(new Date());
  const [exportDateTo, setExportDateTo] = useState<Date | null>(new Date());

  const headers = [...ORDER_PAYMENTS_MANAGEMENT_COLUMNS];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      fetchOrderPayments(signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrderPaymentItems({});
      setSearchTerm('');
    };
  }, [activePlatform]);

  const onCloseModal = () => {
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    setExportDateFrom(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setExportDateTo(date);
  };

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.DOWNLOAD_FLAT_FILE:
        return (
          <FormWrapper formTitle="Export" subtTitle="Download Flat File">
            <FormGroup marginBottom="20px">
              <StyledDateRange
                startDateInput={{
                  onChange: handleStartDateChange,
                  placeholder: 'Start Date',
                  value: exportDateFrom,
                }}
                endDateInput={{
                  onChange: handleEndDateChange,
                  placeholder: 'End Date',
                  value: exportDateTo,
                }}
                label="Select date to export"
              />
            </FormGroup>
            <FormGroup>
              <span />
              <FormGroup>
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  onClick={() => onCloseModal()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() => {
                    downloadOrderPaymentFileRange({
                      platform: activePlatform,
                      'start-date': moment(exportDateFrom).format('YYYY-MM-DD'),
                      'end-date': moment(exportDateTo).format('YYYY-MM-DD'),
                    });

                    onCloseModal();
                  }}
                >
                  Export File
                </AppButton>
              </FormGroup>
            </FormGroup>
          </FormWrapper>
        );

      default:
        return;
    }
  };

  const renderAddProductAction = () => {
    const importFlatFileItems = [
      {
        label: 'Import File',
        onClick: () => setIsOpenUploadModal(true),
      },
    ];

    return (
      <DropdownButton
        id="importFlatfile"
        dropdownItems={importFlatFileItems}
        disabled={isFetchingPayments}
      >
        Import
      </DropdownButton>
    );
  };

  useEffect(() => {
    if (!isEmpty(importPaymentsFlatFileError)) {
      navigate('/dashboard/order/payments-upload-details');
    }

    return () => {
      // Clear data on unmount
      clearOrderPaymentItems({});
      setSearchTerm('');
    };
  }, [importPaymentsFlatFileError]);

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={renderAddProductAction()}
        rightControls={
          <>
            <IconButton
              tooltipLabel="Export"
              icon={faDownload}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.DOWNLOAD_FLAT_FILE,
                });
              }}
              disabled={isFetchingPayments || isDownloadingPaymentFile}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Payments"
        headers={headers}
        rows={paymentsItem || []}
        isLoading={isFetchingPayments || isImportingPaymentsFlatFile}
        parsingConfig={orderPaymentParsingConfig}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
          onCloseModal();
        }}
      >
        {renderSideModalContent()}
      </SideModal>
      <UploadFileModal
        isOpen={isOpenUploadModal}
        closeModal={() => setIsOpenUploadModal(false)}
        modalTitle="Select a file to import flat file"
        onUploadFile={importPaymentsFlatFile}
      />
    </>
  );
};
