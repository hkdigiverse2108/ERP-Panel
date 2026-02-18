import { Box, Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { Queries } from "../../../../../../Api";
import { CommonButton, CommonRadio, CommonValidationTextField } from "../../../../../../Attribute";
import { CASH_CONTROL } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setCashControlModal } from "../../../../../../Store/Slices/ModalSlice";
import type { BranchBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";

const CashControl = () => {
  const { isCashControlModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ pageSize: 5, active: true });
  const [isCashControlType, setCashControlType] = useState(CASH_CONTROL[0].value);

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetBranch(params, isCashControlModal);
  const allBranches = useMemo(() => branchData?.data?.branch_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleSubmit = () => {};

  const columns: GridColDef<BranchBase>[] = [
    { field: "name", headerName: "Branch Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
  ];
  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <CommonModal title="Cash Control" isOpen={isCashControlModal} onClose={() => dispatch(setCashControlModal())} className={`max-w-[${isCashControlType === CASH_CONTROL[0].value ? "500px" : "1000px"}]`}>
      <CommonRadio value={isCashControlType} options={CASH_CONTROL} onChange={(e) => setCashControlType(e)} />
      {isCashControlType === CASH_CONTROL[0].value ? (
        <Box py={2}>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-400">Today's opening Cash In Hand : 3456734</span>
            <br />
            <span className="font-semibold text-gray-700 dark:text-gray-400">Last changes made by</span>
            <div className="flex text-sm ">
              <span className="font-semibold text-gray-700 dark:text-gray-400">User:- </span>
              <span className="font-normal text-gray-700 dark:text-gray-400">value</span>
            </div>
            <div className="flex text-sm ">
              <span className="font-semibold text-gray-700 dark:text-gray-400">Date and Time:- </span>
              <span className="font-normal text-gray-700 dark:text-gray-400">value</span>
            </div>
          </div>
        </Box>
      ) : (
        <Box pr={2} className="space-y-1">
          <Formik enableReinitialize initialValues={{ opening: "" }} onSubmit={handleSubmit}>
            <Form noValidate className="py-3">
              <Grid container spacing={2}>
                <CommonValidationTextField name="opening" label="Amount" grid={{ xs: 12, sm: 3 }} required />
                <CommonValidationTextField name="opening" label="Remark" grid={{ xs: 12, sm: 6 }} multiline />
                <CommonButton type="submit" variant="contained" title="Save" size="small" />
              </Grid>
            </Form>
          </Formik>
          <CommonCard hideDivider>
            <CommonDataGrid {...CommonDataGridOption} />
          </CommonCard>
        </Box>
      )}
    </CommonModal>
  );
};

export default CashControl;
