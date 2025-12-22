import { Grid, Box, IconButton, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../Components/Common";
import { useDataGrid } from "../../../Utils/Hooks";
import { KEYS, PAGE_TITLE, ROUTES } from "../../../Constants";
import { Mutations, Queries } from "../../../Api";
import { useQueryClient } from "@tanstack/react-query";
import { ProductBreadcrumbs } from "../../../Data";
import { CommonBreadcrumbs } from "../../../Components/Common";

const Product = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  const productParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: filterModel?.quickFilterValues?.[0],
    }),
    [paginationModel, filterModel]
  );

  const queryClient = useQueryClient();
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const { data: productData, isLoading } = Queries.useGetAllProductData(productParams);
  const { mutate: deleteProductMutate } = Mutations.useDeleteProduct();

  const allProducts = useMemo(() => {
    return (
      productData?.data?.product_data?.map((product: any) => ({
        ...product,
        id: product?._id,
      })) || []
    );
  }, [productData]);

  const totalRows = productData?.data?.totalData || 0;

  const handleDelete = () => {
    deleteProductMutate(rowToDelete?._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.PRODUCT.ALL] });
        setRowToDelete(null);
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
    { field: "itemCode", headerName: "Item Code", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "printName", headerName: "Print Name", flex: 1 },
    { field: "mrp", headerName: "MRP", flex: 1 },
    { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
    { field: "hsnCode", headerName: "HSN", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: any) => (
        <span
          style={{
            color: params.value === "active" ? "green" : "red",
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
      renderCell: (params: any) => (
        <Grid container spacing={1}>
          <Grid size="auto">
            <Link to={ROUTES.PRODUCT.ADD_EDIT} state={{ data: params.row }}>
              <IconButton color="primary" size="small">
                <EditIcon />
              </IconButton>
            </Link>
          </Grid>
          <Grid size="auto">
            <IconButton color="error" size="small" onClick={() => setRowToDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  const topContent = (
    <Grid container spacing={2} alignItems="center">
      <Grid size="auto">
        <Link to={ROUTES.PRODUCT.ADD_EDIT}>
          <Button variant="contained" color="primary" size="large" sx={{ px: 4, fontSize: "0.9rem" }}>
            ADD
          </Button>
        </Link>
      </Grid>
    </Grid>
  );

  return (

   <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE} maxItems={1} breadcrumbs={ProductBreadcrumbs} />

      <div className="m-4 md:m-6">
      <CommonCard title="Products" topContent={topContent}>
        <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allProducts} rowCount={totalRows} loading={isLoading} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
      </CommonCard>

      {/* Delete Confirmation */}
      <CommonModal isOpen={Boolean(rowToDelete)} onClose={() => setRowToDelete(null)} className="max-w-125 m-2 sm:m-5 pt-0!">
        <p className="text-red-500 text-2xl mb-4 font-semibold">Confirm Delete</p>
        <p className="my-3">Are you sure you want to delete "{rowToDelete?.name}"?</p>
        <div className="flex justify-end">
          <Button onClick={() => setRowToDelete(null)}>No</Button>
          <Button color="error" onClick={handleDelete}>
            Yes
          </Button>
        </div>
      </CommonModal>
      </div>
    </>
  );
};

export default Product;
