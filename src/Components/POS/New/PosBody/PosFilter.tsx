import AddBoxIcon from "@mui/icons-material/AddBox";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { Queries } from "../../../../Api";
import { CommonButton, CommonSelect } from "../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setCustomerModal, setDiscardModal } from "../../../../Store/Slices/ModalSlice";
import { addOrUpdateProduct, setCustomerId, setIsSelectProduct, setPosLoading, setReturnPosOrder, setSalesInvoice } from "../../../../Store/Slices/PosSlice";
import { GenerateOptions } from "../../../../Utils";
import CustomerForm from "./CustomerForm";

const PosFilter = () => {
  const { isSelectProduct, PosProduct, isSalesInvoice, isReturnPosOrder } = useAppSelector((state) => state.pos);

  const dispatch = useAppDispatch();

  const { data: productDropdown, isLoading: productDropdownLoading } = Queries.useGetProductDropdown({ stockFilter: true });
  const id = isSelectProduct || "";
  const { data: productById, isLoading: productByIdLoading, isFetching: productByIdFetching } = Queries.useGetProductById(id);
  const { data: posOrderDropdown, isLoading: posOrderDropdownLoading, isFetching: posOrderDropdownFetching } = Queries.useGetPosOrderDropdown({ customerFilter: PosProduct?.customerId });
  const { data: customerDropdown, isLoading: customerDropdownLoading } = Queries.useGetContactDropdown({ typeFilter: "customer" });

  const handleCustomerChange = (value: string[]) => {
    dispatch(setCustomerId(value[0]));
  };

  const handleEditCustomerChange = (value: string) => {
    dispatch(setCustomerModal({ open: true, data: customerDropdown?.data?.find((item) => item._id === value) }));
  };

  const handleSalesInvoiceBtn = (value: string[]) => {
    if (PosProduct?.items.length > 0) {
      dispatch(setDiscardModal());
    } else {
      dispatch(setSalesInvoice(value[0]));
      dispatch(setReturnPosOrder());
    }
  };

  useEffect(() => {
    dispatch(setPosLoading(productByIdLoading || productByIdFetching));
  }, [productByIdLoading, productByIdFetching, dispatch]);

  useEffect(() => {
    if (!productById?.data) return;
    if (productById.data._id !== isSelectProduct) return;
    if (!productByIdLoading && !productByIdFetching) {
      dispatch(addOrUpdateProduct(productById.data));
      dispatch(setIsSelectProduct(""));
    }
  }, [productById?.data, dispatch, isSelectProduct, productByIdLoading, productByIdFetching]);
  return (
    <>
      <Grid container spacing={2} className="flex justify-between items-center w-full bg-white dark:bg-gray-dark p-2">
        <CommonSelect label="Select Product" options={GenerateOptions(productDropdown?.data)} isLoading={productDropdownLoading} disabled={productByIdLoading || productByIdFetching || isReturnPosOrder} value={[isSelectProduct]} onChange={(e) => dispatch(setIsSelectProduct(e[0]))} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
        <Grid size={{ xs: 12, xsm: 6, sm: 4 }} className="flex justify-end">
          <Grid container className="flex justify-center items-center w-full">
            <CommonSelect label="Select Customer" options={GenerateOptions(customerDropdown?.data)} isLoading={customerDropdownLoading} value={[PosProduct?.customerId]} onChange={handleCustomerChange} limitTags={1} disabled={isReturnPosOrder} grid={{ xs: 10 }} />
            <Grid size={{ xs: 2 }} className="flex justify-center items-center">
              {!PosProduct?.customerId ? (
                <CommonButton size="small" onClick={() => dispatch(setCustomerModal({ open: true, data: null }))} disabled={isReturnPosOrder} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <AddBoxIcon />
                </CommonButton>
              ) : (
                <CommonButton size="small" onClick={() => handleEditCustomerChange(PosProduct?.customerId)} disabled={isReturnPosOrder} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <EditSquareIcon />
                </CommonButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        <CommonSelect label="Sales Invoice" options={GenerateOptions(posOrderDropdown?.data)} isLoading={posOrderDropdownLoading || posOrderDropdownFetching} value={[isSalesInvoice]} onChange={handleSalesInvoiceBtn} limitTags={1} disabled={!!isSalesInvoice} grid={{ xs: 12, sm: 4 }} />
      </Grid>
      <CustomerForm />
    </>
  );
};

export default PosFilter;
