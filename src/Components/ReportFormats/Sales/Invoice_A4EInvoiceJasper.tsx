import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Invoice_A4EInvoiceJasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  const companyName = bill?.companyId?.name || "Ai Setu Solution Private LTD";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "AddressOther-123456";
  const companyEmail = bill?.companyId?.email || "himmatprajapati@aisetu.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "9313305699";
  const companyGst = (bill?.companyId as any)?.gstNo || "1234567890";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Other(37)";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";
  
  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Customer name";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Address";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad-123456";
  const customerStateName = (bill?.customerId?.address as any)?.[0]?.state?.name || "Gujarat(24)";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "India";
  const customerGst = (bill?.customerId as any)?.gstNo || "24CUSTM1206D1ZM";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "82123345678";
  const customerCompany = (bill?.customerId as any)?.companyName || "Company name";

  const orderNo = bill?.orderNo || "INV1";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "22/03/2023";
  const dueDate = bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-GB") : "21/05/2023";
  const paymentTerm = bill?.paymentTerms || "Payment term name";
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 10.00;
  const netAmount = bill?.totalAmount || 20638.30;
  const roundOff = bill?.roundOff || -0.30;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[11px] border">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <img src={logo} className="w-20 h-14 mr-3 object-contain" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[18px]">{companyName}</div>
          <div>{companyAddress}</div>
          <div>Email : {companyEmail} | Contact No : {companyPhone}</div>
          <div>GSTIN/UIN : {companyGst} State : {companyState}</div>
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2 relative">
        <div className="border px-8 py-1 font-bold text-[15px]">Tax Invoice</div>

        <div className="absolute right-2 text-[10px]">Original / Duplicate / Transport</div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 border-b">
        {/* Billing */}
        <div className="border-r p-2">
          <div className="font-bold">Billing Address</div>
          <div>{customerName}</div>
          <div>{customerCompany}</div>
          <div>{customerAddress}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}, {customerCountry}</div>
          <div>Mo : {customerPhone}</div>
          <div>Company GSTIN :{customerGst}</div>
        </div>

        {/* Shipping */}
        <div className="border-r p-2">
          <div className="font-bold">Shipping Address</div>
          <div>{customerName}</div>
          <div>{customerCompany}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}, {customerCountry}</div>
          <div>Consignee GSTIN :{customerGst}</div>
        </div>

        {/* Invoice Info */}
        <div className="p-2">
          <div className="flex justify-between">
            <span>Invoice No.</span>
            <span>: {orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Invoice Date</span>
            <span>: {invoiceDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Rev. Charge</span>
            <span>: NO</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Terms</span>
            <span>: {paymentTerm}</span>
          </div>
          <div className="flex justify-between">
            <span>Due Date</span>
            <span>: {dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Place of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
          <div className="flex justify-between">
            <span>Transporter Name</span>
            <span>:</span>
          </div>

          {/* E-Invoice Fields */}
          <div className="mt-2">
            <div>Ack Date :</div>
            <div>Ack No. :</div>
            <div>IRN No. :</div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border text-[10px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Itemcode</th>
            <th className="border p-1">Net Weight</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">MRP</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Taxable</th>
            <th className="border p-1">Tax (%)</th>
            <th className="border p-1">Tax</th>
            <th className="border p-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            const taxable = (item.netAmount || 0) - (item.taxAmount || 0);

            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  {item.productId?.name || "Product name"}
                  {item.description && (
                    <>
                      <br />
                      {item.description}
                    </>
                  )}
                </td>
                <td className="border p-1">{item.productId?.itemCode || "ItemcodeNo"}</td>
                <td className="border p-1 text-center">10</td>
                <td className="border p-1 text-center">{Number(item.qty || 0).toFixed(3)}</td>
                <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "UOM"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(3)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(2)}%</td>
                <td className="border p-1 text-right">{Number(taxable).toFixed(2)}</td>
                <td className="border p-1 text-center">{Number(taxPct).toFixed(0)}%</td>
                <td className="border p-1 text-right">{Number(item.taxAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(3)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">
                Product name variant <br />
                delivery charges
              </td>
              <td className="border p-1">ItemcodeNo</td>
              <td className="border p-1 text-center">10</td>
              <td className="border p-1 text-center">10.000</td>
              <td className="border p-1"></td>
              <td className="border p-1 text-center">UOM</td>
              <td className="border p-1 text-right">2,000.000</td>
              <td className="border p-1 text-right">2.00%</td>
              <td className="border p-1 text-right">
                19,600.00 <br /> 55Rs.
              </td>
              <td className="border p-1 text-center">
                5% <br /> 6%
              </td>
              <td className="border p-1 text-right">
                980.00 <br /> 3.300
              </td>
              <td className="border p-1 text-right">
                20,580.00 <br /> 58.300
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(2)}</span>
        <span>{Number(bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.netAmount) || 0), 0) || 20638.30).toFixed(3)}</span>
      </div>

      {/* Bank + Amount */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2">
          <div className="font-bold text-center">Bank Details</div>
          <div>Name :</div>
          <div>Branch Name :</div>
          <div>Account :</div>
          <div>Branch IFSC :</div>
          <div>Note :</div>
        </div>

        <div className="p-2 text-right">
          <div>Round Off : {Number(roundOff).toFixed(3)}</div>
          <div className="font-bold text-[14px]">Net Amount : {Number(netAmount).toFixed(3)}</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-[10px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr No</th>
              <th className="border p-1">HSN</th>
              <th className="border p-1">Taxable Value</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item: any, i: number) => {
              const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
              const cgst = (item.taxAmount || 0) / 2;
              const sgst = (item.taxAmount || 0) / 2;
              const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
              
              if (!item.taxAmount) return null;

              return (
                <tr key={i}>
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-1">{Number(taxable).toFixed(2)}</td>
                  <td className="border p-1">{Number(taxPct / 2).toFixed(0)}%</td>
                  <td className="border p-1">{Number(cgst).toFixed(2)}</td>
                  <td className="border p-1">{Number(taxPct / 2).toFixed(0)}%</td>
                  <td className="border p-1">{Number(sgst).toFixed(2)}</td>
                </tr>
              );
            }) || (
              <tr>
                <td className="border p-1">1</td>
                <td className="border p-1"></td>
                <td className="border p-1">19,600.00</td>
                <td className="border p-1">5%</td>
                <td className="border p-1">980.00</td>
                <td className="border p-1">N.A</td>
                <td className="border p-1">N.A</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-3 grid grid-cols-2">
        <div>
          <div className="font-bold">Terms & Conditions</div>
        </div>

        <div className="text-right">
          <div className="font-bold">For, {companyName}</div>
          <div className="mt-8 border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated invoice.</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});
export default Invoice_A4EInvoiceJasper;
