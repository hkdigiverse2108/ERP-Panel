import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";
import type { BillOfLiveProductBase } from "../../../Types/BillOfMaterials";

const BillOfMaterials = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();

  const { data, isLoading, isFetching } = Queries.useGetBillOfLiveProduct(params);

  const { mutate: deleteBOM } = Mutations.useDeleteBillOfLiveProduct();

  const { mutate: editBOM, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const rows = useMemo(() => {
    return (
      data?.data?.billOfLiveProduct_data.map((item) => ({
        ...item,
        id: item._id,

        createdByName: item.createdBy || "",
      })) || []
    );
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.BILLOFMATERIALS.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteBOM(rowToDelete._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<BillOfLiveProductBase>[] = [
    {
      field: "number",
      headerName: "Bill Of Materials No.",
      width: 220,
    },

    {
      field: "date",
      headerName: "Bill Of Materials Date",
      width: 220,
      valueGetter: (v) => FormatDate(v),
    },

    {
      field: "locationName",
      headerName: "Location",
      width: 220,
      flex: 1,
    },

    {
      field: "createdByName",
      headerName: "Created By",
      width: 220,
    },

    CommonActionColumn({
      active: (row) =>
        editBOM({
          billOfLiveProductId: row._id,
          isActive: !row.isActive,
        }),
      editRoute: ROUTES.BILLOFMATERIALS.ADD_EDIT,
      onDelete: (row) =>
        setRowToDelete({
          _id: row._id,
          title: row.number,
        }),
    }),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILLOFMATERIALS.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BILLOFMATERIALS.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default BillOfMaterials;
