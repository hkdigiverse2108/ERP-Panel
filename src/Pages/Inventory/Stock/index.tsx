import { Grid, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";

import { CommonCard, CommonDataGrid } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
// import { ROUTES } from "../../../Constants";

const Stocks = () => {


  //  DATAGRID HOOK 
  const {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    filterModel,
    setFilterModel,
  } = useDataGrid({ page: 0, pageSize: 10 });

  //  STOCK DATA
  const rows = [
    {
      id: 1,
      itemCode: "STK001",
      category: "Cake",
      brand: "FreshBake",
      name: "Chocolate Cake",
      mrp: 500,
      sellingPrice: 450,
      hsn: "1905",
      availableQty: 20,
      status: "In Stock",
    },
    {
      id: 2,
      itemCode: "STK002",
      category: "Bread",
      brand: "DailyFresh",
      name: "Brown Bread",
      mrp: 60,
      sellingPrice: 55,
      hsn: "1905",
      availableQty: 20,
      status: "In Stock",
    },
    {
      id: 3,
      itemCode: "STK003",
      category: "cupcake",
      brand: "DailyFresh",
      name: "Brown Bread",
      mrp: 45,
      sellingPrice: 40,
      hsn: "1905",
      availableQty: 80,
      status: "In Stock",
    },
    {
      id: 4,
      itemCode: "STK004",
      category: "Bread",
      brand: "DailyFresh",
      name: "Brown Bread",
      mrp: 60,
      sellingPrice: 55,
      hsn: "1905",
      availableQty: 0,
      status: "Out of Stock",
    },
  ];

  //  COLUMNS 
  const columns = [
    {
      field: "id",
      headerName: "Sr No",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "itemCode", headerName: "Item Code", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "mrp", headerName: "MRP", flex: 1 },
    { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
    { field: "hsn", headerName: "HSN", flex: 1 },
    { field: "availableQty", headerName: "Available Qty", flex: 1 },
    {
      field: "status",
      headerName: "Stock Status",
      flex: 1,
      renderCell: (params: any) => (
        <span
          style={{
            color: params.value === "In Stock" ? "green" : "red",
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];

  //  RENDER 
  return (
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      <CommonCard title="Stocks">
        <CommonDataGrid
          columns={columns}
          rows={rows}
          rowCount={rows.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          pageSizeOptions={[5, 10, 25]}
        />
      </CommonCard>
    </Box>
  );
};

export default Stocks;
