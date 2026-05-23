import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDateTime } from "../../../Utils";

const Thermal_80mm3Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
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

  const companyFssai = (bill.companyId as any)?.fssaiNo || company.fssaiNo;
  const companyGst = (bill.companyId as any)?.gstNo || company.GSTIdentificationNumber;
  const companyPhone = bill.companyId?.phoneNo?.phoneNo || `${company.phoneNo?.countryCode || ""} ${company.phoneNo?.phoneNo || ""}`.trim() || company?.phoneNo?.phoneNo;

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "-";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "-";

  const orderNo = bill.orderNo || "-";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "-";
  const createdTime = bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

  const netAmount = bill.totalAmount || 0;
  const roundOff = bill.roundOff || 0;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Header */}
      <div className="text-center font-bold text-[14px] mt-1">{companyName}</div>

      <div className="text-center text-[10px]">
        <div className="text-[11px] leading-tight">{getCompanyAddress()}</div>
        FSSAI No. {companyFssai}
        <br />
        GSTIN No : {companyGst}
        <br />
        Phone No. {companyPhone}
      </div>

      <div className="text-center font-bold mt-2">Invoice</div>

      {/* Meta */}
      <div className="text-[10px] mt-2">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>
            Date : {createdDate} {createdTime}
          </span>
        </div>
        <div>Invoice No. : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-[30px_1fr] font-bold text-[10px]">
        <span>#</span>
        <span>Item Name</span>
      </div>
      <div className="grid grid-cols-[1fr_20px_50px_50px_50px] font-bold text-[10px]">
        <span>HSN</span>
        <span>QTY</span>
        <span className="text-center">MRP</span>
        <span className="text-center">Rate</span>
        <span className="text-right">Net Amt.</span>
      </div>

      {/* Item */}
      {bill.items?.map((item, i) => {
        const rate = Number(item.mrp || 0) - Number(item.discountAmount || 0) / Number(item.qty || 1);
        return (
          <div key={i} className="mt-1 text-[10px]">
            <div className="grid grid-cols-[30px_1fr]">
              <span>{i + 1}</span>
              <span>{item.productId?.name || "Prod"}</span>
            </div>
            <div className="grid grid-cols-[1fr_20px_50px_50px_50px]">
              <div className="text-left">{item.productId?.hsnCode || ""}</div>
              <div className="text-center">{Number(item.qty).toFixed(2)}</div>
              <span className="text-center">{Number(item.mrp).toFixed(2)}</span>
              <span className="text-center">{Number(rate).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount).toFixed(2)}</span>
            </div>
          </div>
        );
      })}

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Charges */}
      <div className="text-[10px]">
        {bill.additionalCharges?.map((charge, i) => (
          <div key={i} className="flex justify-between">
            <span>{charge.chargeId?.name || "-"}</span>
            <span>{Number(charge.totalAmount).toFixed(2)}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-1">
          <span>ADDITIONAL CHARGE</span>
          <span>{Number(bill?.totalAdditionalCharge || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[10px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{netAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{roundOff.toFixed(2)}</span>
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

      {/* Summary */}
      <div className="text-center text-[10px] font-bold">
        <div>PIECES PURCHASED : {bill.totalQty?.toFixed(2)}</div>
        <div>TENDERED : {netAmount.toFixed(2)}</div>
        <div>CHANGE : {bill?.totalAdditionalCharge?.toFixed(2)}</div>
      </div>

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
            <td className="border-r border-black p-1">113.65</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="border-r border-black p-1">0.00</td>
            <td className="border-r border-black p-1">N/A</td>
            <td className="p-1">13.64</td>
          </tr>
        </tbody>
      </table> */}

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div className="text-[9px]">Address : {customerAddress}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* T&C */}
      <div className="text-[9px]">
        {bill.remark && <div>Remark: {bill.remark}</div>}
      </div>

      {/* Footer */}
      <div className="text-center font-bold mt-2">Thank you for shopping with us!</div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2">
        <span>
          Printed On: {FormatDateTime(new Date())}
        </span>
        <span>E & O.E</span>
      </div>
    </div>
  );
});

export default Thermal_80mm3Jasper;
