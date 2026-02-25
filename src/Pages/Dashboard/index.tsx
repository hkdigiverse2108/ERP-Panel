import { Grid } from "@mui/material";
import { BestSellingProduct, CustomersReport, LeastSellingProduct, Notifications, SalesAndPurchase, TodayPayable, TodayReceivable, ToPay, TopCoupons, TopCustomers, TopExpenses, ToReceive, TotalSummary, Transaction } from "../../Components/Dashboard";

const Dashboard = () => {
  return (
    <div className="m-4 md:m-6">
      <Grid container spacing={2}>
        <TotalSummary />
        <Notifications />
        <SalesAndPurchase />
        <Transaction />
        <TopCustomers />
        <CustomersReport />
        <BestSellingProduct />
        <LeastSellingProduct />
        <TopExpenses />
        <TopCoupons />
        <TodayReceivable />
        <TodayPayable />
        <ToReceive />
        <ToPay />
      </Grid>
    </div>
  );
};

export default Dashboard;
