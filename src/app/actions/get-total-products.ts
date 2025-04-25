import {prisma} from "@/lib/db";

export const getStockCount = async () => {
  const stockCount = await prisma.product.count({
    where: {
      isArchived: false,
    },
  });

  return stockCount;
};
