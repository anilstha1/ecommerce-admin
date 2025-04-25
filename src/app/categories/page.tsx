import {prisma} from "@/lib/db";
import CategoriesClient from "@/components/categories/categoriesClient";

async function BillboardsPage() {
  const categories = await prisma.category.findMany({
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex w-full max-w-7xl mx-auto p-4">
      <CategoriesClient categories={categories} />
    </div>
  );
}

export default BillboardsPage;
