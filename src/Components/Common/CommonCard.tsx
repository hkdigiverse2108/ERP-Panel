import { Divider, Grid, Paper, Typography, type PaperProps } from "@mui/material";
import { type FC, type ReactNode } from "react";

interface CommonCardProps {
  title?: string;
  children: ReactNode;
  grid?: object;
  paperProps?: PaperProps;
  hideDivider?: boolean;
  topContent?: ReactNode;
}

const CommonCard: FC<CommonCardProps> = ({ title, children, grid = { xs: 12 }, paperProps, hideDivider = false, topContent }) => {
  return (
    <Grid size={grid}>
      <Paper elevation={0} className="rounded-lg! border! border-gray-200! bg-white! dark:border-gray-800! dark:bg-gray-dark!" {...paperProps}>
        <div className="flex items-center justify-between px-2 py-1.5">
          {title && (
            <Typography variant="subtitle1" fontWeight={600} px={2} py={1.5} className="text-gray-700! dark:text-gray-200!">
              {title}
            </Typography>
          )}
          {topContent}
        </div>

        {!hideDivider && <Divider className="border-gray-300! dark:border-gray-700!" />}

        {children}
      </Paper>
    </Grid>
  );
};

export default CommonCard;
