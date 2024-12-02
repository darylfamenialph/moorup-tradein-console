export const DEFAULT_COLUMN = [
  {
    label: 'ID',
    order: 1,
    enableSort: true,
    keyName: '_id',
  },
];

export const PRODUCT_MANAGEMENT_COLUMNS = [
  {
    label: 'Display Name',
    order: 2,
    enableSort: true,
    keyName: 'display_name',
  },
  {
    label: 'Brand',
    order: 3,
    enableSort: true,
    keyName: 'brand',
  },
  {
    label: 'Model',
    order: 4,
    enableSort: true,
    keyName: 'model',
  },
  {
    label: 'Year',
    order: 5,
    enableSort: true,
    keyName: 'year',
  },
  {
    label: 'Type',
    order: 6,
    enableSort: true,
    keyName: 'type',
  },
];

export const PRODUCT_PRICING_UPLOAD_COLUMNS = [
  {
    label: 'Errors',
    order: 2,
    enableSort: false,
    keyName: 'errors',
  },
  {
    label: 'SKU',
    order: 3,
    enableSort: true,
    keyName: 'payload.sku',
  },
  {
    label: 'Currency',
    order: 4,
    enableSort: true,
    keyName: 'payload.currency',
  },
  {
    label: 'Working',
    order: 5,
    enableSort: true,
    keyName: 'payload.working',
  },
  {
    label: 'Working Damaged',
    order: 6,
    enableSort: true,
    keyName: 'working_damaged',
  },
  {
    label: 'Not Working',
    order: 7,
    enableSort: true,
    keyName: 'payload.not_working',
  },
  {
    label: 'Not Working Damaged',
    order: 8,
    enableSort: true,
    keyName: 'payload.not_working_damaged',
  },
];

export const PRODUCT_UPLOAD_COLUMNS = [
  {
    label: 'Errors',
    order: 2,
    enableSort: false,
    keyName: 'errors',
  },
  {
    label: 'SKU',
    order: 3,
    enableSort: true,
    keyName: 'payload.sku',
  },
  {
    label: 'Brand',
    order: 4,
    enableSort: true,
    keyName: 'payload.brand',
  },
  {
    label: 'Product Name',
    order: 5,
    enableSort: true,
    keyName: 'payload.name',
  },
  {
    label: 'Product Type',
    order: 5,
    enableSort: true,
    keyName: 'payload.type',
  },
  {
    label: 'Variant Name',
    order: 6,
    enableSort: true,
    keyName: 'payload.variant_name',
  },
];

export const PRODUCT_UPLOAD_ATTRIBUTES_COLUMNS = [
  {
    label: 'Errors',
    order: 2,
    enableSort: false,
    keyName: 'errors',
  },
  {
    label: 'SKU',
    order: 3,
    enableSort: true,
    keyName: 'payload.sku',
  },
  {
    label: 'Attribute ID',
    order: 4,
    enableSort: true,
    keyName: 'payload.id',
  },
  {
    label: 'Attribute Name',
    order: 5,
    enableSort: true,
    keyName: 'payload.name',
  },
];

export const PRODUCT_UPLOAD_LOGS_COLUMNS = [
  {
    label: 'File Name',
    order: 2,
    enableSort: true,
    keyName: 'filename',
  },
  {
    label: 'S3 Link',
    order: 3,
    enableSort: true,
    keyName: 's3_link',
  },
  {
    label: 'Upload Status',
    order: 4,
    enableSort: true,
    keyName: 'status',
  },
  {
    label: 'Upload Type',
    order: 5,
    enableSort: true,
    keyName: 'type',
  },
  {
    label: 'Uploaded By',
    order: 6,
    enableSort: true,
    keyName: 'done_by',
  },
  {
    label: 'Uploaded Date',
    order: 7,
    enableSort: true,
    keyName: 'createdAt',
  },
];

export const ORDER_MANAGEMENT_COLUMNS = [
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Type',
    order: 3,
    enableSort: true,
    keyName: 'order_type',
  },
  {
    label: 'Credit Type',
    order: 4,
    enableSort: true,
    keyName: 'credit_type',
  },
  {
    label: 'Customer Name',
    order: 5,
    enableSort: true,
    keyName: 'user_id.first_name',
  },
  {
    label: 'Status',
    order: 6,
    enableSort: true,
    keyName: 'status',
  },
  {
    label: 'Payment Status',
    order: 7,
    enableSort: true,
    keyName: 'payment.payment_status',
  },
  {
    label: 'Order Count',
    order: 8,
    enableSort: false,
  },
  {
    label: 'Updated',
    order: 9,
    enableSort: true,
    keyName: 'updatedAt',
  },
];

