import dayjs from "dayjs";
import React, { forwardRef } from "react";
import { Storage } from "../../../../../Utils";
import { STORAGE_KEYS } from "../../../../../Constants";

interface SalesRegisterData {
  user?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  noOfBills?: number;
  noOfItems?: number;
  totalSales?: number;
  discount?: number;
  taxAmount?: number;
  salesReturn?: number;
  refund?: number;
  bankTransfer?: number;
  payLater?: number;
  creditAdvanceRedeemed?: number;
  totalPurchasePayment?: number;
  totalExpense?: number;
  paymentTypes?: {
    cash?: number;
    card?: number;
    wallet?: number;
    upi?: number;
    bankRefund?: number;
    paymentsReceived?: number;
  };
  denominations?: {
    rs?: number;
    nos?: number;
    amount?: number;
  }[];
  // Summary section fields
  totalDenom?: number;
  cashSales?: number;
  cashRefund?: number;
  expenseAmount?: number;
  cashInHand?: number;
  profit?: number;
  systemCalculatedCashInDrawer?: number;
  actualCashInDrawer?: number;
}

const MetricRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>{label}</span>
    <div style={{ display: "flex", width: "125px" }}>
      <span style={{ width: "15px" }}>:</span>
      <span style={{ fontWeight: "bold" }}>{value}</span>
    </div>
  </div>
);

