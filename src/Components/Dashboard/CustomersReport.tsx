import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { CommonCard } from "../Common";
import { Queries } from "../../Api";

const CustomersReport = () => {
  const { data, isLoading } = Queries.useGetDashboardCategoryWiseCustomersCount();
  const stats = [
    {
      title: "VIP Customers",
      icon: <StarIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bg: "bg-brand-100! dark:bg-brand-800!",
      iconBg: "bg-brand-500!",
      type: "VIP_Customer",
    },
    {
      title: "Regular Customers",
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bg: "bg-sky-100! dark:bg-sky-800!",
      iconBg: "bg-sky-500!",
      type: "Regular_Customer",
    },
    {
      title: "Risk Customers",
      icon: <WarningAmberIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bg: "bg-purple-100! dark:bg-purple-800!",
      iconBg: "bg-purple-500!",
      type: "Risk_Customer",
    },
    {
      title: "Lost Customers",
      icon: <HighlightOffIcon sx={{ fontSize: 32, color: "#fff" }} />,
      bg: "bg-rose-100! dark:bg-rose-800!",
      iconBg: "bg-rose-500!",
      type: "Lost_Customer",
    },
  ];

  return (
    <CommonCard title="Customers Report" grid={{ xs: 12, md: 6 }}>
      <Grid container spacing={2} m={2}>
        {stats.map((item, i) => (
          <Grid key={i} size={{ xs: 12, xsm: 6 }}>
            <Box className={`flex flex-col items-center gap-2 rounded-lg py-7 px-1 ${item.bg} h-full w-full`}>
              <Box className={`w-14 h-14 flex justify-center items-center rounded-xl shadow-tooltip ${item.iconBg}`}>{item.icon}</Box>
              <Box>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {isLoading ? <CircularProgress color="primary" size={15} /> : (data?.data?.find((c) => c.category === item.type)?.count ?? 0) || 0}
                </Typography>
                <Typography variant="h6" textAlign="center">
                  {item.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CommonCard>
  );
};

export default CustomersReport;
