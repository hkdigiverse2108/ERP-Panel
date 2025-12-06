import { Grid } from "@mui/material";
import { CustomersReport, ImportantAnnouncement, SalesAndPurchase, TopCustomers, TotalSummary, Transaction } from "../../Components/Dashboard";

const Dashboard = () => {
  return (
    <div className="m-4 md:m-6">
      <Grid container spacing={2}>
        <TotalSummary />
        <ImportantAnnouncement />
        <SalesAndPurchase />
        <Transaction />
        <TopCustomers />
        <CustomersReport />
      </Grid>
    </div>
  );
};

export default Dashboard;
