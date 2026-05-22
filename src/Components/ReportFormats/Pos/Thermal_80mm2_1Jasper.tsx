import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm2_1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "VASY ERP SOLUTIONS PRIVATE LIMITED";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "D-804, THE FIRST, B/H KESHAVBAUG PARTY PLOT, VASTRAPUR";
  const companyCity = (bill.companyId?.address as any)?.[0]?.city?.name || "AHMEDABAD";
  const companyState = (bill.companyId?.address as any)?.[0]?.state?.name || "Gujarat";
  const companyZip = (bill.companyId?.address as any)?.[0]?.pincode || "123458";
  const companyEmail = bill.companyId?.email || "dharmendra@vasyerp.com";
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || "7575061808";
  const companyGst = (bill.companyId as any)?.gstNo || "24AACCC1186G2S";

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Cash Sales";
  const customerPhone = bill.customerId?.phoneNo?.phoneNo || "";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "ADALAJ AHMEDABAD";

  const orderNo = bill.orderNo || "POS6869";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "03/07/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "06:07 PM";

  const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1;
  const netAmount = bill.totalAmount || 210.00;
  const roundOff = bill.roundOff || 0.00;

  return (
    <div ref={ref} className="w-[80mm] mx-auto text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header */}
      <div className="text-center font-bold uppercase">{companyName}</div>

      <div className="text-center mt-1 font-bold">Invoice</div>

      <div className="text-center text-[10px] leading-snug">
        {companyAddress}, {companyCity}-{companyZip}
        <br />
        GSTIN NO : {companyGst}
        <br />
        Email : {companyEmail}
        <br />
        Phone No : {companyPhone}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Meta */}
      <div className="text-[10px]">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile : {customerPhone}</span>
          <span>Time : {createdTime}</span>
        </div>
        <div>Invoice No : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-5 font-bold text-[10px]">
        <span>#</span>
        <span>Item</span>
        <span className="text-center">Qty</span>
        <span className="text-center">MRP</span>
        <span className="text-right">Net Amt.</span>
      </div>

      {/* Item */}
      {bill.items?.map((item: any, i: number) => {
        const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100).toFixed(0) : "5";
        return (
          <div key={i} className="mt-1 text-[10px]">
            <div className="grid grid-cols-5">
              <span>{i + 1}</span>
              <span>
                {item.productId?.name || "Format 4"}
                <div className="text-[9px] font-bold">HSN: {item.productId?.hsnCode || "12345678"} GST {taxPct}%</div>
              </span>
              <span className="text-center">{Number(item.qty || 1).toFixed(3)}</span>
              <span className="text-center">{Number(item.mrp || 200).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount || 210).toFixed(2)}</span>
            </div>
          </div>
        );
      }) || (
        <div className="mt-1 text-[10px]">
          <div className="grid grid-cols-5">
            <span>1</span>
            <span>
              Format 4<div className="text-[9px] font-bold">HSN: 12345678 GST 5%</div>
            </span>
            <span className="text-center">1.000</span>
            <span className="text-center">200.00</span>
            <span className="text-right">210.00</span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[10px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{netAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{roundOff.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>BY CASH</span>
          <span>{netAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Tender */}
      <div className="text-center text-[10px] font-bold">NO OF QTY : {totalQty.toFixed(0)}</div>
      <div className="text-center text-[10px]">TENDERED : {netAmount.toFixed(2)} | CHANGE : 0.00</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Amount in words */}
      <div className="text-[10px]">Rupees Two Hundred and Ten Only</div>
      <div className="text-[10px]">Prices are inclusive of all taxes - Place of Supply : {companyState}</div>

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
            <td className="border-r border-black p-1">200.00</td>
            <td className="border-r border-black p-1">5.00</td>
            <td className="border-r border-black p-1">5.00</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="p-1">0.00</td>
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
        <div className="font-bold">T & C</div>
        <div>id and password must be required</div>
        <div>Exchanges will only be allowed within 10 days</div>
        <div>Any Complaint Regarding the Quality should be discussed within 2-3 days</div>
        {bill.remark && <div>Remark: {bill.remark}</div>}
      </div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="text-center mt-2 font-bold">Thank you for shopping with us</div>
      <div className="text-center font-bold text-[14px]">For Home Delivery</div>
      <div className="text-center font-bold text-[14px]">{companyPhone}</div>

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {createdDate} {createdTime}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});
export default Thermal_80mm2_1Jasper;
