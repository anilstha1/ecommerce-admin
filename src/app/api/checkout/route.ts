import Stripe from "stripe";
import {NextResponse} from "next/server";

import {stripe} from "@/lib/stripe";
import prisma from "@/lib/db";
import {Product} from "@/generated/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, {headers: corsHeaders});
}

export async function POST(req: Request) {
  try {
    const {productIds} = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids is required", {status: 400});
    }

    const products: Product[] = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images,
          },
          unit_amount: product.price * 100,
        },
      });
    });

    const order = await prisma.order.create({
      data: {
        status: "pending",
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      {url: session.url},
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log("[CHECKOUT_POST]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
