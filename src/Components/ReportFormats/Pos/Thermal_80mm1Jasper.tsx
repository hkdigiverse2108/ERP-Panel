import { forwardRef, Fragment } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { POS_ORDER_STATUS, RETURN_POS_ORDER_TYPE } from "../../../Data";

const Thermal_80mm1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyName = bill.companyId?.name || company?.name;
  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Walk in Customer";
  const customerPhone = bill.customerId?.phoneNo?.phoneNo ? `${bill.customerId.phoneNo.countryCode || ""} ${bill.customerId.phoneNo.phoneNo}` : "";
  const customerAddress = bill.customerId?.address?.[0]?.addressLine1 || "";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "";
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

  const getTaxPercent = (item: PosOrderBase["items"][number]) => {
    return item?.productId?.salesTaxId?.percentage || 0;
  };
  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}
      <div className="flex justify-center mb-1">
        <img src={company?.reportFormatLogo || "/logo.png"} alt="reportFormatLogo" className="w-14 h-14 object-contain" />
      </div>

      {/* Company Info */}
      <div className="text-center">
        <div className="font-bold">{companyName}</div>
        <div className="text-[10px] w-50 mx-auto">{getCompanyAddress()}</div>
        <div className="mt-2 font-bold">{[RETURN_POS_ORDER_TYPE.REFUND, RETURN_POS_ORDER_TYPE.SALES_RETURN, POS_ORDER_STATUS.RETURNED, POS_ORDER_STATUS.PARTIALLY_RETURNED].includes(bill?.status) ? "Return Invoice" : [POS_ORDER_STATUS.HOLD].includes(bill?.status) ? "Hold BIll" : "Tax Invoice"}</div>
      </div>

      {/* Meta Info */}
      <div className="mt-2 text-[10px]">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mob No. : {customerPhone}</span>
          <span>Invoice No. : {bill.orderNo}</span>
        </div>
      </div>

      <table className="w-full text-xs border-t border-dashed my-1">
        <thead>
          <tr className="border-b border-dashed">
            <th className="text-left py-1 w-[5%]">#</th>
            <th className="text-left w-[40%]">Item</th>
            <th className="text-center w-[10%]">Qty</th>
            <th className="text-center w-[15%]">MRP</th>
            <th className="text-center w-[10%]">GST</th>
            <th className="text-right w-[20%]">Net Amt.</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item, index) => {
            const taxPercent = getTaxPercent(item);
            const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);

            // const totalDiscAmt = (item.qty || 0) * (item.discountAmount || 0);
            const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);
            const taxAmount = item.productId?.isSalesTaxIncluding ? 0 : (net * taxPercent) / 100;
            return (
              <Fragment key={index}>
                <tr className="align-top">
                  <td className="py-1">{index + 1}</td>
                  <td className="py-1">
                    <div className="font-semibold">{item.productId?.name}</div>
                    {item.productId?.variant && <div className="text-xs">{item.productId.variant}</div>}
                  </td>
                  <td className="text-center py-1">{Number(item.qty || 0)}</td>
                  <td className="text-center py-1">{Number(item.mrp || 0)}</td>
                  <td className="text-center py-1">{Number(taxAmount.toFixed(2))}</td>
                  <td className="text-right py-1">{Number(item.netAmount || 0)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="pl-2 text-[8px] italic font-normal pb-1">
                    HSN: {item?.productId?.hsnCode || "N/A"} || GST {taxPercent}%{discAmt > 0 && `||  Discount: ${Number(discAmt.toFixed(2))}`}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[10px]">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span>{Number(bill.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>{Number(bill.totalDiscount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Round Off</span>
          <span>{Number(bill.roundOff || 0).toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between">
            <span>By {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Summary */}
      <div className="text-center font-bold text-[10px]">
        <div>PIECES PURCHASED : {Number(bill?.totalQty || 0).toFixed(2)}</div>
        <div>DISCOUNT ITEMS : {Number(bill.totalDiscount || 0).toFixed(2)}</div>
        <div>TOTAL SAVINGS : {Number(bill.totalDiscount || 0).toFixed(2)}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Terms */}
      <div className="text-[9px]">
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Customer */}
      <div className="text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress || "N/A"}</div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] mt-2">Thank You For Shopping At {companyName}</div>

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {new Date().toLocaleString()}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});
export default Thermal_80mm1Jasper;
