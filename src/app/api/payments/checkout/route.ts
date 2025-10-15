import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PaymentService } from "~/lib/payments/payment-service";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { packageId, provider = "stripe" } = await req.json();

    // Get user email
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const session = await PaymentService.createCheckoutSession(
      user.id,
      user.email,
      packageId,
      provider
    );

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

