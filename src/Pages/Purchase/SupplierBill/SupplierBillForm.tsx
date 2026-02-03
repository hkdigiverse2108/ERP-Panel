import { Box } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikProps } from "formik";
import { useLocation } from "react-router-dom";
import { CommonSwitch, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions } from "../../../Utils";
import type { Supplier, SupplierBillFormValues, TermsAndCondition } from "../../../Types/SupplierBill";
import { account_Ledgers, BREADCRUMBS, PAYMENT_TERMS, REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { Mutations, Queries } from "../../../Api";
import { useEffect, useRef, useState } from "react";
import TermsAndConditionModal from "./TermsAndConditionModal";
import SupplierBillTabs from "./SupplierBillTab";
import AdditionalChargesSection from "./AdditionalChargeSection";
const SupplierWatcher = ({ suppliers, onChange }: { suppliers: Supplier[]; onChange: (supplier: Supplier | null) => void }) => {
  const { values } = useFormikContext<SupplierBillFormValues>();
  useEffect(() => {
    const supplierId = values.supplierId;
    if (!supplierId) {
      onChange(null);
      return;
    }
    const supplier = suppliers.find((s) => String(s._id) === String(supplierId));
    onChange(supplier ?? null);
  }, [values.supplierId, suppliers]);
  return null;
};
const SupplierBillForm = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const { data: supplierData } = Queries.useGetContact({ activeFilter: true, typeFilter: "supplier" });
  const suppliers = (supplierData?.data?.contact_data || []) as Supplier[];
  const supplierOptions = GenerateOptions(suppliers);
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const emptyRow = { productId: "", itemCode: "", qty: "", freeQty: "", unit: "", unitCost: "", mrp: "", sellingPrice: "", disc1: "", disc2: "", mfgDate: "", expiryDate: "" };
  const [rows, setRows] = useState([emptyRow]);
  const [returnRows, setReturnRows] = useState([emptyRow]);
  const [additionalChargeRows, setAdditionalChargeRows] = useState([emptyRow]);
  const { mutate: addSupplierBill, isPending: isAddLoading } = Mutations.useAddSupplierBill();
  const { mutate: editSupplierBill, isPending: isEditLoading } = Mutations.useAddSupplierBill();
  console.log(addSupplierBill, editSupplierBill);

  const formikRef = useRef<FormikProps<SupplierBillFormValues> | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [termsList, setTermsList] = useState<TermsAndCondition[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [showAdditionalCharge, setShowAdditionalCharge] = useState(false);

  const handleAdd = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCut = (index: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleAddReturn = () => {
    setReturnRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCutReturn = (index: number) => {
    setReturnRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const handleAddAdditionalCharge = () => {
    setAdditionalChargeRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCutAdditionalCharge = (index: number) => {
    setAdditionalChargeRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const initialValues: SupplierBillFormValues = {
    supplierId: data?.supplierId?._id || "",
    supplierBillNo: data?.supplierBillNo || "",
    referenceBillNo: data?.referenceBillNo || "",
    supplierBillDate: data?.supplierBillDate || DateConfig.utc().toISOString(),
    taxType: data?.taxType || "exclusive",
    paymentTerm: data?.paymentTerm || "",
    dueDate: data?.dueDate || "",
    reverseCharge: data?.reverseCharge ?? false,
    shippingDate: data?.shippingDate || "",
    invoiceAmount: data?.invoiceAmount || "",
    productDetails: {
      item: data?.productDetails?.item || [],
      totalQty: data?.productDetails?.totalQty || 0,
      totalTax: data?.productDetails?.totalTax || 0,
      total: data?.productDetails?.total || 0,
    },
    returnProductDetails: {
      item: data?.returnProductDetails?.item || [],
      totalQty: data?.returnProductDetails?.totalQty || 0,
      total: data?.returnProductDetails?.total || 0,
      summary: {
        grossAmount: data?.returnProductDetails?.summary?.grossAmount || 0,
        taxAmount: data?.returnProductDetails?.summary?.taxAmount || 0,
        roundOff: data?.returnProductDetails?.summary?.roundOff || 0,
        netAmount: data?.returnProductDetails?.summary?.netAmount || 0,
      },
    },
    additionalCharges: {
      item: data?.additionalCharges?.item || [],
      total: data?.additionalCharges?.total || 0,
    },
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: any) => t._id) || [],
    notes: data?.notes || "",
    summary: {
      flatDiscount: data?.summary?.flatDiscount || 0,
      grossAmount: data?.summary?.grossAmount || 0,
      itemDiscount: data?.summary?.itemDiscount || 0,
      itemTax: data?.summary?.itemTax || 0,
      additionalChargeAmount: data?.summary?.additionalChargeAmount || 0,
      additionalChargeTax: data?.summary?.additionalChargeTax || 0,
      billDiscount: data?.summary?.billDiscount || 0,
      roundOff: data?.summary?.roundOff || 0,
      netAmount: data?.summary?.netAmount || 0,
    },
    paidAmount: data?.paidAmount || 0,
    balanceAmount: data?.balanceAmount || 0,
    paymentStatus: data?.paymentStatus || "unpaid",
    status: data?.status || "active",
    isActive: data?.isActive ?? true,
  };

  /* ========================= SUBMIT ========================= */

  const handleSubmit = async (values: SupplierBillFormValues, { resetForm }: FormikHelpers<SupplierBillFormValues>) => {
    const { _submitAction } = values;
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.SUPPLIER_BILL[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8, display: "grid", gap: 2 }}>
        <Formik innerRef={formikRef} initialValues={initialValues} onSubmit={handleSubmit}>
          {() => (
            <>
              <Form noValidate>
                <SupplierWatcher suppliers={suppliers} onChange={setSelectedSupplier} />
                <CommonCard title="Supplier Bill Details" grid={{ xs: 12 }}>
                  <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "340px 1fr" }, gap: 2 }}>
                    {/* ================= LEFT SIDE ================= */}
                    <Box display="flex" flexDirection="column" gap={2}>
                      <CommonValidationSelect name="supplierId" label="Select Supplier" required options={supplierOptions} grid={{ xs: 12 }} />
                      {/* PLACE OF SUPPLY */}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Box fontWeight={600}>Place of Supply:</Box>
                        <Box color="text.secondary">{selectedSupplier?.address?.[0]?.state?.name || "-"}</Box>
                      </Box>
                      {/* GSTIN */}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Box fontWeight={600}>GSTIN:</Box>
                        <Box color="text.secondary">{selectedSupplier?.address?.[0]?.gstIn || "-"}</Box>
                      </Box>
                      {/* BILLING ADDRESS */}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Box fontWeight={600}>Billing Address:</Box>
                        {selectedSupplier?.address?.length ? (
                          <Box color="text.secondary">
                            <Box>{selectedSupplier.address[0]?.addressLine1}</Box>
                            <Box>
                              {selectedSupplier.address[0]?.city?.name}, {selectedSupplier.address[0]?.state?.name}
                            </Box>
                            <Box>{selectedSupplier.address[0]?.pinCode}</Box>
                          </Box>
                        ) : (
                          <Box color="text.secondary">Billing Address is not provided</Box>
                        )}
                      </Box>
                    </Box>
                    {/* ================= RIGHT SIDE ================= */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                      <CommonValidationDatePicker name="supplierBillDate" label="Supplier Bill Date" grid={{ xs: 12 }} />
                      {isEditing && <CommonValidationTextField name="referenceBillNo" label="Reference Bill No." grid={{ xs: 12 }} />}
                      <CommonValidationTextField name="supplierBillNo" label="Supplier Bill No." grid={{ xs: 12 }} />
                      <CommonValidationTextField name="materialInwardNo" label="Select Material Inward No." grid={{ xs: 12 }} />
                      <CommonValidationSelect name="paymentTerm" label="Payment Term" grid={{ xs: 12 }} options={PAYMENT_TERMS} />
                      <CommonValidationDatePicker name="dueDate" label="Due Date" grid={{ xs: 12 }} />
                      <CommonValidationSelect name="reverseCharge" label="Reverse Charge" grid={{ xs: 12 }} options={REVERSE_CHARGE} />
                      <CommonValidationDatePicker name="shippingDate" label="Shipping Date" grid={{ xs: 12 }} />
                      <CommonValidationSelect name="taxType" label="Tax Type" grid={{ xs: 12 }} options={TAX_TYPE} />
                      <CommonValidationSwitch name="exportSez" label="Export / SEZ" />
                      <CommonValidationTextField name="invoiceAmount" label="Invoice Amount" grid={{ xs: 12 }} />
                      <CommonValidationSelect name="accountLedger" label="Select Account Ledger" grid={{ xs: 12 }} options={account_Ledgers} />
                    </Box>
                  </Box>
                </CommonCard>
              </Form>
              <CommonCard hideDivider>
                <SupplierBillTabs tabValue={tabValue} setTabValue={setTabValue} rows={rows} handleAdd={handleAdd} handleCut={handleCut} returnRows={returnRows} handleAddReturn={handleAddReturn} handleCutReturn={handleCutReturn} termsList={termsList} notes={notes} setNotes={setNotes} setOpenModal={setOpenModal} />
              </CommonCard>
              <CommonCard grid={{ xs: 12 }}>
                <AdditionalChargesSection showAdditionalCharge={showAdditionalCharge} setShowAdditionalCharge={setShowAdditionalCharge} additionalChargeRows={additionalChargeRows} handleAddAdditionalCharge={handleAddAdditionalCharge} handleCutAdditionalCharge={handleCutAdditionalCharge} />
              </CommonCard>
              <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} onSave={() => formikRef.current?.submitForm()} />
            </>
          )}
        </Formik>
      </Box>
      <TermsAndConditionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSave={(term: TermsAndCondition) => {
          setTermsList((prev) => [...prev, term]);
          setSelectedTermIds((prev) => [...prev, term._id]);
        }}
      />
    </>
  );
};
export default SupplierBillForm;
