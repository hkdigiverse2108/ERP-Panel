import { Print } from "@mui/icons-material";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRef, useState, type FC, type ReactNode } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries, Mutations } from "../../../../../Api";
import { CommonButton } from "../../../../../Attribute";
import { useAppSelector } from "../../../../../Store/hooks";
import BillReceipt from "../../BillReceipt";
import PosOption from "./PosOptions";
import { REDEEM_CREDIT_TYPE_ENUM } from "../../../../../Data";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

dayjs.extend(relativeTime);

const InfoRow: FC<{ label: string; value?: ReactNode }> = ({ label, value }) => {
  const hasValue = value !== null && value !== undefined && value !== "" && value !== "-";

  if (!hasValue) return null;

  return (
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-gray-700 dark:text-gray-400">{label}:</span>
      <span className="font-normal text-gray-700 dark:text-gray-400 md:w-19 lg:w-19 xl:w-20 2xl:w-28 text-right">{value}</span>
    </div>
  );
};

const PosSidebar = () => {
  const { PosProduct } = useAppSelector((state) => state.pos);
  const { company } = useAppSelector((state) => state.company);

  const { data, isLoading, isFetching } = Queries.useGetPosCustomerDetail(PosProduct?.customerId, Boolean(PosProduct?.customerId));
  const { data: orderData, isLoading: orderPending, isFetching: orderFetching } = Queries.useGetLastPosOrder({ lastBillFilter: true });
  const lastBill = orderData?.data?.posOrder_data?.[0];
  const isPosCustomerDetailLoading = isLoading || isFetching;
  const isLastBillLoading = orderPending || orderFetching;
  const customerData = PosProduct?.customerId ? data?.data : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  const render = (value: string | number) => (isPosCustomerDetailLoading ? <CircularProgress color="primary" size={10} /> : value);
  const orderRender = (value: string | number) => (isLastBillLoading ? <CircularProgress color="primary" size={10} /> : value);

  const handleLastBillPrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      // window.location.reload();
    },
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({ open: false, message: "", severity: "info" });
  const sendPosBill = Mutations.useSendPosBillWhatsApp();

  const handleSendWhatsApp = () => {
    if (!lastBill?._id) return;
    sendPosBill.mutate({ posOrderId: lastBill._id }, {
      onSuccess: () => setSnackbar({ open: true, message: "WhatsApp message sent successfully!", severity: "success" }),
      onError: (err: any) => setSnackbar({ open: true, message: err?.message || err?.data?.message || "Failed to send WhatsApp message. Configure WhatsApp in Settings.", severity: "error" }),
    });
  };

  // openShareLink removed - WhatsApp now uses Meta API via handleSendWhatsApp

  return (
    <div className="p-2 space-y-3">
      {/* PRINT AREA (VISIBLE ONLY IN PRINT MODE) */}
      <div className="print-only hidden">{lastBill && <BillReceipt ref={contentRef} bill={lastBill} />}</div>

      {/* ACTION GRID */}
      <PosOption />

      {/* CUSTOMER DETAILS */}
      {PosProduct.loyaltyDiscount || PosProduct.couponDiscount || PosProduct.redeemCreditAmount || PosProduct.discountAmount ? (
        <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
          <p className="font-semibold text-base mb-2 dark:text-gray-300">Discount Details</p>
          <div className="space-y-1">
            {PosProduct.loyaltyDiscount ? <InfoRow label="Loyalty Discount" value={`₹${PosProduct.loyaltyDiscount}`} /> : ""}
            {PosProduct.couponDiscount ? <InfoRow label="Coupon Discount" value={`₹${PosProduct.couponDiscount}`} /> : ""}
            {PosProduct.redeemCreditAmount ? <InfoRow label={PosProduct.redeemCreditType === REDEEM_CREDIT_TYPE_ENUM?.CREDIT_NOTE ? "Credit Discount" : "Advance Payment"} value={`₹${PosProduct.redeemCreditAmount}`} /> : ""}
          </div>
        </Box>
      ) : (
        ""
      )}
      <Box className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark rounded-md p-3">
        <p className="font-semibold text-base mb-2 dark:text-gray-300">Customer Details</p>
        <div className="space-y-1">
          <InfoRow label="Last Visited" value={render(customerData?.lastBill?.createdAt ? dayjs(customerData.lastBill.createdAt).fromNow() : "-")} />
          <InfoRow label="Last Bill Amount" value={render(`₹${customerData?.lastBill?.totalAmount ?? 0}`)} />
          <InfoRow label="Most Purchased" value={render(customerData?.mostPurchasedProduct?.name ?? "-")} />
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
          <div className="flex justify-between text-sm gap-2">
            <CommonButton variant="contained" size="small" title="Last Bill Print" startIcon={<Print />} disabled={!lastBill} fullWidth={!company?.enableWhatsApp} onClick={handleLastBillPrint} />
            {company?.enableWhatsApp && (
              <CommonButton color="success" variant="contained" size="small" sx={{ minWidth: 40, p: 0 }} disabled={!lastBill || sendPosBill.isPending} onClick={handleSendWhatsApp}>
                {sendPosBill.isPending ? <CircularProgress size={16} color="inherit" /> : <WhatsAppIcon />}
              </CommonButton>
            )}
          </div>
          </div>
        </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default PosSidebar;
