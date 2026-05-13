import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const Thermal_80mm_Receipt_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const companyLogo = bill?.companyId?.logo || "/logo.png";
  const companyName = bill?.companyId?.name || "ADRIRAJA PRIVATE LIMITED";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddressLine = companyAddressObj ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}` : "5, Shiv Chhaya Colony, Amravati - 444606, Kurumbapet, Puducherry, India";
  const companyEmail = bill?.companyId?.email || "accountsgawadegreenpower@gmail.com";
  const companyContact = bill?.companyId?.mobile || "9926483416";
  const companyGST = bill?.companyId?.gstin || "34AACCC1596Q0O2";
  const companyFssai = bill?.companyId?.fssai || "11522051000075";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "EZEKIEL MBURU";

  const receiptNo = bill?.receiptNo || bill?.voucherNo || "PAY5217";
  const cashierName = bill?.cashierName || companyName;
  const dateTime = bill?.date ? new Date(bill.date).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "02-September-2025, 01:40 PM";

  const voucherNo = receiptNo;
  const voucherDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "02-September-2025";
  const paymentType = bill?.paymentType || "Advance Payment";
  const paymentMode = bill?.paymentMode || "cash";
  const totalAmount = bill?.amount || 1000.0;
  const amountInWords = "Rupees One Thousand Only";
  const availableAmount = bill?.availableAmount || 0.0;

  const associatedBills = bill?.associatedBills || [{ date: "02/09/2025", billNo: "PosORD00152", amount: 1000.0, kasar: 0.0, payment: 1000.0 }];

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black p-2 font-sans text-[10px] leading-tight">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-2">
        <img src={companyLogo} alt="Logo" className="w-16 h-auto object-contain mb-1" />
        <h1 className="text-[14px] font-black uppercase">{companyName}</h1>
        <p className="w-full mt-1 font-bold">{companyAddressLine}</p>
        <p className="mt-1 font-bold">Contact No.: {companyContact}</p>
        <p className="font-bold">Email ID:</p>
        <p className="font-bold break-all">{companyEmail}</p>
        <p className="font-bold mt-1 uppercase">GST : {companyGST}</p>
        <p className="font-bold uppercase">FSSAI No. {companyFssai}</p>
      </div>

      {/* Info Section */}
      <div className="flex flex-col items-center text-center mt-3 mb-1 font-bold">
        <p className="text-[12px]">Tax Invoice</p>
        <p className="text-[12px]">Receipt No: {receiptNo}</p>
      </div>

      <div className="text-center font-bold mt-2">
        <p>Cashier Name: {cashierName}</p>
        <p>Date/Time : {dateTime}</p>
      </div>

      {/* Separator */}
      <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

      {/* Customer Name */}
      <div className="py-1">
        <p className="font-black text-[11px] uppercase">Name: {customerName}</p>
      </div>

      {/* Separator */}
      <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

      {/* Voucher Details */}
      <div className="flex flex-col items-center text-center space-y-1 font-bold">
        <div className="flex w-full justify-center">
          <span className="w-32">Voucher Number</span>
          <span>: {voucherNo}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Voucher Date</span>
          <span>: {voucherDate}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Type</span>
          <span>: {paymentType}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Payment Mode</span>
          <span>: {paymentMode}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Description</span>
          <span>: Receipt - {voucherNo}</span>
        </div>
        <div className="flex w-full justify-center text-[11px]">
          <span className="w-32">Amount</span>
          <span>: {totalAmount.toFixed(1)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden">
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="border-b border-black font-bold text-center text-[9px]">
              <th className="border-r border-black w-6">Sr.</th>
              <th className="border-r border-black">Bill Date</th>
              <th className="border-r border-black">Bill No.</th>
              <th className="border-r border-black">Bill Amount</th>
              <th className="border-r border-black">KASAR Amount</th>
              <th>Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            {associatedBills.map((item: any, i: number) => (
              <tr key={i} className="text-center text-[9px]">
                <td className="border-r border-black py-0.5">{i + 1}</td>
                <td className="border-r border-black">{item.date}</td>
                <td className="border-r border-black text-[7px] truncate max-w-[40px]">{item.billNo}</td>
                <td className="border-r border-black text-right px-1">{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="border-r border-black text-right px-1">{item.kasar.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="text-right px-1">{item.payment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black font-bold text-[9px]">
              <td colSpan={3} className="text-right px-1">
                Total :
              </td>
              <td className="border-r border-black text-right px-1">{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              <td className="border-r border-black"></td>
              <td className="text-right px-1">{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-2 text-center font-bold">
        <p>Available Amount: {availableAmount.toFixed(1)}</p>
        <p className="mt-1">In words: {amountInWords}</p>
      </div>

      {/* Bottom Separator */}
      <div className="border-t border-dashed border-gray-400 mt-6 mb-2"></div>
    </div>
  );
});

export default Thermal_80mm_Receipt_1Jasper;
