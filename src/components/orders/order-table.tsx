"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {formatDate} from "@/lib/utils";
import {Input} from "../ui/input";

interface OrdersTableProps {
  orders: {
    id: string;
    products: string[];
    totalPrice: number;
    createdAt: Date;
    status: string;
  }[];
}

function OrderTable({orders}: OrdersTableProps) {
  const [search, setSearch] = React.useState<string>("");

  return (
    <div className="mt-5 w-full flex flex-col">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 max-w-sm"
      />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Products</TableHead>
              <TableHead className="">Total Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="h-12">
                <TableCell>
                  {order.products.map((product) => product).join(", ")}
                </TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default OrderTable;
