/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  ADMIN,
  AppButton,
  ClaimStatus,
  ConfirmationModalTypes,
  Divider,
  FormGroup,
  FormWrapper,
  GenericModal,
  IconButton,
  MODAL_TYPES,
  PROMOTION_CLAIMS_PAYMENT_MANAGEMENT_COLUMNS,
  PageSubHeader,
  SUPERADMIN,
  SideModal,
  StyledDateRangePicker,
  StyledInput,
  Table,
  Typography,
  promotionClaimsPaymentManagementParsingConfig,
  useAuth,
  useCommon,
  usePermission,
  usePromotion,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';

export function PromotionClaimsPaymentPage() {
  const { hasProcessPromotionClaimPaymentPermission } = usePermission();
  const {
    state,
    getPromotionClaims,
    clearPromotionClaims,
    setConfirmationModalState,
    bulkProcessPromotionClaimPayment,
  } = usePromotion();
  const {
    promotionClaims,
    isFetchingPromotionClaims,
    isProcessingPromotionClaimPayment,
    confirmationModalState,
    forProcessingClaimsPayment,
  } = state;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const [selectedRows, setSelectedRows] = useState<any>([]);

  const headers = [...PROMOTION_CLAIMS_PAYMENT_MANAGEMENT_COLUMNS];
  const rowActions: any = [];

  switch (userDetails.role) {
    case ADMIN:
    case SUPERADMIN:
      headers.push({
        label: 'Moorup Approval Status',
        order: 17,
        enableSort: true,
        keyName: 'moorup_status',
      });

      rowActions.push(
        <AppButton
          key="pay_action"
          width="fit-content"
          onClick={() => {
            setConfirmationModalState({
              open: true,
              view: ConfirmationModalTypes.BULK_PROCESS_CLAIM_PAYMENT,
              subtitle: `You are about to process payment for ${selectedRows.length} claim/s`,
              data: selectedRows || [],
            });
          }}
        >
          Pay Now ({selectedRows.length})
        </AppButton>,
      );
      break;

    default:
      break;
  }

  const handleChangeSelection = (selectedItems: any) => {
    setSelectedRows(selectedItems);
  };

  const addActions = (claims: any) => {
    return claims.map((claim: any) => {
      return {
        ...claim,
        disableCheckbox:
          isNaN(claim['amount']) ||
          claim['amount'] <= 0 ||
          forProcessingClaimsPayment.includes(claim._id),
        displayStatus: forProcessingClaimsPayment.includes(claim._id)
          ? 'processing'
          : claim.status,
        displayMoorupStatus: forProcessingClaimsPayment.includes(claim._id)
          ? 'processing'
          : claim.moorup_status,
      };
    });
  };

  const promotionClaimsWithActions = addActions(promotionClaims || []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      const filters = {
        status: [ClaimStatus.APPROVED, ClaimStatus.FAILED].join(','),
        moorup_status: [ClaimStatus.APPROVED, ClaimStatus.FAILED].join(','),
      };

      getPromotionClaims(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearPromotionClaims({});
      setSearchTerm('');
      cancelFilters();
    };
  }, [activePlatform]);

  const [promotionName, setPromotionName] = useState<string>('');
  const [createdDateFrom, setCreatedDateFrom] = useState<Date | null>(null);
  const [createdDateTo, setCreatedDateTo] = useState<Date | null>(null);

  const cancelFilters = () => {
    setCreatedDateFrom(null);
    setCreatedDateTo(null);
    setPromotionName('');
  };

  const handleStartDateChange = (date: Date | null) => {
    setCreatedDateFrom(date);
    setCreatedDateTo(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setCreatedDateTo(date);
  };

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.FILTER_PROMOTION_CLAIMS:
        return (
          <FormWrapper formTitle="Filter By">
            <FormGroup marginBottom="20px">
              <StyledInput
                type="text"
                id="name"
                label="Promotion Name"
                name="promotion_name"
                placeholder="Promotion Name"
                onChange={(e) => setPromotionName(e.target.value)}
                value={promotionName}
              />
            </FormGroup>
            <FormGroup marginBottom="20px">
              <StyledDateRangePicker
                startDateInput={{
                  onChange: handleStartDateChange,
                  placeholder: 'Start Date',
                  value: createdDateFrom,
                  name: 'createdDateFrom',
                  onBlur: () => {},
                }}
                endDateInput={{
                  onChange: handleEndDateChange,
                  placeholder: 'End Date',
                  value: createdDateTo,
                  name: 'createdDateTo',
                  onBlur: () => {},
                }}
                label="Claim Date"
                onChange={() => {}}
              />
            </FormGroup>
            <FormGroup>
              <AppButton
                type="button"
                variant="outlined"
                width="fit-content"
                onClick={() => cancelFilters()}
              >
                Reset
              </AppButton>
              <FormGroup>
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  onClick={() => {
                    setSideModalState({
                      ...sideModalState,
                      open: false,
                      view: null,
                    });
                  }}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() => {
                    const filter = {
                      status: [ClaimStatus.APPROVED, ClaimStatus.FAILED].join(
                        ',',
                      ),
                      moorup_status: [
                        ClaimStatus.APPROVED,
                        ClaimStatus.FAILED,
                      ].join(','),
                      ...(createdDateFrom
                        ? {
                            start_date: moment(createdDateFrom).format(
                              'YYYY-MM-DDTHH:mm:ss',
                            ),
                          }
                        : {}),
                      ...(createdDateTo
                        ? {
                            end_date: moment(createdDateTo).format(
                              'YYYY-MM-DDTHH:mm:ss',
                            ),
                          }
                        : {}),
                      ...(!isEmpty(promotionName)
                        ? { promotion_name: promotionName }
                        : {}),
                    };

                    getPromotionClaims(filter);

                    setSideModalState({
                      ...sideModalState,
                      open: false,
                      view: null,
                    });
                  }}
                >
                  Apply
                </AppButton>
              </FormGroup>
            </FormGroup>
          </FormWrapper>
        );

      case MODAL_TYPES.DOWNLOAD_PROMOTION_CLAIMS:
        return <span>Download Claims</span>;

      default:
        return;
    }
  };

  const renderModalContentAndActions = () => {
    const totalAmount = selectedRows?.reduce(
      (sum: number, item: any) => sum + item.amount,
      0,
    );

    switch (confirmationModalState.view) {
      case ConfirmationModalTypes.BULK_PROCESS_CLAIM_PAYMENT:
        return (
          <div style={{ width: '100%' }}>
            <Typography variant="body2">
              Please review the details carefully before proceeding.
            </Typography>
            <Typography variant="body2" fontWeight={600} marginBottom="20px">
              Total Amount: {totalAmount}
            </Typography>
            <FormGroup>
              <AppButton
                variant="outlined"
                width="100%"
                onClick={() => onCloseModal()}
              >
                Cancel
              </AppButton>
              <AppButton
                width="100%"
                onClick={() => {
                  const filters = {
                    status: [ClaimStatus.APPROVED, ClaimStatus.FAILED].join(
                      ',',
                    ),
                    moorup_status: [
                      ClaimStatus.APPROVED,
                      ClaimStatus.FAILED,
                    ].join(','),
                  };

                  const payload = selectedRows.map((row: any) => {
                    return { claimId: row?._id };
                  });

                  bulkProcessPromotionClaimPayment(payload, filters);

                  onCloseModal();
                }}
                disabled={isEmpty(selectedRows)}
              >
                Confirm
              </AppButton>
            </FormGroup>
          </div>
        );

      default:
        return;
    }
  };

  const onCloseModal = () => {
    setConfirmationModalState({
      open: false,
      view: null,
      data: {},
      title: '',
      subtitle: '',
    });

    setSelectedRows([]);
  };

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={!isEmpty(selectedRows) && rowActions}
        rightControls={
          (userDetails?.role === SUPERADMIN || userDetails.role === ADMIN) && (
            <>
              <IconButton
                tooltipLabel="Filter"
                icon={faFilter}
                onClick={() => {
                  setSideModalState({
                    ...sideModalState,
                    open: true,
                    view: MODAL_TYPES.FILTER_PROMOTION_CLAIMS,
                  });
                }}
              />
              <Divider />
            </>
          )
        }
      />

      <Table
        label="Claims Payment"
        isLoading={
          isFetchingPromotionClaims || isProcessingPromotionClaimPayment
        }
        headers={headers}
        rows={promotionClaimsWithActions || []}
        enableCheckbox={
          !isEmpty(rowActions) && hasProcessPromotionClaimPaymentPermission
        }
        parsingConfig={promotionClaimsPaymentManagementParsingConfig}
        onChangeSelection={handleChangeSelection}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
          setSideModalState({
            ...sideModalState,
            open: false,
            view: null,
          });
        }}
      >
        {renderSideModalContent()}
      </SideModal>
      <GenericModal
        title="Confirmation"
        subtitle={confirmationModalState.subtitle}
        content={renderModalContentAndActions()}
        isOpen={confirmationModalState.open}
        onClose={() => onCloseModal()}
      />
    </>
  );
}
