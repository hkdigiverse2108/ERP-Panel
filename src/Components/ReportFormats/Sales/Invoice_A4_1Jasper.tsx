import { forwardRef } from "react";

const Invoice_A4_1Jasper = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="w-[210mm] mx-auto bg-white text-black p-3 font-serif text-[11px] border">
      {/* Duplicate */}
      <div className="text-right font-bold">(Duplicate)</div>

      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <img src="/logo.png" className="w-20 h-14 mr-3" />

        <div className="flex-1 text-center">
          <div className="font-bold text-[16px]">Sniper/Rifles Shop</div>
          <div>417, Vastrapur, Ahmedabad - 605001</div>
          <div>Email : example@gmail.com | Contact : +91-9876543210</div>
          <div>GSTIN/UIN : 34AACCC1596Q002</div>
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-center border-b py-2">
        <div className="border px-8 py-1 font-bold">Tax Invoice</div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 border-b">
        {/* Billing */}
        <div className="border-r p-2">
          <div className="font-bold">Billing Address</div>
          <div>karan sardar</div>
          <div>41, vishwakarmangar, sabalnagar cross road</div>
          <div>Ahmedabad</div>
          <div>Gujarat(24), India</div>
        </div>

        {/* Shipping */}
        <div className="border-r p-2">
          <div className="font-bold">Shipping Address</div>
          <div>karan sardar</div>
          <div>41, vishwakarmangar, sabalnagar cross road</div>
          <div>Ahmedabad</div>
          <div>Gujarat(24), India</div>
        </div>

        {/* Invoice Info */}
        <div className="p-2">
          <div className="flex justify-between">
            <span>Invoice No.</span>
            <span>: INVQ388</span>
          </div>
          <div className="flex justify-between">
            <span>Invoice Date</span>
            <span>: 25/12/2024</span>
          </div>
          <div className="flex justify-between">
            <span>Sale Order No.</span>
            <span>: -</span>
          </div>
          <div className="flex justify-between">
            <span>Rev. Charge</span>
            <span>: NO</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Terms</span>
            <span>: 6 month</span>
          </div>
          <div className="flex justify-between">
            <span>Due Date</span>
            <span>: 25/01/2025</span>
          </div>
          <div className="flex justify-between">
            <span>Place of Supply</span>
            <span>: Ahmedabad</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <table className="w-full border text-[10px]">
        <thead>
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Free</th>
            <th className="border p-1">UOM</th>
            <th className="border p-1">Unit Price</th>
            <th className="border p-1">Discount</th>
            <th className="border p-1">Taxable</th>
            <th className="border p-1">Tax %</th>
            <th className="border p-1">Tax Amt</th>
            <th className="border p-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {["Black Dog Bottle", "Tai Shirt XL", "Voyager T-shirt XXL", "GAP T-Shirt"].map((item, i) => (
            <tr key={i}>
              <td className="border p-1 text-center">{i + 1}</td>
              <td className="border p-1">{item}</td>
              <td className="border p-1 text-center">1234</td>
              <td className="border p-1 text-center">1.00</td>
              <td className="border p-1 text-center">0</td>
              <td className="border p-1 text-center">Pcs</td>
              <td className="border p-1 text-right">1,000.00</td>
              <td className="border p-1 text-right">0.00</td>
              <td className="border p-1 text-right">1,000.00</td>
              <td className="border p-1 text-center">12%</td>
              <td className="border p-1 text-right">120.00</td>
              <td className="border p-1 text-right">1,120.00</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between border p-1 font-bold">
        <span>Total : 5.00</span>
        <span>5,760.00</span>
      </div>

      {/* Bank + Summary */}
      <div className="grid grid-cols-2 border mt-2">
        {/* Bank */}
        <div className="border-r p-2">
          <div className="font-bold">Bank Details</div>
          <div>Bank : HDFC</div>
          <div>Account No : 123456789</div>
          <div>Branch : Ahmedabad</div>
          <div>IFSC : HDFC0001</div>

          {/* QR */}
          {/* <div className="mt-2">
            <div className="w-20 h-20 bg-gray-300 flex items-center justify-center">QR</div>
          </div> */}
        </div>

        {/* Summary */}
        <div className="p-2 text-right">
          <div>Taxable Amount : 5,015.35</div>
          <div>Tax Amount : 746.44</div>
          <div>Round Off : 0.21</div>
          <div className="font-bold text-[13px]">Net Amount : 5,760.00</div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="border mt-2">
        <div className="text-center font-bold border-b p-1">TAX SUMMARY</div>

        <table className="w-full text-[10px] text-center">
          <thead>
            <tr>
              <th className="border p-1">Sr No</th>
              <th className="border p-1">HSN</th>
              <th className="border p-1">Taxable</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amt</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amt</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-1">1</td>
              <td className="border p-1">1234</td>
              <td className="border p-1">5,015.35</td>
              <td className="border p-1">6%</td>
              <td className="border p-1">300.00</td>
              <td className="border p-1">6%</td>
              <td className="border p-1">300.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-3 grid grid-cols-2">
        <div>
          <div className="font-bold">Terms & Conditions</div>
          <div>1. Test condition</div>
          <div>2. No return</div>
        </div>

        <div className="text-right">
          <div className="font-bold">For, Sniper/Rifles Shop</div>
          <div className="mt-8 border-t w-40 ml-auto"></div>
          <div>Authorised Signatory</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between mt-3 text-[10px] border-t pt-1">
        <span>This is computer generated invoice.</span>
        <span>Page 1 of 1</span>
        <span>E.O.E.</span>
      </div>
    </div>
  );
});
export default Invoice_A4_1Jasper;
