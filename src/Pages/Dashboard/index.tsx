import { Grid } from "@mui/material";
import { BestSellingProduct, CategorySales, CustomersReport, LeastSellingProduct, LoginLog, Notifications, SalesAndPurchase, TodayPayable, TodayReceivable, ToPay, TopCoupons, TopCustomers, TopExpenses, ToReceive, TotalSummary, Transaction } from "../../Components/Dashboard";

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
        <CategorySales />
        <BestSellingProduct />
        <LeastSellingProduct />
        <TopExpenses />
        <TopCoupons />
        <TodayReceivable />
        <TodayPayable />
        <ToReceive />
        <ToPay />
        <LoginLog />
      </Grid>
    </div>
  );
};

export default Dashboard;
