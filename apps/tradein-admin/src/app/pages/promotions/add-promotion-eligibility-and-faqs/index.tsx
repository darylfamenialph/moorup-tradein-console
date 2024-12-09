/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  AppButton,
  CustomEditor,
  FaqInterface,
  FormContainer,
  FormGroup,
  FormGroupWithIcon,
  FormWrapper,
  MODAL_TYPES,
  ResetForms,
  StyledInput,
  hasEmptyValue,
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
  faq: FaqInterface[];
  [key: string]: any; // Index signature to allow dynamic access
}

const faqItemSchema = Yup.object().shape({
  title: Yup.string().required('FAQ Title is required'),
  content: Yup.string().required('FAQ Content is required'),
});

const validationSchema = Yup.object().shape({
  // title: Yup.string().required('Section Title is required'),
  // faq: Yup.array().of(faqItemSchema).required('FAQ items are required'),
});

export function AddPromotionEligibilityAndFaqsForm() {
  const {
    state: commonState,
    setSideModalState,
    setCenterModalState,
  } = useCommon();
  const { sideModalState, centerModalState } = commonState;
  const {
    state: promotionState,
    setAddPromotionEligibilityAndFaqsPayload,
    setResetForm,
    createPromotion,
  } = usePromotion();
  const {
    addPromotionDetailsPayload,
    addPromotionClaimsPayload,
    addPromotionStepsPayload,
    addPromotionConditionPayload,
    addPromotionEligibilityAndFaqsPayload,
    resetForm: resetFormPayload,
  } = promotionState;

  const resetForm = () => {
    formik.resetForm();
    setResetForm('');
  };

  useEffect(() => {
    if (resetFormPayload === ResetForms.RESET_ADD_PROMOTION_ELIGIBILITY_FORM) {
      resetForm();
    }
  }, [resetFormPayload]);

  const onSubmit = (values: any) => {
    setAddPromotionEligibilityAndFaqsPayload(values);
    // Close modal and call API

    setCenterModalState({
      ...centerModalState,
      view: MODAL_TYPES.ADD_PROMOTION_PREVIEW,
      open: true,
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  const addItem = () => {
    const updatedItems = [...formik.values.faq];

    // Create the new item
    const item = {
      title: '',
      content: '',
    };

    updatedItems.push(item);

    formik.setValues({ ...formik.values, faq: updatedItems });
  };

  const removeItem = (index: number) => {
    if (formik.values.faq?.length > 1) {
      const updatedItems = [...formik.values.faq];
      updatedItems.splice(index, 1);
      formik.setValues({ ...formik.values, faq: updatedItems });
    }
  };

  useEffect(() => {
    formik.setValues(addPromotionEligibilityAndFaqsPayload);
  }, [addPromotionEligibilityAndFaqsPayload]);

  const handleSaveDraft = () => {
    const values = {
      ...formik.values,
    };
    const payload = {
      ...addPromotionDetailsPayload,
      is_draft: true,
      claims: addPromotionClaimsPayload,
      steps: addPromotionStepsPayload?.steps,
      conditions: addPromotionConditionPayload,
      eligibility: values,
    };
    setAddPromotionEligibilityAndFaqsPayload(values);
    createPromotion(payload);
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });
  };

  return (
    <FormWrapper
      formTitle="Eligibilities/FAQs"
      subtTitle="This section provides information about eligibility criteria and frequently asked questions regarding the promotion."
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
            disabled={hasEmptyValueInArray(formik.values.faq)}
          >
            Add FAQ Item
          </AppButton>
        </FormGroup>
        {formik.values.faq?.map((faq: FaqInterface, index: number) => {
          return (
            <ItemsContainer key={index}>
              <FormGroupWithIcon>
                <StyledInput
                  type="text"
                  id={`faq[${index}].title`}
                  label="FAQ Title"
                  name={`faq[${index}].title`}
                  placeholder="FAQ Title"
                  onChange={formik.handleChange}
                  value={faq.title}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.faq &&
                      formik.touched.faq[index]?.title &&
                      formik.errors.faq &&
                      (formik.errors.faq as any)[index]?.title,
                  )}
                  errorMessage={
                    formik.errors.faq &&
                    (formik.errors.faq as any)[index]?.title
                  }
                />
                <StyledIcon
                  icon={faTrash}
                  color="#ccc"
                  hovercolor="#f44336"
                  disabled={formik.values.faq?.length <= 1}
                  onClick={() => removeItem(index)}
                />
              </FormGroupWithIcon>
              <FormGroup>
                <CustomEditor
                  name={`faq[${index}].content`}
                  label="Content"
                  value={faq.content}
                  onChange={(e: any) => {
                    formik.setFieldValue(
                      `faq[${index}].content`,
                      e.target.value,
                    );
                  }}
                  onBlur={() => {
                    formik.setFieldTouched(`faq[${index}].content`, true);
                  }}
                  error={Boolean(
                    formik.touched.faq &&
                      formik.touched.faq[index]?.content &&
                      formik.errors.faq &&
                      (formik.errors.faq as any)[index]?.content,
                  )}
                  errorMessage={
                    formik.errors.faq &&
                    (formik.errors.faq as any)[index]?.content
                  }
                />
              </FormGroup>
            </ItemsContainer>
          );
        })}
        <FormGroup>
          <FormGroup>
            <AppButton
              type="button"
              variant="outlined"
              width="fit-content"
              onClick={() => {
                setCenterModalState({
                  ...centerModalState,
                  view: ResetForms.RESET_ADD_PROMOTION_ELIGIBILITY_FORM,
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
              onClick={() => handleSaveDraft()}
            >
              Save as Draft
            </AppButton>
            <AppButton
              type="submit"
              width="fit-content"
              disabled={hasEmptyValue(formik.values)}
            >
              Preview
            </AppButton>
          </FormGroup>
        </FormGroup>
      </FormContainer>
    </FormWrapper>
  );
}