export const DISCREPANCY_MANAGEMENT_COLUMNS = [
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Customer Name',
    order: 3,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Mobile Number',
    order: 4,
    enableSort: true,
    keyName: 'user_details.mobile_number',
  },
  {
    label: 'Email Address',
    order: 5,
    enableSort: true,
    keyName: 'user_details.email',
  },
  {
    label: 'Credit Timeframe',
    order: 6,
    enableSort: true,
    keyName: 'credit_type',
  },
  {
    label: 'Device',
    order: 7,
    enableSort: true,
    keyName: 'order_items.product_name',
  },
  {
    label: 'Original Offer',
    order: 8,
    enableSort: true,
    keyName: 'order_items.original_offer',
  },
  {
    label: 'IMEI/Serial',
    order: 9,
    enableSort: true,
    keyName: 'order_items.imei_serial',
  },
  {
    label: 'System Model',
    order: 9,
    enableSort: true,
    keyName: 'system_model',
  },
  {
    label: 'Storage',
    order: 10,
    enableSort: true,
    keyName: 'storage',
  },
  {
    label: 'Locked',
    order: 11,
    enableSort: true,
    keyName: 'locked',
  },
  {
    label: 'Grade',
    order: 12,
    enableSort: true,
    keyName: 'grade',
  },
  {
    label: 'Operations Comments',
    order: 13,
    enableSort: true,
    keyName: 'operations_comments',
  },
  {
    label: 'Instructions for CS',
    order: 14,
    enableSort: true,
    keyName: 'cs_instructions',
  },
  {
    label: 'Customer Contacted',
    order: 15,
    enableSort: true,
    keyName: 'cs_contacted',
  },
  {
    label: 'Date',
    order: 16,
    enableSort: true,
    keyName: 'cs_date',
  },
  {
    label: 'CS Comments',
    order: 17,
    enableSort: true,
    keyName: 'cs_comments',
  },
  {
    label: 'ZD Ticket Number',
    order: 18,
    enableSort: true,
    keyName: 'zd_ticket_number',
  },
  {
    label: 'Owner',
    order: 19,
    enableSort: true,
    keyName: 'owner',
  },
  {
    label: 'Actions for Ops',
    order: 20,
    enableSort: true,
    keyName: 'ops_action',
  },
  {
    label: 'Status',
    order: 21,
    enableSort: true,
    keyName: 'ops_status',
  },
];

export const USER_MANAGEMENT_COLUMNS = [
  {
    label: 'Role',
    order: 2,
    enableSort: true,
    keyName: 'role',
  },
  {
    label: 'First Name',
    order: 3,
    enableSort: true,
    keyName: 'first_name',
  },
  {
    label: 'Last Name',
    order: 4,
    enableSort: true,
    keyName: 'last_name',
  },
  {
    label: 'Email',
    order: 5,
    enableSort: true,
    keyName: 'email',
  },
  {
    label: 'Status',
    order: 6,
    enableSort: true,
    keyName: 'status',
  },
];

export const PROMOTIONS_MANAGEMENT_COLUMNS = [
  {
    label: 'Promotion Reference',
    order: 2,
    enableSort: true,
    keyName: 'promotion_reference',
  },
  {
    label: 'Name',
    order: 3,
    enableSort: true,
    keyName: 'name',
  },
  {
    label: 'Products',
    order: 4,
    enableSort: false,
  },
  {
    label: 'Promotion Start Date',
    order: 5,
    enableSort: true,
    keyName: 'start_date', 
  },
  {
    label: 'Promotion End Date',
    order: 6,
    enableSort: true,
    keyName: 'end_date',
  },
  {
    label: 'New Device Purchase Start Date',
    order: 7,
    enableSort: true,
    keyName: 'new_device_purchase_start_date',
  },
  {
    label: 'New Device Purchase End Date',
    order: 8,
    enableSort: true,
    keyName: 'new_device_purchase_end_date',
  },
  {
    label: 'Customer Register By Date',
    order: 9,
    enableSort: true,
    keyName: 'claim_deadline',
  },
  {
    label: 'Submit Trade-in By Date',
    order: 10,
    enableSort: true,
    keyName: 'send_in_deadline',
  },
  {
    label: 'Promotion Payment Due Date',
    order: 11,
    enableSort: true,
    keyName: 'payment_due_date',
  },
  {
    label: 'Status',
    order: 12,
    enableSort: true,
    keyName: 'promotion_status',
  },
];

