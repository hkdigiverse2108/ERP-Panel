import React, { useState } from "react";
import { CommonButton, CommonSelect } from "../../../../Attribute";
import { USER_TYPE } from "../../../../Data";
import { Grid } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CustomerForm from "./CustomerForm";

const PosFilter = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <Grid container spacing={2} className="flex justify-between items-center p-2 w-full">
        <CommonSelect label="Select Location" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
        <Grid size={{ xs: 12, xsm: 6, sm: 4 }} className="flex justify-end">
          <Grid container spacing={2} className="flex justify-between items-center w-full">
            <CommonSelect label="Select Location" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 10 }} />
            <CommonButton variant="contained" grid={{ xs: 2 }}>
              <EditSquareIcon />
            </CommonButton>
          </Grid>
        </Grid>
        <CommonSelect label="Select Location" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
      </Grid>
      <CustomerForm />
    </>
  );
};

export default PosFilter;
