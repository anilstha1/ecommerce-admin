"use client";
import React from "react";
import {X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {UploadDropzone} from "@/utils/uploadthing";

function UploadImage({
  images,
  onChange,
  onRemove,
}: {
  images: string[] | null;
  onChange: (url: string) => void;
  onRemove: () => void;
}) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-xl">
      {images && (
        <div className="flex items-center gap-4">
          {images.map((image) => {
            return (
              <div
                key={image}
                className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
              >
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    type="button"
                    onClick={onRemove}
                    variant="destructive"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <img
                  className="w-full h-full object-cover object-center"
                  alt="Upload"
                  src={image}
                />
              </div>
            );
          })}
        </div>
      )}

      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.ufsUrl) {
            onChange(res?.[0]?.ufsUrl);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload failed:", error);
          alert("Upload failed: " + error.message);
        }}
        onUploadBegin={(name) => {
          console.log("Started uploading:", name);
        }}
      />
    </div>
  );
}

export default UploadImage;
