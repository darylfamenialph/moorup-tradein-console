/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONS_COLUMN,
  ADD_PROMOTION_CLAIMS_PAYLOAD,
  ADD_PROMOTION_CONDITIONS_PAYLOAD,
  ADD_PROMOTION_DETAILS_PAYLOAD,
  ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  ADD_PROMOTION_STEPS_PAYLOAD,
  AppButton,
  CenterModal,
  DEFAULT_COLUMN,
  MODAL_TYPES,
  PROMOTIONS_MANAGEMENT_COLUMNS,
  PageSubHeader,
  SideModal,
  Table,
  promotionsManagementParsingConfig,
  useAuth,
  useCommon,
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
  const {
    state,
    getPromotions,
    clearPromotions,
    setAddPromotionDetailsPayload,
    setAddPromotionClaimsPayload,
    setAddPromotionConditionPayload,
    setAddPromotionStepsPayload,
    setAddPromotionEligibilityAndFaqsPayload,
  } = usePromotion();
  const { state: authState } = useAuth();
  const { promotions, isFetchingPromotions, isAddingPromotion } = state;
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
    MODAL_TYPES.ADD_PROMOTION_STEPS,
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

  const headers = [
    ...DEFAULT_COLUMN,
    ...PROMOTIONS_MANAGEMENT_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

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

      default:
        break;
    }
  };

  const overrideStatus = (promotions: any) => {
    return promotions?.map((promotion: any) => {
      const status = promotion.status;
      let promotion_status = status;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const startDate = new Date(promotion['start_date']);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(promotion['end_date']);
      endDate.setHours(0, 0, 0, 0);

      // Check if current date falls between the start date and end date
      const isBetween = currentDate >= startDate && currentDate <= endDate;

      // Check if current date is before the start date
      const isBeforeStart = currentDate < startDate;

      // Check if current date is after the end date
      const isAfterEnd = currentDate > endDate;

      if (status === 'active' && isBetween) {
        promotion_status = 'ongoing';
      } else if (status === 'active' && isBeforeStart) {
        promotion_status = 'not_started';
      } else if (status === 'active' && isAfterEnd) {
        promotion_status = 'ended';
      }

      return {
        ...promotion,
        promotion_status,
      };
    });
  };

  const formattedPromotions = overrideStatus(promotions || []);

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={
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
              setSelectedPromotion(value);
              setSideModalState({
                ...sideModalState,
                open: true,
                view: MODAL_TYPES.EDIT_PROMOTION,
              });
            },
          },
        ]}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
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
        }}
        withSteps
        steps={steps}
        activeStep={sideModalState.view}
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
          });
        }}
      >
        <PromotionPreview />
      </CenterModal>
    </>
  );
}
