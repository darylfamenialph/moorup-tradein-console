/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useEffect } from 'react';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import {
  DropdownOrderItemStatus,
  FormGroup,
  OrderItems,
  StyledInput,
  StyledReactSelect,
  isNullOrEmpty,
  useProduct,
  useAuth,
  amountFormatter,
  Typography,
} from '@tradein-admin/libs';
import { CardDetail } from '../sections';

// Styled Components
const ModalBody = styled.div`
  padding: 16px;
  height: 100%;
`;

const ModalTitle = styled.h2`
  font-style: bold;
  margin-bottom: 16px;
`;

const ModalButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ModalButton = styled.button`
  padding: 4px 8px;
  font-weight: bold;
  border: 1px solid #01463a;
  border-radius: 4px;
  background: #f5f5f4;
  width: 49%;
`;

const ModalSubmitButton = styled.button`
  padding: 4px 8px;
  font-weight: bold;
  border-radius: 4px;
  color: #fff;
  background: #01463a;
  width: 49%;
`;

const DEFAULT_VALUES = {
  _id: '',
  status: '',
  revised_offer: '0',
  reason: '',
  revision_details: '',
  brand: '',
  model: '',
  variant: '',
  deviceSku: '',
  newDevicePrice: '',
};

const REVISION_OPTIONS = [
  { label: 'Change Model', value: 'change-model' },
  { label: 'Others', value: 'others' },
];

interface FormValues {
  _id: string;
  status: string;
  revised_offer: string;
  reason: string;
  revision_details: string;
  brand: string;
  model: string;
  variant: string;
  deviceSku: string;
  newDevicePrice: string;
  functionalAssessmentPassed: any;
  screenAssessmentPassed: any;
  accessoriesAssessmentPassed: any;
}

type FormProps = {
  setStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (newValue: any, orderItem: OrderItems) => void;
  orderItem: OrderItems;
};

