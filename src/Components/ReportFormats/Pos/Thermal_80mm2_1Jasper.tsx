import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDateTime } from "../../../Utils";

const Thermal_80mm2_1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyName = bill.companyId?.name || company.name;
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
  const companyState = (bill.companyId?.address as any)?.[0]?.state?.name || company?.address?.state?.name;
  const companyEmail = bill.companyId?.email || company?.email;
  const companyPhone = `${company.phoneNo?.countryCode || ""} ${company.phoneNo?.phoneNo || ""}`.trim() || company?.phoneNo?.phoneNo;
  const companyGst = (bill.companyId as any)?.gstNo || company?.GSTIdentificationNumber;

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Cash Sales";
  const customerPhone = `${bill.customerId?.phoneNo?.countryCode || ""} ${bill.customerId?.phoneNo?.phoneNo || ""}`.trim() || "";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "-";

  const orderNo = bill.orderNo || "-";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "03/07/2023";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "06:07 PM";

  return (
    <div ref={ref} className="w-[80mm] mx-auto text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header */}
      <div className="text-center font-bold uppercase">{companyName}</div>

      <div className="text-center mt-1 font-bold">Invoice</div>

      <div className="text-center text-[10px] leading-snug">
        <div className="text-[11px] leading-tight">{getCompanyAddress()}</div>
        GSTIN NO : {companyGst}
        <br />
        Email : {companyEmail}
        <br />
        Phone No : {companyPhone}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Meta */}
      <div className="text-[10px]">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile : {customerPhone}</span>
          <span>Time : {createdTime}</span>
        </div>
        <div>Invoice No : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-[20px_1fr_50px_50px_50px] font-bold text-[10px]">
        <span>#</span>
        <span>Item</span>
        <span className="text-center">Qty</span>
        <span className="text-center">MRP</span>
        <span className="text-right">Net Amt</span>
      </div>

      {/* Item */}
      {bill.items?.map((item: any, i: number) => {
        // const taxPct = item.productId?.salesTaxId?.percentage ? ((item.productId?.salesTaxId?.percentage || 0) * 100).toFixed(0) : "5";
        return (
          <div key={i} className="mt-1 text-[10px]">
            <div className="grid grid-cols-[20px_1fr_50px_50px_50px]">
              <span>{i + 1}</span>
              <span>
                {item.productId?.name || "Format 4"}
                {/* <div className="text-[9px] font-bold">
                  HSN: {item.productId?.hsnCode || "12345678"} GST {taxPct}%
                </div> */}
              </span>
              <span className="text-center">{Number(item.qty).toFixed(2)}</span>
              <span className="text-center">{Number(item.mrp).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount).toFixed(2)}</span>
            </div>
          </div>
        );
      })}

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[10px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{bill?.totalAmount?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{bill?.roundOff?.toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between">
            <span>By {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0)?.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Tender */}
      <div className="text-center text-[10px] font-bold">NO OF QTY : {bill?.totalQty?.toFixed(2)}</div>
      <div className="text-center text-[10px]">
        TENDERED : {bill?.totalAmount?.toFixed(2)} | CHANGE : {bill?.totalAdditionalCharge?.toFixed(2)}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Amount in words */}
      <div className="text-[10px]">Rupees Two Hundred and Ten Only</div>
      <div className="text-[10px]">Prices are inclusive of all taxes - Place of Supply : {companyState}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Tax Summary */}
      {/* <div className="text-center font-bold text-[10px] mb-1">TAX SUMMARY</div>

      <table className="w-full text-[9px] border border-black text-center">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black p-1">TAXABLE VALUE</th>
            <th className="border-r border-black p-1">CGST</th>
            <th className="border-r border-black p-1">SGST</th>
            <th className="border-r border-black p-1">Cess</th>
            <th className="p-1">IGST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r border-black p-1">200.00</td>
            <td className="border-r border-black p-1">5.00</td>
            <td className="border-r border-black p-1">5.00</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="p-1">0.00</td>
          </tr>
        </tbody>
      </table> */}

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Terms */}
      <div className="text-[9px]">
        <div className="font-bold">T & C</div>
        <div>id and password must be required</div>
        <div>Exchanges will only be allowed within 10 days</div>
        <div>Any Complaint Regarding the Quality should be discussed within 2-3 days</div>
        {bill.remark && <div>Remark: {bill.remark}</div>}
      </div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="text-center mt-2 font-bold">Thank you for shopping with us</div>
      <div className="text-center font-bold text-[14px]">For Home Delivery</div>
      <div className="text-center font-bold text-[14px]">{companyPhone}</div>

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>Printed On: {FormatDateTime(new Date())}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});
export default Thermal_80mm2_1Jasper;
