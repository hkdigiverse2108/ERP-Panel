import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { EmployeeBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";

const Employee = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params } = useDataGrid();

  const { data: employeeData, isLoading: employeeDataLoading, isFetching: employeeDataFetching } = Queries.useGetEmployee(params);
  const { mutate: deleteEmployeeMutate } = Mutations.useDeleteEmployee();

  const allEmployee = useMemo(() => employeeData?.data?.employee_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [employeeData]);
  const totalRows = employeeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEmployeeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: GridColDef<EmployeeBase>[] = [
    { field: "username", headerName: "User Name", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNo", headerName: "Phone No", flex: 1 },
    { field: "panNumber", headerName: "PAN Number", flex: 1 },
    { field: "wages", headerName: "Wages", flex: 1 },
    { field: "extraWages", headerName: "Extra Wages", flex: 1 },
    { field: "commission", headerName: "Extra Wages", flex: 1 },
    {
      field: "isActive",
      headerName: "is Active",
      flex: 1,
      renderCell: (params) => <span className={`font-semibold ${params?.value == true ? "text-green-600" : "text-red-600"}`}>{params?.value?.toString()}</span>,
    },
    CommonActionColumn({
      editRoute: ROUTES.EMPLOYEE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }),
    }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.EMPLOYEE.BASE} />
      <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
        <CommonCard title={PAGE_TITLE.EMPLOYEE.BASE} btnHref={ROUTES.EMPLOYEE.ADD_EDIT}>
          <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allEmployee} rowCount={totalRows} loading={employeeDataLoading || employeeDataFetching} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Employee;
