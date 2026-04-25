import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm11Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "AI Setu";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "Synthesis The First, Corporate House, THE FIRST,\nA5, Nyay Marg, near Ltc Narmada, I I M, Vastrapur,";
  const companyCity = (bill.companyId?.address as any)?.[0]?.city?.name || "Ahmedabad";
  const companyState = (bill.companyId?.address as any)?.[0]?.state?.name || "Gujarat";
  const companyCountry = (bill.companyId?.address as any)?.[0]?.country?.name || "India";
  const companyZip = (bill.companyId?.address as any)?.[0]?.pincode || "380054";

  const servedBy = `${(bill as any).createdById?.firstName || "Variety Dry Fruit"} ${(bill as any).createdById?.lastName || "Stores"}`.trim();

  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "02/05/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "05:44 PM";

  const totalItems = bill.items?.reduce((acc: number, curr: any) => acc + (Number(curr.qty) || 0), 0) || 1;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-2">
        <img src={(bill.companyId as any)?.logo || "/logo.png"} alt="logo" className="w-14 h-14 object-contain mb-1" />
        {/* <div className="text-[26px] font-extrabold tracking-wide">
          <span className="">{companyName}</span>
        </div> */}
      </div>

      {/* Address */}
      <div className="text-center text-[10px] leading-snug">
        <div className="whitespace-pre-wrap">{companyAddress}</div>
        <div>{`${companyCity} , ${companyState} , ${companyCountry} , ${companyZip}`}</div>
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
            <span className="font-bold">{item?.productId?.sku || "RC50024"}</span>
            <span className="text-center">{Number(item?.qty || 1).toFixed(3)}</span>
            <span className="text-center">{Number(item?.mrp || 241.935).toFixed(3)}</span>
            <span className="text-right">{Number(item?.netAmount || 200).toFixed(3)}</span>
          </div>

          <div className="mt-1 font-bold">{item?.productId?.name || "Product name"}</div>
          <div className="text-[10px]">{i + 1}</div>

          {item?.description && (
            <div className="text-[10px] mt-1 leading-snug">Description: {item.description}</div>
          )}
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
        <span>{totalItems.toFixed(3)}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Currency */}
      <div className="flex justify-between font-bold">
        <span>Net Amount</span>
        <span>INR</span>
        <span>{Number(bill.totalAmount || 200).toFixed(3)}</span>
      </div>

      <div className="flex justify-between mt-1">
        <span>Change</span>
        <span>{Number(bill.roundOff || 0).toFixed(3)}</span>
      </div>

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
        <span className="text-right">{bill.orderNo || "POS3617"}</span>
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
