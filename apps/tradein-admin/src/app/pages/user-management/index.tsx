/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONS_COLUMN,
  AppButton,
  DEFAULT_COLUMN,
  MODAL_TYPES,
  PageSubHeader,
  SideModal,
  Table,
  USER_MANAGEMENT_COLUMNS,
  useAuth,
  useCommon,
  usePermission,
  useUser,
  userManagementParsingConfig,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { AddUserForm } from './add-user';
import { EditUserForm } from './edit-user';
import { EditUserPermissionForm } from './edit-user-permission';

export function UserManagementPage() {
  const {
    hasAddUserPermission,
    hasEditUserDetailsPermission,
    hasEditUserPermissionsPermission,
  } = usePermission();
  const { state, getUsers, clearUsers } = useUser();
  const { users, isFetchingUsers, isCreatingUser, isUpdatingUser } = state;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;

  const headers = [
    ...DEFAULT_COLUMN,
    ...USER_MANAGEMENT_COLUMNS,
    ...(hasEditUserDetailsPermission ? ACTIONS_COLUMN : []),
  ];

  const [selectedUser, setSelectedUser] = useState({});

  const addUserSteps = [MODAL_TYPES.ADD_USER];

  const editUserSteps = [
    MODAL_TYPES.EDIT_USER,
    ...(hasEditUserPermissionsPermission
      ? [MODAL_TYPES.EDIT_USER_PERMISSIONS]
      : []),
  ];

  const [steps, setSteps] = useState(addUserSteps);

  useEffect(() => {
    switch (true) {
      case addUserSteps.includes(sideModalState.view):
        setSteps(addUserSteps);
        break;

      case editUserSteps.includes(sideModalState.view):
        setSteps(editUserSteps);
        break;

      default:
        setSteps(addUserSteps);
        break;
    }
  }, [sideModalState]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getUsers(userDetails?._id, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearUsers({});
      setSearchTerm('');
      setSideModalState({
        ...sideModalState,
        open: false,
        view: null,
      });
    };
  }, [activePlatform]);

  const renderForm = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.ADD_USER:
        return <AddUserForm />;

      case MODAL_TYPES.EDIT_USER:
        return <EditUserForm data={selectedUser} />;

      case MODAL_TYPES.EDIT_USER_PERMISSIONS:
        return <EditUserPermissionForm data={selectedUser} />;

      default:
        break;
    }
  };

  return (
    <>
      <PageSubHeader
        withSearch
        leftControls={
          hasAddUserPermission && (
            <AppButton
              width="fit-content"
              icon={faPlus}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.ADD_USER,
                });
              }}
            >
              Add
            </AppButton>
          )
        }
      />
      <Table
        label="Users"
        isLoading={isFetchingUsers || isCreatingUser || isUpdatingUser}
        headers={headers}
        rows={users || []}
        parsingConfig={userManagementParsingConfig}
        menuItems={[
          {
            label: 'Edit',
            action: (value: any) => {
              setSelectedUser(value);
              setSideModalState({
                ...sideModalState,
                open: true,
                view: MODAL_TYPES.EDIT_USER,
              });
            },
          },
        ]}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
          setSideModalState({ ...sideModalState, open: false, view: null });
        }}
        withSteps
        steps={steps}
        activeStep={sideModalState.view}
      >
        {renderForm()}
      </SideModal>
    </>
  );
}
