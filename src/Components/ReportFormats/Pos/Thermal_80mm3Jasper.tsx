import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm3Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "BACHAT MALL";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "New Memnagar null, Kampot, India";
  const companyFssai = (bill.companyId as any)?.fssaiNo || "11522051000075";
  const companyGst = (bill.companyId as any)?.gstNo || "34AACCC1596Q002";
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || "7972596938";

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Kush Patariya";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "SHARDHA petrol pump, Memnagar near...";

  const orderNo = bill.orderNo || "V2-POS1412";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "28/04/2025";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "15:55:09";

  const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1;
  const netAmount = bill.totalAmount || 245.00;
  const roundOff = bill.roundOff || -0.29;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Duplicate */}
      <div className="text-center font-bold">(Duplicate)</div>

      {/* Header */}
      <div className="text-center font-bold text-[14px] mt-1">{companyName}</div>

      <div className="text-center text-[10px]">
        {companyAddress}
        <br />
        FSSAI No. {companyFssai}
        <br />
        GSTIN No : {companyGst}
        <br />
        Phone No. {companyPhone}
      </div>

      <div className="text-center font-bold mt-2">Invoice</div>

      {/* Meta */}
      <div className="text-[10px] mt-2">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate} {createdTime}</span>
        </div>
        <div>Invoice No. : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-5 font-bold text-[10px]">
        <span>#</span>
        <span>Item Name</span>
        <span className="text-center">MRP</span>
        <span className="text-center">Rate</span>
        <span className="text-right">Net Amt.</span>
      </div>

      <div className="text-[9px] font-bold">HSN</div>

      {/* Item */}
      {bill.items?.map((item: any, i: number) => {
        const rate = (Number(item.mrp || 0) - Number(item.discountAmount || 0) / Number(item.qty || 1));
        return (
          <div key={i} className="mt-1 text-[10px]">
            <div className="grid grid-cols-5">
              <span>{i + 1}</span>
              <span>
                {item.productId?.name || "Prod"}
                <div className="text-[9px] font-bold">{item.productId?.hsnCode || ""}</div>
              </span>
              <span className="text-center">{Number(item.mrp || 151.54).toFixed(2)}</span>
              <span className="text-center">{Number(rate || 127.29).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount || 127.29).toFixed(2)}</span>
            </div>

            <div className="text-center mt-1">{Number(item.qty || 1).toFixed(2)}</div>
          </div>
        );
      }) || (
        <div className="mt-1 text-[10px]">
          <div className="grid grid-cols-5">
            <span>1</span>
            <span>Prod</span>
            <span className="text-center">151.54</span>
            <span className="text-center">127.29</span>
            <span className="text-right">127.29</span>
          </div>

          <div className="text-center mt-1">1.00</div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Charges */}
      <div className="text-[10px]">
        {bill.additionalCharges?.map((charge: any, i: number) => (
          <div key={i} className="flex justify-between">
            <span>{charge.name || "Transport Charge"}</span>
            <span>{Number(charge.amount || 118.0).toFixed(2)}</span>
          </div>
        )) || (
          <div className="flex justify-between">
            <span>Transport Charge</span>
            <span>118.0</span>
          </div>
        )}

        <div className="flex justify-between font-bold mt-1">
          <span>ADDITIONAL CHARGE</span>
          <span>{bill.additionalCharges?.reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0).toFixed(2) || "118.00"}</span>
        </div>
      </div>

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

      {/* Summary */}
      <div className="text-center text-[10px] font-bold">
        <div>PIECES PURCHASED : {totalQty.toFixed(2)}</div>
        <div>DISCOUNT ITEMS : 0.00</div>
        <div>TENDERED : {netAmount.toFixed(2)}</div>
        <div>CHANGE : 0.00</div>
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
            <td className="border-r border-black p-1">113.65</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="border-r border-black p-1">N/A</td>
            <td className="p-1">13.64</td>
          </tr>
        </tbody>
      </table>

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div className="text-[9px]">Address : {customerAddress}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* T&C */}
      <div className="text-[9px]">
        <div className="font-bold">T & C</div>
        <div>1. Ae Pure ke pure paise dene h...</div>
        <div>2. VYAJI BHAV AE J MALE</div>
        <div>3. Hello Customers</div>
        <div>4. Vyajji bhav</div>
        {bill.remark && <div>Remark: {bill.remark}</div>}
      </div>

      {/* Footer */}
      <div className="text-center font-bold mt-2">Thank you for shopping with us!</div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {createdDate} {createdTime}</span>
        <span>E & O.E</span>
      </div>
    </div>
  );
});

export default Thermal_80mm3Jasper;
