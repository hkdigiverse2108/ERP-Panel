import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonRadio } from "../../Attribute";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE } from "../../Data";
import type { AppGridColDef, ContactBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, updateAdvancedFilter, advancedFilter, params } = useDataGrid({ defaultFilterKey: { typeFilter: [CONTACT_TYPE[0].value] } });

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CONTACT.BASE);

  const { data: contactData, isLoading: contactDataLoading, isFetching: contactDataFetching } = Queries.useGetContact(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetContact({ typeFilter: advancedFilter?.contactType?.[0] }, false);
  const { mutate: deleteContactMutate, isPending: isDeleteLoading } = Mutations.useDeleteContact();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContact();

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

  const columns: AppGridColDef<ContactBase>[] = [
    { field: "firstName", headerName: "Name", flex: 1, minWidth: 200 },
    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 150 }),
    CommonPhoneColumns("whatsappNo", { headerName: "WhatsApp No", width: 150 }),
    // { field: "gstIn", headerName: "GSTIN", flex: 1, minWidth: 150 },
    // { field: "gstType", headerName: "GST Type", flex: 1, minWidth: 150 },
    // { field: "tanNo", headerName: "TAN No", flex: 1, minWidth: 150 },
    // { field: "transporterId", headerName: "Transporter ID", flex: 1, minWidth: 240 },
    // { field: "loyaltyPoints", headerName: "Loyalty Point", flex: 1, minWidth: 240 },
    { field: "panNo", headerName: "PAN No", flex: 1, minWidth: 120 },
    { field: "telephoneNo", headerName: "Telephone No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<ContactBase>("customerType", "customerType", [], { headerName: "Customer Type", flex: 1, minWidth: 150, type: "format" }),
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    // { field: "companyName", headerName: "Company Name", flex: 1, minWidth: 220 },
    // { field: "dob", headerName: "Date of Birth", flex: 1, minWidth: 160, valueGetter: (v) => FormatDate(v) },
    // { field: "anniversaryDate", headerName: "Anniversary Date", flex: 1, minWidth: 180, valueGetter: (v) => FormatDate(v) },
    CommonObjectPropertyColumn<ContactBase>("bankName", "bankDetails", ["name"], { headerName: "Bank name", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<ContactBase>("ifscCode", "bankDetails", ["ifscCode"], { headerName: "IFSC Code", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<ContactBase>("branchName", "bankDetails", ["branch"], { headerName: "Branch Name", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<ContactBase>("accountNumber", "bankDetails", ["accountNumber"], { headerName: "Account Number", flex: 1, minWidth: 200 }),
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

  const CommonDataGridOption = {
    columns,
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
    // defaultHidden: ["email", "companyName", "dob", "anniversaryDate", "customerType", "telephoneNo", "panNo", "accountNumber", "branchName", "ifscCode", "bankName", "addressLine", "addressLine2", "city", "state", "country", "pinCode", "gstIn", "gstType", "transporterId", "tanNo"],
    fileName: PAGE_TITLE.CONTACT.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const topContent = <CommonRadio value={advancedFilter?.contactType?.[0]} onChange={handleContactTypeChange} options={CONTACT_TYPE} grid={{ xs: "auto" }} />;

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONTACT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Contact;
