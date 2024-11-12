/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_LOCKED_DEVICES_FOR_RETEST_COLUMNS,
  ACTIONS_COLUMN,
  AppButton,
  Divider,
  FormGroup,
  FormWrapper,
  IconButton,
  LOCK_TYPES,
  LockStatus,
  MODAL_TYPES,
  OrderItemStatus,
  PageSubHeader,
  SideModal,
  StyledReactSelect,
  Table,
  actionablesLockedDevicesForRetestParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function LockedDevicesForRetestPage() {
  const {
    state: orderState,
    getLockedDevices,
    clearLockedDevices,
    setLockedDeviceLockStatus,
    setLockedDeviceStatus,
    updateOrderItemLockType,
  } = useOrder();
  const {
    lockedDevices,
    isFetchingLockedDevices,
    isUpdatingDeviceLockStatus,
    isUpdatingLockedDeviceStatus,
    isUpdatingOrderItemLockType,
  } = orderState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const headers = [
    ...ACTIONABLES_LOCKED_DEVICES_FOR_RETEST_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const [selectedLockType, setSelectedLockType] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform) && !isUpdatingOrderItemLockType) {
      const filters = {
        status: [OrderItemStatus.RECEIVED]?.join(','),
        lock_status: [LockStatus.RETEST]?.join(','),
      };

      getLockedDevices(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      setSearchTerm('');
      clearLockedDevices([]);
    };
  }, [activePlatform, isUpdatingOrderItemLockType]);

  const cancelFilters = () => {
    setSelectedLockType([]);
  };

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.FILTER_LOCKED_DEVICES_FOR_RETEST:
        return (
          <FormWrapper formTitle="Filter By">
            <FormGroup marginBottom="20px">
              <StyledReactSelect
                label="Lock Type"
                name="type"
                isMulti={true}
                options={LOCK_TYPES}
                placeholder="Select lock type"
                value={selectedLockType}
                onChange={(selected) => {
                  const lockTypeValues = selected?.map(
                    (option: any) => option.value,
                  );

                  setSelectedLockType(lockTypeValues);
                }}
              />
            </FormGroup>
            <FormGroup>
              <AppButton
                type="button"
                variant="outlined"
                width="fit-content"
                onClick={() => cancelFilters()}
              >
                Reset
              </AppButton>
              <FormGroup>
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  onClick={() => {
                    setSideModalState({
                      ...sideModalState,
                      open: false,
                      view: null,
                    });
                  }}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  width="fit-content"
                  onClick={() => {
                    const filter = {
                      status: [OrderItemStatus.RECEIVED]?.join(','),
                      lock_status: [LockStatus.RETEST]?.join(','),
                      ...(selectedLockType?.length
                        ? {
                            lock_type: selectedLockType.join(','),
                          }
                        : {}),
                    };

                    getLockedDevices(filter);

                    setSideModalState({
                      ...sideModalState,
                      open: false,
                      view: null,
                    });
                  }}
                >
                  Apply
                </AppButton>
              </FormGroup>
            </FormGroup>
          </FormWrapper>
        );

      default:
        return;
    }
  };

  return (
    <>
      <PageSubHeader
        withSearch
        rightControls={
          <>
            <IconButton
              tooltipLabel="Filter"
              icon={faFilter}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.FILTER_LOCKED_DEVICES_FOR_RETEST,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Locked Devices - For Retest"
        isLoading={
          isFetchingLockedDevices ||
          isUpdatingDeviceLockStatus ||
          isUpdatingLockedDeviceStatus
        }
        headers={headers}
        rows={lockedDevices || []}
        parsingConfig={actionablesLockedDevicesForRetestParsingConfig}
        menuItems={[
          {
            label: 'Remain Locked',
            action: (value: any) => {
              updateOrderItemLockType(value?.order_item?._id, value._id, {
                admin_id: userDetails?._id,
                lock_status: 'locked',
                lock_type: value?.order_item?.lock?.type,
              });
            },
          },
          {
            label: 'Set Unlocked',
            action: (value: any) => {
              const filter = {
                status: [OrderItemStatus.RECEIVED]?.join(','),
                lock_status: [LockStatus.RETEST]?.join(','),
                ...(selectedLockType?.length
                  ? {
                      lock_type: selectedLockType.join(','),
                    }
                  : {}),
              };

              setLockedDeviceLockStatus(
                value.order_item._id,
                {
                  admin_id: userDetails._id,
                  device_status: OrderItemStatus.RECEIVED,
                  lock_status: LockStatus.UNLOCKED,
                },
                filter,
              );
            },
          },
          {
            label: 'For Return',
            action: (value: any) => {
              const filter = {
                status: [OrderItemStatus.RECEIVED]?.join(','),
                lock_status: [LockStatus.RETEST]?.join(','),
                ...(selectedLockType?.length
                  ? {
                      lock_type: selectedLockType.join(','),
                    }
                  : {}),
              };

              setLockedDeviceStatus(
                value.order_item._id,
                {
                  admin_id: userDetails._id,
                  device_status: OrderItemStatus.FOR_RETURN,
                },
                filter,
              );
            },
          },
          {
            label: 'For Recycle',
            action: (value: any) => {
              const filter = {
                status: [OrderItemStatus.RECEIVED]?.join(','),
                lock_status: [LockStatus.RETEST]?.join(','),
                ...(selectedLockType?.length
                  ? {
                      lock_type: selectedLockType.join(','),
                    }
                  : {}),
              };

              setLockedDeviceStatus(
                value.order_item._id,
                {
                  admin_id: userDetails._id,
                  device_status: OrderItemStatus.FOR_RECYCLE,
                },
                filter,
              );
            },
          },
        ]}
      />
      <SideModal
        isOpen={sideModalState?.open}
        onClose={() => {
          setSideModalState({
            ...sideModalState,
            open: false,
            view: null,
          });
        }}
      >
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
