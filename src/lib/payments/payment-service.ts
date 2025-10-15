import { db } from "~/server/db";
import { PaymentProviderFactory } from "./payment-provider";
import { StripePaymentProvider } from "./stripe-provider";
import { PayPalPaymentProvider } from "./paypal-provider";

// Register payment providers
PaymentProviderFactory.register(new StripePaymentProvider());
PaymentProviderFactory.register(new PayPalPaymentProvider());

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  popular?: boolean;
  savings?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: 999, // $9.99
  },
  {
    id: "creator",
    name: "Creator",
    credits: 50,
    price: 3999, // $39.99
    popular: true,
    savings: "Save 20%",
  },
  {
    id: "agency",
    name: "Agency",
    credits: 200,
    price: 12999, // $129.99
    savings: "Save 35%",
  },
];

export class PaymentService {
  /**
   * Create a checkout session for purchasing credits
   */
  static async createCheckoutSession(
    userId: string,
    email: string,
    packageId: string,
    provider: string = "stripe"
  ) {
    const creditPackage = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!creditPackage) {
      throw new Error("Invalid package ID");
    }

    const paymentProvider = PaymentProviderFactory.get(provider);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await paymentProvider.createCheckoutSession({
      userId,
      email,
      amount: creditPackage.price,
      credits: creditPackage.credits,
      successUrl: `${baseUrl}/dashboard?payment=success`,
      cancelUrl: `${baseUrl}/dashboard?payment=cancelled`,
      metadata: {
        packageId: creditPackage.id,
        packageName: creditPackage.name,
      },
    });

    return session;
  }

  /**
   * Process a successful payment and add credits to user
   */
  static async processPayment(
    userId: string,
    credits: number,
    amount: number,
    transactionId: string,
    provider: string
  ) {
    // Add credits to user
    await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: credits,
        },
      },
    });

    // Record transaction
    await db.transaction.create({
      data: {
        userId,
        type: "purchase",
        amount: credits,
        description: `Purchased ${credits} credits via ${provider}`,
        metadata: {
          transactionId,
          provider,
          amountPaid: amount,
        },
      },
    });

    return { success: true, credits };
  }

  /**
   * Deduct credits from user for video processing
   */
  static async deductCredits(userId: string, credits: number, reason: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < credits) {
      throw new Error("Insufficient credits");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: credits,
        },
      },
    });

    await db.transaction.create({
      data: {
        userId,
        type: "usage",
        amount: -credits,
        description: reason,
      },
    });

    return { success: true, remainingCredits: user.credits - credits };
  }

  /**
   * Get user's credit balance and transaction history
   */
  static async getUserCredits(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      credits: user?.credits || 0,
      transactions,
    };
  }
}

