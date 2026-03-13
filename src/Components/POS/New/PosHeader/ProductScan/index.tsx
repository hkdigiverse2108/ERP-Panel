import FlipIcon from "@mui/icons-material/Flip";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../Store/hooks";
import { setIsProductScan } from "../../../../../Store/Slices/PosSlice";
import { CommonModal } from "../../../../Common";
import FileGallery from "./FileGallery";
// import Dropzone from "./Dropzone";

const ProductScan = () => {
  const dispatch = useDispatch();

  const { isProductScan } = useAppSelector((state) => state.pos);

  const handleClose = () => dispatch(setIsProductScan());

  return (
    <>
      <Tooltip title={"Product Scan"}>
        <div className="head-icon" style={{ cursor: "pointer" }} onClick={handleClose}>
          <FlipIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonModal isOpen={isProductScan} title={`Upload `} onClose={handleClose} className="max-w-[900px] m-2 sm:m-5">
        <div className="flex flex-col gap-5">
          <FileGallery />
          {/* <Dropzone /> */}
        </div>
      </CommonModal>
    </>
  );
};

export default ProductScan;
