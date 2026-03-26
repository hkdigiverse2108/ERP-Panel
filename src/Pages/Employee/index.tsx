import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AppGridColDef, EmployeeBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";

const Employee = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.USER.BASE);

  const { data: employeeData, isLoading: employeeDataLoading, isFetching: employeeDataFetching } = Queries.useGetEmployee({ ...params });
  const { mutate: deleteEmployeeMutate, isPending: isDeleteLoading } = Mutations.useDeleteEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const allEmployee = useMemo(() => employeeData?.data?.user_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [employeeData]);
  const totalRows = employeeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEmployeeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.USERS.ADD_EDIT);

  const columns: AppGridColDef<EmployeeBase>[] = [
    { field: "username", headerName: "User Name", type: "string", width: 200 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    CommonPhoneColumns<EmployeeBase>("phoneNo", { headerName: "Phone No", width: 200 }),
    { field: "panNumber", headerName: "PAN Number", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<EmployeeBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<EmployeeBase>({
            ...(permission?.edit && {
              permissionRoute: ROUTES.USERS.PERMISSION_ADD_EDIT,
              active: (row) => editEmployee({ userId: row?._id, companyId: row?.companyId?._id, isActive: !row.isActive }),
              editRoute: ROUTES.USERS.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allEmployee,
    rowCount: totalRows,
    loading: employeeDataLoading || employeeDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.USER.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USERS.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Employee;
