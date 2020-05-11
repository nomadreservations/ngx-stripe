import { Error } from './utils';
import { PaymentMethodParams } from './payment-method';

export interface Token {
  id: string;
  object: 'token';
  bank_account?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'bank_account';
    account_holder_name: string;
    account_holder_type: 'individual' | 'company';
    bank_name: string;
    last4: string;
    routing_number: string;
    status: 'new' | 'validated' | 'verified' | 'verification_failded' | 'errored';
  };
  card?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'card';
    address_city: string;
    address_country: string;
    address_line1: string;
    address_line1_check: FieldCheck;
    address_line2: string;
    address_state: string;
    address_zip: string;
    address_zip_check: FieldCheck;
    brand: string;
    cvc_check: FieldCheck;
    dynamic_last4: string;
    exp_month: number;
    exp_year: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    last4: string;
    metadata: { [key: string]: any };
    name: string;
    tokenization_method: 'apple_pay' | 'android_pay';
  };
  client_ip: string;
  livemode: boolean;
  type: 'card' | 'bank_account';
  used: boolean;
}

export type FieldCheck = 'pass' | 'fail' | 'unavailable' | 'unchecked';

export interface CardDataOptions {
  name?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  currency?: string;
}

export interface TokenResult {
  token?: Token;
  error?: Error;
}

export type BankAccount = 'bank_account';

export interface BankAccountData {
  country: string;
  currency: string;
  routing_number: string;
  account_number: string;
  account_holder_name: string;
  account_holder_type: 'individual' | 'company';
}

export type Pii = 'pii';

export interface PiiData {
  personal_id_number: string;
}

export function isBankAccount(account: any): account is BankAccount {
  return account === 'bank_account';
}

export function isBankAccountData(bankAccountData: any): bankAccountData is BankAccountData {
  return (
    'country' in bankAccountData &&
    'currency' in bankAccountData &&
    'routing_number' in bankAccountData &&
    'account_number' in bankAccountData &&
    'account_holder_name' in bankAccountData &&
    'account_holder_type' in bankAccountData &&
    (bankAccountData.account_holder_type === 'individual' || bankAccountData.account_holder_type === 'company')
  );
}

export function isPii(pii: any): pii is Pii {
  return pii === 'pii';
}

export function isPiiData(piiData: any): piiData is PiiData {
  return 'personal_id_number' in piiData;
}

export interface SetupIntent {
  id: string;
  object: 'setup_intent';
  application?: string;
  cancellation_reason?: 'abandoned' | 'requested_by_customer' | 'duplicate';
  client_secret?: string;
  created: number;
  customer?: string;
  description?: string;
  last_setup_error?: Error;
  livemode: boolean;
  metadata: { [key: string]: any };
  next_action: {
    type: 'redirect_to_url' | 'use_stripe_sdk';
    redirect_to_url?: {
      return_url: string;
      url: string;
    };
    use_stripe_sdk: { [key: string]: any };
  };
  on_behalf_of?: string;
  payment_method?: string;
  payment_method_options?: { [key: string]: any };
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'canceled'
    | 'succeeded';
  usage: 'on_session' | 'off_session';
}

export interface SetupIntentResult {
  setupIntent?: SetupIntent;
  error?: Error;
}

export interface SetupIntentData {
  payment_method_data?: {
    billing_details?: BillingDetails;
  };
}

export interface BillingDetails {
  address?: Address;
  email?: string;
  name?: string;
  phone?: string;
}

export interface ConfirmIntentData {
  payment_method_data?: {
    billing_details?: BillingDetails;
    return_url?: string;
    shipping?: Shipping;
    save_payment_method?: boolean;
    setup_future_usage?: string;
  };
}

export interface Shipping {
  address: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  name: string;
  carrier?: string;
  phone?: string;
  tracking_number?: string;
}

export interface ConfirmSetupIntentData {
  payment_method_data?: {
    billing_details?: BillingDetails;
    return_url?: string;
  };
}

export interface Address {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface ShippingOptions {
  id: string;
  label: string;
  detail: string;
  amount: number;
}

export interface ShippingAddress {
  country?: string;
  addressLine?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  recipient?: string;
  phone?: string;
  sortingCode?: string;
  dependentLocality?: string;
}

export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application?: string;
  application_fee_ammount?: number;
  canceled_at?: number;
  cancellation_reason?: 'abandoned' | 'requested_by_customer' | 'duplicate';
  cancelled_method?: 'automatic' | 'manual';
  capture_method?: 'automatic' | 'manual';
  charges?: Array<{
    object: 'list';
    data: Array<any>;
    has_more: boolean;
    url: string;
  }>;
  client_secret?: string;
  confirmation_method?: 'automatic' | 'manual';
  create: number;
  currency?: string;
  customer?: any;
  description?: string;
  invoice?: string;
  last_payment_error?: any;
  livemode: boolean;
  metadata?: any;
  next_action?: any;
  on_behalf_of?: string;
  payment_method?: string;
  payment_method_options?: any;
  payment_method_types?: Array<string>;
  receipt_email?: string;
  review?: string;
  setup_feture_usage?: string;
  shipping?: Shipping;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded';
  transfer_data?: any;
  transfer_group?: string;
}

export interface PaymentIntentResult {
  paymentIntent?: PaymentIntent;
  error?: Error;
}

export interface CardPaymentData {
  payment_method_data?: {
    billing_details?: BillingDetails;
  };
  shipping?: Shipping;
  receipt_email?: string;
  save_payment_method?: boolean;
  setup_future_usage?: string;
}

export interface ConfirmCardPaymentData {
  payment_method?: PaymentMethodParams | string;
  shipping?: Shipping;
  return_url?: string;
  receipt_email?: string;
  save_payment_method?: boolean;
  setup_future_usage?: boolean;
}

export interface ConfirmCardPaymentOptions {
  handleActions?: boolean;
}

export interface ConfirmCardPaymentResult {
  paymentIntent?: PaymentIntent;
  error?: Error;
}
