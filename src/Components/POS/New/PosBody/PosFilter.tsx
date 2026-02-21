import AddBoxIcon from "@mui/icons-material/AddBox";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { Queries } from "../../../../Api";
import { CommonButton, CommonSelect, CommonTextField } from "../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";
import { addOrUpdateProduct, setCustomerId, setIsSelectProduct, setPosLoading } from "../../../../Store/Slices/PosSlice";
import { GenerateOptions } from "../../../../Utils";
import CustomerForm from "./CustomerForm";

const PosFilter = () => {
  const { isSelectProduct, PosProduct } = useAppSelector((state) => state.pos);

  const dispatch = useAppDispatch();

  const { data: productDropdown, isLoading: productDropdownLoading } = Queries.useGetProductDropdown();
  const id = isSelectProduct || "";
  const { data: productById, isLoading: productByIdLoading, isFetching: productByIdFetching } = Queries.useGetProductById(id);

  const { data: customerDropdown, isLoading: customerDropdownLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const handleCustomerChange = (value: string[]) => {
    dispatch(setCustomerId(value[0]));
  };

  const handleEditCustomerChange = (value: string) => {
    dispatch(setCustomerModal({ open: true, data: customerDropdown?.data?.find((item) => item._id === value) }));
  };

  useEffect(() => {
    dispatch(setPosLoading(productByIdLoading || productByIdFetching));
  }, [productByIdLoading, productByIdFetching, dispatch]);

  useEffect(() => {
    if (!productById?.data) return;
    dispatch(addOrUpdateProduct(productById.data));
    dispatch(setIsSelectProduct(""));
  }, [productById?.data, dispatch]);

  return (
    <>
      <Grid container spacing={2} className="flex justify-between items-center w-full bg-white dark:bg-gray-dark p-2">
        <CommonSelect label="Select Product" options={GenerateOptions(productDropdown?.data)} isLoading={productDropdownLoading} disabled={productByIdLoading || productByIdFetching} value={[isSelectProduct]} onChange={(e) => dispatch(setIsSelectProduct(e[0]))} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
        <Grid size={{ xs: 12, xsm: 6, sm: 4 }} className="flex justify-end">
          <Grid container className="flex justify-center items-center w-full">
            <CommonSelect label="Select Customer" options={GenerateOptions(customerDropdown?.data)} isLoading={customerDropdownLoading} value={[PosProduct?.customerId]} onChange={handleCustomerChange} limitTags={1} grid={{ xs: 10 }} />
            <Grid size={{ xs: 2 }} className="flex justify-center items-center">
              {!PosProduct?.customerId ? (
                <CommonButton size="small" onClick={() => dispatch(setCustomerModal({ open: true, data: null }))} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <AddBoxIcon />
                </CommonButton>
              ) : (
                <CommonButton size="small" onClick={() => handleEditCustomerChange(PosProduct?.customerId)} sx={{ minWidth: 40, p: 0 }} variant="contained">
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
