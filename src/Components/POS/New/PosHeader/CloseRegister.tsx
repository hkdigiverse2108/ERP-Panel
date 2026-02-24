import dayjs from "dayjs";
import React, { forwardRef } from "react";
import { STORAGE_KEYS } from "../../../../Constants";
import type { PosCashRegisterValues, PosOrderBase } from "../../../../Types";

const MetricRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>{label}</span>
    <div style={{ display: "flex", width: "125px" }}>
      <span style={{ width: "15px" }}>:</span>
      <span style={{ fontWeight: "bold" }}>{value}</span>
    </div>
  </div>
);

const CloseBillRegister = forwardRef<HTMLDivElement, { bill?: PosOrderBase; data?: PosCashRegisterValues }>(({ data }, ref) => {
  const getCompanyName = () => {
    try {
      const company = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANY) || "null");
      if (company && company.name) return company.name;
    } catch { }
    return "Dhruvi Bakery";
  };

  const currentDate = dayjs().format("DD/MM/YYYY, HH:mm");

  return (
    <div ref={ref} id="sales-register-print" style={{ width: "150mm", margin: "0 auto", fontFamily: "'Courier New', Courier, monospace", fontSize: "18px", padding: "10px", color: "black", backgroundColor: "white", lineHeight: "1.2" }}>
      <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
        <span>{currentDate}</span>
        <span>Sales Register</span>
      </div>

      <center>
        <h2 style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "22px" }}>{getCompanyName()}</h2>
      </center>

      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginBottom: "5px", fontWeight: "bold" }}>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>User</span>
          <span>: {data?.user || getCompanyName()}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>Start</span>
          <span>: {data?.startDate || "-"} {data?.startTime || "-"}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>End</span>
          <span>: {data?.endDate || "-"} {data?.endTime || "-"}</span>
        </div>
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "5px" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginBottom: "5px" }}>
        <MetricRow label="No of Bills" value={data?.noOfBills ?? 0} />
        <MetricRow label="No of Items" value={data?.noOfItems ?? 0} />
        <MetricRow label="Total Sales" value={data?.totalSales ?? 0} />
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

      <div style={{ borderTop: "1px dashed black", marginBottom: "5px" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginBottom: "5px" }}>
        <MetricRow label="Cash" value={data?.cashPayment ?? 0} />
        <MetricRow label="Card" value={data?.cardPayment ?? 0} />
        <MetricRow label="Wallet" value={data?.walletPayment ?? 0} />
        <MetricRow label="Upi" value={data?.upiPayment ?? 0} />
        <MetricRow label="Bank Refund (-)" value={data?.bankRefund ?? 0} />
        <MetricRow label="Payments Received" value={data?.paymentsReceived ?? 0} />
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "5px" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginBottom: "5px" }}>
        <MetricRow label="Total Sales" value={data?.totalSales ?? 0} />
      </div>

      <div style={{ breakInside: "avoid" }}>
        <div style={{ borderTop: "1px dashed black", marginBottom: "2px" }}></div>
        <div style={{ marginBottom: "2px", fontWeight: "bold" }}>Denomination</div>
        <div style={{ borderTop: "1px dashed black", marginBottom: "3px" }}></div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "5px", tableLayout: "fixed", fontSize: "18px" }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: "10px", fontWeight: "bold" }}>Rs.</th>
              <th style={{ paddingBottom: "10px", fontWeight: "bold", width: "15px" }}>*</th>
              <th style={{ paddingBottom: "10px", fontWeight: "bold", width: "110px" }}>NOS</th>
              <th style={{ paddingBottom: "10px", fontWeight: "bold" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <div style={{ borderTop: "1px dashed black", marginBottom: "10px" }}></div>
              </td>
            </tr>
            {data?.denominations && data.denominations.length > 0 ? (
              data?.denominations?.map((denom, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "8px 0" }}>Rs. {denom.currency}</td>
                  <td style={{ padding: "8px 0" }}>*</td>
                  <td style={{ padding: "8px 0" }}>{denom.count}</td>
                  <td style={{ padding: "8px 0" }}>{denom.amount}</td>
                </tr>
              ))
            ) : (
              <>
                {[1, 2, 5, 10, 20, 50, 100, 200, 500].map((val) => (
                  <tr key={val}>
                    <td style={{ padding: "8px 0" }}>Rs. {val}</td>
                    <td style={{ padding: "8px 0" }}>*</td>
                    <td style={{ padding: "8px 0" }}>0</td>
                    <td style={{ padding: "8px 0" }}>0</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px", breakBefore: "page", paddingTop: "20px" }}>
        <div style={{ borderTop: "1px dashed black", marginBottom: "5px" }}></div>
        <MetricRow label="Total Denom" value={data?.totalDenominationAmount ?? 0} />
        <div style={{ borderTop: "1px dashed black", marginBottom: "5px", marginTop: "5px" }}></div>

        <MetricRow label="Cash Sales" value={data?.cashPayment ?? 0} />
        <MetricRow label="Cash Refund (-)" value={data?.cashRefund ?? 0} />
        <MetricRow label="Expense Amount (-)" value={data?.expense ?? 0} />
        <MetricRow label="Cash in Hand" value={data?.cashFlow ?? 0} />
        <MetricRow label="Profit*" value={data?.profit ?? 0} />

        <div style={{ borderTop: "1px dashed black", marginBottom: "5px", marginTop: "5px" }}></div>
        <MetricRow label="System Calculated Cash in Drawer" value={data?.totalCashLeftInDrawer ?? 0} />
        <MetricRow label="Actual Cash in Drawer" value={data?.physicalDrawerCash ?? 0} />
        <div style={{ borderTop: "1px dashed black", marginBottom: "5px", marginTop: "5px" }}></div>
      </div>

      <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
        <div>Cash Hand Over By Authorised sign</div>
        <div>Notes:</div>
      </div>
    </div>
  );
});

export default CloseBillRegister;
