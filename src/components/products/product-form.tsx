"use client";
import React from "react";
import * as z from "zod";
import {Billboard, Category, Product} from "@/generated/prisma";
import {Trash} from "lucide-react";
import {Button} from "../ui/button";
import {useParams, useRouter} from "next/navigation";
import {Separator} from "../ui/separator";
import Heading from "../heading";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Input} from "../ui/input";
import {Badge} from "../ui/badge";
import {X} from "lucide-react";
import UploadImage from "../upload-image";
import axios from "axios";
import toast from "react-hot-toast";
import CustomAlert from "../custom-alert";
import {Checkbox} from "../ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  images: z.array(z.string()).min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[] | null;
}

function ProductForm({initialData, categories}: ProductFormProps) {
  const [newColor, setNewColor] = React.useState("");
  const [newSize, setNewSize] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Create a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";
  const router = useRouter();
  const params = useParams();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      images: initialData?.images || [],
      categoryId: initialData?.categoryId || "",
      isFeatured: initialData?.isFeatured || false,
      isArchived: initialData?.isArchived || false,
      colors: initialData?.colors || [],
      sizes: initialData?.sizes || [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    try {
      setIsLoading(true);

      if (initialData?.id) {
        await axios.put(`/api/products/${params.productId}`, data);
      } else {
        await axios.post("/api/products", data);
      }

      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!initialData?.id) {
        return;
      }
      await axios.delete(`/api/products/${params.productId}`);
      router.push("/products");
      router.refresh();
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col m-5">
      <CustomAlert
        title="Are you sure?"
        description="This action cannot be undone."
        open={open}
        onClose={onClose}
        onDelete={onDelete}
        loading={loading}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-xl mt-5"
        >
          <FormField
            control={form.control}
            name="images"
            render={({field}) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage
                    images={field.value}
                    onChange={(url: string) =>
                      field.onChange([...field.value, url])
                    }
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colors"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((color, index) => (
                      <Badge key={index} variant="secondary" className="p-2">
                        {color}
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = [...field.value];
                            newColors.splice(index, 1);
                            field.onChange(newColors);
                          }}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add a color"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newColor) {
                            field.onChange([...field.value, newColor]);
                            setNewColor("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newColor) {
                          field.onChange([...field.value, newColor]);
                          setNewColor("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((size, index) => (
                      <Badge key={index} variant="secondary" className="p-2">
                        {size}
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = [...field.value];
                            newSizes.splice(index, 1);
                            field.onChange(newSizes);
                          }}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add a size"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newSize) {
                            field.onChange([...field.value, newSize]);
                            setNewSize("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newSize) {
                          field.onChange([...field.value, newSize]);
                          setNewSize("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({field}) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({field}) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archieved</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ProductForm;
