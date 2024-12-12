/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PromotionDetailsInterface {
  platform: string
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  image_url: string
  eligibility: PromotionEligibilityInterface
  steps: PromotionStepsInterface[]
  claims: PromotionClaimsInterface
  conditions: PromotionConditions
}

export interface PromotionEligibilityInterface {
  title: string
  faq: FaqInterface[]
}

export interface FaqInterface {
  title: string
  content: any
}

export interface PromotionStepsInterface {
  order: number
  title: string
  description: string
}

export interface PromotionClaimsInterface {
  title: string
  description: string
  disclaimer: string
  products: PromotionProductInterface[]
}

export interface PromotionProductInterface {
  product_name: string
  amount: number
  currency: string
}

export interface PromotionConditions {
  title: string
  items: PromotionConditionItemInterface[]
}

export interface PromotionConditionItemInterface {
  order: number
  description: string
}

export interface PlatformType {
  [key: string]: any;
}

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  onChange: (value: string) => void;
  label: string;
  defaultValue: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
}

export interface PromotionClaimsExportData {
  _id: string;
  claim_number: string;
  platform: string;
  order_id: {
    _id: string;
    order_number: string;
    order_items: {
      line_item_number: string;
      original_offer: number;
      sku: string;
      status: string;
    }[];
    status: string;
    createdAt: string;
  };
  promotion_id: {
    name: string;
  } | null;
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
  };
  receipt_number: string;
  status: string;
  moorup_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedDaysFilter {
  value: '2' | '4' | '6' | '7';
  label: string;
}
