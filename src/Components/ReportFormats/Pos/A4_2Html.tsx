import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A4_2Html = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
  // Extract values with fallbacks to original dummy data
  const companyName = bill?.companyId?.name || "VasyERP";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "Synthesis The First, Corporate House, THE FIRST, A5, Nyay Marg, near Itc Narmada, I I M, Vastrapur";
  const companyCity = (bill?.companyId?.address as any)?.[0]?.city?.name || "Ahmedabad";
  const companyPincode = (bill?.companyId?.address as any)?.[0]?.pincode || "380054";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "1234567899";
  const companyEmail = bill?.companyId?.email || "email.vasyerp@gmail.com";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Gujarat";
  const companyGst = (bill?.companyId as any)?.gstNo || "07AAGFF2194N1Z1";
  const companyFssai = (bill?.companyId as any)?.fssaiNo || "12345678901234";
  const companyWebsite = (bill?.companyId as any)?.website || "www.vasyerp.com";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";

  const customerName = `${bill?.customerId?.firstName || ""} ${bill?.customerId?.lastName || ""}`.trim() || "c_first name c_last name";
  const customerAddress = (bill?.customerId?.address as any)?.[0]?.addressLine1 || "Address Other - 123456";
  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Other";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "India";
  const customerState = (bill?.customerId?.address as any)?.[0]?.state?.name || "37-Other";
  const customerPhone = bill?.customerId?.phoneNo?.phoneNo || "12345678900";
  
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "37-Other";
  const orderNo = bill?.orderNo || "POS3644";
  const orderDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "28-06-2023";

  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1.00;
  const subTotal = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.mrp) * Number(item.qty) || 0), 0) || 341.94;
  const totalTaxAmount = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.taxAmount) || 0), 0) || 41.37;
  const totalDiscount = bill?.totalDiscount || 0.01;
  const totalNet = bill?.totalAmount || 385.00;
  const paymentMode = bill?.multiplePayments?.[0]?.method || "Cash";

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-6 text-[13px]">
      {/* Top Checkboxes */}
      <div className="flex justify-end gap-6 text-[12px]">
        <label>
          <input type="checkbox" /> Original
        </label>
        <label>
          <input type="checkbox" /> Duplicate
        </label>
        <label>
          <input type="checkbox" /> Triplicate
        </label>
      </div>

      {/* Header */}
      <div className="flex justify-between mt-2">
        {/* Left */}
        <div className="text-[12px] leading-tight">
          <div className="font-bold text-[16px]">{companyName}</div>
          <div>{companyAddress}</div>
          <div>{companyCity} - {companyPincode}</div>
          <div>Phone no.: {companyPhone}</div>
          <div>Email: {companyEmail}</div>
          <div>State: {companyState}</div>
          <div>GSTIN No: {companyGst}</div>
          {companyFssai && <div>FSSAI No: {companyFssai}</div>}
          {companyWebsite && <div>Website: {companyWebsite}</div>}
        </div>

        {/* Logo */}
        <div className="text-right">
          <img src={logo} className="w-32 object-contain" alt="logo" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center text-brand-500 font-bold text-[20px] mt-4">Tax Invoice</div>

      {/* Bill + Meta */}
      <div className="flex justify-between mt-4">
        {/* Left */}
        <div className="text-[12px]">
          <div className="font-bold">Bill To:</div>
          <div>{customerName}</div>
          <div>{customerAddress} {customerCity} {customerCountry}</div>
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
            <th className="p-2 text-right">Discount2</th>
            <th className="p-2 text-right">GST</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const taxPct = item.taxAmount ? ((item.taxAmount / item.mrp) * 100).toFixed(0) : "0";
            return (
              <tr key={i} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 font-bold">{item.productId?.name || "Product Name"}</td>
                <td className="p-2">{item.productId?.hsnCode || ""}</td>
                <td className="p-2 text-center">{Number(item.qty || 1).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="p-2 text-right">{Number(item.discountAmount || 0).toFixed(2)}</td>
                <td className="p-2 text-right">0.00</td>
                <td className="p-2 text-right">{Number(item.taxAmount || 0).toFixed(2)} ({taxPct}%)</td>
                <td className="p-2 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr className="border-t">
              <td className="p-2">1</td>
              <td className="p-2 font-bold">Product name Blue / I</td>
              <td className="p-2"></td>
              <td className="p-2 text-center">1.00</td>
              <td className="p-2 text-right">241.94</td>
              <td className="p-2 text-right">0.01</td>
              <td className="p-2 text-right">0.00</td>
              <td className="p-2 text-right">41.37 (18%)</td>
              <td className="p-2 text-right">285.00</td>
            </tr>
          )}

          <tr className="border-t font-bold">
            <td></td>
            <td className="p-2">Total</td>
            <td></td>
            <td className="p-2 text-center">{Number(totalQty).toFixed(2)}</td>
            <td></td>
            <td className="p-2 text-right">{Number(totalDiscount).toFixed(2)}</td>
            <td className="p-2 text-right">0.00</td>
            <td className="p-2 text-right">{Number(totalTaxAmount).toFixed(2)}</td>
            <td className="p-2 text-right">{Number(totalNet).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Left */}
        <div>
          <div className="font-bold text-gray-600">INVOICE AMOUNT IN WORDS</div>
          <div className="bg-gray-100 p-2 mt-1">Rupees Three Hundred and Eighty Five Only</div>

          <div className="mt-3 font-bold">TERMS AND CONDITIONS</div>
          <div className="text-[12px] mt-1">
            NO RETURN / NO EXCHANGE <br />
            Please check items before leave store <br />
            dasdasd <br />
            12345678 <br />
            T&C 5 <br />
            wertyuion <br />
            zxcvbnm
          </div>
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

          <div className="flex justify-between bg-brand-500 text-white px-2 py-1 font-bold">
            <span>Total</span>
            <span>{Number(totalNet).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-1">
            <span>Received</span>
            <span>{Number(totalNet).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Balance</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Mode</span>
            <span><span className="capitalize">{paymentMode}</span></span>
          </div>
          <div className="flex justify-between">
            <span>Previous Balance</span>
            <span>0.00</span>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="mt-6">
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
            }) || (
              <>
                <tr>
                  <td className="border p-2">0%</td>
                  <td className="border p-2">100.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                </tr>
                <tr>
                  <td className="border p-2">18%</td>
                  <td className="border p-2">241.94</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">41.37</td>
                  <td className="border p-2">13.79</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default A4_2Html;
