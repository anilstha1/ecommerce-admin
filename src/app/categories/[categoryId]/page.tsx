import CategoryForm from "@/components/categories/category-form";
import prisma from "@/lib/db";

async function CategoryPage({params}: {params: {categoryId: string}}) {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      billboard: true,
    },
  });

  const billboards = await prisma.billboard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex flex-col py-5 items-center justify-between">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
}

export default CategoryPage;
