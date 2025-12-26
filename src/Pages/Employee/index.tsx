import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { EmployeeBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();

  const { data: employeeData, isLoading: employeeDataLoading, isFetching: employeeDataFetching } = Queries.useGetEmployee(params);
  const { mutate: deleteEmployeeMutate } = Mutations.useDeleteEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const allEmployee = useMemo(() => employeeData?.data?.user_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [employeeData]);
  const totalRows = employeeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEmployeeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.EMPLOYEE.ADD_EDIT);

  const columns: GridColDef<EmployeeBase>[] = [
    { field: "username", headerName: "User Name", type: "string", width: 170 },
    { field: "fullName", headerName: "Full Name", width: 170 },
    { field: "email", headerName: "Email", width: 240 },
    { field: "phoneNo", headerName: "Phone No", width: 150 },
    { field: "panNumber", headerName: "PAN Number", width: 150 },
    { field: "wages", headerName: "Wages", type: "number", width: 150 },
    { field: "extraWages", headerName: "Extra Wages", type: "number", width: 150 },
    { field: "commission", headerName: "Extra Wages", type: "number", flex: 1, minWidth: 150 },
    CommonActionColumn({
      active: (row) => editEmployee({ userId: row?._id, companyId: row?.companyId, isActive: !row.isActive }),
      editRoute: ROUTES.EMPLOYEE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allEmployee,
    rowCount: totalRows,
    loading: employeeDataLoading || employeeDataFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.EMPLOYEE.BASE} />
      <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Employee;
