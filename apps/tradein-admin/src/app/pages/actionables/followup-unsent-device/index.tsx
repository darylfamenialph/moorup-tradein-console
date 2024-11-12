/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CenterModal,
  Loader,
  openInNewTab,
  OrderItemStatus,
  Pages,
  PageSubHeader,
  Table,
  UNSENT_DEVICES_MANAGEMENT_COLUMNS,
  unsentDevicesManagementParsingConfig,
  useAuth,
  useCommon,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FollowUpUnsentDeviceModal } from './modal-content';

export function FollowUpUnsentDevicePage() {
  const { state, fetchOrders, clearOrder, clearOrders, setActiveOrder } =
    useOrder();
  const { orders, order, isFetchingOrders } = state;
  const { state: authState } = useAuth();
  const { activePlatform } = authState;
  const { setSearchTerm } = useCommon();
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const headers = UNSENT_DEVICES_MANAGEMENT_COLUMNS;

  const filters = {
    page: Pages.DEVICE_NOT_SENT,
  };

  const handleRowClick = (row: any) => {
    setIsModalOpen(true);
    setActiveOrder(row);
    setSelectedRow(row);
  };

  const hasUnsentOrderItems = (orderItems: any[]) => {
    return orderItems?.some(
      (item: any) => item?.status === OrderItemStatus.CREATED,
    );
  };

  useEffect(() => {
    if (order && hasUnsentOrderItems(order?.order_items)) {
      setSelectedRow(order);
    } else {
      if (!isEmpty(selectedRow)) {
        const controller = new AbortController();
        const signal = controller.signal;

        fetchOrders(filters, signal);
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
      fetchOrders(filters, signal);
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
    return orders.filter((order: any) =>
      hasUnsentOrderItems(order?.order_items),
    );
  }, [orders]);

  return (
    <>
      <PageSubHeader withSearch />
      <Table
        label="Follow-Up Device Not Sent"
        isLoading={isFetchingOrders}
        headers={headers}
        rows={filteredOrders || []}
        parsingConfig={unsentDevicesManagementParsingConfig}
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
            <FollowUpUnsentDeviceModal order={selectedRow} />
          )}
        </div>
      </CenterModal>
    </>
  );
}
