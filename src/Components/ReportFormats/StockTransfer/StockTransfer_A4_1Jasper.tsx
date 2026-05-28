import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDate, NumberToWords } from "../../../Utils";

const StockTransfer_A4_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyLogo = company?.reportFormatLogo;
  const companyName = company?.name;
  const companyAddressObj = company?.address;
  const companyAddress1 = companyAddressObj?.address;
  const companyEmail = company?.email;
  const companyContact = company?.phoneNo?.phoneNo ? `${company.phoneNo.countryCode || ""} ${company.phoneNo.phoneNo}` : "";
  const companyFssaiNo = company?.fssaiNo;
  const companyGSTIN = company?.GSTIdentificationNumber;
  const companyState = companyAddressObj?.state?.name;
  const companyStateCode = companyAddressObj?.state?.code;

  const fromName = bill?.requestedByBranchId?.name;
  const fromAddress = bill?.requestedByBranchId?.address?.address;
  const fromState = `${bill?.requestedByBranchId?.address?.city?.name},${bill?.requestedByBranchId?.address?.state?.name}(${bill?.requestedByBranchId?.address?.pinCode}), ${bill?.requestedByBranchId?.address?.country?.name}`;
  const fromMobile = bill?.requestedByBranchId?.phoneNo?.phoneNo ? `${bill?.requestedByBranchId?.phoneNo?.countryCode || ""} ${bill?.requestedByBranchId?.phoneNo?.phoneNo}` : "";

  const toName = bill?.requestedToBranchId?.name;
  const toAddress = bill?.requestedToBranchId?.address?.address;
  const toState = `${bill?.requestedToBranchId?.address?.city?.name},${bill?.requestedToBranchId?.address?.state?.name}(${bill?.requestedToBranchId?.address?.pinCode}), ${bill?.requestedToBranchId?.address?.country?.name}`;
  const toMobile = bill?.requestedToBranchId?.phoneNo?.phoneNo ? `${bill?.requestedToBranchId?.phoneNo?.countryCode || ""} ${bill?.requestedToBranchId?.phoneNo?.phoneNo}` : "";

  const transferDate = FormatDate(bill?.createdAt);
  const transferNo = bill?.transferNo;

  const items = bill?.items || bill?.productDetails?.item || [];

  const totalRequestedQty = items.reduce((acc: number, item: any) => acc + (Number(item.requestedQty) || 0), 0);
  const totalApprovedQty = items.reduce((acc: number, item: any) => acc + (Number(item.approvedQty) || 0), 0);
  const totalReceivedQty = items.reduce((acc: number, item: any) => acc + (Number(item.receivedQty) || 0), 0);
  const totalPrice = items.reduce((acc: number, item: any) => acc + (Number(item.price) || 0), 0);
  const totalAmount = items.reduce((acc: number, item: any) => acc + Number(item.price) * Number(item.receivedQty) || 0, 0);
  const totalAmountWords = `Rupees ${NumberToWords(Number(totalAmount))} only`;

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

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-4 font-sans text-[9px] leading-tight">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        {companyLogo && (
          <div className="w-1/4">
            <img src={companyLogo} alt="Logo" className="w-32 h-auto object-contain" />
          </div>
        )}
        <div className="w-2/4 text-center">
          <h1 className="text-[16px] font-black">{companyName}</h1>
          <p className="font-bold">{companyAddress1}</p>
          <p className="font-bold">
            Email : <span className="font-medium">{companyEmail}</span> | Contact No. : <span className="font-medium">{companyContact}</span> | Fssai No. : <span className="font-medium">{companyFssaiNo}</span>
          </p>
          <p className="font-bold">
            GSTIN : <span className="font-medium">{companyGSTIN}</span> State :{" "}
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
        <div className="p-1">
          <h2 className="font-bold text-[12px] mb-1">From</h2>
          <p className="font-black text-[11px]">{fromName}</p>
          <p className="leading-3">
            {fromAddress}
            <br />
            {fromState}
            <br />
            Mo. : {fromMobile}
          </p>
        </div>

        {/* To */}
        <div className="border-x border-black p-1">
          <h2 className="font-bold text-[12px] mb-1">To</h2>
          <p className="font-black text-[11px]">{toName}</p>
          <p className="leading-3">
            {toAddress}
            <br />
            {toState}
            <br />
            Mo. : {toMobile}
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
              <th className="border-r border-black w-20 py-1 text-right px-1">Requested Qty</th>
              <th className="border-r border-black w-20 py-1 text-right px-1">Approved Qty</th>
              <th className="border-r border-black w-20 py-1 text-right px-1">Received Qty</th>
              <th className="border-r border-black w-20 py-1 text-right px-1">Price</th>
              <th className="w-20 py-1 text-right px-1">Total</th>
            </tr>
          </thead>
          <tbody className="min-h-[400px]">
            {items.map((item: any, i: number) => {
              const product = item.productId || {};
              return (
                <tr key={i} className="align-top">
                  <td className="border-r border-black text-center py-1">{i + 1}</td>
                  <td className="border-r border-black px-1 py-1 font-semibold">{product.name}</td>
                  <td className="border-r border-black text-right px-1 py-1">{Number(item.requestedQty).toFixed(2)}</td>
                  <td className="border-r border-black text-right px-1 py-1">{Number(item.approvedQty).toFixed(2)}</td>
                  <td className="border-r border-black text-right px-1 py-1">{Number(item.receivedQty).toFixed(2)}</td>
                  <td className="border-r border-black text-right px-1 py-1">{Number(item.price).toFixed(2)}</td>
                  <td className="text-right px-1 py-1 font-black">{Number(item.price * item.receivedQty).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-y border-black font-black text-right bg-gray-50">
              <td colSpan={2} className="border-r border-black px-4 py-1 text-left">
                Total :
              </td>
              <td className="border-r border-black px-1 py-1">{totalRequestedQty.toFixed(2)}</td>
              <td className="border-r border-black px-1 py-1">{totalApprovedQty.toFixed(2)}</td>
              <td className="border-r border-black px-1 py-1">{totalReceivedQty.toFixed(2)}</td>
              <td className="border-r border-black px-1 py-1">{totalPrice.toFixed(2)}</td>
              <td className="border-r border-black px-1 py-1 text-[9px] font-black">{totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Note and Summary */}
      <div className="grid grid-cols-[1fr,1.5fr] border-x border-black -mt-px">
        <div className="flex justify-between items-center text-[12px] font-black p-1">
          <span>Net Amount</span>
          <span>: {totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="border border-black p-1 font-bold italic text-[9px]">{totalAmountWords}</div>

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
      <div className="flex justify-between text-[7px] mt-2 pt-1">
        <span>This is computer generated</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default StockTransfer_A4_1Jasper;
