/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppButton,
  FormContainer,
  FormGroup,
  FormWrapper,
  LoaderContainer,
  PREZZEE_SUPPORTED_PLATFORMS,
  PageContainer,
  PaymentFlow,
  StyledInput,
  StyledReactSelect,
  ToggleButton,
  VerticalPills,
  capitalizeFirstLetter,
  compareJSON,
  useAuth,
  usePermission,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  operationHoursConfig: Yup.object().shape({
    supportedTime: Yup.string().required('Supported time is required'),
    monFri: Yup.string().required('Monday to Friday hours are required'),
    sat: Yup.string().required('Saturday hours are required'),
    sun: Yup.string().required('Sunday hours are required'),
    closeOn: Yup.string().required('Close on details are required'),
  }),
  contactDetails: Yup.object().shape({
    number: Yup.string().required('Contact number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
  enable_upfront: Yup.boolean(),
  gc_balance_details: Yup.object().shape({
    minimum_balance_required: Yup.number().required(
      'Minimum balance is required',
    ),
  }),
});

export function ConfigurationsPage() {
  const { hasEditPlatformConfigsPermissions } = usePermission();
  const {
    state: authState,
    getPlatformConfig,
    clearPlatformConfig,
    updatePlatformConfig,
  } = useAuth();
  const { activePlatform, platformConfig, isFetchingPlatformConfig } =
    authState;

  const [enableUpfront, setEnableUpfront] = useState<boolean>(
    platformConfig?.enable_upfront,
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) getPlatformConfig(activePlatform, signal);

    return () => {
      controller.abort();
      resetForm();

      // Clear data on unmount
      clearPlatformConfig({});
    };
  }, [activePlatform]);

  const resetForm = () => {
    formik.resetForm();
  };

  const onSubmit = (values: any) => {
    const platformId = values._id;
    delete values._id;

    updatePlatformConfig(platformId, values);
  };

  const formik = useFormik({
    initialValues: {
      operationHoursConfig: {
        supportedTime: '',
        monFri: '',
        sat: '',
        sun: '',
        closeOn: '',
      },
      contactDetails: { number: '', email: '' },
      enable_upfront: false,
      payment_flow: { upfront: '', post_assessment: '' },
      gc_balance_details: { minimum_balance_required: '' },
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (!isEmpty(platformConfig)) {
      formik.setValues(platformConfig);
    }
  }, [platformConfig]);

  const labels = [
    'Business Operation Hours',
    'Contact Details',
    'Credit Type Configuration',
    PREZZEE_SUPPORTED_PLATFORMS.includes(platformConfig?.platform) === true
      ? 'Payment Flow Configuration'
      : '',
  ];

  const contents = [
    <>
      <FormGroup>
        <StyledInput
          type="text"
          id="operationHoursConfig.supportedTime"
          label="Support Hours Label"
          name="operationHoursConfig.supportedTime"
          placeholder="Support Hours Label"
          onChange={formik.handleChange}
          value={formik.values?.operationHoursConfig?.supportedTime}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.operationHoursConfig?.supportedTime &&
              formik.errors?.operationHoursConfig?.supportedTime,
          )}
          errorMessage={formik.errors?.operationHoursConfig?.supportedTime}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="operationHoursConfig.monFri"
          label="Monday to Friday Schedule"
          name="operationHoursConfig.monFri"
          placeholder="Mon-Fri Schedule"
          onChange={formik.handleChange}
          value={formik.values?.operationHoursConfig?.monFri}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.operationHoursConfig?.monFri &&
              formik.errors?.operationHoursConfig?.monFri,
          )}
          errorMessage={formik.errors?.operationHoursConfig?.monFri}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="operationHoursConfig.sat"
          label="Saturday Schedule"
          name="operationHoursConfig.sat"
          placeholder="Saturday Schedule"
          onChange={formik.handleChange}
          value={formik.values?.operationHoursConfig?.sat}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.operationHoursConfig?.sat &&
              formik.errors?.operationHoursConfig?.sat,
          )}
          errorMessage={formik.errors?.operationHoursConfig?.sat}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="operationHoursConfig.sun"
          label="Sunday Schedule"
          name="operationHoursConfig.sun"
          placeholder="Sunday Schedule"
          onChange={formik.handleChange}
          value={formik.values?.operationHoursConfig?.sun}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.operationHoursConfig?.sun &&
              formik.errors?.operationHoursConfig?.sun,
          )}
          errorMessage={formik.errors?.operationHoursConfig?.sun}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="operationHoursConfig.closeOn"
          label="Closed During"
          name="operationHoursConfig.closeOn"
          placeholder="Closed During"
          onChange={formik.handleChange}
          value={formik.values?.operationHoursConfig?.closeOn}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.operationHoursConfig?.closeOn &&
              formik.errors?.operationHoursConfig?.closeOn,
          )}
          errorMessage={formik.errors?.operationHoursConfig?.closeOn}
        />
      </FormGroup>
    </>,
    <>
      <FormGroup>
        <StyledInput
          type="text"
          id="contactDetails.email"
          label="Email"
          name="contactDetails.email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values?.contactDetails?.email}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.contactDetails?.email &&
              formik.errors?.contactDetails?.email,
          )}
          errorMessage={formik.errors?.contactDetails?.email}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="contactDetails.number"
          label="Telephone/Mobile Number"
          name="contactDetails.number"
          placeholder="Telephone/Mobile Number"
          onChange={formik.handleChange}
          value={formik.values?.contactDetails?.number}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.contactDetails?.number &&
              formik.errors?.contactDetails?.number,
          )}
          errorMessage={formik.errors?.contactDetails?.number}
        />
      </FormGroup>
    </>,
    <FormGroup>
      <ToggleButton
        label="Enable Upfront"
        name="enable_upfront"
        isOn={enableUpfront}
        onToggle={() => setEnableUpfront(!enableUpfront)}
      />
    </FormGroup>,
    <>
      <FormGroup>
        <StyledReactSelect
          label="Upfront Payment Flow"
          name="payment_flow.upfront"
          isMulti={false}
          options={[
            {
              label: capitalizeFirstLetter(PaymentFlow.AUTO),
              value: PaymentFlow.AUTO,
            },
            {
              label: capitalizeFirstLetter(PaymentFlow.MANUAL),
              value: PaymentFlow.MANUAL,
            },
          ]}
          placeholder="Select Flow"
          value={formik.values?.payment_flow?.upfront}
          onChange={(selected) => {
            formik.setFieldValue('payment_flow.upfront', selected.value, true);
          }}
          onBlur={() => formik.setFieldTouched('payment_flow.upfront')}
          errorMessage="ayment Flow is required."
        />
      </FormGroup>
      <FormGroup>
        <StyledReactSelect
          label="Post-assessment Payment Flow"
          name="payment_flow.post_assessment"
          isMulti={false}
          options={[
            {
              label: capitalizeFirstLetter(PaymentFlow.AUTO),
              value: PaymentFlow.AUTO,
            },
            {
              label: capitalizeFirstLetter(PaymentFlow.MANUAL),
              value: PaymentFlow.MANUAL,
            },
          ]}
          placeholder="Select Flow"
          value={formik.values?.payment_flow?.post_assessment}
          onChange={(selected) => {
            formik.setFieldValue(
              'payment_flow.post_assessment',
              selected.value,
              true,
            );
          }}
          onBlur={() => formik.setFieldTouched('payment_flow.post_assessment')}
          errorMessage="Payment Flow is required."
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="gc_balance_details.minimum_balance_required"
          label="Giftcard Minimum Balance"
          name="gc_balance_details.minimum_balance_required"
          placeholder="Minimum Balance"
          onChange={formik.handleChange}
          value={Number(
            formik.values?.gc_balance_details?.minimum_balance_required,
          )}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched?.gc_balance_details?.minimum_balance_required &&
              formik.errors?.gc_balance_details?.minimum_balance_required,
          )}
          errorMessage={
            formik.errors?.gc_balance_details?.minimum_balance_required
          }
        />
      </FormGroup>
    </>,
  ];

  return (
    <LoaderContainer
      color="#01463a"
      margin="20px"
      padding="10px"
      height="auto"
      bgColor="transparent"
      loading={isFetchingPlatformConfig}
      title="Configurations"
    >
      <div style={{ marginTop: '20px' }}>
        <PageContainer>
          <FormWrapper padding="0px" width="100%">
            <FormContainer onSubmit={formik.handleSubmit}>
              <VerticalPills labels={labels} contents={contents} />
            </FormContainer>
          </FormWrapper>
        </PageContainer>
        {hasEditPlatformConfigsPermissions && (
          <FormGroup>
            <span />
            <AppButton
              type="button"
              variant="fill"
              width="fit-content"
              onClick={() => onSubmit(formik.values)}
              disabled={compareJSON(platformConfig, formik.values)}
            >
              Save Changes
            </AppButton>
          </FormGroup>
        )}
      </div>
    </LoaderContainer>
  );
}
