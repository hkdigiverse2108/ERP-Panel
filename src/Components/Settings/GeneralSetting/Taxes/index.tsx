import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import { setTaxModal } from "../../../../Store/Slices/ModalSlice";
import type { AppGridColDef, TaxBase } from "../../../../Types";
import { useDataGrid, usePagePermission } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import TaxForm from "./TaxForm";
import { CommonObjectPropertyColumn } from "../../../Common/CommonDataGrid/CommonColumns";

const Taxes = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.TAX.BASE);

  const { data: TaxData, isLoading: TaxDataLoading, isFetching: TaxDataFetching } = Queries.useGetTax(params);
  const { mutate: deleteTaxMutate } = Mutations.useDeleteTax();
  const { mutate: editTax, isPending: isEditLoading } = Mutations.useEditTax();

  const allRows = useMemo(() => TaxData?.data?.tax_data.map((Tax) => ({ ...Tax, id: Tax?._id })) || [], [TaxData]);
  const totalRows = TaxData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteTaxMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setTaxModal({ open: true, data: null }));

  const handleEdit = (row: TaxBase) => dispatch(setTaxModal({ open: true, data: row }));

  const actionColumn = useMemo(() => {
    const baseCol = CommonActionColumn<TaxBase>({
      ...(permission?.edit && { active: (row) => editTax({ taxId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
      ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
    });
    return {
      ...baseCol,
      renderCell: (params: any) => (params.row?.companyId ? baseCol.renderCell!(params) : null),
    };
  }, [editTax, handleEdit, setRowToDelete]);

  const columns: AppGridColDef<TaxBase>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 }, //
    { field: "percentage", headerName: "Percentage", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<TaxBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete ? [actionColumn] : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: TaxDataLoading || TaxDataFetching || isEditLoading,
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
    fileName: PAGE_TITLE.SETTINGS.TAX.BASE,
  };

  return (
    <Box sx={{ display: "grid" }}>
      <CommonCard title={PAGE_TITLE.SETTINGS.TAX.TITLE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <TaxForm />
    </Box>
  );
};

export default Taxes;
