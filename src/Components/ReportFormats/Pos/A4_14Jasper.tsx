import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const A4_14Jasper = forwardRef<HTMLDivElement, { bill?: PosOrderBase | any }>(({ bill }, ref) => {
//   const companyName = bill?.companyId?.name || "Supplier Name";
  const companyAddress = (bill?.companyId?.address as any)?.[0]?.addressLine1 || "Mumbai";
  const companyEmail = bill?.companyId?.email || "vishpops23@gmail.com";
  const companyPhone = bill?.companyId?.phoneNo?.phoneNo || "9999100100";
  const companyGst = (bill?.companyId as any)?.gstNo || "22AAAA0000A1Z5";
  const companyState = (bill?.companyId?.address as any)?.[0]?.state?.name || "Maharashtra(27)";
  const logo = (bill?.companyId as any)?.logo || "/logo.png";

  const customerCity = (bill?.customerId?.address as any)?.[0]?.city?.name || "Bangalore";
  const customerState = (bill?.customerId?.address as any)?.[0]?.state?.name || "Karnataka";
  const customerCountry = (bill?.customerId?.address as any)?.[0]?.country?.name || "India";

  const orderNo = bill?.orderNo || "ORD4";
  const invoiceDate = bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : "26/09/2023";
  const dueDate = bill?.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-GB") : "26/09/2023";
  
  const placeOfSupply = (bill?.customerId?.address as any)?.[0]?.city?.name || "Bangalore";
  
  const totalQty = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.qty) || 0), 0) || 1.00;
  const totalAmount = bill?.items?.reduce((acc: number, item: any) => acc + (Number(item.netAmount) || 0), 0) || 984.01;
  const flatDiscount = bill?.totalDiscount || 0.00;
  const cdValue = 14.98; // keep dummy for cdValue if not in model
  const roundOff = bill?.roundOff || -0.01;
  const netPayable = bill?.totalAmount || 984.00;

  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[12px] border">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b pb-1">
        <div></div>
        <div className="border px-6 py-1 font-bold text-[16px]">Tax Invoice</div>
        <div className="text-[11px]">Original / Duplicate / Transport</div>
      </div>

      {/* Invoice + Transport */}
      <div className="grid grid-cols-2 border-b py-2">
        <div>
          <div>Invoice No : {orderNo}</div>
          <div>Invoice Date : {invoiceDate}</div>
          <div>Order No :</div>
          <div>Payment Terms :</div>
        </div>

        <div className="text-right">
          <div>Transporter Name :</div>
          <div>E-Way Bill No :</div>
          <div>Vehicle No :</div>
          <div>Due Date : {dueDate}</div>

          {/* Logo */}
          <div className="flex justify-end mt-2">
            <img src={logo} className="w-24 h-12 object-contain" alt="logo" />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-3 border-b">
        <div className="border-r p-2">
          <div className="font-bold text-center">Supplier Address</div>
          <div>{companyAddress}</div>
          <div>Email : {companyEmail}</div>
          <div>Contact No : {companyPhone}</div>
          <div>GSTIN/UIN : {companyGst}</div>
          <div>State : {companyState}</div>
        </div>

        <div className="border-r p-2">
          <div className="font-bold text-center">Billing Address</div>
          <div>{customerCity}</div>
          <div>{customerCountry}</div>
        </div>

        <div className="p-2">
          <div className="font-bold text-center">Shipping Address</div>
          <div>{customerCity}</div>
          <div>{customerState}</div>
          <div>{customerCountry}</div>
        </div>
      </div>

      <div className="text-center text-[10px] mt-1">Place of Supply : {placeOfSupply}</div>

      {/* Main Table */}
      <table className="w-full border mt-2 text-[11px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">MRP</th>
            <th className="border p-1">Billing Price</th>
            <th className="border p-1">Tax Discount</th>
            <th className="border p-1">CD Value</th>
            <th className="border p-1">Net Billing Price</th>
            <th className="border p-1">Tax Value</th>
            <th className="border p-1">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item: any, i: number) => {
            const billingPrice = item.mrp || 0;
            const netBillingPrice = (item.netAmount || 0) - (item.taxAmount || 0);
            return (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  <b>{item.productId?.name || "Product Name"}</b>
                  {item.description && (
                    <>
                      <br />
                      {item.description}
                    </>
                  )}
                </td>
                <td className="border p-1 text-center">{Number(item.qty || 1).toFixed(2)}</td>
                <td className="border p-1 text-center">{item.productId?.unit?.name || "NOS"}</td>
                <td className="border p-1 text-right">{Number(item.mrp || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(billingPrice).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.discountAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.cdValue || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(netBillingPrice).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.taxAmount || 0).toFixed(2)}</td>
                <td className="border p-1 text-right">{Number(item.netAmount || 0).toFixed(2)}</td>
              </tr>
            );
          }) || (
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">
                <b>Acrylic Camouflage Short</b>
                <br />
                Acrylic Camouflage Short Xcache Oxy:
              </td>
              <td className="border p-1 text-center">1.00</td>
              <td className="border p-1 text-center">NOS</td>
              <td className="border p-1 text-right">999.00</td>
              <td className="border p-1 text-right">999.00</td>
              <td className="border p-1 text-right">0.00</td>
              <td className="border p-1 text-right">14.98</td>
              <td className="border p-1 text-right">984.01</td>
              <td className="border p-1 text-right">0.00</td>
              <td className="border p-1 text-right">984.01</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : {Number(totalQty).toFixed(2)}</span>
        <span>{Number(totalAmount).toFixed(2)}</span>
      </div>

      {/* Summary Right */}
      <div className="flex justify-end mt-2">
        <div className="border p-2 w-[250px] text-[12px]">
          <div className="flex justify-between">
            <span>Flat Discount</span>
            <span>{Number(flatDiscount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>CD</span>
            <span>{Number(cdValue).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Round Off</span>
            <span>{Number(roundOff).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net Payable</span>
            <span>{Number(netPayable).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-[11px] text-center">
          <thead>
            <tr>
              <th className="border p-1">HSN</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Taxable Value</th>
              <th className="border p-1">CGST</th>
              <th className="border p-1">SGST</th>
              <th className="border p-1">IGST</th>
              <th className="border p-1">CESS</th>
              <th className="border p-1">TOTAL</th>
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
                  <td className="border p-1">{item.productId?.hsnCode || "-"}</td>
                  <td className="border p-1">{Number(taxPct).toFixed(0)}%</td>
                  <td className="border p-1">{Number(taxable).toFixed(2)}</td>
                  <td className="border p-1">{Number(cgst).toFixed(2)}</td>
                  <td className="border p-1">{Number(sgst).toFixed(2)}</td>
                  <td className="border p-1">0.00</td>
                  <td className="border p-1">0.00</td>
                  <td className="border p-1">{Number(item.taxAmount || 0).toFixed(2)}</td>
                </tr>
              );
            }) || (
              <tr>
                <td className="border p-1">64059000</td>
                <td className="border p-1">0%</td>
                <td className="border p-1">984.01</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
                <td className="border p-1">0.00</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-3">
        <div>Rupees Nine Hundred and Eighty Four Only</div>

        <div className="flex justify-between mt-4">
          <div>
            <div className="font-bold">Terms & Conditions</div>
          </div>

          <div className="text-right">
            <div>For, {bill?.companyId?.name ? bill.companyId.name : ""}</div>
            <div className="mt-6 border-t w-48 ml-auto"></div>
            <div>Authorised Signatory</div>
          </div>
        </div>

        <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
          <span>This is computer generated pos.</span>
          <span>Page 1 of 1</span>
          <span>E & O.E</span>
        </div>
      </div>
    </div>
  );
});

export default A4_14Jasper;
