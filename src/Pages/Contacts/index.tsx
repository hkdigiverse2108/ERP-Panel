import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonButton, CommonRadio } from "../../Attribute";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE } from "../../Data";
import type { AppGridColDef, ContactBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { useAppDispatch } from "../../Store/hooks";
import { setBulkAddModal } from "../../Store/Slices/ModalSlice";
import BulkAddModal from "../../Components/Common/BulkAddModal";
import { UploadFile } from "@mui/icons-material";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, updateAdvancedFilter, advancedFilter, params } = useDataGrid({ defaultFilterKey: { typeFilter: [CONTACT_TYPE[0].value] } });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const permission = usePagePermission(PAGE_TITLE.CONTACT.BASE);

  const { data: contactData, isLoading: contactDataLoading, isFetching: contactDataFetching } = Queries.useGetContact(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetContact({ typeFilter: advancedFilter?.contactType?.[0] }, false);
  const { mutate: deleteContactMutate, isPending: isDeleteLoading } = Mutations.useDeleteContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();
  const { mutate: bulkAddContact, isPending: isBulkAddLoading } = Mutations.useBulkAddContact();

  const allContact = contactData?.data?.contact_data.map((contact: ContactBase) => ({ ...contact, id: contact?._id })) || [];
  const totalRows = contactData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteContactMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.CONTACT.ADD_EDIT);

  const handleContactTypeChange = (value: string) => {
    updateAdvancedFilter("typeFilter", [value]);
  };
  const selectedType = advancedFilter?.typeFilter?.[0];

  const handleBulkAdd = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    bulkAddContact(formData, {
      onSuccess: () => {
        dispatch(setBulkAddModal({ open: false, title: "", type: "" }));
      },
    });
  };

  const getVisibleFields = () => {
    const common = ["companyId", "firstName", "phoneNo", "whatsappNo", "loyaltyPoints", "createdBy"];

    if (selectedType === "customer") return [...common, "customerType"];
    if (selectedType === "supplier") return [...common, "tanNo", "supplierType"];
    if (selectedType === "transporter") return [...common, "transporterId"];

    return common;
  };
  const visibleFields = getVisibleFields();

  const columns: AppGridColDef<ContactBase>[] = [
    { field: "firstName", headerName: "Name", width: 240 },
    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 240 }),
    CommonPhoneColumns("whatsappNo", { headerName: "WhatsApp No", width: 240 }),
    { field: "gstIn", headerName: "GSTIN", width: 150 },
    { field: "gstType", headerName: "GST Type", width: 150 },
    { field: "tanNo", headerName: "TAN No", width: 150 },
    { field: "transporterId", headerName: "Transporter ID", width: 240 },
    { field: "loyaltyPoints", headerName: "Loyalty Point", flex: 1, minWidth: 240 },
    { field: "panNo", headerName: "PAN No", width: 120 },
    { field: "telephoneNo", headerName: "Telephone No", width: 150 },
    { field: "customerType", headerName: "Customer Type", width: 150 },
    { field: "supplierType", headerName: "Supplier Type", width: 150 },
    { field: "email", headerName: "Email", width: 220 },
    CommonObjectPropertyColumn<ContactBase>("dob", "dob", [], { headerName: "Date of Birth", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<ContactBase>("anniversaryDate", "anniversaryDate", [], { headerName: "Anniversary Date", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<ContactBase>("bankName", "bankDetails", ["name"], { headerName: "Bank name", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("ifscCode", "bankDetails", ["ifscCode"], { headerName: "IFSC Code", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("branchName", "bankDetails", ["branch"], { headerName: "Branch Name", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("accountNumber", "bankDetails", ["accountNumber"], { headerName: "Account Number", width: 300 }),

    CommonObjectPropertyColumn<ContactBase>("createdBy", "createdBy", ["fullName", "userType"], { headerName: "Created By", flex: 1, minWidth: 150, type: "createdBy" }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<ContactBase>({
            ...(permission?.edit && {
              active: (row) => editContact({ contactId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.CONTACT.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.firstName }) }),
          }),
        ]
      : []),
  ];
  const filteredColumns = columns.filter((col) => {
    if (!col.field || col.field === "actions") return true;
    return visibleFields.includes(col.field);
  });
  const CommonDataGridOption = {
    columns: filteredColumns,
    rows: allContact,
    rowCount: totalRows,
    loading: contactDataLoading || contactDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.CONTACT.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const topContent = (
    <>
      <Grid size="auto">
        <CommonRadio value={advancedFilter?.contactType?.[0]} onChange={handleContactTypeChange} options={CONTACT_TYPE} />
      </Grid> 
      {permission?.add && (
        <Grid size="auto" sx={{ ml: "auto" }}>
          <CommonButton variant="contained" startIcon={<UploadFile />} title="Import" size="small" onClick={() => dispatch(setBulkAddModal({ open: true, title: "Import Contacts", type: "contact" }))} />
        </Grid>
      )}
    </>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONTACT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>

      <BulkAddModal type="contact" onUpload={handleBulkAdd} loading={isBulkAddLoading} />
    </>
  );
};

export default Contact;
