import { Box, CircularProgress, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";
import { useState } from "react";
import { Queries } from "../../Api";
import { CommonDateRangeSelector } from "../../Attribute";
import { CommonCard } from "../Common";

const SalesAndPurchase = () => {
  const [range, setRange] = useState({ start: dayjs(), end: dayjs() });

  const { data: salesAndPurchaseData, isLoading: isSalesAndPurchaseLoading, isFetching: isSalesAndPurchaseFetching } = Queries.useGetDashboardSalesAndPurchaseGraph({ startDate: range.start, endDate: range.end });

  const chartData = salesAndPurchaseData?.data || [];
  const isLoading = isSalesAndPurchaseLoading || isSalesAndPurchaseFetching;

  const sales = chartData.map((item) => item.sales || 0);
  const purchase = chartData.map((item) => item.purchase || 0);
  const salesReturn = chartData.map((item) => item.salesReturn || 0);
  const purchaseReturn = chartData.map((item) => item.purchaseReturn || 0);
  const dates = chartData.map((item) => dayjs(item.date).format("DD MMM"));

  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Week" />
    </Grid>
  );

  return (
    <CommonCard title="Sales And Purchase" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <Box className="p-2">
        {isLoading ? (
          <div className="w-full h-82 flex items-center justify-center">
            <CircularProgress color="primary" size={30} />
          </div>
        ) : (
          <BarChart
            series={[
              { data: sales, label: "Sales", id: "sales", stack: "total" },
              { data: purchase, label: "Purchase", id: "purchase", stack: "total" },
              { data: salesReturn, label: "Sales Return", id: "salesReturn", stack: "total" },
              { data: purchaseReturn, label: "Purchase Return", id: "purchaseReturn", stack: "total" },
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

export default SalesAndPurchase;
