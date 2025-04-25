"use client";
import React from "react";
import {Button} from "../ui/button";
import {Plus} from "lucide-react";
import {Separator} from "../ui/separator";
import {useRouter} from "next/navigation";
import Heading from "../heading";
import {Category} from "@/generated/prisma";
import CategoryTable from "./category-table";

interface CategoriesClientProps {
  categories: (Category & {
    billboard: {
      id: string;
      label: string;
    };
  })[];
}

function CategoriesClient({categories}: CategoriesClientProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/categories/new");
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between mt-5">
        <Heading
          title="Categories"
          description="Manage categories for your store"
        />

        <Button className="" onClick={handleClick}>
          <Plus size={24} className="mr-2" />
          Add Category
        </Button>
      </div>
      <Separator />

      <CategoryTable categories={categories} />
    </div>
  );
}

export default CategoriesClient;