export const EditForm = ({
  setStatusModal,
  updateStatus,
  orderItem,
}: FormProps) => {
  const {
    state: productState,
    getCategoriesByType,
    getModelsByCategory,
  } = useProduct();
  const {
    isFetchingCategoriesByType,
    categoriesByType,
    isFetchingModelByCategory,
    modelByCategory,
  } = productState;

  const { state: authState } = useAuth();
  const { activePlatform } = authState;

  const statusDropdown = Object.values(DropdownOrderItemStatus).map((item) => ({
    label: item.replace('-', ' ').toUpperCase(),
    value: item,
  }));

  const getAssessmentAnswer = (assessment: any, question: string) => {
    return (
      assessment?.find((qa: any) => qa?.question === question)?.answer || null
    );
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      ...DEFAULT_VALUES,
      _id: orderItem?._id,
      status: orderItem?.status,
      functionalAssessmentPassed: getAssessmentAnswer(
        orderItem?.questions_answered,
        'functional-assessment',
      ),
      screenAssessmentPassed: getAssessmentAnswer(
        orderItem?.questions_answered,
        'screen-assessment',
      ),
      accessoriesAssessmentPassed: getAssessmentAnswer(
        orderItem?.questions_answered,
        'accessories-assessment',
      ),
    },
    onSubmit: () => {
      const {
        status,
        revised_offer,
        reason,
        revision_details,
        brand,
        model,
        variant,
      } = formik.values;
      const errors: Partial<FormValues> = {};
      if (status === DropdownOrderItemStatus.FOR_REVISION) {
        if (revision_details === 'change-model') {
          if (isEmpty(brand)) {
            errors['brand'] = 'Required field';
          }
          if (isEmpty(model)) {
            errors['model'] = 'Required field';
          }
          if (isEmpty(variant)) {
            errors['variant'] = 'Required field';
          }
          formik.setErrors(errors);
        } else {
          if (isNullOrEmpty(revised_offer)) {
            errors['revised_offer'] = 'Required field';
          }
          if (isEmpty(reason)) {
            errors['reason'] = 'Required field';
          }
          formik.setErrors(errors);
        }
      }
      if (isEmpty(errors)) {
        updateStatus(formik.values, orderItem);
        resetFormAndCloseModal();
      }
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getCategoriesByType(orderItem?.product_type, signal);
    }

    return () => {
      controller.abort();
    };
  }, [activePlatform]);

  const brands =
    useMemo(
      () =>
        categoriesByType.categories?.map((item: any) => {
          item.value = item.site_url;
          item.label = item.name;
          return item;
        }),
      [categoriesByType],
    ) || [];

  const models =
    useMemo(
      () =>
        modelByCategory.products?.map((item: any) => {
          item.value = item._id;
          item.label = item.display_name;
          return item;
        }),
      [modelByCategory],
    ) || [];

  const variants = useMemo(() => {
    const model = formik.values?.model;
    if (model) {
      const selectedModel = modelByCategory?.products?.find(
        (item: any) => item._id === model,
      );
      if (selectedModel) {
        return selectedModel.variants
          .filter((variant: any) => variant.status === 'active') // Ensure only active variants are included
          .map((variant: any) => {
            variant.value = variant._id;
            variant.label = variant.name;
            return variant;
          });
      }
    }

    return [];
  }, [modelByCategory, formik.values.model]);

  const newVariant = useMemo(() => {
    const variant = formik.values?.variant;
    if (variant) {
      const selectedVariant = variants?.find(
        (item: any) => item._id === variant,
      );
      return selectedVariant;
    }
    return {};
  }, [variants, formik.values.variant]);

  useEffect(() => {
    if (!formik.values.variant) return;
    setNewPricing(newVariant);
  }, [
    formik.values.variant,
    formik.values.functionalAssessmentPassed,
    formik.values.screenAssessmentPassed,
    formik.values.accessoriesAssessmentPassed,
  ]);

  const getNewPricing = (
    functionalAssessment: string,
    screenAssessment: string,
    hasCharger: string,
    newVariant: any,
    platform: string,
  ): number | 0 => {
    const platformPricing = newVariant?.pricing?.find(
      (p: any) => p.platform === platform,
    );
    const deductChargerPrice = hasCharger === 'no' ? 40 : 0;
    let price = 0;
    if (functionalAssessment === 'yes' && screenAssessment === 'no') {
      if (platformPricing) {
        //fully functional
        price = platformPricing.working ? Number(platformPricing.working) : 0;
        if (hasCharger === 'no' && price > 0) {
          price = Math.max(0, price - deductChargerPrice);
        }
        return price; // Return the 'working' value
      }
    } else if (functionalAssessment === 'yes' && screenAssessment === 'yes') {
      // damaged screen
      if (platformPricing) {
        price = platformPricing.working_damaged
          ? Number(platformPricing.working_damaged)
          : 0;
        if (hasCharger === 'no' && price > 0) {
          price = Math.max(0, price - deductChargerPrice);
        }
        return price; // Return the 'working_damaged' value
      }
    } else if (functionalAssessment === 'no' && screenAssessment === 'no') {
      // not functional
      if (platformPricing) {
        price = platformPricing.not_working
          ? Number(platformPricing.not_working)
          : 0;
        if (hasCharger === 'no' && price > 0) {
          price = Math.max(0, price - deductChargerPrice);
        }
        return price; // Return the 'not_working' value
      }
    } else {
      // not functional damage
      if (platformPricing) {
        price = platformPricing.not_working_damaged
          ? Number(platformPricing.not_working_damaged)
          : 0;
        if (hasCharger === 'no' && price > 0) {
          price = Math.max(0, price - deductChargerPrice);
        }
        return price; // Return the 'not_working_damaged' value
      }
    }
    return 0; // Return 0 if conditions are not met or pricing is not found
  };

  const deviceValidation = (item: string, chooseNo: any, chooseYes: any) => (
    <div className="flex flex-row gap-2">
      <div
        className={`text-sm px-2 rounded-md border-[1px] border-gray-400 cursor-pointer
        ${item === 'no' ? 'bg-red-500 text-white' : 'bg-white'}`}
        onClick={() => chooseNo()}
      >
        No
      </div>
      <div
        className={`text-sm px-2 rounded-md border-[1px] border-gray-400 cursor-pointer
        ${item === 'yes' ? 'bg-green-500 text-white' : 'bg-white'}`}
        onClick={() => chooseYes()}
      >
        Yes
      </div>
    </div>
  );

  const setNewPricing = (selectedVariant: any) => {
    const newPrice = getNewPricing(
      formik.values.functionalAssessmentPassed,
      formik.values.screenAssessmentPassed,
      formik.values.accessoriesAssessmentPassed,
      selectedVariant,
      activePlatform,
    );
    formik.setFieldValue('newDevicePrice', newPrice);
  };

  const resetFormAndCloseModal = () => {
    formik.resetForm(); // Reset the form values
    setStatusModal(false); // Close the modal
  };

  return (
    <ModalBody>
      <ModalTitle>Update Order Item</ModalTitle>
      <FormGroup>
        <StyledReactSelect
          label="Status"
          isMulti={false}
          options={statusDropdown}
          name="status"
          placeholder="Select status"
          value={formik.values.status}
          onChange={(selected) =>
            formik.setFieldValue('status', selected.value, true)
          }
        />
      </FormGroup>
      {formik.values.status === DropdownOrderItemStatus.FOR_REVISION && (
        <>
          <FormGroup>
            <StyledReactSelect
              label="Revision Reason"
              isMulti={false}
              options={REVISION_OPTIONS}
              name="revision_details"
              placeholder="Select reason"
              value={formik.values.revision_details}
              onChange={(selected) =>
                formik.setFieldValue('revision_details', selected.value, true)
              }
            />
          </FormGroup>
          {formik.values.revision_details === 'others' && (
            <>
              <FormGroup>
                <StyledInput
                  type="number"
                  id="revised_offer"
                  label="Revision"
                  name="revised_offer"
                  placeholder="Revision Offer"
                  onChange={formik.handleChange}
                  value={formik.values.revised_offer}
                  error={!!formik.errors.revised_offer}
                  errorMessage={formik.errors.revised_offer}
                />
              </FormGroup>
              <FormGroup>
                <StyledInput
                  type="text"
                  id="reason"
                  label="Reasons"
                  name="reason"
                  placeholder="Comma-separated reasons"
                  onChange={formik.handleChange}
                  value={formik.values.reason}
                  error={!!formik.errors.reason}
                  errorMessage={formik.errors.reason}
                />
              </FormGroup>
            </>
          )}
          {formik.values.revision_details === 'change-model' && (
            <>
              <FormGroup>
                <StyledReactSelect
                  label="Brand"
                  name="brand"
                  isMulti={false}
                  options={brands}
                  placeholder="Select brand"
                  value={formik.values.brand}
                  onChange={(selected) => {
                    formik.setFieldValue('brand', selected.value, true);
                    const controller = new AbortController();
                    const signal = controller.signal;
                    getModelsByCategory(selected.value, signal);
                  }}
                  disabled={isFetchingCategoriesByType}
                />
              </FormGroup>

              <FormGroup>
                <StyledReactSelect
                  label="Model"
                  name="model"
                  isMulti={false}
                  options={models}
                  placeholder="Select Model"
                  value={formik.values.model}
                  onChange={(selected) => {
                    formik.setFieldValue('model', selected.value, true);
                  }}
                  disabled={
                    isEmpty(formik.values.brand) || isFetchingModelByCategory
                  }
                />
              </FormGroup>

              <FormGroup>
                <StyledReactSelect
                  label="Variants"
                  name="variant"
                  isMulti={false}
                  options={variants}
                  placeholder="Select variant"
                  value={formik.values.variant}
                  onChange={(selected) => {
                    formik.setFieldValue('variant', selected.value, true);
                    formik.setFieldValue('deviceSku', selected?.sku);
                    setNewPricing(selected);
                  }}
                  disabled={
                    isEmpty(formik.values.model) || isFetchingModelByCategory
                  }
                  error={!!formik.errors?.variant}
                  errorMessage={formik.errors?.variant}
                />
              </FormGroup>

              {formik?.values?.variant && (
                <>
                  <hr className="my-2" />
                  <FormGroup>
                    <Typography variant="body2" fontWeight={700}>
                      Is Device functional ?
                    </Typography>
                    {deviceValidation(
                      formik.values.functionalAssessmentPassed,
                      () =>
                        formik.setFieldValue(
                          'functionalAssessmentPassed',
                          'no',
                        ),
                      () =>
                        formik.setFieldValue(
                          'functionalAssessmentPassed',
                          'yes',
                        ),
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Typography variant="body2" fontWeight={700}>
                      Is Screen Damage ?
                    </Typography>
                    {deviceValidation(
                      formik.values.screenAssessmentPassed,
                      () =>
                        formik.setFieldValue('screenAssessmentPassed', 'no'),
                      () =>
                        formik.setFieldValue('screenAssessmentPassed', 'yes'),
                    )}
                  </FormGroup>
                  {orderItem?.product_type === 'laptops' && (
                    <FormGroup>
                      <Typography variant="body2" fontWeight={700}>
                        Does device has charger ?
                      </Typography>
                      {deviceValidation(
                        formik.values.accessoriesAssessmentPassed,
                        () =>
                          formik.setFieldValue(
                            'accessoriesAssessmentPassed',
                            'no',
                          ),
                        () =>
                          formik.setFieldValue(
                            'accessoriesAssessmentPassed',
                            'yes',
                          ),
                      )}
                    </FormGroup>
                  )}

                  <hr />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 my-2">
                    <CardDetail
                      label={
                        <Typography variant="body2">Original Quote</Typography>
                      }
                      value={`$ ${amountFormatter(orderItem?.original_offer)}`}
                    />
                    <CardDetail
                      label={<Typography variant="body2">New Quote</Typography>}
                      value={
                        <Typography fontSize={'14px'} fontWeight={700}>
                          $
                          {amountFormatter(
                            getNewPricing(
                              formik.values.functionalAssessmentPassed,
                              formik.values.screenAssessmentPassed,
                              formik.values.accessoriesAssessmentPassed,
                              newVariant,
                              activePlatform,
                            ),
                          )}
                        </Typography>
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
      <ModalButtonDiv>
        <ModalButton onClick={() => resetFormAndCloseModal()}>
          Cancel
        </ModalButton>
        <ModalSubmitButton type="submit" onClick={() => formik.handleSubmit()}>
          Submit
        </ModalSubmitButton>
      </ModalButtonDiv>
    </ModalBody>
  );
};
