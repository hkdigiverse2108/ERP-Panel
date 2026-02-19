import dayjs from "dayjs";
import { forwardRef } from "react";
import type { PosOrderBase } from "../../../../../Types";

const LastBillReceipt = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  if (!bill) return null;

  return (
    <div ref={ref} id="last-bill-print" style={{ width: "80mm", fontFamily: "monospace", fontSize: "12px", padding: "10px" }}>
      <center>
        <h3 style={{ margin: 0 }}>{bill?.companyId?.name}</h3>
        <p style={{ margin: "4px 0" }}>Surat, Gujarat, India</p>
        {/* <h4 style={{ margin: "4px 0" }}>Tax Invoice</h4> */}
      </center>

      <hr style={{ borderTop: "1px dashed black" }} />

      <p>Name : {bill?.customerId?.firstName + " " + bill?.customerId?.lastName || "-"}</p>
      <p>Mob No : {bill?.customerId?.phoneNo?.phoneNo || "-"}</p>
      <p>Date : {dayjs(bill.createdAt).format("DD/MM/YYYY HH:mm")}</p>
      <p>Invoice No : {bill.orderNo}</p>

      <table style={{ width: "100%" }}>
        <thead style={{ borderBottom: "1px dashed black" }}>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "center" }}>Qty</th>
            <th style={{ textAlign: "right" }}>MRP</th>
            <th style={{ textAlign: "right" }}>Net</th>
          </tr>
        </thead>
        <tbody>
          {bill?.items?.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "left" }}>{item.productId?.name}</td>
              <td style={{ textAlign: "center" }}>{item?.qty}</td>
              <td style={{ textAlign: "right" }}>₹{item?.mrp}</td>
              <td style={{ textAlign: "right" }}>₹{item?.netAmount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot style={{ borderTop: "1px dashed black" }}>
          <tr>
            <th style={{ textAlign: "left" }}>Total</th>
            <th style={{ textAlign: "center" }}>{bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0)}</th>
            <th style={{ textAlign: "right" }}>₹{bill?.items?.reduce((acc, item) => acc + (item?.mrp || 0), 0)}</th>
            <th style={{ textAlign: "right" }}>₹{bill?.items?.reduce((acc, item) => acc + (item?.netAmount || 0), 0)}</th>
          </tr>
        </tfoot>
      </table>

      {/* {bill?.items?.map((item: any, index: number) => (
        <div key={index}>
          <p>
            {index + 1}. {item.name}
          </p>
          <p>
            Qty: {item.qty} | MRP: ₹{item.mrp} | Net: ₹{item.netAmount}
          </p>
          <hr style={{ borderTop: "1px dashed #ccc" }} />
        </div>
      ))} */}

      {/* <h4>Total : ₹{bill.totalAmount?.toFixed(2)}</h4> */}
      {/* <p>Payment Mode : {bill.paymentMethod?.toUpperCase()}</p> */}

      {/* <hr style={{ borderTop: "1px dashed black" }} /> */}

      <center>Thank You For Shopping</center>
    </div>
  );
});

export default LastBillReceipt;
