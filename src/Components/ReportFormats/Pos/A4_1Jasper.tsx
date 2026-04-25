import { forwardRef } from "react";

const A4_1Jasper = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[12px] border">
      {/* Header */}
      <div className="flex border-b pb-2">
        <img src="/logo.png" className="w-20 h-20 object-contain border mr-3" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[18px]">Vasy ERP Solutions Private Limited</div>
          <div className="text-[11px]">SHOP NO.1-14, UPPER GROUND FLOOR, NEAR KOTAK BANK CIRCLE, GHODDOD ROAD, Adajan-380015</div>
          <div className="text-[11px]">Email : circleastar009@gmail.com | Contact No. : 1234567895</div>
          <div className="text-[11px]">State : Gujarat(24)</div>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="flex justify-between items-center border-b py-1">
        <div></div>
        <div className="border px-6 py-1 font-bold">Tax Invoice</div>
        <div className="text-[11px]">Original / Duplicate / Transport</div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-3 border-b">
        <div className="border-r p-2">
          <div className="font-bold">Billing Address</div>
          <div>Walk in Customer</div>
          <div>Adityana</div>
          <div>Gujarat(24), India</div>
        </div>

        <div className="border-r p-2">
          <div className="font-bold">Shipping Address</div>
          <div>Walk in Customer</div>
          <div>Adityana</div>
          <div>Gujarat(Gujarat), India</div>
        </div>

        <div className="p-2 text-right">
          <div>No : POS2961</div>
          <div>Date : 27/04/2023</div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-[11px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Unit Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Discount2</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Taxable Value</th>
            <th className="border p-1">Tax(%)</th>
            <th className="border p-1">Tax Amount</th>
            <th className="border p-1">Net Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-1 text-center">1</td>
            <td className="border p-1">
              Test demo yellow / 1<div className="text-[10px]">Description : The product is available in the store with a stock of 21.5L & 7L</div>
              <div className="font-bold">Test Additional Charge</div>
            </td>
            <td className="border p-1 text-center">1.00</td>
            <td className="border p-1 text-center">PCBs</td>
            <td className="border p-1 text-right">2,010.00</td>
            <td className="border p-1 text-right">500 (4.95%)</td>
            <td className="border p-1 text-right">0.00</td>
            <td className="border p-1 text-right">2,163.60</td>
            <td className="border p-1 text-right">2,005.00</td>
            <td className="border p-1 text-center">9.0</td>
            <td className="border p-1 text-right">180.45</td>
            <td className="border p-1 text-right">2,163.60</td>
          </tr>
        </tbody>
      </table>

      {/* Total Row */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : 1.00</span>
        <span>2,365.60</span>
      </div>

      {/* Bank + Summary */}
      <div className="grid grid-cols-2 border mt-2">
        <div className="border-r p-2">
          <div className="font-bold text-center">Bank Details</div>
          <div>Name : Indusind Freddie CYB</div>
          <div>Branch Name :</div>
          <div>Account Number :</div>
          <div>Branch IFSC :</div>

          <div className="mt-2">Remarks : This is test remark</div>

          <div className="mt-2 font-bold">Customer Details</div>
          <div>Address : Adityana</div>
        </div>

        <div className="p-2 text-right">
          <div>Total : 2,163.60</div>
          <div>Tax Amount : 180.45</div>
          <div>Additional Discount : 20.05</div>
          <div>Additional Charge : 202.00</div>
          <div>BY CASH : 1,000.00</div>
          <div>BY CARD : 1,366.00</div>
          <div>Round Off : 0.40</div>
          <div className="font-bold">Net Amount : 2,366.00</div>
          <div>Due Amount : 0.00</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="border p-1">TAXABLE VALUE</th>
              <th className="border p-1">CGST</th>
              <th className="border p-1">SGST</th>
              <th className="border p-1">CESS</th>
              <th className="border p-1">IGST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">2,005.00</td>
              <td className="border p-1">89.32</td>
              <td className="border p-1">89.32</td>
              <td className="border p-1">0.00</td>
              <td className="border p-1">0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-2">
        <div>Rupees Two Thousand Three Hundred and Sixty Six Only</div>

        <div className="flex justify-between mt-2 items-center">
          <div>
            <div className="font-bold">Terms & Conditions</div>
            <div>1. Terms And Conditions</div>
            <div>2. Terms And Conditions two</div>
            <div>3. Terms And Conditions Three</div>
          </div>

          {/* <div className="text-center">
            <div className="h-10 w-40 bg-black mb-1"></div>
            <div>For, Vasy ERP Solutions Private Limited</div>
          </div> */}
        </div>

        <div className="text-right mt-6">
          <div className="border-t w-48 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>

        <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
          <span>This is computer generated pro.</span>
          <span>Page 1 of 1</span>
          <span>E.&O.E</span>
        </div>
      </div>
    </div>
  );
});

export default A4_1Jasper;
