import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDate, NumberToWords } from "../../../Utils";

const Deliverychallan_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyLogo = company?.reportFormatLogo;
  const companyName = company?.name;
  const companyAddress1 = company?.address?.address;
  const companyEmail = company?.email;
  const companyContact = company?.phoneNo?.phoneNo ? `${company.phoneNo.countryCode || ""} ${company.phoneNo.phoneNo}` : "";
  const companyGSTIN = company?.GSTIdentificationNumber;
  const companyState = company?.address?.state?.name;
  const companyStateCode = company?.address?.pinCode;

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Customer name";
  const billingAddress = bill?.billingAddress?.addressLine1 + ", " + bill?.billingAddress?.addressLine2;
  const billingAddress1 = bill?.billingAddress?.city?.name + ", " + bill?.billingAddress?.state?.name + ", " + bill?.billingAddress?.country?.name;
  const customerMobile = bill?.customerId?.phoneNo?.phoneNo ? `${bill?.customerId?.phoneNo.countryCode} ${bill?.customerId?.phoneNo.phoneNo}` : "";
  const shippingName = customerName;
  const shippingAddress = bill?.shippingAddress?.addressLine1 + ", " + bill?.shippingAddress?.addressLine2;
  const shippingAddress2 = bill?.shippingAddress?.city?.name + ", " + bill?.shippingAddress?.state?.name + ", " + bill?.shippingAddress?.country?.name;

  const challanNo = bill?.deliveryChallanNo;
  const challanDate = FormatDate(bill?.date);
  const revCharge = bill?.reverseCharge ? "YES" : "NO";
  const dueDate = FormatDate(bill.dueDate);
  const placeOfSupply = bill?.placeOfSupply;

  const items = bill?.items || bill?.productDetails?.item || [];

  const totalQty = items.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 10.0;
  const netAmount = bill?.transactionSummary?.netAmount;
  const roundOff = bill?.transactionSummary?.roundOff;
  const totalAmountWords = `Rupees ${NumberToWords(Number(netAmount))} only`;

  const bankName = company?.bankId?.name || "";
  const bankAccNo = company?.bankId?.bankAccountNumber || "";
  const bankIFSC = company?.bankId?.ifscCode || "";
  const bankBranch = company?.bankId?.branchName || "";

  const signatoryName = companyName;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-4 font-sans text-[10px] leading-tight border border-gray-400">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="w-1/4">
          <img src={companyLogo} alt="Logo" className="w-32 h-auto object-contain" />
        </div>
        <div className="w-2/4 text-center">
          <h1 className="text-[16px] font-bold uppercase">{companyName}</h1>
          <p className="font-semibold">{companyAddress1}</p>
          <p className="font-semibold">
            Email : <span className="font-bold">{companyEmail}</span> | Contact No. : <span className="font-bold">{companyContact}</span>
          </p>
          <p className="font-semibold">
            GSTIN/UIN : <span className="font-bold">{companyGSTIN}</span> State :{" "}
            <span className="font-bold">
              {companyState}({companyStateCode})
            </span>
          </p>
        </div>
        <div className="w-1/4 text-right text-[9px] text-gray-600 italic">Original / Duplicate / Transport</div>
      </div>

      {/* Title */}
      <div className="flex justify-center mb-0">
        <div className="border border-black px-8 py-1 font-bold text-[14px]">Delivery Challan</div>
      </div>

      {/* Addresses and Info */}
      <div className="grid grid-cols-3 border-x border-t border-black -mt-px">
        {/* Billing Address */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[11px] mb-1">Billing Address</h2>
          <p className="font-bold">{customerName}</p>
          <p className="text-[9px] leading-3">
            {billingAddress}
            <br />
            {billingAddress1}
          </p>
          <p className="text-[9px]">Mo. : {customerMobile}</p>
        </div>

        {/* Shipping Address */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[11px] mb-1">Shipping Address</h2>
          <p className="font-bold">{shippingName}</p>
          <p className="text-[9px] leading-3">
            {shippingAddress}
            <br />
            {shippingAddress2}
          </p>
          <p className="text-[9px]">Mo. :{customerMobile}</p>
        </div>

        {/* Challan Info */}
        <div className="p-1">
          <div className="grid grid-cols-2 text-[9px]">
            <span className="font-semibold">Deliverychallan</span>
            <span>
              : <span className="font-bold">{challanNo}</span>
            </span>

            <span className="font-semibold">Deliverychallan</span>
            <span>: {challanDate}</span>

            <span className="font-semibold">Rev. Charge</span>
            <span>: {revCharge}</span>

            <span className="font-semibold">Due Date</span>
            <span>: {dueDate}</span>

            <span className="font-semibold">Place of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative border border-black ">
        {/* Watermark */}

        <table className="w-full min-h-50 text-[10px] border-collapse relative z-10">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black w-8 py-1">#</th>
              <th className="border-r border-black py-1 text-left px-2">Description</th>
              <th className="border-r border-black w-24 py-1">Qty</th>
              <th className="w-24 py-1">UOM</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, i: number) => {
              const product = item.productId || {};
              return (
                <tr key={i} className="align-top">
                  <td className="border-r border-black text-center py-1 align-top">{i + 1}</td>
                  <td className="border-r border-black px-2 py-1 align-top">
                    <p className="font-semibold">{product.name}</p>
                  </td>
                  <td className="border-r border-black text-center py-1 align-top font-semibold">{Number(item.qty).toFixed(2)}</td>
                  <td className="text-center py-1 align-top">{product.unit?.name || item.uomId?.name || item.unit || ""}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-black font-bold">
              <td colSpan={2} className="text-right px-4 py-1">
                Total :
              </td>
              <td className="border-x border-black text-right px-4 py-1">{totalQty.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 border-x border-b border-black">
        {/* Bank Details */}
        <div className="border-r border-black">
          <h3 className="font-bold text-center border-b border-black p-1">Bank Details</h3>
          <div className="flex flex-col text-[9px] p-2">
            <span>Bank Name : {bankName}</span>
            <span>Bank Account Number : {bankAccNo}</span>
            <span>Bank Branch IFSC : {bankIFSC}</span>
            <span>Bank Branch Name : {bankBranch}</span>
          </div>
        </div>

        {/* Final Amounts */}
        <div className="p-2">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="font-bold">Round Off</span>
            <span className="font-bold">: {roundOff?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-black">
            <span>Net Amount</span>
            <span>: {netAmount?.toLocaleString("en-IN", { minimumFractionDigits: 3 })}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div className="border-x border-black p-1 font-bold italic text-[9px]">{totalAmountWords}</div>

      {/* Footer Details */}
      <div className="grid grid-cols-2 border-x border border-black">
        <div className="p-2 border-r border-black">
          <h3 className="font-bold">Terms & Conditions</h3>
          <div>
            {bill?.termsAndConditionIds?.map((term: any, idx: number) => (
              <p key={idx} className="text-[9px] leading-[1.2]">
                {idx + 1}. {term?.termsCondition}
              </p>
            ))}
          </div>
        </div>
        <div className="p-2 text-right flex flex-col justify-between min-h-[80px]">
          <h3 className="font-bold">For, {signatoryName}</h3>
          <div className="mt-8">
            <div className="border-t border-black w-48 ml-auto mb-1"></div>
            <p className="font-bold pr-4">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Deliverychallan_1Jasper;
