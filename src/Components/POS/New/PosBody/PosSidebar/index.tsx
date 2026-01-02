import { Print } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useState, type FC } from "react";
import { CommonButton } from "../../../../../Attribute";
import PosOption from "./PosOptions";
import { useAppDispatch } from "../../../../../Store/hooks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { setCustomerModal } from "../../../../../Store/Slices/ModalSlice";

const InfoRow: FC<{ label: string; value: string }> = ({ label, value }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-gray-700 dark:text-gray-400">{label} :-</span>
      {label === "Coupons" ? (
        <IconButton onClick={() => dispatch(setCustomerModal({ open: true, data: null }))} color="primary" size="small">
          <AddBoxIcon />
        </IconButton>
      ) : (
        <span className="font-normal text-gray-700 dark:text-gray-400">{value}</span>
      )}
    </div>
  );
};

const PosSidebar = () => {
  return (
    <div className=" p-2 space-y-3">
      {/* ACTION GRID */}
      <PosOption />

      {/* CUSTOMER DETAILS */}
      <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
        <p className="font-semibold text-base mb-2 dark:text-gray-300">Customer Details</p>
        <div className="space-y-1">
          <InfoRow label="Last Visited" value="-" />
          <InfoRow label="Last Bill Amount" value="₹0" />
          <InfoRow label="Most Purchased Item" value="0" />
          <InfoRow label="Payment Mode" value="-" />
          <InfoRow label="Due Payment" value="0" />
          <InfoRow label="Total Purchase" value="0" />
          <InfoRow label="Loyalty Points" value="0" />
          <InfoRow label="Coupons" value="Coupons" />
        </div>
      </Box>

      {/* LAST BILL */}
      <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
        <div className="space-y-2">
          <InfoRow label="Last Bill No." value="ORD16" />
          <InfoRow label="Last Bill Amount" value="₹50.00" />
          <CommonButton variant="contained" size="small" title="Last Bill Print" startIcon={<Print />} fullWidth />
        </div>
      </Box>
    </div>
  );
};

export default PosSidebar;
