import { Grid, Paper, Typography } from "@mui/material";
import { CommonCard } from "../Common";

interface Props {
  stats: {
    label: string;
    value: number | string;
  }[];
}

const SupplierBillStats = ({ stats }: Props) => {
  return (
    <CommonCard>
      <Grid container spacing={1.5} p={1.5}>
        {stats.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", bgcolor: "background.paper" }}>
              <Typography variant="h5" fontWeight={700}>
                {item.value}
              </Typography>

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

export default SupplierBillStats;
