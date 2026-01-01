import { Grid } from "@mui/material";
import PosFilter from "./PosFilter";
import PosSidebar from "./PosSidebar";

const PosBody = () => {
  return (
    <>
      <Grid container>
        <Grid size={10} p={1}>
          <PosFilter />
        </Grid>
        <Grid size={2}>
          <PosSidebar />
        </Grid>
      </Grid>
    </>
  );
};

export default PosBody;
