"use client";
import React from "react";
import {Separator} from "../ui/separator";
import Heading from "../heading";
import OrderTable from "./order-table";

interface OrdersClientProps {
  orders: {
    id: string;
    products: string[];
    totalPrice: number;
    createdAt: Date;
    status: string;
  }[];
}

function OrdersClient({orders}: OrdersClientProps) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between mt-5">
        <Heading
          title="products"
          description="Manage products for your store"
        />
      </div>
      <Separator />

      <OrderTable orders={orders} />
    </div>
  );
}

export default OrdersClient;
