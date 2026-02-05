import PrintIcon from "@mui/icons-material/Print";
import { Grid, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Queries } from "../../../../Api";
import { CommonRadio, CommonSelect } from "../../../../Attribute";
import { ORDER_TYPE } from "../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setOrderType, setSalesmanId } from "../../../../Store/Slices/PosSlice";
import { GenerateOptions } from "../../../../Utils";
import CurrentRegister from "./CurrentRegister";
import Discard from "./Discard";
import FullScreen from "./FullScreen";
import ProductList from "./ProductList";
import WiFi from "./WiFi";

const PosHeader = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { PosProduct } = useAppSelector((state) => state.pos);
  const dispatch = useAppDispatch();

  const { data: userDropdown, isLoading: userDropdownLoading } = Queries.useGetUserDropdown();
  const selectedUserId = userDropdown?.data?.find((item) => item._id === user?._id)?._id;

  const [value, setValue] = useState<string[]>([]);

  const handleChange = (id: string[]) => {
    setValue(id);
    dispatch(setSalesmanId(id[0]));
  };

  useEffect(() => {
    if (selectedUserId) {
      setValue([selectedUserId]);
      dispatch(setSalesmanId(selectedUserId));
    }
  }, [dispatch, selectedUserId]);
  return (
    <div className={`z-50 flex bg-white dark:bg-gray-900 lg:border-b border-gray-200 dark:border-gray-800 transition-all duration-300 w-full!`}>
      <Grid spacing={{ xs: 1, lg: 0 }} container className="flex justify-between items-center p-2 w-full">
        <Grid size={{ xs: 12, lg: 6, xl: 8 }}>
          <Grid container spacing={{ xs: 1, sm: 2 }} className="flex max-sm:justify-center items-center w-full">
            <CommonRadio value={PosProduct.orderType} onChange={(e) => dispatch(setOrderType(e))} options={ORDER_TYPE} grid={{ xs: "auto" }} />
            <CommonSelect label="Select Salesman" options={GenerateOptions(userDropdown?.data)} isLoading={userDropdownLoading} value={value} onChange={handleChange} limitTags={1} grid={{ xs: 12, xsm: 6, lg: 4, xl: 3 }} />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 6, xl: 4 }} gap={1} className="flex max-sm:justify-between  lg:justify-end">
          <WiFi />
          {/* <CFB /> */}
          <Tooltip title="Last Bill Print">
            <div className="head-icon">
              <PrintIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
            </div>
          </Tooltip>
          {/* <WeightScale /> */}
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
