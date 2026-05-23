import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";
import { FormatDateTime } from "../../../Utils";

const Thermal_80mm18Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || company.address?.address;
  const companyFssai = (bill?.companyId as any)?.fssaiNo || company.fssaiNo;
  const companyGst = (bill?.companyId as any)?.gstNo || company.GSTIdentificationNumber;
  const companyEmail = bill?.companyId?.email || company.email;
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || `${company.phoneNo?.countryCode || " "} ${company.phoneNo?.phoneNo || ""}`.trim() || company.phoneNo?.phoneNo;
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || company.address?.city?.name;

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim();
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo;
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1;

  const orderNo = bill?.orderNo;
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "05/01/2024";
  const invoiceTime = bill?.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "11:20";

  const totalQty = bill?.totalQty;
  const totalAmount = bill?.totalAmount;
  const roundOff = bill?.roundOff;
  const tendered = bill?.multiplePayments?.[0]?.amount;
  const change = bill?.totalAdditionalCharge;
  const discountItemsCount = bill?.items?.filter((i: any) => Number(i.discountAmount) > 0).length || 2;
  const totalDiscount = bill?.totalDiscount;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Logo */}

      {company?.reportFormatLogo && (
        <div className="text-center mb-2">
          <img src={company?.reportFormatLogo} alt="reportFormatLogo" className="w-12 h-12 object-contain mx-auto" />
        </div>
      )}

      {/* Invoice No */}
      <div className="text-center font-bold text-[13px]">Invoice No.</div>
      <div className="text-center font-bold text-[13px]">{orderNo}</div>

      {/* Address */}
      <div className="text-center text-[10px] mt-1 leading-snug">
        {companyAddress}
        <br />
        {companyFssai && `FSSAI No. ${companyFssai}`}
        {companyFssai && <br />}
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
          <span>Date : {invoiceDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile : {customerPhone}</span>
          <span>Time : {invoiceTime}</span>
        </div>
        <div>Invoice No : {orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-[20px_1fr_50px_50px_50px] font-bold text-[10px]">
        <span>#</span>
        <span>Item</span>
        <span className="text-center">MRP</span>
        <span className="text-center">Disc</span>
        <span className="text-right">Net Amt.</span>
      </div>

      {/* Items */}
      <div className="mt-1 text-[10px]">
        {bill?.items?.map((item: any, i: number) => {
          return (
            <div className="grid grid-cols-[20px_1fr_50px_50px_50px] mt-1" key={i}>
              <span>{i + 1}</span>
              <span>
                {item.productId?.name || "Product"} <br />
                <span className="text-[9px]">GST {(item?.productId?.isSalesTaxIncluding ? "INC" : "EXC") + item?.productId?.salesTaxId?.percentage}%</span>
              </span>
              <span className="text-center">{Number(item.mrp || 0).toFixed(3)}</span>
              <span className="text-center">{Number(item.discountAmount || 0).toFixed(2)}</span>
              <span className="text-right">{Number(item.netAmount || 0).toFixed(3)}</span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="text-[11px]">
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>{Number(roundOff).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{Number(totalAmount).toFixed(2)}</span>
        </div>
        {bill.multiplePayments?.map((payment, i) => (
          <div key={i} className="flex justify-between uppercase">
            <span>By {payment.method.toUpperCase()}</span>
            <span>{Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Summary */}
      <div className="text-center font-bold text-[10px]">
        NO OF QTY : {Number(totalQty).toFixed(0)} | DISCOUNT ITEMS : {discountItemsCount}
      </div>
      <div className="text-center text-[10px]">
        TENDERED : {Number(tendered).toFixed(2)} | CHANGE : {Number(change).toFixed(2)}
      </div>

      {/* Highlight Savings */}
      <div className="text-center font-bold text-[16px] mt-2">You Saved Rs : {Number(totalDiscount).toFixed(3)}</div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Amount words */}
      <div className="text-[10px]">Rupees Two Hundred and Ten Only</div>
      <div className="text-[10px]">Prices are inclusive of all taxes - Place of Supply : {placeOfSupply}</div>

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
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100) : 0;
            const taxable = (item.netAmount || 0) - (item.taxAmount || 0);
            const cgst = (item.taxAmount || 0) / 2;
            const sgst = (item.taxAmount || 0) / 2;

            if (!taxPct) return null;

            return (
              <tr key={i}>
                <td className="border-r border-black p-1">{Number(taxable).toFixed(3)}</td>
                <td className="border-r border-black p-1">{Number(cgst).toFixed(3)}</td>
                <td className="border-r border-black p-1">{Number(sgst).toFixed(3)}</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
            );
          }) || (
            <>
              <tr>
                <td className="border-r border-black p-1">40.179</td>
                <td className="border-r border-black p-1">2.411</td>
                <td className="border-r border-black p-1">2.411</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
              <tr>
                <td className="border-r border-black p-1">140.000</td>
                <td className="border-r border-black p-1">12.600</td>
                <td className="border-r border-black p-1">12.600</td>
                <td className="border-r border-black p-1">0.000</td>
                <td className="p-1">0.000</td>
              </tr>
            </>
          )}
        </tbody>
      </table> */}

      {/* Customer */}
      <div className="mt-2 text-[10px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Note */}
      <div className="text-[9px] mt-2">For better lasting use the jewelry OCCASIONALLY...</div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="text-center font-bold mt-2">Thank you for shopping with us</div>
      <div className="text-center font-bold">For Home Delivery</div>
      <div className="text-center font-bold text-[14px]">{companyPhone}</div>

      {/* Bottom */}
      <div className="flex justify-between text-[9px] mt-2 border-t border-dashed pt-1">
        <span>Printed On: {FormatDateTime(new Date())}</span>
        <span>E & O.E</span>
      </div>
    </div>
  );
});
export default Thermal_80mm18Jasper;
