import Stripe from "stripe";
import {headers} from "next/headers";
import {NextResponse} from "next/server";

import {stripe} from "@/lib/stripe";
import {prisma} from "@/lib/db";

export async function POST(req: Request) {
  console.log("api webhook called");
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    return new NextResponse("Webhook Error", {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const order = await prisma.order.update({
      where: {
        id: session.metadata?.orderId,
      },
      data: {
        status: "completed",
      },
    });
  }

  return new NextResponse(null, {status: 200});
}
