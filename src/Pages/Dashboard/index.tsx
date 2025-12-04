import { Box, Grid } from "@mui/material";
import { ImportantAnnouncement, TotalSummary } from "../../Components/Dashboard";
import SalesAndPurchase from "../../Components/Dashboard/SalesAndPurchase";
import Transaction from "../../Components/Dashboard/Transaction";
import TopCustomers from "../../Components/Dashboard/TopCustomers";

const Dashboard = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <TotalSummary />
        <ImportantAnnouncement />
        <SalesAndPurchase />
        <Transaction />
        <TopCustomers />
      </Grid>
    </Box>
  );
};

export default Dashboard;
