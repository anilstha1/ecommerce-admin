"use client";
import React from "react";
import * as z from "zod";
import {Billboard} from "@/generated/prisma";
import {Trash} from "lucide-react";
import {Button} from "../ui/button";
import {useRouter} from "next/navigation";
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
import {Input} from "../ui/input";
import UploadImage from "../upload-image";
import axios from "axios";
import toast from "react-hot-toast";
import CustomAlert from "../custom-alert";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

function BillboardForm({initialData}: BillboardFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Edit a billboard"
    : "Create a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";
  const router = useRouter();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    console.log(data);
    try {
      setIsLoading(true);

      if (initialData?.id) {
        await axios.put("/api/billboards", {id: initialData.id, ...data});
      } else {
        await axios.post("/api/billboards", data);
      }
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error creating billboard:", error);
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
      await axios.delete("/api/billboards", {data: {id: initialData?.id}});
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
          className="space-y-8 w-full max-w-md mt-5"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({field}) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <UploadImage
                    images={field.value ? [field.value] : null}
                    onChange={(url: string) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({field}) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Billboard label" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default BillboardForm;
