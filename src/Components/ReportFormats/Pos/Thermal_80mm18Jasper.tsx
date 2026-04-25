import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm18Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "Rajapath Rangaoli Road Kurumbapet-605001";
  const companyFssai = (bill?.companyId as any)?.fssaiNo || "12345678910234";
  const companyGst = (bill?.companyId as any)?.gstNo || "34AACCC1596Q002";
  const companyEmail = bill?.companyId?.email || "circleastar009@gmail.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "9723455646";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "Puducherry";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Cash Sales";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Kurumbapet";

  const orderNo = bill?.orderNo || "POS3353";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "05/01/2024";
  const invoiceTime = bill?.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "11:20";
  
  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 2;
  const totalAmount = bill?.totalAmount || 210.200;
  const roundOff = bill?.roundOff || -0.200;
  const tendered = bill?.multiplePayments?.[0]?.amount || 210.000;
  const change = bill?.changeAmount || 0.000;
  const discountItemsCount = bill?.items?.filter((i: any) => Number(i.discountAmount) > 0).length || 2;
  const totalDiscount = bill?.totalDiscount || 15.000;
  const paymentMode = bill?.multiplePayments?.[0]?.method || "CASH";

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}
      <div className="text-center mb-2">
        <img src={logo} alt="logo" className="h-12 object-contain mx-auto" />
      </div>

      {/* Invoice No */}
      <div className="text-center font-bold text-[13px]">Invoice No.</div>
      <div className="text-center font-bold text-[13px]">{orderNo}</div>

      {/* Address */}
      <div className="text-center text-[10px] mt-1 leading-snug">
        {companyAddress}
        <br />
        {companyFssai && `FSSAI No. ${companyFssai}`}
        {companyFssai && <br />}
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
          <span>Date : {invoiceDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile : {customerPhone}</span>
          <span>Time : {invoiceTime}</span>
        </div>
        <div>Invoice No : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-5 font-bold text-[10px]">
        <span>#</span>
        <span>Item</span>
        <span className="text-center">MRP</span>
        <span className="text-center">Disc</span>
        <span className="text-right">Net Amt.</span>
      </div>

      {/* Items */}
      <div className="mt-1 text-[10px]">
        {bill?.items?.map((item: any, i: number) => {
          const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100).toFixed(0) : 0;
          return (
            <div className="grid grid-cols-5 mt-1" key={i}>
              <span>{i + 1}</span>
              <span>
                {item.productId?.name || "Product"} <br />
                <span className="text-[9px]">MRP {item.mrp || 0} GST {taxPct}%</span>
              </span>
              <span className="text-center">{Number(item.mrp || 0).toFixed(3)}</span>
              <span className="text-center">{Number(item.discountAmount || 0).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount || 0).toFixed(3)}</span>
            </div>
          );
        }) || (
          <>
            <div className="grid grid-cols-5">
              <span>1</span>
              <span>
                Aay <br />
                <span className="text-[9px]">GST 18%</span>
              </span>
              <span className="text-center">150.000</span>
              <span className="text-center">10.00</span>
              <span className="text-right">165.200</span>
            </div>

            <div className="grid grid-cols-5 mt-1">
              <span>2</span>
              <span>
                SYS SAWAI ADAI <br />
                <span className="text-[9px]">MRP 300g GST 12%</span>
              </span>
              <span className="text-center">50.000</span>
              <span className="text-center">10.0%</span>
              <span className="text-right">45.000</span>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[11px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{Number(totalAmount).toFixed(3)}</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{Number(roundOff).toFixed(3)}</span>
        </div>
        <div className="flex justify-between uppercase">
          <span>BY {paymentMode}</span>
          <span>{Number(tendered).toFixed(3)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Summary */}
      <div className="text-center font-bold text-[10px]">NO OF QTY : {Number(totalQty).toFixed(0)} | DISCOUNT ITEMS : {discountItemsCount}</div>
      <div className="text-center text-[10px]">TENDERED : {Number(tendered).toFixed(3)} | CHANGE : {Number(change).toFixed(3)}</div>

      {/* Highlight Savings */}
      <div className="text-center font-bold text-[16px] mt-2">You Saved Rs : {Number(totalDiscount).toFixed(3)}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Amount words */}
      <div className="text-[10px]">Rupees Two Hundred and Ten Only</div>
      <div className="text-[10px]">Prices are inclusive of all taxes - Place of Supply : {placeOfSupply}</div>

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
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
            const cgst = (item.taxAmount || 0) / 2;
            const sgst = (item.taxAmount || 0) / 2;

            if (!taxPct) return null;

            return (
              <tr key={i}>
                <td className="border-r border-black p-1">{Number(taxable).toFixed(3)}</td>
                <td className="border-r border-black p-1">{Number(cgst).toFixed(3)}</td>
                <td className="border-r border-black p-1">{Number(sgst).toFixed(3)}</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
            );
          }) || (
            <>
              <tr>
                <td className="border-r border-black p-1">40.179</td>
                <td className="border-r border-black p-1">2.411</td>
                <td className="border-r border-black p-1">2.411</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">140.000</td>
                <td className="border-r border-black p-1">12.600</td>
                <td className="border-r border-black p-1">12.600</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Note */}
      <div className="text-[9px] mt-2">For better lasting use the jewelry OCCASIONALLY...</div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="text-center font-bold mt-2">Thank you for shopping with us</div>
      <div className="text-center font-bold">For Home Delivery</div>
      <div className="text-center font-bold text-[14px]">{companyPhone}</div>

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2 border-t border-dashed pt-1">
        <span>Printed On: {new Date().toLocaleDateString("en-GB")} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>E & O.E</span>
      </div>
    </div>
  );
});
export default Thermal_80mm18Jasper;
