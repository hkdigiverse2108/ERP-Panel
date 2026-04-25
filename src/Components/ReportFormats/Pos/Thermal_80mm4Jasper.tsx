import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm4Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "AI Setu ERP Solutions Private Limited";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "SHOP NO.1-14, UPPER GROUND FLOOR NEAR KOTAK BANK CIRCLE, GHODDOD ROAD";
  const companyCity = (bill.companyId?.address as any)?.[0]?.city?.name || "Adajan";
  const companyZip = (bill.companyId?.address as any)?.[0]?.pincode || "380015";
  const companyEmail = bill.companyId?.email || "circleastar09@gmail.com";

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Cash Sales";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "Adityana,Gujarat,India";

  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "27/04/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "07:02:52 PM";

  const totalItemsQty = bill.items?.reduce((acc: number, curr: any) => acc + (Number(curr.qty) || 0), 0) || 1;
  const grossAmount = bill.totalAmount || 2010.00; // normally gross = sum of item MRPs, just an approximation
  const netAmount = bill.totalAmount || 2366.00;
  const totalDiscount = bill.totalDiscount || 25.05;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header with Logo */}
      <div className="flex flex-col items-center justify-center mb-2">
        {/* <img src={(bill.companyId as any)?.logo || "/logo.png"} alt="logo" className="w-14 h-14 object-contain mb-1" /> */}
        <div className="text-center font-bold text-[13px]">{companyName}</div>
      </div>

      <div className="text-center text-[10px]">{companyAddress} {companyCity}-{companyZip}</div>

      <div className="text-center text-[10px]">{companyEmail}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Meta */}
      <div className="text-[10px]">
        <div className="flex justify-between">
          <span>Bill No. : {bill.orderNo || "POS2961"}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span></span>
          <span>Time : {createdTime}</span>
        </div>

        <div className="mt-1">
          <div>Name : {customerName}</div>
          <div>Address : {customerAddress}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Item Header */}
      <div className="text-center font-bold border-y border-black py-1">ITEM NAME</div>

      {/* Columns */}
      <div className="grid grid-cols-4 font-bold text-[10px] mt-1">
        <span>Quantity</span>
        <span className="text-center">RATE</span>
        <span className="text-center">Discount</span>
        <span className="text-right">NET AMOUNT</span>
      </div>

      {/* Item */}
      {bill.items?.map((item: any, i: number) => (
        <div key={i} className="text-[10px] mt-1">
          <div className="font-bold">{item.productId?.name || "Test demo yellow"}</div>
          {item.description && <div className="text-[9px] italic">Description : {item.description}</div>}

          <div className="flex justify-between mt-1">
            <span>Qty: {Number(item.qty || 1).toFixed(3)}</span>
            <span>Rate: {Number(item.mrp || 2010).toFixed(2)}</span>
            <span>Disc: {Number(item.discountAmount || 500).toFixed(2)}</span>
          </div>

          <div className="text-right font-bold mt-1">GST : {(item.taxAmount ? ((item.taxAmount / item.mrp) * 100).toFixed(2) : "9.00")}% &nbsp;&nbsp; {Number(item.netAmount || 2163.60).toFixed(2)}</div>
        </div>
      )) || (
        <div className="text-[10px] mt-1">
          <div className="font-bold">Test demo yellow</div>
          <div className="text-[9px] italic">Description : The product is available in the store with a stock of 21,5L & 7L</div>

          <div className="flex justify-between mt-1">
            <span>Qty: 1.000</span>
            <span>Rate: 2010.00</span>
            <span>Disc: 500</span>
          </div>

          <div className="text-right font-bold mt-1">GST : 9.00% &nbsp;&nbsp; 2163.60</div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Totals */}
      <div className="flex justify-between font-bold">
        <span>QTY TOTAL: {totalItemsQty.toFixed(2)}</span>
        <span>AMT TOTAL: {Number(netAmount).toFixed(2)}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Payment Summary */}
      <div className="text-center font-bold">PAYMENT SUMMARY</div>

      <div className="text-[10px] mt-1">
        <div className="flex justify-between">
          <span>Gross Amount :</span>
          <span>{Number(grossAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Net Amount :</span>
          <span>{Number(netAmount).toFixed(2)}</span>
        </div>

        <div className="text-center font-bold mt-1">You Saved : {Number(totalDiscount).toFixed(2)}</div>

        <div className="text-center text-[9px]">&lt;-- Amount Received From Customer --&gt;</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* GST Summary */}
      <div className="text-center text-[10px] font-bold mb-1">&lt;-- GST Breakup Details --&gt;</div>

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
            <td className="border-r border-black p-1">2005.00</td>
            <td className="border-r border-black p-1">89.32</td>
            <td className="border-r border-black p-1">89.32</td>
            <td className="border-r border-black p-1">N/A</td>
            <td className="p-1">N/A</td>
          </tr>
        </tbody>
      </table>

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Terms */}
      <div className="text-[9px]">
        <div className="font-bold">Terms & Conditions :</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
        <div className="font-bold">Remark: {bill.remark || "This is test remark"}</div>
      </div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {createdDate} {createdTime}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default Thermal_80mm4Jasper;
