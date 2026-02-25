import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AccountGroupBase, AppGridColDef } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";

const AccountGroup = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();
    const navigate = useNavigate();

    const { data: accountGroupData, isLoading: accountGroupDataLoading, isFetching: accountGroupDataFetching } = Queries.useGetAccountGroup(params);

    const allAccountGroup = useMemo(() => accountGroupData?.data?.accountGroup_data.map((AccountGroup) => ({ ...AccountGroup, id: AccountGroup?._id })) || [], [accountGroupData]);
    const totalRows = accountGroupData?.data?.totalData || 0;

    const columns: AppGridColDef<AccountGroupBase>[] = [
        { field: "name", headerName: "Group Name", width: 350 },
        { field: "nature", headerName: "Group nature", width: 350 },
        CommonObjectPropertyColumn<AccountGroupBase>("parentGroupName", "parentGroupId", "name", { headerName: "Parent Group", width: 300 }),
        CommonObjectPropertyColumn<AccountGroupBase>("parentGroupNature", "parentGroupId", "nature", { headerName: "Parent Nature", flex: 1, minWidth: 300 }),
    ];

    const CommonDataGridOption = {
        columns,
        rows: allAccountGroup,
        rowCount: totalRows,
        loading: accountGroupDataLoading || accountGroupDataFetching,
        fileName: "Account Group",
        isActive,
        setActive,
        paginationModel,
        onPaginationModelChange: setPaginationModel,
        sortModel,
        onSortModelChange: setSortModel,
        filterModel,
        onFilterModelChange: setFilterModel,
    };

    const topContent = (
        <Grid size={"auto"}>
            <CommonButton variant="contained" title="View Tree" size="small" onClick={() => navigate(ROUTES.ACCOUNTING.ACCOUNT_GROUP.TREE)} />
        </Grid>
    );

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.ACCOUNT_GROUP.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT_GROUP.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
                <CommonCard topContent={topContent} gridClass="justify-end!">
                    <CommonDataGrid {...CommonDataGridOption} />
                </CommonCard>
            </Box>
        </>
    );
};

export default AccountGroup;
