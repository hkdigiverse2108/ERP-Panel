import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import {
  CommonActionColumn,
  CommonBreadcrumbs,
  CommonCard,
  CommonDataGrid,
  CommonDeleteModal,
} from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setCategoryModal } from "../../../Store/Slices/ModalSlice";
import { useDataGrid } from "../../../Utils/Hooks";
import CategoryForm from "./CategoryForm";
import type { AppGridColDef, CategoryBase } from "../../../Types";

const Category = () => {
  const {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    filterModel,
    setFilterModel,
    rowToDelete,
    setRowToDelete,
    isActive,
    setActive,
    params,
  } = useDataGrid();
  const dispatch = useDispatch();

  const {
    data: CategorysData,
    isLoading: CategorysDataLoading,
    isFetching: CategorysDataFetching,
  } = Queries.useGetCategory(params);
  const { mutate: deleteCategorysMutate } = Mutations.useDeleteCategory();
  const { mutate: editCategory, isPending: isEditLoading } =
    Mutations.useEditCategory();

  const allCategorys = useMemo(
    () =>
      CategorysData?.data?.category_data.map((Category) => ({
        ...Category,
        id: Category?._id,
      })) || [],
    [CategorysData]
  );
  const totalRows = CategorysData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCategorysMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => {
    dispatch(setCategoryModal({ open: true, data: null }));
  };

  const handleEdit = (row: CategoryBase) => {
    dispatch(setCategoryModal({ open: true, data: row }));
  };

  const columns: AppGridColDef<CategoryBase>[] = [
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: ({ value }) =>
        value ? <img src={value} style={{ width: 40 }} /> : "-",
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "parentCategoryId",
      headerName: "parent Category",
      flex: 1,
      renderCell: ({ value }) =>
        typeof value === "object" ? value?.name || "-" : value,
      exportFormatter: (value) =>
        typeof value === "object" && value !== null
          ? (value as { name?: string })?.name || "-"
          : "-",
    },
    CommonActionColumn({
      active: (row) =>
        editCategory({ categoryId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCategorys,
    rowCount: totalRows,
    loading: CategorysDataLoading || CategorysDataFetching || isEditLoading,
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
      <CommonBreadcrumbs
        title={PAGE_TITLE.INVENTORY.CATEGORY.BASE}
        maxItems={1}
        breadcrumbs={BREADCRUMBS.CATEGORY.BASE}
      />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal
          open={Boolean(rowToDelete)}
          itemName={rowToDelete?.title}
          onClose={() => setRowToDelete(null)}
          onConfirm={() => handleDeleteBtn()}
        />
        <CategoryForm />
      </Box>
    </>
  );
};

export default Category;
