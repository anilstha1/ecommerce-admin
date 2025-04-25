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
import {Product} from "@/generated/prisma";
import {formatDate} from "@/lib/utils";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import CustomAlert from "../custom-alert";
import axios from "axios";
import toast from "react-hot-toast";
import {Input} from "../ui/input";

interface ProductsClientProps {
  products: (Product & {
    category: {
      id: string;
      name: string;
    };
  })[];
}

function ProductTable({products}: ProductsClientProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productId, setproductId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<string>("");
  const [filteredProducts, setFilteredProducts] =
    React.useState<ProductsClientProps["products"]>();

  useEffect(() => {
    if (search) {
      const filtered = products?.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [search, products]);

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!productId) {
        return;
      }
      await axios.delete(`/api/products/${productId}`);
      setproductId(null);
      router.push("/products");
      router.refresh();
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error in deleting product");
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
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 max-w-sm"
      />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead className="">Category</TableHead>
              <TableHead className="">Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id} className="h-12">
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                          router.push(`/products/${product.id}`);
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setOpen(true);
                          setproductId(product.id);
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

export default ProductTable;
