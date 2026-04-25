import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const Estimate_A4_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const companyLogo = bill?.companyId?.logo || "/logo.png";
  const companyName = bill?.companyId?.name || "VasyERP Solution Private LTD";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress1 = companyAddressObj?.addressLine1 || "Address";
  const companyAddress2 = companyAddressObj 
    ? `${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}`.replace(/^,\s*|,\s*$/g, "")
    : "Other";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "To Customer name";
  const customerAddressObj = (bill?.customerId?.address as any)?.[0] || (bill?.shippingAddress as any);
  const customerAddress1 = customerAddressObj?.addressLine1 || "Address";
  const customerAddress2 = customerAddressObj 
    ? `${customerAddressObj.city?.name || ""} - ${customerAddressObj.pincode || ""} ${customerAddressObj.state?.name || ""} ${customerAddressObj.country?.name || ""}`.replace(/^[-\s]+|[-\s]+$/g, "")
    : "Ahmedabad - 123456 Gujarat India";

  const estimateNo = bill?.estimateNo || "EST1";
  const estimateDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB") : "16/03/2023";
  const placeOfSupply = bill?.placeOfSupply || "Ahmedabad";

  const items = bill?.items || bill?.productDetails?.item;
  const hasItems = items && items.length > 0;

  // const totalAmount = bill?.transactionSummary?.netAmount || bill?.summary?.netAmount || 20638.00;
  const signatoryName = bill?.companyId?.name || "VasyERP Solution Private";

  return (
    <div
      ref={ref}
      className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[11px] border"
    >
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <img src={companyLogo} className="w-20 h-14 mr-3 object-contain" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[18px]">
            {companyName}
          </div>
          <div>{companyAddress1}</div>
          <div>{companyAddress2}</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center border-b py-2 font-bold text-[14px]">
        ESTIMATE
      </div>

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
            <th className="border p-1">Image</th>
            <th className="border p-1">Particular</th>
            <th className="border p-1">Brand Name</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Unit</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Tax Amount</th>
            <th className="border p-1">Amount</th>
          </tr>
        </thead>

        <tbody>
          {hasItems ? items.map((item: any, i: number) => {
            const product = item.productId || {};
            const imgUrl = product.images?.[0] || "";
            return (
              <tr key={i} style={{ height: "260px" }}>
                <td className="border p-1 text-center align-top">{i + 1}</td>
                <td className="border p-1 text-center align-top">
                  {imgUrl ? (
                    <img src={imgUrl} className="w-16 h-16 object-contain mx-auto" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 mx-auto"></div>
                  )}
                </td>
                <td className="border p-1 align-top">
                  {product.name || "Product name"} <br />
                  {product.variantName || "variant"}
                </td>
                <td className="border p-1 align-top">{product.brandId?.name || "brand name"}</td>
                <td className="border p-1 text-center align-top">{Number(item.qty || 1).toFixed(2)}</td>
                <td className="border p-1 text-center align-top">{product.unit?.name || item.uomId?.name || item.unit || "UOM name"}</td>
                <td className="border p-1 text-right align-top">{Number(item.discount1 || item.discountAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.price || item.rate || 0).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.taxAmount || item.tax || 0).toFixed(2)}</td>
                <td className="border p-1 text-right align-top">{Number(item.totalAmount || item.total || 0).toFixed(2)}</td>
              </tr>
            );
          }) : (
            <tr style={{ height: "260px" }}>
              <td className="border p-1 text-center align-top">1</td>
              <td className="border p-1 text-center align-top">
                <div className="w-16 h-16 bg-gray-200 mx-auto"></div>
              </td>
              <td className="border p-1 align-top">
                Product name <br />
                variant
              </td>
              <td className="border p-1 align-top">brand name</td>
              <td className="border p-1 text-center align-top">10.00</td>
              <td className="border p-1 text-center align-top">UOM name</td>
              <td className="border p-1 text-right align-top">400.00</td>
              <td className="border p-1 text-right align-top">2,000.00</td>
              <td className="border p-1 text-right align-top">980.00</td>
              <td className="border p-1 text-right align-top">20,580.00</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total</span>
        <span>{Number(hasItems ? items.reduce((acc: number, item: any) => acc + (Number(item.totalAmount || item.total) || 0), 0) : 20638.0).toFixed(3)}</span>
      </div>

      {/* Amount in Words */}
      <div className="border p-1 font-bold text-center">
        Rupees Twenty Thousand Six Hundred and Thirty Eight Only
      </div>

      {/* Footer */}
      <div className="mt-4 grid grid-cols-2">
        <div></div>

        <div className="text-right">
          <div className="font-bold">
            For, {signatoryName}
          </div>
          <div className="mt-10 border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span></span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default Estimate_A4_1Jasper;