export const PAYMENTS_MANAGEMENT_COLUMNS = [
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
  },
  {
    label: 'Name',
    order: 3,
    enableSort: true,
  },
  {
    label: 'Address',
    order: 4,
    enableSort: true,
  },
  {
    label: 'Contact',
    order: 5,
    enableSort: true,
  },
];

export const PROMOTION_CLAIMS_MANAGEMENT_COLUMNS = [
  {
    label: 'Claim Number',
    order: 2,
    enableSort: true,
    keyName: 'claim_number',
  },
  {
    label: 'Order Number',
    order: 3,
    enableSort: true,
    keyName: 'order_id.order_number',
  },
  {
    label: 'Promotion Name',
    order: 4,
    enableSort: true,
    keyName: 'promotion_id.name',
  },
  {
    label: 'Promotion Link',
    order: 5,
    enableSort: true,
    keyName: 'promotion_id.slug',
  },
  {
    label: 'Device Model',
    order: 6,
    enableSort: false,
    keyName: 'device_model',
  },
  {
    label: 'Receipt Number',
    order: 7,
    enableSort: true,
    keyName: 'receipt_number',
  },
  {
    label: 'Claimed By',
    order: 8,
    enableSort: true,
    keyName: 'user_id.first_name',
  },
  {
    label: 'Claimed Date',
    order: 9,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Claim Status',
    order: 10,
    enableSort: true,
    keyName: 'status',
  },
];

export const ACTIONABLES_MANAGEMENT_COLUMNS = [
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Device Number',
    order: 3,
    enableSort: true,
    keyName: 'order_items.line_item_number',
  },
  {
    label: 'Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Status',
    order: 5,
    enableSort: true,
    keyName: 'status',
  },
  {
    label: 'Product Name',
    order: 6,
    enableSort: true,
    keyName: 'order_items.product_name',
  },
  {
    label: 'Product Type',
    order: 7,
    enableSort: true,
    keyName: 'order_items.product_type',
  },
  {
    label: 'Created',
    order: 8,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Updated',
    order: 9,
    enableSort: true,
    keyName: 'updatedAt',
  },
];

export const UNSENT_DEVICES_MANAGEMENT_COLUMNS = [
  {
    label: 'Order ID',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Order Type',
    order: 4,
    enableSort: true,
    keyName: 'order_type',
  },
  {
    label: 'Customer Name',
    order: 5,
    enableSort: true,
    keyName: 'user_id.first_name',
  },
  {
    label: 'Devices Awaiting',
    order: 6,
    enableSort: true,
    keyName: 'revisedDevices',
  },
];

export const UNSENT_DEVICES_TABLE_COLUMNS = [
  {
    label: 'Device ID',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Device Name',
    order: 3,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'IMEI/Serial',
    order: 4,
    enableSort: true,
    keyName: 'order_type',
  },
  {
    label: 'Extension Date',
    order: 5,
    enableSort: true,
    keyName: 'send_in_deadline_date',
  },
  {
    label: 'Actions',
    order: 6,
    keyName: 'isExtended',
  },
];

export const REVISED_DEVICES_MANAGEMENT_COLUMNS = [
  {
    label: 'Order ID',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Order Type',
    order: 4,
    enableSort: true,
    keyName: 'order_type',
  },
  {
    label: 'Customer Name',
    order: 5,
    enableSort: true,
    keyName: 'user_id.first_name',
  },
  {
    label: 'Devices Revised',
    order: 6,
    enableSort: true,
    keyName: 'revisedDevices',
  },
];

