import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const Thermal_80mm11Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);

  if (!bill) return null;

  const companyName = bill.companyId?.name || company?.name;

  const servedBy = `${(bill as any).createdById?.firstName || "Variety Dry Fruit"} ${(bill as any).createdById?.lastName || "Stores"}`.trim();

  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "02/05/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "05:44 PM";

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
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-2">
        <img src={company?.reportFormatLogo || "/logo.png"} alt="reportFormatLogo" className="w-16 h-16 object-contain" />
      </div>

      {/* Address */}
      <div className="text-center text-[10px] leading-snug">
        <div className="text-[10px] w-50 mx-auto">{getCompanyAddress()}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-4 font-bold">
        <span>Items</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Price</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Item */}
      {bill.items?.map((item: any, i: number) => (
        <div key={i} className="mt-1">
          <div className="grid grid-cols-4">
            {/* <span className="font-bold">{item?.productId?.sku || "RC50024"}</span> */}
            <div className="font-bold">{item?.productId?.name || "Product name"}</div>
            <span className="text-center">{Number(item?.qty || 0).toFixed(3)}</span>
            <span className="text-center">{Number(item?.mrp || 0).toFixed(3)}</span>
            <span className="text-right">{Number(item?.netAmount || 0).toFixed(3)}</span>
          </div>
        </div>
      )) || (
        <div className="mt-1">
          <div className="grid grid-cols-4">
            <span className="font-bold">RC50024</span>
            <span className="text-center">1.000</span>
            <span className="text-center">241.935</span>
            <span className="text-right">200.000</span>
          </div>

          <div className="mt-1 font-bold">Product nameBlue /</div>
          <div className="text-[10px]">1</div>

          <div className="text-[10px] mt-1 leading-snug">Description:The highlight of this t-shirt product description is the use of bullet points to highlight the prima</div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Total Items */}
      <div className="flex justify-between font-bold">
        <span>Total item sold :</span>
        <span>{bill?.totalQty?.toFixed(2)}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Currency */}
      <div className="flex justify-between font-bold">
        <span>Net Amount</span>
        <span>INR</span>
        <span>{Number(bill.totalAmount || 0).toFixed(3)}</span>
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

      {/* Divider Stars */}
      <div className="text-center my-1">***</div>

      {/* Served */}
      <div className="text-center text-[10px]">Served by: {servedBy}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Date / Time / Receipt */}
      <div className="grid grid-cols-3 text-[10px] font-bold">
        <span>Date</span>
        <span className="text-center">Time</span>
        <span className="text-right">Receipt</span>
      </div>

      <div className="grid grid-cols-3 text-[10px]">
        <span>{createdDate}</span>
        <span className="text-center">{createdTime}</span>
        <span className="text-right">{bill.orderNo || "-"}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Footer */}
      <div className="text-center font-bold">Thank You For Shopping</div>
      <div className="text-center">Keep Your bills for Exchange</div>

      <div className="text-center mt-1 text-[10px]">Powered by {companyName}</div>
    </div>
  );
});

export default Thermal_80mm11Jasper;
