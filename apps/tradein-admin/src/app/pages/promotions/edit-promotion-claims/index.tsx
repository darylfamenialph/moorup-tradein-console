/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ADD_PROMOTION_CLAIMS_PAYLOAD,
  ADD_PROMOTION_PRODUCTS_PAYLOAD,
  AppButton,
  CURRENCIES,
  FormContainer,
  FormGroup,
  FormGroupWithIcon,
  FormWrapper,
  MODAL_TYPES,
  PromotionProductInterface,
  StyledInput,
  StyledReactSelect,
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
  description: string;
  disclaimer: string;
  products: PromotionProductInterface[];
  [key: string]: any; // Index signature to allow dynamic access
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Section Title is required'),
  description: Yup.string().required('Section Description is required'),
  disclaimer: Yup.string().required('Section Disclaimer is required'),
  products: Yup.array().of(
    Yup.object().shape({
      product_name: Yup.string().required('Product name is required'),
      amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be a positive number'),
      currency: Yup.string().required('Currency is required'),
    }),
  ),
});

export function EditPromotionClaimsForm({ data }: any) {
  const { state: commonState, setSideModalState } = useCommon();
  const { sideModalState } = commonState;
  const { setAddPromotionClaimsPayload } = usePromotion();

  const resetForm = () => {
    formik.resetForm();
  };

  const onSubmit = (values: any) => {
    setAddPromotionClaimsPayload(values);
    setSideModalState({
      ...sideModalState,
      view: MODAL_TYPES.EDIT_PROMOTION_STEPS,
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: ADD_PROMOTION_CLAIMS_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  const currencies = CURRENCIES?.sort(
    (a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label),
  );

  const handleArrayValueChange = (
    fieldIndex: number,
    field: string,
    value: any,
    arrayField: string,
  ) => {
    formik.setFieldValue(`${arrayField}[${fieldIndex}].${field}`, value);
  };

  const handleArrayValueOnBlur = (
    fieldIndex: number,
    field: string,
    arrayField: string,
  ) => {
    formik.setFieldTouched(`${arrayField}[${fieldIndex}].${field}`, true);
  };

  const addProductToClaims = () => {
    const updatedProducts = [
      ...formik.values.products,
      ADD_PROMOTION_PRODUCTS_PAYLOAD,
    ];

    formik.setValues({ ...formik.values, products: updatedProducts });
  };

  const removeProductFromClaims = (productIndex: number) => {
    if (formik.values?.products?.length > 1) {
      const updatedProducts = [...formik.values.products];
      updatedProducts.splice(productIndex, 1);

      formik.setValues({ ...formik.values, products: updatedProducts });
    }
  };

  useEffect(() => {
    const promotionClaims = data?.claims || ADD_PROMOTION_CLAIMS_PAYLOAD;
    formik.setValues(promotionClaims);
  }, [data]);

  return (
    <FormWrapper
      formTitle="Claims"
      subtTitle="This section details the amounts users can claim based on the purchase of specific devices during the promotion period."
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
            value={formik.values?.title}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched?.title && formik.errors?.title)}
            errorMessage={formik.errors?.title}
          />
        </FormGroup>
        <FormGroup>
          <StyledInput
            type="text"
            id="description"
            label="Section Description"
            name="description"
            placeholder="Section Description"
            onChange={formik.handleChange}
            value={formik.values?.description}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.description && formik.errors.description,
            )}
            errorMessage={formik.errors.description}
          />
        </FormGroup>
        <FormGroup>
          <StyledInput
            type="text"
            id="disclaimer"
            label="Section Disclaimer"
            name="disclaimer"
            placeholder="Section Disclaimer"
            onChange={formik.handleChange}
            value={formik.values?.disclaimer}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.disclaimer && formik.errors.disclaimer,
            )}
            errorMessage={formik.errors.disclaimer}
          />
        </FormGroup>
        <FormGroup>
          <span />
          <AppButton
            type="button"
            width="fit-content"
            onClick={() => addProductToClaims()}
            disabled={hasEmptyValueInArray(formik.values?.products)}
          >
            Add Product
          </AppButton>
        </FormGroup>
        {formik.values?.products?.map(
          (product: PromotionProductInterface, index: number) => {
            return (
              <ItemsContainer key={index}>
                <FormGroupWithIcon>
                  <StyledInput
                    type="text"
                    id={`products[${index}].product_name`}
                    label="Product Name"
                    name={`products[${index}].product_name`}
                    placeholder="Product Name"
                    onChange={formik.handleChange}
                    value={product.product_name}
                    onBlur={(e) => {
                      handleArrayValueOnBlur(index, 'product_name', 'products');
                    }}
                    error={Boolean(
                      formik.touched.products &&
                        formik.touched.products[index]?.product_name &&
                        formik.errors.products &&
                        (formik.errors.products as any)[index]?.product_name,
                    )}
                    errorMessage={
                      formik.errors.products &&
                      (formik.errors.products as any)[index]?.product_name
                    }
                  />
                  <StyledIcon
                    icon={faTrash}
                    color="#ccc"
                    hovercolor="#f44336"
                    disabled={formik.values?.products?.length <= 1}
                    onClick={() => removeProductFromClaims(index)}
                  />
                </FormGroupWithIcon>
                <FormGroup>
                  <StyledReactSelect
                    label="Currency"
                    name={`products[${index}].currency`}
                    isMulti={false}
                    options={currencies}
                    placeholder={'Select currency'}
                    value={product.currency}
                    onChange={(selected) =>
                      handleArrayValueChange(
                        index,
                        'currency',
                        selected.value,
                        'products',
                      )
                    }
                    onBlur={() =>
                      handleArrayValueOnBlur(index, 'currency', 'products')
                    }
                    error={Boolean(
                      formik.touched.products &&
                        formik.touched.products[index]?.currency &&
                        formik.errors.products &&
                        (formik.errors.products as any)[index]?.currency,
                    )}
                    errorMessage={
                      formik.errors.products &&
                      (formik.errors.products as any)[index]?.currency
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <StyledInput
                    type="text"
                    id={`products[${index}].amount`}
                    label="Claim Amount"
                    name={`products[${index}].amount`}
                    placeholder="Claim Amount"
                    onChange={formik.handleChange}
                    value={product.amount}
                    onBlur={(e) => {
                      let inputValue = e.target.value;
                      if (inputValue !== '') {
                        if (inputValue.startsWith('.')) {
                          inputValue = `0${inputValue}`;
                        }

                        const numericValue = parseFloat(inputValue);

                        handleArrayValueChange(
                          index,
                          'amount',
                          isNaN(numericValue) ? '' : numericValue,
                          'products',
                        );
                      } else {
                        handleArrayValueOnBlur(index, 'amount', 'products');
                      }
                    }}
                    error={Boolean(
                      formik.touched.products &&
                        formik.touched.products[index]?.amount &&
                        formik.errors.products &&
                        (formik.errors.products as any)[index]?.amount,
                    )}
                    errorMessage={
                      formik.errors.products &&
                      (formik.errors.products as any)[index]?.amount
                    }
                  />
                </FormGroup>
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
                setAddPromotionClaimsPayload(formik.values);
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.EDIT_PROMOTION,
                });
              }}
            >
              Back
            </AppButton>
          </FormGroup>
          <FormGroup>
            <AppButton
              type="button"
              variant="outlined"
              width="fit-content"
              onClick={() => resetForm()}
            >
              Reset
            </AppButton>
            <AppButton
              type="submit"
              width="fit-content"
              disabled={hasEmptyValue(formik.values)}
            >
              Next
            </AppButton>
          </FormGroup>
        </FormGroup>
      </FormContainer>
    </FormWrapper>
  );
}
