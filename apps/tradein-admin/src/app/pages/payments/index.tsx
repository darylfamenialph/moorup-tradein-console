/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faDownload, faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  AppButton,
  clearOrderPaymentItems,
  Column,
  ConfirmationModalTypes,
  CustomizeColumns,
  Divider,
  DropdownButton,
  FormGroup,
  FormWrapper,
  GenericModal,
  IconButton,
  MODAL_TYPES,
  ORDER_PAYMENTS_MANAGEMENT_COLUMNS,
  orderPaymentParsingConfig,
  PageSubHeader,
  SideModal,
  StyledDateRange,
  SubHeader,
  Table,
  Typography,
  UploadFileModal,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IssuePayment } from './issue-payments';

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
    requestGiftCardPayment,
  } = useOrder();
  const {
    paymentsItem,
    isFetchingPayments,
    isDownloadingPaymentFile,
    isImportingPaymentsFlatFile,
    importPaymentsFlatFileError,
    isRequestingGiftcardPayment,
  } = state;
  const {
    state: commonState,
    setSideModalState,
    setSearchTerm,
    setConfirmationModalState,
  } = useCommon();
  const { hasViewPreezeBalance } = usePermission();
  const { sideModalState, confirmationModalState } = commonState;
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);
  const [exportDateFrom, setExportDateFrom] = useState<Date | null>(new Date());
  const [exportDateTo, setExportDateTo] = useState<Date | null>(new Date());
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_PAYMENTS];
  const defaultColumns = [...ORDER_PAYMENTS_MANAGEMENT_COLUMNS];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

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

    setConfirmationModalState({
      open: false,
      view: null,
      data: {},
      title: '',
      id: '',
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

      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_PAYMENTS:
        return (
          <CustomizeColumns
            storageKey={MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_PAYMENTS}
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

  const addActions = (payments: any) => {
    return paymentsItem.map((payments: any) => {
      return {
        ...payments,
        disableCheckbox: payments.paymentStatus === 'payment-processing',
      };
    });
  };

  const paymentItemsWithActions = addActions(paymentsItem || []);

  const renderIssuePaymentAction = () => {
    return (
      <AppButton
        key="issue_payment_action"
        width="fit-content"
        onClick={() => {
          setConfirmationModalState({
            open: true,
            view: ConfirmationModalTypes.ISSUE_PAYMENT,
            subtitle:
              platformConfig?.giftCardGateway === 'prezzee' &&
              paymentValues.currentPrezzeeBalance <
                paymentValues.totalValueSelected
                ? ''
                : `You are about to process payment for ${selectedRows.length} device/s`,
            data: selectedRows || [],
          });
        }}
      >
        Issue Payment ({selectedRows.length})
      </AppButton>
    );
  };

  const renderModalContentAndActions = () => {
    switch (confirmationModalState.view) {
      case ConfirmationModalTypes.ISSUE_PAYMENT:
        return (
          <IssuePayment
            closeModal={() => onCloseModal()}
            selectedRows={selectedRows}
            paymentValues={paymentValues}
            platformConfig={platformConfig}
            onConfirm={() => {
              const deviceIds = selectedRows.map(
                (row: { deviceId: any }) => row.deviceId,
              );

              requestGiftCardPayment(deviceIds);
              setSelectedRows([]);
              const controller = new AbortController();
              fetchOrderPayments(controller.signal);
              onCloseModal();
            }}
          />
        );

      default:
        return;
    }
  };

  const renderDeviceSummary = () => {
    return (
      <FormGroup marginBottom="0px">
        {platformConfig?.giftCardGateway === 'prezzee' &&
          hasViewPreezeBalance && (
            <>
              <Typography fontWeight={600} variant="body2">
                Prezzee Balance : $
                {authState.platformConfig.gc_balance_details?.current_balance}
              </Typography>
              <Divider />
            </>
          )}
        <Typography fontWeight={600} variant="body2">
          Total Devices : {paymentValues.totalDevices}
        </Typography>
        <Divider />
        <Typography fontWeight={600} variant="body2">
          Total Value : ${paymentValues.totalValue}
        </Typography>
      </FormGroup>
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
    };
  }, [activePlatform]);

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={
          platformConfig.giftCardGateway
            ? !isEmpty(selectedRows) && renderIssuePaymentAction()
            : renderAddProductAction()
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
            <>
              <IconButton
                tooltipLabel="Customize Columns"
                icon={faSliders}
                onClick={() => {
                  setSideModalState({
                    ...sideModalState,
                    open: true,
                    view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ORDER_MANAGEMENT_PAYMENTS,
                  });
                }}
              />
              <Divider />
            </>
          </>
        }
      />
      <SubHeader
        marginTop="0px"
        leftSection={platformConfig?.giftCardGateway && renderDeviceSummary()}
      />
      <Table
        label={
          platformConfig.giftCardGateway ? 'Payments Awaiting' : 'Payments'
        }
        headers={headers}
        rows={paymentItemsWithActions || []}
        isLoading={
          isFetchingPayments ||
          isImportingPaymentsFlatFile ||
          isRequestingGiftcardPayment
        }
        parsingConfig={orderPaymentParsingConfig}
        enableCheckbox={!isEmpty(platformConfig.giftCardGateway)}
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
      <GenericModal
        title="Confirmation"
        subtitle={confirmationModalState.subtitle}
        content={renderModalContentAndActions()}
        isOpen={confirmationModalState.open}
        onClose={() => onCloseModal()}
      />
    </>
  );
};
