import { Print } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRef, type FC, type ReactNode } from "react";
import { useReactToPrint } from "react-to-print";
import { Queries } from "../../../../../Api";
import { CommonButton } from "../../../../../Attribute";
import { useAppSelector } from "../../../../../Store/hooks";
import BillReceipt from "../../BillReceipt";
import PosOption from "./PosOptions";
import { REDEEM_CREDIT_TYPE_ENUM } from "../../../../../Data";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { FormatCountryCode, FormatDate, FormatPayment } from "../../../../../Utils";
import type { PosOrderBase } from "../../../../../Types";

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
  console.log("lastBill", lastBill);
  const getCompanyAddress = () => {
    const addr = company?.address;
    if (!addr) return null;

    const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

    let addressStr = parts.join(", ");
    if (addr.pinCode) {
      addressStr += ` - ${addr.pinCode}`;
    }

    return addressStr;
  };

  const openShareLink = () => {
    const getTaxPercent = (item: PosOrderBase["items"][number]) => {
      return item?.productId?.salesTaxId?.percentage || 0;
    };

    const itemsText = lastBill?.items
      ?.map((item, i, arr) => {
        const taxPercent = getTaxPercent(item);
        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);

        const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);
        const taxAmount = item.productId?.isSalesTaxIncluding ? 0 : (net * taxPercent) / 100;

        return [`#${i + 1} ${item.productId?.name || ""}`, `   Qty: ${item.qty} | MRP: ${item.mrp} | GST: ${taxAmount.toFixed(2)} | Net: ${item.netAmount || 0}`, discAmt > 0 ? `   GST ${taxPercent}% | Discount: ${discAmt.toFixed(2)}` : `   GST ${taxPercent}%`, i !== arr.length - 1 ? "------------------------" : ""].filter(Boolean).join("\n");
      })
      .join("\n");

    // 🔥 CONDITIONAL BLOCKS (NO EMPTY SPACE)
    const extraLines = [lastBill?.additionalCharges?.length ? `Additional Charge : ${lastBill.additionalCharges.reduce((a, c) => a + (c.totalAmount || 0), 0).toFixed(2)}` : null, lastBill?.totalDiscount ? `Discount : ${lastBill.totalDiscount.toFixed(2)}` : null, lastBill?.redeemCreditAmount ? `${lastBill.redeemCreditType === REDEEM_CREDIT_TYPE_ENUM?.CREDIT_NOTE ? "Credit Discount" : "Advance Payment"} : ${lastBill.redeemCreditAmount.toFixed(2)}` : null, lastBill?.flatDiscountAmount ? `Flat Discount : ${lastBill.flatDiscountAmount.toFixed(2)}` : null, lastBill?.roundOff ? `Round Off : ${lastBill.roundOff.toFixed(2)}` : null].filter(Boolean).join("\n");

    // 🔥 PAYMENTS
    const paymentsText = (lastBill?.multiplePayments?.length || 0) > 0 ? lastBill?.multiplePayments.map((p) => `${FormatPayment(p.method).padEnd(15)} : ${Number(p.amount?.toFixed(2) || 0)}`).join("\n") : "";

    const message = `
\`\`\`
${lastBill?.companyId?.name || ""}
${getCompanyAddress()}
Ph: ${FormatCountryCode(company?.phoneNo?.countryCode)} ${company?.phoneNo?.phoneNo}

TAX INVOICE

Name       : ${lastBill?.customerId?.firstName} ${lastBill?.customerId?.lastName}
Mobile     : ${FormatCountryCode(lastBill?.customerId?.phoneNo?.countryCode)} ${lastBill?.customerId?.phoneNo?.phoneNo}
Date       : ${FormatDate(lastBill?.createdAt)}
Invoice No : ${lastBill?.orderNo}

========================
${itemsText}
========================


${extraLines ? extraLines + "\n" : ""}${paymentsText ? paymentsText + "\n" : ""}
TOTAL : ${Number(lastBill?.totalAmount?.toFixed(0) || 0)}

------------------------
Thank You For Shopping!
\`\`\`
`;

    const encodedMessage = encodeURIComponent(message);

    // window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, "_blank");
    const phoneNumber = `${lastBill?.customerId?.phoneNo?.countryCode}${lastBill?.customerId?.phoneNo?.phoneNo}`.replace(/\D/g, "");

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, "_blank");
  };

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
            <CommonButton variant="contained" size="small" title="Last Bill Print" startIcon={<Print />} disabled={!lastBill} fullWidth onClick={handleLastBillPrint} />
            <CommonButton color="success" variant="contained" size="small" sx={{ minWidth: 40, p: 0 }} disabled={!lastBill} onClick={openShareLink}>
              <WhatsAppIcon />
            </CommonButton>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default PosSidebar;
