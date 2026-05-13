import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const StockTransfer_A4_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const companyLogo = bill?.companyId?.logo || "/logo.png";
  const companyName = bill?.companyId?.name || "Vasy ERP";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress1 = companyAddressObj?.addressLine1 || "A-5, Vasyerp solutions, The First Ahmedabad-";
  const companyEmail = bill?.companyId?.email || "ayushijayswal.vasyerp@gmail.com";
  const companyContact = bill?.companyId?.mobile || "7802090662";
  const companyFax = bill?.companyId?.fax || "";
  const companyGSTIN = bill?.companyId?.gstin || "27AACCA8432H2ZP";
  const companyState = companyAddressObj?.state?.name || "Gujarat";
  const companyStateCode = companyAddressObj?.state?.code || "24";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "mposBtest";
  const customerAddressObj = (bill?.customerId?.address as any)?.[0] || (bill?.shippingAddress as any);
  const customerAddress1 = customerAddressObj?.addressLine1 || "vastrapur";
  const customerAddress2 = customerAddressObj ? `${customerAddressObj.city?.name || "Ahmedabad"}, ${customerAddressObj.state?.name || "Gujarat"}(${customerAddressObj.state?.code || "24"}), India`.replace(/^[,\s]+|[,\s]+$/g, "") : "Ahmedabad, Gujarat(24), India";
  const customerGSTIN = bill?.shippingAddress?.gstin || bill?.customerId?.gstin || "13245692565";

  const fromName = companyName;
  const fromAddress = companyAddress1;
  const fromState = `${companyState}(${companyStateCode}), India`;
  const fromMobile = companyContact;
  const fromGSTIN = companyGSTIN;

  const transferDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB") : "12/07/2022";
  const transferNo = bill?.estimateNo || "266";

  const items = bill?.items || bill?.productDetails?.item || [];
  const hasItems = items.length > 0;

  const totalQty = items.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 12.0;
  const totalRate = items.reduce((acc: number, item: any) => acc + (Number(item.price || item.rate) || 0), 0) || 1643.28;
  const totalTaxableValue = items.reduce((acc: number, item: any) => acc + (Number(item.taxableAmount || item.taxable) || 0), 0) || 6882.26;
  const totalTaxAmount = items.reduce((acc: number, item: any) => acc + (Number(item.taxAmount || item.tax) || 0), 0) || 1237.735;
  const netAmount = bill?.transactionSummary?.netAmount || bill?.summary?.netAmount || 8119.999;
  const roundOff = bill?.transactionSummary?.roundOff || bill?.summary?.roundOff || 0.004;
  const totalAmountWords = "Rupees Eight Thousand One Hundred and Nineteen And Ninety Nine paise only";

  const signatoryName = fromName;

  // HSN Breakdown Grouping
  const hsnMap: any = {};
  items.forEach((item: any) => {
    const hsn = item.productId?.hsnCode || item.hsn || ".1516";
    if (!hsnMap[hsn]) {
      hsnMap[hsn] = { taxable: 0, taxRate: item.taxRate || 18, taxAmount: 0 };
    }
    hsnMap[hsn].taxable += Number(item.taxableAmount || item.taxable || 0);
    hsnMap[hsn].taxAmount += Number(item.taxAmount || item.tax || 0);
  });
  const hsnList = Object.keys(hsnMap).map((hsn) => ({ hsn, ...hsnMap[hsn] }));

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-4 font-sans text-[9px] leading-tight border border-gray-400">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="w-1/4">
          <img src={companyLogo} alt="Logo" className="w-24 h-auto object-contain" />
        </div>
        <div className="w-2/4 text-center">
          <h1 className="text-[16px] font-black">{companyName}</h1>
          <p className="font-bold">{companyAddress1}</p>
          <p className="font-bold">
            Email : <span className="font-medium">{companyEmail}</span> | Contact No. : <span className="font-medium">{companyContact}</span> | Fax No. : <span className="font-medium">{companyFax}</span>
          </p>
          <p className="font-bold">
            GSTIN/UIN : <span className="font-medium">{companyGSTIN}</span> State :{" "}
            <span className="font-medium">
              {companyState}({companyStateCode})
            </span>
          </p>
        </div>
        <div className="w-1/4 text-right text-[8px] text-gray-600 italic pt-12">Original / Duplicate / Transport</div>
      </div>

      {/* Title */}
      <div className="flex justify-center mb-0">
        <div className="border border-black px-12 py-1 font-bold text-[14px]">Stock Transfer</div>
      </div>

      {/* From / To / Info Section */}
      <div className="grid grid-cols-3 border border-black -mt-px">
        {/* From */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[12px] mb-1">From</h2>
          <p className="font-black text-[11px]">{fromName}</p>
          <p className="leading-3">
            {fromAddress}
            <br />
            {fromState}
            <br />
            Mo. : {fromMobile}
            <br />
            Company GSTIN :{fromGSTIN}
          </p>
        </div>

        {/* To */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[12px] mb-1">To</h2>
          <p className="font-black text-[11px]">{customerName}</p>
          <p className="leading-3">
            {customerAddress1}
            <br />
            {customerAddress2}
            <br />
            Consignee GSTIN :{customerGSTIN}
          </p>
        </div>

        {/* Details */}
        <div className="p-1">
          <div className="flex flex-col gap-2 pt-1 text-[11px]">
            <div className="flex">
              <span className="font-bold w-28">Transfer Date</span>
              <span>
                : <span className="font-black">{transferDate}</span>
              </span>
            </div>
            <div className="flex">
              <span className="font-bold w-28">Transfer No.</span>
              <span>
                : <span className="font-black">{transferNo}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="border-x border-black -mt-px">
        <table className="w-full text-[8px] border-collapse">
          <thead>
            <tr className="border-y border-black font-bold">
              <th className="border-r border-black w-6 py-1">#</th>
              <th className="border-r border-black py-1 px-1 text-left">Description</th>
              <th className="border-r border-black w-14 py-1">Itemcode</th>
              <th className="border-r border-black w-12 py-1 text-right px-1">Qty</th>
              <th className="border-r border-black w-12 py-1 text-right px-1">MRP</th>
              <th className="border-r border-black w-12 py-1 text-right px-1">Rate</th>
              <th className="border-r border-black w-16 py-1 text-right px-1">Discount</th>
              <th className="border-r border-black w-16 py-1 text-right px-1">Taxable</th>
              <th className="border-r border-black w-10 py-1 text-right px-1">Tax (%)</th>
              <th className="border-r border-black w-14 py-1 text-right px-1">Tax</th>
              <th className="border-r border-black w-14 py-1 text-right px-1">CGST</th>
              <th className="border-r border-black w-14 py-1 text-right px-1">SGST</th>
              <th className="w-16 py-1 text-right px-1">Total</th>
            </tr>
          </thead>
          <tbody className="min-h-[400px]">
            {hasItems ? (
              items.map((item: any, i: number) => {
                const product = item.productId || {};
                const taxable = Number(item.taxableAmount || item.taxable || 0);
                const taxRate = Number(item.taxRate || item.taxPercentage || 0);
                const taxAmount = Number(item.taxAmount || item.tax || 0);
                return (
                  <tr key={i} className="align-top border-b border-gray-100">
                    <td className="border-r border-black text-center py-1">{i + 1}</td>
                    <td className="border-r border-black px-1 py-1 font-semibold">
                      {product.name} {product.variantName}
                    </td>
                    <td className="border-r border-black text-center py-1">{product.itemCode || "A11111"}</td>
                    <td className="border-r border-black text-right px-1 py-1">{Number(item.qty).toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{Number(item.mrp || item.price).toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{Number(item.price || item.rate).toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{Number(item.discountAmount || 0).toFixed(3)}(Rs.)</td>
                    <td className="border-r border-black text-right px-1 py-1 font-semibold">{taxable.toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{taxRate.toFixed(1)}%</td>
                    <td className="border-r border-black text-right px-1 py-1 font-semibold">{taxAmount.toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{(taxAmount / 2).toFixed(3)}</td>
                    <td className="border-r border-black text-right px-1 py-1">{(taxAmount / 2).toFixed(3)}</td>
                    <td className="text-right px-1 py-1 font-black">{Number(item.totalAmount || item.total).toFixed(3)}</td>
                  </tr>
                );
              })
            ) : (
              <tr style={{ height: "400px" }}>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td></td>
              </tr>
            )}
            {/* Filler rows to maintain height */}
            <tr style={{ height: "200px" }}>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td></td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-y border-black font-black text-right bg-gray-50">
              <td colSpan={3} className="border-r border-black px-4 py-1 text-left">
                Total :
              </td>
              <td className="border-r border-black px-1 py-1">{totalQty.toFixed(3)}</td>
              <td className="border-r border-black px-1 py-1"></td>
              <td className="border-r border-black px-1 py-1">{totalRate.toFixed(3)}</td>
              <td className="border-r border-black px-1 py-1"></td>
              <td className="border-r border-black px-1 py-1 font-black">{totalTaxableValue.toFixed(3)}</td>
              <td className="border-r border-black px-1 py-1"></td>
              <td className="border-r border-black px-1 py-1 font-black">{totalTaxAmount.toFixed(3)}</td>
              <td className="border-r border-black px-1 py-1"></td>
              <td className="border-r border-black px-1 py-1"></td>
              <td className="px-1 py-1 text-[9px] font-black">{netAmount.toLocaleString("en-IN", { minimumFractionDigits: 3 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Note and Summary */}
      <div className="grid grid-cols-[1fr,1.5fr] border-x border-b border-black -mt-px">
        <div className="p-1 border-r border-black">
          <p className="font-bold">Note :</p>
        </div>
        <div className="p-1">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="font-bold">Round Off</span>
            <span className="font-bold">: {roundOff.toFixed(3)}</span>
          </div>
          <div className="flex justify-between items-center text-[12px] font-black border-t border-gray-300 pt-1">
            <span>Net Amount</span>
            <span>: {netAmount.toLocaleString("en-IN", { minimumFractionDigits: 3 })}</span>
          </div>
        </div>
      </div>

      {/* Tax Breakdown Table */}
      <table className="w-full text-[8px] border-collapse border border-black mt-2">
        <thead>
          <tr className="border-b border-black font-bold">
            <th rowSpan={2} className="border-r border-black w-8 py-1">
              Sr. No.
            </th>
            <th rowSpan={2} className="border-r border-black py-1">
              HSN / SAC
            </th>
            <th rowSpan={2} className="border-r border-black py-1">
              TAXABLE VALUE
            </th>
            <th colSpan={2} className="border-r border-black py-1">
              CENTRAL TAX
            </th>
            <th colSpan={2} className="py-1">
              STATE TAX
            </th>
          </tr>
          <tr className="border-b border-black font-bold">
            <th className="border-r border-black py-1 w-20">RATE</th>
            <th className="border-r border-black py-1 w-20">AMOUNT</th>
            <th className="border-r border-black py-1 w-20">RATE</th>
            <th className="py-1 w-20">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {hsnList.length > 0 ? (
            hsnList.map((h, i) => (
              <tr key={i} className="text-center">
                <td className="border-r border-black py-1">{i + 1}</td>
                <td className="border-r border-black py-1">{h.hsn}</td>
                <td className="border-r border-black py-1 text-right px-2">{h.taxable.toFixed(3)}</td>
                <td className="border-r border-black py-1">{(h.taxRate / 2).toFixed(3)}</td>
                <td className="border-r border-black py-1 text-right px-2">{(h.taxAmount / 2).toFixed(3)}</td>
                <td className="border-r border-black py-1">{(h.taxRate / 2).toFixed(3)}</td>
                <td className="py-1 text-right px-2">{(h.taxAmount / 2).toFixed(3)}</td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td className="border-r border-black py-1">1</td>
              <td className="border-r border-black py-1">.1516</td>
              <td className="border-r border-black py-1 text-right px-2">6864.403</td>
              <td className="border-r border-black py-1">9.000</td>
              <td className="border-r border-black py-1 text-right px-2">617.796</td>
              <td className="border-r border-black py-1">9.000</td>
              <td className="py-1 text-right px-2">617.796</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Amount in Words */}
      <div className="border border-black p-1 font-bold italic text-[9px] mt-2">{totalAmountWords}</div>

      {/* Footer Signatory */}
      <div className="mt-4 flex justify-between items-end">
        <div className="text-[8px] text-gray-500">{/* Empty space for alignment */}</div>
        <div className="text-right w-1/2">
          <h3 className="font-black text-[11px]">For, {signatoryName}</h3>
          <div className="mt-12">
            <div className="border-t border-black w-56 ml-auto mb-1"></div>
            <p className="font-black pr-8">Authorised Signatory</p>
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div className="flex justify-between text-[7px] mt-2 border-t pt-1 border-gray-200">
        <span>This is computer generated</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default StockTransfer_A4_1Jasper;
