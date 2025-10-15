import { NextRequest, NextResponse } from "next/server";
import { PaymentProviderFactory } from "~/lib/payments/payment-provider";
import { PaymentService } from "~/lib/payments/payment-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const stripeProvider = PaymentProviderFactory.get("stripe");
    const event = await stripeProvider.verifyWebhook(body, signature);

    if (event.type === "payment.success") {
      await PaymentService.processPayment(
        event.userId,
        event.credits,
        event.amount,
        event.transactionId,
        "stripe"
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

