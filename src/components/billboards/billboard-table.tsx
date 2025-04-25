"use client";
import React, {useEffect} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Billboard} from "@/generated/prisma";
import {formatDate} from "@/lib/utils";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import CustomAlert from "../custom-alert";
import axios from "axios";
import toast from "react-hot-toast";
import {Input} from "../ui/input";

function BillboardTable({billboards}: {billboards: Billboard[]}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [billboardId, setBillboardId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<string>("");
  const [filteredBillboards, setFilteredBillboards] =
    React.useState<Billboard[]>();

  useEffect(() => {
    if (search) {
      const filtered = billboards?.filter((billboard) =>
        billboard.label.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBillboards(filtered);
    } else {
      setFilteredBillboards(billboards);
    }
  }, [search, billboards]);

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!billboardId) {
        return;
      }
      await axios.delete("/api/billboards", {data: {id: billboardId}});
      setBillboardId(null);
      router.push("/billboards");
      router.refresh();
      toast.success("Billboard deleted");
    } catch (error) {
      console.error("Error deleting billboard:", error);
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className="mt-5 w-full flex flex-col">
      <CustomAlert
        title="Are you sure?"
        description="This action cannot be undone."
        open={open}
        onClose={onClose}
        onDelete={onDelete}
        loading={loading}
      />

      <Input
        placeholder="Search billboards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 max-w-sm"
      />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Label</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBillboards?.map((billboard) => (
              <TableRow key={billboard.id} className="h-12">
                <TableCell>{billboard.label}</TableCell>
                <TableCell>{formatDate(billboard.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <span>
                        <MoreHorizontal className="h-4 w-4" />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/billboards/${billboard.id}`);
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setOpen(true);
                          setBillboardId(billboard.id);
                        }}
                      >
                        <Trash className="mr-2" size={16} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default BillboardTable;
