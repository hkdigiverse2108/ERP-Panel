import { Button, Tab, Tabs } from "@mui/material";
import { useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { CommonUploadImageProps } from "../../../Types";
import { Modal } from "../CommonModal";
import Dropzone from "./Dropzone";
import FileGallery from "./FileGallery";

const CommonUploadImage: FC<CommonUploadImageProps> = ({ title = "Upload Image" }) => {
  const { isUploadModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const [tab, setTab] = useState(0);
  return (
    <>
      <Button onClick={() => dispatch(setUploadModal())}>Upload Image</Button>

      <Modal isOpen={isUploadModal} title={title} onClose={() => dispatch(setUploadModal())} className="max-w-[900px] m-2 sm:m-5">
        <div className="flex flex-col gap-5">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} className="border-b border-gray-200 dark:border-gray-800">
            <Tab label="Upload New" />
            <Tab label="Select File" />
          </Tabs>

          {tab === 0 && <Dropzone />}
          {tab === 1 && <FileGallery />}

          {/* <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button onClick={() => dispatch(setUploadModal())}>Close</Button>
            <Button variant="contained" onClick={() => dispatch(setUploadModal())}>
              Save
            </Button>
          </div> */}
        </div>
      </Modal>
    </>
  );
};

export default CommonUploadImage;
