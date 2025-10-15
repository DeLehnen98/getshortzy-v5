import type {
  PaymentProvider,
  CheckoutSessionOptions,
  CheckoutSession,
  WebhookEvent,
  Customer,
} from "./payment-provider";

export class PayPalPaymentProvider implements PaymentProvider {
  name = "paypal";
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || "";
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    if (!this.clientId || !this.clientSecret) {
      console.warn("PayPal credentials not set, provider will not work");
    }
  }

  async createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<CheckoutSession> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (options.amount / 100).toFixed(2),
            },
            description: `${options.credits} GetShortzy Credits`,
            custom_id: options.userId,
          },
        ],
        application_context: {
          return_url: options.successUrl,
          cancel_url: options.cancelUrl,
          user_action: "PAY_NOW",
        },
      }),
    });

    const data = await response.json();

    const approveLink = data.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    return {
      id: data.id,
      url: approveLink,
      provider: this.name,
    };
  }

  async verifyWebhook(payload: any, signature: string): Promise<WebhookEvent> {
    // PayPal webhook verification
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      throw new Error("PAYPAL_WEBHOOK_ID is not set");
    }

    const accessToken = await this.getAccessToken();

    const verifyResponse = await fetch(
      `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: signature,
          transmission_time: payload.create_time,
          cert_url: payload.cert_url,
          auth_algo: "SHA256withRSA",
          transmission_sig: signature,
          webhook_id: webhookId,
          webhook_event: payload,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.verification_status !== "SUCCESS") {
      throw new Error("Webhook verification failed");
    }

    const order = payload.resource;

    return {
      type: "payment.success",
      userId: order.custom_id,
      amount: parseFloat(order.amount.value) * 100,
      credits: parseInt(order.description.match(/\d+/)?.[0] || "0"),
      transactionId: order.id,
      metadata: {},
    };
  }

  async getCustomer(customerId: string): Promise<Customer> {
    // PayPal doesn't have a direct customer concept like Stripe
    // This would need to be implemented based on your needs
    throw new Error("PayPal getCustomer not implemented");
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  }
}

