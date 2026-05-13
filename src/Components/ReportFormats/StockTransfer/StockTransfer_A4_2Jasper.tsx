import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const StockTransfer_A4_2Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const companyLogo = bill?.companyId?.logo || "/logo.png";
  // const companyName = bill?.companyId?.name || "Vasy ERP";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddressLine = companyAddressObj ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}` : "Synthesis The First, Corporate House, THE FIRST, A5, Nyay Marg, near Itc Narmada, I I M, Vastrapur";
  const companyEmail = bill?.companyId?.email || "email.vasyerp@gmail.com";
  const companyContact = bill?.companyId?.mobile || "1234567899";
  const companyGSTIN = bill?.companyId?.gstin || "07AAGFF2194N1Z1";
  const companyPAN = bill?.companyId?.pan || "AACCA8432H";
  const companyState = companyAddressObj?.state?.name || "Gujarat";
  const companyStateCode = companyAddressObj?.state?.code || "24";

  const buyerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "test";
  const buyerAddressObj = (bill?.customerId?.address as any)?.[0] || (bill?.shippingAddress as any);
  const buyerAddress = buyerAddressObj?.addressLine1 || "-";
  const buyerCity = buyerAddressObj?.city?.name || "Ahmedabad";
  const buyerState = buyerAddressObj ? `${buyerAddressObj.state?.name || "Gujarat"} (${buyerAddressObj.state?.code || "24"})` : "Gujarat (24)";
  const buyerGSTIN = bill?.shippingAddress?.gstin || bill?.customerId?.gstin || "-";
  const buyerContact = bill?.customerId?.mobile || "963852741";

  const transferDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB") : "21-02-2023";
  const transferNo = bill?.estimateNo || "267";

  const items = bill?.items || bill?.productDetails?.item || [];
  const hasItems = items.length > 0;

  const totalAmount = items.reduce((acc: number, item: any) => acc + (Number(item.totalAmount || item.total) || 0), 0) || 102.6;
  const netAmount = bill?.transactionSummary?.netAmount || bill?.summary?.netAmount || 103.0;
  const roundOff = bill?.transactionSummary?.roundOff || bill?.summary?.roundOff || 0.4;
  const amountInWords = "Rupees One Hundred and Two And Fifty Nine paise only";

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-[#333] p-8 font-sans text-[11px] leading-snug">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-1/3">
          <img src={companyLogo} alt="Logo" className="w-36 h-auto object-contain" />
        </div>
        <div className="w-2/3 text-right">
          <h1 className="text-[18px] font-bold mb-1">Stock Transfer</h1>
          <p className="text-[10px] text-gray-700 leading-tight">
            {companyAddressLine}
            <br />
            State :{" "}
            <span className="font-semibold">
              {companyState} ({companyStateCode})
            </span>
            <br />
            GSTIN/UIN : <span className="font-semibold">{companyGSTIN}</span>
            <br />
            PAN No: <span className="font-semibold">{companyPAN}</span>
            <br />
            Mobile No : <span className="font-semibold">{companyContact}</span>
            <br />
            Email : <span className="font-semibold">{companyEmail}</span>
          </p>
        </div>
      </div>

      {/* Buyer & Transfer Info */}
      <div className="flex justify-between mb-8">
        <div className="w-1/2 space-y-1">
          <div className="flex">
            <span className="w-20 font-bold">Buyer</span>
            <span>:- {buyerName}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold">Address</span>
            <span>:- {buyerAddress}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold">City</span>
            <span>:- {buyerCity}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold">State</span>
            <span>:- {buyerState}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold">GSTIN</span>
            <span>:- {buyerGSTIN}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold">Contact No</span>
            <span>:- {buyerContact}</span>
          </div>
        </div>

        <div className="w-1/3 text-[12px] space-y-1">
          <div className="flex justify-between">
            <span className="font-bold">Transfer Date</span>
            <span>
              : <span className="font-bold">{transferDate}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Transfer No.</span>
            <span>
              : <span className="font-bold">{transferNo}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Item Table */}
      <div className="mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1b7431] text-white">
              <th className="w-10 py-2 text-center">#</th>
              <th className="text-left py-2 px-2">Description of Goods</th>
              <th className="w-24 py-2 text-center">UOM</th>
              <th className="w-24 py-2 text-center">QTY</th>
              <th className="w-24 py-2 text-center">Rate</th>
              <th className="w-24 py-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              items.map((item: any, i: number) => {
                const product = item.productId || {};
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 text-center">{i + 1}</td>
                    <td className="py-2 px-2 uppercase">
                      {product.name} {product.variantName}
                    </td>
                    <td className="py-2 text-center">{product.unit?.name || item.uomId?.name || "pieces"}</td>
                    <td className="py-2 text-center">{Number(item.qty).toFixed(1)}</td>
                    <td className="py-2 text-center">{Number(item.price || item.rate).toFixed(2)}</td>
                    <td className="py-2 text-center font-semibold">{Number(item.totalAmount || item.total).toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b border-gray-100">
                <td className="py-2 text-center">1</td>
                <td className="py-2 px-2 uppercase">BINDI SHEET</td>
                <td className="py-2 text-center">pieces</td>
                <td className="py-2 text-center">1.0</td>
                <td className="py-2 text-center">102.60</td>
                <td className="py-2 text-center font-semibold">102.60</td>
              </tr>
            )}
            {/* Filler rows */}
            <tr style={{ height: "100px" }}>
              <td colSpan={6}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end mb-6 space-y-1">
        <div className="w-48 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">: {totalAmount.toFixed(2)}</span>
        </div>
        <div className="w-48 flex justify-between italic">
          <span className="text-gray-700">Round off</span>
          <span className="text-gray-700">: {roundOff.toFixed(2)}</span>
        </div>
        <div className="w-48 flex justify-between border-t border-gray-300 pt-1">
          <span className="font-bold text-[12px]">Net Amount</span>
          <span className="font-bold text-[12px]">: {netAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Amount Chargeable */}
      <div className="mb-20">
        <p className="font-bold">
          Amount Chargeable (In Word) : <span className="font-bold">{amountInWords}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[9px] text-gray-500">Prepared By : VasyERP</p>
        </div>
        <div className="text-center">
          <div className="mb-2">
            {/* Signature Placeholder */}
            <div className="h-10"></div>
          </div>
          <div className="border-t border-black w-48 pt-1">
            <p className="font-bold">Authorised Signature</p>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex justify-end text-[8px] mt-4 text-gray-400">
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default StockTransfer_A4_2Jasper;
