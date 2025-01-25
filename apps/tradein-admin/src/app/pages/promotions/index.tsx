/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONS_COLUMN,
  ADD_PROMOTION_CLAIMS_PAYLOAD,
  ADD_PROMOTION_CONDITIONS_PAYLOAD,
  ADD_PROMOTION_DETAILS_PAYLOAD,
  ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  ADD_PROMOTION_STEPS_PAYLOAD,
  AppButton,
  CenterModal,
  Column,
  CustomizeColumns,
  Divider,
  FormGroup,
  IconButton,
  MODAL_TYPES,
  PROMOTIONS_MANAGEMENT_COLUMNS,
  PageSubHeader,
  PromotionTypes,
  ResetForms,
  SideModal,
  Table,
  parsePromotionStatus,
  promotionsManagementParsingConfig,
  useAuth,
  useCommon,
  usePermission,
  usePromotion,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { AddPromotionForm } from './add-promotion';
import { AddPromotionClaimsForm } from './add-promotion-claims';
import { AddPromotionConditionsForm } from './add-promotion-condition';
import { AddPromotionEligibilityAndFaqsForm } from './add-promotion-eligibility-and-faqs';
import { AddPromotionStepsForm } from './add-promotion-steps';
import { EditPromotionForm } from './edit-promotion';
import { EditPromotionClaimsForm } from './edit-promotion-claims';
import { EditPromotionConditionsForm } from './edit-promotion-condition';
import { EditPromotionEligibilityAndFaqsForm } from './edit-promotion-eligibility-and-faqs';
import { EditPromotionStepsForm } from './edit-promotion-steps';
import { PromotionPreview } from './preview-content';

