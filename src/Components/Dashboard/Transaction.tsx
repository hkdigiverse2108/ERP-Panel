import dayjs from "dayjs";
import { useState } from "react";
import { CommonCard } from "../Common";
import { Box, CircularProgress, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CommonDateRangeSelector, CommonSelect } from "../../Attribute";
import { Queries } from "../../Api";
import { OPTION_TYPE } from "../../Data";

const Transaction = () => {
  const [range, setRange] = useState({ start: dayjs(), end: dayjs() });
  const [values, setValues] = useState<string[]>([OPTION_TYPE[1].value]);

  const { data: transactionData, isLoading: isTransactionLoading, isFetching: isTransactionFetching } = Queries.useGetDashboardTransactionGraph({ startDate: range.start, endDate: range.end, type: values[0] });

  const chartData = transactionData?.data || [];
  const isLoading = isTransactionLoading || isTransactionFetching;

  const bank = chartData.map((item) => item.bank || 0);
  const card = chartData.map((item) => item.card || 0);
  const cash = chartData.map((item) => item.cash || 0);
  const cheque = chartData.map((item) => item.cheque || 0);
  const upi = chartData.map((item) => item.upi || 0);
  const other = chartData.map((item) => item.other || 0);
  const dates = chartData.map((item) => dayjs(item.date).format("DD MMM"));

  const topContent = (
    <>
      <Grid size={{ xs: 12, xsm: 4, xl: 3 }} offset={{ xl: "auto" }}>
        <CommonSelect label="Select Transaction" options={OPTION_TYPE} value={values} onChange={(v) => setValues(v)} limitTags={1} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4, xl: 4 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} active="This Month" />
      </Grid>
    </>
  );

  return (
    <CommonCard title="Transaction" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <Box className="p-2">
        {isLoading ? (
          <div className="w-full h-82 flex items-center justify-center">
            <CircularProgress color="primary" size={30} />
          </div>
        ) : (
          <BarChart
            series={[
              { data: bank, label: "Bank", id: "bank", stack: "total" },
              { data: card, label: "Card", id: "card", stack: "total" },
              { data: cash, label: "Cash", id: "cash", stack: "total" },
              { data: cheque, label: "Cheque", id: "cheque", stack: "total" },
              { data: upi, label: "UPI", id: "upi", stack: "total" },
              { data: other, label: "Other", id: "other", stack: "total" },
            ]}
            height={300}
            xAxis={[{ data: dates, height: 28 }]}
            yAxis={[{ width: 50 }]}
          />
        )}
      </Box>
    </CommonCard>
  );
};

export default Transaction;
