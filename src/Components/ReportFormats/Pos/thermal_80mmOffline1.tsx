import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const thermal_80mmOffline1 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  const item = bill.items?.[0]; // DMart style = single item focus

  const discount = (item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0);

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[12px] p-3 leading-tight">
      {/* Header */}
      <div className="text-center">
        <div className="font-bold text-[14px]">DMART company</div>
        <div>A-5, Vasyerp solutions, The</div>
        <div>FirstAhmedabad, Gujarat, India</div>
        <div className="font-bold">Telephone No.: 7874972830</div>

        <div className="mt-2 font-bold">GSTIN: 27AACCA8432H2ZP</div>

        <div className="mt-2 font-bold">Tax Invoice</div>
        <div>Date: 11/03/2025 12:46 PM</div>
      </div>

      {/* Customer Info */}
      <div className="mt-2">
        <div>Name: dinein</div>
        <div>Mob No. :</div>
        <div>Bill No. : {bill.orderNo}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Table Header */}
      <div className="flex justify-between font-bold">
        <span># Item</span>
        <span>Qty.</span>
        <span>MRP</span>
        <span>Dis</span>
        <span>Net Amt</span>
      </div>

      {/* Item Row */}
      <div className="mt-1">
        <div>{item?.productId?.name}</div>
        <div className="text-[10px]">GST(5%) Rs 9.5238</div>

        <div className="flex justify-between mt-1">
          <span>1</span>
          <span>{Number(item?.qty || 0).toFixed(0)}</span>
          <span>{Number(item?.mrp || 0).toFixed(4)}</span>
          <span>{discount.toFixed(4)}</span>
          <span>{Number(item?.netAmount || 0).toFixed(4)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-2" />

      {/* Totals */}
      <div className="flex justify-between">
        <span>Total</span>
        <span>{Number(bill.totalAmount || 0).toFixed(4)}</span>
      </div>

      <div className="flex justify-between">
        <span>Additional Discount</span>
        <span>0.0000</span>
      </div>

      <div className="flex justify-between">
        <span>Roundoff</span>
        <span>0.0000</span>
      </div>

      <div className="flex justify-between font-bold">
        <span>By CASH</span>
        <span>{Number(bill.totalAmount || 0).toFixed(4)}</span>
      </div>

      {/* Summary */}
      <div className="text-center mt-3 font-bold">
        <div>Pieces Purchased : 1</div>
        <div>Discount Items : 0</div>
        <div>Total Discount : {discount.toFixed(4)}</div>
        <div>Tendered : {Number(bill.totalAmount || 0).toFixed(4)}</div>
        <div>Change : 0.0000</div>
      </div>

      {/* Terms */}
      <div className="mt-3 text-[10px]">
        <div className="font-bold">T & C</div>
        <ul className="list-disc pl-4">
          <li>Any additional charges (processing fees, late payment fees, or service charges) will be mentioned separately on the invoice.</li>
          <li>All applicable taxes (GST, VAT, etc.) will be included in the invoice as per government regulations.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center mt-3">Thank you for shopping at DMART company</div>

      {/* Barcode */}
      {/* <div className="text-center mt-2">
        <div className="h-10 bg-black w-[70%] mx-auto" />
        <div className="mt-1 text-[14px]">{bill.orderNo}</div>
      </div> */}

      {/* Bottom */}
      <div className="flex justify-between text-[10px] mt-2">
        <span>Printed On: 11/03/2025 12:46 PM</span>
        <span>E & O.E.</span>
      </div>
    </div>
  );
});

export default thermal_80mmOffline1;
