export enum OrderStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in-progress',
  CANCELLED = 'cancelled',
  CLOSED = 'closed',
  DELETED = 'deleted',
}

export enum OrderItemStatus {
  CREATED = 'created',
  CANCELLED = 'cancelled', // Returned
  RECYCLED = 'recycled', // Recycled
  RECEIVED = 'received',
  LABEL_SENT = 'label-sent',
  EVALUATED = 'evaluated',
  COMPLETED = 'completed',
  DELETED = 'deleted',
  FOR_REVISION = 'for-revision',
  REVISED = 'revised',
  REVISION_REJECTED = 'revision-rejected',
  ACCEPTED = 'accepted',
  HOLD = 'hold',
  FOR_RETURN = 'for-return',
  FOR_RECYCLE = 'for-recycle',
  RETURNED = 'returned',
  ALIGNED = 'aligned',
  BLOCKED = 'blocked',
  FOR_CANCEL = 'for-cancellation',
}

export enum DropdownOrderItemStatus {
  RECEIVED = 'received',
  EVALUATED = 'evaluated',
  COMPLETED = 'completed',
  FOR_REVISION = 'for-revision',
}

export enum OrderPaymentStatus {
  PENDING = 'pending',
}

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  COMPLETED = 'completed',
  PROCESSING = 'processing',
}

export enum DefaultStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum PromotionStatus {
  ENDED = 'ended',
  NOT_STARTED = 'not_started',
  ONGOING = 'ongoing',
  DRAFT = 'draft',
}

export enum OrderTypes {
  ONLINE = 'online',
  INSTORE = 'in-store',
  IN_STORE = 'in_store',
}

export enum CreditTypes {
  UPFRONT = 'upfront',
  POSTASSESSMENT = 'post-assessment',
  POST_ASSESSMENT = 'post_assessment',
}

export enum ProductTypes {
  LAPTOPS = 'laptops',
  TABLETS = 'tablets',
  PHONES = 'phones',
  WATCHES = 'watches',
  GAME_CONSOLES = 'game-consoles',
}

export enum ConfirmationModalTypes {
  APPROVE_CLAIM_REGULAR = 'APPROVE_CLAIM_REGULAR',
  REJECT_CLAIM_REGULAR = 'REJECT_CLAIM_REGULAR',
  OVERRIDE_CLAIM_STATUS = 'OVERRIDE_CLAIM',
  BULK_APPROVE_CLAIM_REGULAR = 'BULK_APPROVE_CLAIM_REGULAR',
  BULK_PROCESS_CLAIM_PAYMENT = 'BULK_PROCESS_CLAIM_PAYMENT',
  EXTEND_SENDIN_DEADLINE = 'EXTEND_SENDIN_DEADLINE',
  EXTEND_ALL_SENDIN_DEADLINE = 'EXTEND_ALL_SENDIN_DEADLINE',
  CANCEL_ORDER_ITEM = 'CANCEL_ORDER_ITEM',
  CANCEL_ALL_ORDER_ITEMS = 'CANCEL_ALL_ORDER_ITEMS',
  CANCEL_ORDER_NON_CONTACTABLE = 'CANCEL_ORDER_NON_CONTACTABLE',
  ACCEPT_REVISION = 'ACCEPT_REVISION',
  ACCEPT_ALL_REVISION = 'ACCEPT_ALL_REVISION',
  RETURN_ORDER_ITEM = 'RETURN_ORDER_ITEM',
  RETURN_ALL_ORDER_ITEMS = 'RETURN_ALL_ORDER_ITEMS',
  RETURN_ORDER_NON_CONTACTABLE = 'RETURN_ORDER_NON_CONTACTABLE',
  ISSUE_PAYMENT = 'ISSUE_PAYMENT',
}

export enum ResetForms {
  RESET_ADD_PROMOTION_FORM = 'RESET_ADD_PROMOTION_FORM',
  RESET_ADD_PROMOTION_CLAIMS_FORM = 'RESET_ADD_PROMOTION_CLAIMS_FORM',
  RESET_ADD_PROMOTION_CONDITION_FORM = 'RESET_ADD_PROMOTION_CONDITION_FORM',
  RESET_ADD_PROMOTION_ELIGIBILITY_FORM = 'RESET_ADD_PROMOTION_ELIGIBILITY_FORM',
  RESET_ADD_PROMOTION_STEPS_FORM = 'RESET_ADD_PROMOTION_STEPS_FORM',
  RESET_EDIT_PROMOTION_FORM = 'RESET_EDIT_PROMOTION_FORM',
  RESET_EDIT_PROMOTION_CLAIMS_FORM = 'RESET_EDIT_PROMOTION_CLAIMS_FORM',
  RESET_EDIT_PROMOTION_CONDITION_FORM = 'RESET_EDIT_PROMOTION_CONDITION_FORM',
  RESET_EDIT_PROMOTION_ELIGIBILITY_FORM = 'RESET_EDIT_PROMOTION_ELIGIBILITY_FORM',
  RESET_EDIT_PROMOTION_STEPS_FORM = 'RESET_EDIT_PROMOTION_STEPS_FORM',
}

