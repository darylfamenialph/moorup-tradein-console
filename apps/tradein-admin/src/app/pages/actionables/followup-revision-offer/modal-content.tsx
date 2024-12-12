/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppButton,
  ConfirmationModalTypes,
  formatDate,
  FormGroup,
  GenericModal,
  OrderItemStatus,
  REVISED_DEVICES_TABLE_COLUMNS,
  revisedDevicesTableParsingConfig,
  Table,
  useAuth,
  useOrder,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';

type Props = {
  order: any;
};

export function FollowUpRevisionOfferModal({ order }: Props) {
  const { state, updateOrderFollowups, logCustomerNonContact } = useOrder();
  const { state: authState } = useAuth();
  const { userDetails } = authState;
  const [modalData, setModalData] = useState<any>({});
  const [selectedRow, setSelectedRow] = useState<any>({});
  const {
    isUpdatingSendinDeadline,
    isUpdatingContactLogs,
    isUpdatingOrderItem,
  } = state;

  const headers = REVISED_DEVICES_TABLE_COLUMNS;

  const onCloseModal = () => {
    setModalData({
      open: false,
      view: null,
      data: {},
      title: '',
      subtitle: '',
    });
  };

  const addRowActions = (orderData: any) => {
    const filteredOrderItems =
      orderData.order_items?.filter(
        (item: any) => item?.status === OrderItemStatus.REVISED,
      ) || [];
    return filteredOrderItems.map((orderItem: any) => ({
      ...orderItem,
      acceptRevisionAction: () => {
        setSelectedRow(orderItem);
        setModalData({
          open: true,
          view: ConfirmationModalTypes.ACCEPT_REVISION,
          title: 'Accept Revision',
          subtitle: `Do you wish to mark revision for ${orderItem?.line_item_number} as accepted?`,
        });
      },
      returnDeviceAction: () => {
        setSelectedRow(orderItem);
        setModalData({
          open: true,
          view: ConfirmationModalTypes.RETURN_ORDER_ITEM,
          title: 'Return Device',
          subtitle: `Do you wish to mark ${orderItem.line_item_number} for return?`,
        });
      },
    }));
  };

  const filteredOrderItems = useMemo(() => {
    return addRowActions(order);
  }, [order]);

  const handleAcceptRevision = () => {
    if (
      modalData.view === ConfirmationModalTypes.ACCEPT_REVISION &&
      !isEmpty(selectedRow)
    ) {
      const payload = [
        {
          orderItemId: selectedRow._id,
          followupType: 'for-revision',
          action: 'accept',
        },
      ];
      updateOrderFollowups(order?._id, payload);
    } else if (modalData.view === ConfirmationModalTypes.ACCEPT_ALL_REVISION) {
      const payload = filteredOrderItems.map((orderItem: any) => {
        return {
          orderItemId: orderItem._id,
          followupType: 'for-revision',
          action: 'accept',
        };
      });
      updateOrderFollowups(order?._id, payload);
    }
  };

  const generateBulkReturnPayload = (orderItems: any[], remarks: any) => {
    const payload: any[] = [];

    orderItems?.forEach((orderItem: any) => {
      payload.push({
        orderItemId: orderItem?._id,
        followupType: 'for-revision',
        action: 'return',
        remarks: remarks,
      });
    });

    return payload;
  };

  const handleReturnDevice = () => {
    if (
      modalData.view === ConfirmationModalTypes.RETURN_ORDER_ITEM &&
      !isEmpty(selectedRow)
    ) {
      const payload = [
        {
          orderItemId: selectedRow._id,
          followupType: 'for-revision',
          action: 'return',
        },
      ];
      updateOrderFollowups(order?._id, payload);
    } else if (
      modalData.view === ConfirmationModalTypes.RETURN_ORDER_NON_CONTACTABLE
    ) {
      const payload = generateBulkReturnPayload(
        order?.order_items,
        'Customer Not Contactable',
      );
      updateOrderFollowups(order?._id, payload);
    } else {
      const payload = generateBulkReturnPayload(
        order?.order_items,
        'Return all devices',
      );
      updateOrderFollowups(order?._id, payload);
    }
  };

  const renderModalContentAndActions = () => {
    switch (modalData?.view) {
      case ConfirmationModalTypes.ACCEPT_ALL_REVISION:
      case ConfirmationModalTypes.ACCEPT_REVISION:
        return (
          <div className="w-full">
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
                disabled={isUpdatingSendinDeadline}
                onClick={() => {
                  handleAcceptRevision();
                  onCloseModal();
                }}
              >
                Confirm
              </AppButton>
            </FormGroup>
          </div>
        );
      case ConfirmationModalTypes.RETURN_ALL_ORDER_ITEMS:
      case ConfirmationModalTypes.RETURN_ORDER_ITEM:
      case ConfirmationModalTypes.RETURN_ORDER_NON_CONTACTABLE:
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
                  handleReturnDevice();
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
                    view: ConfirmationModalTypes.RETURN_ORDER_NON_CONTACTABLE,
                    title: 'Return Device - Not Contactable',
                    subtitle: 'Do you wish to mark all devices for return?',
                  })
                }
              >
                Return - Not Contactable
              </AppButton>
            )}
          </div>
        </div>
      </div>
      <Table
        label="Devices Revised"
        isLoading={!order}
        headers={headers}
        rows={filteredOrderItems || []}
        parsingConfig={revisedDevicesTableParsingConfig}
      />
      <div className="px-5 pt-4 flex flex justify-end gap-2">
        <AppButton
          type="button"
          variant="fill"
          width="fit-content"
          onClick={() =>
            setModalData({
              open: true,
              view: ConfirmationModalTypes.ACCEPT_ALL_REVISION,
              title: 'Accept All Revisions',
              subtitle:
                'Do you wish to mark all devices revisions as accepted?',
            })
          }
        >
          Accept All
        </AppButton>
        <AppButton
          type="button"
          variant="outlined"
          width="fit-content"
          onClick={() =>
            setModalData({
              open: true,
              view: ConfirmationModalTypes.RETURN_ALL_ORDER_ITEMS,
              title: 'Return All Device',
              subtitle: 'Do you wish to mark all devices for return?',
            })
          }
        >
          Return All
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
