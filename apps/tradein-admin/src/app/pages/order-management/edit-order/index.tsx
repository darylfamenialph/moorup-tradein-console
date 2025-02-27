/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  ACTIONS_COLUMN,
  AccordionContainer,
  AccordionContent,
  AccordionHeader,
  AccordionHeaderContainer,
  AccordionInnerContainer,
  AccordionTitle,
  AppButton,
  COLLECTION_ORDER_ITEM_STATUS,
  COMPLETION_ORDER_ITEM_STATUS,
  GenericModal,
  InventoryStatus,
  LoaderContainer,
  MODAL_TYPES,
  ORDER_LOGS_COLUMNS,
  ORDER_NOTES_COLUMNS,
  OrderItemStatus,
  OrderItems,
  PageSubHeader,
  StyledIcon,
  StyledLink,
  TabList,
  Table,
  Typography,
  VALIDATION_ORDER_ITEM_STATUS,
  capitalizeFirstLetters,
  compress,
  formatToReadable,
  orderLogsParsingConfig,
  orderNotesParsingConfig,
  removeEmptyFields,
  useAuth,
  useCommon,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClaimsList from './claims-list';
import Collection from './collection';
import Completion from './completion';
import { AddNote } from './modals/add-note';
import { CancelItem } from './modals/cancel-item';
import { EvaluateDevice } from './modals/evaluate-device';
import { MarkAsReceived } from './modals/mark-as-received';
import { ResendLabel } from './modals/resend-label';
import { ReturnDevice } from './modals/return-device';
import { ReviseDevice } from './modals/revise-device';
import { ReviseDeviceConfirmation } from './modals/revise-device-confirmation';
import { SendBox } from './modals/send-box';
import { SetLockType } from './modals/set-lock-type';
import { SetLockTypeConfirmation } from './modals/set-lock-type-confirmation';
import { TakeForInventory } from './modals/take-for-inventory';
import { UpdateDeviceStatus } from './modals/update-device-status';
import { UpdateDeviceStatusConfirmation } from './modals/update-device-status-confirmation';
import { UpdateZendeskLink } from './modals/update-zendesk-link';
import QuoteDetails from './quote-details';
import ValidationOffer from './validation-offer';
type AccordionStates = {
  quote: boolean;
  claims: boolean;
  collection: boolean;
  validation: boolean;
  completion: boolean;
};

type AccordionHeadingProps = {
  id: any;
  title: string;
  isOpen: boolean;
  action?: any;
  onToggle: (id: any) => void;
};

export const AccordionHeading = ({
  id,
  title,
  isOpen,
  action,
  onToggle,
}: AccordionHeadingProps) => {
  return (
    <AccordionHeader onClick={() => onToggle(id)} isOpen={isOpen}>
      <div className="flex justify-between items-center w-full pr-4">
        <AccordionTitle>{title}</AccordionTitle>
        {action}
      </div>
      <StyledIcon
        icon={isOpen ? faAngleDown : faAngleUp}
        color={isOpen ? 'inherit' : '#ccc'}
      />
    </AccordionHeader>
  );
};

export const ScrollableContainer = ({ children }: any) => {
  return (
    <div className="max-w-full mx-auto">
      <div className="overflow-x-auto max-w-full pb-2">{children}</div>
    </div>
  );
};

