import ProductForm from "@/components/products/product-form";
import prisma from "@/lib/db";

async function ProductPage({params}: {params: {productId: string}}) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(categories);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex flex-col py-5 items-center justify-between">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}

export default ProductPage;