export const REVISED_DEVICES_TABLE_COLUMNS = [
  {
    label: 'Device ID',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Provided Device Details',
    order: 3,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Condition Assessment',
    order: 4,
    enableSort: true,
    keyName: 'order_type',
  },
  {
    label: 'IMEI/Serial',
    order: 5,
    enableSort: true,
    keyName: 'send_in_deadline_date',
  },
  {
    label: 'Quote',
    order: 6,
    enableSort: true,
    keyName: 'send_in_deadline_date',
  },
  {
    label: 'Moorup Assessment',
    order: 7,
    enableSort: true,
    keyName: 'send_in_deadline_date',
  },
  {
    label: 'Revised Condition Assessment',
    order: 8,
    keyName: 'isExtended',
  },
  {
    label: 'Condition Notes (Reason)',
    order: 9,
    keyName: 'isExtended',
  },
  {
    label: 'Revised IMEI/Serial',
    order: 10,
    keyName: 'isExtended',
  },
  {
    label: 'Revised Quote',
    order: 11,
    keyName: 'isExtended',
  },
  {
    label: 'Actions',
    order: 12,
    keyName: 'isExtended',
  },
];

export const PROMOTION_CLAIMS_PAYMENT_MANAGEMENT_COLUMNS = [
  {
    label: 'Claim Number',
    order: 2,
    enableSort: true,
    keyName: 'order_id.claim_number',
  },
  {
    label: 'Order Number',
    order: 3,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Promotion Name',
    order: 4,
    enableSort: true,
    keyName: 'promotion_id.name',
  },
  {
    label: 'Claim Amount',
    order: 5,
    enableSort: true,
    keyName: 'amount',
  },
  {
    label: 'Claim Status',
    order: 6,
    enableSort: true,
    keyName: 'status',
  },
  {
    label: 'Claimed Date',
    order: 12,
    enableSort: true,
    keyName: 'createdAt',
  },
];

export const TEMPLATE_APPROVALS_COLUMNS = [
  {
    label: 'Template Name',
    order: 2,
    enableSort: true,
    keyName: 'current.template_name',
  },
  {
    label: 'Requested By',
    order: 3,
    enableSort: true,
    keyName: 'admin_id.first_name',
  },
  {
    label: 'Status',
    order: 4,
    enableSort: true,
    keyName: 'status',
  },
  {
    label: 'Created',
    order: 5,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Updated',
    order: 6,
    enableSort: true,
    keyName: 'updatedAt',
  },
];

export const ACTIONS_COLUMN = [
  {
    label: 'Actions',
    order: 99,
    enableSort: false,
    keyName: '',
  },
];

export const ORDER_PAYMENTS_MANAGEMENT_COLUMNS = [
  {
    label: 'Device ID',
    order: 2,
    enableSort: true,
    keyName: 'deviceId',
  },
  {
    label: 'Customer Name',
    order: 3,
    enableSort: true,
    keyName: 'customerName',
  },
  {
    label: 'Customer Email Address',
    order: 4,
    enableSort: true,
    keyName: 'customerEmailAddress',
  },
  {
    label: 'Evaluated Date',
    order: 5,
    enableSort: true,
    keyName: 'updatedAt',
  },
  {
    label: 'Quoted Amount',
    order: 6,
    enableSort: true,
    keyName: 'paymentAmount',
  },
  {
    label: 'Payment Type',
    order: 7,
    enableSort: true,
    keyName: 'paymentType',
  },
  // {
  //   label: 'Payment Reference',
  //   order: 8,
  //   enableSort: true,
  //   keyName: 'paymentReference',
  // }
];

export const ORDER_LOGS_COLUMNS = [
  {
    label: 'Timestamp',
    order: 2,
    enableSort: true,
    keyName: 'timestamp',
  },
  {
    label: 'Description',
    order: 3,
    enableSort: true,
    keyName: 'description',
  },
  {
    label: 'Initiated By',
    order: 4,
    enableSort: true,
    keyName: 'triggered_by',
  },
  {
    label: 'Status',
    order: 5,
    enableSort: true,
    keyName: 'status',
  },
];

export const ORDER_NOTES_COLUMNS = [
  {
    label: 'Timestamp',
    order: 2,
    enableSort: true,
    keyName: 'createdAt',
  },
  {
    label: 'Note',
    order: 3,
    enableSort: true,
    keyName: 'note',
  },
  {
    label: 'Author',
    order: 4,
    enableSort: true,
    keyName: 'createdBy.first_name',
  },
];

