/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONS_COLUMN,
  ADMIN,
  AppButton,
  ClaimStatus,
  Divider,
  Dropdown,
  FormGroup,
  FormWrapper,
  GenericModal,
  IconButton,
  MODAL_TYPES,
  PROMOTION_CLAIMS_MANAGEMENT_COLUMNS,
  PROMOTION_CLAIMS_TABS,
  PageSubHeader,
  REGULAR,
  RadioGroup,
  RadioOption,
  SUPERADMIN,
  SideModal,
  StyledDateRangePicker,
  StyledInput,
  Table,
  capitalizeFirstLetters,
  exportPromotionClaims,
  formatToReadable,
  getCurrencySymbol,
  promotionClaimsManagementParsingConfig,
  useAuth,
  useCommon,
  usePermission,
  usePromotion,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BulkApproveClaims } from './forms/bulk-approve-claims';
import { BulkRejectClaims } from './forms/bulk-reject-claims';
import { BulkOverrideClaimStatus } from './forms/bulk-update-claims';

export function PromotionClaimsPage() {
  const { hasUpdatePromotionClaimPermission } = usePermission();
  const {
    state,
    getPromotionClaims,
    clearPromotionClaims,
    setConfirmationModalState,
    bulkUpdatePromotionClaimStatus,
    bulkUpdatePromotionClaimMoorupStatus,
    updatePromotionClaimReceiptNumber,
    attachReceiptImage,
  } = usePromotion();
  const {
    promotionClaims,
    isFetchingPromotionClaims,
    isUpdatingPromotionClaimMoorupStatus,
    isUpdatingPromotionClaimStatus,
    isUpdatingPromotionClaimReceiptNumber,
  } = state;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const [promotionName, setPromotionName] = useState<string>('');
  const [createdDateFrom, setCreatedDateFrom] = useState<Date | null>(null);
  const [createdDateTo, setCreatedDateTo] = useState<Date | null>(null);
  const [exportFileFormat, setExportFileFormat] = useState<any>('csv');
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRow, setSelectedRow] = useState<any | null>({});
  const [receiptValue, setReceiptValue] = useState({
    id: '',
    value: '',
    error: false,
    message: '',
  });
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const headers = [...PROMOTION_CLAIMS_MANAGEMENT_COLUMNS, ...ACTIONS_COLUMN];
  const rowActions: any = [];

  switch (userDetails.role) {
    case REGULAR:
      rowActions.push(
        <div
          key="update_claims"
          style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
        >
          <AppButton
            width="fit-content"
            onClick={() =>
              setSideModalState({
                ...sideModalState,
                open: true,
                view: MODAL_TYPES.BULK_APPROVE_CLAIM_REGULAR,
              })
            }
          >
            Approve ({selectedRows.length})
          </AppButton>
          <AppButton
            width="fit-content"
            variant="error"
            onClick={() =>
              setSideModalState({
                ...sideModalState,
                open: true,
                view: MODAL_TYPES.BULK_REJECT_CLAIM_REGULAR,
              })
            }
          >
            Reject ({selectedRows.length})
          </AppButton>
        </div>,
      );
      break;

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
          key="override_moorup_status"
          width="fit-content"
          onClick={() =>
            setSideModalState({
              ...sideModalState,
              open: true,
              view: MODAL_TYPES.BULK_OVERRIDE_CLAIM_STATUS,
            })
          }
        >
          Override Status ({selectedRows.length})
        </AppButton>,
      );
      break;

    default:
      break;
  }

  const handleSubmitBulkClaimApproval = (values: any) => {
    const filters = {
      status: ClaimStatus.PENDING,
      moorup_status: ClaimStatus.APPROVED,
      include_all: true,
    };
    bulkUpdatePromotionClaimStatus(values?.claims, filters);
  };

  const handleSubmitBulkClaimRejection = (values: any) => {
    const filters = {
      status: ClaimStatus.PENDING,
      moorup_status: ClaimStatus.APPROVED,
      include_all: true,
    };
    bulkUpdatePromotionClaimStatus(values?.claims, filters);
  };

  const handleSubmitBulkOverrideClaimStatus = (values: any) => {
    const filters = {
      status: ClaimStatus.PENDING,
      include_all: true,
    };
    bulkUpdatePromotionClaimMoorupStatus(values?.claims, filters);
  };

  const addActions = (claims: any) => {
    return claims.map((claim: any) => {
      const products = claim?.promotion_id?.claims?.products
        ?.map((item: any) => ({
          value: item?.product_name,
          data: item,
          label: `${item?.product_name} - ${getCurrencySymbol(item?.currency)}${item?.amount}`,
        }))
        .sort((a: { label: string }, b: { label: any }) =>
          a?.label?.localeCompare(b?.label),
        );

      let disableCheckbox = false;
      if (userDetails.role === SUPERADMIN) {
        disableCheckbox = [
          ClaimStatus.APPROVED,
          ClaimStatus.COMPLETED,
        ].includes(claim['moorup_status']);
      } else if (userDetails.role === REGULAR) {
        disableCheckbox = [
          ClaimStatus.COMPLETED,
          ClaimStatus.APPROVED,
        ].includes(claim['status']);
      }

      return {
        ...claim,
        products,
        disableCheckbox,
        // viewAction: () => {},
        editAction: (row: any) => handleToggleModal('edit-receipt', true, row),
        uploadAction: (row: any) =>
          handleToggleModal('attach-receipt', true, row),
      };
    });
  };

  const promotionClaimsWithActions = addActions(promotionClaims || []);

  const handleChangeSelection = (selectedItems: any) => {
    setSelectedRows(selectedItems);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      if (userDetails?.role === REGULAR) {
        const filters = {
          status: ClaimStatus.PENDING,
          moorup_status: ClaimStatus.APPROVED,
          include_all: true,
        };

        getPromotionClaims(filters, signal);
      } else {
        getPromotionClaims(
          {
            status: [
              ClaimStatus.APPROVED,
              ClaimStatus.PROCESSING,
              ClaimStatus.PENDING,
            ]?.join(','),
            include_all: true,
          },
          signal,
        );
      }
      setSelectedRows([]);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearPromotionClaims({});
      setSearchTerm('');
      cancelFilters();
      onCloseModal();
      setActiveTab('active');
    };
  }, [activePlatform]);

  useEffect(() => {
    setSelectedRows([]);
  }, [promotionClaims]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const onCloseModal = () => {
    setConfirmationModalState({
      open: false,
      view: null,
      data: {},
      title: '',
      id: '',
    });
  };

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

  const options: RadioOption[] = [
    { label: 'CSV (.csv)', value: 'csv' },
    { label: 'Excel (.xlsx)', value: 'excel' },
  ];

  const handleChangeExportFileFormat = (value: string) => {
    setExportFileFormat(value);
  };

  const resetExports = () => {
    setExportFileFormat('csv');
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });
  };

  const handleSelectTab = (value: any) => {
    setActiveTab(value);

    switch (value) {
      case 'active':
        clearPromotionClaims({});
        setSearchTerm('');
        cancelFilters();
        getPromotionClaims({
          status: [
            ClaimStatus.APPROVED,
            ClaimStatus.PROCESSING,
            ClaimStatus.PENDING,
          ]?.join(','),
          include_all: true,
        });

        break;

      case 'all':
        clearPromotionClaims({});
        setSearchTerm('');
        cancelFilters();
        getPromotionClaims({ include_all: true });
        break;

      case 'closed':
        clearPromotionClaims({});
        setSearchTerm('');
        cancelFilters();
        getPromotionClaims({
          status: [
            ClaimStatus.COMPLETED,
            ClaimStatus.CANCELLED,
            ClaimStatus.REJECTED,
          ]?.join(','),
          include_all: true,
        });
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  const handleToggleModal = (type: any, isOpen: boolean, item: any) => {
    setModalType(type);
    setIsOpenModal(isOpen);
    setReceiptValue({
      id: item?._id,
      value: item?.receipt_number,
      error: false,
      message: '',
    });

    setSelectedRow(item);
  };

  const handleChange = (e: any, key: string) => {
    switch (key) {
      case 'edit-receipt':
        setReceiptValue({
          ...receiptValue,
          value: e.target.value,
          error: false,
          message: '',
        });
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  const handleBlur = (key: string) => {
    switch (key) {
      case 'edit-receipt':
        if (!receiptValue?.value?.trim()) {
          setReceiptValue({
            ...receiptValue,
            error: true,
            message: 'This field is required.',
          });
        } else {
          setReceiptValue({
            ...receiptValue,
            error: false,
            message: '',
          });
        }
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  const handleReset = () => {
    setIsOpenModal(false);
    setReceiptValue({
      id: '',
      value: '',
      error: false,
      message: '',
    });
    setImageUrl(null);
    setSelectedRow(null);
  };

  const handleSubmit = (key: string) => {
    const filter = {
      ...(activeTab === 'active'
        ? {
            status: [
              ClaimStatus.APPROVED,
              ClaimStatus.PROCESSING,
              ClaimStatus.PENDING,
            ].join(','),
          }
        : {}),
      ...(activeTab === 'closed'
        ? {
            status: [
              ClaimStatus.COMPLETED,
              ClaimStatus.CANCELLED,
              ClaimStatus.REJECTED,
            ].join(','),
          }
        : {}),
      ...(createdDateFrom
        ? {
            start_date: moment(createdDateFrom).format('YYYY-MM-DD'),
          }
        : {}),
      ...(createdDateTo
        ? {
            end_date: moment(createdDateTo).format('YYYY-MM-DD'),
          }
        : {}),
      ...(!isEmpty(promotionName) ? { promotion_name: promotionName } : {}),
      include_all: true,
    };

    switch (key) {
      case 'edit-receipt':
        updatePromotionClaimReceiptNumber(
          { receipt_number: receiptValue.value },
          receiptValue.id,
          filter,
        );
        break;

      case 'attach-receipt':
        attachReceiptImage(selectedRow._id, filter, image);
        break;

      default:
        throw new Error('Case exception.');
    }

    handleReset();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

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
                      include_all: true,
                      ...(activeTab === 'active'
                        ? {
                            status: [
                              ClaimStatus.APPROVED,
                              ClaimStatus.PROCESSING,
                              ClaimStatus.PENDING,
                            ].join(','),
                          }
                        : {}),
                      ...(activeTab === 'closed'
                        ? {
                            status: [
                              ClaimStatus.COMPLETED,
                              ClaimStatus.CANCELLED,
                              ClaimStatus.REJECTED,
                            ].join(','),
                          }
                        : {}),
                      ...(createdDateFrom
                        ? {
                            start_date:
                              moment(createdDateFrom).format('YYYY-MM-DD'),
                          }
                        : {}),
                      ...(createdDateTo
                        ? {
                            end_date:
                              moment(createdDateTo).format('YYYY-MM-DD'),
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
        return (
          <FormWrapper
            formTitle="Export"
            subtTitle="Download Promotion Claims Report"
          >
            <FormGroup marginBottom="20px">
              <RadioGroup
                label="File Format"
                options={options}
                onChange={handleChangeExportFileFormat}
                defaultValue="csv"
              />
            </FormGroup>
            <FormGroup>
              <span />
              <FormGroup>
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  onClick={() => resetExports()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() => {
                    exportPromotionClaims({
                      data: promotionClaims,
                      exportOptions: { format: exportFileFormat },
                    });

                    resetExports();
                  }}
                >
                  Export File
                </AppButton>
              </FormGroup>
            </FormGroup>
          </FormWrapper>
        );

      case MODAL_TYPES.BULK_APPROVE_CLAIM_REGULAR:
        return (
          <BulkApproveClaims
            selectedRows={selectedRows}
            onFormSubmit={handleSubmitBulkClaimApproval}
          />
        );

      case MODAL_TYPES.BULK_REJECT_CLAIM_REGULAR:
        return (
          <BulkRejectClaims
            selectedRows={selectedRows}
            onFormSubmit={handleSubmitBulkClaimRejection}
          />
        );

      case MODAL_TYPES.BULK_OVERRIDE_CLAIM_STATUS:
        return (
          <BulkOverrideClaimStatus
            selectedRows={selectedRows}
            onFormSubmit={handleSubmitBulkOverrideClaimStatus}
          />
        );

      default:
        return;
    }
  };

  const renderModalContentAndActions = (key: string) => {
    switch (key) {
      case 'edit-receipt':
        return (
          <>
            <StyledInput
              type="text"
              id="edit-receipt"
              label="Receipt Number"
              name="edit-receipt"
              placeholder="Receipt Number"
              onChange={(e) => handleChange(e, 'edit-receipt')}
              value={receiptValue?.value}
              onBlur={() => handleBlur('edit-receipt')}
              error={receiptValue.error}
              errorMessage={receiptValue.message}
            />
            <FormGroup margin="0px">
              <span />
              <FormGroup margin="0px">
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleReset()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="fill"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('edit-receipt')}
                  disabled={isEmpty(receiptValue.value)}
                >
                  Submit
                </AppButton>
              </FormGroup>
            </FormGroup>
          </>
        );

      case 'attach-receipt':
        return (
          <div style={{ textAlign: 'center' }}>
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed #ccc',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f0f0f0' : 'white',
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : imageUrl ? (
                <p>
                  Drag & drop to replace the image, or click to select a new one
                </p>
              ) : (
                <p>Drag & drop an image file here, or click to select one</p>
              )}
            </div>

            {imageUrl && (
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <p>Preview:</p>
                <img
                  src={imageUrl}
                  alt="Uploaded Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            )}

            <FormGroup margin="20px 0px 0px 0px">
              <span />
              <FormGroup margin="0px">
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleReset()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="fill"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('attach-receipt')}
                  disabled={isEmpty(imageUrl)}
                >
                  Submit
                </AppButton>
              </FormGroup>
            </FormGroup>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={!isEmpty(selectedRows) && rowActions}
        tabs={
          userDetails?.role !== REGULAR && (
            <>
              <Dropdown
                menuItems={PROMOTION_CLAIMS_TABS}
                defaultLabel="Active"
                onSelect={handleSelectTab}
              />
              <Divider />
            </>
          )
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
                  view: MODAL_TYPES.DOWNLOAD_PROMOTION_CLAIMS,
                });
              }}
              disabled={isEmpty(promotionClaims)}
            />
            <Divider />
            {(userDetails?.role === SUPERADMIN ||
              userDetails.role === ADMIN) && (
              <>
                {/* <IconButton tooltipLabel="Customize Columns" icon={faSliders} /> */}
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
            )}
          </>
        }
      />
      <Table
        label="Promotion Claims"
        isLoading={
          isFetchingPromotionClaims ||
          isUpdatingPromotionClaimMoorupStatus ||
          isUpdatingPromotionClaimStatus ||
          isUpdatingPromotionClaimReceiptNumber
        }
        headers={headers}
        rows={promotionClaimsWithActions || []}
        enableCheckbox={
          !isEmpty(rowActions) && hasUpdatePromotionClaimPermission
        }
        parsingConfig={promotionClaimsManagementParsingConfig}
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
        title={capitalizeFirstLetters(formatToReadable(modalType))}
        content={renderModalContentAndActions(modalType)}
        isOpen={isOpenModal}
        onClose={() => handleReset()}
      />
    </>
  );
}
