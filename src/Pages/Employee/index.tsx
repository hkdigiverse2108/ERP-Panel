import { Grid, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid } from "../../Components/Common";
import { useDataGrid } from "../../Utils/Hooks";
import { ROUTES } from "../../Constants";
import { CommonButton } from "../../Attribute";


const Employee = () => {
  const navigate = useNavigate();

  //  STATE
 
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  //  DATAGRID HOOK 
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  // TABLE DATA 
  const rows = [
    { id: 1, name: "Kenil", email: "kenil@gmail.com", status: "Active" },
    { id: 2, name: "Amit", email: "amit@gmail.com", status: "Inactive" },
    { id: 3, name: "Priya", email: "priya@gmail.com", status: "Active" },
    { id: 4, name: "Rohan", email: "rohan@gmail.com", status: "Inactive" },
    { id: 5, name: "Sneha", email: "sneha@gmail.com", status: "Active" },
    { id: 6, name: "Divya", email: "divya@gmail.com", status: "Inactive" },
    { id: 7, name: "Mehul", email: "mehul@gmail.com", status: "Active" },
    { id: 8, name: "Varun", email: "varun@gmail.com", status: "Inactive" },
    { id: 9, name: "Harsh", email: "harsh@gmail.com", status: "Active" },
    { id: 10, name: "Rita", email: "rita@gmail.com", status: "Inactive" },
  ];

  // FUNCTIONS //

  const handleAdd = () => {
    navigate(ROUTES.EMPLOYEE.ADDEDIT); 
  };
  const handleEdit = (row) => {
    console.log("row id :L", row);
    navigate(`${ROUTES.EMPLOYEE.ADDEDIT.replace(":id", row?.id)}`, { state: { data: row } });
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    console.log("Deleted Row:", selectedRow);
    setOpenDelete(false);
  };

  // COLUMNS //
  const columns = [
    {
      field: "id",
      headerName: "Sr No",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Active" ? "green" : "red",
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <IconButton color="primary" size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Grid>
         <Grid size="auto">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  //  TOP SECTION 
  const topContent = (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 0, p: 0 }}>
      <Grid size="auto">
       <CommonButton variant="contained" color="primary" size="medium" title="ADD" onClick={handleAdd} sx={{ px: 4, fontSize: "0.9rem" }} />
      </Grid>
    </Grid>
  );

  //  RENDER 
  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Employees" topContent={topContent} sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, borderRadius: 3 }}>
        <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={rows} rowCount={rows.length} loading={false} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
      </CommonCard>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: 'red' }}>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete "{selectedRow?.name}"?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>No</Button>
          <Button color="error" onClick={confirmDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employee;
