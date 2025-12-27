import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { ProductBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, params } = useDataGrid();

  const navigate = useNavigate();

  const { data: productData, isLoading: productLoading, isFetching: productFetching } = Queries.useGetProduct(params);
  const { mutate: deleteProductMutate } = Mutations.useDeleteProduct();
  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const allProducts = useMemo(() => productData?.data?.product_data.map((prod: { _id: any; }) => ({ ...prod, id: prod?._id })) || [], [productData]);

  const totalRows = productData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteProductMutate(rowToDelete?._id as string , { onSuccess: () => setRowToDelete(null)});
  };

  const handleAdd = () => navigate(ROUTES.PRODUCT.ADD_EDIT);

  const columns: GridColDef<ProductBase>[] = [
    { field: "itemCode", headerName: "itemCode", width: 200 },
    { field: "printName", headerName: "printName", width: 150 },
    { field: "description", headerName: "description0.  ", width: 180 },
    { field: "hsnCode", headerName: "hsnCode",  width: 160 },
    { field: "name", headerName: "Product Name", type: "number", width: 140 },
    { field: "uomId", headerName: "uomId", type: "number", width: 200 },
    { field: "mrp", headerName: "mrp", type: "number", width: 120 },
    { field: "sellingPrice", headerName: "sellingPrice", type: "number", width: 120 },
    { field: "gst", headerName: "gst", type: "number", width: 120 },
    CommonActionColumn({
      active: (row) =>editProduct({ productId: row?._id,companyId: row?.companyId,isActive: !row.isActive,}),
      editRoute: ROUTES.PRODUCT.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }), 
  ];

  const CommonDataGridOptions = {   
    columns,
    rows: allProducts,
    rowCount: totalRows,
    loading: productLoading || productFetching || isEditLoading,
    isActive,
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
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.BASE} />

      <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOptions } />    </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Product;
