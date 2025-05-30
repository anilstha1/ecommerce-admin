import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  {params}: {params: Promise<{billboardId: string}>}
) {
  try {
    const {billboardId} = await params;

    if (!billboardId) {
      return new NextResponse("BillboardID is required", {status: 400});
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    if (!billboard) {
      return new NextResponse("Billboard not found", {status: 404});
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Error in getting billboard", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
