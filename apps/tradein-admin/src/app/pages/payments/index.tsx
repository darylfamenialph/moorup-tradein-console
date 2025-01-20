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
  Typography,
  UploadFileModal,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IssuePaymentModal from './modal-content';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    state: authState,
    getPlatformConfig,
    clearPlatformConfig,
  } = useAuth();
  const { activePlatform, platformConfig } = authState;
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
    isRequestingGiftcardPayment,
  } = state;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const [exportDate, setExportDate] = useState<any>();
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);

  const [exportDateFrom, setExportDateFrom] = useState<Date | null>(new Date());
  const [exportDateTo, setExportDateTo] = useState<Date | null>(new Date());

  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

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

  const paymentValues = {
    totalDevicesSelected: selectedRows.length,
    totalValueSelected: selectedRows.reduce((acc, curr) => {
      return acc + curr.paymentAmount;
    }, 0),
    currentPrezzeeBalance: platformConfig.gc_balance_details?.current_balance,
    totalDevices: paymentsItem.length,
    totalValue: paymentsItem.reduce(
      (acc: any, curr: { paymentAmount: any }) => {
        return acc + curr.paymentAmount;
      },
      0,
    ),
  };

  const renderIssuePaymentAction = () => {
    const handleClick = () => setIsOpenPaymentModal(true);

    return (
      <AppButton onClick={handleClick} disabled={selectedRows.length < 1}>
        Issue Payment
        {paymentValues.totalDevicesSelected === 0
          ? ''
          : `(${paymentValues.totalDevicesSelected})`}
      </AppButton>
    );
  };

  const renderDeviceSummary = () => {
    return (
      <div className="flex gap-6">
        {platformConfig?.giftCardGateway === 'prezzee' ? (
          <Typography fontWeight={600} variant="body2">
            Prezzee Balance : $
            {authState.platformConfig.gc_balance_details?.current_balance}
          </Typography>
        ) : (
          ''
        )}
        <Typography fontWeight={600} variant="body2">
          Total Devices : {paymentValues.totalDevices}
        </Typography>
        <Typography fontWeight={600} variant="body2">
          Total Value : ${paymentValues.totalValue}
        </Typography>
      </div>
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getPlatformConfig(activePlatform, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearPlatformConfig({});
      setSelectedRows([]);
      console.log('clear data unmount ---');
    };
  }, [activePlatform]);

  console.log('isUpdatingDeviceInventoryStatus--', isRequestingGiftcardPayment);

  return (
    <>
      <PageSubHeader
        overflowx="auto"
        overflowy="hidden"
        withSearch
        leftControls={
          platformConfig.giftCardGateway
            ? renderIssuePaymentAction()
            : renderAddProductAction()
        }
        middleControls={
          platformConfig?.giftCardGateway && renderDeviceSummary()
        }
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
        label={
          platformConfig.giftCardGateway ? 'Payments Awaiting' : 'Payments'
        }
        headers={headers}
        rows={paymentsItem || []}
        isLoading={
          isFetchingPayments ||
          isImportingPaymentsFlatFile ||
          isRequestingGiftcardPayment
        }
        parsingConfig={orderPaymentParsingConfig}
        enableCheckbox
        onChangeSelection={setSelectedRows}
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
      <IssuePaymentModal
        isOpen={isOpenPaymentModal}
        closeModal={() => setIsOpenPaymentModal(false)}
        // width={'50%'}
        platformConfig={platformConfig}
        paymentValues={paymentValues}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};
