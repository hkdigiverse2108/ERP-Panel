import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDate, NumberToWords } from "../../../Utils";

const Estimate_A4_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyLogo = company?.reportFormatLogo;
  const companyName = company?.name;
  const companyAddressObj = company?.address;
  const companyAddress1 = companyAddressObj?.address;
  const companyAddress2 = companyAddressObj ? `${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}`.replace(/^,\s*|,\s*$/g, "") : "Other";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim();
  const customerAddressObj = bill?.billingAddress as any;
  const customerAddress1 = customerAddressObj?.addressLine1;
  const customerAddress2 = `${customerAddressObj?.city?.name || ""} - ${customerAddressObj?.pincode || ""} ${customerAddressObj?.state?.name || ""} ${customerAddressObj?.country?.name || ""}`.replace(/^[-\s]+|[-\s]+$/g, "");

  const estimateNo = bill?.estimateNo;
  const estimateDate = FormatDate(bill?.date);
  const placeOfSupply = bill?.placeOfSupply;

  const signatoryName = companyName;

  const totalAmount = bill?.transactionSummary?.netAmount;
  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty || 1) || 1), 0);
  const totalFreeQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.freeQty || 0) || 0), 0);
  const totalTaxAmount = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.tax || 0) || 0), 0);
  const totalDiscount = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.discount1 || 0) || 0), 0);
  const totalPrice = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.price || 0) || 0), 0);

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[11px] border">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        {companyLogo && (
          <div className="text-right">
            <img src={companyLogo} alt="reportFormatLogo" className="w-20 h-20 object-contain" />
          </div>
        )}

        <div className="flex-1 text-center">
          <div className="font-bold text-[18px]">{companyName}</div>
          <div>{companyAddress1}</div>
          <div>{companyAddress2}</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center border-b py-2 font-bold text-[14px]">ESTIMATE</div>

      {/* Top Section */}
      <div className="grid grid-cols-2 border-b">
        {/* Customer */}
        <div className="border-r p-2">
          <div className="font-bold">{customerName !== "To Customer name" ? `To ${customerName}` : customerName}</div>
          <div className="mt-2 text-[10px]">
            {customerAddress1} <br />
            {customerAddress2}
          </div>
        </div>

        {/* Estimate Info */}
        <div className="p-2">
          <div className="flex justify-between">
            <span>Estimate No.</span>
            <span>: {estimateNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimate Date</span>
            <span>: {estimateDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Place Of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[10px]">
        <thead>
          <tr>
            <th className="border p-1">Sr no</th>
            <th className="border p-1">Particular</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Free qty</th>
            <th className="border p-1">Unit</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Tax Amount</th>
            <th className="border p-1">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items.map((item: any, i: number) => {
            const product = item.productId || {};
            return (
              <tr key={i}>
                <td className="border p-1 text-center align-top">{i + 1}</td>
                <td className="border p-1 align-top">{product.name}</td>
                <td className="border p-1 text-center align-top">{Number(item.qty || 1).toFixed(2)}</td>
                <td className="border p-1 text-center align-top">{item.freeQty}</td>
                <td className="border p-1 text-center align-top">{item.unit}</td>
                <td className="border p-1 text-right align-top">{Number(item.discount1).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.price).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.tax).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.totalAmount).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="p-1 text-right font-bold">
              Total
            </td>
            <td className="border p-1 text-center font-bold">{Number(totalQty).toFixed(2)}</td>
            <td className="border p-1 text-center font-bold">{Number(totalFreeQty).toFixed(2)}</td>
            <td className="border p-1"></td>
            <td className="border p-1 text-right font-bold">{Number(totalDiscount).toFixed(2)}</td>
            <td className="border p-1 text-right font-bold">{Number(totalPrice).toFixed(2)}</td>
            <td className="border p-1 text-right font-bold">{Number(totalTaxAmount).toFixed(2)}</td>
            <td className="border p-1 text-right font-bold">{Number(totalAmount)?.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in Words */}
      <div className="border p-1 font-bold text-center">Rupees {NumberToWords(Number(totalAmount))} only</div>

      {/* Footer */}
      <div className="mt-4 grid grid-cols-2">
        <div></div>

        <div className="text-right">
          <div className="font-bold">For, {signatoryName}</div>
          <div className="mt-10 border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] pt-1">
        <span></span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default Estimate_A4_1Jasper;
