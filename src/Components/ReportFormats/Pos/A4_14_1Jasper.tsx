import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A4_14_1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const companyName = bill.companyId?.name || "Vasyerp solutions";
  const companyAddress = (bill.companyId?.address as any)?.[0]?.addressLine1 || "A-5, The First";
  const companyCity = (bill.companyId?.address as any)?.[0]?.city?.name || "Ahmedabad";
  const companyState = (bill.companyId?.address as any)?.[0]?.state?.name || "Gujarat";
  const companyEmail = bill.companyId?.email || "mitulkhokhar1@vasyerp.com";
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || "6354158555";
  const companyGst = (bill.companyId as any)?.gstNo || "27AACCA8432H2ZP";

  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "Ahmedabad";
  const customerCity = (bill.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad";
  const customerState = (bill.customerId?.address as any)?.[0]?.state?.name || "Gujarat";
  const customerCountry = (bill.customerId?.address as any)?.[0]?.country?.name || "India";

  const orderNo = bill.orderNo || "POS3685";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "05/06/2024";

  const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 12;
  const flatDiscount = bill.totalDiscount || 78.44;
  const roundOff = bill.roundOff || 0.23;
  const netPayable = bill.totalAmount || 3717.0;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-4 text-[11px] font-serif border">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b pb-1">
        <div></div>
        <div className="font-bold text-[16px] border px-4 py-1">Tax Invoice</div>
        <div className="text-[10px]">Original / Duplicate / Transport</div>
      </div>

      {/* Invoice + Transport */}
      <div className="grid grid-cols-2 mt-2 border-b pb-2">
        <div className="text-[11px]">
          <div>Invoice No : {orderNo}</div>
          <div>Invoice Date : {createdDate}</div>
          <div>Order No : {orderNo}</div>
          <div>Payment Terms : {(bill as any).paymentTerms || ""}</div>
        </div>

        <div className="text-[11px] text-right">
          <div>Transport Name : {(bill as any).transportName || ""}</div>
          <div>E-Way Bill No. : {(bill as any).ewayBillNo || ""}</div>
          <div>Vehicle No. : {(bill as any).vehicleNo || ""}</div>
          <div>Due Date : {createdDate}</div>

          {/* Logo */}
          <div className="flex justify-end mt-1">
            <img src={(bill.companyId as any)?.logo || "/logo.png"} className="w-16 h-16 object-contain" alt="logo" />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-3 border-b mt-2">
        <div className="border-r p-2">
          <div className="font-bold text-center mb-1">Supplier Address</div>
          <div>{companyName}</div>
          <div>{companyAddress}</div>
          <div>{companyCity}</div>
          <div>Email : {companyEmail}</div>
          <div>Contact No : {companyPhone}</div>
          <div>GSTIN/UIN : {companyGst}</div>
          <div>State : {companyState}</div>
        </div>

        <div className="border-r p-2">
          <div className="font-bold text-center mb-1">Billing Address</div>
          <div>{customerAddress}</div>
          <div>{customerCity}</div>
          <div>{customerCountry}</div>
        </div>

        <div className="p-2">
          <div className="font-bold text-center mb-1">Shipping Address</div>
          <div>{customerAddress}</div>
          <div>{customerCity}</div>
          <div>{customerState}</div>
          <div>{customerCountry}</div>
        </div>
      </div>

      {/* Place of Supply */}
      <div className="text-center text-[10px] mt-1">Place of Supply : {customerCity}</div>

      {/* Item Table */}
      <table className="w-full border mt-2 text-[10px]">
        <thead>
          <tr className="border bg-gray-100">
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Billing Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Tax Discount</th>
            <th className="border p-1">GST Value</th>
            <th className="border p-1">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill.items?.map((item: any, i: number) => (
            <tr key={i}>
              <td className="border p-1 text-center">{i + 1}</td>
              <td className="border p-1">{item.productId?.name || "Test speaker"}</td>
              <td className="border p-1 text-center">{Number(item.qty || 12).toFixed(2)}</td>
              <td className="border p-1 text-center">{item.productId?.unit?.name || "pcs"}</td>
              <td className="border p-1 text-right">{Number(item.mrp || 450).toFixed(2)}</td>
              <td className="border p-1 text-right">{Number(item.discountAmount || 189.15).toFixed(2)}</td>
              <td className="border p-1 text-right">{Number(0).toFixed(2)}</td>
              <td className="border p-1 text-right">{Number(item.taxAmount || 74.53).toFixed(2)}</td>
              <td className="border p-1 text-right">{Number(item.netAmount || 3716.77).toFixed(2)}</td>
            </tr>
          )) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">Test speaker</td>
              <td className="border p-1 text-center">12.00</td>
              <td className="border p-1 text-center">pcs</td>
              <td className="border p-1 text-right">450.00</td>
              <td className="border p-1 text-right">189.15</td>
              <td className="border p-1 text-right">0.54</td>
              <td className="border p-1 text-right">74.53</td>
              <td className="border p-1 text-right">3,716.77</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="border border-t-0 p-1 text-right font-bold">Total : {totalQty.toFixed(2)}</div>

      {/* Bank + Totals */}
      <div className="grid grid-cols-2 mt-2 gap-2">
        {/* Bank */}
        <div className="border p-2 text-[11px]">
          <div className="font-bold text-center mb-1">Bank Details</div>
          <div>Name : {(bill.companyId as any)?.bankDetails?.bankName || "Shapur bank"}</div>
          <div>Branch Name : {(bill.companyId as any)?.bankDetails?.branchName || "Amravati"}</div>
          <div>A/C Name : {(bill.companyId as any)?.bankDetails?.accountName || "Ramesh"}</div>
          <div>Account Number : {(bill.companyId as any)?.bankDetails?.accountNo || "8828541202"}</div>
          <div>Branch IFSC : {(bill.companyId as any)?.bankDetails?.ifscCode || "BARB0BHADRA"}</div>
        </div>

        {/* Totals */}
        <div className="border p-2 text-[11px]">
          <div className="flex justify-between">
            <span>Flat Discount</span>
            <span>{flatDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>CGST</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Applied</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Round Off</span>
            <span>{roundOff.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net Payable</span>
            <span>{netPayable.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="mt-2 border p-2 text-[10px]">
        <div className="text-center font-bold mb-1">TAX SUMMARY</div>

        <table className="w-full border text-center">
          <thead>
            <tr>
              <th className="border p-1">Tax</th>
              <th className="border p-1">Taxable</th>
              <th className="border p-1">CGST</th>
              <th className="border p-1">SGST</th>
              <th className="border p-1">IGST</th>
              <th className="border p-1">CESS</th>
              <th className="border p-1">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">12%</td>
              <td className="border p-1">3376.04</td>
              <td className="border p-1">8.04</td>
              <td className="border p-1">8.04</td>
              <td className="border p-1">0.00</td>
              <td className="border p-1">0.00</td>
              <td className="border p-1">17.96</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms + Signature */}
      <div className="grid grid-cols-2 mt-2">
        <div className="text-[10px]">
          <div className="font-bold">Terms & Conditions</div>
          <div>1. no exchange</div>
          <div>2. within 10 days return</div>
          <div>3. test</div>
          {bill.remark && <div>Remark: {bill.remark}</div>}
        </div>

        <div className="text-right">
          <div className="mt-8 border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated invoice.</span>
        <span>Page 1 of 1</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default A4_14_1Jasper;
