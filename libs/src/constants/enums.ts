export enum OrderStatus {
  CREATED = 'created',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DELETED = 'deleted',
}

export enum OrderItemStatus {
  CREATED = 'created',
  CANCELLED = 'cancelled',
  RECEIVED = 'received',
  LABEL_SENT = 'label-sent',
  EVALUATED = 'evaluated',
  COMPLETED = 'completed',
  DELETED = 'deleted',
  FOR_REVISION = 'for-revision',
  REVISED = 'revised',
  REVISION_REJECTED = 'revision-rejected',
  HOLD = 'hold',
  DEVICE_RETURNED = 'device-returned',
  FOR_RETURN = 'for-return',
  FOR_RECYCLE = 'for-recycle',
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
  PROCESSING = 'processing'
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
}

export enum OrderTypes {
  ONLINE = 'online',
  INSTORE = 'in-store',
  IN_STORE = 'in_store'
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
