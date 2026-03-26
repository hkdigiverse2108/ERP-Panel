import { Box, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonTabPanel } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, LoyaltyBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import PointSetup from "./PointSetup";

const Loyalty = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CRM.LOYALTY.BASE);

  const { data: loyaltyData, isLoading: loyaltyDataLoading, isFetching: loyaltyDataFetching } = Queries.useGetLoyalty({ ...params });
  const { mutate: deleteLoyaltyMutate, isPending: isDeleteLoading } = Mutations.useDeleteLoyalty();
  const { mutate: editLoyalty, isPending: isEditLoading } = Mutations.useEditLoyalty();

  const allLoyalty = useMemo(() => loyaltyData?.data?.loyalty_data.map((item) => ({ ...item, id: item?._id })) || [], [loyaltyData]);
  const totalRows = loyaltyData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteLoyaltyMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.LOYALTY.ADD_EDIT);

  const columns: AppGridColDef<LoyaltyBase>[] = [
    { field: "name", headerName: "Campaign Name", flex: 1, minWidth: 170 },
    { field: "discountValue", headerName: "Discount Value", flex: 1, minWidth: 120 },
    { field: "minimumPurchaseAmount", headerName: "Minimum Purchase Amount", flex: 1, minWidth: 150 },
    { field: "redemptionPoints", headerName: "Redemption Points", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<LoyaltyBase>("type", "type", [], { headerName: "Type", flex: 1, minWidth: 100, type: "format" }),
    { field: "usageLimit", headerName: "Usage Limit", flex: 1, minWidth: 100 },
    { field: "usedCount", headerName: "Used Count", flex: 1, minWidth: 100 },
    CommonObjectPropertyColumn<LoyaltyBase>("campaignExpiryDate", "campaignExpiryDate", [], { headerName: "Expiry Date", flex: 1, minWidth: 100, type: "date" }),
    CommonObjectPropertyColumn<LoyaltyBase>("campaignLaunchDate", "campaignLaunchDate", [], { headerName: "Launch Date", flex: 1, minWidth: 100, type: "date" }),
    CommonObjectPropertyColumn<LoyaltyBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<LoyaltyBase>({
            ...(permission?.edit && {
              active: (row) => editLoyalty({ loyaltyId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.LOYALTY.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allLoyalty,
    rowCount: totalRows,
    loading: loyaltyDataLoading || loyaltyDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.CRM.LOYALTY.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.LOYALTY.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.LOYALTY.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Campaign" />
              <Tab label="Point Setup" />
            </Tabs>
          </Box>
          <CommonTabPanel value={tabValue} index={0}>
            <CommonDataGrid {...CommonDataGridOption} />
          </CommonTabPanel>
          <CommonTabPanel value={tabValue} index={1}>
            <PointSetup />
          </CommonTabPanel>
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Loyalty;
