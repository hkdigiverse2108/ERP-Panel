import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { IconButton, Menu, MenuItem, Skeleton } from "@mui/material";
import { useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const FileGallery = () => {
  const { isUploadModal } = useAppSelector((state) => state.modal);
  const shouldFetchImages = isUploadModal.type === "image"; // your condition
  const shouldFetchPdf = isUploadModal.type === "pdf"; // your condition

  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuIndex, setMenuIndex] = useState<string>("");
  const { mutate: mutateDelete } = Mutations.useDeleteUpload();
  const { data: images, isLoading: isLoadingImages } = Queries.useGetUploadImage({
    enabled: shouldFetchImages,
  });
  const { data: pdf, isLoading: isLoadingPdf } = Queries.useGetUploadPdf({
    enabled: shouldFetchPdf,
  });

  const ListData = isUploadModal.type === "image" ? images?.data : pdf?.data;

  const toggleSelect = (idx: string) => setSelected((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));

  const handleDelete = () => {
    mutateDelete({ fileUrl: menuIndex });
    setMenuIndex("");
    setMenuAnchor(null);
  };

  const handleSaveBtn = async () => {
    console.log("selected ->", selected);
    dispatch(setSelectedFiles(selected));
    dispatch(setUploadModal({ open: false, type: "image" }));
  };

  return (
    <>
      <div className="flex flex-col gap-4 custom-scrollbar h-[350px] overflow-y-auto">
        {/* Gallery Grid */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoadingImages || isLoadingPdf
            ? [...Array(10)].map((_, i) => <Skeleton key={i} variant="rectangular" width="100%" height={140} sx={{ borderRadius: "10px" }} />)
            : ListData?.map((img, idx) => (
                <div key={idx} className={`relative group border rounded-xl bg-gray-50 dark:bg-gray-800 p-2 cursor-pointer ${selected.includes(img) ? "border-brand-400" : "border-gray-200"}`} onClick={() => toggleSelect(img)}>
                  {/* Top Left Selected Badge */}
                  {selected.includes(img) && <span className="absolute top-2 left-2 bg-brand-500 text-white rounded-sm px-1 text-xs">✔</span>}

                  {/* Thumbnail */}
                  {isUploadModal.type === "image" ? (
                    <img src={img} alt="file" className="w-full h-[140px] object-cover rounded-md" />
                  ) : (
                    /* PDF Preview Box */
                    <div className="w-full! flex flex-col items-center justify-center p-2">
                      <PictureAsPdfIcon sx={{ fontSize: 40 }} className="mb-2 opacity-80 text-gray-800 dark:text-gray-300" />
                    </div>
                  )}

                  {/* 3-dot Menu */}
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuAnchor(e.currentTarget);
                      setMenuIndex(img);
                    }}
                  >
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
        </div>
        {/* Menu for each image */}
        <Menu className="z-99999!" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => console.log("Download", menuIndex)}>Download</MenuItem>
          <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
        </Menu>
      </div>
      <div className="flex justify-between gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="">
          <p className="text-gray-500">{selected.length} selected</p>
          <CommonButton title="Close" onClick={() => setSelected([])} />
        </div>
        <CommonButton variant="contained" title="Save" onClick={handleSaveBtn} />
      </div>
    </>
  );
};

export default FileGallery;
