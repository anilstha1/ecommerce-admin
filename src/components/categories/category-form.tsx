"use client";
import React from "react";
import * as z from "zod";
import {Billboard, Category} from "@/generated/prisma";
import {Trash} from "lucide-react";
import {Button} from "../ui/button";
import {useParams, useRouter, useSearchParams} from "next/navigation";
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
import UploadImage from "../upload-image";
import axios from "axios";
import toast from "react-hot-toast";
import CustomAlert from "../custom-alert";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[] | null;
}

function CategoryForm({initialData, billboards}: CategoryFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const params = useParams();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Category" : "Create a new Category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "Save changes" : "Create";
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      billboardId: initialData?.billboardId || "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);

      if (initialData?.id) {
        await axios.put(`/api/categories/${params.categoryId}`, data);
      } else {
        await axios.post("/api/categories", data);
      }
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error creating category:", error);
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
      await axios.delete(`/api/categories/${params.categoryId}`);
      router.push("/categories");
      router.refresh();
      toast.success("Category deleted");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Something went wrong");
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
          className="space-y-8 w-full mt-5"
        >
          <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a billboard" />
                      </SelectTrigger>
                      <SelectContent>
                        {billboards?.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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

export default CategoryForm;
