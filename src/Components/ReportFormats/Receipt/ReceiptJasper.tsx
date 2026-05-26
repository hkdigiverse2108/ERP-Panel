import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { Divider } from "@mui/material";
import { FormatDate, FormatPayment, NumberToWords } from "../../../Utils";

const ReceiptJasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;
  const companyName = bill?.companyId?.name || company?.name;
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
  const companyFssai = company?.fssaiNo;
  const companyGSTIN = company?.GSTIdentificationNumber;
  const companyState = company?.address.state?.name;
  const companyStateCode = company?.address.pinCode;

  const customerName = `${bill?.partyId?.firstName || ""} ${bill?.partyId?.lastName || ""}`.trim();

  const posOrderId = bill?.posOrderId?.orderNo || bill?.invoiceId?.invoiceNo;

  const voucherNo = bill?.paymentNo;
  const voucherDate = FormatDate(bill?.createdAt);
  const paymentType = bill?.paymentType === "against_bill" ? "Against Bill" : "Advance Payment";
  const paymentMode = FormatPayment(bill?.paymentMode);
  const totalAmount = bill?.amount;
  const amountInWords = `Rupees ${NumberToWords(Number(totalAmount))} Only`;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-8 font-serif text-[11px] leading-tight">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[18px] font-bold uppercase tracking-wider">{companyName}</h1>
        <p className="text-[10px] font-semibold mt-1">{getCompanyAddress()}</p>
        <p className="text-[10px] font-semibold">
          Email : {companyEmail} | Contact No : {companyContact} | Fssai No. {companyFssai}
        </p>
        <p className="text-[10px] font-bold">
          GSTIN/UIN : {companyGSTIN} State : {companyState}({companyStateCode})
        </p>
      </div>

      {/* Title */}
      <Divider className="my-5! text-xl!">Receipt</Divider>

      {/* Info Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-2/3">
          <p className="font-bold text-[13px] mb-1">To,</p>
          <p className="font-bold text-[12px]">{customerName}</p>
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
              : <span className="font-bold">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {posOrderId && (
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
              <tr className="text-center">
                <td className="border-r border-black py-1">{1}</td>
                <td className="border-r border-black py-1">{FormatDate(bill?.createdAt)}</td>
                <td className="border-r border-black py-1">{posOrderId}</td>
                <td className="border-r border-black py-1 text-right px-4">{bill?.totalAmount ?? 0}</td>
                <td className="border-r border-black py-1 text-right px-4">{bill?.kasar ?? 0}</td>
                <td className="text-right px-4 py-1">{bill?.amount ?? 0}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-black font-bold">
                <td colSpan={3} className="text-right px-4 py-1">
                  Total :
                </td>
                <td className="border-r border-black text-right px-4 py-1">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="border-r border-black"></td>
                <td className="text-right px-4 py-1">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Amount in words */}
      {!posOrderId && (
        <div className="border border-black p-1">
          <p className="font-bold text-center">NO INVOICE SELECTED</p>
        </div>
      )}
      <div className="border border-black border-t-0 p-1 mb-4">
        <p className="font-bold">
          Amount in words : <span className="font-semibold">{amountInWords}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end  mt-12">
        <div className="text-center w-1/2">
          <h3 className="font-bold mb-12">For, {companyName}</h3>
          <div className="flex flex-col items-center">
            <div className="border-t border-black w-48 mb-1"></div>
            <p className="font-bold">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptJasper;
