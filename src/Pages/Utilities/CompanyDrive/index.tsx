import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setCompanyDriveModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, CompanyDrive } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import CompanyDriveForm from "./CompanyDriveForm";

const CompanyDrivePage = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.COMPANY_DRIVE.BASE);

  const { data: companyDriveData, isLoading, isFetching } = Queries.useGetCompanyDrive(params);
  const { mutate: deleteCompanyDrive, isPending: isDeleteLoading } = Mutations.useDeleteCompanyDrive();
  const { mutate: editCompanyDrive, isPending: isEditLoading } = Mutations.useEditCompanyDrive();

  const allCompanyDrive = useMemo(() => companyDriveData?.data.companyDrive_data.map((drive) => ({ ...drive, id: drive._id })) || [], [companyDriveData]);
  const totalRows = companyDriveData?.data.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCompanyDrive(rowToDelete._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setCompanyDriveModal({ open: true, data: null }));

  const handleEdit = (row: CompanyDrive) => dispatch(setCompanyDriveModal({ open: true, data: row }));

  const columns: AppGridColDef<CompanyDrive>[] = [
    { field: "documentName", headerName: "Document Name", width: 220 },
    {field: "documentUrl",headerName: "Document",minWidth: 240,
      renderCell: ({ row }) => {
        if (!row.documentUrl) return "-"; const parts = row.documentUrl.split("?")[0].split("/").filter(Boolean); const fileName = parts[parts.length - 1] || "-";
        return (<span className="text-blue-600 underline cursor-pointer" onClick={() => window.open(row.documentUrl, "_blank")}>{fileName}</span> );
      },
    },
    { field: "remark", headerName: "Remarks", flex: 1, minWidth: 220 },
    ...(permission?.edit || permission?.delete
      ? [CommonActionColumn<CompanyDrive>({
        ...(permission?.edit && {
          onEdit: { handleEdit: (row) => handleEdit(row) },
          active: (row) => editCompanyDrive({ documentId: row._id, isActive: !row.isActive }),
        }),
        ...(permission?.delete && {
          onDelete: (row) => setRowToDelete({ _id: row._id, title: row.documentName }),
        }),
      }),] : []),
  ];
  const CommonDataGridOption = {
    columns,
    rows: allCompanyDrive,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.COMPANY_DRIVE.BASE} maxItems={3} breadcrumbs={BREADCRUMBS.UTILITIES.COMPANY_DRIVE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} loading={isDeleteLoading} itemName={rowToDelete?.title || ""} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
        <CompanyDriveForm />
      </Box>
    </>
  );
};

export default CompanyDrivePage;
