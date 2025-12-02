import { Box, Grid } from "@mui/material";
import { ImportantAnnouncement, TotalSummary } from "../../Components/Dashboard";

// const stats = [
//   { label: "Total Sales", value: "₹0", color: "bg-teal-100" },
//   { label: "Total Invoice", value: "0", color: "bg-blue-100" },
//   { label: "Sold Qty", value: "0", color: "bg-indigo-100" },
//   { label: "Total Customers", value: "4", color: "bg-cyan-100" },
//   { label: "To Receive", value: "₹0", color: "bg-teal-100" },

//   { label: "Total Sales Return", value: "₹0", color: "bg-teal-100" },
//   { label: "Total Purchase", value: "₹0", color: "bg-blue-100" },
//   { label: "Total Bills", value: "0", color: "bg-indigo-100" },
//   { label: "Purchase Qty", value: "0", color: "bg-indigo-100" },
//   { label: "Total Suppliers", value: "0", color: "bg-blue-100" },

//   { label: "To Pay", value: "₹0", color: "bg-blue-100" },
//   { label: "Total Purchase Return", value: "₹0", color: "bg-teal-100" },
//   { label: "Total Paid", value: "₹0", color: "bg-purple-100" },
//   { label: "Total Expense", value: "₹0", color: "bg-purple-100" },
//   { label: "Total Products", value: "43", color: "bg-indigo-100" },

//   { label: "Stock Qty", value: "56", color: "bg-indigo-100" },
//   { label: "Stock Value", value: "₹5635", color: "bg-purple-100" },
//   { label: "Cash in Hand", value: "10985", color: "bg-purple-100" },
//   { label: "Gross Profit", value: "0", color: "bg-red-100" },
//   { label: "Avg. Profit Margin", value: "₹0", color: "bg-red-100" },

//   { label: "Avg. Profit Margin (%)", value: "0.00", color: "bg-red-100" },
//   { label: "Avg. Cart Value", value: "₹0", color: "bg-red-100" },
//   { label: "Avg. Bills (Nos.)", value: "0", color: "bg-red-100" },
//   { label: "Bank Accounts", value: "-32260", color: "bg-red-100" },
// ];

// const stats = [
//   { label: "Total Sales", value: "₹0", color: "#C8F7F1" },
//   { label: "Total Invoice", value: "0", color: "#C8F7F1" },
//   { label: "Sold Qty", value: "0", color: "#C8F7F1" },
//   { label: "Total Customers", value: "4", color: "#C8F7F1" },
//   { label: "To Receive", value: "₹0", color: "#C8F7F1" },
//   { label: "Total Sales Return", value: "₹0", color: "#C8F7F1" },

//   { label: "Total Purchase", value: "₹0", color: "#DCEBFF" },
//   { label: "Total Bills", value: "0", color: "#DCEBFF" },
//   { label: "Purchase Qty", value: "0", color: "#DCEBFF" },
//   { label: "Total Suppliers", value: "0", color: "#DCEBFF" },
//   { label: "To Pay", value: "₹0", color: "#DCEBFF" },
//   { label: "Total Purchase Return", value: "₹0", color: "#DCEBFF" },

//   { label: "Total Paid", value: "₹0", color: "#E5D9FF" },
//   { label: "Total Expense", value: "₹0", color: "#E5D9FF" },
//   { label: "Total Products", value: "43", color: "#E9DFFF" },
//   { label: "Stock Qty", value: "56", color: "#E9DFFF" },
//   { label: "Stock Value", value: "₹5635", color: "#E5D9FF" },
//   { label: "Cash in Hand", value: "10985", color: "#E5D9FF" },

//   { label: "Gross Profit", value: "0", color: "#FFD6D6" },
//   { label: "Avg. Profit Margin", value: "₹0", color: "#FFD6D6" },
//   { label: "Avg. Profit Margin (%)", value: "0.00", color: "#FFD6D6" },
//   { label: "Avg. Cart Value", value: "₹0", color: "#FFD6D6" },
//   { label: "Avg. Bills (Nos.)", value: "0", color: "#FFD6D6" },
//   { label: "Bank Accounts", value: "-32260", color: "#FFD6D6" },
// ];

// const Dashboard = () => {
//   return (
//     <>
//       <Box>
//         <Grid container spacing={1.5} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-4">
//           {stats.map((item, index) => (
//             <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
//               <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: "center", backgroundColor: item.color }}>
//                 <Typography variant="h6" fontWeight={600}>
//                   {item.value}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {item.label}
//                 </Typography>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default Dashboard;

const Dashboard = () => {
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          {/* Left: Stats */}
          <TotalSummary />
          {/* Right: Announcements */}
          <ImportantAnnouncement />
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
