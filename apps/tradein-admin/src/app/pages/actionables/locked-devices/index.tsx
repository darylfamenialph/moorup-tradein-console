/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faFilter, faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK_COLUMNS,
  ACTIONABLES_LOCKED_DEVICES_FOR_RETEST_COLUMNS,
  ACTIONS_COLUMN,
  AppButton,
  Column,
  CustomizeColumns,
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
  TabList,
  Table,
  actionablesLockedDevicesCurrentLockParsingConfig,
  actionablesLockedDevicesForRetestParsingConfig,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export function LockedDevicesPage() {
  const {
    state: orderState,
    getLockedDevices,
    clearLockedDevices,
    setLockedDeviceLockStatus,
    setLockedDeviceStatus,
  } = useOrder();
  const {
    lockedDevices,
    isFetchingLockedDevices,
    isUpdatingLockedDeviceLockStatus,
    isUpdatingLockedDeviceStatus,
    isUpdatingDeviceLockStatus,
  } = orderState;
  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const [activeTab, setActiveTab] = useState<string>('');

  const {
    hasViewActionablesLockedDevicesCurrentLockPermission,
    hasViewActionablesLockedDevicesForRetestPermission,
  } = usePermission();

  const [selectedLockType, setSelectedLockType] = useState<string[]>([]);

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');

  const forFollowUpSavedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_FOLLOW_UP
    ];
  const forRetestSavedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST
    ];

  const defaultForFollowUpColumns = [
    ...ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const defaultForRetestColumns = [
    ...ACTIONABLES_LOCKED_DEVICES_FOR_RETEST_COLUMNS,
    ...ACTIONS_COLUMN,
  ];

  const [forFollowUpHeaders, setForFollowUpHeaders] = useState<Column[]>(
    forFollowUpSavedColumns ?? defaultForFollowUpColumns,
  );
  const [forRetestHeaders, setForRetestHeaders] = useState<Column[]>(
    forRetestSavedColumns ?? defaultForRetestColumns,
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      let filters;

      if (activeTab === 'For Follow-Up') {
        filters = {
          status: [OrderItemStatus.RECEIVED].join(','),
          lock_status: [LockStatus.LOCKED].join(','),
        };
      } else if (activeTab === 'For Retest') {
        filters = {
          status: [OrderItemStatus.RECEIVED].join(','),
          lock_status: [LockStatus.RETEST].join(','),
        };
      }

      if (filters) {
        getLockedDevices(filters, signal);
      }
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      setSearchTerm('');
      clearLockedDevices([]);
    };
  }, [activePlatform, activeTab]);

  useEffect(() => {
    if (hasViewActionablesLockedDevicesCurrentLockPermission) {
      setActiveTab('For Follow-Up');
    } else if (hasViewActionablesLockedDevicesForRetestPermission) {
      setActiveTab('For Retest');
    }
  }, []);

  const cancelFilters = () => {
    setSelectedLockType([]);
  };

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.FILTER_LOCKED_DEVICES_CURRENT_LOCK:
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
                      lock_status: [LockStatus.LOCKED]?.join(','),
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

      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_FOLLOW_UP:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_FOLLOW_UP
            }
            defaultColumns={forFollowUpHeaders}
            onSave={(newColumns: Column[]) => {
              setForFollowUpHeaders(newColumns);
              setSideModalState({
                ...sideModalState,
                open: false,
                view: null,
              });
            }}
          />
        );

      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST
            }
            defaultColumns={forRetestHeaders}
            onSave={(newColumns: Column[]) => {
              setForRetestHeaders(newColumns);
              setSideModalState({
                ...sideModalState,
                open: false,
                view: null,
              });
            }}
          />
        );

      default:
        return;
    }
  };

  const handleTabChange = (activeTab: string) => {
    setActiveTab(activeTab);
  };

  const renderTabs = () => {
    const tabs: string[] = [];
    const tabContent: React.ReactNode[] = [];

    if (hasViewActionablesLockedDevicesCurrentLockPermission) {
      tabs.push('For Follow-Up');
      tabContent.push(
        <Table
          label="Locked Devices"
          isLoading={
            isFetchingLockedDevices ||
            isUpdatingLockedDeviceLockStatus ||
            isUpdatingLockedDeviceStatus
          }
          headers={forFollowUpHeaders}
          rows={lockedDevices || []}
          parsingConfig={actionablesLockedDevicesCurrentLockParsingConfig}
          menuItems={[
            {
              label: 'For Retest',
              action: (value: any) => {
                const filter = {
                  status: [OrderItemStatus.RECEIVED]?.join(','),
                  lock_status: [LockStatus.LOCKED]?.join(','),
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
                    lock_status: LockStatus.RETEST,
                  },
                  filter,
                );
              },
            },
            {
              label: 'Set Unlocked',
              action: (value: any) => {
                const filter = {
                  status: [OrderItemStatus.RECEIVED]?.join(','),
                  lock_status: [LockStatus.LOCKED]?.join(','),
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
                  lock_status: [LockStatus.LOCKED]?.join(','),
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
                  lock_status: [LockStatus.LOCKED]?.join(','),
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
        />,
      );
    }

    if (hasViewActionablesLockedDevicesForRetestPermission) {
      tabs.push('For Retest');
      tabContent.push(
        <Table
          label="Locked Devices"
          isLoading={
            isFetchingLockedDevices ||
            isUpdatingDeviceLockStatus ||
            isUpdatingLockedDeviceStatus
          }
          headers={forRetestHeaders}
          rows={lockedDevices || []}
          parsingConfig={actionablesLockedDevicesForRetestParsingConfig}
          menuItems={[
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
              label: 'Still Locked',
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
                    lock_status: LockStatus.LOCKED,
                    lock_type: value.order_item.lock.type,
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
        />,
      );
    }

    return (
      <TabList tabs={tabs} onTabChange={handleTabChange}>
        {tabContent}
      </TabList>
    );
  };

  return (
    <>
      <PageSubHeader
        withSearch
        rightControls={
          <>
            <IconButton
              tooltipLabel="Customize Columns"
              icon={faSliders}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view:
                    activeTab === 'For Follow-Up'
                      ? MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_FOLLOW_UP
                      : MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST,
                });
              }}
            />
            <IconButton
              tooltipLabel="Filter"
              icon={faFilter}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.FILTER_LOCKED_DEVICES_CURRENT_LOCK,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      {renderTabs()}
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
