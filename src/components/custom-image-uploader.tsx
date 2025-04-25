import {UploadDropzone} from "@uploadthing/react";

import {OurFileRouter} from "../app/api/uploadthing/core";

export const CustomImageUploader = () => (
  <UploadDropzone<OurFileRouter, "imageUploader">
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      alert(`ERROR! ${error.message}`);
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log("Uploading: ", name);
    }}
    onDrop={(acceptedFiles) => {
      console.log("Accepted files: ", acceptedFiles);
    }}
  />
);
