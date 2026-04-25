import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A4_7Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  // Extract values with fallbacks to the original dummy data
  const companyName = bill?.companyId?.name || "Vasy ERP Solutions Private Limited";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "SHOP NO.1-14, UPPER GROUND FLOOR, NEAR KOTAK BANK CIRCLE, GHODDOD ROAD, Adajan-380015";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "+1234567895";
  const companyGst = (bill?.companyId as any)?.gstNo || "24";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Gujarat";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Walk in Customer";
//   const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Adityana";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Adityana";
  const customerStateName = (bill?.customerId?.address as any)?.[0]?.state?.name || "Gujarat";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "India";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "null";

  const orderNo = bill?.orderNo || "POS2961";
  const createdDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "27/04/2023";
  const dueDate = bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "27/04/2023";
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "Adityana";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1.000;
  const netAmount = bill?.totalAmount || 2366.00;
  const roundOff = bill?.roundOff || 0.40;
  const netDiscount = bill?.totalDiscount || 25.05;
  const totalTaxable = bill?.items?.reduce((acc: number, item: any) => acc + ((item.netAmount || 0) - (item.taxAmount || 0)), 0) || 2005.00;

  return (
    <div
      ref={ref}
      className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[12px] border"
    >
      {/* Header */}
      <div className="flex border-b pb-2">
        <img
          src={logo}
          className="w-20 h-20 object-contain border mr-3"
          alt="logo"
        />

        <div className="flex-1 text-center">
          <div className="font-bold text-[18px]">
            {companyName}
          </div>
          <div className="text-[11px]">
            {companyAddress}
          </div>
          <div className="text-[11px]">{companyPhone}</div>
          <div className="text-[11px]">
            GSTIN/UIN : State : {companyState}({companyGst})
          </div>
        </div>
      </div>

      {/* Title Strip */}
      <div className="flex justify-between items-center border-b py-1">
        <div></div>
        <div className="border px-6 py-1 font-bold">Invoice</div>
        <div className="text-[11px]">Original / Duplicate</div>
      </div>

      {/* Top 3 Sections */}
      <div className="grid grid-cols-3 border-b">
        {/* Billing */}
        <div className="border-r p-2">
          <div className="font-bold">Billing Details</div>
          <div>{customerName}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}({companyGst}), {customerCountry}</div>
          <div>Mo : {customerPhone}</div>
        </div>

        {/* Shipping */}
        <div className="border-r p-2">
          <div className="font-bold">Shipping Details</div>
          <div>{customerName}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}({customerStateName}), {customerCountry}</div>
        </div>

        {/* Invoice Info */}
        <div className="p-2 text-[11px]">
          <div className="flex justify-between">
            <span>Invoice No.</span>
            <span>{orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span>{createdDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Rev. Charge</span>
            <span>NO</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Terms</span>
            <span>-</span>
          </div>
          <div className="flex justify-between">
            <span>Due Date</span>
            <span>{dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Place of Supply</span>
            <span>{placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border text-[11px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Taxable Value</th>
            <th className="border p-1">CGST (%)</th>
            <th className="border p-1">SGST (%)</th>
            <th className="border p-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const taxableValue = (item.netAmount || 0) - (item.taxAmount || 0);
            // const cgst = (item.taxAmount || 0) / 2;
            // const sgst = (item.taxAmount || 0) / 2;
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  {item.productId?.name || "Product"}
                  {item.description && (
                    <div className="text-[10px]">
                      Description : {item.description}
                    </div>
                  )}
                </td>
                <td className="border p-1 text-center">{item.productId?.hsnCode || "-"}</td>
                <td className="border p-1 text-center">{Number(item.qty || 1).toFixed(3)}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(taxableValue || 0).toFixed(2)}</td>
                <td className="border p-1 text-center">{Number(taxPct / 2).toFixed(2)}</td>
                <td className="border p-1 text-center">{Number(taxPct / 2).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <>
              <tr>
                <td className="border p-1 text-center">1</td>
                <td className="border p-1">
                  Test demo yellow / 1
                  <div className="text-[10px]">
                    Description : The product is available in the store with a stock of 21.5L & 7L
                  </div>
                  <div className="font-bold">Test Additional Charge</div>
                </td>
                <td className="border p-1 text-center">1000</td>
                <td className="border p-1 text-center">1.000</td>
                <td className="border p-1 text-right">2,010.00</td>
                <td className="border p-1 text-right">0.25%</td>
                <td className="border p-1 text-right">2,005.00</td>
                <td className="border p-1 text-center">4.5</td>
                <td className="border p-1 text-center">4.5</td>
                <td className="border p-1 text-right">2,185.45</td>
              </tr>
              <tr>
                <td className="border p-1"></td>
                <td className="border p-1 font-bold">Test Additional Charge</td>
                <td className="border p-1"></td>
                <td className="border p-1"></td>
                <td className="border p-1"></td>
                <td className="border p-1"></td>
                <td className="border p-1 text-right">200Rs.</td>
                <td className="border p-1 text-center">1.00%</td>
                <td className="border p-1 text-center">2.00</td>
                <td className="border p-1 text-right">202.00</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(3)}</span>
        <span>{Number(bill?.items ? totalTaxable + (bill?.totalTax || 0) : 2387.45).toFixed(2)}</span>
      </div>

      {/* Bank + Summary */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2">
          <div className="font-bold text-center">Bank Details</div>
          <div>Bank Name : Andhra Pradesh GVB</div>
          <div>Bank Account Number :</div>
          <div>Bank Branch IFSC :</div>
          <div>Bank Branch Name :</div>

          <div className="mt-2">
            Rupees Two Thousand Three Hundred and Sixty Six Only
          </div>
        </div>

        <div className="p-2 text-right">
          <div>Net Discount : {Number(netDiscount).toFixed(2)}</div>
          <div>Round Off : {Number(roundOff).toFixed(2)}</div>
          <div className="font-bold">Net Amount : {Number(netAmount).toFixed(2)}</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">
          TAX SUMMARY
        </div>

        <table className="w-full text-[11px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr. no</th>
              <th className="border p-1">HSN/SAC</th>
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
              const cgst = (item.taxAmount || 0) / 2;
              const sgst = (item.taxAmount || 0) / 2;
              const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
              return (
                <tr key={i}>
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">{item.productId?.hsnCode || "-"}</td>
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
                <td className="border p-1">1000</td>
                <td className="border p-1">2,005.00</td>
                <td className="border p-1">4.5</td>
                <td className="border p-1">90.22</td>
                <td className="border p-1">4.5</td>
                <td className="border p-1">90.22</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-2 grid grid-cols-2">
        <div>
          <div className="font-bold">Terms & Conditions</div>
          <div>1. Terms And Conditions</div>
          <div>2. Terms And Conditions two</div>
          <div>3. Terms And Conditions Three</div>
        </div>

        <div className="text-right">
          <div>For, {companyName}</div>
          <div className="mt-8 border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated invoice.</span>
        <span>Page 1 of 1</span>
        <span>E.O.E</span>
      </div>
    </div>
  );
});
export default A4_7Jasper;
