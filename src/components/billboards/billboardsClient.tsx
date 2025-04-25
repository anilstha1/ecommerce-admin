"use client";
import React from "react";
import {Button} from "../ui/button";
import {Plus} from "lucide-react";
import {Separator} from "../ui/separator";
import {useRouter} from "next/navigation";
import Heading from "../heading";
import {Billboard} from "@/generated/prisma";
import BillboardTable from "./billboard-table";

interface BillboardsClientProps {
  billboards: Billboard[];
}

function BillboardsClient({billboards}: BillboardsClientProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/billboards/new");
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between mt-5">
        <Heading
          title="Billboards"
          description="Manage billboards for your store"
        />

        <Button className="" onClick={handleClick}>
          <Plus size={24} className="mr-2" />
          Add Billboard
        </Button>
      </div>
      <Separator />

      <BillboardTable billboards={billboards} />
    </div>
  );
}

export default BillboardsClient;
