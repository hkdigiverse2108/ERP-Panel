import { Box, Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Form, Formik, type FormikHelpers } from "formik";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../../../../Attribute";
import { CASH_CONTROL_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setCashControlModal } from "../../../../../../Store/Slices/ModalSlice";
import type { CashControlBase, CashControlFormValues } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";
import { CommonObjectPropertyColumn } from "../../../../../Common/CommonDataGrid/CommonColumns";

const CashControl = () => {
  const { isCashControlModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ pageSize: 5, active: true, defaultFilterKey: { registerFilter: ["true"] } });

  const { data: cashControlData, isLoading: cashControlDataLoading, isFetching: cashControlDataFetching } = Queries.useGetCashControl(params, isCashControlModal);

  const { mutate: addCashControl, isPending: isAddLoading } = Mutations.useAddCashControl();

  const allCashControl = useMemo(() => cashControlData?.data?.cashControl_data.map((cashControl) => ({ ...cashControl, id: cashControl?._id })) || [], [cashControlData]);
  const totalRows = cashControlData?.data?.totalData || 0;

  const initialValues: CashControlFormValues = { type: CASH_CONTROL_TYPE[0].value, amount: "", remark: "" };

  const handleSubmit = (value: CashControlFormValues, { resetForm }: FormikHelpers<CashControlFormValues>) => addCashControl(value, { onSuccess: () => resetForm() });

  const columns: GridColDef<CashControlBase>[] = [
    { field: "amount", headerName: "Opening Amount", width: 200 },
    CommonObjectPropertyColumn<CashControlBase>("createdAt", "createdAt", [], { headerName: "Created At", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<CashControlBase>("updatedAt", "updatedAt", [], { headerName: "Updated At", flex: 1, minWidth: 150, type: "date" }),
    { field: "remark", headerName: "Remark", flex: 1, minWidth: 200 },
  ];
  const CommonDataGridOption = {
    columns,
    rows: allCashControl,
    rowCount: totalRows,
    loading: cashControlDataLoading || cashControlDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
    fileName: "Cash Control",
  };

  return (
    <CommonModal title="Cash Control" isOpen={isCashControlModal} onClose={() => dispatch(setCashControlModal())} className={`max-w-[1000px]`}>
      <Box pr={0.5} className="space-y-1">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Today's opening Cash In Hand : <span className="text-gray-800 dark:text-gray-200">{cashControlData?.data?.totalAmount || 0}</span>
        </p>
        <Formik<CashControlFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
          {({ dirty }) => (
            <Form noValidate className="py-3">
              <Grid container spacing={2}>
                <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 3 }} required />
                <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12, sm: 6 }} multiline />
                <CommonButton disabled={!dirty} loading={isAddLoading} type="submit" variant="contained" title="Save" size="small" />
              </Grid>
            </Form>
          )}
        </Formik>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </CommonModal>
  );
};

export default CashControl;
