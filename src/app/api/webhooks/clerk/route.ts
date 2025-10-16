import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Check if user already exists (idempotency)
      const existingUser = await db.user.findUnique({
        where: { clerkId: id },
      });

      if (existingUser) {
        console.log(`User already exists: ${id}`);
        return new Response('User already exists', { status: 200 });
      }

      // Create user with transaction for atomicity
      await db.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            clerkId: id,
            email: email_addresses[0]?.email_address ?? `${id}@temp.com`,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
            imageUrl: image_url,
            credits: 3, // Free credits on signup
          },
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: user.id,
            type: 'credit',
            amount: 3,
            description: 'Welcome bonus - Free credits',
            status: 'completed',
          },
        });

        console.log(`User created successfully: ${id}`);
        console.log(`Granted 3 free credits to user: ${user.email}`);
      });
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error details:', {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await db.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0]?.email_address ?? `${id}@temp.com`,
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await db.user.delete({
      where: { clerkId: id! },
    });
  }

  return new Response("", { status: 200 });
}

