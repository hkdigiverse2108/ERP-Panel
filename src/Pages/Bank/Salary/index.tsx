import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, SalaryBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const Salary = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SALARY.BASE);

  const { data, isLoading, isFetching } = Queries.useGetSalary(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetSalary({}, false);
  const { mutate: deleteSalary, isPending: isDeleteLoading } = Mutations.useDeleteSalary();
  const { mutate: editSalary, isPending: isEditLoading } = Mutations.useEditSalary();

  const rows = useMemo(() => data?.data?.salary_data.map((r) => ({ ...r, id: r?._id })) || [], [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.SALARY.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteSalary(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<SalaryBase>[] = [
    CommonObjectPropertyColumn<SalaryBase>("partyId", "partyId", ["firstName", "lastName", "fullName"], { headerName: "Party Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SalaryBase>("fromDate", "fromDate", [], { headerName: "From Date", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<SalaryBase>("toDate", "toDate", [], { headerName: "To Date", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<SalaryBase>("amount", "amount", [], { headerName: "Amount", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SalaryBase>("type", "type", [], { headerName: "Expense Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<SalaryBase>("incentive", "incentive", [], { headerName: "Incentive", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SalaryBase>("total", "total", [], { headerName: "Total", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<SalaryBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SalaryBase>({
            ...(permission?.edit && {
              active: (row) => editSalary({ salaryId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.SALARY.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.description }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SALARY.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALARY.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALARY.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Salary;
