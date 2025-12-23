import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";

const Branch = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params } = useDataGrid();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetBranch(params);
  const { mutate: deleteBranchMutate } = Mutations.useDeleteBranch();

  const allBranches = useMemo(() => branchData?.data?.branch_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBranchMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: GridColDef<BranchBase>[] = [
    { field: "name", headerName: "Branch Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    {
      field: "isActive",
      headerName: "is Active",
      flex: 1,
      renderCell: (params) => <span className={`font-semibold ${params?.value == true ? "text-green-600" : "text-red-600"}`}>{params?.value?.toString()}</span>,
    },
    CommonActionColumn({
      editRoute: ROUTES.BRANCH.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BRANCH.BASE} />
      <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
        <CommonCard title={PAGE_TITLE.BRANCH.BASE} btnHref={ROUTES.BRANCH.ADD_EDIT}>
          <CommonDataGrid BoxClass="rounded-md overflow-hidden" columns={columns} rows={allBranches} rowCount={totalRows} loading={branchDataLoading || branchDataFetching} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Branch;
