import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A5_2Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const item = bill.items?.[0];

  const companyName = bill.companyId?.name || "Company Name";
  const companyEmail = bill.companyId?.email || "";
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || "";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "";
  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Walk in Customer";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "";

  return (
    <div ref={ref} className="w-[148mm] mx-auto bg-white text-black font-mono text-[12px] p-6 leading-tight">
      {/* Logo */}
      <div className="flex justify-center mb-2">
        <img src={(bill.companyId as any)?.logo || "/logo.png"} alt="logo" className="w-16 h-16 object-contain" />
      </div>

      {/* Company Info */}
      <div className="text-center">
        <div className="font-bold text-[16px]">{companyName}</div>
        <div className="text-[11px]">{companyAddress}</div>
        <div className="text-[11px]">
          Email : {companyEmail} | Contact No. : {companyPhone}
        </div>
        <div className="text-[11px]">State : {(bill.companyId?.address as any)?.[0]?.city?.name || ""}</div>
      </div>

      {/* Meta */}
      <div className="mt-3 text-[12px]">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Invoice No. : {bill.orderNo}</span>
          <span></span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Table Header */}
      <div className="grid grid-cols-4 font-bold text-[12px]">
        <span>Sr.</span>
        <span>Item Name</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Item */}
      <div className="grid grid-cols-4 mt-2 text-[12px]">
        <span>1</span>
        <span>
          <div className="font-bold">{item?.productId?.name || "Product Name"}</div>
          {(item as any)?.description && <div className="text-[10px] italic">Description : {(item as any).description}</div>}
        </span>
        <span className="text-center">{Number(item?.qty || 0).toFixed(3)}</span>
        <span className="text-right">{Number(item?.mrp || 0).toFixed(2)}</span>
      </div>

      {/* Net Amt row */}
      <div className="flex justify-end text-[12px] mt-1">
        <span className="w-[200px] flex justify-between">
          <span>Net Amt.</span>
          <span>{Number(item?.netAmount || 0).toFixed(2)}</span>
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Charges */}
      <div className="text-[12px]">
        {bill.additionalCharges?.map((charge: any, i) => (
          <div key={i} className="flex justify-between">
            <span>{charge.name || "Additional Charge"}</span>
            <span>{Number(charge.totalAmount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Totals */}
      <div className="text-[12px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{Number(bill.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{Number(bill.roundOff || 0).toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between">
            <span>BY {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Summary */}
      <div className="text-center font-bold text-[12px]">
        <div>PIECES PURCHASED : {Number(item?.qty || 0).toFixed(0)}</div>
        <div>DISCOUNT ITEMS : {item?.discountAmount ? "1" : "0"}</div>
        <div>TOTAL SAVINGS : {Number(bill.totalDiscount || 0).toFixed(2)}</div>
        <div>YOUR EXTRA SAVINGS : {Number(item?.additionalDiscountAmount || 0).toFixed(2)}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Tax Summary */}
      <div className="grid grid-cols-5 text-[11px] text-center font-bold border-y border-dashed py-2">
        <span>TAXABLE VALUE</span>
        <span>CGST</span>
        <span>SGST</span>
        <span>CESS</span>
        <span>IGST</span>
      </div>

      <div className="grid grid-cols-5 text-[11px] text-center py-2">
        <span>2005.00</span>
        <span>89.32</span>
        <span>89.32</span>
        <span>N/A</span>
        <span>N/A</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Customer */}
      <div className="text-[12px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress || "N/A"}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-3" />

      {/* Terms */}
      <div className="text-[11px]">
        <div>T & C</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4">Thank you for shopping at {companyName}</div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-12 w-[250px] bg-black" />
      </div> */}

      {/* Bottom */}
      <div className="flex justify-between text-[10px] mt-3">
        <span>Printed On: 01/05/2023 05:34 pm</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default A5_2Jasper;
