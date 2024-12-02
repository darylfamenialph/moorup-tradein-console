/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ADD_PROMOTION_CONDITIONS_PAYLOAD,
  AppButton,
  CustomEditor,
  FormContainer,
  FormGroup,
  FormGroupWithIcon,
  FormWrapper,
  MODAL_TYPES,
  PromotionConditionItemInterface,
  ResetForms,
  StyledInput,
  hasEmptyValueInArray,
  useCommon,
  usePromotion,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';

const StyledIcon = styled(FontAwesomeIcon)<{
  color?: string;
  hovercolor?: string;
  disabled?: boolean;
}>`
  color: ${(props) => (props.color ? props.color : 'inherit')};
  margin: 0 12px;

  &:hover {
    color: ${(props) => (props.hovercolor ? props.hovercolor : 'inherit')};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

const ItemsContainer = styled.div`
  box-shadow: 0px 1px 0px 0px #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

interface FormValues {
  title: string;
  items: PromotionConditionItemInterface[];
  [key: string]: any; // Index signature to allow dynamic access
}

const conditionItemSchema = Yup.object().shape({
  description: Yup.string().required('Condition Item is required'),
});

const validationSchema = Yup.object().shape({
  // title: Yup.string().required('Section Title is required'),
  // items: Yup.array()
  //   .of(conditionItemSchema)
  //   .required('Conditions items are required'),
});

export function AddPromotionConditionsForm() {
  const {
    state: commonState,
    setSideModalState,
    setCenterModalState,
  } = useCommon();
  const { sideModalState, centerModalState } = commonState;
  const {
    state: promotionState,
    setAddPromotionConditionPayload,
    setResetForm,
  } = usePromotion();
  const { addPromotionConditionPayload, resetForm: resetFormPayload } =
    promotionState;

  const resetForm = () => {
    formik.resetForm();
    setResetForm('');
  };

  useEffect(() => {
    if (resetFormPayload === ResetForms.RESET_ADD_PROMOTION_CONDITION_FORM) {
      resetForm();
    }
  }, [resetFormPayload]);

  const onSubmit = (values: any) => {
    setAddPromotionConditionPayload(values);
    setSideModalState({
      ...sideModalState,
      view: MODAL_TYPES.ADD_PROMOTION_ELIGIBILITY_AND_FAQS,
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: ADD_PROMOTION_CONDITIONS_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  const addItem = () => {
    const updatedItems = [...formik.values.items];

    // Calculate the order value based on the existing item
    const order =
      updatedItems.length > 0
        ? updatedItems[updatedItems.length - 1].order + 1
        : 1;

    // Create the new item with the calculated order value
    const item = {
      order,
      description: '',
    };

    updatedItems.push(item);

    formik.setValues({ ...formik.values, items: updatedItems });
  };

  const removeItem = (index: number) => {
    if (formik.values.items?.length > 1) {
      const updatedItems = [...formik.values.items];
      updatedItems.splice(index, 1);

      // After deletion, update the order values of the remaining items
      updatedItems.forEach((item, idx) => {
        item.order = idx + 1;
      });

      formik.setValues({ ...formik.values, items: updatedItems });
    }
  };

  useEffect(() => {
    formik.setValues(addPromotionConditionPayload);
  }, [addPromotionConditionPayload]);

  return (
    <FormWrapper
      formTitle="Conditions"
      subtTitle="This section outlines the conditions that users need to follow to take part in the promotion."
    >
      <FormContainer onSubmit={formik.handleSubmit}>
        <FormGroup>
          <StyledInput
            type="text"
            id="title"
            label="Section Title"
            name="title"
            placeholder="Section Title"
            onChange={formik.handleChange}
            value={formik.values.title}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.title && formik.errors.title)}
            errorMessage={formik.errors.title}
          />
        </FormGroup>
        <FormGroup>
          <span />
          <AppButton
            type="button"
            width="fit-content"
            onClick={() => addItem()}
            disabled={hasEmptyValueInArray(formik.values.items)}
          >
            Add Condition
          </AppButton>
        </FormGroup>
        {formik.values.items?.map(
          (item: PromotionConditionItemInterface, index: number) => {
            return (
              <ItemsContainer key={index}>
                <FormGroupWithIcon>
                  <CustomEditor
                    name={`items[${index}].description`}
                    label="Condition Item"
                    value={item.description}
                    onChange={(e: any) => {
                      formik.setFieldValue(
                        `items[${index}].description`,
                        e.target.value,
                      );
                    }}
                    onBlur={() => {
                      formik.setFieldTouched(
                        `items[${index}].description`,
                        true,
                      );
                    }}
                    error={Boolean(
                      formik.touched.items &&
                        formik.touched.items[index]?.description &&
                        formik.errors.items &&
                        (formik.errors.items as any)[index]?.description,
                    )}
                    errorMessage={
                      formik.errors.items &&
                      (formik.errors.items as any)[index]?.description
                    }
                  />
                  <StyledIcon
                    icon={faTrash}
                    color="#ccc"
                    hovercolor="#f44336"
                    disabled={formik.values.items?.length <= 1}
                    onClick={() => removeItem(index)}
                  />
                </FormGroupWithIcon>
              </ItemsContainer>
            );
          },
        )}
        <FormGroup>
          <FormGroup>
            <AppButton
              type="button"
              variant="outlined"
              width="fit-content"
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.ADD_PROMOTION_STEPS,
                });
              }}
            >
              Back
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              width="fit-content"
              onClick={() => {
                setCenterModalState({
                  ...centerModalState,
                  view: ResetForms.RESET_ADD_PROMOTION_CONDITION_FORM,
                  open: true,
                  width: '600px',
                  title: (
                    <h2 className="mt-0 text-[20px] text-[#01463A]">
                      Reset Form
                    </h2>
                  ),
                });
              }}
            >
              Reset
            </AppButton>
          </FormGroup>
          <FormGroup>
            <AppButton
              type="button"
              width="fit-content"
              onClick={() => console.log('Save draft')}
            >
              Save as Draft
            </AppButton>
            <AppButton
              type="submit"
              width="fit-content"
              // disabled={hasEmptyValue(formik.values)}
            >
              Next
            </AppButton>
          </FormGroup>
        </FormGroup>
      </FormContainer>
    </FormWrapper>
  );
}
