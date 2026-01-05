import { Grid } from "@mui/material";
import PosFilter from "./PosFilter";
import PosSidebar from "./PosSidebar";
import PosFooter from "./PosFooter";

const PosBody = () => {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12, sm: 10 }} p={1} className="flex flex-col justify-between">
          <PosFilter />
          <PosFooter />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <PosSidebar />
        </Grid>
      </Grid>
    </>
  );
};

export default PosBody;