export const ORDER_PAYMENT_FLAT_FILE_DETAILS_COLUMNS = [
  {
    label: 'Errors',
    order: 2,
    enableSort: false,
    keyName: 'errors',
  },
  {
    label: 'Device ID',
    order: 3,
    enableSort: true,
    keyName: 'payload.deviceId',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'payload.customerName',
  },
  {
    label: 'Customer Email Address',
    order: 5,
    enableSort: true,
    keyName: 'payload.customerEmailAddress',
  },
  {
    label: 'Evaluated Date',
    order: 6,
    enableSort: true,
    keyName: 'payload.updatedAt',
  },
  {
    label: 'Payment Amount',
    order: 7,
    enableSort: true,
    keyName: 'payload.paymentAmount',
  },
  {
    label: 'Payment Type',
    order: 8,
    enableSort: true,
    keyName: 'payload.paymentType',
  },
  {
    label: 'Payment Reference',
    order: 8,
    enableSort: true,
    keyName: 'payload.paymentReference',
  },
];

export const ACTIONABLES_LOCKED_DEVICES_CURRENT_LOCK_COLUMNS = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_item.line_item_number',
  },
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'order_item.createdAt',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Lock Type',
    order: 5,
    enableSort: true,
    keyName: 'order_item.lock.type',
  },
  {
    label: 'Prior Lock Check',
    order: 6,
    enableSort: false,
    keyName: 'order_item.lock',
  },
  {
    label: 'Retest Count',
    order: 7,
    enableSort: true,
    keyName: 'order_item.lock.retestCount',
  },
];

export const ACTIONABLES_LOCKED_DEVICES_FOR_RETEST_COLUMNS = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_item.line_item_number',
  },
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'order_item.createdAt',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Lock Type',
    order: 5,
    enableSort: true,
    keyName: 'order_item.lock.type',
  },
  {
    label: 'Prior Lock Check',
    order: 6,
    enableSort: false,
    keyName: 'order_item.lock',
  },
  {
    label: 'Retest Count',
    order: 7,
    enableSort: true,
    keyName: 'order_item.lock.retestCount',
  },
];

export const ACTIONABLES_DEVICES_FOR_RETURN_COLUMNS = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_items.line_item_number',
  },
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'order_items.createdAt',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Payment Type',
    order: 5,
    enableSort: true,
    keyName: 'credit_type',
  },
  {
    label: 'Payment Status',
    order: 6,
    enableSort: true,
    keyName: 'order_items.payment.status',
  },
  // {
  //   label: 'Shipping ID',
  //   order: 7,
  //   enableSort: true,
  //   keyName: 'shipping_details._id',
  // },
];

export const ACTIONABLES_DEVICES_FOR_RECYCLE_COLUMNS = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_items.line_item_number',
  },
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'order_items.createdAt',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Payment Type',
    order: 5,
    enableSort: true,
    keyName: 'credit_type',
  },
  {
    label: 'Payment Status',
    order: 6,
    enableSort: true,
    keyName: 'order_items.payment.status',
  },
];

export const ACTIONABLES_DEVICE_CREDIT_CHARGE_NEEDED = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_items.line_item_number',
  },
  {
    label: 'Order Number',
    order: 2,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 3,
    enableSort: true,
    keyName: 'order_items.createdAt',
  },
  {
    label: 'Customer Name',
    order: 4,
    enableSort: true,
    keyName: 'user_details.first_name',
  },
  {
    label: 'Initial Device Value',
    order: 5,
    enableSort: true,
    keyName: 'order_items.original_offer',
  },
  {
    label: 'Charge Amount',
    order: 6,
    enableSort: false,
    keyName: 'amount',
  },
  {
    label: 'Payment Status',
    order: 7,
    enableSort: false,
    keyName: 'order_items.payments.status',
  },
  // {
  //   label: 'Remarks',
  //   order: 8,
  //   enableSort: true,
  //   keyName: 'order_items.payment.remarks',
  // },
];

export const ACTIONABLES_DEVICES_TAKEN_FOR_INVENTORY_COLUMNS = [
  {
    label: 'Device ID',
    order: 1,
    enableSort: true,
    keyName: 'order_items.line_item_number',
  },
  {
    label: 'Device Status',
    order: 2,
    keyName: 'order_items.status',
  },
  {
    label: 'Device Model',
    order: 3,
    enableSort: true,
    keyName: 'order_items.product_name',
  },
  {
    label: 'Order Number',
    order: 4,
    enableSort: true,
    keyName: 'order_number',
  },
  {
    label: 'Order Date',
    order: 5,
    enableSort: true,
    keyName: 'order_items.createdAt',
  },
  {
    label: 'Customer Name',
    order: 6,
    enableSort: true,
    keyName: 'user_details.first_name',
  }
];
