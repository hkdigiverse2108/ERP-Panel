import { Box, Grid} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE} from "../../Data";
import type { AppGridColDef} from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import type { ContactBase } from "../../Types/Contacts";
import { CommonRadio } from "../../Attribute";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const [contactType, setContactType] = useState("");


  const { data: ContactData, isLoading: ContactDataLoading, isFetching: ContactDataFetching } = Queries.useGetContact(params);
  const { mutate: deleteContactMutate } = Mutations.useDeleteContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

  const allContact = useMemo(() => ContactData?.data?.contact_data.map((con: ContactBase) => ({ ...con, id: con?._id })) || [], [ContactData]);
  const totalRows = ContactData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteContactMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.CONTACT.ADD_EDIT);

  const columns: AppGridColDef<ContactBase>[] = [
    { field: "firstName", headerName: "Name", flex: 1 },
    CommonPhoneColumns<ContactBase>(),
    { field: "whatsappNo", headerName: "WhatsApp No", flex: 1 , renderCell: ({ value }) => typeof value === "object" ? value?.name || "-" : value,exportFormatter: (value) => typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-", },
    { field: "gstin", headerName: "GSTIN", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "loyaltyPoint", headerName: "Loyalty Point", flex: 1 },
    CommonActionColumn({
      active: (row) => editContact({ contactId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.CONTACT.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.firstName }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allContact,
    rowCount: totalRows,
    loading: ContactDataLoading || ContactDataFetching || isEditLoading,
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

  const topContent =(
    <CommonRadio value={contactType} onChange={setContactType} options={CONTACT_TYPE} grid={{ xs: "auto" }} />
  )

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONTACT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Contact;
