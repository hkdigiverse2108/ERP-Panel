import { forwardRef } from "react";
import type { SupplierBillBase } from "../../../Types";

const Purchase1Jasper = forwardRef<HTMLDivElement, { bill?: SupplierBillBase | any }>(({ bill }, ref) => {
  // Extract values with fallbacks to original dummy data
  const companyName = bill?.companyId?.name || "DISPLAY - AI SETU ERP";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress = companyAddressObj 
    ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}`.replace(/^,\s*|,\s*$/g, "")
    : "TIMCON SHOP NO.14, NR KATARIA PETROL PUMP ADARSH ROAD BHAVNAGAR-605001";
  const companyEmail = bill?.companyId?.email || "karanmerchant@gmail.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "+91-9515047679";
  const companyGst = (bill?.companyId as any)?.gstNo || "34AACCC1596Q002";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Gujarat(24)";

  const supplierName = `${bill?.supplierId?.firstName || ""} ${bill?.supplierId?.lastName || ""}`.trim() || "karva enterprise";
  const supplierAddressObj = (bill?.supplierId?.address as any)?.[0];
  const supplierAddress = supplierAddressObj?.addressLine1 || "GSF, CITY CENTER, NEAR IDGH CIRCLE";
  const supplierCity = supplierAddressObj?.city?.name || "Anjar-";
  const supplierState = supplierAddressObj?.state?.name || "Gujarat";
  const supplierCountry = supplierAddressObj?.country?.name || "India";
  const supplierGst = (bill?.supplierId as any)?.gstNo || "24ACTPJ9050C1ZL";

  const billNo = bill?.supplierBillNo || "BILL3707";
  const billDate = bill?.supplierBillDate ? new Date(bill.supplierBillDate).toLocaleDateString("en-GB") : "08/08/2025";
  const supplyDate = bill?.shippingDate ? new Date(bill.shippingDate).toLocaleDateString("en-GB") : "08/08/2025";
  const placeOfSupply = bill?.placeOfSupply || "Gujarat";
  const paymentTerm = (bill?.paymentTermsId as any)?.name || "";
  const vehicleNo = (bill as any)?.vehicleNo || "";

  const items = bill?.productDetails?.item || bill?.items;
  const hasItems = items && items.length > 0;

//   const totalQty = bill?.productDetails?.totalQty || 1.0;
  const summaryTaxableAmount = bill?.summary?.taxableAmount || 150.0;
  const summaryTaxAmount = bill?.summary?.taxAmount || 7.5;
  const summaryRoundOff = bill?.summary?.roundOff || 0.5;
  const summaryNetAmount = bill?.summary?.netAmount || 158.0;

  return (
    <div
      ref={ref}
      className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[10.5px] border"
    >
      {/* Header */}
      <div className="text-center border-b pb-2">
        <div className="font-bold text-[18px]">{companyName}</div>
        <div>
          {companyAddress}
        </div>
        <div>Email : {companyEmail} | Contact No : {companyPhone}</div>
        <div>GSTIN/UIN : {companyGst} State : {companyState}</div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2">
        <div className="border px-10 py-1 font-bold text-[14px]">
          Purchase Bill
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-2 border-b">
        {/* From */}
        <div className="border-r p-2">
          <div>From,</div>
          <div className="font-bold">{supplierName}</div>
          <div>{supplierAddress}</div>
          <div>{supplierCity}</div>
          <div>{supplierState}({supplierState}), {supplierCountry}</div>
          <div>GSTIN : {supplierGst}</div>
        </div>

        {/* Bill Info */}
        <div className="p-2">
          {[
            ["Bill No.", billNo],
            ["Bill Date", billDate],
            ["Rev. Charge", bill?.reverseCharge ? "YES" : "NO"],
            ["Ref No.", billNo],
            ["Vehicle/LR No.", vehicleNo],
            ["Date of Supply", supplyDate],
            ["Place of Supply", placeOfSupply],
            ["Payment Term", paymentTerm],
          ].map(([k, v], i) => (
            <div key={i} className="flex justify-between">
              <span>{k}</span>
              <span>: {v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[9.5px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Itemcode</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">MRP</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Discount2</th>
            <th className="border p-1">Taxable</th>
            <th className="border p-1">Tax (%)</th>
            <th className="border p-1">Tax</th>
            <th className="border p-1">Landing</th>
            <th className="border p-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {hasItems ? (
            items.map((item: any, i: number) => {
              const taxPct = item.taxAmount ? (item.taxAmount / item.mrp) * 100 : 0;
              return (
                <tr key={i} style={{ height: "220px" }}>
                  <td className="border p-1 text-center align-top">{i + 1}</td>
                  <td className="border p-1 align-top">{item.productId?.productCode || item.productId?.barcode || ""}</td>
                  <td className="border p-1 align-top">{item.productId?.name || "Product"}</td>
                  <td className="border p-1 text-center align-top">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-1 text-center align-top">{Number(item.qty || 1).toFixed(2)}</td>
                  <td className="border p-1 text-center align-top">{item.productId?.unit?.name || item.uomId?.name || "PCS"}</td>
                  <td className="border p-1 text-right align-top">{Number(item.mrp || 0).toFixed(2)}</td>
                  <td className="border p-1 text-right align-top">{Number(item.sellingPrice || item.unitCost || item.mrp || 0).toFixed(2)}</td>
                  <td className="border p-1 text-right align-top">{Number(item.discount1 || 0).toFixed(2)}%</td>
                  <td className="border p-1 text-right align-top">{Number(item.discount2 || 0).toFixed(2)}%</td>
                  <td className="border p-1 text-right align-top">{Number(item.taxableAmount || 0).toFixed(2)}</td>
                  <td className="border p-1 text-center align-top">{Number(taxPct).toFixed(1)}%</td>
                  <td className="border p-1 text-right align-top">{Number(item.taxAmount || 0).toFixed(2)}</td>
                  <td className="border p-1 text-right align-top">{Number(item.landingCost || item.total || item.netAmount || 0).toFixed(2)}</td>
                  <td className="border p-1 text-right align-top">{Number(item.total || item.netAmount || 0).toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr style={{ height: "220px" }}>
              <td className="border p-1 text-center align-top">1</td>
              <td className="border p-1 align-top">1P3</td>
              <td className="border p-1 align-top">
                Curtain LONG CRUSH <br />
                PATCH WHITE <br />
                PUNCHING/28blue
              </td>
              <td className="border p-1 text-center">6303</td>
              <td className="border p-1 text-center">1.00</td>
              <td className="border p-1 text-center">PCS</td>
              <td className="border p-1 text-right">550</td>
              <td className="border p-1 text-right">150.00</td>
              <td className="border p-1 text-right">0.00%</td>
              <td className="border p-1 text-right">0.00%</td>
              <td className="border p-1 text-right">150.00</td>
              <td className="border p-1 text-center">5.0%</td>
              <td className="border p-1 text-right">7.50</td>
              <td className="border p-1 text-right">157.50</td>
              <td className="border p-1 text-right">157.50</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total :</span>
        <span>{Number(hasItems ? items.reduce((acc: number, item: any) => acc + (Number(item.total || item.netAmount) || 0), 0) : 157.5).toFixed(2)}</span>
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
          <div>Taxable Amount : {Number(summaryTaxableAmount).toFixed(2)}</div>
          <div>Tax : {Number(summaryTaxAmount).toFixed(2)}</div>
          <div>Round Off : {Number(summaryRoundOff).toFixed(2)}</div>
          <div className="font-bold text-[12px]">
            Net Amount : {Number(summaryNetAmount).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">
          TAX SUMMARY
        </div>

        <table className="w-full text-[9.5px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr No</th>
              <th className="border p-1">HSN/SAC</th>
              <th className="border p-1">Taxable</th>
              <th className="border p-1">CESS Rate</th>
              <th className="border p-1">CESS Amt</th>
              <th className="border p-1">CGST Rate</th>
              <th className="border p-1">CGST Amt</th>
              <th className="border p-1">SGST Rate</th>
              <th className="border p-1">SGST Amt</th>
            </tr>
          </thead>

          <tbody>
            {hasItems ? (
              items.map((item: any, i: number) => {
                const taxPct = item.taxAmount ? (item.taxAmount / item.mrp) * 100 : 0;
                const cgst = (item.taxAmount || 0) / 2;
                const sgst = (item.taxAmount || 0) / 2;
                return (
                  <tr key={i}>
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                    <td className="border p-1">{Number(item.taxableAmount || 0).toFixed(2)}</td>
                    <td className="border p-1">0.00</td>
                    <td className="border p-1">0.00</td>
                    <td className="border p-1">{Number(taxPct / 2).toFixed(2)}</td>
                    <td className="border p-1">{Number(cgst).toFixed(2)}</td>
                    <td className="border p-1">{Number(taxPct / 2).toFixed(2)}</td>
                    <td className="border p-1">{Number(sgst).toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="border p-1">1</td>
                <td className="border p-1">6303</td>
                <td className="border p-1">150.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">2.50</td>
                <td className="border p-1">3.75</td>
                <td className="border p-1">2.50</td>
                <td className="border p-1">3.75</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Amount Words */}
      <div className="mt-2">
        Rupees One Hundred and Fifty Eight Only
      </div>

      {/* Terms */}
      <div className="mt-2">
        <div className="font-bold">Terms & Conditions</div>
        <div>1. Subject to the jurisdiction of Delhi</div>
        <div>2. I agree to terms and conditions</div>
        <div>3. zxcvdf</div>
        <div>4. Kya kar raha he</div>
      </div>

      {/* Signature */}
      <div className="text-right mt-10">
        <div className="border-t w-40 ml-auto"></div>
        <div>Authorised Signatory</div>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated bill.</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default Purchase1Jasper;
