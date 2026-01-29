import { Grid, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { CommonCard } from ".";

/* ======================================================
   TYPES
====================================================== */

export interface CommonStatsItem {
  label: string;
  value: number | string;
  color?: string; 
}

interface CommonStatsCardProps {
  stats: CommonStatsItem[];
  grid?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  paperSx?: SxProps<Theme>;
}

/* ======================================================
   COMPONENT
====================================================== */

const CommonStatsCard: FC<CommonStatsCardProps> = ({ stats, grid = { xs: 12, sm: 4, md:3 }, paperSx }) => {
  return (
    <CommonCard>
      <Grid container spacing={5} p={2}>
        {stats.map((item, index) => (
          <Grid key={index} size={grid}>
            <Paper
              elevation={0}
              className={item.color}
              sx={{
                backgroundColor: "#e8f0ff",
                borderRadius: 3, 
                minHeight: 110,
                px: 2,
                py: 2.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                ...paperSx,
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                {item.value}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </CommonCard>
  );
};

export default CommonStatsCard;
