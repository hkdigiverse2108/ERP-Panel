import { forwardRef } from "react";
import type { PosOrderBase } from "../../../Types";

const Thermal_80mm17Jasper = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  return (
    <div ref={ref} className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] p-3 leading-tight">
      {/* Duplicate */}
      <div className="text-right font-bold">(Duplicate)</div>

      {/* Header */}
      <div className="text-center">
        <div className="font-bold text-[16px]">AI Setu ERP</div>
        <div className="text-[10px]">Information Technology Park Ltd, Pioneer</div>
        <div className="text-[10px]">Building, Whitefield Road, Bengaluru, Mahe,</div>
        <div className="text-[10px]">Puducherry-673310</div>
        <div className="text-[10px]">Ph:+91-3433453454</div>
        <div className="text-[10px] font-bold">GST No:34AACCC1596Q002</div>

        <div className="mt-2 font-bold underline">Invoice</div>
      </div>

      {/* Meta */}
      <div className="mt-2 text-[11px]">
        <div className="flex justify-between">
          <span>Invoice No</span>
          <span>: V2-POS523</span>
        </div>
        <div className="flex justify-between">
          <span>Invoice Dt</span>
          <span>: 31-01-2025 10:45:04 AM</span>
        </div>
        <div className="flex justify-between">
          <span>Name</span>
          <span>: adityapatel</span>
        </div>
        <div className="flex justify-between">
          <span>Phone No</span>
          <span>: +91-8511865214</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Table Header */}
      <div className="grid grid-cols-5 font-bold text-[11px]">
        <span>Product</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Price</span>
        <span className="text-center">Disc</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Items */}
      <div className="mt-1 text-[11px]">
        <div className="grid grid-cols-5">
          <span>Luggage bag 2</span>
          <span className="text-center">1</span>
          <span className="text-center">0</span>
          <span className="text-center">0.00</span>
          <span className="text-right">0.00</span>
        </div>

        <div className="grid grid-cols-5">
          <span>KINDER JOY CHOCOLATE</span>
          <span className="text-center">1</span>
          <span className="text-center">500</span>
          <span className="text-center">0.00</span>
          <span className="text-right">500.00</span>
        </div>

        <div className="grid grid-cols-5">
          <span>testing123</span>
          <span className="text-center">1</span>
          <span className="text-center">1770</span>
          <span className="text-center">17.70</span>
          <span className="text-right">1752.30</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Totals */}
      <div className="text-[11px]">
        <div className="flex justify-between">
          <span>Round off :</span>
          <span>-0.30</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Bill Amount :</span>
          <span>2,370.00</span>
        </div>
        <div className="flex justify-between">
          <span>Additional Charge :</span>
          <span>118.00</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Payment Details */}
      <div className="text-[11px]">
        <div className="font-bold">Payment Details:</div>

        <div className="flex justify-between">
          <span>Credits Applied :</span>
          <span>1,500.00</span>
        </div>
        <div className="flex justify-between">
          <span>Cash :</span>
          <span>870.00</span>
        </div>
        <div className="flex justify-between">
          <span>Change :</span>
          <span>130.00</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2" />

      {/* Summary */}
      <div className="text-center text-[11px]">
        <div>No. of Products: 3</div>
        <div>You Saved: 17.70</div>

        <div className="mt-2">No Return</div>
        <div>No Exchange</div>
        <div>(Bill Amt Inclusive of Taxes)</div>

        <div className="mt-2 font-bold">Thank You, Visit Again!</div>
      </div>

      {/* Barcode */}
      {/* <div className="flex flex-col items-center mt-2">
        <div className="h-10 w-[70%] bg-black" />
        <div className="text-[10px] mt-1">V2-POS523</div>
      </div> */}
    </div>
  );
});

export default Thermal_80mm17Jasper;
