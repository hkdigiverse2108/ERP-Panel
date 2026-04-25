import { forwardRef } from "react";
import type { SupplierBillBase } from "../../../Types";

const Grn_Bill_ThermalJasper = forwardRef<HTMLDivElement, { bill?: SupplierBillBase | any }>(({ bill }, ref) => {
  const dummyItems = ["Ching's Secret Singapore Curry Instant Noodles 60 g", "cawzzzz", "finishlatestzzz", "laptop adaptor", "product with expiry date 1", "product bana do", "Co Men's Solid Regular Fit12 Red/28", "Co Men's Solid Regular Fit Red/30", "shopify me product banao", "masala skin care", "test descxriptifperfkcad", "ACTIVE ORANGE 125 GM (5x100)", "ACTIVE ORANGE 125 GM (5x99)", "ACTIVE ORANGE 125 GM (5x98)", "ACTIVE ORANGE 125 GM (5x97)", "ACTIVE ORANGE 125 GM (5x96)"];

  const companyName = bill?.companyId?.name || "DISPLAY - VASYERP";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress = companyAddressObj 
    ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}`.replace(/^,\s*|,\s*$/g, "")
    : "ISKCON TEMPLE, MUDIYA AHMED NAGAR, PILIBHIT ROAD, BAREILLY, BHAVNAGAR, GUJARAT, INDIA";
  const companyGst = (bill?.companyId as any)?.gstNo || "34AACCC1596Q002";

  const billDate = bill?.supplierBillDate ? new Date(bill.supplierBillDate).toLocaleDateString("en-GB") : "05/08/2025";
  const billNo = bill?.supplierBillNo || "BILL3704";
  const supplierName = bill?.supplierId?.firstName || "karva";
  const receivedBy = bill?.createdBy?.firstName || "Zaid";

  const items = bill?.productDetails?.item || bill?.items;
  const hasItems = items && items.length > 0;

  const totalQty = bill?.productDetails?.totalQty || 16;
  const billAmount = bill?.summary?.netAmount || 5107.00;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black p-3 font-mono text-[12px]">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="font-bold text-[14px]">{companyName}</div>
        <div>{companyAddress}</div>
        <div>GSTIN : {companyGst}</div>
      </div>

      {/* Title */}
      <div className="text-center font-bold border-t border-b border-dashed py-1 mb-2">Goods Receipt Note</div>

      {/* Info */}
      <div className="mb-2">
        <div className="flex justify-between">
          <span>Date</span>
          <span>: {billDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Bill No.</span>
          <span>: {billNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Supplier</span>
          <span>: {supplierName}</span>
        </div>
        <div className="flex justify-between">
          <span>Received</span>
          <span>: {receivedBy}</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="border-t border-dashed border-black py-1 font-bold flex">
        <span className="w-[10%]">#</span>
        <span className="w-[55%]">Item Name</span>
        <span className="w-[20%] text-right">Qty</span>
        <span className="w-[15%] text-right">UOM</span>
      </div>

      {/* Items */}
      {hasItems ? items.map((item: any, i: number) => (
        <div key={i} className="flex py-1">
          <span className="w-[10%]">{i + 1}</span>
          <span className="w-[55%] wrap-break-word pr-1">{item?.productId?.name || "Product"}</span>
          <span className="w-[20%] text-right">{Number(item?.qty || 1).toFixed(3)}</span>
          <span className="w-[15%] text-right">{item?.productId?.unit?.name || item?.uomId?.name || "pieces"}</span>
        </div>
      )) : dummyItems.map((item, i) => (
        <div key={i} className="flex py-1">
          <span className="w-[10%]">{i + 1}</span>
          <span className="w-[55%] pr-1">{item}</span>
          <span className="w-[20%] text-right">1.000</span>
          <span className="w-[15%] text-right">{i === 0 ? "Gram" : "pieces"}</span>
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-dashed border-black my-2"></div>

      {/* Summary */}
      <div className="flex justify-between font-bold mb-2">
        <span>Bill Amount : {Number(billAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span>Bill Qty : {totalQty}</span>
      </div>

      {/* Terms */}
      <div>
        <div className="font-bold mb-1">Terms & Conditions</div>
        {bill?.termsAndConditionIds && bill.termsAndConditionIds.length > 0 ? (
          bill.termsAndConditionIds.map((term: any, i: number) => (
            <div key={i}>{i + 1}. {term.name || term.description}</div>
          ))
        ) : (
          <>
            <div>1. demo</div>
            <div>2. demoterm</div>
            <div>3. test</div>
            <div>4. testing purchase terms and conditions</div>
            <div>5. I agree to the mentioned terms and conditions</div>
          </>
        )}
      </div>
    </div>
  );
});

export default Grn_Bill_ThermalJasper;
