import { Grid, Box, IconButton, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid, CommonModal } from "../../Components/Common";
import { useDataGrid } from "../../Utils/Hooks";
import { KEYS, ROUTES } from "../../Constants";
import { Mutations, Queries } from "../../Api";
import { useQueryClient } from "@tanstack/react-query";

const Employee = () => {
  const queryClient = useQueryClient();

  const [rawToDelete, setRawToDelete] = useState<any>(null);

  const { data: employeeData, isLoading: employeeDataLoading } = Queries.useGetAllEmployeeData();
  const { mutate: deleteEmployeeMutate } = Mutations.useDeleteEmployee();

  const allEmployee = useMemo(() => {
    return employeeData?.data?.employee_data.map((emp: any) => ({ ...emp, id: emp?._id })) || [];
  }, [employeeData]);

  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  const handleDeleteBtn = () => {
    deleteEmployeeMutate(rawToDelete?._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: KEYS.EMPLOYEE.ALL });
        setRawToDelete(null);
      },
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
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
      renderCell: (params: any) => (
        <span
          style={{
            color: params?.value == true ? "green" : "red",
            fontWeight: 500,
          }}
        >
          {params?.value?.toString()}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <Link to={ROUTES.EMPLOYEE.ADD_EDIT} state={{ data: params.row }}>
              <IconButton color="primary" size="small">
                <EditIcon />
              </IconButton>
            </Link>
          </Grid>

          <Grid size="auto">
            <IconButton color="error" size="small" onClick={() => setRawToDelete(params?.row)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  const topContent = (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 0, p: 0 }}>
      <Grid size="auto">
        <Link to={ROUTES.EMPLOYEE.ADD_EDIT}>
          <Button variant="contained" color="primary" size="large" sx={{ px: 4, fontSize: "0.9rem" }}>
            ADD
          </Button>
        </Link>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Employees" topContent={topContent}>
        <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allEmployee} rowCount={allEmployee.length} loading={employeeDataLoading} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
      </CommonCard>

      <CommonModal isOpen={Boolean(rawToDelete)} onClose={() => setRawToDelete(null)} className="max-w-125 m-2 sm:m-5 pt-0!">
        <p className="text-red-500 text-2xl mb-4 font-semibold  ">Confirm Delete</p>
        <p className="my-3">Are you sure you want to delete "{rawToDelete?.username}"?</p>
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
