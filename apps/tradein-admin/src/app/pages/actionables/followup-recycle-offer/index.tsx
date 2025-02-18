/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONABLES_FOLLOW_UP_DEVICES_TABS,
  CenterModal,
  Column,
  CustomizeColumns,
  Divider,
  Dropdown,
  IconButton,
  Loader,
  MODAL_TYPES,
  openInNewTab,
  OrderItemStatus,
  Pages,
  PageSubHeader,
  REVISED_DEVICES_MANAGEMENT_COLUMNS,
  revisedDevicesManagementParsingConfig,
  SideModal,
  Table,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FollowUpRecycleOfferModal } from './modal-content';

export function FollowUpRecycleOfferPage() {
  const { state, fetchOrders, clearOrder, clearOrders, setActiveOrder } =
    useOrder();
  const { orders, order, isFetchingOrders } = state;
  const { state: authState } = useAuth();
  const { activePlatform } = authState;
  const { state: commonState, setSideModalState, setSearchTerm } = useCommon();
  const { sideModalState } = commonState;
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<any>('');

  const customizedColumns = JSON.parse(localStorage.getItem('CC') || '{}');
  const savedColumns =
    customizedColumns[
      MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER
    ];
  const defaultColumns = [...REVISED_DEVICES_MANAGEMENT_COLUMNS];

  const [headers, setHeaders] = useState<Column[]>(
    savedColumns ?? defaultColumns,
  );

  const pageTabs: any = [...ACTIONABLES_FOLLOW_UP_DEVICES_TABS];

  const filters = {
    page: Pages.RECYCLE_OFFER,
  };

  const getOrdersForFollowup = (signal?: any) => {
    fetchOrders(filters, signal);
  };

  const handleRowClick = (row: any) => {
    setIsModalOpen(true);
    setActiveOrder(row);
    setSelectedRow(row);
  };

  const hasUnsentOrderItems = (orderItems: any[]) => {
    return orderItems?.some(
      (item: any) => item?.status === OrderItemStatus.REVISED,
    );
  };

  useEffect(() => {
    if (order && hasUnsentOrderItems(order?.order_items)) {
      setSelectedRow(order);
    } else {
      if (!isEmpty(selectedRow)) {
        getOrdersForFollowup();
        setSelectedRow({});
      } else {
        setIsModalOpen(false);
      }
    }
  }, [order]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!isEmpty(activePlatform)) {
      getOrdersForFollowup(signal);
    }

    return () => {
      controller.abort();

      // Clear data on unmount
      clearOrder();
      clearOrders();
      setSearchTerm('');
    };
  }, [activePlatform]);

  const filteredOrders = useMemo(() => {
    const daysMapping: Record<string, number[]> = {
      2: [0, 2],
      4: [3, 4],
      6: [5, 6],
      7: [7, Infinity],
    };

    return orders.filter((order: any) => {
      const unsentItems = hasUnsentOrderItems(order?.order_items);

      if (!dateFilter) {
        return unsentItems;
      }

      const [minDays, maxDays] = daysMapping[dateFilter] || [0, Infinity];

      const createdAtDate = new Date(order?.createdAt);
      const currentDate = new Date();

      const diffInDays = Math.floor(
        (currentDate.getTime() - createdAtDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const isInDateRange = diffInDays >= minDays && diffInDays <= maxDays;

      return unsentItems && isInDateRange;
    });
  }, [orders, dateFilter]);

  const closeModal = () => {
    setSideModalState({
      ...sideModalState,
      open: false,
      view: null,
    });
  };

  const renderSideModalContent = () => {
    switch (sideModalState.view) {
      case MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER:
        return (
          <CustomizeColumns
            storageKey={
              MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER
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
    setDateFilter(value);
  };

  return (
    <>
      <PageSubHeader
        withSearch
        tabs={
          <>
            <Dropdown
              menuItems={pageTabs}
              defaultLabel={'No Filter'}
              onSelect={handleSelectTab}
              loading={isFetchingOrders}
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
                  view: MODAL_TYPES.CUSTOMIZE_COLUMNS_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER,
                });
              }}
            />
            <Divider />
          </>
        }
      />
      <Table
        label="Follow-Up Recycle Offer"
        isLoading={isFetchingOrders}
        headers={headers}
        rows={filteredOrders || []}
        parsingConfig={revisedDevicesManagementParsingConfig}
        onRowClick={handleRowClick}
      />
      <CenterModal
        title={
          <h4
            className="text-lg cursor-pointer hover:text-emerald-800"
            onClick={() => openInNewTab(`/dashboard/order/${selectedRow?._id}`)}
          >
            {selectedRow?.order_number || 'Loading...'}
          </h4>
        }
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow({});
        }}
      >
        <div className="pb-5">
          {isModalOpen && isEmpty(selectedRow) ? (
            <div className="py-8">
              <Loader />
            </div>
          ) : (
            <FollowUpRecycleOfferModal order={selectedRow} />
          )}
        </div>
      </CenterModal>
      <SideModal isOpen={sideModalState?.open} onClose={closeModal}>
        {renderSideModalContent()}
      </SideModal>
    </>
  );
}
