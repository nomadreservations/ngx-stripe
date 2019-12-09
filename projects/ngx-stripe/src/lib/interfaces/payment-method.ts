import { Error } from './utils';
import { BillingDetails } from './token';
import { Element } from './element';

export interface PaymentMethodParams {
  type: 'card' | 'ideal' | 'sepa_debit';
  card: Element;
  billing_details: BillingDetails;
  ideal?: {
    bank?: string;
  };
  metadata?: { [key: string]: any };
  sepa_debit?: {
    iban: string
  };
}

export interface PaymentMethodResult {
  error: Error;
  paymentMethod: PaymentMethodData;
}

export interface PaymentMethodData {
  id: string;
  object: 'payment_method';
  billing_details: BillingDetails;
  card: {
    brand: 'amex' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'visa' | 'unknown';
    checks: {
        address_line1_check: 'pass' | 'fail' | 'unavailable' | 'unchecked';
        address_postal_code_check: 'pass' | 'fail' | 'unavailable' | 'unchecked';
        cvc_check: 'pass' | 'fail' | 'unavailable' | 'unchecked';
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    generated_from: {
      charge: string;
      payment_method_details: any;
    };
    last4: string;
    three_d_secure_usage: {
        supported: boolean;
    };
    wallet: any;
  };
  card_present: any;
  created: number;
  customer: string;
  ideal: {
      bank: 'abn_amro' | 'asn_bank' | 'bunq' | 'handelsbaknken' | 'ing' | 'knab' | 'moneyou' | 'rabobank' | 'regiobank' | 'sns_bank' | 'triodos_bank' | 'van_lanschot';
      bic: string;
  };
  livemode: boolean;
  metadata: { [key: string]: any };
  sepa_debit: {
      bank_code: string;
      branch_code: string;
      country: string;
      fingerprint: string;
      last4: string;
  };
  type: 'card' | 'ideal' | 'sepa_debit';
}
