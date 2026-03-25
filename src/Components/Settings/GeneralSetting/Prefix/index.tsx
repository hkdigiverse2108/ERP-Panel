import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import { setPrefixModal } from "../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PrefixBase } from "../../../../Types";
import { useDataGrid, usePagePermission } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import PrefixForm from "./PrefixForm";

const Prefix = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.PREFIX.BASE);

  const { data: prefixData, isLoading: prefixDataLoading, isFetching: prefixDataFetching } = Queries.useGetPrefix(params);
  const { mutate: deletePrefixMutate, isPending: isDeleteLoading } = Mutations.useDeletePrefix();
  const { mutate: editPrefix, isPending: isEditLoading } = Mutations.useEditPrefix();

  const allRows = useMemo(() => prefixData?.data?.prefix_data.map((item) => ({ ...item, id: item?._id })) || [], [prefixData]);
  const totalRows = prefixData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePrefixMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setPrefixModal({ open: true, data: null }));

  const handleEdit = (row: PrefixBase) => dispatch(setPrefixModal({ open: true, data: row }));

  const columns: AppGridColDef<PrefixBase>[] = [
    { field: "type", headerName: "Prefix Type", flex: 1, minWidth: 200 }, //
    { field: "prefix", headerName: "Prefix", flex: 1, minWidth: 200 },
    { field: "sequenceNo", headerName: "Sequence No.", flex: 1, minWidth: 200 },
    { field: "length", headerName: "Length", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PrefixBase>({
            ...(permission?.edit && { active: (row) => editPrefix({ prefixId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: prefixDataLoading || prefixDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    isExport: false,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.PREFIX.BASE,
  };

  return (
    <Box sx={{ display: "grid" }}>
      <CommonCard title={PAGE_TITLE.SETTINGS.PREFIX.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <PrefixForm />
    </Box>
  );
};

export default Prefix;
