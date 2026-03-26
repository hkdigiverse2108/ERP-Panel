import { useMemo, useState } from "react";
import { Mutations, Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import type { AppGridColDef, RolesBase } from "../../../../Types";
import { useDataGrid, usePagePermission } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import RolesFormModal from "./RolesFormModal";
import { CommonObjectPropertyColumn } from "../../../Common/CommonDataGrid/CommonColumns";

const UserRoles = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setEdit] = useState<RolesBase>({} as RolesBase);
  const permission = usePagePermission(PAGE_TITLE.ROLES.BASE);

  const { data: rolesData, isLoading: rolesDataLoading, isFetching: rolesDataFetching } = Queries.useGetRoles(params);
  const { mutate: deleteRolesMutate, isPending: isDeleteLoading } = Mutations.useDeleteRoles();
  const { mutate: editRoles, isPending: isEditLoading } = Mutations.useEditRoles();

  const allRoles = useMemo(() => rolesData?.data?.role_data.map((roles) => ({ ...roles, id: roles?._id })) || [], [rolesData]);
  const totalRows = rolesData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteRolesMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => {
    setEdit({} as RolesBase);
    setOpenModal(!openModal);
  };

  const handleEdit = (row: RolesBase) => {
    setEdit(row);
    setOpenModal(!openModal);
  };

  const columns: AppGridColDef<RolesBase>[] = [
    { field: "name", headerName: "Roles Name", flex: 1 },
    CommonObjectPropertyColumn<RolesBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<RolesBase>({
            ...(permission?.edit && { active: (row) => editRoles({ roleId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRoles,
    rowCount: totalRows,
    loading: rolesDataLoading || rolesDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
    fileName: PAGE_TITLE.ROLES.TITLE,
  };

  return (
    <>
      <CommonCard title={PAGE_TITLE.ROLES.TITLE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <RolesFormModal openModal={openModal} setOpenModal={setOpenModal} isEdit={isEdit} />
    </>
  );
};

export default UserRoles;
