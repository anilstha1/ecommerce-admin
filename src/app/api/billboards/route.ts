import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {label, imageUrl} = body;

    if (!label) {
      return new NextResponse("Label is required", {status: 400});
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", {status: 400});
    }

    const user = await auth();
    if (!user.userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const billboard = await prisma.billboard.create({
      data: {
        userId: user.userId,
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Error in adding billboard", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {label, imageUrl} = body;

    if (!label) {
      return new NextResponse("Label is required", {status: 400});
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", {status: 400});
    }

    const user = await auth();
    if (!user.userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const billboard = await prisma.billboard.update({
      where: {
        id: body.id,
      },
      data: {
        userId: user.userId,
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Error in adding billboard", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const {id} = body;

    if (!id) {
      return new NextResponse("Billboard ID is required", {status: 400});
    }

    const user = await auth();
    if (!user.userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const billboard = await prisma.billboard.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Error in deleting billboard", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
