import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { JournalVoucherBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";

const JournalVoucher = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
    const navigate = useNavigate();
    const permission = usePagePermission(PAGE_TITLE.ACCOUNTING.JOURNAL_VOUCHER.BASE);

    const { data: journalVoucherData, isLoading: journalVoucherDataLoading, isFetching: journalVoucherDataFetching } = Queries.useGetJournalVoucher(params);

    const { mutate: deleteJournalVoucherMutate } = Mutations.useDeleteJournalVoucher();
    const { mutate: editJournalVoucher, isPending: isEditLoading } = Mutations.useEditJournalVoucher();

    const allJournalVouchers = useMemo(() => journalVoucherData?.data?.journalVoucher_data?.map((journalVoucher) => ({ ...journalVoucher, id: journalVoucher?._id })) || [], [journalVoucherData]);
    const totalRows = journalVoucherData?.data?.totalData || 0;

    const handleDeleteBtn = () => {
        if (!rowToDelete) return;
        deleteJournalVoucherMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
    };

    const handleAdd = () => navigate(ROUTES.ACCOUNTING.JOURNAL_VOUCHER.ADD_EDIT);

    const columns: GridColDef<JournalVoucherBase>[] = [
        { field: "paymentNo", headerName: "Payment No", width: 150 },
        { field: "date", headerName: "Date", width: 120, renderCell: (params) => FormatDate(params.row.date) },
        { field: "totalDebit", headerName: "Total Debit", width: 150 },
        { field: "totalCredit", headerName: "Total Credit", width: 150 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
        ...(permission?.edit || permission?.delete
            ? [
                CommonActionColumn<JournalVoucherBase>({
                    ...(permission?.edit && {
                        active: (row) => editJournalVoucher({ journalVoucherId: row?._id as string, isActive: !row.isActive }),
                        editRoute: ROUTES.ACCOUNTING.JOURNAL_VOUCHER.ADD_EDIT,
                    }),
                    ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.paymentNo }) }),
                }),
            ]
            : []),
    ];

    const CommonDataGridOption = {
        columns,
        rows: allJournalVouchers,
        rowCount: totalRows,
        loading: journalVoucherDataLoading || journalVoucherDataFetching || isEditLoading,
        isActive,
        setActive,
        ...(permission?.add && { handleAdd }),
        paginationModel,
        onPaginationModelChange: setPaginationModel,
        sortModel,
        onSortModelChange: setSortModel,
        filterModel,
        onFilterModelChange: setFilterModel,
    };

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNTING.JOURNAL_VOUCHER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.JOURNAL_VOUCHER.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
                <CommonCard hideDivider>
                    <CommonDataGrid {...CommonDataGridOption} />
                </CommonCard>
                <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
            </Box>
        </>
    );
};

export default JournalVoucher;
