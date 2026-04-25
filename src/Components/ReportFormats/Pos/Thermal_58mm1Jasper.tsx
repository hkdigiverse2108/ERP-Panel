import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_58mm1Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  return (
    <div ref={ref} className="w-[58mm] mx-auto bg-white text-black font-mono text-[10px] p-2 leading-tight">
      {/* Header */}
      <div className="text-center font-bold">AI Setu ERP Solutions Private Limited</div>

      {/* Logo + Invoice */}
      <div className="flex items-center justify-between mt-1">
        <img
          src={(bill.companyId as any)?.logo || "/logo.png"}
          alt="logo"
          className="w-10 h-10 object-contain"
        />
        <div className="text-center flex-1">
          <div className="font-bold text-[12px]">INVOICE</div>
          <div className="text-[9px]">SHOP AT</div>
        </div>
      </div>

      {/* Address */}
      <div className="text-center text-[9px] mt-1">SHOP NO.1-14, UPPER GROUND FLOOR, NEAR KOTAK BANK CIRCLE, GHODDOD ROAD Adajan - 380015</div>

      {/* Contact */}
      <div className="text-center text-[9px] mt-1">Email : circleastar09@gmail.com</div>
      <div className="text-center text-[9px]">Phone No : 1234567895</div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Meta */}
      <div className="text-[9px]">
        <div className="flex justify-between">
          <span>Name : Cash Sales</span>
          <span>Date : 27/04/2023</span>
        </div>
        <div className="flex justify-between">
          <span>Mobile No :</span>
          <span>Time : 07:02 PM</span>
        </div>
        <div>Invoice No : POS2961</div>
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
      <div className="text-[9px] mt-1">
        <div className="grid grid-cols-4">
          <span>1</span>
          <span>
            test demo yellow /1
            <div className="text-[8px] italic">Description : The product is available...</div>
          </span>
          <span className="text-center">1.000</span>
          <span className="text-right">2163.60</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Charges */}
      <div className="text-[9px]">
        <div className="flex justify-between">
          <span>Test Additional Charge</span>
          <span>202.0</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Totals */}
      <div className="text-[9px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>2,365.60</span>
        </div>
        <div className="flex justify-between">
          <span>ADDITIONAL DISCOUNT</span>
          <span>20.05</span>
        </div>
        <div className="flex justify-between">
          <span>ROUND OFF</span>
          <span>0.40</span>
        </div>
        <div className="flex justify-between">
          <span>BY CASH</span>
          <span>1000.00</span>
        </div>
        <div className="flex justify-between">
          <span>BY CARD</span>
          <span>1366.00</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Summary */}
      <div className="text-center text-[9px]">
        <div>NO OF QTY : 1 | DISCOUNT ITEMS : 1</div>
        <div className="font-bold">You Saved Rs : 20.05</div>
      </div>

      {/* Notes */}
      <div className="text-[8px] mt-1">
        <div>Proper Hsn Document Please...</div>
        <div>Prices are inclusive of all taxes...</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-1" />

      {/* Tax Table */}
      <table className="w-full text-[8px] border border-black text-center">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black">TAXABLE</th>
            <th className="border-r border-black">CGST</th>
            <th className="border-r border-black">SGST</th>
            <th className="border-r border-black">Cess</th>
            <th>IGST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r border-black">2005.00</td>
            <td className="border-r border-black">89.32</td>
            <td className="border-r border-black">89.32</td>
            <td className="border-r border-black">N/A</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>

      {/* Customer */}
      <div className="mt-1 text-[9px]">
        <div className="font-bold">Customer Details</div>
        <div>Address : Adityana</div>
      </div>

      {/* Terms */}
      <div className="text-[8px] mt-1">
        <div className="font-bold">T & C</div>
        <div>Terms And Conditions</div>
        <div>Terms And Conditions two</div>
        <div>Terms And Conditions Three</div>
        <div className="font-bold">Note: This is test remark</div>
      </div>

      {/* Barcode */}
      {/* <div className="flex justify-center mt-2">
        <div className="h-8 w-[80%] bg-black" />
      </div> */}

      {/* Footer */}
      <div className="text-center text-[9px] mt-1">We hope you had a pleasant experience</div>

      {/* Bottom */}
      <div className="flex justify-between text-[8px] mt-2">
        <span>Printed On: 02/05/2023 08:13 pm</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default Thermal_58mm1Jasper;
