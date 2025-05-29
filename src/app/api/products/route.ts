import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        images,
        description,
        isFeatured,
        isArchived,
        colors,
        sizes,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}

export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isArchived: false,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (isFeatured) {
      where.isFeatured = Boolean(isFeatured);
    }
    if (minPrice || maxPrice) {
      console.log("hello");
      if (minPrice) where.price = {gte: Number(minPrice)};
      if (maxPrice) where.price = {...where.price, lte: Number(maxPrice)};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any[] = [];
    if (sort === "asc" || sort === "desc") {
      orderBy.push({price: sort});
    }
    orderBy.push({createdAt: "desc"});

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
