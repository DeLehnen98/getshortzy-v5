import Stripe from "stripe";
import type {
  PaymentProvider,
  CheckoutSessionOptions,
  CheckoutSession,
  WebhookEvent,
  Customer,
} from "./payment-provider";

export class StripePaymentProvider implements PaymentProvider {
  name = "stripe";
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: "2025-09-30.clover",
    });
  }

  async createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: options.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${options.credits} Credits`,
              description: `GetShortzy video processing credits`,
            },
            unit_amount: options.amount,
          },
          quantity: 1,
        },
      ],
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: {
        userId: options.userId,
        credits: options.credits.toString(),
        ...options.metadata,
      },
    });

    return {
      id: session.id,
      url: session.url!,
      provider: this.name,
    };
  }

  async verifyWebhook(payload: any, signature: string): Promise<WebhookEvent> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    if (event.type !== "checkout.session.completed") {
      throw new Error(`Unsupported event type: ${event.type}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    return {
      type: "payment.success",
      userId: session.metadata!.userId!,
      amount: session.amount_total || 0,
      credits: parseInt(session.metadata!.credits || "0"),
      transactionId: session.id,
      metadata: session.metadata || undefined,
    };
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      throw new Error("Customer has been deleted");
    }

    return {
      id: customer.id,
      email: customer.email || "",
      name: customer.name || undefined,
    };
  }
}

