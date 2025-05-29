import BillboardsClient from "@/components/billboards/billboardsClient";
import prisma from "@/lib/db";

async function BillboardsPage() {
  const billboards = await prisma.billboard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex w-full max-w-7xl mx-auto p-4">
      <BillboardsClient billboards={billboards} />
    </div>
  );
}

export default BillboardsPage;
