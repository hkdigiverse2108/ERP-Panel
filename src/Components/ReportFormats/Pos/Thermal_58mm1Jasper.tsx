import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const Thermal_58mm1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);

  if (!bill) return null;

  const companyName = bill.companyId?.name || company?.name;
  const companyPhone = company.phoneNo?.phoneNo ? `${company.phoneNo.countryCode || ""} ${company.phoneNo.phoneNo}` : "";
  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Walk in Customer";
  const customerPhone = bill.customerId?.phoneNo?.phoneNo ? `${bill.customerId.phoneNo.countryCode || ""} ${bill.customerId.phoneNo.phoneNo}` : "";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "";
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
    <div ref={ref} className="w-[58mm] mx-auto bg-white text-black font-mono text-[10px] p-2 leading-tight">
      <div className="flex justify-center">
        <img src={company?.reportFormatLogo || "/logo.png"} alt="reportFormatLogo" className="w-14 h-14 object-contain" />
      </div>
      {/* Logo + Invoice */}
      <div className="flex items-center justify-between my-1">
        <div className="text-center flex-1">
          <div className="font-bold text-[12px]">INVOICE</div>
          <div className="text-[9px]">{companyName}</div>
        </div>
      </div>
      {/* Address */}
      <div className="text-[10px] w-50 mx-auto text-center">{getCompanyAddress()}</div>
      {/* Contact */}
      <div className="text-center text-[9px] mt-1">Email : {company?.email}</div>
      <div className="text-center text-[9px]">Phone No : {companyPhone}</div>
      {/* Divider */}
      <div className="border-t border-dashed my-1" />
      {/* Meta */}
      <div className="text-[9px]">
        <div className="flex justify-between">
          <span>Name : {customerName}</span>
          <span>Date : {createdDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile No : {customerPhone}</span>
          <div>Invoice No : {bill.orderNo}</div>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-dashed my-1" />
      {/* Table Header */}
      <div className="grid grid-cols-4 font-bold text-[9px]">
        <span>#</span>
        <span>Item Name</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Net Amt.</span>
      </div>
      {/* Item */}
      {bill.items?.map((item: any, i: number) => (
        <div className="text-[9px] mt-1">
          <div className="grid grid-cols-4">
            <span>{i + 1}</span>
            <span>
              {item.productId?.name || ""}
              {item.description && <div className="text-[8px] italic line-clamp-2">Description : {item.description}</div>}
            </span>
            <span className="text-center">{Number(item?.qty || 0).toFixed(2)}</span>
            <span className="text-right">{Number(item?.netAmount || 0).toFixed(2)}</span>
          </div>
        </div>
      ))}
      {/* Divider */}
      <div className="border-t border-dashed my-1" />
      {/* Charges */}
      <div className="text-[9px]">
        <div className="flex justify-between">
          <span>Test Additional Charge</span>
          <span>{Number(bill?.totalAdditionalCharge || 0).toFixed(2)}</span>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-dashed my-1" />
      {/* Totals */}
      <div className="text-[9px]">
        <div className="flex justify-between font-bold">
          <span>Total Amount</span>
          <span>{Number(bill.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>{Number(bill.totalDiscount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Round Off</span>
          <span>{Number(bill.roundOff || 0).toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between">
            <span>By {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {/* Divider */}
      <div className="border-t border-dashed my-1" />
      {/* Summary */}
      <div className="text-center text-[9px]">
        <div className="font-bold">You Saved Rs : {Number(bill.totalDiscount || 0).toFixed(2)}</div>
      </div>
      {/* Notes */}
      <div className="text-[8px] mt-1">
        <div>Proper Hsn Document Please...</div>
      </div>

      {/* Customer */}
      <div className="mt-1 text-[9px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>
      {/* Terms */}
      <div className="text-[8px] mt-1">
        <div className="font-bold">T & C</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
        <div className="font-bold">Note: This is test remark</div>
      </div>
      {/* Footer */}
      <div className="text-center text-[9px] mt-1">We hope you had a pleasant experience</div>
      {/* Bottom */}
      <div className="flex justify-between text-[8px] mt-2">
        <span>Printed On: {new Date().toLocaleString()}</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default Thermal_58mm1Jasper;
