import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDate, NumberToWords } from "../../../Utils";

const StockTransfer_A4_2Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyLogo = company?.reportFormatLogo;
  const formName = `${bill?.requestedByBranchId?.name}`.trim();
  const formAddressObj = bill?.requestedByBranchId?.address;
  const formAddressLine = formAddressObj ? `${formAddressObj.address || ""}, ${formAddressObj.city?.name || ""}` : "";
  const formState = formAddressObj?.state?.name;
  const formStateCode = formAddressObj?.pinCode;
  const formEmail = bill?.requestedByBranchId?.email;
  const formContact = bill?.requestedByBranchId?.phoneNo?.phoneNo ? `${bill?.requestedByBranchId?.phoneNo?.countryCode || ""} ${bill?.requestedByBranchId?.phoneNo?.phoneNo}` : "";

  const buyerName = `${bill?.requestedToBranchId?.name}`.trim();
  const buyerAddressObj = bill?.requestedToBranchId?.address;
  const buyerAddress = buyerAddressObj?.address;
  const buyerCity = buyerAddressObj?.city?.name;
  const buyerState = buyerAddressObj ? `${buyerAddressObj.state?.name} (${buyerAddressObj?.pinCode})` : "";
  const buyerContact = bill?.requestedToBranchId?.phoneNo?.phoneNo ? `${bill?.requestedToBranchId?.phoneNo?.countryCode || ""} ${bill?.requestedToBranchId?.phoneNo?.phoneNo}` : "";

  const transferDate = FormatDate(bill?.createdAt);
  const transferNo = bill?.transferNo;

  const items = bill?.items;

  const totalAmount = items.reduce((acc: number, item: any) => acc + (Number(item.price * item.receivedQty) || 0), 0) || 102.6;
  const amountInWords = `Rupees ${NumberToWords(Number(totalAmount))} only`;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-[#333] p-8 font-sans text-[11px] leading-snug">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        {companyLogo && (
          <div className="w-1/4">
            <img src={companyLogo} alt="Logo" className="w-32 h-auto object-contain" />
          </div>
        )}
        <div className="w-2/3 text-right">
          <h1 className="text-[18px] font-bold mb-1">Stock Transfer</h1>
          <p className="text-[10px] text-gray-700 leading-tight">
            {formName}
            <br />
            {formAddressLine}
            <br />
            State :{" "}
            <span className="font-semibold">
              {formState} ({formStateCode})
            </span>
            <br />
            Mobile No : <span className="font-semibold">{formContact}</span>
            <br />
            Email : <span className="font-semibold">{formEmail}</span>
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
              <th className="text-left py-2 px-2">Description</th>
              <th className="w-24 py-2 text-center">Requested QTY</th>
              <th className="w-24 py-2 text-center">Approved QTY</th>
              <th className="w-24 py-2 text-center">Received QTY</th>
              <th className="w-24 py-2 text-center">Price</th>
              <th className="w-24 py-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, i: number) => {
              const product = item.productId || {};
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-center">{i + 1}</td>
                  <td className="py-2 px-2 uppercase">{product.name}</td>
                  <td className="py-2 text-center">{Number(item.requestedQty).toFixed(2)}</td>
                  <td className="py-2 text-center">{Number(item.approvedQty).toFixed(2)}</td>
                  <td className="py-2 text-center">{Number(item.receivedQty).toFixed(2)}</td>
                  <td className="py-2 text-center">{Number(item.price).toFixed(2)}</td>
                  <td className="py-2 text-center font-semibold">{Number(item.price * item.receivedQty).toFixed(2)}</td>
                </tr>
              );
            })}
            {/* Filler rows */}
            <tr style={{ height: "100px" }}>
              <td colSpan={6}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end mb-6 space-y-1">
        <div className="w-48 flex justify-between border-t border-gray-300 pt-1">
          <span className="font-bold text-[12px]">Total</span>
          <span className="font-bold text-[12px]">: {totalAmount.toFixed(2)}</span>
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
