import OrdersClient from "@/components/orders/ordersClient";
import {prisma} from "@/lib/db";

async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    products: order.orderItems.map((item) => item.product.name),
    totalPrice: order.orderItems.reduce(
      (total, item) => total + item.product.price,
      0
    ),
    createdAt: order.createdAt,
    status: order.status,
  }));

  return (
    <div className="flex w-full max-w-7xl mx-auto p-4">
      <OrdersClient orders={formattedOrders} />
    </div>
  );
}

export default OrdersPage;
