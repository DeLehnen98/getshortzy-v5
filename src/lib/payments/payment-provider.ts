/**
 * Payment Provider Abstraction Layer
 * Supports multiple payment providers (Stripe, PayPal, etc.)
 */

export interface PaymentProvider {
  name: string;
  createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSession>;
  verifyWebhook(payload: any, signature: string): Promise<WebhookEvent>;
  getCustomer(customerId: string): Promise<Customer>;
}

export interface CheckoutSessionOptions {
  userId: string;
  email: string;
  amount: number; // in cents
  credits: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  provider: string;
}

export interface WebhookEvent {
  type: string;
  userId: string;
  amount: number;
  credits: number;
  transactionId: string;
  metadata?: Record<string, any>;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
}

export class PaymentProviderFactory {
  private static providers: Map<string, PaymentProvider> = new Map();

  static register(provider: PaymentProvider) {
    this.providers.set(provider.name, provider);
  }

  static get(name: string): PaymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Payment provider "${name}" not found`);
    }
    return provider;
  }

  static getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  static getAvailable(): string[] {
    return Array.from(this.providers.keys());
  }
}

