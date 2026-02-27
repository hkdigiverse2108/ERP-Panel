import dayjs from "dayjs";
import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../../Store/hooks";
import type { PosOrderBase } from "../../../../../Types";

const LastBillReceipt = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
  const { company } = useAppSelector((state) => state.company);
  if (!bill) return null;

  const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
  const totalDiscount = bill?.items?.reduce((acc, item) => acc + ((item?.discountAmount || 0) + (item?.additionalDiscountAmount || 0)), 0) || 0;
  const getTaxPercent = (item: PosOrderBase["items"][number]) => {
    return item?.productId?.salesTaxId?.percentage || 0;
  };

  const getCompanyAddress = () => {
    const addr = company?.address || bill?.companyId?.address;
    if (!addr) return null;

    const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

    let addressStr = parts.join(", ");
    if (addr.pinCode) {
      addressStr += ` - ${addr.pinCode}`;
    }

    return addressStr;
  };

  return (
    <div ref={ref} id="last-bill-print" style={{ width: "150mm", margin: "0 auto", fontFamily: "'Courier New', Courier, monospace", fontSize: "20px", padding: "20px", color: "black", backgroundColor: "white", lineHeight: "1.2" }}>
      {/* Header Section */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <center>
          <h2 style={{ margin: "20px 0 5px 0", fontWeight: "bold", textTransform: "capitalize", fontSize: "25px" }}>{bill?.companyId?.name || "Dhruvi Bakery"}</h2>
          <div style={{ margin: "5px 0 20px 0", fontSize: "15px", lineHeight: "1.4" }}>
            {getCompanyAddress() && <div>{getCompanyAddress()}</div>}
            {/* Phone */}
            {(() => {
              let phone: string | undefined = undefined;
              if (company?.phoneNo?.phoneNo) {
                phone = company.phoneNo.phoneNo;
              }
              if (!phone) {
                phone = bill?.companyId?.phoneNo?.phoneNo;
              }
              return phone ? <div>Ph: +91 {phone}</div> : null;
            })()}
          </div>

          <h3 style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "16px" }}>Tax Invoice</h3>
        </center>
      </div>

      {/* Metadata Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", marginBottom: "2px" }}>
            <span style={{ width: "80px", fontWeight: "bold" }}>Name</span>
            <span>: {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Walk-in"}</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ width: "80px", fontWeight: "bold" }}>Mob No.</span>
            <span>: {bill?.customerId?.phoneNo?.phoneNo || "-"}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2px" }}>
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>Date :</span>
            <span>{dayjs(bill.createdAt).format("DD/MM/YYYY")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>Invoice No. :</span>
            <span>{bill.orderNo}</span>
          </div>
        </div>
      </div>

      {/* Product Table */}

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "16px" }}>
        <thead>
          <tr style={{ borderTop: "1px dashed black", borderBottom: "1px dashed black" }}>
            <th style={{ textAlign: "left", padding: "4px 0", width: "5%" }}>#</th>
            <th style={{ textAlign: "left", padding: "4px 0", width: "55%" }}>Item</th>
            <th style={{ textAlign: "center", padding: "4px 0", width: "10%" }}>Qty</th>
            <th style={{ textAlign: "center", padding: "4px 0", width: "15%" }}>MRP</th>
            <th style={{ textAlign: "right", padding: "6px 0", width: "15%" }}>Net Amt.</th>
          </tr>
        </thead>

        <tbody>
          {bill?.items?.map((item, index) => {
            const taxPercent = getTaxPercent(item);
            const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
            const taxAmount = ((item.netAmount || 0) * taxPercent) / 100;

            return (
              <React.Fragment key={index}>
                <tr style={{ verticalAlign: "top" }}>
                  <td style={{ padding: "4px 0" }}>{index + 1}</td>

                  <td style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: "bold" }}>{item.productId?.name}</div>

                    {/* Variant / Weight line like screenshot */}
                    {item.productId?.variant && <div style={{ fontSize: "12px" }}>{item.productId.variant}</div>}
                  </td>

                  <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.qty || 0)}</td>

                  <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.mrp || 0)}</td>

                  <td style={{ textAlign: "center", padding: "4px 0" }}>{Number(item.netAmount || 0)}</td>
                </tr>
                <tr>
                  <td colSpan={5} style={{ padding: "0 0 4px 25px" }}>
                    <div style={{ fontSize: "11px", fontStyle: "italic", fontWeight: "bold" }}>
                      GST {taxPercent}% {taxAmount > 0 ? Number(taxAmount.toFixed(2)) : ""} {discAmt > 0 ? `Discount : ${Number(discAmt.toFixed(2))}` : ""}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Totals Section */}
      <div style={{ borderTop: "1px dashed black", paddingTop: "5px", marginBottom: "10px" }}>
        {bill.additionalCharges && bill.additionalCharges.length > 0 &&
          bill.additionalCharges.map((charge, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ width: "150px", textAlign: "right", marginRight: "10px", textTransform: "uppercase" }}>{charge.chargeId?.name || "Additional Charge"}</span>
              <span>:</span>
              <span style={{ width: "80px", textAlign: "right" }}>{Number(charge.totalAmount?.toFixed(2) || 0)}</span>
            </div>
          ))
        }
        {(bill.flatDiscountAmount || 0) > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ width: "150px", textAlign: "right", marginRight: "10px" }}>FLAT DISCOUNT</span>
            <span>:</span>
            <span style={{ width: "80px", textAlign: "right" }}>{Number(bill.flatDiscountAmount?.toFixed(2) || 0)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: "bold", marginBottom: "2px", marginTop: "5px" }}>
          <span style={{ width: "150px", textAlign: "right", marginRight: "10px" }}>TOTAL</span>
          <span>:</span>
          <span style={{ width: "80px", textAlign: "right" }}>{Number(bill.totalAmount?.toFixed(2) || 0)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ width: "150px", textAlign: "right", marginRight: "10px" }}>ROUND OFF</span>
          <span>:</span>
          <span style={{ width: "80px", textAlign: "right" }}>{Number(bill.roundOff?.toFixed(2) || 0)}</span>
        </div>
      </div>

      {/* Summary Footer */}
      <div style={{ borderTop: "1px dashed black", borderBottom: "1px dashed black", padding: "10px 0", marginBottom: "10px" }}>
        <center style={{ fontWeight: "bold" }}>
          <div style={{ marginBottom: "5px" }}>PIECES PURCHASED : {Number(totalQty.toFixed(2))}</div>
          <div>DISCOUNT ITEMS : {Number(totalDiscount.toFixed(2))}</div>
        </center>
      </div>

      {/* T&C / Customer Details */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ fontSize: "10px", marginBottom: "5px" }}>T & C</div>

        <div style={{ borderTop: "1px dashed black", marginTop: "5px", paddingTop: "5px" }}></div>
      </div>

      {/* Footer / Barcode */}
      <center>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Thank You For Shopping At {bill?.companyId?.name || "Dhruvi Bakery"}</div>
      </center>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "bold" }}>
        <span>Printed On: {dayjs().format("DD/MM/YYYY HH:mm:ss A")}</span>

      </div>
    </div>
  );
});

export default LastBillReceipt;
