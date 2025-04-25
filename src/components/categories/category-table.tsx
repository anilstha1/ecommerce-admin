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
import {Category} from "@/generated/prisma";
import {formatDate} from "@/lib/utils";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import CustomAlert from "../custom-alert";
import axios from "axios";
import toast from "react-hot-toast";
import {Input} from "../ui/input";

interface CategoryTableProps {
  categories: (Category & {
    billboard: {
      id: string;
      label: string;
    };
  })[];
}

function CategoryTable({categories}: CategoryTableProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<string>("");
  const [filteredCategories, setFilteredCategories] =
    React.useState<CategoryTableProps["categories"]>(categories);

  useEffect(() => {
    if (search) {
      const filtered = categories?.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [search, categories]);

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!categoryId) {
        return;
      }
      await axios.delete(`/api/categories/${categoryId}`);
      setCategoryId(null);
      router.push("/categories");
      router.refresh();
      toast.success("Category deleted");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Something went wrong!");
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
              <TableHead className="">Name</TableHead>
              <TableHead className="">Billboard</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories?.map((category) => (
              <TableRow key={category.id} className="h-12">
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.billboard?.label}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
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
                          router.push(`/categories/${category.id}`);
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setOpen(true);
                          setCategoryId(category.id);
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

export default CategoryTable;
