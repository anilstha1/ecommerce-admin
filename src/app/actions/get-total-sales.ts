import {prisma} from "@/lib/db";

export const getSalesCount = async () => {
  const salesCount = await prisma.order.count({
    where: {
      status: "completed",
    },
  });

  return salesCount;
};
