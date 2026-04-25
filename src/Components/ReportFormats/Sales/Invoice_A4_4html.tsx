import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Invoice_A4_4html = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  const companyName = bill?.companyId?.name || "VasyERP Solution Private LTD";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "Other - 123456";
  const companyEmail = bill?.companyId?.email || "himmatprajapati@vasyerp.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "9313305699";
  const companyGst = (bill?.companyId as any)?.gstNo || "1234567890";
  const companyPan = (bill?.companyId as any)?.panNo || "AIMPQ2221M";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Other(37)";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";
  
  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Customer name";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Address";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Ahmedabad";
  const customerStateName = (bill?.customerId?.address as any)?.[0]?.state?.name || "Gujarat(24)";
  const customerGst = (bill?.customerId as any)?.gstNo || "24CUSTM1206D1ZM";
  const customerEmail = bill?.customerId?.email || "customer@gmail.com";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "82123345678";

  const orderNo = bill?.orderNo || "INV1";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "22-03-2023";
  const dueDate = bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-GB").replace(/\//g, "-") : "21-05-2023";
  const paymentTerm = bill?.paymentTerms || "Payment term name";

  const subTotal = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.mrp || 0) * Number(item.qty || 0)), 0) || 19655.00;
  const netAmount = bill?.totalAmount || 20638;
  const roundOff = bill?.roundOff || -0.300;
  const receivedAmount = bill?.receivedAmount || 20638;
  const dueAmount = netAmount - receivedAmount;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-6 text-[13px]">
      {/* Header */}
      <div className="flex justify-between items-start">
        {/* Logo */}
        <img src={logo} className="w-32 object-contain" />

        {/* Company Right */}
        <div className="text-right text-[12px]">
          <div className="font-bold text-[16px]">Tax Invoice</div>
          <div className="font-bold">{companyName}</div>
          <div>{companyAddress}</div>
          <div>State : {companyState}</div>
          <div>GSTIN/UIN : {companyGst}</div>
          <div>PAN No : {companyPan}</div>
          <div>Mobile No : {companyPhone}</div>
          <div>Email : {companyEmail}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-3" />

      {/* Buyer + Invoice */}
      <div className="flex justify-between">
        {/* Buyer */}
        <div className="text-[12px]">
          <div>
            <b>Buyer :</b> {customerName}
          </div>
          <div>
            <b>Address:</b> {customerAddress}
          </div>
          <div>
            <b>City:</b> {customerCity}
          </div>
          <div>
            <b>State:</b> {customerStateName}
          </div>
          <div>
            <b>GSTIN:</b> {customerGst}
          </div>
          <div>{customerEmail}</div>
          <div>Contact No: {customerPhone}</div>
        </div>

        {/* Invoice Info */}
        <div className="text-[12px] text-right">
          <div>Invoice Date : {invoiceDate}</div>
          <div>Invoice No. : {orderNo}</div>
          <div>Due Date : {dueDate}</div>
          <div>Payment Terms : {paymentTerm}</div>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full mt-4 text-[12px]">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Description of Goods</th>
            <th className="p-2">HSN</th>
            <th className="p-2">UOM</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Discount</th>
            <th className="p-2">Tax Rate</th>
            <th className="p-2">Tax Amount</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            return (
              <tr key={i} className="border-b">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{item.productId?.name || "Product name variant"}</td>
                <td className="p-2">{item.productId?.hsnCode || ""}</td>
                <td className="p-2">{item.productId?.unit?.name || "UOM code"}</td>
                <td className="p-2 text-center">{Number(item.qty || 0).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(item.mrp || 0).toFixed(3)}</td>
                <td className="p-2 text-right">{Number(item.discountAmount || 0).toFixed(3)}</td>
                <td className="p-2 text-center">{Number(taxPct).toFixed(1)}%</td>
                <td className="p-2 text-right">{Number(item.taxAmount || 0).toFixed(3)}</td>
                <td className="p-2 text-right">{Number(item.netAmount || 0).toFixed(3)}</td>
              </tr>
            );
          }) || (
            <tr className="border-b">
              <td className="p-2">1</td>
              <td className="p-2">Product name variant</td>
              <td className="p-2"></td>
              <td className="p-2">UOM code</td>
              <td className="p-2 text-center">10</td>
              <td className="p-2 text-right">2,000.000</td>
              <td className="p-2 text-right">2.000</td>
              <td className="p-2 text-center">5%</td>
              <td className="p-2 text-right">980.000</td>
              <td className="p-2 text-right">19,600.000</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Second Table */}
      <table className="w-full mt-2 text-[12px]">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Description</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Tax Rate</th>
            <th className="p-2">Tax Amount</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-2">1</td>
            <td className="p-2">delivery charges</td>
            <td className="p-2 text-right">55.000</td>
            <td className="p-2 text-center">6%</td>
            <td className="p-2 text-right">3.300</td>
            <td className="p-2 text-right">55.000</td>
          </tr>
        </tbody>
      </table>

      {/* Bottom */}
      <div className="flex justify-between mt-4">
        {/* Bank */}
        <div className="text-[12px]">
          <div className="font-bold">Bank Details</div>
          <div>Account No :</div>
          <div>Name of Bank :</div>
          <div>Branch Name :</div>
          <div>IFSC Code :</div>
        </div>

        {/* Summary */}
        <div className="text-[12px] text-right">
          <div>Sub Total : {Number(subTotal).toFixed(2)}</div>
          <div>IGST 5.0% : 980.000</div>
          <div>IGST 6.0% : 3.300</div>
          <div>Total : {Number(netAmount - roundOff).toFixed(3)}</div>
          <div>Round Off : {Number(roundOff).toFixed(3)}</div>
          <div className="font-bold">Net Amount : {netAmount}</div>
          <div>Due Amount : {dueAmount}</div>
          <div>Received Amount : {receivedAmount}</div>
        </div>
      </div>

      {/* Amount words */}
      <div className="mt-4 text-[12px]">
        <b>Amount Chargeable (In Word)</b> : Rupees Twenty Thousand Six Hundred and Thirty Eight Only
      </div>

      {/* Tax Summary */}
      <div className="mt-4">
        <div className="text-center font-bold mb-2">Tax Summary</div>

        <table className="w-full border text-center text-[12px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Sr No.</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Taxable Value</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Total Tax Amount</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item: any, i: number) => {
              const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
              const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
              
              if (!item.taxAmount) return null;

              return (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-2">{Number(taxable).toFixed(3)}</td>
                  <td className="border p-2">{Number(taxPct).toFixed(1)}%</td>
                  <td className="border p-2">{Number(item.taxAmount || 0).toFixed(3)}</td>
                  <td className="border p-2">{Number(item.taxAmount || 0).toFixed(3)}</td>
                </tr>
              );
            }) || (
              <>
                <tr>
                  <td className="border p-2">1</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">19,600.000</td>
                  <td className="border p-2">5.0%</td>
                  <td className="border p-2">980.000</td>
                  <td className="border p-2">980.000</td>
                </tr>

                <tr>
                  <td className="border p-2">2</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">55.000</td>
                  <td className="border p-2">6.0%</td>
                  <td className="border p-2">3.300</td>
                  <td className="border p-2">3.300</td>
                </tr>
              </>
            )}

            <tr className="font-bold">
              <td className="border p-2" colSpan={2}>
                Total
              </td>
              <td className="border p-2">{Number(subTotal).toFixed(3)}</td>
              <td></td>
              <td className="border p-2">
                {bill?.items 
                  ? Number(bill.items.reduce((acc: number, item: any) => acc + (item.taxAmount || 0), 0)).toFixed(3)
                  : "983.300"}
              </td>
              <td className="border p-2">
                {bill?.items 
                  ? Number(bill.items.reduce((acc: number, item: any) => acc + (item.taxAmount || 0), 0)).toFixed(3)
                  : "983.300"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-6 text-[12px]">
        <div>Prepared By : {companyName}</div>

        <div className="text-right">
          <div className="mb-8">Authorised Signature</div>
          <div>E. & O.E</div>
        </div>
      </div>

      <div className="text-center mt-4 text-[11px]">Subject to Other Jurisdiction</div>
    </div>
  );
});
export default Invoice_A4_4html;
