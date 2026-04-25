import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A5_1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "BACHAT MALL";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "6 MG ROAD MAHARASHTRA CAMP PUNE-411001";
  const companyCity = (bill.companyId?.address as any)?.[0]?.city?.name || "Amravati Nagpur";
  const companyState = (bill.companyId?.address as any)?.[0]?.state?.name || "Maharashtra";
  const companyCountry = (bill.companyId?.address as any)?.[0]?.country?.name || "India";
  const companyGst = (bill.companyId as any)?.gstNo || "34AACCC1596Q002";
  const companyEmail = bill.companyId?.email || "ritulkhokhar1@vasyerp.com";
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || "+91-6354158555";

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Demo Company For testing char";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "Kurumbapet";
  const placeOfSupply = (bill.customerId?.address as any)?.[0]?.city?.name || "Puducherry";

  const orderNo = bill.orderNo || "POT00141";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "19/11/2025";

  const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1;
  const subTotal = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.mrp) * Number(item.qty) || 0), 0) || 1400;
  const totalTax = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.taxAmount) || 0), 0) || 16.07;
  const totalNet = bill.totalAmount || 150.00;
  const roundOff = bill.roundOff || 0.00;
  const addDiscount = bill.totalDiscount || 1116.07;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-6 text-[12px] font-serif">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-2">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={(bill.companyId as any)?.logo || "/logo.png"}
            className="w-16 h-16 object-contain"
            alt="logo"
          />
          <div>
            <div className="font-bold text-[20px]">{companyName}</div>
            <div className="text-[11px] leading-tight">{companyAddress} {companyCity}, {companyState}, {companyCountry}</div>
            <div className="text-[11px]">GSTIN NO : {companyGst} | Email : {companyEmail} | Customer Care : {companyPhone}</div>
          </div>
        </div>
      </div>

      {/* Buyer + Order */}
      <div className="grid grid-cols-2 border-b py-2 text-[12px]">
        <div>
          <div>
            <b>Buyer</b> : {customerName}
          </div>
          <div>
            <b>Place Of Supply</b> : {placeOfSupply}
          </div>
        </div>
        <div className="text-right">
          <div>
            <b>Order No.</b> : {orderNo}
          </div>
          <div>
            <b>Date</b> : {createdDate}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[11px] mt-2">
        <thead>
          <tr className="border bg-gray-100">
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Unit Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Discount2</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Taxable Value</th>
            <th className="border p-1">Tax(%)</th>
            <th className="border p-1">Tax Amount</th>
            <th className="border p-1">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100).toFixed(1) : "12.0";
            const taxable = (item.netAmount || 150) - (item.taxAmount || 0);

            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  {item.productId?.name || "FGHG78"} <br />
                  <span className="text-[10px]">Item Code : {item.productId?.sku || "AAAADLD404"}</span>
                </td>
                <td className="border p-1 text-center">{Number(item.qty || 1).toFixed(1)}</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "g"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 1400).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 150).toFixed(2)}</td>
                <td className="border p-1 text-right">0.00</td>
                <td className="border p-1 text-right">{Number(item.mrp || 1400).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(taxable || 133.93).toFixed(2)}</td>
                <td className="border p-1 text-center">{taxPct}</td>
                <td className="border p-1 text-right">{Number(item.taxAmount || 16.07).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 150).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">
                FGHG78 <br />
                <span className="text-[10px]">Item Code : AAAADLD404</span>
              </td>
              <td className="border p-1 text-center">1.0</td>
              <td className="border p-1 text-center">g</td>
              <td className="border p-1 text-right">1,400.00</td>
              <td className="border p-1 text-right">150.00</td>
              <td className="border p-1 text-right">0.00</td>
              <td className="border p-1 text-right">1,400.00</td>
              <td className="border p-1 text-right">133.93</td>
              <td className="border p-1 text-center">12.0</td>
              <td className="border p-1 text-right">16.07</td>
              <td className="border p-1 text-right">150.00</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="border border-t-0 p-1 text-right font-bold">Total : {totalQty.toFixed(2)}</div>

      {/* Tax Summary + Totals */}
      <div className="grid grid-cols-2 mt-3 gap-4">
        {/* Tax Summary */}
        <div>
          <div className="font-bold border p-1 text-center">Tax Summary</div>

          <table className="w-full border text-[11px]">
            <thead>
              <tr>
                <th className="border p-1">TAXABLE VALUE</th>
                <th className="border p-1">CGST</th>
                <th className="border p-1">SGST</th>
                <th className="border p-1">CESS</th>
                <th className="border p-1">IGST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1 text-center">133.93</td>
                <td className="border p-1 text-center">8.04</td>
                <td className="border p-1 text-center">8.04</td>
                <td className="border p-1 text-center">N/A</td>
                <td className="border p-1 text-center">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="text-right text-[12px]">
          <div>Sub Total : {subTotal.toFixed(2)}</div>
          <div>Tax Amount : {totalTax.toFixed(2)}</div>
          <div>Additional Discount : {addDiscount.toFixed(2)}</div>
          <div>BY CASH : {totalNet.toFixed(2)}</div>
          <div>Round Off : {roundOff.toFixed(2)}</div>
          <div>Due Amount : 0.00</div>
        </div>
      </div>

      {/* Customer */}
      <div className="mt-3 text-[12px]">
        <div>Rupees One Hundred and Fifty Only</div>

        <div className="font-bold mt-1">CUSTOMER DETAILS</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Terms */}
      <div className="mt-3 text-[12px]">
        <div className="font-bold">Terms & Conditions</div>
        <div>No Warranty.</div>
        <div>No Change.</div>
        <div>No Return.</div>
      </div>

      {/* Signature */}
      <div className="mt-10 text-right">
        <div className="border-t w-48 ml-auto" />
        <div>Authorised Signatory</div>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-6 text-[10px] border-t pt-1">
        <span>This is computer generated Invoice.</span>
        <span>Page 1 of 1</span>
        <span>Next &gt;&gt;</span>
      </div>
    </div>
  );
});
export default A5_1Jasper;
