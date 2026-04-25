import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const item = bill.items?.[0];

  const companyName = bill.companyId?.name || "Company Name";
  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Walk in Customer";
  const customerPhone = bill.customerId?.phoneNo?.phoneNo ? `${bill.customerId.phoneNo.countryCode || ""} ${bill.customerId.phoneNo.phoneNo}` : "";
  const customerAddress = bill.customerId?.address?.[0]?.addressLine1 || "";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "";

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}
      <div className="flex justify-center mb-1">
        <img src={(bill.companyId as any)?.logo || "/logo.png"} alt="logo" className="w-14 h-14 object-contain" />
      </div>

      {/* Company Info */}
      <div className="text-center">
        <div className="font-bold">{companyName}</div>
        <div className="text-[10px]">SHOP NO-114, UPPER GROUND FLOOR VYARA</div>
        <div className="text-[10px]">MARK, OPP. CENTRAL BANK</div>
        <div className="text-[10px]">Adajan, Gujarat, India</div>

        <div className="mt-2 font-bold">Tax Invoice</div>
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

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="flex justify-between font-bold text-[10px]">
        <span># Item</span>
        <span>Qty</span>
        <span>MRP</span>
        <span>Net Amt.</span>
      </div>

      {/* Item */}
      <div className="mt-1 text-[10px]">
        <div className="font-bold">{item?.productId?.name || "Product Name"}</div>
        <div className="italic text-[9px]">
          HSN: {item?.productId?.hsnCode || "N/A"} | GST {item?.productId?.salesTaxId?.percentage || 0}%
        </div>

        <div className="flex justify-between mt-1">
          <span>1</span>
          <span>{Number(item?.qty || 0).toFixed(3)}</span>
          <span>{Number(item?.mrp || 0).toFixed(2)}</span>
          <span>{Number(item?.netAmount || 0).toFixed(2)}</span>
        </div>
        <div className="italic text-[9px] mt-1">Description : The product is available in the store</div>
        {/* {item?.description && <div className="italic text-[9px] mt-1">Description : {item.description}</div>} */}
      </div>

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
        <div>PIECES PURCHASED : {Number(item?.qty || 0).toFixed(2)}</div>
        <div>DISCOUNT ITEMS : {item?.discountAmount ? "1.00" : "0.00"}</div>
        <div>TOTAL SAVINGS : {Number(bill.totalDiscount || 0).toFixed(2)}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Tax Summary */}
      <div className="text-center font-bold text-[10px] mb-1">TAX SUMMARY</div>

      <table className="w-full text-[9px] border border-black text-center">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black p-1">TAXABLE VALUE</th>
            <th className="border-r border-black p-1">CGST</th>
            <th className="border-r border-black p-1">SGST</th>
            <th className="border-r border-black p-1">Cess</th>
            <th className="p-1">IGST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r border-black p-1">200.50</td>
            <td className="border-r border-black p-1">89.32</td>
            <td className="border-r border-black p-1">89.32</td>
            <td className="border-r border-black p-1">N/A</td>
            <td className="p-1">N/A</td>
          </tr>
        </tbody>
      </table>

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

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {new Date().toLocaleString()}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});
export default Thermal_80mm1Jasper;
