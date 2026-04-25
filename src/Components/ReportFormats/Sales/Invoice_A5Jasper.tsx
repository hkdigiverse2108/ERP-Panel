import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const invoice_A5Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  const companyName = bill?.companyId?.name || "AI Setu Solution Private LTD";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "AddressOther-123456";
  const companyEmail = bill?.companyId?.email || "himmatprajapati@aisetu.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "9313305699";
  const companyGst = (bill?.companyId as any)?.gstNo || "1234567890";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Other(37)";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";
  
  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Customer name-82123345678";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Address";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad-123456";
  const customerStateName = (bill?.customerId?.address as any)?.[0]?.state?.name || "Gujarat(24)";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "India";

  const orderNo = bill?.orderNo || "INV1";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "22/03/2023";
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad, Gujarat";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 10.00;
  const netAmount = bill?.totalAmount || 20638.000;
  const roundOff = bill?.roundOff || -0.300;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[12px] border">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <img src={logo} alt="logo" className="w-20 h-16 object-contain mr-3" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[20px]">{companyName}</div>
          <div>{companyAddress}</div>
          <div>Email : {companyEmail} | Contact No. : {companyPhone}</div>
          <div>GSTIN/UIN : {companyGst} State : {companyState}</div>
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2">
        <div className="border px-10 py-1 font-bold text-[16px]">Tax Invoice</div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 border-b">
        {/* Billing */}
        <div className="border-r p-2">
          <div className="font-bold">Billing Address</div>
          <div className="font-bold">{customerName}</div>
          <div>{customerAddress}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}, {customerCountry}</div>
        </div>

        {/* Middle */}
        <div className="border-r p-2 text-center">
          <div className="mt-6">Company GSTIN :{companyGst}</div>
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
            <span>Place of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[11px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Free Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">MRP</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Add Disc.</th>
            <th className="border p-1">Taxable Value</th>
            <th className="border p-1">Tax (%)</th>
            <th className="border p-1">Tax Amount</th>
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
                <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                <td className="border p-1 text-center">{Number(item.qty || 0).toFixed(2)}</td>
                <td className="border p-1 text-center">0</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "code"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(3)}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(3)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(3)}</td>
                <td className="border p-1 text-right">0.000</td>
                <td className="border p-1 text-right">{Number(taxable).toFixed(3)}</td>
                <td className="border p-1 text-center">{Number(taxPct).toFixed(1)}%</td>
                <td className="border p-1 text-right">{Number(item.taxAmount || 0).toFixed(3)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(3)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">
                Product name
                <br />
                delivery charges
              </td>
              <td className="border p-1"></td>
              <td className="border p-1 text-center">10</td>
              <td className="border p-1 text-center">0</td>
              <td className="border p-1 text-center">code</td>
              <td className="border p-1 text-right">2,000.000</td>
              <td className="border p-1 text-right">2,000.000</td>
              <td className="border p-1 text-right">2.000%</td>
              <td className="border p-1 text-right">0.000%</td>
              <td className="border p-1 text-right">
                19,600.000 <br /> 55Rs.
              </td>
              <td className="border p-1 text-center">
                5.0% <br /> 6%
              </td>
              <td className="border p-1 text-right">
                980.000 <br /> 3.300
              </td>
              <td className="border p-1 text-right">
                20,580.000 <br /> 58.300
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(2)}</span>
        <span>{Number(bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.netAmount) || 0), 0) || 20638.300).toFixed(3)}</span>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2 text-[11px]">
          <div>Note:</div>
          <div className="mt-2 font-bold">Bank Details</div>
          <div>Bank Name</div>
        </div>

        <div className="p-2 text-right">
          <div>Round Off : {Number(roundOff).toFixed(3)}</div>
          <div className="font-bold text-[14px]">Net Amount : {Number(netAmount).toFixed(3)}</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-center text-[11px]">
          <thead>
            <tr>
              <th className="border p-1">Sr. No.</th>
              <th className="border p-1">HSN / SAC</th>
              <th className="border p-1">TAXABLE VALUE</th>
              <th className="border p-1">CGST</th>
              <th className="border p-1">SGST</th>
              <th className="border p-1">IGST</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item: any, i: number) => {
              const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
              const cgst = (item.taxAmount || 0) / 2;
              const sgst = (item.taxAmount || 0) / 2;
              
              if (!item.taxAmount) return null;

              return (
                <tr key={i}>
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-1">{Number(taxable).toFixed(3)}</td>
                  <td className="border p-1">{Number(cgst).toFixed(3)}</td>
                  <td className="border p-1">{Number(sgst).toFixed(3)}</td>
                  <td className="border p-1">0.000</td>
                </tr>
              );
            }) || (
              <tr>
                <td className="border p-1">1</td>
                <td className="border p-1"></td>
                <td className="border p-1">19,600.000</td>
                <td className="border p-1">0.000</td>
                <td className="border p-1">0.000</td>
                <td className="border p-1">980.000</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-2">
        <div>Rupees Twenty Thousand Six Hundred and Thirty Eight Only</div>

        <div className="flex justify-between mt-4 text-[10px] border-t pt-1">
          <span>This is computer generated invoice.</span>
          <span>Page 1 of 1</span>
          <span>E.O.E.</span>
        </div>
      </div>
    </div>
  );
});

export default invoice_A5Jasper;
