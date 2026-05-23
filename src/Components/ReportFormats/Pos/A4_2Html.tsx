import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";
import { useAppSelector } from "../../../Store/hooks";

const A4_2Html = forwardRef<HTMLDivElement, { bill?: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  // Extract values with fallbacks to original dummy data
  const companyName = bill?.companyId?.name || company.name;
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || company.address?.address;
  const companyCity = (bill?.companyId?.address as any)?.[0]?.city?.name || company.address?.city?.name;
  const companyPincode = (bill?.companyId?.address as any)?.[0]?.pincode || company.address?.pinCode;
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || `${company.phoneNo?.countryCode || " "} ${company.phoneNo?.phoneNo || ""}`.trim() || company.phoneNo?.phoneNo;
  const companyEmail = bill?.companyId?.email || company.email;
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || company.address?.state?.name;
  const companyGst = (bill?.companyId as any)?.gstNo || company.GSTIdentificationNumber;
  const companyFssai = (bill?.companyId as any)?.fssaiNo || company.fssaiNo;
  const companyWebsite = (bill?.companyId as any)?.website || company.website;

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim();
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "";
  const customerState = (bill?.customerId?.address as any)?.[0]?.state?.name || "";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "";

  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name;
  const orderNo = bill?.orderNo;
  const orderDate = new Date(bill.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-");

  const totalQty = bill?.totalQty;
  const totalTaxableValue = bill?.items?.reduce((acc: number, item: any) => {
    const taxRate = item?.productId?.salesTaxId?.percentage || 0;
    const mrp = Number(item.mrp) - Number(item.discountAmount) - Number(item.additionalDiscountAmount);
    const taxable = item?.productId?.isSalesTaxIncluding ? mrp - (mrp * taxRate) / 100 : mrp - (mrp * taxRate) / 100;
    return acc + taxable;
  }, 0);
  const totalTaxAmount = bill?.items?.reduce((acc: number, item: any) => {
    const net = item.netAmount || 0;
    const taxRate = item?.productId?.salesTaxId?.percentage || 0;
    const mrp = Number(item.mrp) - Number(item.discountAmount) - Number(item.additionalDiscountAmount);
    const taxable = item?.productId?.isSalesTaxIncluding ? mrp - (mrp * taxRate) / 100 : mrp - (mrp * taxRate) / 100;
    const taxAmount = net - taxable;
    return acc + taxAmount;
  }, 0);
  const subTotal = totalTaxableValue + totalTaxAmount + Number(bill?.totalDiscount);
  const totalDiscount = bill?.totalDiscount;
  const totalNet = bill?.totalAmount;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-6 text-[13px]">
      {/* Top Checkboxes */}
      {/* <div className="flex justify-end gap-6 text-[12px]">
        <label>
          <input type="checkbox" /> Original
        </label>
        <label>
          <input type="checkbox" /> Duplicate
        </label>
        <label>
          <input type="checkbox" /> Triplicate
        </label>
      </div> */}

      {/* Header */}
      <div className="flex justify-between mt-2">
        {/* Left */}
        <div className="text-[12px] leading-tight">
          <div className="font-bold text-[16px]">{companyName}</div>
          <div>{companyAddress}</div>
          <div>
            {companyCity} - {companyPincode}
          </div>
          <div>Phone no.: {companyPhone}</div>
          <div>Email: {companyEmail}</div>
          <div>State: {companyState}</div>
          <div>GSTIN No: {companyGst}</div>
          {companyFssai && <div>FSSAI No: {companyFssai}</div>}
          {companyWebsite && <div>Website: {companyWebsite}</div>}
        </div>

        {/* Logo */}
        {company?.reportFormatLogo && (
          <div className="text-right">
            <img src={company?.reportFormatLogo} alt="reportFormatLogo" className="w-20 h-20 object-contain" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-center text-brand-500 font-bold text-[20px] mt-4">Tax Invoice</div>

      {/* Bill + Meta */}
      <div className="flex justify-between mt-4">
        {/* Left */}
        <div className="text-[12px]">
          <div className="font-bold">Bill To:</div>
          <div>{customerName}</div>
          <div>
            {customerAddress} {customerCity} {customerCountry}
          </div>
          <div>Contact No: {customerPhone}</div>
          <div>State: {customerState}</div>
        </div>

        {/* Right */}
        <div className="text-[12px] text-right">
          <div>Place of supply: {placeOfSupply}</div>
          <div>
            <b>Invoice No.:</b> {orderNo}
          </div>
          <div>
            <b>Date:</b> {orderDate}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mt-4 text-[12px] border">
        <thead className="bg-brand-500 text-white">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Item name</th>
            <th className="p-2 text-left">HSN/ SAC</th>
            <th className="p-2 text-center">Quantity</th>
            <th className="p-2 text-right">Price/ Unit</th>
            <th className="p-2 text-right">Discount</th>
            <th className="p-2 text-right">Taxable Value</th>
            <th className="p-2 text-right">GST</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const net = item.netAmount || 0;
            const taxRate = item?.productId?.salesTaxId?.percentage || 0;
            const mrp = Number(item.mrp) - Number(item.discountAmount) - Number(item.additionalDiscountAmount);
            const taxable = item?.productId?.isSalesTaxIncluding ? mrp - (mrp * taxRate) / 100 : mrp - (mrp * taxRate) / 100;
            const taxAmount = net - taxable;
            return (
              <tr key={i} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 font-bold">{item.productId?.name}</td>
                <td className="p-2">{item.productId?.hsnCode}</td>
                <td className="p-2 text-center">{Number(item.qty).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(item.mrp).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(item.discountAmount).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(taxable).toFixed(2)}</td>
                <td className="p-2 text-right">
                  {Number(taxAmount).toFixed(2)} ({item?.productId?.salesTaxId?.percentage}%)
                </td>
                <td className="p-2 text-right">{Number(net).toFixed(2)}</td>
              </tr>
            );
          })}

          <tr className="border-t font-bold">
            <td></td>
            <td className="p-2">Total</td>
            <td></td>
            <td className="p-2 text-center">{Number(totalQty).toFixed(2)}</td>
            <td></td>
            <td className="p-2 text-right">{Number(totalDiscount).toFixed(2)}</td>
            <td className="p-2 text-right">{Number(totalTaxableValue).toFixed(2)}</td>
            <td className="p-2 text-right">{Number(totalTaxAmount).toFixed(2)}</td>
            <td className="p-2 text-right">{Number(totalTaxableValue + totalTaxAmount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Left */}
        <div>
          <div className="font-bold text-gray-600">INVOICE AMOUNT IN WORDS</div>
          <div className="bg-gray-100 p-2 mt-1">Rupees Three Hundred and Eighty Five Only</div>

          {/* <div className="mt-3 font-bold">TERMS AND CONDITIONS</div>
          <div className="text-[12px] mt-1">
            NO RETURN / NO EXCHANGE <br />
            Please check items before leave store <br />
            dasdasd <br />
            12345678 <br />
            T&C 5 <br />
            wertyuion <br />
            zxcvbnm
          </div> */}
          <div className="text-[12px] mt-1">{bill.remark && <div>Remark: {bill.remark}</div>}</div>
        </div>

        {/* Right Totals */}
        <div className="text-[13px]">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>{Number(subTotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>{Number(totalDiscount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Additional Charges</span>
            <span>{Number(bill?.totalAdditionalCharge).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Round Off</span>
            <span>{bill?.roundOff?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between bg-brand-500 text-white px-2 py-1 font-bold">
            <span>Total</span>
            <span>{Number(totalNet).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Received</span>
            <span>{Number(totalNet).toFixed(2)}</span>
          </div>
          {bill.multiplePayments?.map((payment, i) => (
            <div key={i} className="flex justify-between">
              <span>By {payment.method.toUpperCase()}</span>
              <span>{Number(payment.amount || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Summary */}
      {/* <div className="mt-6">
        <div className="text-center font-bold mb-2">Tax Summary</div>

        <table className="w-full border text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Tax Rate</th>
              <th className="border p-2">Taxable amount</th>
              <th className="border p-2">CGST</th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">IGST</th>
              <th className="border p-2">CESS</th>
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
                  <td className="border p-2">{Number(taxPct).toFixed(0)}%</td>
                  <td className="border p-2">{Number(taxable).toFixed(2)}</td>
                  <td className="border p-2">{Number(cgst).toFixed(2)}</td>
                  <td className="border p-2">{Number(sgst).toFixed(2)}</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
    </div>
  );
});

export default A4_2Html;
