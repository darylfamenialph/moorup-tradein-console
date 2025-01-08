/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ADD_PRODUCT_VARIANT_ATTRIBUTES_PAYLOAD,
  ADD_PRODUCT_VARIANT_PRICING_PAYLOAD,
  ATTRIBUTES,
  AppButton,
  CURRENCIES,
  FormContainer,
  FormGroup,
  FormGroupWithIcon,
  FormWrapper,
  PageContainer,
  ProductVariantAttributes,
  ProductVariantPricing,
  StyledInput,
  StyledReactSelect,
  compareJSON,
  hasEmptyValue,
  hasEmptyValueInArray,
  useProduct,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
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

const VariantItemTitle = styled.h3`
  color: #01463a;
`;

const VariantItemsContainer = styled.div`
  box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1);

  padding: 20px;
  margin-bottom: 10px;
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  sku: Yup.string().required('SKU is required'),
  image_url: Yup.string()
    .required('Image URL is required.')
    .url('Enter a valid URL'),
  site_url: Yup.string().url('Enter a valid URL'),
});

export function EditProductVariant({ productData }: { productData: any }) {
  const { addProductVariant, updateProductVariant } = useProduct();
  const DEFAULT_SELECTED_VARIANT = {
    value: '',
    label: '',
    id: '',
  };

  const PRODUCT_VARIANT_PAYLOAD = {
    name: '',
    sku: '',
    type: productData.type,
    image_url: '',
    site_url: '',
    status: productData.status,
    pricing: [ADD_PRODUCT_VARIANT_PRICING_PAYLOAD],
    attributes: [ADD_PRODUCT_VARIANT_ATTRIBUTES_PAYLOAD],
  };

  const [addFormMode, setAddFormMode] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState(
    DEFAULT_SELECTED_VARIANT,
  );

  const onSubmit = (values: any) => {
    if (addFormMode) {
      addProductVariant(productData._id, values);
    } else {
      const variantId = values._id;
      delete values._id;
      updateProductVariant(variantId, productData._id, values);
    }
  };

  const formik = useFormik({
    initialValues: PRODUCT_VARIANT_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  const currencies = CURRENCIES?.sort(
    (a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label),
  );

  const attributes = ATTRIBUTES[productData.type]?.sort(
    (a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label),
  );

  const variants = productData?.variants
    ?.map((item: any) => ({
      value: item?.name,
      label: item?.name,
      id: item?._id,
      ...item,
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  const findVariantById = (variants: any, id: string) => {
    return variants.find((variant: any) => variant._id === id);
  };

  const handleSelectProductVariant = (value: any) => {
    setSelectedVariant(value);
    const variant = findVariantById(productData?.variants, value._id);
    formik.setValues(variant);
  };

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

  const handleArrayItemDelete = (fieldIndex: number, arrayField: string) => {
    // @ts-ignore
    const variantItemArray = formik.values[arrayField];

    if (variantItemArray.length > 1) {
      if (
        Array.isArray(variantItemArray) &&
        variantItemArray.length > fieldIndex
      ) {
        const updatedItemArray = [
          ...variantItemArray.slice(0, fieldIndex),
          ...variantItemArray.slice(fieldIndex + 1),
        ];

        formik.setFieldValue(`${arrayField}`, updatedItemArray);
      }
    }
  };

  const handleSwitchFormMode = () => {
    setAddFormMode((prev) => !prev);
    setSelectedVariant(DEFAULT_SELECTED_VARIANT);
    formik.resetForm();
  };

  const addToArrayField = (
    fieldName: string,
    newValue: any,
    formValues: any,
  ) => {
    const currentArray = formValues[fieldName] || [];

    formik.setValues({
      ...formValues,
      [fieldName]: [...currentArray, newValue],
    });
  };

  const handleReset = () => {
    setSelectedVariant(DEFAULT_SELECTED_VARIANT);
    formik.resetForm();
  };

  return (
    <PageContainer bgColor="white">
      <FormWrapper width="100%" padding="0px 20px">
        <FormContainer onSubmit={formik.handleSubmit}>
          <FormGroup>
            <VariantItemTitle>
              {addFormMode ? 'Add new variant' : 'Edit a variant'}
            </VariantItemTitle>
            <AppButton
              type="button"
              width="fit-content"
              onClick={() => handleSwitchFormMode()}
            >
              {!addFormMode ? 'Add new variant' : 'Edit a variant'}
            </AppButton>
          </FormGroup>
          {!addFormMode && (
            <FormGroup>
              <StyledReactSelect
                label="Select a variant to update"
                name="selectedProductVariant"
                isMulti={false}
                options={variants}
                placeholder="Select"
                value={selectedVariant.value}
                onChange={(selected) => handleSelectProductVariant(selected)}
              />
            </FormGroup>
          )}
          {((!isEmpty(selectedVariant.value) && !addFormMode) ||
            addFormMode) && (
            <>
              <FormGroup>
                <StyledInput
                  type="text"
                  id={'name'}
                  label={'Name'}
                  name={'name'}
                  placeholder={'Name'}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  errorMessage={formik.errors.name}
                />
                <StyledInput
                  type="text"
                  id={'sku'}
                  label={'SKU'}
                  name={'sku'}
                  placeholder={'SKU'}
                  onChange={formik.handleChange}
                  value={formik.values.sku}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.sku && formik.errors.sku)}
                  errorMessage={formik.errors.sku}
                />
              </FormGroup>
              <FormGroup>
                <StyledInput
                  type="text"
                  id={'image_url'}
                  label={'Image URL'}
                  name={'image_url'}
                  placeholder={'Image URL'}
                  onChange={formik.handleChange}
                  value={formik.values.image_url}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.image_url && formik.errors.image_url,
                  )}
                  errorMessage={formik.errors.image_url}
                />
              </FormGroup>
              <FormGroup>
                <StyledInput
                  type="text"
                  id={'site_url'}
                  label={'Site URL'}
                  name={'site_url'}
                  placeholder={'Site URL'}
                  onChange={formik.handleChange}
                  value={formik.values.site_url}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.site_url && formik.errors.site_url,
                  )}
                  errorMessage={formik.errors.site_url}
                />
              </FormGroup>
              <FormGroup>
                <VariantItemTitle>Pricing</VariantItemTitle>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() =>
                    addToArrayField(
                      'pricing',
                      ADD_PRODUCT_VARIANT_PRICING_PAYLOAD,
                      formik.values,
                    )
                  }
                  disabled={
                    formik.values.pricing.length > 0 &&
                    hasEmptyValueInArray(formik.values.pricing)
                  }
                >
                  Add Pricing
                </AppButton>
              </FormGroup>
              {formik.values?.pricing.map(
                (price: ProductVariantPricing, priceIndex: number) => {
                  return (
                    <VariantItemsContainer key={priceIndex}>
                      <FormGroupWithIcon>
                        <StyledReactSelect
                          label={'Currency'}
                          name={`pricing[${priceIndex}].currency`}
                          isMulti={false}
                          options={currencies}
                          placeholder={'Select currency'}
                          value={price.currency}
                          onChange={(selected) =>
                            handleArrayValueChange(
                              priceIndex,
                              'currency',
                              selected.value,
                              'pricing',
                            )
                          }
                          onBlur={() =>
                            handleArrayValueOnBlur(
                              priceIndex,
                              'currency',
                              'pricing',
                            )
                          }
                          error={Boolean(
                            formik.touched.pricing &&
                              formik.touched.pricing[priceIndex] &&
                              isEmpty(price.currency),
                          )}
                          errorMessage="Currency is required."
                        />
                        <StyledIcon
                          icon={faTrash}
                          color="#ccc"
                          hovercolor="#f44336"
                          disabled={formik.values.pricing.length <= 1}
                          onClick={() =>
                            handleArrayItemDelete(priceIndex, 'pricing')
                          }
                        />
                      </FormGroupWithIcon>
                      <FormGroup>
                        <StyledInput
                          type="text"
                          id={`pricing[${priceIndex}].working`}
                          label={'Working'}
                          name={`pricing[${priceIndex}].working`}
                          placeholder={'0.00'}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue.replace(/[^0-9.]/g, '');

                            const dotCount = inputValue.split('.').length - 1;
                            if (dotCount > 1) {
                              inputValue = inputValue.substring(
                                0,
                                inputValue.lastIndexOf('.'),
                              );
                            }

                            if (inputValue.includes('.')) {
                              const parts = inputValue.split('.');
                              inputValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
                            }

                            handleArrayValueChange(
                              priceIndex,
                              'working',
                              inputValue === '' ? '' : inputValue,
                              'pricing',
                            );
                          }}
                          onBlur={(e) => {
                            let inputValue = e.target.value;
                            if (inputValue !== '') {
                              if (inputValue.startsWith('.')) {
                                inputValue = `0${inputValue}`;
                              }

                              const numericValue = parseFloat(inputValue);

                              handleArrayValueChange(
                                priceIndex,
                                'working',
                                isNaN(numericValue) ? '' : numericValue,
                                'pricing',
                              );
                            }
                          }}
                          value={price.working}
                        />
                        <StyledInput
                          type="text"
                          id={`pricing[${priceIndex}].working_damaged`}
                          label={'Damaged but Working'}
                          name={`pricing[${priceIndex}].working_damaged`}
                          placeholder={'0.00'}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue.replace(/[^0-9.]/g, '');

                            const dotCount = inputValue.split('.').length - 1;
                            if (dotCount > 1) {
                              inputValue = inputValue.substring(
                                0,
                                inputValue.lastIndexOf('.'),
                              );
                            }

                            if (inputValue.includes('.')) {
                              const parts = inputValue.split('.');
                              inputValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
                            }

                            handleArrayValueChange(
                              priceIndex,
                              'working_damaged',
                              inputValue === '' ? '' : inputValue,
                              'pricing',
                            );
                          }}
                          onBlur={(e) => {
                            let inputValue = e.target.value;
                            if (inputValue !== '') {
                              if (inputValue.startsWith('.')) {
                                inputValue = `0${inputValue}`;
                              }

                              const numericValue = parseFloat(inputValue);

                              handleArrayValueChange(
                                priceIndex,
                                'working_damaged',
                                isNaN(numericValue) ? '' : numericValue,
                                'pricing',
                              );
                            }
                          }}
                          value={price.working_damaged}
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledInput
                          type="text"
                          id={`pricing[${priceIndex}].not_working`}
                          label={'Not Working'}
                          name={`pricing[${priceIndex}].not_working`}
                          placeholder={'0.00'}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue.replace(/[^0-9.]/g, '');

                            const dotCount = inputValue.split('.').length - 1;
                            if (dotCount > 1) {
                              inputValue = inputValue.substring(
                                0,
                                inputValue.lastIndexOf('.'),
                              );
                            }

                            if (inputValue.includes('.')) {
                              const parts = inputValue.split('.');
                              inputValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
                            }

                            handleArrayValueChange(
                              priceIndex,
                              'not_working',
                              inputValue === '' ? '' : inputValue,
                              'pricing',
                            );
                          }}
                          onBlur={(e) => {
                            let inputValue = e.target.value;
                            if (inputValue !== '') {
                              if (inputValue.startsWith('.')) {
                                inputValue = `0${inputValue}`;
                              }

                              const numericValue = parseFloat(inputValue);

                              handleArrayValueChange(
                                priceIndex,
                                'not_working',
                                isNaN(numericValue) ? '' : numericValue,
                                'pricing',
                              );
                            }
                          }}
                          value={price.not_working}
                        />
                        <StyledInput
                          type="text"
                          id={`pricing[${priceIndex}].not_working_damaged`}
                          label={'Damaged and Not Working'}
                          name={`pricing[${priceIndex}].not_working_damaged`}
                          placeholder={'0.00'}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue.replace(/[^0-9.]/g, '');

                            const dotCount = inputValue.split('.').length - 1;
                            if (dotCount > 1) {
                              inputValue = inputValue.substring(
                                0,
                                inputValue.lastIndexOf('.'),
                              );
                            }

                            if (inputValue.includes('.')) {
                              const parts = inputValue.split('.');
                              inputValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
                            }

                            handleArrayValueChange(
                              priceIndex,
                              'not_working_damaged',
                              inputValue === '' ? '' : inputValue,
                              'pricing',
                            );
                          }}
                          onBlur={(e) => {
                            let inputValue = e.target.value;
                            if (inputValue !== '') {
                              if (inputValue.startsWith('.')) {
                                inputValue = `0${inputValue}`;
                              }

                              const numericValue = parseFloat(inputValue);

                              handleArrayValueChange(
                                priceIndex,
                                'not_working_damaged',
                                isNaN(numericValue) ? '' : numericValue,
                                'pricing',
                              );
                            }
                          }}
                          value={price.not_working_damaged}
                        />
                      </FormGroup>
                    </VariantItemsContainer>
                  );
                },
              )}
              <FormGroup>
                <VariantItemTitle>Attributes</VariantItemTitle>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() =>
                    addToArrayField(
                      'attributes',
                      ADD_PRODUCT_VARIANT_ATTRIBUTES_PAYLOAD,
                      formik.values,
                    )
                  }
                  disabled={
                    formik.values.attributes.length > 0 &&
                    hasEmptyValueInArray(formik.values.attributes)
                  }
                >
                  Add Attribute
                </AppButton>
              </FormGroup>
              {formik.values.attributes.map(
                (attribute: ProductVariantAttributes, attributeIndex: any) => (
                  <VariantItemsContainer key={attributeIndex}>
                    <FormGroupWithIcon>
                      <StyledReactSelect
                        label={'Attribute Type'}
                        name={`attributes[${attributeIndex}].id`}
                        isMulti={false}
                        options={attributes}
                        placeholder={'Select attribute type'}
                        value={attribute.id}
                        onChange={(selected) =>
                          handleArrayValueChange(
                            attributeIndex,
                            'id',
                            selected.value,
                            'attributes',
                          )
                        }
                        onBlur={() =>
                          handleArrayValueOnBlur(
                            attributeIndex,
                            'id',
                            'attributes',
                          )
                        }
                        error={Boolean(
                          formik.touched.attributes &&
                            formik.touched.attributes[attributeIndex] &&
                            isEmpty(attribute.id),
                        )}
                        errorMessage="Attribute type is required."
                      />
                      <StyledIcon
                        icon={faTrash}
                        color="#ccc"
                        hovercolor="#f44336"
                        disabled={formik.values.attributes.length <= 1}
                        onClick={() =>
                          handleArrayItemDelete(attributeIndex, 'attributes')
                        }
                      />
                    </FormGroupWithIcon>
                    <FormGroup>
                      <StyledInput
                        type="text"
                        id={`attributes[${attributeIndex}].name`}
                        label={'Attribute Value'}
                        name={`attributes[${attributeIndex}].name`}
                        placeholder={'Enter value'}
                        onChange={(e) => {
                          handleArrayValueChange(
                            attributeIndex,
                            'name',
                            e.target.value,
                            'attributes',
                          );
                        }}
                        onBlur={() =>
                          handleArrayValueOnBlur(
                            attributeIndex,
                            'name',
                            'attributes',
                          )
                        }
                        value={attribute.name}
                        error={Boolean(
                          formik.touched.attributes &&
                            formik.touched.attributes[attributeIndex] &&
                            isEmpty(attribute.name),
                        )}
                        errorMessage="Attribute value is required."
                      />
                    </FormGroup>
                  </VariantItemsContainer>
                ),
              )}
            </>
          )}
          <FormGroup>
            <span />
            <FormGroup>
              <AppButton
                type="button"
                variant="outlined"
                width="fit-content"
                onClick={() => handleReset()}
              >
                Reset
              </AppButton>
              <AppButton
                type="submit"
                width="fit-content"
                disabled={
                  hasEmptyValue(formik.values, ['site_url']) ||
                  compareJSON(
                    formik.values,
                    findVariantById(productData.variants, selectedVariant.id),
                  )
                }
              >
                Save
              </AppButton>
            </FormGroup>
          </FormGroup>
        </FormContainer>
      </FormWrapper>
    </PageContainer>
  );
}
