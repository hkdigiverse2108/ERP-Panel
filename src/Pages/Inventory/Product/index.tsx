import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Queries } from "../../../Api";
import { CommonRadio } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_NOTIFICATION_TYPE } from "../../../Data";
import type { AppGridColDef, ProductBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";

const Product = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const [productType, setProductType] = useState<string>("product");

  const { data: productData, isLoading: productDataLoading, isFetching: productDataFetching } = Queries.useGetProduct(params);

  const allProduct = useMemo(() => productData?.data?.product_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [productData]);
  const totalRows = productData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.PRODUCT.ADD_EDIT);

  const columns: AppGridColDef<ProductBase>[] = [
    { field: "images", headerName: "images", width: 170 },
    { field: "categoryId", headerName: "Category", width: 170 },
    { field: "brandId", headerName: "Brand", width: 240 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mrp", headerName: "MRP", width: 150 },
    { field: "sellingPrice", headerName: "Selling Price", width: 150 },
    { field: "hsnCode", headerName: "HSN", width: 150 },
    { field: "openingQty", headerName: "Opening Qty", flex: 1, minWidth: 150 },
  ];

  const CommonDataGridOption = {
    columns,
    rows: allProduct,
    rowCount: totalRows,
    loading: productDataLoading || productDataFetching,
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
  const topContent = (
    <>
      <CommonRadio value={productType} onChange={setProductType} options={PRODUCT_NOTIFICATION_TYPE} />
    </>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default Product;