export const EditOrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const {
    state,
    fetchOrderById,
    patchOrderItemById,
    evaluateOrderItemById,
    reviseOfferByItemId,
    resendShipmentLabel,
    clearOrder,
    addOrderNote,
    upsertZendeskLink,
    updateOrderItemLockType,
    updateDeviceInventoryStatus,
    resendEmailv2,
    receiveOrderItemById,
    printLabels,
    cancelOrderItemById,
    printOutboundLabel,
    updateDeviceStatus,
  } = useOrder();

  const { state: commonState, setGenericModalState } = useCommon();
  const { genericModalState } = commonState;

  const {
    order = {},
    isUpdatingOrder,
    isFetchingOrder,
    isUpdatingImeiSerial,
  } = state;

  const {
    hasViewPromotionClaimsPermission,
    hasViewOrderLogsPermission,
    hasViewOrderNotesPermission,
    hasAddOrderNotePermission,
    hasAddZendeskLinkPermission,
    hasResendEmailNotificationPermission,
  } = usePermission();

  const { state: authState } = useAuth();
  const { activePlatform, userDetails } = authState;

  const [accordionState, setAccordionState] = useState<AccordionStates>({
    quote: true,
    claims: true,
    collection: true,
    validation: true,
    completion: true,
  } as AccordionStates);

  const [selectedItem, setSelectedItem] = useState({} as OrderItems);
  const [collectionOrderItems, setCollectionOrderItems] = useState([]);
  const [validationOrderItems, setValidationOrderItems] = useState([]);
  const [completionOrderItems, setCompletionOrderItems] = useState([]);

  const orderItems = order?.order_items || [];
  const isSingleOrderFlow = order?.order_flow === 'single';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchOrderById(orderId, signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(order)) {
      if (order.platform !== activePlatform) {
        clearOrder();
        navigate('/dashboard/order/list');
      }
    }
  }, [activePlatform]);

  useEffect(() => {
    if (orderItems.length > 0) {
      const collectionOrderItems = orderItems.filter((item: OrderItems) =>
        COLLECTION_ORDER_ITEM_STATUS.includes(item.status as OrderItemStatus),
      );
      const validationOrderItems = orderItems.filter((item: OrderItems) =>
        VALIDATION_ORDER_ITEM_STATUS.includes(item.status as OrderItemStatus),
      );
      const completionOrderItems = orderItems.filter((item: OrderItems) =>
        COMPLETION_ORDER_ITEM_STATUS.includes(item.status as OrderItemStatus),
      );
      setCollectionOrderItems(collectionOrderItems);
      setValidationOrderItems(validationOrderItems);
      setCompletionOrderItems(completionOrderItems);

      setAccordionState((prev) => {
        return {
          ...prev,
          collection: collectionOrderItems.length > 0,
          validation: validationOrderItems.length > 0,
          completion: completionOrderItems.length > 0,
        };
      });
    }
  }, [order]);

  const onReviseDevice = (newValue: any, orderItem: OrderItems) => {
    const payload: any = {};
    if (newValue?.revision_details === 'change-model') {
      payload.platform = activePlatform;
      payload.revision_price = newValue.newDevicePrice;
      payload.revision_reasons = 'Wrong model';
      payload.admin_id = userDetails?._id;
      payload.product_variant_id = newValue.variant;
      payload.question_answered = [
        {
          question: 'functional-assessment',
          answer: newValue?.functionalAssessmentPassed,
        },
        {
          question: 'screen-assessment',
          answer: newValue?.screenAssessmentPassed,
        },
        newValue?.accessoriesAssessmentPassed && {
          question: 'has-charger',
          answer: newValue?.accessoriesAssessmentPassed,
        },
      ].filter((item: any) => item !== null);
      payload.additional_information = {
        deviceSku: newValue?.deviceSku,
      };
    } else {
      payload.platform = activePlatform;
      payload.revision_price = newValue.revised_offer;
      payload.revision_reasons = newValue.reason?.split(',');
      payload.admin_id = userDetails?._id;
    }

    reviseOfferByItemId(orderItem?._id, payload);
  };

  const toggleAccordion = (item: any) => {
    setAccordionState((prev: any) => {
      return {
        ...prev,
        [item]: !prev[item],
      };
    });
  };

  const addActions = (items: any) => {
    return items.map((item: any) => ({
      ...item,
      resendEmailAction: () =>
        resendEmailv2({
          email_processor: item?.email.email_processor || null,
          data: compress(item?.email) || {},
        }),
    }));
  };

  const handleToggleModal = (type: string, isOpen: boolean, data?: any) => {
    setGenericModalState({
      open: isOpen,
      type,
      ...(data && { data }),
    });
  };

  const renderTabs = () => {
    const logsHeaders = [
      ...ORDER_LOGS_COLUMNS,
      ...(hasResendEmailNotificationPermission ? ACTIONS_COLUMN : []),
    ];
    const notesHeaders = [...ORDER_NOTES_COLUMNS];

    const sortedLogList = (order?.log_list || []).sort(
      (a: any, b: any) =>
        new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime(),
    );

    const sortedNoteList = (order?.note_list || []).sort(
      (a: any, b: any) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
    );

    const logList = addActions(sortedLogList || []);

    const tabs: string[] = ['Order Details'];
    const tabContent: React.ReactNode[] = [
      <LoaderContainer
        margin="5px 20px 0px 20px"
        padding="5px 20px 0px 20px"
        loading={isFetchingOrder || isUpdatingOrder || isUpdatingImeiSerial}
      >
        <AccordionContainer className="px-4 pt-4">
          <AccordionInnerContainer>
            <AccordionHeaderContainer>
              <AccordionHeading
                id="quote"
                title="Quote Creation"
                isOpen={accordionState.quote}
                onToggle={() => toggleAccordion('quote')}
              />
            </AccordionHeaderContainer>
            <AccordionContent
              isOpen={accordionState.quote}
              key="Quote Creation"
            >
              <QuoteDetails />
            </AccordionContent>
            {hasViewPromotionClaimsPermission && (
              <ClaimsList
                order={order}
                isOpen={accordionState.claims}
                onToggle={() => toggleAccordion('claims')}
              />
            )}
          </AccordionInnerContainer>
        </AccordionContainer>
        <AccordionContainer className="px-4 pt-4">
          <hr />
          <h2 className="text-lg text-gray-500 p-2">Order Items</h2>
          <AccordionInnerContainer>
            <AccordionHeaderContainer>
              <AccordionHeading
                id="collection"
                title={`Collection (${collectionOrderItems.length})`}
                isOpen={accordionState.collection}
                onToggle={() => toggleAccordion('collection')}
              />
            </AccordionHeaderContainer>
            <AccordionContent
              isOpen={accordionState.collection}
              removePadding={true}
              key="Collection"
            >
              {collectionOrderItems.length > 0 ? (
                <ScrollableContainer>
                  <Collection
                    orderId={order._id}
                    order={order}
                    orderItems={collectionOrderItems}
                    isSingleOrderFlow={isSingleOrderFlow}
                    setSelectedItem={setSelectedItem}
                    setGenericModal={(type) => handleToggleModal(type, true)}
                  />
                </ScrollableContainer>
              ) : (
                <h6 className="text-center text-gray-500 pb-3 pt-2">
                  No order items for collection
                </h6>
              )}
            </AccordionContent>
            <AccordionHeaderContainer>
              <AccordionHeading
                id="validation"
                title={`Validation & Offer (${validationOrderItems.length})`}
                isOpen={accordionState.validation}
                onToggle={() => toggleAccordion('validation')}
              />
            </AccordionHeaderContainer>
            <AccordionContent
              isOpen={accordionState.validation}
              removePadding={true}
              key="validation"
            >
              {validationOrderItems.length > 0 ? (
                <ScrollableContainer>
                  <ValidationOffer
                    orderId={orderId}
                    order={order}
                    orderItems={validationOrderItems}
                    setSelectedItem={setSelectedItem}
                    setGenericModal={(type) => handleToggleModal(type, true)}
                  />
                </ScrollableContainer>
              ) : (
                <h6 className="text-center text-gray-500 pb-3 pt-2">
                  No order items for validation or offer
                </h6>
              )}
            </AccordionContent>
            <AccordionHeaderContainer>
              <AccordionHeading
                id="completion"
                title={`Completion (${completionOrderItems.length})`}
                isOpen={accordionState.completion}
                onToggle={() => toggleAccordion('completion')}
              />
            </AccordionHeaderContainer>
            <AccordionContent
              isOpen={accordionState.completion}
              removePadding={true}
              key="completion"
            >
              {completionOrderItems.length > 0 ? (
                <ScrollableContainer>
                  <Completion
                    orderId={orderId}
                    order={order}
                    orderItems={completionOrderItems}
                    setSelectedItem={setSelectedItem}
                    setGenericModal={(type) => handleToggleModal(type, true)}
                  />
                </ScrollableContainer>
              ) : (
                <h6 className="text-center text-gray-500 pb-3 pt-2">
                  No order items for completion
                </h6>
              )}
            </AccordionContent>
          </AccordionInnerContainer>
        </AccordionContainer>
      </LoaderContainer>,
    ];

    if (hasViewOrderLogsPermission) {
      tabs.push('Logs');
      tabContent.push(
        <Table
          label="System Log"
          isLoading={isFetchingOrder}
          headers={logsHeaders}
          rows={logList || []}
          parsingConfig={orderLogsParsingConfig}
        />,
      );
    }

    if (hasViewOrderNotesPermission) {
      tabs.push('Notes');
      tabContent.push(
        <>
          <PageSubHeader
            marginTop="5px"
            overflowx="auto"
            leftControls={
              <>
                {hasAddOrderNotePermission && (
                  <AppButton
                    type="button"
                    variant="fill"
                    width="fit-content"
                    padding="8px 20px"
                    icon={faPlus}
                    onClick={() => {
                      setGenericModalState({
                        type: MODAL_TYPES.ADD_NOTE,
                        open: true,
                      });
                    }}
                  >
                    Add Note
                  </AppButton>
                )}
                {hasAddZendeskLinkPermission && (
                  <AppButton
                    type="button"
                    variant="fill"
                    width="fit-content"
                    padding="8px 20px"
                    icon={faPlus}
                    onClick={() => {
                      setGenericModalState({
                        type: MODAL_TYPES.UPDATE_ZENDESK_LINK,
                        open: true,
                      });
                    }}
                  >
                    Update Zendesk Link
                  </AppButton>
                )}
                <StyledLink
                  href={order?.zendesk_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="body2">{order?.zendesk_link}</Typography>
                </StyledLink>
              </>
            }
          />
          <Table
            label="Notes"
            isLoading={isFetchingOrder}
            headers={notesHeaders}
            rows={sortedNoteList || []}
            parsingConfig={orderNotesParsingConfig}
          />
        </>,
      );
    }

    return <TabList tabs={tabs}>{tabContent}</TabList>;
  };

  const handleReset = () => {
    setGenericModalState({
      open: false,
      type: '',
      title: '',
      content: '',
      data: {},
    });
  };

  const handleModalStatus = (isOpen: boolean) => {
    setGenericModalState({
      ...genericModalState,
      open: isOpen,
    });
  };

  const handleSubmit = (key: string, data?: any) => {
    const resetExceptions = [
      MODAL_TYPES.REVISE_DEVICE,
      MODAL_TYPES.SET_LOCK_TYPE,
      MODAL_TYPES.UPDATE_DEVICE_STATUS,
    ];

    switch (key) {
      case MODAL_TYPES.ADD_NOTE:
        addOrderNote(order._id, {
          admin_id: userDetails?._id,
          order_id: order._id,
          note: data,
        });
        break;

      case MODAL_TYPES.UPDATE_ZENDESK_LINK:
        upsertZendeskLink(order._id, {
          zendesk_link: data,
        });
        break;

      case MODAL_TYPES.MARK_AS_RECEIVED:
        receiveOrderItemById(selectedItem?._id, {
          admin_id: userDetails?._id,
        });
        break;

      case MODAL_TYPES.SET_LOCK_TYPE:
        setGenericModalState({
          open: true,
          type: MODAL_TYPES.CONFIRM_SET_LOCK_TYPE,
          data: data,
        });
        break;

      case MODAL_TYPES.CONFIRM_SET_LOCK_TYPE:
        updateOrderItemLockType(selectedItem?._id, order._id, {
          admin_id: userDetails?._id,
          lock_status: 'locked',
          lock_type: genericModalState.data,
        });
        break;

      case MODAL_TYPES.UPDATE_DEVICE_STATUS:
        setGenericModalState({
          open: true,
          type: MODAL_TYPES.CONFIRM_UPDATE_DEVICE_STATUS,
          data: data,
        });
        break;

      case MODAL_TYPES.CONFIRM_UPDATE_DEVICE_STATUS:
        console.log(genericModalState?.data);
        console.log(selectedItem?._id);

        updateDeviceStatus(
          selectedItem?._id,
          removeEmptyFields(genericModalState?.data),
        );
        break;

      case MODAL_TYPES.EVALUATE_DEVICE:
        evaluateOrderItemById(selectedItem.line_item_number, {
          platform: activePlatform,
          admin_id: userDetails?._id,
        });
        break;

      case MODAL_TYPES.TAKE_FOR_INVENTORY:
        updateDeviceInventoryStatus(
          selectedItem?._id,
          {
            inventory_status: InventoryStatus.IN_INVENTORY,
            admin_id: userDetails?._id,
          },
          {
            inventory_status: InventoryStatus.NON_INVENTORY,
          },
          order?._id,
        );
        break;

      case MODAL_TYPES.SEND_BOX:
        printLabels({
          item_id: selectedItem._id,
          admin_id: userDetails?._id,
        });
        break;

      case MODAL_TYPES.REVISE_DEVICE:
        setGenericModalState({
          open: true,
          type: MODAL_TYPES.CONFIRM_REVISE_DEVICE,
          data: data,
        });
        break;

      case MODAL_TYPES.CONFIRM_REVISE_DEVICE:
        onReviseDevice(genericModalState?.data, selectedItem);
        break;

      case MODAL_TYPES.RESEND_LABEL:
        resendShipmentLabel(selectedItem?._id);
        break;

      case MODAL_TYPES.CANCEL_ITEM:
        cancelOrderItemById(selectedItem?._id);
        break;

      case MODAL_TYPES.RETURN_DEVICE:
        printOutboundLabel({
          item_id: selectedItem?._id,
          admin_id: userDetails?._id,
        });

        patchOrderItemById(selectedItem?._id, {
          status: OrderItemStatus.RETURNED,
          admin_id: userDetails?._id,
        });
        break;

      default:
        throw new Error('Case exception.');
    }

    if (!resetExceptions.includes(key)) handleReset();
    setSelectedItem({} as OrderItems);
  };

  const renderModalContentAndActions = (key: string) => {
    switch (key) {
      case MODAL_TYPES.ADD_NOTE:
        return (
          <AddNote onSubmit={handleSubmit} setModalStatus={handleModalStatus} />
        );

      case MODAL_TYPES.UPDATE_ZENDESK_LINK:
        return (
          <UpdateZendeskLink
            currentZendeskLink={order?.zendesk_link}
            onSubmit={handleSubmit}
            setModalStatus={handleModalStatus}
          />
        );

      case MODAL_TYPES.MARK_AS_RECEIVED:
        return (
          <MarkAsReceived
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.TAKE_FOR_INVENTORY:
        return (
          <TakeForInventory
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.SET_LOCK_TYPE:
        return (
          <SetLockType
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.CONFIRM_SET_LOCK_TYPE:
        return (
          <SetLockTypeConfirmation
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.UPDATE_DEVICE_STATUS:
        return (
          <UpdateDeviceStatus
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
            creditType={order?.credit_type}
          />
        );

      case MODAL_TYPES.CONFIRM_UPDATE_DEVICE_STATUS:
        return (
          <UpdateDeviceStatusConfirmation
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.REVISE_DEVICE:
        return (
          <ReviseDevice
            setModalStatus={handleModalStatus}
            updateStatus={handleSubmit}
            orderItem={selectedItem}
          />
        );

      case MODAL_TYPES.CONFIRM_REVISE_DEVICE:
        return (
          <ReviseDeviceConfirmation
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.EVALUATE_DEVICE:
        return (
          <EvaluateDevice
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.SEND_BOX:
        return (
          <SendBox setModalStatus={handleModalStatus} onSubmit={handleSubmit} />
        );

      case MODAL_TYPES.RESEND_LABEL:
        return (
          <ResendLabel
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.CANCEL_ITEM:
        return (
          <CancelItem
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      case MODAL_TYPES.RETURN_DEVICE:
        return (
          <ReturnDevice
            setModalStatus={handleModalStatus}
            onSubmit={handleSubmit}
          />
        );

      default:
        break;
    }
  };

  return (
    <>
      {renderTabs()}
      <GenericModal
        title={capitalizeFirstLetters(formatToReadable(genericModalState.type))}
        content={renderModalContentAndActions(genericModalState?.type)}
        isOpen={genericModalState?.open}
        onClose={() => handleReset()}
      />
    </>
  );
};
