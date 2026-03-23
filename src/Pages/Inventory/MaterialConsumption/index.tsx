import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, MaterialConsumptionBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const MaterialConsumption = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE);

  const { data: materialConsumptionData, isLoading: materialConsumptionDataLoading, isFetching: materialConsumptionDataFetching } = Queries.useGetMaterialConsumption(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetMaterialConsumption({}, false);
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown();
  const { mutate: deleteMaterialConsumptionMutate, isPending: isDeleteLoading } = Mutations.useDeleteMaterialConsumption();
  const { mutate: editMaterialConsumption, isPending: isEditLoading } = Mutations.useEditMaterialConsumption();

  const allMaterialConsumptions = useMemo(() => materialConsumptionData?.data?.material_consumption_data.map((item) => ({ ...item, id: item?._id })) || [], [materialConsumptionData]);
  const totalRows = materialConsumptionData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteMaterialConsumptionMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT);

  const columns: AppGridColDef<MaterialConsumptionBase>[] = [
    { field: "number", headerName: "MC No.", width: 100 },
    CommonObjectPropertyColumn<MaterialConsumptionBase>("branchId", "branchId", ["name"], { headerName: "Branch", width: 200 }),
    CommonObjectPropertyColumn<MaterialConsumptionBase>("type", "type", [], { headerName: "Type", width: 150, type: "format" }),
    { field: "totalQty", type: "number", headerName: "Total Qty", width: 150, isSummary: true },
    { field: "totalAmount", type: "number", headerName: "Total Amount", width: 150, isSummary: true },
    CommonObjectPropertyColumn<MaterialConsumptionBase>("date", "date", [], { headerName: "Date", width: 120, type: "date" }),
    { field: "remark", headerName: "Remark", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<MaterialConsumptionBase>({
            ...(permission?.edit && {
              active: (row) => editMaterialConsumption({ materialConsumptionId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.number }) }),
          }),
        ]
      : []),
  ];

  const summary = useMemo(() => {
    return CalculateGridSummary(allMaterialConsumptions, ["totalQty", "totalAmount"]);
  }, [allMaterialConsumptions]);

  const CommonDataGridOption = {
    columns,
    rows: allMaterialConsumptions,
    rowCount: totalRows,
    loading: materialConsumptionDataLoading || materialConsumptionDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }), // branchFilter
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MATERIAL_CONSUMPTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default MaterialConsumption;
