import { forwardRef } from "react";
import type { PurchaseOrderBase } from "../../../Types";

const PurchaseThermalHtml = forwardRef<HTMLDivElement, { bill?: PurchaseOrderBase | any }>(({ bill }, ref) => {
  const companyName = bill?.companyId?.name || "VasyERP Solution Private LTD";
  const companyAddressObj = (bill?.companyId?.address as any)?.[0];
  const companyAddress = companyAddressObj 
    ? `${companyAddressObj.addressLine1 || ""}, ${companyAddressObj.city?.name || ""}, ${companyAddressObj.state?.name || ""}, ${companyAddressObj.country?.name || ""}`.replace(/^,\s*|,\s*$/g, "")
    : "Address, Other, Other, India";
  const companyGst = (bill?.companyId as any)?.gstNo || "1234567890";

  const supplierName = `${bill?.supplierId?.firstName || ""} ${bill?.supplierId?.lastName || ""}`.trim() || "Company name";
  const orderNo = bill?.orderNo || "BIL1";
  const orderDate = bill?.orderDate ? new Date(bill.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-") : "16-03-2023";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 100.0;
  const remarks = bill?.notes || "";

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black p-3 font-mono text-[12px]">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="font-bold text-[14px]">{companyName}</div>
        <div>{companyAddress}</div>
        <div>GSTIN: {companyGst}</div>
        <div className="font-bold mt-1">Purchase Order</div>
      </div>

      {/* Top Info */}
      <div className="mb-3">
        <div className="flex justify-between">
          <span>Supplier Name:</span>
          <span>{supplierName}</span>
        </div>

        <div className="flex justify-between">
          <span>Order No:</span>
          <span>{orderNo}</span>
        </div>

        <div className="flex justify-between">
          <span>Date:</span>
          <span>{orderDate}</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="border-t border-dashed border-black pt-1 pb-1">
        <div className="flex justify-between font-bold">
          <span className="w-4">#</span>
          <span className="flex-1 text-left ml-2">Item</span>
          <span>Qty.</span>
        </div>
      </div>

      {/* Item Rows */}
      {bill?.items?.map((item: any, i: number) => (
        <div key={i} className="flex justify-between mb-2">
          <span className="w-4">{i + 1}</span>
          <span className="flex-1 ml-2">{item.productId?.name || "Product name"}</span>
          <span>{Number(item.qty || 0).toFixed(0)}</span>
        </div>
      )) || (
        <div className="flex justify-between mb-2">
          <span className="w-4">1</span>
          <span className="flex-1 ml-2">Product name</span>
          <span>100</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-dashed border-black my-2"></div>

      {/* Total */}
      <div className="flex justify-between font-bold mb-3">
        <span>Total</span>
        <span>{Number(totalQty).toFixed(1)}</span>
      </div>

      {/* Remark */}
      <div className="mt-4">
        <span className="font-bold">Remark:-</span> {remarks}
      </div>

      {/* Space for writing / print */}
      <div className="h-[200px]"></div>
    </div>
  );
});

export default PurchaseThermalHtml;
