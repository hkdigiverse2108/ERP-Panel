import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { CommonButton } from "../../../../Attribute";
import { setDiscardModal } from "../../../../Store/Slices/ModalSlice";
import { clearPosProduct } from "../../../../Store/Slices/PosSlice";
import { useAppSelector } from "../../../../Store/hooks";
import { CommonModal } from "../../../Common";

const Discard = () => {
  const { isDiscardModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();

  const handleDiscard = () => {
    dispatch(clearPosProduct());
    dispatch(setDiscardModal());
  };

  return (
    <>
      <Tooltip title="Discard">
        <div onClick={() => dispatch(setDiscardModal())} className="head-icon">
          <DeleteForeverIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonModal isOpen={isDiscardModal} onClose={() => dispatch(setDiscardModal())} className="max-w-[400px] m-2 sm:m-5">
        <div className="flex flex-col items-center text-center px-6 py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-300 text-sky-400">
            <InfoIcon sx={{ fontSize: 34 }} />
          </div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Discard Sale ?</h2>
          <div className="flex gap-3">
            <CommonButton onClick={() => dispatch(setDiscardModal())} variant="outlined" startIcon={<ThumbDownAltIcon />}>
              Cancel
            </CommonButton>
            <CommonButton onClick={handleDiscard} variant="contained" startIcon={<ThumbUpAltIcon />}>
              ok!
            </CommonButton>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Discard;
