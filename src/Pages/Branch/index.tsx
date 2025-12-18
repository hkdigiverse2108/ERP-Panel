import { Grid, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid } from "../../Components/Common";
import { useDataGrid } from "../../Utils/Hooks";
import { ROUTES } from "../../Constants";
import { CommonButton } from "../../Attribute";

const Branch = () => {
  const navigate = useNavigate();

  //  STATE 
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  //  DATAGRID HOOK 
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  //  TABLE DATA 
  const rows = [
    { id: 1, name: "Ahmedabad Branch", address: "SG Highway, Ahmedabad" },
    { id: 2, name: "Mumbai Branch", address: "Andheri East, Mumbai" },
    { id: 3, name: "Delhi Branch", address: "Connaught Place, Delhi" },
    { id: 4, name: "Pune Branch", address: "Hinjewadi, Pune" },
    { id: 5, name: "Bangalore Branch", address: "Whitefield, Bangalore" },
  ];

  //  FUNCTIONS 
  const handleAdd = () => {
    navigate(ROUTES.BRANCH.EDIT);
  };

  const handleEdit = (row) => {
    navigate(`${ROUTES.BRANCH.EDIT}`, { state: { data: row } });
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    console.log("Deleted Branch:", selectedRow);
    setOpenDelete(false);
  };

  //  COLUMNS 
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
    { field: "name", headerName: "Branch Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
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
    <Grid container spacing={2} alignItems="center">
      <Grid size="auto">
        <CommonButton variant="contained" color="primary" size="medium" title="ADD" onClick={handleAdd} sx={{ px: 4, fontSize: "0.9rem" }} />
         {/* <CommonButton type="submit" variant="contained" title="Send" size="medium" fullWidth grid={{ xs: 12 }} /> */}
      </Grid>
    </Grid>
  );

  //  RENDER 
  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Branches" topContent={topContent} sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, borderRadius: 3 }}>
        <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={rows} rowCount={rows.length} loading={false} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
      </CommonCard>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
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

export default Branch;
