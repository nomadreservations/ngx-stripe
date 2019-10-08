import { Shipping, ShippingOptions } from './token';

export interface Element {
  mount(el: HTMLElement | string): void;
  on(ev: ElementEventType, handler: (ev?: any) => void): void;
  blur(): void;
  clear(): void;
  focus(): void;
  unmount(): void;
  update(options: ElementOptions): void;
}

export type ElementEventType = 'blur' | 'change' | 'click' | 'focus' | 'ready';

export type ElementType = 'card' | 'cardNumber' | 'cardExpiry' | 'cardCvc' | 'postalCode' | 'paymentRequestButton';

export interface ElementOptions {
  style?: {
    base?: ElementStyleAttributes;
    complete?: ElementStyleAttributes;
    empty?: ElementStyleAttributes;
    invalid?: ElementStyleAttributes;
  };
  paymentRequest?: any;
  hidePostalCode?: boolean;
  hideIcon?: boolean;
  iconStyle?: 'solid' | 'default';
  placeholder?: string;
  value?: string | object;
}

export interface Style {}

export interface RequestElementOptions {
  country: string;
  currency: string;
  total: {
    amount: number;
    label: string;
    pending?: boolean;
  };
  displayItems?: Array<{
    amount: number;
    label: string;
    pending?: boolean;
  }>;
  requestPayerName?: boolean;
  requestPayerEmail?: boolean;
  requestPayerPhone?: boolean;
  requestShipping?: boolean;
  shippingOptions?: Array<Shipping>;
}

export interface PaymentRequestButtonStyle {
  type?: 'default' | 'donate' | 'buy'; // default: 'default'
  theme?: 'dark' | 'light' | 'light-outline'; // default: 'dark'
  height?: string;
}

export interface ElementStyleAttributes {
  color?: any;
  fontFamily?: any;
  fontSize?: any;
  fontSmoothing?: any;
  fontStyle?: any;
  fontWeight?: any;
  fontVariant?: any;
  iconColor?: any;
  lineHeight?: any;
  letterSpacing?: any;
  textDecoration?: any;
  textShadow?: any;
  textTransform?: any;
  ':hover'?: any;
  ':focus'?: any;
  '::placeholder'?: any;
  '::selection'?: any;
  ':-webkit-autofill'?: any;
}

export interface UpdateDetails {
  status: 'success' | 'fail' | 'invalid_shipping_address';
  total?: { amount: number; label: string; pending?: boolean };
  displayItems?: Array<{ amount: number; label: string; pending?: boolean }>;
  shippingOptions?: Array<ShippingOptions>;
}
