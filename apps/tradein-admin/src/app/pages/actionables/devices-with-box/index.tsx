/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_MANAGEMENT_COLUMNS,
  ACTIONS_COLUMN,
  AppButton,
  Divider,
  FormGroup,
  FormWrapper,
  IconButton,
  MODAL_TYPES,
  OrderItemStatus,
  PageSubHeader,
  ProductTypes,
  SHIPPING_STATUSES,
  ShippingStatuses,
  SideModal,
  StyledReactSelect,
  // ProductTypes,
  Table,
  actionablesManagementParsingConfig,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function DevicesWithBoxPage() {
  const { hasPrintLabelPermission } = usePermission();
  const {
    state,
    getOrderItems,
    clearOrderItems,
    printLabels,
    printOutboundLabel,
    updateOrderItemsStatus,
  } = useOrder();
  const { state: authState } = useAuth();
  const { orderItems, isFetchingOrderItems } = state;
  const { activePlatform, userDetails } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;

  const [selectedShippingStatus, setSelectedShippingStatus] = useState<
    string[]
  >([ShippingStatuses.TODO]);

  const headers = [
    ...ACTIONABLES_MANAGEMENT_COLUMNS,
    ...(hasPrintLabelPermission ? ACTIONS_COLUMN : []),
  ];

  const isAllStatusSelected = SHIPPING_STATUSES.map(
    (item: any) => item.value,
  ).every((status: string) => selectedShippingStatus.includes(status));

  const filters = {
    status: [OrderItemStatus.CREATED, OrderItemStatus.FOR_RETURN]?.join(','),
    ...(selectedShippingStatus?.length
      ? {
          shipping_status: isAllStatusSelected
            ? []
            : selectedShippingStatus.join(','),
        }
      : {}),
  };

  const addPrintLabelAction = (orderItems: any) => {
    return orderItems
      .filter(
        (orderItem: any) =>
          orderItem?.order_items?.product_type === ProductTypes.TABLETS ||
          orderItem?.order_items?.product_type === ProductTypes.LAPTOPS,
      )
      .map((orderItem: any) => ({
        ...orderItem,
        action: () =>
          printLabels({
            item_id: orderItem?.order_items?._id,
            admin_id: userDetails?._id,
          }),
        printLabelAction: () =>
          printLabels({
            item_id: orderItem?.order_items?._id,
            admin_id: userDetails?._id,
          }),
        returnDeviceAction: () => {
          toast.info('Make sure to Download or Save a copy on your device.', {
            onClose: async () => {
              await updateOrderItemsStatus(
                orderItem?.order_items?._id,
                {
                  status: OrderItemStatus.CANCELLED,
                  admin_id: userDetails?._id,
                },
                filters,
              );
              printOutboundLabel({
                item_id: orderItem?.order_items?._id,
                admin_id: userDetails?._id,
              });
              clearOrderItems({});

              const controller = new AbortController();
              const signal = controller.signal;
              getOrderItems(filters, signal);
            },
          });
        },
      }));
  };

  const formattedOrderItems = addPrintLabelAction(orderItems || []);

  const cancelFilters = () => {
    setSelectedShippingStatus([]);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getOrderItems(filters, signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrderItems({});
      setSearchTerm('');
    };
  }, [activePlatform]);

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.FILTER_DEVICES_WITH_BOX:
        return (
          <FormWrapper formTitle="Filter By">
            <FormGroup marginBottom="20px">
              <StyledReactSelect
                label="Shipping Status"
                name="type"
                isMulti={true}
                options={SHIPPING_STATUSES}
                placeholder="Select shipping status"
                value={selectedShippingStatus}
                onChange={(selected) => {
                  const shippingStatusValues = selected?.map(
                    (option: any) => option.value,
                  );

                  setSelectedShippingStatus(shippingStatusValues);
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
                    getOrderItems(filters);

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
                  view: MODAL_TYPES.FILTER_DEVICES_WITH_BOX,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Devices With Box"
        isLoading={isFetchingOrderItems}
        headers={headers}
        rows={formattedOrderItems || []}
        parsingConfig={actionablesManagementParsingConfig}
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
