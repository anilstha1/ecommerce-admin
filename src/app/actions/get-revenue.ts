import prisma from "@/lib/db";

interface GraphData {
  name: string;
  total: number;
}

export const getRevenue = async () => {
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

  const monthlyRevenue: {[key: number]: number} = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    {
      name: "Jan",
      total: monthlyRevenue[0] || 0,
    },
    {
      name: "Feb",
      total: monthlyRevenue[1] || 0,
    },
    {
      name: "Mar",
      total: monthlyRevenue[2] || 0,
    },
    {
      name: "Apr",
      total: monthlyRevenue[3] || 0,
    },
    {
      name: "May",
      total: monthlyRevenue[4] || 0,
    },
    {
      name: "Jun",
      total: monthlyRevenue[5] || 0,
    },
    {
      name: "Jul",
      total: monthlyRevenue[6] || 0,
    },
    {
      name: "Aug",
      total: monthlyRevenue[7] || 0,
    },
    {
      name: "Sep",
      total: monthlyRevenue[8] || 0,
    },
    {
      name: "Oct",
      total: monthlyRevenue[9] || 0,
    },
    {
      name: "Nov",
      total: monthlyRevenue[10] || 0,
    },
    {
      name: "Dec",
      total: monthlyRevenue[11] || 0,
    },
  ];

  return graphData;
};
