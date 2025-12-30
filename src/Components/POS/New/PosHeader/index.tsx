import { Grid, Tooltip } from "@mui/material";
import { useState } from "react";
import { CommonRadio, CommonSelect } from "../../../../Attribute";
import { ORDER_TYPE, USER_TYPE } from "../../../../Data";
import PrintIcon from "@mui/icons-material/Print";
import CFB from "./CFB";
import WeightScale from "./WeightScale";
import ProductList from "./ProductList";
import WiFi from "./WiFi";
import Discard from "./Discard";
import FullScreen from "./FullScreen";
import CurrentRegister from "./CurrentRegister";

const PosHeader = () => {
  const [contactType, setContactType] = useState("Walk In");
  const [value, setValue] = useState<string[]>([]);
  return (
    <div className={`z-50 flex bg-white dark:bg-gray-900 lg:border-b border-gray-200 dark:border-gray-800 transition-all duration-300 w-full!`}>
      <Grid container className="flex justify-between items-center p-2 w-full">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2} className="flex items-center w-full">
            <CommonRadio value={contactType} onChange={setContactType} options={ORDER_TYPE} grid={{ xs: 12, xsm: 6, sm: 3 }} />
            <CommonSelect label="Select Location" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 3 }} />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} gap={1} className="flex justify-end">
          <WiFi />
          <CFB />
          <Tooltip title="Last Bill Print">
            <div className="head-icon">
              <PrintIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
            </div>
          </Tooltip>
          <WeightScale />
          <ProductList />
          <Discard />
          <FullScreen />
          <CurrentRegister />
        </Grid>
      </Grid>
    </div>
  );
};

export default PosHeader;
