import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonActionColumn } from "../../../Components/Common";
import { Mutations, Queries } from "../../../Api";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BankBreadCrumbs } from "../../../Data";
import { useDataGrid } from "../../../Utils/Hooks";
import type { AppGridColDef } from "../../../Types";
import type { BankBase } from "../../../Types/Bank";

const Bank = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const [value, setValue] = useState<string[]>([]);

  const { data: bankData, isLoading, isFetching } = Queries.useGetBank(params);
  const { mutate: deleteBankMutate } = Mutations.useDeleteBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();

 
  const allBanks = useMemo(
    () =>
      bankData?.data?.bank_data?.map((bank) => ({
        ...bank,
        id: bank?._id,
      })) || [],
    [bankData]
  );

  const totalRows = bankData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBankMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.BANK.ADD_EDIT);

  const columns: AppGridColDef<BankBase>[] = [
    {
      field: "bankName", headerName: "Bank Name",  width: 180,
    },
    {
      field: "location", headerName: "Location", width: 150,
    },
    {
      field: "accountHolderName", headerName: "Account Holder Name",width: 200,
    },
    {
      field: "accountNumber",
      headerName: "Account No.",
      width: 160,
      renderCell: (params) => {
        const value = params.value || "";
        return `XXXX${value.slice(-4)}`;
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 250,
    
    },
    CommonActionColumn({
      active: (row) =>
        editBank({
          _id: row?._id,
          isActive: !row.isActive,
          bankName: "",
          ifscCode: "",
          branchName: "",
          accountHolderName: "",
          bankAccountNumber: "",
          country: "",
          state: "",
          city: "",
          bankId: ""
        }),
      editRoute: ROUTES.BANK.ADD_EDIT,
      onDelete: (row) =>
        setRowToDelete({
          _id: row?._id,
          title: row?.bankName,
        }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBanks,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.BASE} maxItems={1} breadcrumbs={BankBreadCrumbs} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Bank;
