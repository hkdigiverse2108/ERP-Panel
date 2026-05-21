import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const Thermal_80mm4Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyName = bill.companyId?.name || company?.name;
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
  const companyEmail = bill.companyId?.email || company?.email;

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Cash Sales";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "Adityana,Gujarat,India";

  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "27/04/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "07:02:52 PM";

  const grossAmount = bill.items?.reduce((acc, item) => acc + Number(item.mrp || 0), 0) || 0;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header with Logo */}
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="text-center font-bold text-[13px]">{companyName}</div>
      </div>

      <div className="text-center text-[10px] w-50 mx-auto">{getCompanyAddress()}</div>

      <div className="text-center text-[10px]">{companyEmail}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Meta */}
      <div className="text-[10px]">
        <div className="flex justify-between">
          <span>Bill No. : {bill.orderNo || "-"}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <div>Name : {customerName}</div>
          <span>Time : {createdTime}</span>
        </div>
        <div>
          <div>Address : {customerAddress}</div>
        </div>
      </div>

      {/* Item Header */}
      <div className="text-center font-bold border-y border-black py-1">ITEM NAME</div>

      {/* Columns */}
      <div className="grid grid-cols-4 font-bold text-[10px] mt-1 border-b border-black">
        <span>Quantity</span>
        <span className="text-center">RATE</span>
        <span className="text-center">Discount</span>
        <span className="text-right">NET AMOUNT</span>
      </div>

      {/* Item */}
      {bill.items?.map((item: any, i: number) => (
        <div key={i} className="text-[10px] mt-1">
          <div className="flex justify-between font-semibold">
            <span>{item.productId?.name || "Test demo yellow"}</span>
            <span>GST : {item?.productId?.salesTaxId?.percentage ? item?.productId?.salesTaxId?.percentage.toFixed(2) : "0.00"} %</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Qty: {Number(item.qty).toFixed(2)}</span>
            <span>Rate: {Number(item.mrp).toFixed(2)}</span>
            <span>Disc: {Number(item.discountAmount).toFixed(2)}</span>
            <span>Amt: {Number(item.netAmount).toFixed(2)}</span>
          </div>
        </div>
      )) || (
        <div className="text-[10px] mt-1">
          <div className="font-bold">Test demo yellow</div>
          <div className="text-[9px] italic">Description : The product is available in the store with a stock of 21,5L & 7L</div>

          <div className="flex justify-between mt-1">
            <span>Qty: 1.000</span>
            <span>Rate: 2010.00</span>
            <span>Disc: 500</span>
          </div>

          <div className="text-right font-bold mt-1">GST : 9.00% &nbsp;&nbsp; 2163.60</div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Totals */}
      <div className="flex justify-between font-bold">
        <span>QTY TOTAL: {Number(bill?.totalQty || 0).toFixed(2)}</span>
        <span>AMT TOTAL: {Number(bill?.totalAmount || 0).toFixed(2)}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Payment Summary */}
      <div className="text-center font-bold">PAYMENT SUMMARY</div>

      <div className="text-[10px] mt-1">
        <div className="text-center">Gross Amount : {Number(grossAmount).toFixed(2)}</div>
        <div className="text-center font-bold">Net Amount : {Number(bill?.totalAmount).toFixed(2)}</div>
        <div className="text-center">You Saved : {Number(bill.totalDiscount).toFixed(2)}</div>

        <div className="text-center text-[9px]">&lt;-- Amount Received From Customer --&gt;</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Terms */}
      <div className="text-[9px]">
        <div className="font-bold">Terms & Conditions :</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {new Date().toLocaleString()}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default Thermal_80mm4Jasper;
