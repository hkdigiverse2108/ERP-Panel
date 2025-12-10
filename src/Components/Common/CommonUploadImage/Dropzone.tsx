// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { useRef } from "react";

// const Dropzone = () => {
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleOpenDialog = () => fileRef.current?.click();

//   return (
//     <>
//       <div
//         className="
//           w-full h-[350px] rounded-2xl border-2 border-dashed
//           border-gray-300 dark:border-gray-700
//           hover:border-brand-500 dark:hover:border-brand-500
//           flex flex-col items-center justify-center text-center
//           cursor-pointer bg-white dark:bg-gray-900
//         "
//         onClick={handleOpenDialog}
//       >
//         {/* Inner content is visually clickable but does not block parent click */}
//         <div className="pointer-events-none flex flex-col items-center">
//           <CloudUploadIcon className="text-gray-500" sx={{ fontSize: 40 }} />

//           <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">Drop Files Here, Paste</h4>

//           <span className="text-center block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">Drag and drop your PNG, JPG, WebP, SVG images here or browse</span>

//           <p className="mt-2 text-gray-500">Or</p>

//           <p className="mt-2 text-brand-500 font-semibold">Browse Files</p>
//         </div>

//         {/* Hidden file input */}
//         <input type="file" ref={fileRef} className="hidden" multiple onChange={(e) => console.log("Uploaded:", e.target.files)} />
//       </div>
//     </>
//   );
// };

// export default Dropzone;

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid } from "@mui/material";
import { useRef, useState } from "react";

const DropzoneWithPreview = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(fileList).forEach((file) => {
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setFiles((prev) => [...prev, ...newFiles]);
    setImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    const newImages = [...images];

    newFiles.splice(index, 1);
    newImages.splice(index, 1);

    setFiles(newFiles);
    setImages(newImages);
  };

  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img));
    setImages([]);
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      {/* DROPZONE */}
      <div className="w-full h-[350px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 flex flex-col items-center justify-center text-center cursor-pointer bg-white dark:bg-gray-900" onClick={() => fileRef.current?.click()}>
        {/* PREVIEW GRID */}
        <Grid container spacing={2} className="flex flex-wrap custom-scrollbar overflow-y-auto p-3">
          {images.map((src, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index} className="relative w-36 border rounded-lg  overflow-hidden">
              <img src={src} className="w-full h-full object-cover" />

              {/* Remove Button (X) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute right-1 top-1 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:h-8 sm:w-8"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </Grid>
          ))}
        </Grid>

        {/* Empty message when no images uploaded */}
        {images.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <CloudUploadIcon className="text-gray-500" sx={{ fontSize: 40 }} />
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">Drop Files Here, Paste</h4>
            <span className="text-center block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">Drag and drop your PNG, JPG, WebP, SVG images here or browse</span>
            <p className="mt-2 text-gray-500">Or</p>
            <p className="mt-2 text-brand-500 font-semibold">Browse Files</p>
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input type="file" ref={fileRef} className="hidden" multiple accept="image/*" onChange={handleUpload} />

      {/* Footer: Clear + Insert */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button onClick={handleClear}>Clear</Button>

        <Button variant="contained" disabled={images.length === 0} onClick={() => console.log("Selected Files:", files)}>
          Insert Media
        </Button>
      </div>
    </div>
  );
};

export default DropzoneWithPreview;
