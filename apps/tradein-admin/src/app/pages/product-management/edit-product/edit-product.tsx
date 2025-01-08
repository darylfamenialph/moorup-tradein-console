/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADD_PRODUCT_PAYLOAD,
  AppButton,
  FormContainer,
  FormGroup,
  FormWrapper,
  PageContainer,
  StyledInput,
  StyledReactSelect,
  capitalizeFirstLetter,
  compareObjects,
  hasEmptyValue,
  useAuth,
  useProduct,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';

const ImageContainer = styled.div`
  max-width: 500px;
  width: 100%;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

interface FormValues {
  brand: string;
  model: string;
  year: string;
  display_name: string;
  category: string;
  type: string;
  image_url: string;
  site_url: string;
  status: string;
  platforms: string[];
  [key: string]: any; // Index signature to allow dynamic access
}

const validationSchema = Yup.object().shape({
  display_name: Yup.string().required('Display Name is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.string().required('Year is required'),
  image_url: Yup.string()
    .required('Image URL is required.')
    .url('Enter a valid URL'),
  site_url: Yup.string().url('Enter a valid URL'),
});

export function EditProductDetails({ productData }: { productData: any }) {
  const {
    state: productState,
    getProductCategories,
    getProductBrands,
    setAddProductPayload,
    setIncludeProductVariant,
    updateProduct,
  } = useProduct();
  const {
    productTypes,
    productCategories,
    productBrands,
    productStatuses,
    isFetchingProductCategories,
    isFetchingProductBrands,
  } = productState;

  const { state: authState } = useAuth();
  const { userDetails } = authState;

  const [initialFormValues, setInitialFormValues] = useState({});

  const resetForm = () => {
    setAddProductPayload(ADD_PRODUCT_PAYLOAD);
    setIncludeProductVariant(false);
    formik.resetForm();
    formik.setFieldTouched('platforms', false);
  };

  const onSubmit = (values: any) => {
    values.name = values.display_name;
    updateProduct(productData._id, values);
  };

  const formik = useFormik<FormValues>({
    initialValues: ADD_PRODUCT_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (!isEmpty(productData)) {
      const PRODUCT_VARIANT_PAYLOAD = {
        display_name: productData?.display_name,
        type: productData?.type,
        category: productData?.category,
        brand: productData?.brand,
        status: productData?.status,
        model: productData?.model,
        year: productData?.year,
        platforms: productData?.platforms,
        image_url: productData?.image_url,
        site_url: productData?.site_url,
      };

      setInitialFormValues(PRODUCT_VARIANT_PAYLOAD);
      formik.setValues(PRODUCT_VARIANT_PAYLOAD);

      getProductCategories(productData.type);
      getProductBrands(productData.type);
    }
  }, []);

  const types = productTypes
    ?.map((item: any) => ({
      value: item,
      label: capitalizeFirstLetter(item),
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  const categories = productCategories
    ?.map((item: any) => ({
      value: item.site_url,
      label: item.name,
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  const brands = productBrands
    ?.map((item: any) => ({
      value: item.name,
      label: item.name,
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  const statuses = productStatuses
    ?.map((item: any) => ({
      value: item,
      label: capitalizeFirstLetter(item),
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  const platforms = userDetails?.platforms
    ?.map((item: any) => ({
      value: item,
      label: capitalizeFirstLetter(item),
    }))
    .sort((a: { label: string }, b: { label: any }) =>
      a.label.localeCompare(b.label),
    );

  return (
    <PageContainer bgColor="white">
      <ImageContainer>
        <Image src={formik.values?.image_url} alt={formik.values?.image_url} />
      </ImageContainer>
      <FormWrapper width="100%">
        <FormContainer onSubmit={formik.handleSubmit}>
          <FormGroup>
            <StyledInput
              type="text"
              id="display_name"
              label="Display Name"
              name="display_name"
              placeholder="Display Name"
              onChange={formik.handleChange}
              value={formik.values.display_name}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.touched.display_name && formik.errors.display_name,
              )}
              errorMessage={formik.errors.display_name}
            />
          </FormGroup>
          <FormGroup>
            <StyledReactSelect
              label="Type"
              name="type"
              isMulti={false}
              options={types}
              placeholder="Select type"
              value={formik.values.type}
              onChange={(selected) => {
                formik.setFieldValue('type', selected.value, true);
                getProductCategories(selected.value);
                getProductBrands(selected.value);
              }}
              onBlur={() => formik.setFieldTouched('type')}
              error={Boolean(
                formik.touched.type && isEmpty(formik.values.type),
              )}
              errorMessage="Type is required."
            />
            <StyledReactSelect
              label="Category"
              name="category"
              isMulti={false}
              options={categories}
              placeholder="Select category"
              value={formik.values.category}
              onChange={(selected) => {
                formik.setFieldValue('category', selected.value, true);
              }}
              disabled={
                isEmpty(formik.values.type) || isFetchingProductCategories
              }
              onBlur={() => formik.setFieldTouched('category')}
              error={Boolean(
                formik.touched.category && isEmpty(formik.values.category),
              )}
              errorMessage="Category is required."
            />
          </FormGroup>
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
              }}
              disabled={isEmpty(formik.values.type) || isFetchingProductBrands}
              onBlur={() => formik.setFieldTouched('brand')}
              error={Boolean(
                formik.touched.brand && isEmpty(formik.values.brand),
              )}
              errorMessage="Brand is required."
            />
            <StyledReactSelect
              label="Status"
              name="status"
              isMulti={false}
              options={statuses}
              placeholder="Select status"
              value={formik.values.status}
              onChange={(selected) => {
                formik.setFieldValue('status', selected.value, true);
              }}
              onBlur={() => formik.setFieldTouched('status')}
              error={Boolean(
                formik.touched.status && isEmpty(formik.values.status),
              )}
              errorMessage="Status is required."
            />
          </FormGroup>
          <FormGroup>
            <StyledInput
              type="text"
              id="model"
              label="Model"
              name="model"
              placeholder="Model"
              onChange={formik.handleChange}
              value={formik.values.model}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.model && formik.errors.model)}
              errorMessage={formik.errors.model}
            />
            <StyledInput
              type="text"
              id="year"
              label="Year"
              name="year"
              placeholder="Year"
              onChange={formik.handleChange}
              value={formik.values.year}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.year && formik.errors.year)}
              errorMessage={formik.errors.year}
            />
          </FormGroup>
          <FormGroup>
            <StyledInput
              type="text"
              id="image_url"
              label="Image URL"
              name="image_url"
              placeholder="Image URL"
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
              id="site_url"
              label="Site URL"
              name="site_url"
              placeholder="Site URL"
              onChange={formik.handleChange}
              value={formik.values.site_url}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.site_url && formik.errors.site_url)}
              errorMessage={formik.errors.site_url}
            />
          </FormGroup>
          <FormGroup>
            <StyledReactSelect
              label="Platforms"
              name="platforms"
              options={platforms}
              isMulti
              placeholder="Select platform"
              value={formik.values.platforms}
              onChange={(selectedPlatforms) => {
                const platformValues = selectedPlatforms.map(
                  (option: any) => option.value,
                );
                formik.setFieldValue('platforms', platformValues, true);
              }}
              onBlur={() => formik.setFieldTouched('platforms')}
              error={Boolean(
                formik.touched.platforms && isEmpty(formik.values.platforms),
              )}
              errorMessage="At least one platform is required"
            />
          </FormGroup>
          <FormGroup>
            <span />
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
                disabled={
                  hasEmptyValue(formik.values, ['site_url']) ||
                  compareObjects(initialFormValues, formik.values)
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
