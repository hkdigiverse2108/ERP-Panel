import { forwardRef } from "react";
import { useAppSelector } from "../../../../../../Store/hooks";
import type { PosPaymentBase } from "../../../../../../Types";
import { FormatDate } from "../../../../../../Utils";
import { Divider } from "@mui/material";

const PaymentListBill = forwardRef<HTMLDivElement, { data?: PosPaymentBase }>(({ data }, ref) => {
  const { company } = useAppSelector((state) => state.company);

  return (
    <div ref={ref} style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "30px", backgroundColor: "#fff", fontFamily: "Arial, sans-serif", color: "#000" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>{company?.name}</h2>
        <div>{company?.address?.city?.name}</div>
        <div>
          Email: {company?.email} | Contact No.: {company?.phoneNo?.countryCode + " " + company?.phoneNo?.phoneNo}
        </div>
      </div>

      <Divider className="my-5! text-xl!">Receipt</Divider>

      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <strong>To,</strong>
          <div>{data?.partyId?.firstName + " " + data?.partyId?.lastName || "-"}</div>
        </div>

        <div>
          <div>Voucher No : {data?.paymentNo || "-"}</div>
          <div>Voucher Date : {FormatDate(data?.createdAt)}</div>
          <div>Type : {data?.paymentType === "against_bill" ? "Against Bill" : "Advance"}</div>
          <div>Payment Mode : {data?.paymentMode || "-"}</div>
          <div>Amount : {data?.amount ?? 0}</div>
        </div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
        }}
      >
        <thead>
          <tr>
            {["Sr.", "Bill Date", "Bill No.", "Bill Amount", "KASAR Amount", "Payment Amount"].map((head) => (
              <th
                key={head}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>1</td>
            <td style={cellStyle}>{FormatDate(data?.createdAt)}</td>
            <td style={cellStyle}>{data?.posOrderId?.orderNo || "-"}</td>
            <td style={cellStyle}>{data?.posOrderId?.totalAmount ?? 0}</td>
            <td style={cellStyle}>0.00 // baki chhe Api ma</td>
            <td style={cellStyle}>{data?.amount ?? 0}</td>
          </tr>

          {/* Total Row */}
          <tr>
            <td colSpan={3} style={{ ...cellStyle, fontWeight: "bold" }}>
              Total :
            </td>
            <td style={{ ...cellStyle, fontWeight: "bold" }}>{data?.posOrderId?.totalAmount ?? 0}</td>
            <td style={cellStyle}></td>
            <td style={{ ...cellStyle, fontWeight: "bold" }}>{data?.amount ?? 0}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: "40px" }}>{/* <strong>Amount in words : {data?.amountInWords || "Zero Rupees"}</strong> */}</div>

      {/* Signature */}
      <div style={{ textAlign: "right", marginTop: "80px" }}>
        <div>For, {company?.name}</div>
        <br />
        <br />
        <div style={{ borderTop: "1px solid black", width: "200px", marginLeft: "auto" }} />
        <div>Authorised Signatory</div>
      </div>
    </div>
  );
});

const cellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center",
};

export default PaymentListBill;
