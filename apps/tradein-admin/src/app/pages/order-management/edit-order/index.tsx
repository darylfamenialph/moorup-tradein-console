/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  AccordionContainer,
  AccordionContent,
  AccordionHeader,
  AccordionHeaderContainer,
  AccordionInnerContainer,
  AccordionTitle,
  AppButton,
  COLLECTION_ORDER_ITEM_STATUS,
  COMPLETION_ORDER_ITEM_STATUS,
  FormGroup,
  GenericModal,
  LoaderContainer,
  LockTypes,
  ORDER_LOGS_COLUMNS,
  ORDER_NOTES_COLUMNS,
  OrderItemStatus,
  OrderItems,
  PageSubHeader,
  Shipments,
  StatusModal,
  StyledIcon,
  StyledInput,
  StyledLink,
  StyledReactSelect,
  TabList,
  Table,
  Typography,
  VALIDATION_ORDER_ITEM_STATUS,
  capitalizeFirstLetters,
  formatToReadable,
  orderLogsParsingConfig,
  orderNotesParsingConfig,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClaimsList from './claims-list';
import Collection from './collection';
import Completion from './completion';
import QuoteDetails from './quote-details';
import { EditForm } from './status/edit-form';
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
    fetchOrderShipments,
    patchOrderItemById,
    evaluateOrderItemById,
    reviseOfferByItemId,
    resendShipmentLabel,
    clearOrder,
    addOrderNote,
    upsertZendeskLink,
    updateOrderItemLockType,
  } = useOrder();

  const {
    order = {},
    shipments = [],
    isUpdatingOrder,
    isFetchingOrder,
    isUpdatingImeiSerial,
    isUpdatingOrderItemLockType,
  } = state;

  const {
    hasUpdateOrderItemStatusPermission,
    hasResendLabelPermission,
    hasViewPromotionClaimsPermission,
    hasViewOrderLogsPermission,
    hasViewOrderNotesPermission,
    hasAddOrderNotePermission,
    hasAddZendeskLinkPermission,
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

  const [statusModal, setStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({} as OrderItems);
  const [parsedShipments, setParsedShipments] = useState({});
  const [collectionOrderItems, setCollectionOrderItems] = useState([]);
  const [validationOrderItems, setValidationOrderItems] = useState([]);
  const [completionOrderItems, setCompletionOrderItems] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [lockType, setLockType] = useState('');
  const [noteInputErrorMessage, setNoteInputErrorMessage] = useState('');
  const [noteInputError, setNoteInputError] = useState(false);
  const [zendeskLink, setZendeskLink] = useState(order.zendesk_link);
  const [zendeskLinkInputErrorMessage, setZendeskLinkInputErrorMessage] =
    useState('');
  const [zendeskLinkInputError, setZendeskLinkInputError] = useState(false);

  const orderItems = order?.order_items || [];

  const isSingleOrderFlow = order?.order_flow === 'single';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchOrderById(orderId, signal);
    fetchOrderShipments(orderId, signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(order)) {
      setZendeskLink(order?.zendesk_link);
    }
  }, [order]);

  useEffect(() => {
    if (!isEmpty(order)) {
      if (order.platform !== activePlatform) {
        clearOrder();
        navigate('/dashboard/order/list');
      }
    }
  }, [activePlatform]);

  useEffect(() => {
    const formattedShipments = parseShipments();
    setParsedShipments(formattedShipments);
  }, [shipments]);

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

  const onUpdateStatus = (newValue: any, orderItem: OrderItems) => {
    if (newValue.status === OrderItemStatus.FOR_REVISION) {
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
        ];
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
    } else if (newValue.status === OrderItemStatus.EVALUATED) {
      evaluateOrderItemById(orderItem.line_item_number, {
        platform: activePlatform,
        admin_id: userDetails?._id,
      });
    } else {
      patchOrderItemById(orderItem._id, {
        status: newValue.status,
        admin_id: userDetails?._id,
      });
    }
    setSelectedItem({} as OrderItems);
  };

  const toggleAccordion = (item: any) => {
    setAccordionState((prev: any) => {
      return {
        ...prev,
        [item]: !prev[item],
      };
    });
  };

  const parseShipments = () => {
    const shippingItems: any = {};

    if (Array.isArray(shipments)) {
      shipments?.forEach((shipment: Shipments) => {
        if (shippingItems[shipment.item_id]) {
          shippingItems[shipment.item_id][shipment.direction] = shipment;
        } else {
          shippingItems[shipment.item_id] = {
            [shipment.direction]: shipment,
          };
        }
      });
    } else if (Array.isArray(shipments?.item_id)) {
      shipments?.item_id?.forEach((item_id: string) => {
        shippingItems[item_id] = {
          [shipments.direction]: shipments,
        };
      });
    } else {
      orderItems?.forEach((item: OrderItems) => {
        shippingItems[item?._id] = {
          [shipments.direction]: shipments,
        };
      });
    }

    return shippingItems;
  };

  const addActions = (items: any) => {
    return items.map((item: any) => ({
      ...item,
      resendEmailAction: () => {},
    }));
  };

  const handleToggleModal = (type: any, isOpen: boolean) => {
    setModalType(type);
    setIsOpenModal(isOpen);
  };

  const renderTabs = () => {
    const logsHeaders = [...ORDER_LOGS_COLUMNS];
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
                action={
                  !isSingleOrderFlow &&
                  order?.status !== OrderItemStatus.CANCELLED &&
                  hasResendLabelPermission && (
                    <button
                      className="text-md text-white bg-emerald-500 py-1 px-3 rounded-md hover:bg-emerald-600"
                      onClick={() => resendShipmentLabel(order?._id)}
                      disabled={isUpdatingOrder}
                    >
                      Resend Label
                    </button>
                  )
                }
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
                    orderItems={collectionOrderItems}
                    shipments={parsedShipments}
                    isSingleOrderFlow={isSingleOrderFlow}
                    setStatusModal={setStatusModal}
                    setSelectedItem={setSelectedItem}
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
                    orderItems={validationOrderItems}
                    setStatusModal={setStatusModal}
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
                    orderItems={completionOrderItems}
                    setStatusModal={setStatusModal}
                    setSelectedItem={setSelectedItem}
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
        <StatusModal
          isOpen={statusModal && hasUpdateOrderItemStatusPermission}
          onClose={() => setStatusModal(false)}
        >
          {!isEmpty(selectedItem) && (
            <EditForm
              setStatusModal={(value) => {
                if (!value) setSelectedItem({} as OrderItems);
                setStatusModal(value);
              }}
              updateStatus={onUpdateStatus}
              orderItem={selectedItem}
            />
          )}
        </StatusModal>
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
                      setModalType('add-note');
                      setIsOpenModal(true);
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
                      setModalType('add-zendesk-link');
                      setIsOpenModal(true);
                    }}
                  >
                    {isEmpty(order?.zendesk_link)
                      ? 'Add Zendesk Link'
                      : 'Update Zendesk Link'}
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

  const handleChange = (
    e: { target: { value: SetStateAction<string> } },
    key: string,
  ) => {
    switch (key) {
      case 'add-note':
        setNoteInput(e.target.value);
        setNoteInputError(false);
        setNoteInputErrorMessage('');
        break;

      case 'add-zendesk-link':
        setZendeskLink(e.target.value);
        setZendeskLinkInputError(false);
        setZendeskLinkInputErrorMessage('');
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  const handleBlur = (key: string) => {
    switch (key) {
      case 'add-note':
        if (!noteInput.trim()) {
          setNoteInputError(true);
          setNoteInputErrorMessage('This field is required.');
        } else {
          setNoteInputError(false);
          setNoteInputErrorMessage('');
        }
        break;

      case 'add-zendesk-link':
        if (!zendeskLink.trim()) {
          setZendeskLinkInputError(true);
          setZendeskLinkInputErrorMessage('This field is required.');
        } else {
          setZendeskLinkInputError(false);
          setZendeskLinkInputErrorMessage('');
        }
        break;

      default:
        throw new Error('Case exception.');
    }
  };

  const handleReset = () => {
    setIsOpenModal(false);

    setNoteInput('');
    setNoteInputError(false);
    setNoteInputErrorMessage('');

    setZendeskLink(order?.zendesk_link || '');
    setZendeskLinkInputError(false);
    setZendeskLinkInputErrorMessage('');
  };

  const handleSubmit = (key: string) => {
    switch (key) {
      case 'add-note':
        addOrderNote(order._id, {
          admin_id: userDetails?._id,
          order_id: order._id,
          note: noteInput,
        });
        break;

      case 'add-zendesk-link':
        upsertZendeskLink(order._id, {
          zendesk_link: zendeskLink,
        });
        break;

      case 'set-lock-type':
        updateOrderItemLockType(selectedItem?._id, order._id, {
          admin_id: userDetails?._id,
          lock_status: 'locked',
          lock_type: lockType,
        });
        break;

      default:
        throw new Error('Case exception.');
    }

    handleReset();
  };

  const renderModalContentAndActions = (key: string) => {
    const lockTypeOptions = Object.values(LockTypes).map((item) => {
      return {
        label: item.replace('-', ' ').toLocaleUpperCase(),
        value: item,
      };
    });

    switch (key) {
      case 'add-note':
        return (
          <>
            <StyledInput
              type="text"
              id="add-note"
              label="Note"
              name="add-note"
              placeholder="Note"
              onChange={(e) => handleChange(e, 'add-note')}
              value={noteInput}
              onBlur={() => handleBlur('add-note')}
              error={noteInputError}
              errorMessage={noteInputErrorMessage}
            />
            <FormGroup margin="0px">
              <span />
              <FormGroup margin="0px">
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleReset()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="fill"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('add-note')}
                  disabled={isEmpty(noteInput)}
                >
                  Submit
                </AppButton>
              </FormGroup>
            </FormGroup>
          </>
        );

      case 'add-zendesk-link':
        return (
          <>
            <StyledInput
              type="text"
              id="zendesk_link"
              label="Zendesk Link"
              name="zendesk_link"
              placeholder="Zendesk Link"
              onChange={(e) => handleChange(e, 'add-zendesk-link')}
              value={zendeskLink}
              onBlur={() => handleBlur('add-zendesk-link')}
              error={zendeskLinkInputError}
              errorMessage={zendeskLinkInputErrorMessage}
            />
            <FormGroup margin="0px">
              <span />
              <FormGroup margin="0px">
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleReset()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="fill"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('add-zendesk-link')}
                  disabled={isEmpty(zendeskLink)}
                >
                  Submit
                </AppButton>
              </FormGroup>
            </FormGroup>
          </>
        );

      case 'set-lock-type':
        return (
          <>
            <FormGroup>
              <StyledReactSelect
                label="Lock Type"
                isMulti={false}
                options={lockTypeOptions}
                name="lockType"
                placeholder="Select Lock type"
                value={lockType}
                onChange={(selected) => {
                  setLockType(selected.value);
                }}
              />
            </FormGroup>
            <FormGroup margin="0px">
              <span />
              <FormGroup margin="0px">
                <AppButton
                  type="button"
                  variant="outlined"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleReset()}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="fill"
                  width="fit-content"
                  padding="8px 20px"
                  onClick={() => handleSubmit('set-lock-type')}
                  disabled={isEmpty(lockType) || isUpdatingOrderItemLockType}
                >
                  Submit
                </AppButton>
              </FormGroup>
            </FormGroup>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      {renderTabs()}
      <GenericModal
        title={capitalizeFirstLetters(formatToReadable(modalType))}
        content={renderModalContentAndActions(modalType)}
        isOpen={isOpenModal}
        onClose={() => handleReset()}
      />
    </>
  );
};
