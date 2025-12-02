import { Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { CommonSelect } from "../../Attribute/FormFields";
import { CommonCard } from "../Common";

const TotalSummary = () => {
  const stats = [
    { label: "Total Sales", value: "₹0", color: "#C8F7F1" },
    { label: "Total Invoice", value: "0", color: "#C8F7F1" },
    { label: "Sold Qty", value: "0", color: "#C8F7F1" },
    { label: "Total Customers", value: "4", color: "#C8F7F1" },
    { label: "To Receive", value: "₹0", color: "#C8F7F1" },
    { label: "Total Sales Return", value: "₹0", color: "#C8F7F1" },

    { label: "Total Purchase", value: "₹0", color: "#DCEBFF" },
    { label: "Total Bills", value: "0", color: "#DCEBFF" },
    { label: "Purchase Qty", value: "0", color: "#DCEBFF" },
    { label: "Total Suppliers", value: "0", color: "#DCEBFF" },
    { label: "To Pay", value: "₹0", color: "#DCEBFF" },
    { label: "Total Purchase Return", value: "₹0", color: "#DCEBFF" },

    { label: "Total Paid", value: "₹0", color: "#E5D9FF" },
    { label: "Total Expense", value: "₹0", color: "#E5D9FF" },
    { label: "Total Products", value: "43", color: "#E9DFFF" },
    { label: "Stock Qty", value: "56", color: "#E9DFFF" },
    { label: "Stock Value", value: "₹5635", color: "#E5D9FF" },
    { label: "Cash in Hand", value: "10985", color: "#E5D9FF" },

    { label: "Gross Profit", value: "0", color: "#FFD6D6" },
    { label: "Avg. Profit Margin", value: "₹0", color: "#FFD6D6" },
    { label: "Avg. Profit Margin (%)", value: "0.00", color: "#FFD6D6" },
    { label: "Avg. Cart Value", value: "₹0", color: "#FFD6D6" },
    { label: "Avg. Bills (Nos.)", value: "0", color: "#FFD6D6" },
    { label: "Bank Accounts", value: "-32260", color: "#FFD6D6" },
  ];
  const gstOptions = [
    { label: "GST 28 (28.0%)", value: "28" },
    { label: "GST 18 (18.0%)", value: "18" },
    { label: "GST 12 (12.0%)", value: "12" },
    { label: "GST 5 (5.0%)", value: "5" },
    { label: "15 (15.0%)", value: "15" },
  ];

  const [values, setValues] = useState<string[]>([]);
  console.log("values", values);

  const topContent = (
    <>
      <CommonSelect sx={{ width: 300 }} label="Select Location" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} />
      <div className="flex gap-2">
        <CommonSelect sx={{ width: 300 }} label="Select Location" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} multiple />
        <CommonSelect sx={{ width: 300 }} label="Select Channel" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} multiple />
      </div>
    </>
  );

  return (
    <CommonCard grid={{ xs: 12, md: 8 }} topContent={topContent}>
      <Grid container spacing={1.5} p={1.5}>
        {stats.map((item, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: "center", backgroundColor: item.color, height: "100%" }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </CommonCard>
  );
};

export default TotalSummary;
