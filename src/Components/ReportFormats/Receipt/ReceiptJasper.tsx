import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const ReceiptJasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  // const companyLogo = bill?.companyId?.logo || "/logo.png";
  const companyName = bill?.companyId?.name || "VASY ERP SOLUTIONS PVT. LTD";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress = companyAddressObj ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}-${companyAddressObj.pincode || ""}` : "Ground/First Floor, A - 05, THE FIRST, Lake Road, I I M, Vastrapur, Ahmedabad-380015";
  const companyEmail = bill?.companyId?.email || "dharmendraahuja@vasyerp.com";
  const companyContact = bill?.companyId?.mobile || "9145936724";
  const companyFssai = bill?.companyId?.fssai || "12345678901234";
  const companyGSTIN = bill?.companyId?.gstin || "27AACCA8432H2ZP";
  const companyState = companyAddressObj?.state?.name || "Gujarat";
  const companyStateCode = companyAddressObj?.state?.code || "24";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Akash";
  const customerAddressObj = (bill?.customerId?.address as any)?.[0] || (bill?.shippingAddress as any);
  const customerAddress = customerAddressObj ? `${customerAddressObj.addressLine1 || ""}, ${customerAddressObj.city?.name || ""}, ${customerAddressObj.state?.name || ""}` : "Crystal Indus Logistic Park, Block No.11, National Highway 8, Survey No. , Taluka Bavala";

  const voucherNo = bill?.receiptNo || bill?.voucherNo || "REC2721";
  const voucherDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB") : "31/07/2023";
  const paymentType = bill?.paymentType || "AgainstBill";
  const paymentMode = bill?.paymentMode || "Cash";
  const totalAmount = bill?.amount || 5643.0;
  const amountInWords = "Rupees Five Thousand Six Hundred and Fourty Three Only";
  const description = bill?.description || "";

  const associatedBills = bill?.associatedBills || [{ date: "31/07/2023", billNo: "INVQ419", amount: 5643.0, kasar: 0, payment: 5643.0 }];

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-8 font-serif text-[11px] leading-tight">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[18px] font-bold uppercase tracking-wider">{companyName}</h1>
        <p className="text-[10px] font-semibold mt-1">{companyAddress}</p>
        <p className="text-[10px] font-semibold">
          Email : {companyEmail} | Contact No : {companyContact} | Fssai No. {companyFssai}
        </p>
        <p className="text-[10px] font-bold">
          GSTIN/UIN : {companyGSTIN} State : {companyState}({companyStateCode})
        </p>
      </div>

      <div className="border-t-2 border-black my-2"></div>

      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-[16px] font-bold lowercase px-8">receipt</span>
      </div>

      {/* Info Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-2/3">
          <p className="font-bold text-[13px] mb-1">To,</p>
          <p className="font-bold text-[12px]">{customerName}</p>
          <p className="w-4/5 leading-tight">{customerAddress}</p>
        </div>
        <div className="w-1/3 space-y-1">
          <div className="flex justify-between">
            <span className="font-bold">Voucher No.</span>
            <span>
              : <span className="font-semibold">{voucherNo}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Voucher Date</span>
            <span>
              : <span className="font-semibold">{voucherDate}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Type</span>
            <span>
              : <span className="font-semibold">{paymentType}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Payment Mode</span>
            <span>
              : <span className="font-semibold">{paymentMode}</span>
            </span>
          </div>
          <div className="flex justify-between text-[12px] pt-1">
            <span className="font-bold">AMOUNT</span>
            <span>
              : <span className="font-bold">{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Company GSTIN :{companyGSTIN}</p>
      </div>

      {/* Main Table */}
      <div className="border border-black">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black font-bold text-center">
              <th className="border-r border-black w-10 py-1">Sr.</th>
              <th className="border-r border-black py-1">Bill Date</th>
              <th className="border-r border-black py-1">Bill No.</th>
              <th className="border-r border-black py-1">Bill Amount</th>
              <th className="border-r border-black py-1">KASAR Amount</th>
              <th className="py-1">Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            {associatedBills.map((item: any, i: number) => (
              <tr key={i} className="text-center">
                <td className="border-r border-black py-1">{i + 1}</td>
                <td className="border-r border-black py-1">{item.date}</td>
                <td className="border-r border-black py-1">{item.billNo}</td>
                <td className="border-r border-black py-1 text-right px-4">{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="border-r border-black py-1 text-right px-4">{item.kasar.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="text-right px-4 py-1">{item.payment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {/* Filler rows */}
            <tr style={{ height: "40px" }}>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td></td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-black font-bold">
              <td colSpan={3} className="text-right px-4 py-1">
                Total :
              </td>
              <td className="border-r border-black text-right px-4 py-1">{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              <td className="border-r border-black"></td>
              <td className="text-right px-4 py-1">{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in words */}
      <div className="border border-black border-t-0 p-1 mb-4">
        <p className="font-bold">
          Amount in words : <span className="font-semibold">{amountInWords}</span>
        </p>
      </div>

      <div className="mb-8">
        <p className="text-[10px] text-gray-700 italic">Description : {description}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end mt-12">
        <div className="text-[9px]">
          <p>Prepared By : VasyERP</p>
        </div>
        <div className="text-center w-1/2">
          <h3 className="font-bold mb-12">For, {companyName}</h3>
          <div className="flex flex-col items-center">
            <div className="border-t border-black w-48 mb-1"></div>
            <p className="font-bold">Authorised Signatory</p>
          </div>
        </div>
      </div>

      <div className="text-right text-[8px] mt-4 text-gray-500">
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default ReceiptJasper;
