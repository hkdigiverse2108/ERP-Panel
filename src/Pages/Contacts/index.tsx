// Contact.tsx
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE } from "../../Data";
import type { AppGridColDef } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import type { ContactBase } from "../../Types/Contacts";
import { CommonRadio } from "../../Attribute";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const [contactType, setContactType] = useState("customer");

  const { data: ContactData, isLoading, isFetching } = Queries.useGetContact(params);
  const { mutate: deleteContactMutate } = Mutations.useDeleteContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();
  // 🔥 FILTERED MAPPING BASED ON contactType
  const allContact = useMemo(() => {
    return (
      ContactData?.data?.contact_data
        .map((con: ContactBase) => {
          const address = con?.addressDetails?.[0];

          return {
            ...con,
            id: con?._id,
            // Bank
            bankName: con?.bankDetails?.name,
            ifscCode: con?.bankDetails?.ifscCode,
            branchName: con?.bankDetails?.branch,
            accountNumber: con?.bankDetails?.accountNumber,
            // Address
            addressLine1: address?.addressLine1,
            addressLine2: address?.addressLine2,
            city: address?.city,
            state: address?.state,
            country: address?.country,
            pinCode: address?.pinCode,
            // GST
            gstIn: address?.gstIn,
            gstType: address?.gstType,
          };
        })
        .filter((con) => {
          if (contactType === "transporter") return Boolean(con.transporterId);
          if (contactType === "supplier") return Boolean(con.tanNo);
          if (contactType === "customer") return !con.transporterId && !con.tanNo;
          return true;
        }) || []
    );
  }, [ContactData, contactType]);

  const totalRows = ContactData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteContactMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.CONTACT.ADD_EDIT);

  const columns: AppGridColDef<any>[] = [
    { field: "firstName", headerName: "Name", flex: 1, minWidth: 150 },

    CommonPhoneColumns("phoneNo", { headerName: "Phone No" }),
    CommonPhoneColumns("whatsappNo", { headerName: "WhatsApp No" }),

    { field: "gstIn", headerName: "GSTIN", flex: 1, minWidth: 130 },
    { field: "gstType", headerName: "GST Type", flex: 1, minWidth: 120 },
    { field: "tanNo", headerName: "TAN No", flex: 1, minWidth: 130 },
    { field: "transporterId", headerName: "Transporter ID", flex: 1, minWidth: 120 },

    { field: "loyaltyPoints", headerName: "Loyalty Point", flex: 1, minWidth: 120 },
    { field: "panNo", headerName: "PAN No", flex: 1, minWidth: 120 },
    { field: "telephoneNo", headerName: "Telephone No", flex: 1, minWidth: 150 },
    { field: "customerType", headerName: "Customer Type", flex: 1, minWidth: 150 },

    // Bank
    { field: "bankName", headerName: "Bank Name", flex: 1, minWidth: 150 },
    { field: "ifscCode", headerName: "IFSC Code", flex: 1, minWidth: 150 },
    { field: "branchName", headerName: "Branch", flex: 1, minWidth: 120 },
    { field: "accountNumber", headerName: "Account No", flex: 1, minWidth: 160 },

    // Address
    { field: "addressLine1", headerName: "Address Line 1", flex: 1, minWidth: 180 },
    { field: "addressLine2", headerName: "Address Line 2", flex: 1, minWidth: 180 },
    { field: "pinCode", headerName: "Pin Code", flex: 1, minWidth: 120 },
    { field: "city", headerName: "City", flex: 1, minWidth: 120 },
    { field: "state", headerName: "State", flex: 1, minWidth: 120 },
    { field: "country", headerName: "Country", flex: 1, minWidth: 120 },

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
