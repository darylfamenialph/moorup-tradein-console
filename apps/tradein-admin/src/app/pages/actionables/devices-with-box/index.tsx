/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_DEVICES_WITH_BOX_TABS,
  ACTIONABLES_MANAGEMENT_COLUMNS,
  ACTIONS_COLUMN,
  Column,
  CustomizeColumns,
  Divider,
  Dropdown,
  ExcludeFilter,
  IconButton,
  MODAL_TYPES,
  OrderItemStatus,
  PageSubHeader,
  ProductTypes,
  ShippingStatuses,
  SideModal,
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

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_WITH_BOX
    ];
  const defaultColumns = [
    ...ACTIONABLES_MANAGEMENT_COLUMNS,
    ...(hasPrintLabelPermission ? ACTIONS_COLUMN : []),
  ];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  const pageTabs: any = [...ACTIONABLES_DEVICES_WITH_BOX_TABS];

  const initialFilters = {
    status: [OrderItemStatus.CREATED, OrderItemStatus.FOR_RETURN]?.join(','),
    shipping_status: ShippingStatuses.TODO,
    product_type: [ProductTypes.TABLETS, ProductTypes.LAPTOPS]?.join(','),
    exclude: [ExcludeFilter.EMPTY_SHIPMENT]?.join(','),
  };

  const [filters, setFilters] = useState(initialFilters);

  const addPrintLabelAction = (orderItems: any) => {
    return orderItems.map((orderItem: any) => ({
      ...orderItem,
      printLabelAction: () =>
        printLabels(
          {
            item_id: orderItem?.order_items?._id,
            admin_id: userDetails?._id,
          },
          true,
          filters,
        ),
      returnDeviceAction: () => {
        // TODO - Replace with confirmation modal
        toast.info('Make sure to Download or Save a copy on your device.', {
          onClose: async () => {
            updateOrderItemsStatus(
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
          },
        });
      },
    }));
  };

  const formattedOrderItems = addPrintLabelAction(orderItems || []);

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
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_WITH_BOX:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_WITH_BOX
            }
            defaultColumns={headers}
            onSave={(newColumns: Column[]) => {
              setHeaders(newColumns);
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

  const handleSelectTab = (value: any) => {
    switch (value) {
      case 'to-print':
        setFilters({
          ...filters,
          shipping_status: ShippingStatuses.TODO,
        });

        getOrderItems({
          ...filters,
          shipping_status: ShippingStatuses.TODO,
        });
        break;

      case 'prior-print':
        setFilters({
          ...filters,
          shipping_status: ShippingStatuses.DONE,
        });

        getOrderItems({
          ...filters,
          shipping_status: ShippingStatuses.DONE,
        });
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  return (
    <>
      <PageSubHeader
        withSearch
        tabs={
          <>
            <Dropdown
              menuItems={pageTabs}
              defaultLabel={'To Print'}
              onSelect={handleSelectTab}
              loading={isFetchingOrderItems}
            />
            <Divider />
          </>
        }
        rightControls={
          <>
            <IconButton
              tooltipLabel="Customize Columns"
              icon={faSliders}
              onClick={() => {
                setSideModalState({
                  ...sideModalState,
                  open: true,
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_DEVICES_WITH_BOX,
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
