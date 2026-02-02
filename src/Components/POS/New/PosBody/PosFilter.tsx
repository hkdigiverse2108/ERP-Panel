import AddBoxIcon from "@mui/icons-material/AddBox";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Queries } from "../../../../Api";
import { CommonButton, CommonSelect, CommonTextField } from "../../../../Attribute";
import { useAppDispatch } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";
import { setProductDataModal } from "../../../../Store/Slices/PosSlice";
import { GenerateOptions } from "../../../../Utils";
import CustomerForm from "./CustomerForm";

const PosFilter = () => {
  const [productValue, setProductValue] = useState<string[]>([]);
  const [customerId, setCustomerId] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const { data: productDropdown, isLoading: productDropdownLoading } = Queries.useGetProductDropdown();
  const { data: customerDropdown, isLoading: customerDropdownLoading } = Queries.useGetContactDropdown({ contactType: "customer" });

  const handleProductChange = (value: string[]) => {
    setProductValue(value);
    const product = productDropdown?.data?.find((item) => item._id === value[0]);
    dispatch(setProductDataModal(product));
    setProductValue([]);
  };

  const handleCustomerChange = (value: string[]) => {
    const customer = customerDropdown?.data?.find((item) => item._id === value[0]);
    dispatch(setCustomerModal({ open: true, data: customer }));
  };

  return (
    <>
      <Grid container spacing={2} className="flex justify-between items-center w-full bg-white dark:bg-gray-dark p-2">
        <CommonSelect label="Select Product" options={GenerateOptions(productDropdown?.data)} isLoading={productDropdownLoading} value={productValue} onChange={handleProductChange} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
        <Grid size={{ xs: 12, xsm: 6, sm: 4 }} className="flex justify-end">
          <Grid container className="flex justify-center items-center w-full">
            <CommonSelect label="Select Customer" options={GenerateOptions(customerDropdown?.data)} isLoading={customerDropdownLoading} value={customerId} onChange={(v) => setCustomerId(v)} limitTags={1} grid={{ xs: 10 }} />
            <Grid size={{ xs: 2 }} className="flex justify-center items-center">
              {customerId.length === 0 ? (
                <CommonButton size="small" onClick={() => dispatch(setCustomerModal({ open: true, data: null }))} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <AddBoxIcon />
                </CommonButton>
              ) : (
                <CommonButton size="small" onClick={() => handleCustomerChange(customerId)} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <EditSquareIcon />
                </CommonButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        <CommonTextField label="Sales Invoice" value={""} onChange={() => {}} grid={{ xs: 12, sm: 4 }} disabled />
      </Grid>
      <CustomerForm />
    </>
  );
};

export default PosFilter;
