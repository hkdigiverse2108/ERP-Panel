import { Grid, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonButton } from "../../../Attribute";
import { CommonCard, CommonDataGrid } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
import { ROUTES } from "../../../Constants";

const Product = () => {
  const navigate = useNavigate();

  // ================== STATE ==================
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    category: "",
    subCategory: "",
    brand: "",
    subBrand: "",
    hsn: "",
    purchaseTax: "",
    productType: "",
  });

  //  DATAGRID HOOK
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  // TABLE DATA (BAKERY) 
  const rows = [
    {
      id: 1,
      itemCode: "BAK001",
      category: "Cake",
      brand: "FreshBake",
      name: "Chocolate Cake",
      mrp: 500,
      sellingPrice: 450,
      hsn: "1905",
      qty: 20,
      status: "Active",
    },
    {
      id: 2,
      itemCode: "BAK002",
      category: "Bread",
      brand: "DailyFresh",
      name: "Brown Bread",
      mrp: 60,
      sellingPrice: 55,
      hsn: "1905",
      qty: 50,
      status: "Inactive",
    },
  ];

  // FUNCTIONS
  const handleAdd = () => {
    navigate(ROUTES.PRODUCT.ADD_EDIT);
  };

  const handleEdit = (row) => {
    navigate(ROUTES.PRODUCT.ADD_EDIT.replace(":id", row.id), { state: { data: row } });
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    console.log("Deleted Product:", selectedRow);
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
    { field: "itemCode", headerName: "Item Code", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "mrp", headerName: "MRP", flex: 1 },
    { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
    { field: "hsn", headerName: "HSN", flex: 1 },
    { field: "qty", headerName: "Qty", flex: 1 },
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

  //  TOP FILTER SECTION 
  const filterFields = ["Department", "Category", "Sub Category", "Brand", "Sub Brand", "HSN", "Purchase Tax", "Product Type"];

  const topContent = (
    <Grid container spacing={2} alignItems="center">
      {/* {filterFields.map((label) => (
        <Grid item xs={12} sm={6} md={3} key={label}>
          <TextField select fullWidth size="small" label={label} value="">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Sample">Sample</MenuItem>
          </TextField>
        </Grid>
      ))} */}

      <Grid size="auto">
        <CommonButton variant="contained" color="primary" size="medium" title="ADD" onClick={handleAdd} sx={{ px: 4, fontSize: "0.9rem" }} />
      </Grid>
    </Grid>
  );

  //  RENDER 
  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Bakery Products" topContent={topContent}>
        <CommonDataGrid columns={columns} rows={rows} rowCount={rows.length} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
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

export default Product;
