/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ACTIONS_COLUMN,
  AccordionContent,
  AccordionHeaderContainer,
  AppButton,
  ClaimStatus,
  FormGroup,
  GenericModal,
  MODAL_TYPES,
  OrderInterface,
  PROMOTION_CLAIMS_MANAGEMENT_COLUMNS,
  REGULAR,
  SideModal,
  StyledInput,
  Table,
  capitalizeFirstLetters,
  formatToReadable,
  promotionClaimsManagementParsingConfig,
  useAuth,
  useCommon,
  usePermission,
  usePromotion,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AccordionHeading } from '.';
import { AddOrderPromotionClaimForm } from './forms/add-claims';

type ClaimsListProps = {
  order: OrderInterface;
  onToggle: any;
  isOpen: boolean;
};

const ClaimsList = ({ order, isOpen, onToggle }: ClaimsListProps) => {
  const {
    state,
    getPromotionClaims,
    submitOrderPromotionClaim,
    clearPromotionClaims,
    updatePromotionClaimReceiptNumber,
    attachReceiptImage,
    removeReceiptImage,
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRow, setSelectedRow] = useState<any | null>({});
  const [receiptValue, setReceiptValue] = useState({
    value: '',
    error: false,
    message: '',
  });
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { state: commonState, setSideModalState } = useCommon();
  const { hasAddOrderClaimsPermission } = usePermission();
  const { sideModalState } = commonState;

  const headers = [...PROMOTION_CLAIMS_MANAGEMENT_COLUMNS, ...ACTIONS_COLUMN];

  const handleAddClaim = (event: any) => {
    event?.stopPropagation();
    setSideModalState({
      ...sideModalState,
      open: true,
      view: MODAL_TYPES.ADD_ORDER_PROMOTION_CLAIM,
    });
  };

  const handleSubmitClaim = (values: any) => {
    const payload = {
      ...values,
      order_number: order?.order_number,
    };
    submitOrderPromotionClaim(payload, {});
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
        getPromotionClaims({ include_all: true }, signal);
      }
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearPromotionClaims({});
      setSideModalState({
        ...sideModalState,
        open: false,
        view: null,
      });
    };
  }, [activePlatform]);

  const addActions = (claims: any) => {
    return claims
      .filter(
        (claim: any) => claim.order_id?.order_number === order?.order_number,
      )
      .map((claim: any) => ({
        ...claim,
        viewAction: (row: any) => handleToggleModal('view-receipt', true, row),
        editAction: (row: any) => handleToggleModal('edit-receipt', true, row),
        uploadAction: (row: any) =>
          handleToggleModal('attach-receipt', true, row),
      }));
  };

  const promotionClaimsWithActions = addActions(promotionClaims || []);

  // useEffect(() => {
  //   if (promotionClaimsWithActions) {
  //     setClaims(
  //       promotionClaims.filter(
  //         (claim: any) => claim.order_id?.order_number === order?.order_number,
  //       ),
  //     );
  //   }
  // }, [promotionClaims]);

  const renderForm = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.ADD_ORDER_PROMOTION_CLAIM:
        return <AddOrderPromotionClaimForm onFormSubmit={handleSubmitClaim} />;

      default:
        break;
    }
  };

  const AddButton = () => {
    return (
      <div className="flex justify-end">
        <button
          className="text-md text-white py-1 px-3 rounded-md bg-emerald-800 hover:bg-emerald-900"
          onClick={handleAddClaim}
        >
          Add Claim
        </button>
      </div>
    );
  };

  const handleToggleModal = (type: any, isOpen: boolean, item: any) => {
    setModalType(type);
    setIsOpenModal(isOpen);
    setSelectedRow(item);
    setReceiptValue({
      value: item?.receipt_number,
      error: false,
      message: '',
    });
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
    setSelectedRow(null);
    setReceiptValue({
      value: '',
      error: false,
      message: '',
    });
  };

  const handleSubmit = (key: string) => {
    switch (key) {
      case 'edit-receipt':
        updatePromotionClaimReceiptNumber(
          { receipt_number: receiptValue.value },
          selectedRow._id,
          { include_all: true },
        );
        break;

      case 'attach-receipt':
        attachReceiptImage(selectedRow._id, {}, image);
        break;

      case 'remove-attachment':
        removeReceiptImage(selectedRow._id, {});
        break;

      default:
        throw new Error('Case exception.');
    }

    handleReset();
  };

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

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

      case 'view-receipt':
        return (
          <>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={selectedRow?.receipt_url}
                alt="Uploaded Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

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
                  Close
                </AppButton>
                <AppButton
                  type="button"
                  variant="error"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('remove-attachment')}
                  disabled={isEmpty(selectedRow?.receipt_url)}
                >
                  Remove Attachment
                </AppButton>
              </FormGroup>
            </FormGroup>
          </>
        );

      default:
        break;
    }
  };

  return (
    <>
      <AccordionHeaderContainer>
        <AccordionHeading
          id="claims"
          title={'Promotion Claims'}
          action={hasAddOrderClaimsPermission && <AddButton />}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      </AccordionHeaderContainer>
      <AccordionContent isOpen={isOpen} key="Claims List">
        {isFetchingPromotionClaims ? (
          <h6 className="text-center text-gray-500 mb-2">Loading...</h6>
        ) : promotionClaimsWithActions.length > 0 ? (
          <Table
            label="Promotion Claims"
            margin="8px 0"
            isLoading={
              isFetchingPromotionClaims ||
              isUpdatingPromotionClaimMoorupStatus ||
              isUpdatingPromotionClaimStatus ||
              isUpdatingPromotionClaimReceiptNumber
            }
            headers={headers}
            rows={promotionClaimsWithActions || []}
            parsingConfig={promotionClaimsManagementParsingConfig}
          />
        ) : (
          <h6 className="text-center text-gray-500 mb-2">
            No Promotion Claims
          </h6>
        )}
      </AccordionContent>
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
        {renderForm()}
      </SideModal>
      <GenericModal
        title={capitalizeFirstLetters(formatToReadable(modalType))}
        content={renderModalContentAndActions(modalType)}
        isOpen={isOpenModal}
        onClose={() => handleReset()}
      />
    </>
  );
};

export default ClaimsList;
