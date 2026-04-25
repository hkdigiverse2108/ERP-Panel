import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const PurchaseOrder1Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  // Extract values with fallbacks to original dummy data
  const companyName = bill?.companyId?.name || "DISPLAY - VASYERP";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "TIMCON SHOP NO.14, NR KATARIA, PETROL PUMP, ADARSH ROAD, BHAVNAGAR-605001";
  const companyEmail = bill?.companyId?.email || "karanmerchant@gmail.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "+91-9515047679";
  const companyGst = (bill?.companyId as any)?.gstNo || "34AACCC1596Q002";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Gujarat(24)";

  const vendorName = `${bill?.vendorId?.firstName || ""} ${bill?.vendorId?.lastName || ""}`.trim() || "karva enterprise";
  const vendorAddress = (bill?.vendorId?.address as any)?.[0]?.addressLine1 || "GSF, CITY CENTER, NEAR IDGH CIRCLE";
  const vendorCity = (bill?.vendorId?.address as any)?.[0]?.city?.name || "Anjar-";
  const vendorState = (bill?.vendorId?.address as any)?.[0]?.state?.name || "Gujarat";
  const vendorCountry = (bill?.vendorId?.address as any)?.[0]?.country?.name || "India";
  const vendorGst = (bill?.vendorId as any)?.gstNo || "24ACTPJ9050C1ZL";

  const orderNo = bill?.orderNo || "PORD500";
  const orderDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB").replace(/\//g, " ") : "06 08M 2025";
  const supplyDate = bill?.supplyDate ? new Date(bill.supplyDate).toLocaleDateString("en-GB").replace(/\//g, " ") : "06 08M 2025";
  const placeOfSupply = (bill?.vendorId?.address as any)?.[0]?.state?.name || "Gujarat";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1.00;
  const netAmount = bill?.totalAmount || 9.00;
  const roundOff = bill?.roundOff || 0.00;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[11px] border">
      {/* Header */}
      <div className="text-center border-b pb-2">
        <div className="font-bold text-[18px]">{companyName}</div>
        <div className="text-[11px]">{companyAddress}</div>
        <div>Email : {companyEmail} | Contact No : {companyPhone} | FSSAI No.</div>
        <div>GSTIN/UIN : {companyGst} State : {companyState}</div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2">
        <div className="border px-10 py-1 font-bold text-[15px]">Purchase Order</div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-2 border-b">
        {/* To */}
        <div className="border-r p-2">
          <div>To,</div>
          <div className="font-bold">{vendorName}</div>
          <div>{vendorAddress}</div>
          <div>{vendorCity}</div>
          <div>{vendorState}, {vendorCountry}</div>
          <div>Company GSTIN : {vendorGst}</div>
        </div>

        {/* Order Info */}
        <div className="p-2">
          <div className="flex justify-between">
            <span>Purchase Order No.</span>
            <span>: {orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Purchase Order Date</span>
            <span>: {orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Rev. Charge</span>
            <span>: NO</span>
          </div>
          <div className="flex justify-between">
            <span>Date Of Supply</span>
            <span>: {supplyDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Place of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[10px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Itemcode</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Tax Rate</th>
            <th className="border p-1">Landing</th>
            <th className="border p-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">{item.productId?.productCode || item.productId?.barcode || ""}</td>
                <td className="border p-1">{item.productId?.name || "Product"}</td>
                <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                <td className="border p-1 text-center">{Number(item.qty || 1).toFixed(2)}</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "gm"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-center">{Number(taxPct).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">890159563409</td>
              <td className="border p-1">Ching's Secret Singapore Curry Instant Noodles 60 g</td>
              <td className="border p-1"></td>
              <td className="border p-1 text-center">1.00</td>
              <td className="border p-1 text-center">gm</td>
              <td className="border p-1 text-right">9.00</td>
              <td className="border p-1 text-center">0.00</td>
              <td className="border p-1 text-right">9.00</td>
              <td className="border p-1 text-right">9.00</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(2)}</span>
        <span>{Number(netAmount).toFixed(2)}</span>
      </div>

      {/* Bank + Summary */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2">
          <div className="font-bold text-center">Bank Details</div>
          <div>Bank Name :</div>
          <div>Bank Account Number :</div>
          <div>Bank Branch IFSC :</div>
          <div>Bank Branch Name :</div>
        </div>

        <div className="p-2 text-right">
          <div>Round Off : {Number(roundOff).toFixed(2)}</div>
          <div className="font-bold text-[13px]">Net Amount : {Number(netAmount).toFixed(2)}</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-[10px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr. No.</th>
              <th className="border p-1">HSN / SAC</th>
              <th className="border p-1">Taxable Value</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item: any, i: number) => {
              const taxableValue = (item.netAmount || 0) - (item.taxAmount || 0);
              const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
              const cgst = (item.taxAmount || 0) / 2;
              const sgst = (item.taxAmount || 0) / 2;
              return (
                <tr key={i}>
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-1">{Number(taxableValue || 0).toFixed(2)}</td>
                  <td className="border p-1">{Number(taxPct / 2).toFixed(2)}</td>
                  <td className="border p-1">{Number(cgst).toFixed(2)}</td>
                  <td className="border p-1">{Number(taxPct / 2).toFixed(2)}</td>
                  <td className="border p-1">{Number(sgst).toFixed(2)}</td>
                </tr>
              );
            }) || (
              <tr>
                <td className="border p-1">1</td>
                <td className="border p-1"></td>
                <td className="border p-1">9.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Amount in words */}
      <div className="mt-2">Rupees Nine Only</div>

      {/* Footer */}
      <div className="mt-3 grid grid-cols-2">
        <div>
          <div className="font-bold">Terms & Conditions</div>
          <div>1. demo</div>
          <div>2. test</div>
        </div>

        <div className="text-right">
          <div className="font-bold">For, {companyName}</div>
          <div className="mt-8 border-t w-40 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated order.</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default PurchaseOrder1Jasper;
