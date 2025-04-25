import {NextResponse} from "next/server";
import {prisma} from "@/lib/db";

export async function GET(
  req: Request,
  {params}: {params: {categoryId: string}}
) {
  try {
    const {categoryId} = params;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", {status: 404});
    }
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function PUT(
  req: Request,
  {params}: {params: {categoryId: string}}
) {
  try {
    const {categoryId} = params;
    const body = await req.json();
    const {name, billboardId} = body;

    if (!name) {
      return new NextResponse("Name is required", {status: 400});
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", {status: 400});
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", {status: 400});
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_PATCH]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function DELETE(
  req: Request,
  {params}: {params: {categoryId: string}}
) {
  try {
    const {categoryId} = params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", {status: 400});
    }

    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_DELETE]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
