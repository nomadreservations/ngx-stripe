import { Error } from './utils';
import { BillingDetails } from './token';
import { Element } from './element';

export interface PaymentMethodParams {
  type: 'card' | 'ideal' | 'sepa_debit';
  card: Element;
  billing_details: BillingDetails;
}

export interface PaymentMethodResult {
  error: Error;
  paymentMethod: PaymentMethodData;
}

export interface PaymentMethodData {
  id: string;
  object: string;
  billing_details: BillingDetails;
  card: {
    brand: 'amex' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'visa' | 'unknown';
    checks: {
        address_line1_check: string;
        address_postal_code_check: string;
        cvc_check: string;
    }
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    generated_from: any;
    last4: string;
    three_d_secure_usage: {
        supported: boolean;
    }
    wallet: any;
  };
  card_present: any;
  customer: string;
  ideal: {
      bank: string;
      bic: string;
  };
  livemode: boolean;
  metadata: any;
  sepa_debit: {
      bank_code: string;
      branch_code: string;
      country: string;
      fingerprint: string;
      last4: string;
  }
}
