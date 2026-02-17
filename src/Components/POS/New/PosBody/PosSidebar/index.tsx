import { Print } from "@mui/icons-material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Box, IconButton } from "@mui/material";
import { type FC } from "react";
import { Queries } from "../../../../../Api";
import { CommonButton } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setCouponModal } from "../../../../../Store/Slices/ModalSlice";
import Coupon from "./Coupon";
import PosOption from "./PosOptions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const InfoRow: FC<{ label: string; value?: string | number }> = ({ label, value }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-gray-700 dark:text-gray-400">{label} :-</span>
      {label === "Coupons" ? (
        <IconButton onClick={() => dispatch(setCouponModal())} color="primary" size="small" className="p-0!">
          <AddBoxIcon />
        </IconButton>
      ) : (
        <span className="font-normal text-gray-700 dark:text-gray-400">{value}</span>
      )}
    </div>
  );
};

const PosSidebar = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);
  const { data } = Queries.useGetPosCustomerDetail(PosProduct?.customerId, Boolean(PosProduct?.customerId));
  const customerData = PosProduct?.customerId ? data?.data : undefined;
  return (
    <>
      <div className="p-2 space-y-3">
        {/* ACTION GRID */}
        <PosOption />

        {/* CUSTOMER DETAILS */}
        <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
          <p className="font-semibold text-base mb-2 dark:text-gray-300">Customer Details</p>
          <div className="space-y-1">
            <InfoRow label="Last Visited" value={customerData?.lastBill?.createdAt ? dayjs(customerData.lastBill.createdAt).fromNow() : "-"} />
            <InfoRow label="Last Bill Amount" value={`₹${customerData?.lastBill?.totalAmount ?? 0}`} />
            <InfoRow label="Most Purchased Item" value={customerData?.mostPurchasedProduct?.name ?? "-"} />
            <InfoRow label="Payment Mode" value={customerData?.lastBill?.paymentMethod ?? "-"} />
            <InfoRow label="Due Payment" value={`₹${customerData?.totalDueAmount ?? 0}`} />
            <InfoRow label="Total Purchase" value={`₹${customerData?.totalPurchaseAmount ?? 0}`} />
            <InfoRow label="Loyalty Points" value={customerData?.customer?.loyaltyPoints ?? 0} />
            {PosProduct?.customerId && <InfoRow label="Coupons" value="Coupons" />}
          </div>
        </Box>

        {/* LAST BILL */}
        <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
          <div className="space-y-2">
            <InfoRow label="Last Bill No." value={customerData?.lastBill?.orderNo ?? "-"} />
            <InfoRow label="Last Bill Amount" value={`₹${customerData?.lastBill?.totalAmount ?? 0}`} />
            <CommonButton variant="contained" size="small" title="Last Bill Print" startIcon={<Print />} fullWidth />
          </div>
        </Box>
      </div>
      <Coupon />
    </>
  );
};

export default PosSidebar;
