import { Grid } from "@mui/material";
import PosFilter from "./PosFilter";

const PosBody = () => {
  return (
    <>
      <Grid container>
        <Grid size={10}>
          <PosFilter />
        </Grid>
        <Grid size={2}>b</Grid>
      </Grid>
    </>
  );
};

export default PosBody;
