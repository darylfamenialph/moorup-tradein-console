/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppButton,
  FormContainer,
  FormGroup,
  FormWrapper,
  LoaderContainer,
  PageContainer,
  StyledInput,
  ToggleButton,
  VerticalPills,
  compareJSON,
  useAuth,
  usePermission,
  StyledTextarea,
  Divider,
  CustomEditor,
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
  black_banner: Yup.object().shape({
    enable: Yup.boolean(),
    text: Yup.string(),
    url: Yup.string(),
    showOnTop: Yup.boolean(),
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

  const [enableBlackBanner, setEnableBlackBanner] = useState<boolean>(
    platformConfig?.black_banner?.enable || false,
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getPlatformConfig(activePlatform, signal);
    }

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
      contactDetails: {
        number: '',
        email: '',
      },
      enable_upfront: false,
      black_banner: {
        enable: false,
        text: '',
        url: '',
        showOnTop: false,
        bannerPopup: {
          enabled: false,
          headerText: '',
          context: '',
        },
      },
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
    'Banner Popup Configuration',
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
      {/**BANNER POPUP CONFIG */}
      <div className="mb-4">
        <strong className="text-xl">Black Banner</strong>
      </div>
      <FormGroup>
        <div className="flex gap-4">
          <ToggleButton
            label="Show Black Banner"
            name="black_banner.enable"
            isOn={formik.values?.black_banner?.enable}
            onToggle={() =>
              formik.setFieldValue(
                'black_banner.enable',
                !formik.values?.black_banner?.enable,
              )
            }
          />
          <Divider />
          <ToggleButton
            label="Display On Top"
            name="black_banner.showOnTop"
            isOn={formik.values?.black_banner?.showOnTop}
            onToggle={() =>
              formik.setFieldValue(
                'black_banner.showOnTop',
                !formik.values?.black_banner?.showOnTop,
              )
            }
          />
        </div>
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="black_banner.text"
          label="Black Banner Text"
          name="black_banner.text"
          placeholder="Black Banner Text"
          onChange={formik.handleChange}
          value={formik.values?.black_banner?.text}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="black_banner.url"
          label="URL"
          name="black_banner.url"
          placeholder="URL"
          onChange={formik.handleChange}
          value={formik.values?.black_banner?.url}
          onBlur={formik.handleBlur}
        />
      </FormGroup>

      <div className="mt-6 mb-4">
        <strong className="text-xl">Banner Popup</strong>
      </div>
      <FormGroup>
        <ToggleButton
          label="Show Banner Popup"
          name="black_banner.bannerPopup.enabled"
          isOn={formik.values?.black_banner?.bannerPopup?.enabled}
          onToggle={() =>
            formik.setFieldValue(
              'black_banner.bannerPopup.enabled',
              !formik.values?.black_banner?.bannerPopup?.enabled,
            )
          }
        />
      </FormGroup>
      <FormGroup>
        <StyledInput
          type="text"
          id="black_banner.text"
          label="Banner Popup Header Text"
          name="black_banner.bannerPopup.headerText"
          placeholder="Banner Popup Header Text"
          onChange={formik.handleChange}
          value={formik.values?.black_banner?.bannerPopup?.headerText}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <FormGroup>
        <CustomEditor
          name="black_banner.bannerPopup.context"
          label="Banner Popup Body Text"
          value={formik.values?.black_banner?.bannerPopup?.context}
          onChange={(e: any) => {
            formik.setFieldValue(
              'black_banner.bannerPopup.context',
              e.target.value,
            );
          }}
          onBlur={() => {
            formik.setFieldTouched('black_banner.bannerPopup.context', true);
          }}
          error={Boolean(
            formik.touched?.black_banner &&
              formik.touched?.black_banner?.bannerPopup?.context &&
              formik.errors?.black_banner &&
              (formik.errors?.black_banner as any)?.bannerPopup?.context,
          )}
          errorMessage={
            formik.errors?.black_banner &&
            (formik.errors?.black_banner as any)?.bannerPopup?.context
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
