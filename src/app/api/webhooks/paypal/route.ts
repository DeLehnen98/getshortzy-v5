import { NextRequest, NextResponse } from "next/server";
import { PaymentProviderFactory } from "~/lib/payments/payment-provider";
import { PaymentService } from "~/lib/payments/payment-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("paypal-transmission-sig") || "";

    const paypalProvider = PaymentProviderFactory.get("paypal");
    const event = await paypalProvider.verifyWebhook(body, signature);

    if (event.type === "payment.success") {
      await PaymentService.processPayment(
        event.userId,
        event.credits,
        event.amount,
        event.transactionId,
        "paypal"
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

