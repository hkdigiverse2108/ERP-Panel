import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const Thermal_80mm17Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyName = bill.companyId?.name || company?.name;
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || `${company?.phoneNo?.countryCode || ""} ${company?.phoneNo?.phoneNo}`;
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "";
  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Walk in Customer";
  const customerPhone = bill.customerId?.phoneNo?.phoneNo ? `${bill.customerId.phoneNo.countryCode || ""} ${bill.customerId.phoneNo.phoneNo}` : "";
  const getCompanyAddress = () => {
    const addr = company?.address;
    if (!addr) return null;

    const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

    let addressStr = parts.join(", ");
    if (addr.pinCode) {
      addressStr += ` - ${addr.pinCode}`;
    }

    return addressStr;
  };

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header */}
      <div className="text-center">
        <div className="font-bold text-[16px]">{companyName}</div>
        <div className="text-[10px] w-50 mx-auto">{getCompanyAddress()}</div>
        <div className="text-[10px]">Ph: {companyPhone}</div>
        <div className="text-[10px] font-bold">GST No:{company?.GSTIdentificationNumber || "N/A"}</div>

        <div className="mt-2 font-bold underline">Invoice</div>
      </div>

      {/* Meta */}
      <div className="mt-2 text-[11px]">
        <div className="flex">
          <span>Invoice No</span>
          <span>: {bill.orderNo}</span>
        </div>
        <div className="flex">
          <span>Invoice Date</span>
          <span>: {createdDate}</span>
        </div>
        <div className="flex">
          <span>Name</span>
          <span>: {customerName}</span>
        </div>
        <div className="flex">
          <span>Phone No</span>
          <span>: {customerPhone}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-4 font-bold text-[11px]">
        <span>Product</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Price</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Items */}
      <div className="mt-1 text-[11px]">
        {bill.items.map((item, i) => (
          <div key={i} className="grid grid-cols-4">
            <span>{item.productId?.name || "Product Name"}</span>
            <span className="text-center">{Number(item?.qty || 0).toFixed(2)}</span>
            <span className="text-center">{Number(item?.mrp || 0).toFixed(2)}</span>
            <span className="text-right">{Number(item?.netAmount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Totals */}
      <div className="text-[11px]">
        <div className="flex justify-between">
          <span>Round off :</span>
          <span>{Number(bill.roundOff || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Bill Amount :</span>
          <span>{Number(bill.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Additional Charge :</span>
          <span>{Number(bill.additionalCharges || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Payment Details */}
      <div className="text-[11px]">
        <div className="font-bold">Payment Details:</div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>{Number(bill.totalDiscount || 0).toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between">
            <span>BY {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Summary */}
      <div className="text-center text-[11px]">
        <div>No. of Products: {Number(bill?.totalQty || 0).toFixed(2)}</div>
        <div>You Saved: {Number(bill.totalDiscount || 0).toFixed(2)}</div>

        <div className="mt-2 font-bold">Thank You, Visit Again!</div>
      </div>
    </div>
  );
});

export default Thermal_80mm17Jasper;
