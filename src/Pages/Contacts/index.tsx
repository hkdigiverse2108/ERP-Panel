// Contact.tsx
import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE } from "../../Data";
import type { AppGridColDef } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { transformContactData, filterContactByType } from "../../Utils/FormHelpers";
import { CommonRadio } from "../../Attribute";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const [contactType, setContactType] = useState("customer");

  const { data: ContactData, isLoading, isFetching } = Queries.useGetContact(params);
  const { mutate: deleteContactMutate } = Mutations.useDeleteContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

  // Get filtered and transformed contacts
  const allContact = ContactData?.data?.contact_data?.map(transformContactData).filter((con) => filterContactByType(con, contactType)) || [];

  const totalRows = ContactData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteContactMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.CONTACT.ADD_EDIT);

  const columns: AppGridColDef<any>[] = [
    { field: "firstName", headerName: "Name", width: 240 },

    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 240 }),
    CommonPhoneColumns("whatsappNo", { headerName: "WhatsApp No", width: 240 }),

    { field: "gstIn", headerName: "GSTIN", width: 150 },
    { field: "gstType", headerName: "GST Type", width: 150 },
    { field: "tanNo", headerName: "TAN No", width: 150 },
    { field: "transporterId", headerName: "Transporter ID", width: 240 },

    { field: "loyaltyPoints", headerName: "Loyalty Point",flex: 1, minWidth: 240 },
    { field: "panNo", headerName: "PAN No", width: 120 },
    { field: "telephoneNo", headerName: "Telephone No", width: 150 },
    { field: "customerType", headerName: "Customer Type", width: 150 },

    // Bank
    { field: "bankName", headerName: "Bank Name", width: 150 },
    { field: "ifscCode", headerName: "IFSC Code", width: 150 },
    { field: "branchName", headerName: "Branch", width: 150 },
    { field: "accountNumber", headerName: "Account No", width: 160 },

    // Address
    { field: "addressLine1", headerName: "Address Line 1", width: 180 },
    { field: "addressLine2", headerName: "Address Line 2", width: 180 },
    { field: "pinCode", headerName: "Pin Code", width: 120 },
    { field: "city", headerName: "City", width: 120 },
    { field: "state", headerName: "State", width: 120 },
    { field: "country", headerName: "Country",flex: 1, minWidth: 120 },

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
    defaultHidden: ["email", "companyName", "dob", "anniversaryDate", "customerType", "telephoneNo", "panNo", "accountNumber", "branchName", "ifscCode", "bankName", "addressLine1", "addressLine2", "city", "state", "country", "pinCode", "gstIn", "gstType", "transporterId", "tanNo"],
  };

  const topContent = <CommonRadio value={contactType} onChange={setContactType} options={CONTACT_TYPE} grid={{ xs: "auto" }} />;

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONTACT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Contact;
