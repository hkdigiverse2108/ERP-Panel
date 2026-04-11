import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, MaterialConsumptionBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";
import { CommonDateRangeSelector } from "../../../Attribute";

const MaterialConsumption = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE);
  const { company } = useAppSelector((state) => state.company);
  const [fyStart, fyEnd] = company?.financialYear ? company.financialYear.split(" - ") : [];
  const [range, setRange] = useState({ start: DateConfig.utc(fyStart) ?? DateConfig.utc().startOf("day"), end: DateConfig.utc(fyEnd) ?? DateConfig.utc().endOf("day") });

  const { data: materialConsumptionData, isLoading: materialConsumptionDataLoading, isFetching: materialConsumptionDataFetching } = Queries.useGetMaterialConsumption({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
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
    CommonObjectPropertyColumn<MaterialConsumptionBase>("consumptionTypeId", "consumptionTypeId", ["name"], { headerName: "Type", width: 150 }),
    { field: "totalQty", type: "number", headerName: "Total Qty", width: 150, isSummary: true },
    { field: "totalAmount", type: "number", headerName: "Total Amount", width: 150, isSummary: true },
    CommonObjectPropertyColumn<MaterialConsumptionBase>("date", "date", [], { headerName: "Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<MaterialConsumptionBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),
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

  const children = (
    <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
    </Grid>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MATERIAL_CONSUMPTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} children={children} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default MaterialConsumption;
