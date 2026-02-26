import { CircularProgress, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { CommonDateRangeSelector, CommonSelect } from "../../Attribute";
import { CommonCard } from "../Common";
import { Queries } from "../../Api";

const TotalSummary = () => {
  const [values, setValues] = useState<string[]>([]);
  const [range, setRange] = useState({ start: dayjs(), end: dayjs() });

  const { data, isLoading, isFetching } = Queries.useGetDashboardTransaction({ startDate: range.start, endDate: range.end });

  const stats = [
    { type: "totalSales", label: "Total Sales", value: "₹0", color: "bg-brand-100! dark:bg-brand-800!" },
    { type: "totalInvoice", label: "Total Invoice", value: "0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { type: "soldQty", label: "Sold Qty", value: "0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { type: "totalCustomers", label: "Total Customers", value: "4", color: "bg-brand-100!  dark:bg-brand-800!" },
    { type: "toReceive", label: "To Receive", value: "₹0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { type: "totalSalesReturn", label: "Total Sales Return", value: "₹0", color: "bg-brand-100!  dark:bg-brand-800!" },

    { type: "totalPurchase", label: "Total Purchase", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { type: "totalBills", label: "Total Bills", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { type: "purchaseQty", label: "Purchase Qty", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { type: "totalSuppliers", label: "Total Suppliers", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { type: "toPay", label: "To Pay", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { type: "totalPurchaseReturn", label: "Total Purchase Return", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },

    { type: "totalPaid", label: "Total Paid", value: "₹0", color: "bg-purple-100!  dark:bg-purple-800!" },
    { type: "totalExpense", label: "Total Expense", value: "₹0", color: "bg-purple-100!  dark:bg-purple-800!" },
    { type: "totalProducts", label: "Total Products", value: "43", color: "bg-purple-100!  dark:bg-purple-800!" },
    { type: "stockQty", label: "Stock Qty", value: "56", color: "bg-purple-100!  dark:bg-purple-800!" },
    { type: "stockValue", label: "Stock Value", value: "₹5635", color: "bg-purple-100!  dark:bg-purple-800!" },
    { type: "cashInHand", label: "Cash in Hand", value: "10985", color: "bg-purple-100!  dark:bg-purple-800!" },

    { type: "grossProfit", label: "Gross Profit", value: "0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { type: "avgProfitMarginAmount", label: "Avg. Profit Margin", value: "₹0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { type: "avgProfitMarginPercent", label: "Avg. Profit Margin (%)", value: "0.00", color: "bg-rose-100!  dark:bg-rose-800!" },
    { type: "avgCartValue", label: "Avg. Cart Value", value: "₹0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { type: "avgBillsCount", label: "Avg. Bills (Nos.)", value: "0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { type: "bankAccountsBalance", label: "Bank Accounts", value: "-32260", color: "bg-rose-100!  dark:bg-rose-800!" },
  ];
  const gstOptions = [
    { label: "ALL", value: "all" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ];

  const formatValue = (key: string, value: number) => {
    const currencyFields = ["totalSales", "toReceive", "totalSalesReturn", "totalPurchase", "toPay", "totalPurchaseReturn", "totalPaid", "totalExpense", "cashInHand", "bankAccountsBalance", "stockValue", "grossProfit", "avgProfitMarginAmount", "avgCartValue"];

    if (currencyFields.includes(key)) {
      return `₹${value.toLocaleString("en-IN")}`;
    }

    return value;
  };

  const topContent = (
    <>
      <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} />
      </Grid>
      <Grid size={{ xs: 12, xsm: 6, sm: 4, xxl: 3 }}>
        <CommonSelect label="Select Channel" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} />
      </Grid>
    </>
  );

  return (
    <CommonCard grid={{ xs: 12}} topContent={topContent}>
      <Grid container spacing={1.5} p={1.5}>
        {stats.map((item, index) => (
          <Grid size={{ xs: 6, sm: 4, lg: 3, xl: 2 }} key={index}>
            <Paper className={item.color} elevation={0} sx={{ p: 1.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h6">{isLoading || isFetching ? <CircularProgress color="primary" size={15} /> : formatValue(item.type, data?.data?.[item.type as keyof typeof data.data] ?? 0)}</Typography>{" "}
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
