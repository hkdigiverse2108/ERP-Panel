import { forwardRef, type ReactNode } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosCashRegisterValues } from "../../../../Types";

const MetricRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <div className="flex w-[125px]">
      <span className="w-[15px]">:</span>
      <span className="font-bold">{value}</span>
    </div>
  </div>
);

const CloseBillRegister = forwardRef<HTMLDivElement, { data?: PosCashRegisterValues }>(({ data }, ref) => {
  const { company } = useAppSelector((state) => state.company);

  return (
    <div ref={ref} id="sales-register-print" className="mx-auto w-[150mm] bg-white p-[10px] font-mono text-[18px] leading-[1.2] text-black">
      <div className="mb-[5px] flex justify-between text-[14px]">
        <span>{data?.endDate}</span>
        <span>Sales Register</span>
      </div>

      <center>
        <h2 className="mb-[5px] text-[22px] font-bold">{company?.name}</h2>
      </center>

      <div className="flex flex-col font-semibold gap-[5px]">
        <div className="flex">
          <span className="w-[100px]">User</span>
          <span className="font-normal">: {company?.name || "-"}</span>
        </div>

        <div className="flex">
          <span className="w-[100px]">Start Date</span>
          <span className="font-normal">
            : {data?.startDate || "-"} {data?.startTime || "-"}
          </span>
        </div>

        <div className="flex">
          <span className="w-[100px]">End Date</span>
          <span className="font-normal">
            : {data?.endDate || "-"} {data?.endTime || "-"}
          </span>
        </div>
      </div>

      <div className="my-3 border-t border-dashed border-black"></div>

      <div className="flex flex-col gap-[5px]">
        <MetricRow label="No of Bills" value={data?.numberOfBills ?? 0} />
        <MetricRow label="No of Items" value={data?.numberOfItems ?? 0} />
        <MetricRow label="Total Amount" value={data?.totalSales ?? 0} />
        <MetricRow label="Disc" value={data?.discount ?? 0} />
        <MetricRow label="Tax Amount" value={data?.taxAmount ?? 0} />
        <MetricRow label="Sales Return" value={data?.salesReturn ?? 0} />
        <MetricRow label="Refund" value={data?.refund ?? 0} />
        <MetricRow label="Bank Transfer" value={data?.bankTransferAmount ?? 0} />
        <MetricRow label="Pay Later" value={data?.payLater ?? 0} />
        <MetricRow label="Credit/Advance Redeemed" value={data?.creditAdvanceRedeemed ?? 0} />
        <MetricRow label="Total Purchase Payment" value={data?.purchasePayment ?? 0} />
        <MetricRow label="Total Expense" value={data?.expense ?? 0} />
      </div>

      <div className="my-2 border-t border-dashed border-black"></div>

      <div className="flex flex-col gap-[5px]">
        <MetricRow label="Cash" value={data?.cashPayment ?? 0} />
        <MetricRow label="Card" value={data?.cardPayment ?? 0} />
        <MetricRow label="Wallet" value={data?.walletPayment ?? 0} />
        <MetricRow label="Upi" value={data?.upiPayment ?? 0} />
        <MetricRow label="Bank Refund (-)" value={data?.bankRefund ?? 0} />
        <MetricRow label="Payments Received" value={data?.paymentsReceived ?? 0} />
      </div>

      <div className="my-3 border-t border-dashed border-black"></div>

      <div className="my-3 flex flex-col gap-1">
        <MetricRow label="Total Sales" value={data?.totalSales ?? 0} />
      </div>

      <div className="break-inside-avoid">
        <div className="mb-[2px] border-t border-dashed border-black"></div>
        <div className="mb-[2px] font-bold">Denomination</div>
        <div className="mb-[3px] border-t border-dashed border-black"></div>

        <table className="mb-[5px] w-full table-fixed border-collapse text-left text-[18px]">
          <thead>
            <tr>
              <th className="pb-[10px] font-bold">Rs.</th>
              <th className="w-[15px] pb-[10px] font-bold">*</th>
              <th className="w-[110px] pb-[10px] font-bold">NOS</th>
              <th className="pb-[10px] font-bold">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="mb-[10px] border-t border-dashed border-black"></div>
              </td>
            </tr>

            {data?.denominations && data.denominations.length > 0 ? (
              data.denominations.map((denom, idx) => (
                <tr key={idx}>
                  <td className="py-[8px]">Rs. {denom.currency}</td>
                  <td className="py-[8px]">*</td>
                  <td className="py-[8px]">{denom.count}</td>
                  <td className="py-[8px]">{denom.amount}</td>
                </tr>
              ))
            ) : (
              <>
                {[1, 2, 5, 10, 20, 50, 100, 200, 500].map((val) => (
                  <tr key={val}>
                    <td className="py-[8px]">Rs. {val}</td>
                    <td className="py-[8px]">*</td>
                    <td className="py-[8px]">0</td>
                    <td className="py-[8px]">0</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-[10px] flex flex-col gap-[5px] break-before-page pt-[20px]">
        <div className="mb-[5px] border-t border-dashed border-black"></div>

        <MetricRow label="Total Denom" value={data?.totalDenominationAmount ?? 0} />

        <div className="my-[5px] border-t border-dashed border-black"></div>

        <MetricRow label="Cash Sales" value={data?.cashPayment ?? 0} />
        <MetricRow label="Cash Refund (-)" value={data?.cashRefund ?? 0} />
        <MetricRow label="Expense Amount (-)" value={data?.expense ?? 0} />
        <MetricRow label="Cash in Hand" value={data?.cashFlow ?? 0} />
        <MetricRow label="Profit*" value={data?.profit ?? 0} />

        <div className="my-[5px] border-t border-dashed border-black"></div>

        <MetricRow label="System Calculated Cash in Drawer" value={data?.totalCashInDrawer ?? 0} />
        <MetricRow label="Actual Cash in Drawer" value={data?.physicalDrawerCash ?? 0} />

        <div className="my-[5px] border-t border-dashed border-black"></div>
      </div>

      <div className="mt-[10px] leading-[1.8]">
        <div>Cash Hand Over By Authorised sign</div>
        <div>Notes:</div>
      </div>
    </div>
  );
});

export default CloseBillRegister;
