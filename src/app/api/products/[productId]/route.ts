import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  {params}: {params: {productId: string}}
) {
  try {
    const {productId} = params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", {status: 404});
    }
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function PUT(
  req: Request,
  {params}: {params: {productId: string}}
) {
  try {
    const body = await req.json();
    const {productId} = params;
    const {
      name,
      price,
      categoryId,
      images,
      description,
      isFeatured,
      isArchived,
      colors,
      sizes,
    } = body;
    const user = await auth();

    if (!name || !price || !categoryId) {
      return new NextResponse("Missing required fields", {status: 400});
    }

    if (!user.userId) {
      return new NextResponse("unauthorized", {status: 400});
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        images,
        description,
        isFeatured,
        isArchived,
        colors: colors || [],
        sizes: sizes || [],
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_PUT]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function DELETE(
  req: Request,
  {params}: {params: {productId: string}}
) {
  try {
    const {productId} = params;
    const user = await auth();

    if (!productId) {
      return new NextResponse("ID is required", {status: 400});
    }

    if (!user.userId) {
      return new NextResponse("unauthorized", {status: 400});
    }

    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
