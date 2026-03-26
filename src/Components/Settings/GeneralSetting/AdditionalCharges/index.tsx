import { useDataGrid, usePagePermission } from "../../../../Utils/Hooks";
import { PAGE_TITLE } from "../../../../Constants";
import { Mutations, Queries } from "../../../../Api";
import type { AdditionalChargesBase, AppGridColDef } from "../../../../Types";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import { useDispatch } from "react-redux";
import { setAdditionalChargeModal } from "../../../../Store/Slices/ModalSlice";
import AdditionalChargesForm from "./AdditionalChargesForm";
import { CommonObjectPropertyColumn } from "../../../Common/CommonDataGrid/CommonColumns";

const AdditionalCharges = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const { data: additional_charge_data, isLoading: additionalChargesDataLoading, isFetching: additionalChargesDataFetching } = Queries.useGetAdditionalCharges(params);

  const dispatch = useDispatch();
  const { mutate: deleteAdditionalChargesMutate, isPending: isDeleteLoading } = Mutations.useDeleteAdditionalCharges();
  const { mutate: editAdditionalCharges, isPending: isEditLoading } = Mutations.useEditAdditionalCharges();
  const allRows = additional_charge_data?.data?.additional_charge_data?.map((additionalCharges: AdditionalChargesBase) => ({ ...additionalCharges, id: additionalCharges._id })) || [];
  const totalRows = additional_charge_data?.data?.totalData || 0;
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteAdditionalChargesMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => {
    dispatch(setAdditionalChargeModal({ open: true, data: null }));
  };
  const handleEdit = (row: AdditionalChargesBase) => {
    dispatch(setAdditionalChargeModal({ open: true, data: row }));
  };

  const columns: AppGridColDef<AdditionalChargesBase>[] = [
    { field: "name", headerName: "Additional Charge", width: 250 },
    { field: "defaultValue", headerName: "Default Value", width: 200 },
    { field: "hsnSac", headerName: "HSN Code", width: 200 },
    CommonObjectPropertyColumn<AdditionalChargesBase>("taxId", "taxId", ["name"], { headerName: "Tax", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<AdditionalChargesBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<AdditionalChargesBase>({
            ...(permission?.edit && { active: (row) => editAdditionalCharges({ additionalChargeId: row._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: additionalChargesDataLoading || additionalChargesDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE,
  };

  return (
    <>
      <CommonCard title={PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <AdditionalChargesForm />
    </>
  );
};

export default AdditionalCharges;
