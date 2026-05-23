import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const A5_1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
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
  const companyGst = (bill.companyId as any)?.gstNo || company?.GSTIdentificationNumber;
  const companyEmail = bill.companyId?.email || company?.email;
  const companyPhone = company.phoneNo?.phoneNo ? `${company.phoneNo.countryCode || ""} ${company.phoneNo.phoneNo}` : "";

  const customerName = `${bill.customerId?.firstName || ""} ${bill.customerId?.lastName || ""}`.trim() || "Demo Company For testing char";
  const customerAddress = (bill.customerId?.address as any)?.[0]?.addressLine1 || "Kurumbapet";
  const placeOfSupply = (bill.customerId?.address as any)?.[0]?.city?.name || "Puducherry";

  const orderNo = bill.orderNo || "-";
  const createdDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "19/11/2025";

  const subTotal = bill?.totalAmount + bill?.totalDiscount;
  const totalTax = bill?.items?.reduce((acc, item) => {
    const net = item.netAmount || 0;
    const taxRate = item?.productId?.salesTaxId?.percentage || 0;
    const mrp = Number(item.mrp) - Number(item.discountAmount) - Number(item.additionalDiscountAmount);
    const taxable = item?.productId?.isSalesTaxIncluding ? mrp - (mrp * taxRate) / 100 : mrp - (mrp * taxRate) / 100;
    const taxAmount = net - taxable;
    return acc + (Number(taxAmount) || 0);
  }, 0);

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-6 text-[12px] font-serif">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-2">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={company?.reportFormatLogo || "/logo.png"} alt="reportFormatLogo" className="w-16 h-16 object-contain" />
          <div>
            <div className="font-bold text-[20px]">{companyName}</div>
            <div className="text-[11px] leading-tight">{getCompanyAddress()}</div>
            <div className="text-[11px]">
              GSTIN NO : {companyGst} | Email : {companyEmail} | Customer Care : {companyPhone}
            </div>
          </div>
        </div>
      </div>

      {/* Buyer + Order */}
      <div className="grid grid-cols-2 border-b py-2 text-[12px]">
        <div>
          <div>
            <b>Buyer</b> : {customerName}
          </div>
          <div>
            <b>Place Of Supply</b> : {placeOfSupply}
          </div>
        </div>
        <div className="text-right">
          <div>
            <b>Order No.</b> : {orderNo}
          </div>
          <div>
            <b>Date</b> : {createdDate}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[11px] mt-2">
        <thead>
          <tr className="border bg-gray-100">
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Unit Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Taxable Value</th>
            <th className="border p-1">Tax(%)</th>
            <th className="border p-1">Tax Amount</th>
            <th className="border p-1">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill.items?.map((item: any, i: number) => {
            const net = item.netAmount || 0;
            const taxRate = item?.productId?.salesTaxId?.percentage || 0;
            const mrp = Number(item.mrp) - Number(item.discountAmount) - Number(item.additionalDiscountAmount);
            const taxable = item?.productId?.isSalesTaxIncluding ? mrp - (mrp * taxRate) / 100 : mrp - (mrp * taxRate) / 100;
            const taxAmount = net - taxable;
            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  {item.productId?.name || ""} <br />
                  {item.productId?.hsnCode && <span className="text-[10px]">Item HSN : {item.productId?.hsnCode}</span>}
                </td>
                <td className="border p-1 text-center">{Number(item.qty || 0).toFixed(1)}</td>
                <td className="border p-1 text-center">{item.productId?.uomId?.name || "-"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(taxable || 0).toFixed(2)}</td>
                <td className="border p-1 text-center">{item?.productId?.salesTaxId?.percentage}%</td>
                <td className="border p-1 text-right">{Number(taxAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(net || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">
                FGHG78 <br />
                <span className="text-[10px]">Item Code : AAAADLD404</span>
              </td>
              <td className="border p-1 text-center">1.0</td>
              <td className="border p-1 text-center">g</td>
              <td className="border p-1 text-right">1,400.00</td>
              <td className="border p-1 text-right">150.00</td>
              <td className="border p-1 text-right">0.00</td>
              <td className="border p-1 text-right">1,400.00</td>
              <td className="border p-1 text-right">133.93</td>
              <td className="border p-1 text-center">12.0</td>
              <td className="border p-1 text-right">16.07</td>
              <td className="border p-1 text-right">150.00</td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={2} className="border p-1 text-">
              Total Items
            </td>
            <td className="border p-1 text-center">{Number(bill?.items.reduce((acc, item) => acc + Number(item.qty || 0), 0).toFixed(2))}</td>
            <td colSpan={9}></td>
          </tr>
        </tfoot>
      </table>

      {/* Tax Summary + Totals */}
      <div className="flex justify-end mt-3 gap-4">
        <div className="text-right text-[12px]">
          <div>Sub Total : {subTotal?.toFixed(2)}</div>
          <div>Tax Amount : {totalTax?.toFixed(2)}</div>
          <div>Additional Discount : {bill?.totalDiscount?.toFixed(2)}</div>
          <div>Round Off : {bill?.roundOff?.toFixed(2)}</div>
          {bill.multiplePayments?.map((payment, i) => (
            <div key={i}>
              <span>
                By {payment.method.toUpperCase()} : {Number(payment.amount || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer */}
      <div className="mt-3 text-[12px]">
        <div>Rupees One Hundred and Fifty Only</div>

        <div className="font-bold mt-1">CUSTOMER DETAILS</div>
        <div>Address : {customerAddress}</div>
      </div>

      {/* Terms */}
      <div className="mt-3 text-[12px]">
        <div className="font-bold">Terms & Conditions</div>
        <div>No Warranty.</div>
        <div>No Change.</div>
        <div>No Return.</div>
      </div>

      {/* Signature */}
      <div className="mt-10 text-right">
        <div className="border-t w-48 ml-auto" />
        <div>Authorised Signatory</div>
      </div>
    </div>
  );
});
export default A5_1Jasper;
