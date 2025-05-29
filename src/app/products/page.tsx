import ProductsClient from "@/components/products/productsClient";
import prisma from "@/lib/db";

async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex w-full max-w-7xl mx-auto p-4">
      <ProductsClient products={products} />
    </div>
  );
}

export default ProductsPage;
