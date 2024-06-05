/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADD_PROMOTION_DETAILS_PAYLOAD,
  AppButton,
  FormContainer,
  FormGroup,
  FormWrapper,
  ImageEditor,
  MODAL_TYPES,
  PROMOTION_STATUS,
  StyledDatePicker,
  StyledDateRangePicker,
  StyledInput,
  StyledReactSelect,
  ToggleButton,
  createFileFromImageURL,
  hasEmptyValue,
  useAuth,
  useCommon,
  usePromotion,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import * as Yup from 'yup';

interface FormValues {
  name: string;
  description: string;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
  image_url: string;
  show_banner: boolean;
  banner_url?: string;
  send_in_deadline: Date | null;
  payment_due_date: Date | null;
  [key: string]: any; // Index signature to allow dynamic access
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
  show_banner: Yup.boolean().required('Show Banner is required'),
});

export function EditPromotionForm({ data }: any) {
  const { state: commonState, setSideModalState } = useCommon();
  const { sideModalState } = commonState;
  const { state: authState } = useAuth();
  const { activePlatform } = authState;
  const {
    state: promotionState,
    setAddPromotionDetailsPayload,
    setPromotionCardImage,
    setPromotionBannerImage,
  } = usePromotion();
  const { promotionCardImage, promotionBannerImage } = promotionState;

  const resetForm = () => {
    formik.resetForm();
    formik.setFieldTouched('start_date', false);
    formik.setFieldTouched('end_date', false);
    formik.setFieldTouched('send_in_deadline', false);
    formik.setFieldTouched('payment_due_date', false);
    setAddPromotionDetailsPayload(ADD_PROMOTION_DETAILS_PAYLOAD);
  };

  const onSubmit = (values: any) => {
    values.start_date = moment(values.start_date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.end_date = moment(values.end_date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.send_in_deadline = moment(values.send_in_deadline).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.payment_due_date = moment(values.payment_due_date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.new_device_purchase_start_date = moment(
      values.new_device_purchase_start_date,
    ).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.new_device_purchase_end_date = moment(
      values.new_device_purchase_end_date,
    ).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.claim_deadline = moment(values.claim_deadline).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toISOString();
    values.platform = activePlatform;


    setAddPromotionDetailsPayload(values);
    setSideModalState({
      ...sideModalState,
      open: true,
      view: MODAL_TYPES.EDIT_PROMOTION_CLAIMS,
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: ADD_PROMOTION_DETAILS_PAYLOAD,
    validationSchema,
    onSubmit,
  });

  const promotionStatus = PROMOTION_STATUS?.sort(
    (a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label),
  );

  const handleStartDateChange = (date: Date | null) => {
    formik.setFieldValue('start_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
    formik.setFieldValue('end_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
  };

  const handleEndDateChange = (date: Date | null) => {
    
    formik.setFieldValue('end_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
  };

  const handleStartDateOnBlur = () => {
    if (isEmpty(formik.values?.start_date)) {
      formik.setFieldTouched('start_date', true, false);
      formik.setFieldError('start_date', 'Start date is required');
    } else {
      formik.setFieldTouched('start_date', false, false);
      formik.setFieldError('start_date', '');
    }
  };

  const handleDateChange = (fieldName: string, date: Date | null) => {
    formik.setFieldValue(fieldName, moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
  };

  const handleSendInDeadlineDateOnBlur = () => {
    if (isEmpty(formik.values.send_in_deadline)) {
      formik.setFieldTouched('send_in_deadline', true, false);
      formik.setFieldError(
        'send_in_deadline',
        'Device Send In Deadline date is required',
      );
    } else {
      formik.setFieldTouched('send_in_deadline', false, false);
      formik.setFieldError('send_in_deadline', '');
    }
  };

  const handlePaymentDueDateOnBlur = () => {
    if (isEmpty(formik.values.payment_due_date)) {
      formik.setFieldTouched('payment_due_date', true, false);
      formik.setFieldError('payment_due_date', 'Payment due date is required');
    } else {
      formik.setFieldTouched('payment_due_date', false, false);
      formik.setFieldError('payment_due_date', '');
    }
  };

  const handleNewDevicePurchaseStartDateOnBlur = () => {
    if (isEmpty(formik.values.new_device_purchase_start_date)) {
      formik.setFieldTouched('new_device_purchase_start_date', true, false);
      formik.setFieldError(
        'new_device_purchase_start_date',
        'New device purchase date is required',
      );
    } else {
      formik.setFieldTouched('new_device_purchase_start_date', false, false);
      formik.setFieldError('new_device_purchase_start_date', '');
    }
  };

  const handleNewDevicePurchaseStartDateChange = (date: Date | null) => {
    formik.setFieldValue('new_device_purchase_start_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());

    formik.setFieldValue('new_device_purchase_end_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
  };

  const handleNewDevicePurchaseEndDateChange = (date: Date | null) => {
    formik.setFieldValue('new_device_purchase_end_date', moment(date).utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
     }).toDate());
  };

  const handleClaimDeadlineDateOnBlur = () => {
    if (isEmpty(formik.values.claim_deadline)) {
      formik.setFieldTouched('claim_deadline', true, false);
      formik.setFieldError('claim_deadline', 'Claim deadline date is required');
    } else {
      formik.setFieldTouched('claim_deadline', false, false);
      formik.setFieldError('claim_deadline', '');
    }
  };

  const handleCropCardImageComplete = (image: string, fileName: string) => {
    createFileFromImageURL(image, fileName).then((file) => {
      setPromotionCardImage(file);
    });
  };

  const handleCropBannerImageComplete = (image: string, fileName: string) => {
    createFileFromImageURL(image, fileName).then((file) => {
      setPromotionBannerImage(file);
    });
  };

  useEffect(() => {
    const promotionDetails = {
      name: data?.name,
      description: data?.description,
      status: data?.status,
      start_date: moment(data?.start_date).toDate(),
      end_date: moment(data?.end_date).toDate(),
      image_url: data?.image_url,
      show_banner: data?.show_banner,
      banner_url: data?.banner_url,
      send_in_deadline: data?.send_in_deadline,
      payment_due_date: data?.payment_due_date,
    };

    formik.setValues(promotionDetails);
  }, [data]);

  return (
    <FormWrapper formTitle="Edit Promotion" subtTitle="Enter Promotion Details">
      <FormContainer onSubmit={formik.handleSubmit}>
        <FormGroup>
          <StyledInput
            type="text"
            id="name"
            label="Promotion Name"
            name="name"
            placeholder="Promotion Name"
            onChange={formik.handleChange}
            value={formik.values?.name}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.name && formik.errors.name)}
            errorMessage={formik.errors.name}
          />
        </FormGroup>
        <FormGroup>
          <StyledInput
            type="text"
            id="description"
            label="Promotion Description"
            name="description"
            placeholder="Promotion Description"
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
          <StyledReactSelect
            label="Promotion Status"
            name="status"
            options={promotionStatus}
            isMulti={false}
            placeholder="Set status"
            value={formik.values?.status}
            onChange={(selectedOption) => {
              formik.setFieldValue('status', selectedOption.value, true);
            }}
            onBlur={() => formik.setFieldTouched('status')}
            error={Boolean(formik.touched.status && formik.errors.status)}
            errorMessage={formik.errors.status}
          />
        </FormGroup>
        <FormGroup>
          <StyledDateRangePicker
            startDateInput={{
              onChange: handleStartDateChange,
              placeholder: 'Start Date',
              value: formik.values?.start_date,
              name: 'start_date',
              onBlur: handleStartDateOnBlur,
              error: Boolean(
                formik.touched.start_date && formik.errors.start_date,
              ),
              errorMessage: formik.errors.start_date,
            }}
            endDateInput={{
              onChange: handleEndDateChange,
              placeholder: 'End Date',
              value: formik.values?.end_date,
              name: 'end_date',
              onBlur: () => formik.setFieldTouched('end_date', true, false),
              error: Boolean(formik.touched.end_date && formik.errors.end_date),
              errorMessage: formik.errors.end_date,
            }}
            label="Set Promotion Period"
            onChange={() => {}}
          />
        </FormGroup>
        <FormGroup marginBottom="20px">
          <StyledDatePicker
            dateInput={{
              onChange: handleDateChange,
              placeholder: 'Set Date',
              value: formik.values.send_in_deadline,
              name: 'send_in_deadline',
              onBlur: handleSendInDeadlineDateOnBlur,
              error: Boolean(
                formik.touched.send_in_deadline &&
                  formik.errors.send_in_deadline,
              ),
              errorMessage: formik.errors.send_in_deadline,
            }}
            label="Set Device Send In Deadline Date"
            onChange={() => {}}
          />
        </FormGroup>
        <FormGroup marginBottom="20px">
          <StyledDatePicker
            dateInput={{
              onChange: handleDateChange,
              placeholder: 'Set Date',
              value: formik.values.payment_due_date,
              name: 'payment_due_date',
              onBlur: handlePaymentDueDateOnBlur,
              error: Boolean(
                formik.touched.payment_due_date &&
                  formik.errors.payment_due_date,
              ),
              errorMessage: formik.errors.payment_due_date,
            }}
            label="Set Payment Due Date"
            onChange={() => {}}
          />
        </FormGroup>
        <FormGroup marginBottom="20px">
          <ImageEditor
            name="image_url"
            aspectRatio={8 / 3}
            label="Card Image (Recommended Size: 320p x 120p)"
            onImageChange={handleCropCardImageComplete}
            image={formik.values.image_url}
          />
        </FormGroup>
        <FormGroup>
          <ToggleButton
            label="Show Banner"
            name="show_banner"
            isOn={formik.values.show_banner}
            onToggle={() =>
              formik.setFieldValue('show_banner', !formik.values.show_banner)
            }
          />
        </FormGroup>
        {formik.values.show_banner && (
          <FormGroup marginBottom="20px">
            <ImageEditor
              name="banner_url"
              aspectRatio={4 / 1}
              label="Banner Image (Min. Recommended Size: 1080p x 720p)"
              onImageChange={handleCropBannerImageComplete}
              image={formik.values.banner_url}
            />
          </FormGroup>
        )}
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
                hasEmptyValue(formik.values) ||
                !isEmpty(formik.errors) ||
                (isEmpty(formik.values.image_url) && !promotionCardImage) ||
                (formik.values.show_banner &&
                  !promotionBannerImage &&
                  isEmpty(formik.values.banner_url))
              }
            >
              Next
            </AppButton>
          </FormGroup>
        </FormGroup>
      </FormContainer>
    </FormWrapper>
  );
}
