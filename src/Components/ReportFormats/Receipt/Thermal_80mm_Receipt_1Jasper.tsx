import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDate, FormatDateTime, FormatPayment, NumberToWords } from "../../../Utils";

const Thermal_80mm_Receipt_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;
  const companyLogo = company?.reportFormatLogo;
  const companyName = company?.name;
  const getCompanyAddress = () => {
    const addr = company?.address;
    if (!addr) return null;
    const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);
    let addressStr = parts.join(", ");
    if (addr.pinCode) addressStr += ` - ${addr.pinCode}`;
    return addressStr;
  };
  const companyEmail = company?.email;
  const companyContact = company?.phoneNo?.phoneNo ? `${company.phoneNo.countryCode || ""} ${company.phoneNo.phoneNo}` : "";
  const companyGST = company?.GSTIdentificationNumber;
  const companyFssai = company?.fssaiNo;

  const customerName = `${bill?.partyId?.firstName || ""} ${bill?.partyId?.lastName || ""}`.trim();

  const receiptNo = bill?.paymentNo;
  const cashierName = bill?.createdBy?.fullName || companyName;
  const dateTime = FormatDateTime(bill?.createdAt);

  const posOrderId = bill?.posOrderId?.orderNo || bill?.invoiceId?.invoiceNo;

  const voucherNo = receiptNo;
  const voucherDate = FormatDate(bill?.createdAt);
  const paymentType = bill?.paymentType === "against_bill" ? "Against Bill" : "Advance Payment";
  const paymentMode = FormatPayment(bill?.paymentMode);
  const totalAmount = bill?.amount;
  const amountInWords = `Rupees ${NumberToWords(Number(totalAmount))} Only`;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black p-2 font-sans text-[10px] leading-tight">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-2">
        <img src={companyLogo} alt="Logo" className="w-20 h-auto object-contain mb-3" />
        <h1 className="text-[14px] font-black uppercase">{companyName}</h1>
        <p className="w-full mt-1 font-bold">{getCompanyAddress()}</p>
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
          <span className="w-32">Voucher Number: {voucherNo}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Voucher Date: {voucherDate}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Type: {paymentType}</span>
        </div>
        <div className="flex w-full justify-center">
          <span className="w-32">Payment Mode: {paymentMode}</span>
        </div>
        <div className="flex w-full justify-center text-[11px]">
          <span className="w-32">Amount: {totalAmount?.toFixed(1)}</span>
        </div>
      </div>

      {/* Table */}
      {posOrderId && (
        <div className="mt-4 overflow-hidden">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="border-b border-black font-bold text-center text-[9px]">
                <th className="border-r border-black w-4">Sr.</th>
                <th className="border-r border-black">Bill Date</th>
                <th className="border-r border-black">Bill No.</th>
                <th className="border-r border-black">Bill Amount</th>
                <th className="border-r border-black">KASAR Amount</th>
                <th>Payment Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-[9px]">
                <td className="border-r border-black py-0.5">{1}</td>
                <td className="border-r border-black">{FormatDate(bill?.createdAt)}</td>
                <td className="border-r border-black text-[7px] truncate max-w-[40px]">{posOrderId}</td>
                <td className="border-r border-black text-right px-1">{bill?.totalAmount ?? 0}</td>
                <td className="border-r border-black text-right px-1">{bill?.kasar ?? 0}</td>
                <td className="text-right px-1">{bill?.amount ?? 0}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-black font-bold text-[9px]">
                <td colSpan={3} className="text-right px-1">
                  Total :
                </td>
                <td className="border-r border-black text-right px-1">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="border-r border-black"></td>
                <td className="text-right px-1">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {/* Summary */}
      <div className="mt-2 text-center font-bold">
        {posOrderId && <p>Available Amount: {totalAmount?.toFixed(1)}</p>}
        <p className="mt-1">In words: {amountInWords}</p>
      </div>

      {/* Bottom Separator */}
      <div className="border-t border-dashed border-gray-400 mt-6 mb-2"></div>
    </div>
  );
});

export default Thermal_80mm_Receipt_1Jasper;
