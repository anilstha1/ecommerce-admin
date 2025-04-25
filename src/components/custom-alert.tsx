import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "./ui/button";

function CustomAlert({
  title,
  description,
  open,
  loading,
  onClose,
  onDelete,
}: {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
}) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <Button className="">Cancel</Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onDelete}
            className="ml-4"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomAlert;
