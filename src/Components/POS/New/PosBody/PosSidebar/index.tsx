import { Print } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRef, type FC, type ReactNode } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../../../Api";
import { CommonButton } from "../../../../../Attribute";
import { useAppSelector } from "../../../../../Store/hooks";
import LastBillReceipt from "./LastBillReceipt";
import PosOption from "./PosOptions";

dayjs.extend(relativeTime);

const InfoRow: FC<{ label: string; value?: ReactNode }> = ({ label, value }) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-gray-700 dark:text-gray-400">{label} :-</span>
      <span className="font-normal text-gray-700 dark:text-gray-400">{value ?? "-"}</span>
    </div>
  );
};

const PosSidebar = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);

  const { data, isPending, isFetching } = Queries.useGetPosCustomerDetail(PosProduct?.customerId, Boolean(PosProduct?.customerId));
  const { data: orderData, isPending: orderPending } = Queries.useGetPosOrder({ lastBillFilter: true });
  const lastBill = orderData?.data?.posOrder_data?.[0];
  const isPosCustomerDetailLoading = isPending || isFetching;
  const customerData = PosProduct?.customerId ? data?.data : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  const render = (value: string | number) => (isPosCustomerDetailLoading ? <CircularProgress color="primary" size={10} /> : value);
  const orderRender = (value: string | number) => (orderPending ? <CircularProgress color="primary" size={10} /> : value);

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      // window.location.reload();
    },
  });

  return (
    <div className="p-2 space-y-3">
      {/* PRINT AREA (VISIBLE ONLY IN PRINT MODE) */}
      <div className="print-only hidden">{lastBill && <LastBillReceipt ref={contentRef} bill={lastBill} />}</div>

      {/* ACTION GRID */}
      <PosOption />

      {/* CUSTOMER DETAILS */}
      <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
        <p className="font-semibold text-base mb-2 dark:text-gray-300">Customer Details</p>
        <div className="space-y-1">
          <InfoRow label="Last Visited" value={render(customerData?.lastBill?.createdAt ? dayjs(customerData.lastBill.createdAt).fromNow() : "-")} />
          <InfoRow label="Last Bill Amount" value={render(`₹${customerData?.lastBill?.totalAmount ?? 0}`)} />
          <InfoRow label="Most Purchased Item" value={render(customerData?.mostPurchasedProduct?.name ?? "-")} />
          <InfoRow label="Payment Mode" value={render(customerData?.lastBill?.paymentMethod ?? "-")} />
          <InfoRow label="Due Payment" value={render(`₹${customerData?.totalDueAmount ?? 0}`)} />
          <InfoRow label="Total Purchase" value={render(`₹${customerData?.totalPurchaseAmount ?? 0}`)} />
          <InfoRow label="Loyalty Points" value={render(customerData?.customer?.loyaltyPoints ?? 0)} />
        </div>
      </Box>

      {/* LAST BILL */}
      <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
        <div className="space-y-2">
          <InfoRow label="Last Bill No." value={orderRender(lastBill?.orderNo ?? "-")} />
          <InfoRow label="Last Bill Amount" value={orderRender(`₹${lastBill?.totalAmount ?? 0}`)} />
          <CommonButton variant="contained" size="small" title="Last Bill Print" startIcon={<Print />} fullWidth onClick={handleLastBillPrint} />
        </div>
      </Box>
    </div>
  );
};

export default PosSidebar;
