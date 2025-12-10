import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { setUploadModal } from "../../../Store/Slices/ModalSlice";
import { useAppDispatch } from "../../../Store/hooks";

const dummyImages = Array.from({ length: 12 }, () => ({
  url: "/img-placeholder.png",
}));

const FileGallery = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const toggleSelect = (idx: number) => {
    setSelected((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <>
      <div className="flex flex-col gap-4 custom-scrollbar h-[350px] overflow-y-auto">
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dummyImages.map((img, idx) => (
            <div key={idx} className={`relative group border rounded-xl bg-gray-50 dark:bg-gray-800 p-2 cursor-pointer ${selected.includes(idx) ? "border-brand-400" : "border-gray-200"}`} onClick={() => toggleSelect(idx)}>
              {/* Top Left Selected Badge */}
              {selected.includes(idx) && <span className="absolute top-2 left-2 bg-brand-500 text-white rounded-sm px-1 text-xs">✔</span>}

              {/* Thumbnail */}
              <img src={img.url} alt="file" className="w-full h-[140px] object-cover rounded-md" />

              {/* 3-dot Menu */}
              <div
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAnchor(e.currentTarget);
                  setMenuIndex(idx);
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
          <MenuItem onClick={() => console.log("Delete", menuIndex)}>Delete</MenuItem>
        </Menu>
      </div>
      <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button onClick={() => dispatch(setUploadModal())}>Close</Button>
        <Button variant="contained" onClick={() => dispatch(setUploadModal())}>
          Save
        </Button>
      </div>
    </>
  );
};

export default FileGallery;
