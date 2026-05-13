import { forwardRef } from "react";
import type { EstimateBase } from "../../../Types";

const Deliverychallan_1Jasper = forwardRef<HTMLDivElement, { bill?: EstimateBase | any }>(({ bill }, ref) => {
  const companyLogo = bill?.companyId?.logo || "/logo.png";
  const companyName = bill?.companyId?.name || "VasyERP Solution Private LTD";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress1 = companyAddressObj?.addressLine1 || "AddressOther-123456";
  const companyEmail = bill?.companyId?.email || "himmatprajapati@vasyerp.com";
  const companyContact = bill?.companyId?.mobile || "9313305699";
  const companyGSTIN = bill?.companyId?.gstin || "1234567890";
  const companyState = companyAddressObj?.state?.name || "Other";
  const companyStateCode = companyAddressObj?.state?.code || "37";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "Customer name";
  const customerAddressObj = (bill?.customerId?.address as any)?.[0] || (bill?.shippingAddress as any);
  const customerAddress1 = customerAddressObj?.addressLine1 || "Address";
  const customerAddress2 = customerAddressObj ? `${customerAddressObj.city?.name || ""}, ${customerAddressObj.pincode || ""} ${customerAddressObj.state?.name || ""}, ${customerAddressObj.country?.name || ""}`.replace(/^[,\s]+|[,\s]+$/g, "") : "Ahmedabad-123456, Gujarat(24), India";
  const customerMobile = bill?.customerId?.mobile || "";

  const shippingName = customerName;
  const shippingAddress1 = customerAddress1;
  const shippingAddress2 = customerAddress2;
  const shippingGSTIN = bill?.shippingAddress?.gstin || bill?.customerId?.gstin || "24CUSTM1206D1ZM";

  const challanNo = bill?.estimateNo || "DC1";
  const challanDate = bill?.date ? new Date(bill.date).toLocaleDateString("en-GB") : "22/03/2023";
  const revCharge = bill?.revCharge || "NO";
  const paymentTerms = bill?.paymentTerms || "Payment term name";
  const dueDate = bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-GB") : "21/05/2023";
  const placeOfSupply = bill?.placeOfSupply || "Ahmedabad";

  const items = bill?.items || bill?.productDetails?.item || [];
  const hasItems = items.length > 0;

  const totalQty = items.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 10.0;
  const netAmount = bill?.transactionSummary?.netAmount || bill?.summary?.netAmount || 20637.7;
  const roundOff = bill?.transactionSummary?.roundOff || bill?.summary?.roundOff || -0.3;
  const totalAmountWords = "Rupees Twenty Thousand Six Hundred and Thirty Seven And Seventy paise only";

  const bankName = bill?.bankId?.bankName || "";
  const bankAccNo = bill?.bankId?.accountNumber || "";
  const bankIFSC = bill?.bankId?.ifscCode || "";
  const bankBranch = bill?.bankId?.branchName || "";

  const signatoryName = bill?.companyId?.name || "VasyERP Solution Private LTD";

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
      <div className="grid grid-cols-3 border border-black mt-[-1px]">
        {/* Billing Address */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[11px] mb-1">Billing Address</h2>
          <p className="font-bold">{customerName}</p>
          <p className="text-[9px] leading-3">
            {customerAddress1}
            <br />
            {customerAddress2}
          </p>
          <p className="text-[9px]">Mo. : {customerMobile}</p>
        </div>

        {/* Shipping Address */}
        <div className="border-r border-black p-1">
          <h2 className="font-bold text-[11px] mb-1">Shipping Address</h2>
          <p className="font-bold">{shippingName}</p>
          <p className="text-[9px] leading-3">
            {shippingAddress1}
            <br />
            {shippingAddress2}
          </p>
          <p className="text-[9px]">Consignee GSTIN :{shippingGSTIN}</p>
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

            <span className="font-semibold">Payment Terms</span>
            <span>: {paymentTerms}</span>

            <span className="font-semibold">Due Date</span>
            <span>: {dueDate}</span>

            <span className="font-semibold">Place of Supply</span>
            <span>: {placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative border-x border-black ">
        {/* Watermark */}
        {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-15deg]">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500">
              vasy <span className="bg-gray-600 text-white px-1 rounded">ERP</span>
            </div>
            <div className="text-xl font-semibold text-gray-500 tracking-widest mt-1">ERP | POS | CRM</div>
          </div>
        </div> */}

        <table className="w-full min-h-50 text-[10px] border-collapse relative z-10">
          <thead>
            <tr className="border-y border-black">
              <th className="border-r border-black w-8 py-1">#</th>
              <th className="border-r border-black w-24 py-1">Image</th>
              <th className="border-r border-black py-1 text-left px-2">Description</th>
              <th className="border-r border-black w-24 py-1">Qty</th>
              <th className="w-24 py-1">UOM</th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              items.map((item: any, i: number) => {
                const product = item.productId || {};
                const imgUrl = product.images?.[0] || "";
                return (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="border-r border-black text-center py-4 align-top">{i + 1}</td>
                    <td className="border-r border-black text-center py-2 align-top">{imgUrl && <img src={imgUrl} className="w-12 h-12 object-contain mx-auto" />}</td>
                    <td className="border-r border-black px-2 py-4 align-top">
                      <p className="font-semibold">
                        {product.name} {product.variantName}
                      </p>
                      {item.description && <p className="text-[9px] mt-1 text-gray-600">{item.description}</p>}
                    </td>
                    <td className="border-r border-black text-center py-4 align-top font-semibold">{Number(item.qty).toFixed(3)}</td>
                    <td className="text-center py-4 align-top">{product.unit?.name || item.uomId?.name || item.unit || "UOM code"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="border-r border-black text-center py-4 align-top">1</td>
                <td className="border-r border-black text-center py-2 align-top"></td>
                <td className="border-r border-black px-2 py-4 align-top text-center">
                  <p className="font-semibold">Product name variant</p>
                  <div className="mt-8 text-left pl-4 font-bold">delivery charges</div>
                </td>
                <td className="border-r border-black text-center py-4 align-top font-semibold">10.000</td>
                <td className="text-center py-4 align-top">UOM code</td>
              </tr>
            )}
            {/* Empty space filler if needed */}
            {/* <tr style={{ height: "100px" }}>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black p-4">
                {!hasItems && (
                  <div className="flex justify-between items-center w-full px-4">
                    <span className="font-bold"></span>
                    <span className="font-bold flex gap-4">
                      <span>55Rs.</span>
                      <span>6.000%</span>
                    </span>
                  </div>
                )}
              </td>
              <td className="border-r border-black">{!hasItems && <div className="flex justify-center items-center h-full font-bold">3.300</div>}</td>
              <td className="p-2">{!hasItems && <div className="flex justify-end font-bold">58.30</div>}</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end border border-black">
        <div className="text-right pr-2 font-bold py-1 border-r border-black">Total :</div>
        <div className="text-center font-bold py-1 border-r border-black w-24">{totalQty.toFixed(3)}</div>
        <div className="w-24"></div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 border-x border-b border-black">
        {/* Bank Details */}
        <div className="border-r border-black p-1">
          <h3 className="font-bold text-center border-b border-black mb-1">Bank Details</h3>
          <div className="grid grid-cols-[100px,1fr] text-[9px]">
            <span>Bank Name :</span>
            <span>{bankName}</span>
            <span>Bank Account Number :</span>
            <span>{bankAccNo}</span>
            <span>Bank Branch IFSC :</span>
            <span>{bankIFSC}</span>
            <span>Bank Branch Name :</span>
            <span>{bankBranch}</span>
          </div>
        </div>

        {/* Final Amounts */}
        <div className="p-1">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="font-bold">Round Off</span>
            <span className="font-bold">: {roundOff.toFixed(3)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-black border-t border-gray-300 pt-1">
            <span>Net Amount</span>
            <span>: {netAmount.toLocaleString("en-IN", { minimumFractionDigits: 3 })}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div className="border-x border-b border-black p-1 font-bold italic text-[9px]">{totalAmountWords}</div>

      {/* Footer Details */}
      <div className="grid grid-cols-2 border-x border-b border-black">
        <div className="p-2 border-r border-black">
          <h3 className="font-bold underline mb-1">Terms & Conditions</h3>
        </div>
        <div className="p-2 text-right flex flex-col justify-between min-h-[80px]">
          <h3 className="font-bold">For, {signatoryName}</h3>
          <div className="mt-8">
            <div className="border-t border-black w-48 ml-auto mb-1"></div>
            <p className="font-bold pr-4">Authorised Signatory</p>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex justify-between text-[8px] mt-1 text-gray-500">
        <span>This is computer generated</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});

export default Deliverychallan_1Jasper;
