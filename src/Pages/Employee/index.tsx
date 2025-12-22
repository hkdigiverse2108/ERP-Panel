import { Box, Button, Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonButton } from "../../Attribute";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonModal } from "../../Components/Common";
import { ROUTES } from "../../Constants";
import type { EmployeeBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";

const Employee = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rawToDelete, setRawToDelete, params } = useDataGrid();

  const { data: employeeData, isLoading: employeeDataLoading, isFetching: employeeDataFetching } = Queries.useGetEmployee(params);
  const { mutate: deleteEmployeeMutate } = Mutations.useDeleteEmployee();

  const allEmployee = useMemo(() => employeeData?.data?.employee_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [employeeData]);
  const totalRows = employeeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rawToDelete) return;
    deleteEmployeeMutate(rawToDelete?._id as string, { onSuccess: () => setRawToDelete(null) });
  };

  const columns: GridColDef<EmployeeBase>[] = [
    { field: "username", headerName: "User Name", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobileNo", headerName: "Mobile", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
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
      onDelete: (row) => setRawToDelete({ _id: row._id!, title: row.username }),
    }),
  ];

  const topContent = (
    <Grid size="auto">
      <Link to={ROUTES.EMPLOYEE.ADD_EDIT}>
        <CommonButton variant="contained" size="small">
          ADD
        </CommonButton>
      </Link>
    </Grid>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Employees" topContent={topContent}>
        <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allEmployee} rowCount={totalRows} loading={employeeDataLoading || employeeDataFetching} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} />
      </CommonCard>

      <CommonModal title="Confirm Delete" isOpen={Boolean(rawToDelete)} onClose={() => setRawToDelete(null)} className="max-w-125 m-2 sm:m-5">
        <p className="my-3">Are you sure you want to delete "{rawToDelete?.title}"?</p>
        <div className="flex justify-end">
          <Button onClick={() => setRawToDelete(null)}>No</Button>
          <Button color="error" onClick={handleDeleteBtn}>
            Yes
          </Button>
        </div>
      </CommonModal>
    </Box>
  );
};

export default Employee;
