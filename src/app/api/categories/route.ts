import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {name, billboardId} = body;
    const user = await auth();

    if (!name) {
      return new NextResponse("Name is required", {status: 400});
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", {status: 400});
    }

    if (!user.userId) {
      return new NextResponse("unauthorized", {status: 400});
    }

    const category = await prisma.category.create({
      data: {
        userId: user.userId,
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
