import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const invoice_A5_1Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  const companyName = bill?.companyId?.name || "BACHAT MALL";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "Information Technology Park Ltd,Pioneer Building,Whitefield Road,BengaluruMahe-673310";
  const companyEmail = bill?.companyId?.email || "SumitKade123@gmail.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "+91-9960613515";
  const companyGst = (bill?.companyId as any)?.gstNo || "25AAGCC8118G1ZT";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Puducherry(34)";
  const companyFssai = (bill?.companyId as any)?.fssaiNo || "11522051000075";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";
  
  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Harshvardhan";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "+91-918888888888";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "TOKYO RAMEN SUZUKI 55/2 Mangamma Palya Rd Sector 2 HSR LayoutShop No 2";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "BENGALURU-560102";
  const customerStateName = (bill?.customerId?.address as any)?.[0]?.state?.name || "Karnataka(29)";

  const orderNo = bill?.orderNo || "INVOICE-43683";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "19/03/2025";
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "BENGALURU";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1.00;
  const netAmount = bill?.totalAmount || 107.63;
  const roundOff = bill?.roundOff || 0.00;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[12px] border">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <img src={logo} alt="logo" className="w-24 h-16 object-contain mr-3" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[22px]">{companyName}</div>
          <div className="text-[11px]">{companyAddress}</div>
          <div>Email : {companyEmail} | Contact No. : {companyPhone}</div>
          <div>GSTIN/UIN : {companyGst} State : {companyState}</div>
          {companyFssai && <div>FSSAI No. :{companyFssai}</div>}
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2">
        <div className="border px-10 py-1 font-bold text-[16px]">Tax Invoice</div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-2 border-b">
        {/* Billing */}
        <div className="border-r p-2">
          <div className="font-bold">Billing Address</div>
          <div className="font-bold">{customerName} {customerPhone}</div>
          <div>{customerAddress}</div>
          <div>{customerCity}</div>
          <div>{customerStateName}</div>
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
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">MRP</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Discount</th>
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
                  {item.productId?.name || "Product Name"}
                  {item.description && (
                    <>
                      <br />
                      {item.description}
                    </>
                  )}
                </td>
                <td className="border p-1 text-center">{Number(item.qty || 0).toFixed(2)}</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "CODE"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(taxable).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(taxable).toFixed(2)}</td>
                <td className="border p-1 text-center">{Number(taxPct).toFixed(1)}%</td>
                <td className="border p-1 text-right">{Number(item.taxAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">heena test print</td>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1 text-center">CODE</td>
              <td className="border p-1 text-right">117.64</td>
              <td className="border p-1 text-right">96.10</td>
              <td className="border p-1 text-right">8.93</td>
              <td className="border p-1 text-right">96.10</td>
              <td className="border p-1 text-center">12.0%</td>
              <td className="border p-1 text-right">11.53</td>
              <td className="border p-1 text-right">107.63</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(2)}</span>
        <span>{Number(bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.netAmount) || 0), 0) || 107.63).toFixed(2)}</span>
      </div>

      {/* Bottom Split */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2">
          <div>Note:</div>
        </div>

        <div className="p-2 text-right">
          <div>Round Off : {Number(roundOff).toFixed(2)}</div>
          <div className="font-bold text-[14px]">Net Amount : {Number(netAmount).toFixed(2)}</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-[11px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr. No.</th>
              <th className="border p-1">HSN / SAC</th>
              <th className="border p-1">TAXABLE VALUE</th>
              <th className="border p-1">RATE</th>
              <th className="border p-1">AMOUNT</th>
              <th className="border p-1">RATE</th>
              <th className="border p-1">AMOUNT</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item: any, i: number) => {
              const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
              const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
              const cgst = (item.taxAmount || 0) / 2;
              const sgst = (item.taxAmount || 0) / 2;

              if (!item.taxAmount) return null;

              return (
                <tr key={i}>
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">{item.productId?.hsnCode || ""}</td>
                  <td className="border p-1">{Number(taxable).toFixed(2)}</td>
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
                <td className="border p-1">96.10</td>
                <td className="border p-1">12.00</td>
                <td className="border p-1">11.53</td>
                <td className="border p-1">N.A</td>
                <td className="border p-1">N.A</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Amount in words */}
      <div className="mt-2">Rupees One Hundred and Seven And Sixty Three Only</div>

      {/* Footer */}
      <div className="grid grid-cols-2 mt-4">
        <div>
          <div className="font-bold">Terms & Conditions</div>
          <div>1. 2 . .</div>
          <div>2. No Return</div>
          <div>3. No Exchange</div>
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

export default invoice_A5_1Jasper;