export enum PermissionCodes {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  ADD_PRODUCT = 'ADD_PRODUCT',
  EDIT_PRODUCT = 'EDIT_PRODUCT',
  IMPORT_PRODUCTS = 'IMPORT_PRODUCTS',
  EXPORT_PRODUCTS = 'EXPORT_PRODUCTS',
  EXPORT_PRODUCT_UPLOAD_TEMPLATE = 'EXPORT_PRODUCT_UPLOAD_TEMPLATE',
  VIEW_ORDERS = 'VIEW_ORDERS',
  VIEW_ORDER_DETAILS = 'VIEW_ORDER_DETAILS',
  EDIT_IMEI_SERIAL = 'EDIT_IMEI_SERIAL',
  RESEND_LABEL = 'RESEND_LABEL',
  MARK_AS_RECEIVED = 'MARK_AS_RECEIVED',
  UPDATE_ORDER_ITEM_STATUS = 'UPDATE_ORDER_ITEM_STATUS',
  CANCEL_ITEM = 'CANCEL_ITEM',
  CANCEL_GIFT_CARDS = 'CANCEL_GIFT_CARDS',
  ADD_ORDER_CLAIMS = 'ADD_ORDER_CLAIMS',
  VIEW_DISCREPANCIES = 'VIEW_DISCREPANCIES',
  VIEW_ACTIONABLES = 'VIEW_ACTIONABLES',
  PRINT_LABEL = 'PRINT_LABEL',
  VIEW_USERS = 'VIEW_USERS',
  ADD_USER = 'ADD_USER',
  EDIT_USER_DETAILS = 'EDIT_USER_DETAILS',
  EDIT_USER_PERMISSIONS = 'EDIT_USER_PERMISSIONS',
  VIEW_PROMOTIONS = 'VIEW_PROMOTIONS',
  ADD_PROMOTION = 'ADD_PROMOTION',
  EDIT_PROMOTION = 'EDIT_PROMOTION',
  VIEW_PROMOTION_CLAIMS = 'VIEW_PROMOTION_CLAIMS',
  UPDATE_PROMOTION_CLAIM = 'UPDATE_PROMOTION_CLAIM',
  VIEW_PROMOTION_CLAIMS_PAYMENT = 'VIEW_PROMOTION_CLAIMS_PAYMENT',
  PROCESS_PROMOTION_CLAIM_PAYMENT = 'PROCESS_PROMOTION_CLAIM_PAYMENT',
  VIEW_PLATFORM_CONFIGS = 'VIEW_PLATFORM_CONFIGS',
  EDIT_PLATFORM_CONFIGS = 'EDIT_PLATFORM_CONFIGS',
  VIEW_PAYMENTS = 'VIEW_PAYMENTS',
  VIEW_PAYMENTS_AWAITING = 'VIEW_PAYMENTS_AWAITING',
  VIEW_ORDER_LOGS = 'VIEW_ORDER_LOGS',
  VIEW_ORDER_NOTES = 'VIEW_ORDER_NOTES',
  ADD_ORDER_NOTE = 'ADD_ORDER_NOTE',
  ADD_ZENDESK_LINK = 'ADD_ZENDESK_LINK',
  RESEND_EMAIL_NOTIFICATION = 'RESEND_EMAIL_NOTIFICATION',
  VIEW_ACTIONABLES_FOLLOW_UP_DEVICE_NOT_SENT = 'VIEW_ACTIONABLES_FOLLOW_UP_DEVICE_NOT_SENT',
  VIEW_ACTIONABLES_FOLLOW_UP_REVISION_OFFER = 'VIEW_ACTIONABLES_FOLLOW_UP_REVISION_OFFER',
  VIEW_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER = 'VIEW_ACTIONABLES_FOLLOW_UP_RECYCLE_OFFER',
  VIEW_ACTIONABLES_DEVICES_FOR_RECYCLE = 'VIEW_ACTIONABLES_DEVICES_FOR_RECYCLE',
  VIEW_ACTIONABLES_DEVICES_FOR_RETURN = 'VIEW_ACTIONABLES_DEVICES_FOR_RETURN',
  VIEW_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST = 'VIEW_ACTIONABLES_LOCKED_DEVICES_FOR_RETEST',
  VIEW_ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK = 'VIEW_ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK',
  VIEW_ACTIONABLES_PAYMENT_ACTION_NEEDED = 'VIEW_ACTIONABLES_PAYMENT_ACTION_NEEDED',
  VIEW_ACTIONABLES_DEVICES_WITH_BOX = 'VIEW_ACTIONABLES_DEVICES_WITH_BOX',
  VIEW_PREEZE_BALANCE = 'VIEW_PREEZE_BALANCE',
  TAKE_DEVICE_FOR_INVENTORY = 'TAKE_DEVICE_FOR_INVENTORY',
  VIEW_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY = 'VIEW_ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY',
}