const LastBillReceipt = forwardRef<HTMLDivElement, { bill?: any; data?: SalesRegisterData }>(({ data }, ref) => {
  const getCompanyName = () => {
    try {
      const company = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");
      if (company && company.name) return company.name;
    } catch (e) {}
    return "Dhruvi Bakery";
  };

  const currentDate = dayjs().format("DD/MM/YYYY, HH:mm");

  return (
    <div
      ref={ref}
      id="sales-register-print"
      style={{
        width: "120mm",
        margin: "0 auto",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "15px",
        padding: "20px",
        color: "black",
        backgroundColor: "white",
        lineHeight: "1.4",
      }}
    >
      {/* Header Dates and Title */}
      <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "15px", fontSize: "12px" }}>
        <span>{currentDate}</span>
        <span>Sales Register</span>
      </div>

      <center>
        <h2 style={{ margin: "0 0 20px 0", fontWeight: "bold", fontSize: "22px" }}>{getCompanyName()}</h2>
      </center>

      {/* Info Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "15px", fontWeight: "bold" }}>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>User</span>
          <span>: {data?.user || getCompanyName()}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>Start Date</span>
          <span>: {data?.startDate || "31/01/2026"}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>Start Time</span>
          <span>: {data?.startTime || "03:23 PM"}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>End Date</span>
          <span>: {data?.endDate || "18/02/2026"}</span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px" }}>End Time</span>
          <span>: {data?.endTime || "09:59 AM"}</span>
        </div>
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "15px" }}></div>

      {/* Metrics Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "15px" }}>
        <MetricRow label="No of Bills" value={data?.noOfBills ?? "33.0"} />
        <MetricRow label="No of Items" value={data?.noOfItems ?? "71.9900"} />
        <MetricRow label="Total Sales" value={data?.totalSales ?? "12822"} />
        <MetricRow label="Disc" value={data?.discount ?? "228.77"} />
        <MetricRow label="Tax Amount" value={data?.taxAmount ?? "1498.0"} />
        <MetricRow label="Sales Return" value={data?.salesReturn ?? "0.0"} />
        <MetricRow label="Refund" value={data?.refund ?? "0.0"} />
        <MetricRow label="Bank Transfer" value={data?.bankTransfer ?? "5000.0"} />
        <MetricRow label="Pay Later" value={data?.payLater ?? "3049.0"} />
        <MetricRow label="Credit/Advance Redeemed" value={data?.creditAdvanceRedeemed ?? "0.0"} />
        <MetricRow label="Total Purchase Payment" value={data?.totalPurchasePayment ?? "28.0"} />
        <MetricRow label="Total Expense" value={data?.totalExpense ?? "500.0"} />
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "15px" }}></div>

      {/* Payment Types Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "15px" }}>
        <MetricRow label="Cash" value={data?.paymentTypes?.cash ?? "4974.0"} />
        <MetricRow label="Card" value={data?.paymentTypes?.card ?? "649.0"} />
        <MetricRow label="Wallet" value={data?.paymentTypes?.wallet ?? "0.0"} />
        <MetricRow label="Upi" value={data?.paymentTypes?.upi ?? "4150.0"} />
        <MetricRow label="Bank Refund (-)" value={data?.paymentTypes?.bankRefund ?? "0.0"} />
        <MetricRow label="Payments Received" value={data?.paymentTypes?.paymentsReceived ?? "9773"} />
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "15px" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "15px" }}>
        <MetricRow label="Total Sales" value={data?.totalSales ?? "12822"} />
      </div>

      <div style={{ borderTop: "1px dashed black", marginBottom: "4px" }}></div>
      <div style={{ marginBottom: "4px" }}>Denomination</div>
      <div style={{ borderTop: "1px dashed black", marginBottom: "10px" }}></div>

      {/* Denominations Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "30px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ paddingBottom: "5px", fontWeight: "bold" }}>Rs.</th>
            <th style={{ paddingBottom: "5px", fontWeight: "bold", width: "15px" }}>*</th>
            <th style={{ paddingBottom: "5px", fontWeight: "bold", width: "110px" }}>NOS</th>
            <th style={{ paddingBottom: "5px", fontWeight: "bold" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <div style={{ borderTop: "1px dashed black", marginBottom: "5px" }}></div>
            </td>
          </tr>
          {/* Default list based on image */}
          {data?.denominations && data.denominations.length > 0 ? (
            data.denominations.map((denom, idx) => (
              <tr key={idx}>
                <td style={{ padding: "2px 0" }}>Rs. {denom.rs}</td>
                <td style={{ padding: "2px 0" }}>*</td>
                <td style={{ padding: "2px 0" }}>{denom.nos}</td>
                <td style={{ padding: "2px 0" }}>{denom.amount}</td>
              </tr>
            ))
          ) : (
            <>
              {[1, 2, 5, 10, 20, 50, 100, 200, 500].map((val) => (
                <tr key={val}>
                  <td style={{ padding: "2px 0" }}>Rs. {val}</td>
                  <td style={{ padding: "2px 0" }}>*</td>
                  <td style={{ padding: "2px 0" }}>0</td>
                  <td style={{ padding: "2px 0" }}>0</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {/* Final Summary Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
        <div style={{ borderTop: "1px dashed black", marginBottom: "2px" }}></div>
        <MetricRow label="Total Denom" value={data?.totalDenom ?? "0.0"} />
        <div style={{ borderTop: "1px dashed black", marginBottom: "2px", marginTop: "2px" }}></div>

        <MetricRow label="Cash Sales" value={data?.cashSales ?? "4974.0"} />
        <MetricRow label="Cash Refund (-)" value={data?.cashRefund ?? "0.0"} />
        <MetricRow label="Expense Amount (-)" value={data?.expenseAmount ?? "500.0"} />
        <MetricRow label="Cash in Hand" value={data?.cashInHand ?? "13010.0"} />
        <MetricRow label="Profit*" value={data?.profit ?? "2928.8"} />

        <div style={{ borderTop: "1px dashed black", marginBottom: "2px", marginTop: "2px" }}></div>
        <MetricRow label="System Calculated Cash in Drawer" value={data?.systemCalculatedCashInDrawer ?? "12456.0"} />
        <MetricRow label="Actual Cash in Drawer" value={data?.actualCashInDrawer ?? "12456"} />
        <div style={{ borderTop: "1px dashed black", marginBottom: "2px", marginTop: "2px" }}></div>
        <MetricRow label="" value="" />
      </div>

      <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
        <div>Cash Hand Over By Authorised sign</div>
        <div>Notes:</div>
      </div>
    </div>
  );
});

export default LastBillReceipt;

// import dayjs from "dayjs";
// import React, { forwardRef } from "react";
// import type { PosOrderBase } from "../../../../../Types";
// import { Storage } from "../../../../../Utils";
// import { STORAGE_KEYS } from "../../../../../Constants";

// const LastBillReceipt = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
//   if (!bill) return null;

//   const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
//   const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;
//   const getTaxPercent = (item: any) => {
//     return item?.productId?.salesTaxId?.percentage || 0;
//   };

//   const getCompanyAddress = () => {
//     let company: any = null;
//     try {
//       company = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");
//     } catch (e) {
//       // ignore
//     }

//     const addr = company?.address || bill?.companyId?.address;
//     if (!addr) return null;

//     const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

//     let addressStr = parts.join(", ");
//     if (addr.pinCode) {
//       addressStr += ` - ${addr.pinCode}`;
//     }

//     return addressStr;
//   };

//   return (
//     <div
//       ref={ref}
//       id="last-bill-print"
//       style={{
//         width: "150mm",
//         margin: "0 auto", // Centers the receipt in print preview
//         fontFamily: "'Courier New', Courier, monospace",
//         fontSize: "20px",
//         padding: "20px",
//         color: "black",
//         backgroundColor: "white",
//         lineHeight: "1.2",
//       }}
//     >
//       {/* Header Section */}
//       <div style={{ position: "relative", marginBottom: "20px" }}>
//         {/* <div style={{ position: "absolute", top: -5, right: 0, fontStyle: "italic", fontWeight: "bold", fontSize: "14px" }}>
//           (Duplicate)
//         </div> */}

//         <center>
//           <h2 style={{ margin: "20px 0 5px 0", fontWeight: "bold", textTransform: "capitalize", fontSize: "25px" }}>
//             {(() => {
//               try {
//                 const company = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");
//                 if (company && company.name) return company.name;
//               } catch (e) { }
//               return bill?.companyId?.name || "Dhruvi Bakery";
//             })()}
//           </h2>
//           <div style={{ margin: "5px 0 20px 0", fontSize: "15px", lineHeight: "1.4" }}>
//             {getCompanyAddress() && <div>{getCompanyAddress()}</div>}
//             {/* Phone */}
//             {(() => {
//               let phone: any = null;
//               try {
//                 const company = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");
//                 if (company?.phoneNo?.phoneNo) {
//                   phone = company.phoneNo.phoneNo;
//                 }
//               } catch (e) { }
//               if (!phone) {
//                 phone = bill?.companyId?.phoneNo?.phoneNo;
//               }
//               return phone ? <div>Ph: +91 {phone}</div> : null;
//             })()}
//           </div>

//           <h3 style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "16px" }}>
//             {/* Logic to determine if it's a Credit Note, defaulting to Tax Invoice but matching style */}
//             Tax Invoice
//           </h3>
//         </center>
//       </div>

//       {/* Metadata Section */}
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", marginBottom: "2px" }}>
//             <span style={{ width: "80px", fontWeight: "bold" }}>Name</span>
//             <span>: {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Walk-in"}</span>
//           </div>
//           <div style={{ display: "flex" }}>
//             <span style={{ width: "80px", fontWeight: "bold" }}>Mob No.</span>
//             <span>: {bill?.customerId?.phoneNo?.phoneNo || "-"}</span>
//           </div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2px" }}>
//             <span style={{ fontWeight: "bold", marginRight: "5px" }}>Date :</span>
//             <span>{dayjs(bill.createdAt).format("DD/MM/YYYY")}</span>
//           </div>
//           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//             <span style={{ fontWeight: "bold", marginRight: "5px" }}>Invoice No. :</span>
//             <span>{bill.orderNo}</span>
//           </div>
//         </div>
//       </div>

//       {/* Product Table */}

//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           marginBottom: "10px",
//           fontSize: "16px",
//         }}
//       >
//         <thead>
//           <tr
//             style={{
//               borderTop: "1px dashed black",
//               borderBottom: "1px dashed black",
//             }}
//           >
//             <th style={{ textAlign: "left", padding: "4px 0", width: "5%" }}>#</th>
//             <th style={{ textAlign: "left", padding: "4px 0", width: "55%" }}>Item</th>
//             <th style={{ textAlign: "center", padding: "4px 0", width: "10%" }}>Qty</th>
//             <th style={{ textAlign: "center", padding: "4px 0", width: "15%" }}>MRP</th>
//             <th style={{ textAlign: "right", padding: "6px 0", width: "15%" }}>Net Amt.</th>
//           </tr>
//         </thead>

//         <tbody>
//           {bill?.items?.map((item, index) => {
//             const taxPercent = getTaxPercent(item);
//             const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
//             const taxAmount = ((item.netAmount || 0) * taxPercent) / 100;

//             return (
//               <React.Fragment key={index}>
//                 <tr style={{ verticalAlign: "top" }}>
//                   <td style={{ padding: "4px 0" }}>{index + 1}</td>

//                   <td style={{ padding: "4px 0" }}>
//                     <div style={{ fontWeight: "bold" }}>{item.productId?.name}</div>

//                     {/* Variant / Weight line like screenshot */}
//                     {(item.productId as any)?.variant && <div style={{ fontSize: "12px" }}>{(item.productId as any).variant}</div>}
//                   </td>

//                   <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.qty || 0)}</td>

//                   <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.mrp || 0)}</td>

//                   <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.netAmount || 0)}</td>
//                 </tr>
//                 <tr>
//                   <td colSpan={5} style={{ padding: "0 0 4px 25px" }}>
//                     <div style={{ fontSize: "11px", fontStyle: "italic", fontWeight: "bold" }}>
//                       GST {taxPercent}% {taxAmount > 0 ? Number(taxAmount.toFixed(2)) : ""} {discAmt > 0 ? `Discount : ${Number(discAmt.toFixed(2))}` : ""}
//                     </div>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Totals Section */}
//       <div style={{ borderTop: "1px dashed black", paddingTop: "5px", marginBottom: "10px" }}>
//         <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: "bold", marginBottom: "2px" }}>
//           <span style={{ width: "100px", textAlign: "right", marginRight: "10px" }}>TOTAL</span>
//           <span>:</span>
//           <span style={{ width: "80px", textAlign: "right" }}>{Number(bill.totalAmount?.toFixed(2) || 0)}</span>
//         </div>
//         <div style={{ display: "", justifyContent: "flex-end" }}>
//           <span style={{ width: "100px", textAlign: "right", marginRight: "10px" }}>ROUND OFF</span>
//           <span>:</span>
//           <span style={{ width: "80px", textAlign: "right" }}>{Number(bill.roundOff?.toFixed(2) || 0)}</span>
//         </div>
//       </div>

//       {/* Summary Footer */}
//       <div style={{ borderTop: "1px dashed black", borderBottom: "1px dashed black", padding: "10px 0", marginBottom: "10px" }}>
//         <center style={{ fontWeight: "bold" }}>
//           <div style={{ marginBottom: "5px" }}>PIECES PURCHASED : {Number(totalQty.toFixed(2))}</div>
//           <div>DISCOUNT ITEMS : {Number(totalDiscount.toFixed(2))}</div>
//         </center>
//       </div>

//       {/* T&C / Customer Details */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ fontSize: "10px", marginBottom: "5px" }}>T & C</div>

//         <div style={{ borderTop: "1px dashed black", marginTop: "5px", paddingTop: "5px" }}>

//         </div>
//       </div>

//       {/* Footer / Barcode */}
//       <center>
//         <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Thank You For Shopping At {bill?.companyId?.name || "Dhruvi Bakery"}</div>
//       </center>

//       <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "bold" }}>
//         <span>Printed On: {dayjs().format("DD/MM/YYYY HH:mm:ss A")}</span>
//         <span>E & O E</span>
//       </div>
//     </div>
//   );
// });

// export default LastBillReceipt;
