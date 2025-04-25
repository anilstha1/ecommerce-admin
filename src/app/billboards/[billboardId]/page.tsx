import BillboardForm from "@/components/billboards/billboard-form";
import {prisma} from "@/lib/db";

async function BillboardPage({params}: {params: {billboardId: string}}) {
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex flex-col py-5 items-center justify-between">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}

export default BillboardPage;