export enum ProductUploadLogsStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum ProductUploadLogsTypes {
  PRODUCTS = 'import-products',
  PRICING = 'update-pricing',
}

export enum TemplateTypes {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum LogTypes {
  SYSTEM = 'system',
  USER = 'user',
}

export enum LockTypes {
  PASSCODE = 'passcode',
  ICLOUD = 'icloud',
  GOOGLE = 'google',
  SAMSUNG = 'samsung',
  MDM = 'mdm',
  OTHERS = 'others',
}

export enum LockStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  RETEST = 'retest',
}

export enum PaymentStatus {
  NOT_YET_ISSUED = 'not-yet-issued',
  ISSUED = 'issued',
  FOR_CHARGE = 'for-charge',
  CHARGED = 'charged',
  FAILED = 'failed',
  AWAITING_PAYMENT = 'awaiting-payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FORFEIT = 'forfeit'
}

export enum ShippingStatuses {
  TODO = 'todo',
  DONE = 'done',
}

export enum StripeErrorCodes {
  PARAMETER_INVALID_INTEGER = 'parameter_invalid_integer',
  NOT_FOUND = 'not_found',
  AMOUNT_TOO_LARGE = 'amount_too_large',
  PAYMENT_INTENT_UNEXPECTED_STATE = 'payment_intent_unexpected_state',
  RESOURCE_MISSING = 'resource_missing',
  UNKNOWN_ERROR = 'unknown_error',
}

export enum CourierCodes {
  SHIP_ENGINE = 'shipengine',
  NZ_POST = 'nzpost',
}

export enum Pages {
  DEVICE_NOT_SENT = 'device-not-sent',
  REVISION_OFFER = 'revision-offer',
  RECYCLE_OFFER = 'recycle-offer',

  CURRENT_LOCK = 'current-lock',
  FOR_RETEST = 'for-retest',
  PAYMENT_ACTION_NEEDED = 'payment-action-needed',
  DEVICES_WITH_BOX = 'devices-with-box',
  DEVICES_FOR_RETURN = 'devices-for-return',
  DEVICES_FOR_RECYCLE = 'devices-for-recycle',
  DEVICES_FOR_INVENTORY = 'devices-for-inventory',
}

export enum PaymentTypes {
  VOUCHER = 'voucher',
  BANK = 'bank',
  CARD = 'card',
}

export enum PaymentFlow {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum FollowUpDaysFilter {
  TWO = '2',
  FOUR = '4',
  SIX = '6',
  SEVEN = '7',
}

export enum InventoryStatus {
  NON_INVENTORY = 'non-inventory',
  IN_INVENTORY = 'in-inventory',
  OUT_OF_INVENTORY = 'out-of-inventory',
}

export enum YesNo {
  YES = 'yes',
  NO = 'no',
}

export enum AssessmentAnswers {
  FUNCTIONAL = 'Functional',
  NON_FUNCTIONAL = 'Non-Functional',
  PASSED = 'Passed',
  DAMAGED = 'Damaged',
  INCLUDED = 'Included',
  NOT_INCLUDED = 'Not Included',
}

export enum PromotionTypes {
  REGULAR = 'regular',
  BOOST = 'boost',
}

export enum GenericResponseTypes {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum GenericResponseTitles {
  SUCCESS = 'Successful',
  FAILED = 'Error Processing',
}

export enum GenericResponseMessages {
  SUCCESS = 'Action completed successfully.',
  FAILED = 'Failed to complete the action.',
}
