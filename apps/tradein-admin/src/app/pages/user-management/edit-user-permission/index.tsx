/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ACTIONABLES_ITEMS,
  AppButton,
  Checkbox,
  DASHBOARD_MANAGEMENT_ITEMS,
  FormContainer,
  FormGroup,
  FormWrapper,
  MODAL_TYPES,
  ORDER_MANAGEMENT_ITEMS,
  PRODUCT_MANAGEMENT_ITEMS,
  PROMOTION_MANAGEMENT_ITEMS,
  ParentCheckbox,
  PermissionCodes,
  USER_MANAGEMENT_ITEMS,
  compareObjects,
  hasEmptyValue,
  useAuth,
  useCommon,
  useUser,
} from '@tradein-admin/libs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

interface FormValues {
  permissions: string[];
  [key: string]: any; // Index signature to allow dynamic access
}

const DEFAULT_VALUES = {
  permissions: [],
};

const validationSchema = Yup.object().shape({
  permissions: Yup.array().of(Yup.string()),
});

export function EditUserPermissionForm({ data }: any) {
  const { state: commonState, setSideModalState } = useCommon();
  const { sideModalState } = commonState;

  const { state: authState } = useAuth();
  const { userDetails } = authState;

  const { state: userState, updateUser } = useUser();
  const { updateUserDetailsPayload } = userState;
  const [currentUserData, setCurrentUserData] = useState({});

  const resetForm = () => {
    formik.resetForm();
  };

  const onSubmit = (values: any) => {
    const payload = {
      ...updateUserDetailsPayload,
      permissions: values.permissions,
    };

    updateUser(data?._id, userDetails?._id, payload);
    setSideModalState({ ...sideModalState, view: null, open: false });
  };

  const formik = useFormik<FormValues>({
    initialValues: DEFAULT_VALUES,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    setCurrentUserData(data);
    formik.setValues({ permissions: data.permissions ?? [] });
  }, [data]);

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      formik.setValues({
        ...formik.values,
        permissions: [...formik.values.permissions, value],
      });
    } else {
      formik.setValues({
        ...formik.values,
        permissions: formik.values.permissions.filter((item) => item !== value),
      });
    }
  };

  const addPermissions = (valuesToAdd: string[]) => {
    const newPermissions = valuesToAdd.filter(
      (value) => !formik.values.permissions.includes(value),
    );
    return [...formik.values.permissions, ...newPermissions];
  };

  const removePermissions = (valuesToRemove: string[]) => {
    return formik.values.permissions.filter(
      (permission) => !valuesToRemove.includes(permission),
    );
  };

  return (
    <FormWrapper
      formTitle="Edit User Permissions"
      subtTitle="Set User Permissions"
    >
      <FormContainer onSubmit={formik.handleSubmit}>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="Dashboard Management"
            label="Manage Dashboard"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([PermissionCodes.VIEW_DASHBOARD]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([PermissionCodes.VIEW_DASHBOARD]),
                  ],
                });
              }
            }}
          >
            {DASHBOARD_MANAGEMENT_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="Product Management"
            label="Manage Products"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([
                      PermissionCodes.VIEW_PRODUCTS,
                      PermissionCodes.ADD_PRODUCT,
                      PermissionCodes.EDIT_PRODUCT,
                      PermissionCodes.IMPORT_PRODUCTS,
                      PermissionCodes.EXPORT_PRODUCTS,
                      PermissionCodes.EXPORT_PRODUCT_UPLOAD_TEMPLATE,
                    ]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([
                      PermissionCodes.VIEW_PRODUCTS,
                      PermissionCodes.ADD_PRODUCT,
                      PermissionCodes.EDIT_PRODUCT,
                      PermissionCodes.IMPORT_PRODUCTS,
                      PermissionCodes.EXPORT_PRODUCTS,
                      PermissionCodes.EXPORT_PRODUCT_UPLOAD_TEMPLATE,
                    ]),
                  ],
                });
              }
            }}
          >
            {PRODUCT_MANAGEMENT_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="Order Management"
            label="Manage Orders"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([
                      PermissionCodes.VIEW_ORDERS,
                      PermissionCodes.VIEW_ORDER_DETAILS,
                      PermissionCodes.EDIT_IMEI_SERIAL,
                      PermissionCodes.RESEND_LABEL,
                      PermissionCodes.MARK_AS_RECEIVED,
                      PermissionCodes.UPDATE_ORDER_ITEM_STATUS,
                      PermissionCodes.CANCEL_ITEM,
                      PermissionCodes.CANCEL_GIFT_CARDS,
                      PermissionCodes.ADD_ORDER_CLAIMS,
                      PermissionCodes.VIEW_DISCREPANCIES,
                      PermissionCodes.VIEW_ACTIONABLES,
                      PermissionCodes.PRINT_LABEL,
                      PermissionCodes.VIEW_PAYMENTS,
                      PermissionCodes.VIEW_ORDER_LOGS,
                      PermissionCodes.VIEW_ORDER_NOTES,
                      PermissionCodes.ADD_ORDER_NOTE,
                      PermissionCodes.ADD_ZENDESK_LINK,
                    ]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([
                      PermissionCodes.VIEW_ORDERS,
                      PermissionCodes.VIEW_ORDER_DETAILS,
                      PermissionCodes.EDIT_IMEI_SERIAL,
                      PermissionCodes.RESEND_LABEL,
                      PermissionCodes.MARK_AS_RECEIVED,
                      PermissionCodes.UPDATE_ORDER_ITEM_STATUS,
                      PermissionCodes.CANCEL_ITEM,
                      PermissionCodes.CANCEL_GIFT_CARDS,
                      PermissionCodes.ADD_ORDER_CLAIMS,
                      PermissionCodes.VIEW_DISCREPANCIES,
                      PermissionCodes.VIEW_ACTIONABLES,
                      PermissionCodes.PRINT_LABEL,
                      PermissionCodes.VIEW_PAYMENTS,
                      PermissionCodes.VIEW_ORDER_LOGS,
                      PermissionCodes.VIEW_ORDER_NOTES,
                      PermissionCodes.ADD_ORDER_NOTE,
                      PermissionCodes.ADD_ZENDESK_LINK,
                    ]),
                  ],
                });
              }
            }}
          >
            {ORDER_MANAGEMENT_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="Actionables Management"
            label="Manage Actionables"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_DEVICE_NOT_SENT,
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER,
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_REVISION_OFFER,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_WITH_BOX,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_FOR_RECYCLE,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_FOR_RETURN,
                      PermissionCodes.VIEW_ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK,
                      PermissionCodes.VIEW_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST,
                      PermissionCodes.VIEW_ACTIONABLES_PAYMENT_ACTION_NEEDED,
                    ]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_DEVICE_NOT_SENT,
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER,
                      PermissionCodes.VIEW_ACTIONABLES_FOLLOW_UP_REVISION_OFFER,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_WITH_BOX,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_FOR_RECYCLE,
                      PermissionCodes.VIEW_ACTIONABLES_DEVICES_FOR_RETURN,
                      PermissionCodes.VIEW_ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK,
                      PermissionCodes.VIEW_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST,
                      PermissionCodes.VIEW_ACTIONABLES_PAYMENT_ACTION_NEEDED,
                    ]),
                  ],
                });
              }
            }}
          >
            {ACTIONABLES_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="User Management"
            label="Manage Users"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([
                      PermissionCodes.VIEW_USERS,
                      PermissionCodes.ADD_USER,
                      PermissionCodes.EDIT_USER_DETAILS,
                      PermissionCodes.EDIT_USER_PERMISSIONS,
                    ]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([
                      PermissionCodes.VIEW_USERS,
                      PermissionCodes.ADD_USER,
                      PermissionCodes.EDIT_USER_DETAILS,
                      PermissionCodes.EDIT_USER_PERMISSIONS,
                    ]),
                  ],
                });
              }
            }}
          >
            {USER_MANAGEMENT_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup flexDirection="column" marginBottom="10px" withBottomHr>
          <ParentCheckbox
            sectionLabel="Promotion Management"
            label="Manage Promotions"
            onChange={(checked: boolean) => {
              if (checked) {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...addPermissions([
                      PermissionCodes.VIEW_PROMOTIONS,
                      PermissionCodes.ADD_PROMOTION,
                      PermissionCodes.EDIT_PROMOTION,
                      PermissionCodes.VIEW_PROMOTION_CLAIMS,
                      PermissionCodes.UPDATE_PROMOTION_CLAIM,
                      PermissionCodes.PROCESS_PROMOTION_CLAIM_PAYMENT,
                    ]),
                  ],
                });
              } else {
                formik.setValues({
                  ...formik.values,
                  permissions: [
                    ...removePermissions([
                      PermissionCodes.VIEW_PROMOTIONS,
                      PermissionCodes.ADD_PROMOTION,
                      PermissionCodes.EDIT_PROMOTION,
                      PermissionCodes.VIEW_PROMOTION_CLAIMS,
                      PermissionCodes.UPDATE_PROMOTION_CLAIM,
                      PermissionCodes.PROCESS_PROMOTION_CLAIM_PAYMENT,
                    ]),
                  ],
                });
              }
            }}
          >
            {PROMOTION_MANAGEMENT_ITEMS.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    label={item.label}
                    checked={formik.values.permissions?.includes(item.value)}
                    onChange={(checked: boolean) =>
                      handleCheckboxChange(item.value, checked)
                    }
                  />
                );
              },
            )}
          </ParentCheckbox>
        </FormGroup>
        <FormGroup>
          <AppButton
            type="button"
            variant="outlined"
            width="fit-content"
            onClick={() => {
              setSideModalState({
                ...sideModalState,
                view: MODAL_TYPES.EDIT_USER,
                open: true,
              });
            }}
          >
            Back
          </AppButton>
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
                compareObjects(formik.values, currentUserData)
              }
            >
              Save Changes
            </AppButton>
          </FormGroup>
        </FormGroup>
      </FormContainer>
    </FormWrapper>
  );
}