export function PromotionsPage() {
  const { hasAddPromotionPermission, hasEditPromotionPermission } =
    usePermission();
  const {
    state,
    getPromotions,
    clearPromotions,
    setAddPromotionDetailsPayload,
    setAddPromotionClaimsPayload,
    setAddPromotionConditionPayload,
    setAddPromotionStepsPayload,
    setAddPromotionEligibilityAndFaqsPayload,
    setResetForm,
  } = usePromotion();
  const { state: authState } = useAuth();
  const {
    promotions,
    isFetchingPromotions,
    isAddingPromotion,
    addPromotionDetailsPayload,
  } = state;
  const { activePlatform } = authState;
  const {
    state: commonState,
    setSideModalState,
    setCenterModalState,
    setSearchTerm,
  } = useCommon();
  const { sideModalState, centerModalState } = commonState;
  const addPromotionSteps = [
    MODAL_TYPES.ADD_PROMOTION,
    MODAL_TYPES.ADD_PROMOTION_CLAIMS,
    ...(addPromotionDetailsPayload?.type === PromotionTypes.REGULAR
      ? [MODAL_TYPES.ADD_PROMOTION_STEPS]
      : []),
    MODAL_TYPES.ADD_PROMOTION_CONDITION,
    MODAL_TYPES.ADD_PROMOTION_ELIGIBILITY_AND_FAQS,
  ];
  const editPromotionSteps = [
    MODAL_TYPES.EDIT_PROMOTION,
    MODAL_TYPES.EDIT_PROMOTION_CLAIMS,
    MODAL_TYPES.EDIT_PROMOTION_STEPS,
    MODAL_TYPES.EDIT_PROMOTION_CONDITION,
    MODAL_TYPES.EDIT_PROMOTION_ELIGIBILITY_AND_FAQS,
  ];
  const [steps, setSteps] = useState(addPromotionSteps);
  const [selectedPromotion, setSelectedPromotion] = useState({});

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS
    ];
  const defaultColumns = [
    ...PROMOTIONS_MANAGEMENT_COLUMNS,
    ...(hasEditPromotionPermission ? ACTIONS_COLUMN : []),
  ];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  useEffect(() => {
    switch (true) {
      case addPromotionSteps.includes(sideModalState.view):
        setSteps(addPromotionSteps);
        break;

      case editPromotionSteps.includes(sideModalState.view):
        setSteps(editPromotionSteps);
        break;

      default:
        setSteps(addPromotionSteps);
        break;
    }
  }, [sideModalState]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getPromotions({}, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearPromotions({});
      setSearchTerm('');
      setSideModalState({
        ...sideModalState,
        open: false,
        view: null,
      });
    };
  }, [activePlatform]);

  const renderForm = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.ADD_PROMOTION:
        return <AddPromotionForm />;

      case MODAL_TYPES.ADD_PROMOTION_CLAIMS:
        return <AddPromotionClaimsForm />;

      case MODAL_TYPES.ADD_PROMOTION_STEPS:
        return <AddPromotionStepsForm />;

      case MODAL_TYPES.ADD_PROMOTION_CONDITION:
        return <AddPromotionConditionsForm />;

      case MODAL_TYPES.ADD_PROMOTION_ELIGIBILITY_AND_FAQS:
        return <AddPromotionEligibilityAndFaqsForm />;

      case MODAL_TYPES.EDIT_PROMOTION:
        return <EditPromotionForm data={selectedPromotion} />;

      case MODAL_TYPES.EDIT_PROMOTION_CLAIMS:
        return <EditPromotionClaimsForm data={selectedPromotion} />;

      case MODAL_TYPES.EDIT_PROMOTION_STEPS:
        return <EditPromotionStepsForm data={selectedPromotion} />;

      case MODAL_TYPES.EDIT_PROMOTION_CONDITION:
        return <EditPromotionConditionsForm data={selectedPromotion} />;

      case MODAL_TYPES.EDIT_PROMOTION_ELIGIBILITY_AND_FAQS:
        return <EditPromotionEligibilityAndFaqsForm data={selectedPromotion} />;

      case MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS
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
        break;
    }
  };

  const overrideStatus = (promotions: any) => {
    return promotions?.map((promotion: any) => {
      const promotion_status = parsePromotionStatus(promotion);

      return {
        ...promotion,
        promotion_status,
      };
    });
  };

  const formattedPromotions = overrideStatus(promotions || []);

  const handleCloseConfirmation = () => {
    setCenterModalState({
      ...centerModalState,
      open: false,
      view: null,
      width: null,
      title: '',
    });
  };

  const renderContent = () => {
    const renderResetForm = (message: any, resetType: string) => (
      <div className="w-full p-5">
        <h6 className="mb-5 text-center text-base font-normal">{message}</h6>
        <FormGroup>
          <AppButton
            variant="outlined"
            width="100%"
            onClick={handleCloseConfirmation}
          >
            Cancel
          </AppButton>
          <AppButton
            width="100%"
            onClick={() => {
              setResetForm(resetType);
              handleCloseConfirmation();
            }}
          >
            Confirm
          </AppButton>
        </FormGroup>
      </div>
    );

    switch (centerModalState.view) {
      case MODAL_TYPES.ADD_PROMOTION_PREVIEW:
      case MODAL_TYPES.EDIT_PROMOTION_PREVIEW:
        return <PromotionPreview />;

      case ResetForms.RESET_ADD_PROMOTION_FORM:
        return renderResetForm(
          'Are you sure you want to reset promotion form?',
          ResetForms.RESET_ADD_PROMOTION_FORM,
        );

      case ResetForms.RESET_ADD_PROMOTION_CLAIMS_FORM:
        return renderResetForm(
          'Are you sure you want to reset claims form?',
          ResetForms.RESET_ADD_PROMOTION_CLAIMS_FORM,
        );

      case ResetForms.RESET_ADD_PROMOTION_CONDITION_FORM:
        return renderResetForm(
          'Are you sure you want to reset conditions form?',
          ResetForms.RESET_ADD_PROMOTION_CONDITION_FORM,
        );

      case ResetForms.RESET_ADD_PROMOTION_ELIGIBILITY_FORM:
        return renderResetForm(
          'Are you sure you want to reset eligibility form?',
          ResetForms.RESET_ADD_PROMOTION_ELIGIBILITY_FORM,
        );

      case ResetForms.RESET_ADD_PROMOTION_STEPS_FORM:
        return renderResetForm(
          'Are you sure you want to reset steps form?',
          ResetForms.RESET_ADD_PROMOTION_STEPS_FORM,
        );

      case ResetForms.RESET_EDIT_PROMOTION_FORM:
        return renderResetForm(
          'Are you sure you want to reset promotion form?',
          ResetForms.RESET_EDIT_PROMOTION_FORM,
        );

      case ResetForms.RESET_EDIT_PROMOTION_CLAIMS_FORM:
        return renderResetForm(
          'Are you sure you want to reset claims form?',
          ResetForms.RESET_EDIT_PROMOTION_CLAIMS_FORM,
        );
      case ResetForms.RESET_EDIT_PROMOTION_STEPS_FORM:
        return renderResetForm(
          'Are you sure you want to reset steps form?',
          ResetForms.RESET_EDIT_PROMOTION_STEPS_FORM,
        );
      case ResetForms.RESET_EDIT_PROMOTION_CONDITION_FORM:
        return renderResetForm(
          'Are you sure you want to reset condition form?',
          ResetForms.RESET_EDIT_PROMOTION_CONDITION_FORM,
        );
      case ResetForms.RESET_EDIT_PROMOTION_ELIGIBILITY_FORM:
        return renderResetForm(
          'Are you sure you want to reset eligibility form?',
          ResetForms.RESET_EDIT_PROMOTION_ELIGIBILITY_FORM,
        );

      default:
        return null;
    }
  };

  const isViewWithoutBackButton = (view: string) => {
    return (
      view === MODAL_TYPES.ADD_PROMOTION ||
      view === MODAL_TYPES.EDIT_PROMOTION ||
      view === MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS
    );
  };

  const handleBackButtonClick = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.ADD_PROMOTION_CLAIMS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.ADD_PROMOTION,
        });
        break;
      case MODAL_TYPES.ADD_PROMOTION_STEPS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.ADD_PROMOTION_CLAIMS,
        });
        break;
      case MODAL_TYPES.ADD_PROMOTION_CONDITION:
        setSideModalState({
          ...sideModalState,
          view:
            addPromotionDetailsPayload?.type === PromotionTypes.REGULAR
              ? MODAL_TYPES.ADD_PROMOTION_STEPS
              : MODAL_TYPES.ADD_PROMOTION_CLAIMS,
        });
        break;
      case MODAL_TYPES.ADD_PROMOTION_ELIGIBILITY_AND_FAQS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.ADD_PROMOTION_CONDITION,
        });
        break;
      case MODAL_TYPES.EDIT_PROMOTION_CLAIMS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.EDIT_PROMOTION,
        });
        break;
      case MODAL_TYPES.EDIT_PROMOTION_STEPS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.EDIT_PROMOTION_CLAIMS,
        });
        break;
      case MODAL_TYPES.EDIT_PROMOTION_CONDITION:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.EDIT_PROMOTION_STEPS,
        });
        break;
      case MODAL_TYPES.EDIT_PROMOTION_ELIGIBILITY_AND_FAQS:
        setSideModalState({
          ...sideModalState,
          view: MODAL_TYPES.EDIT_PROMOTION_CONDITION,
        });
        break;
      default:
        break;
    }
  };

  const handleCloseSideModal = () => {
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });

    // Clear forms on modal close
    setAddPromotionDetailsPayload(ADD_PROMOTION_DETAILS_PAYLOAD);
    setAddPromotionClaimsPayload(ADD_PROMOTION_CLAIMS_PAYLOAD);
    setAddPromotionStepsPayload(ADD_PROMOTION_STEPS_PAYLOAD);
    setAddPromotionConditionPayload(ADD_PROMOTION_CONDITIONS_PAYLOAD);
    setAddPromotionEligibilityAndFaqsPayload(
      ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
    );
  };

  const handleEditPromotion = (data: any) => {
    setSelectedPromotion(data);
    setSideModalState({
      ...sideModalState,
      open: true,
      view: MODAL_TYPES.EDIT_PROMOTION,
    });
    setAddPromotionDetailsPayload(data);
    setAddPromotionClaimsPayload(data?.claims);
    setAddPromotionStepsPayload(data?.steps);
    setAddPromotionConditionPayload(data?.conditions);
    setAddPromotionEligibilityAndFaqsPayload(data?.eligibility);
  };

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={
          hasAddPromotionPermission && (
            <AppButton
              width="fit-content"
              icon={faPlus}
              onClick={() =>
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.ADD_PROMOTION,
                })
              }
            >
              Add
            </AppButton>
          )
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Promotions"
        isLoading={isFetchingPromotions || isAddingPromotion}
        headers={headers}
        rows={formattedPromotions || []}
        parsingConfig={promotionsManagementParsingConfig}
        menuItems={[
          {
            label: 'Edit',
            action: (value: any) => {
              handleEditPromotion(value);
            },
          },
        ]}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
          handleCloseSideModal();
        }}
        withSteps={
          sideModalState.view !==
          MODAL_TYPES.CUSTOMIZE_COLUMNS_PROMOTION_MANAGEMENT_PROMOTIONS
        }
        steps={steps}
        activeStep={sideModalState.view}
        showBackButton={!isViewWithoutBackButton(sideModalState.view)}
        onBackClick={() => handleBackButtonClick()}
      >
        {renderForm()}
      </SideModal>
      <CenterModal
        isOpen={centerModalState?.open}
        onClose={() => {
          setCenterModalState({
            ...centerModalState,
            open: false,
            view: null,
            title: '',
          });
          setSideModalState({
            ...sideModalState,
            open: true,
            view: MODAL_TYPES.ADD_PROMOTION_ELIGIBILITY_AND_FAQS,
          });
        }}
        width={centerModalState?.width}
        title={centerModalState?.title}
      >
        {renderContent()}
      </CenterModal>
    </>
  );
}
