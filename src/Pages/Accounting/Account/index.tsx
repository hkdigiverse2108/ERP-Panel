import { Box } from "@mui/material";
import { useMemo } from "react";
import { Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useDataGrid } from "../../../Utils/Hooks";
import type { AccountBase, AppGridColDef } from "../../../Types";

const Account = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();

    const { data: accountData, isLoading: accountLoading, isFetching: accountFetching } = Queries.useGetAccount(params);

    const allAccount = useMemo(() => accountData?.data?.account_data?.map((account) => ({ ...account, id: account?._id })) ?? [], [accountData]);

    const totalRows = accountData?.data?.totalData || 0;

    const columns: AppGridColDef<AccountBase>[] = [
        { field: "name", headerName: "Account Name", width: 350 },
        CommonObjectPropertyColumn<AccountBase>("GroupName", "groupId", "name", { headerName: "Group Name", width: 300 }),
        { field: "type", headerName: "Account Type", width: 200 },
        { field: "updatedAt", headerName: "UpdatedAt", width: 200, flex: 1 },
    ];

    const CommonDataGridOption = {
        columns,
        rows: allAccount,
        rowCount: totalRows,
        loading: accountLoading || accountFetching,
        fileName: "Accounts",
        isActive,
        setActive,
        paginationModel,
        onPaginationModelChange: setPaginationModel,
        sortModel,
        onSortModelChange: setSortModel,
        filterModel,
        onFilterModelChange: setFilterModel,
    };

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.ACCOUNT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
                <CommonCard hideDivider>
                    <CommonDataGrid {...CommonDataGridOption} />
                </CommonCard>
            </Box>
        </>
    );
};

export default Account;
