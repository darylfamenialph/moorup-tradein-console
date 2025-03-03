import { FollowUpDaysFilter, OrderFilter } from './enums';

export const PROMOTION_CLAIMS_TABS = [
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
  { label: 'Test', value: 'test claim' },
];

export const ACTIONABLES_DEVICES_WITH_BOX_TABS = [
  { label: 'To Print', value: 'to-print' },
  { label: 'Prior Print', value: 'prior-print' },
];

export const ACTIONABLES_FOLLOW_UP_DEVICES_TABS = [
  { label: 'No Filter', value: '' },
  { label: '1-2 Days', value: FollowUpDaysFilter.TWO },
  { label: '3-4 Days', value: FollowUpDaysFilter.FOUR },
  { label: '5-6 Days', value: FollowUpDaysFilter.SIX },
  { label: '7+ Days', value: FollowUpDaysFilter.SEVEN },
];

export const ORDER_FILTERS_TABS = [
  { label: 'All', value: OrderFilter.ALL },
  { label: 'Live', value: OrderFilter.LIVE },
  { label: 'Test', value: OrderFilter.TEST },
];
