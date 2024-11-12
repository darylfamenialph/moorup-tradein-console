/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppButton,
  ConfirmationModalTypes,
  formatDate,
  FormGroup,
  GenericModal,
  OrderItemStatus,
  StyledDatePicker,
  Table,
  UNSENT_DEVICES_TABLE_COLUMNS,
  unsentDevicesTableParsingConfig,
  useAuth,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useMemo, useState } from 'react';

type Props = {
  order: any;
};

export function FollowUpUnsentDeviceModal({ order }: Props) {
  const {
    state,
    extendSendinDeadline,
    logCustomerNonContact,
    patchOrderItemById,
    bulkCancelOrderItems,
  } = useOrder();
  const { state: authState } = useAuth();
  const { userDetails } = authState;
  const [modalData, setModalData] = useState<any>({});
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [newDeadline, setNewDeadline] = useState<any>();
  const {
    isUpdatingSendinDeadline,
    isUpdatingContactLogs,
    isUpdatingOrderItem,
  } = state;

  const headers = UNSENT_DEVICES_TABLE_COLUMNS;

  const onCloseModal = () => {
    setModalData({
      open: false,
      view: null,
      data: {},
      title: '',
      subtitle: '',
    });
    setNewDeadline(null);
  };

  const handleDateChange = (fieldName: string, date: Date | null) => {
    setNewDeadline(
      moment(date)
        .utc()
        .set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .toDate(),
    );
  };

  const addRowActions = (orderData: any) => {
    const filteredOrderItems =
      orderData.order_items?.filter(
        (item: any) => item?.status === OrderItemStatus.CREATED,
      ) || [];
    return filteredOrderItems.map((orderItem: any) => ({
      ...orderItem,
      extendDeadlineAction: () => {
        setSelectedRow(orderItem);
        setModalData({
          open: true,
          view: ConfirmationModalTypes.EXTEND_SENDIN_DEADLINE,
          title: 'Extend Device',
          subtitle: `Do you wish to extend ${orderItem?.line_item_number}?`,
        });
      },
      cancelOrderItemAction: () => {
        setSelectedRow(orderItem);
        setModalData({
          open: true,
          view: ConfirmationModalTypes.CANCEL_ORDER_ITEM,
          title: 'Cancel Device',
          subtitle: `Do you wish to cancel ${orderItem.line_item_number}?`,
        });
      },
    }));
  };

  const filteredOrderItems = useMemo(() => {
    return addRowActions(order);
  }, [order]);

  const handleExtendSendinDeadline = () => {
    if (
      modalData.view === ConfirmationModalTypes.EXTEND_SENDIN_DEADLINE &&
      !isEmpty(selectedRow)
    ) {
      const payload = [
        {
          sendInDeadlineDate: moment(newDeadline).format('YYYY-MM-DD'),
          orderItemId: selectedRow._id,
        },
      ];
      extendSendinDeadline(order?._id, payload);
    } else if (
      modalData.view === ConfirmationModalTypes.EXTEND_ALL_SENDIN_DEADLINE
    ) {
      const payload = filteredOrderItems.map((orderItem: any) => {
        return {
          sendInDeadlineDate: moment(newDeadline).format('YYYY-MM-DD'),
          orderItemId: orderItem._id,
        };
      });
      extendSendinDeadline(order?._id, payload);
    }
  };

  const generateBulkCancelPayload = (orderItems: any[], remarks: any) => {
    const payload: any[] = [];

    orderItems?.forEach((orderItem: any) => {
      payload.push({
        remarks: remarks,
        orderItemId: orderItem?._id,
      });
    });

    return payload;
  };

  const handleCancelDevice = () => {
    if (
      modalData.view === ConfirmationModalTypes.CANCEL_ORDER_ITEM &&
      !isEmpty(selectedRow)
    ) {
      patchOrderItemById(selectedRow?._id, {
        status: OrderItemStatus.CANCELLED,
        admin_id: userDetails?._id,
      });
    } else if (
      modalData.view === ConfirmationModalTypes.CANCEL_ORDER_NON_CONTACTABLE
    ) {
      const payload = generateBulkCancelPayload(
        order?.order_items,
        'Customer Not Contactable',
      );
      bulkCancelOrderItems(payload);
    } else {
      const payload = generateBulkCancelPayload(
        order?.order_items,
        'Cancel all devices',
      );
      bulkCancelOrderItems(payload);
    }
  };

  const renderModalContentAndActions = () => {
    switch (modalData?.view) {
      case ConfirmationModalTypes.EXTEND_ALL_SENDIN_DEADLINE:
      case ConfirmationModalTypes.EXTEND_SENDIN_DEADLINE:
        return (
          <div className="w-full">
            <FormGroup>
              <StyledDatePicker
                dateInput={{
                  onChange: handleDateChange,
                  placeholder: 'Set Date',
                  value: newDeadline,
                  name: 'send_in_deadline',
                  onBlur: () => {},
                  error: !newDeadline,
                  errorMessage: 'This is required',
                }}
                label="Set Device Send In Deadline Date"
                onChange={() => {}}
                minDate={new Date()}
              />
            </FormGroup>
            <FormGroup>
              <AppButton
                variant="outlined"
                width="100%"
                disabled={isUpdatingSendinDeadline}
                onClick={() => onCloseModal()}
              >
                Cancel
              </AppButton>
              <AppButton
                width="100%"
                disabled={!newDeadline || isUpdatingSendinDeadline}
                onClick={() => {
                  handleExtendSendinDeadline();
                  onCloseModal();
                }}
              >
                Confirm
              </AppButton>
            </FormGroup>
          </div>
        );
      case ConfirmationModalTypes.CANCEL_ALL_ORDER_ITEMS:
      case ConfirmationModalTypes.CANCEL_ORDER_ITEM:
      case ConfirmationModalTypes.CANCEL_ORDER_NON_CONTACTABLE:
        return (
          <div className="w-full">
            <FormGroup>
              <AppButton
                variant="outlined"
                width="100%"
                disabled={isUpdatingOrderItem}
                onClick={() => onCloseModal()}
              >
                Cancel
              </AppButton>
              <AppButton
                width="100%"
                disabled={isUpdatingOrderItem}
                onClick={() => {
                  handleCancelDevice();
                  onCloseModal();
                }}
              >
                Confirm
              </AppButton>
            </FormGroup>
          </div>
        );
    }
  };

  const DetailLine = ({ label, value }: { label: any; value: any }) => {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs">{label}</p>
        <p className="text-md font-semibold">{value || '--'}</p>
      </div>
    );
  };

  const isPreviouslyExtended = order?.order_items?.some(
    (item: any) => item?.send_in_deadline_date,
  );

  return (
    <div className="flex flex-col">
      <div className="px-5 flex flex-col gap-4 pb-4">
        <hr />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailLine
            label="Customer Name"
            value={`${order?.user_id?.first_name} ${order?.user_id?.last_name}`}
          />
          <DetailLine
            label="Customer Contact No."
            value={order?.user_id?.mobile_number}
          />
          <DetailLine label="Order Date" value={formatDate(order?.createdAt)} />
          <DetailLine
            label="Previously Extended"
            value={isPreviouslyExtended ? 'Yes' : 'No'}
          />
        </div>
        <hr />
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <DetailLine
            label="Contact Attempts"
            value={order?.contactAttempts?.length || '0'}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <AppButton
              type="button"
              variant="fill"
              width="fit-content"
              onClick={() =>
                logCustomerNonContact(order?._id, {
                  user_id: userDetails?._id,
                })
              }
              disabled={isUpdatingContactLogs}
            >
              No Customer Contact
            </AppButton>
            {order?.contactAttempts?.length >= 2 && (
              <AppButton
                type="button"
                variant="error"
                width="fit-content"
                onClick={() =>
                  setModalData({
                    open: true,
                    view: ConfirmationModalTypes.CANCEL_ORDER_NON_CONTACTABLE,
                    title: 'Cancel All - Customer Not Contactable',
                    subtitle: 'Do you wish to Cancel All devices?',
                  })
                }
              >
                Cancel - Not Contactable
              </AppButton>
            )}
          </div>
        </div>
      </div>
      <Table
        label="Devices Awaiting"
        isLoading={!order}
        headers={headers}
        rows={filteredOrderItems || []}
        parsingConfig={unsentDevicesTableParsingConfig}
      />
      <div className="px-5 pt-4 flex flex justify-end gap-2">
        <AppButton
          type="button"
          variant="fill"
          width="fit-content"
          onClick={() =>
            setModalData({
              open: true,
              view: ConfirmationModalTypes.EXTEND_ALL_SENDIN_DEADLINE,
              title: 'Extend All',
              subtitle: 'Do you wish to Extend All devices?',
            })
          }
        >
          Extend All
        </AppButton>
        <AppButton
          type="button"
          variant="outlined"
          width="fit-content"
          onClick={() =>
            setModalData({
              open: true,
              view: ConfirmationModalTypes.CANCEL_ALL_ORDER_ITEMS,
              title: 'Cancel All',
              subtitle: 'Do you wish to Cancel All devices?',
            })
          }
        >
          Cancel All
        </AppButton>
      </div>
      <GenericModal
        title={modalData?.title}
        subtitle={modalData?.subtitle}
        content={renderModalContentAndActions()}
        isOpen={modalData?.open}
        onClose={() => onCloseModal()}
      />
    </div>
  );
}
