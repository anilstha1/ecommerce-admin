"use client";
import React from "react";
import {Button} from "../ui/button";
import {Plus} from "lucide-react";
import {Separator} from "../ui/separator";
import {useRouter} from "next/navigation";
import Heading from "../heading";
import {Product} from "@/generated/prisma";
import ProductTable from "./product-table";

interface ProductsClientProps {
  products: (Product & {
    category: {
      id: string;
      name: string;
    };
  })[];
}

function ProductsClient({products}: ProductsClientProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products/new");
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between mt-5">
        <Heading
          title="products"
          description="Manage products for your store"
        />

        <Button className="" onClick={handleClick}>
          <Plus size={24} className="mr-2" />
          Add Product
        </Button>
      </div>
      <Separator />

      <ProductTable products={products} />
    </div>
  );
}

export default ProductsClient;
