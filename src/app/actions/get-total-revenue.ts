import {prisma} from "@/lib/db";

export const getTotalRevenue = async () => {
  const paidOrders = await prisma.order.findMany({
    where: {
      status: "completed",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((orderAcc, item) => {
      return orderAcc + item.product.price;
    }, 0);
    return acc + orderTotal;
  }, 0);

  return totalRevenue;
};
