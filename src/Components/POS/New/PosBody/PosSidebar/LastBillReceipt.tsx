import { Divider } from "@mui/material";
import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../../Store/hooks";
import type { PosOrderBase } from "../../../../../Types";
import { FormatDate, FormatDateTime } from "../../../../../Utils";

const LastBillReceipt = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  // const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;

  // const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;

  const getTaxPercent = (item: PosOrderBase["items"][number]) => {
    return item?.productId?.salesTaxId?.percentage || 0;
  };

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

  return (
    <div ref={ref} id="last-bill-print" className="mx-auto w-[150mm] bg-white text-black p-6 font-mono text-[15px] leading-tight">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold capitalize">{bill?.companyId?.name}</h2>

        <div className="text-sm mt-2">
          {getCompanyAddress() && <div>{getCompanyAddress()}</div>}

          {company?.phoneNo && (
            <div>
              Ph: {company.phoneNo.countryCode}-{company.phoneNo.phoneNo}
            </div>
          )}
        </div>

        <h3 className="mt-4 font-bold text-base">Tax Invoice</h3>
      </div>

      {/* Customer Meta */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex gap-2">
          <span className="font-bold">Name:</span>
          <span>{bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Walk-in"}</span>
        </div>

        <div className="flex gap-2">
          <span className="font-bold">Mob No.:</span>
          <span>
            {bill?.customerId?.phoneNo?.countryCode}-{bill?.customerId?.phoneNo?.phoneNo || "-"}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="font-bold">Date:</span>
          <span>{FormatDate(bill.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          <span className="font-bold">Invoice No.:</span>
          <span>{bill.orderNo}</span>
        </div>
      </div>

      {/* Product Table */}
      <table className="w-full text-sm border-t border-dashed border-black mb-4">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-left py-1 w-[5%]">#</th>
            <th className="text-left py-1 w-[50%]">Item</th>
            <th className="text-center py-1 w-[10%]">Qty</th>
            <th className="text-center py-1 w-[15%]">MRP</th>
            <th className="text-right py-1 w-[20%]">Net Amt.</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item, index) => {
            const taxPercent = getTaxPercent(item);
            const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
            const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);
            const taxAmount = ((net * taxPercent) / 100 + net) / (item.qty || 0);
            return (
              <React.Fragment key={index}>
                <tr className="align-top">
                  <td className="py-1">{index + 1}</td>

                  <td className="py-1">
                    <div className="font-bold">{item.productId?.name}</div>

                    {item.productId?.variant && <div className="text-xs">{item.productId.variant}</div>}
                  </td>

                  <td className="text-center py-1">{Number(item.qty || 0)}</td>

                  <td className="text-center py-1">{Number(item.mrp || 0)}</td>

                  <td className="text-right py-1">{Number(item.netAmount || 0)}</td>
                </tr>

                <tr>
                  <td colSpan={5} className="pl-6 text-[10px] italic font-semibold pb-1">
                    GST {taxPercent}% {taxAmount > 0 ? Number(taxAmount.toFixed(2)) : ""} ||
                    {discAmt > 0 && `  Discount: ${Number(discAmt.toFixed(2))}`}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-dashed border-black pt-2 mb-4">
        {bill.additionalCharges?.length > 0 && (
          <div className="flex justify-end text-sm">
            <span className="text-right mr-2 capitalize">Additional Charge</span>:<span className="w-20 text-right">{Number(bill.additionalCharges?.reduce((acc, charge) => acc + (charge.totalAmount || 0), 0)?.toFixed(2) || 0)}</span>
          </div>
        )}

        {bill.totalDiscount > 0 && (
          <div className="flex justify-end text-sm">
            <span className="text-right mr-2 capitalize">Discount</span>:<span className="w-20 text-right">{Number(bill.totalDiscount?.toFixed(2) || 0)}</span>
          </div>
        )}

        {bill.flatDiscountAmount > 0 && (
          <div className="flex justify-end text-sm">
            <span className="text-right mr-2 capitalize">Flat Discount</span>:<span className="w-20 text-right">{Number(bill.flatDiscountAmount?.toFixed(2) || 0)}</span>
          </div>
        )}
        {bill.roundOff > 0 && (
          <div className="flex justify-end text-sm">
            <span className="text-right mr-2 capitalize">Round Off</span>:<span className="w-20 text-right">{Number(bill.roundOff?.toFixed(2) || 0)}</span>
          </div>
        )}

        <div className="flex justify-end font-bold text-xl">
          <span className="text-right mr-2 capitalize">Total</span>:<span className="w-20 text-right">{Number(bill.totalAmount?.toFixed(2) || 0)}</span>
        </div>
      </div>

      {/* Summary */}
      {/* <div className="border-y border-dashed border-black py-2 text-center font-bold mb-4">
        <div>PIECES PURCHASED: {Number(totalQty.toFixed(2))}</div>
        <div>DISCOUNT ITEMS: {Number(totalDiscount.toFixed(2))}</div>
      </div> */}
      <Divider className="my-2! border-dashed! border-black!" />
      {/* Footer */}
      <div className="text-center font-bold mb-3">Thank You For Shopping At {bill?.companyId?.name}</div>

      <div className="flex justify-between text-sm font-bold">
        <span>Printed On: {FormatDateTime(new Date())}</span>
      </div>
    </div>
  );
});

export default LastBillReceipt;
