import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useLocation } from "react-router-dom";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions } from "../../../Utils";
import type { Supplier, SupplierBillFormValues } from "../../../Types/SupplierBill";
import { account_Ledgers, BREADCRUMBS, PAYMENT_TERMS, REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { Queries } from "../../../Api";
import { useEffect, useState } from "react";
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
    const { _submitAction, ...rest } = values;

    // const payload = {
    //   ...rest,
    // };

    //   const handleSuccess = () => {
    //     if (_submitAction === "saveAndNew") resetForm();
    //     else navigate(-1);
    //   };

    //   if (isEditing) {
    //     const changedFields = GetChangedFields(payload, data);
    //     editSupplierBill({ ...changedFields, supplierBillId: data._id }, { onSuccess: handleSuccess });
    //   } else {
    //     addSupplierBill(RemoveEmptyFields(payload), {
    //       onSuccess: handleSuccess,
    //     });
    //   }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.SUPPLIER_BILL[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <SupplierWatcher suppliers={suppliers} onChange={setSelectedSupplier} />
              <Grid container spacing={2}>
                <CommonCard title="Supplier Bill Details" grid={{ xs: 12 }}>
                  <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, gap: 3 }}>
                    {/* ================= LEFT SIDE ================= */}
                    <Box display="flex" flexDirection="column" gap={2}>
                      <CommonValidationSelect name="supplierId" label="Select Supplier" required options={supplierOptions} grid={{ xs: 12 }} />

                      <Box>
                        <Box fontWeight={600}>Place of Supply:</Box>
                        <Box color="text.secondary">{selectedSupplier?.address?.[0]?.state?.name || "-"}</Box>
                      </Box>

                      <Box>
                        <Box fontWeight={600}>GSTIN:</Box>
                        <Box color="text.secondary">{selectedSupplier?.address?.[0]?.gstIn || "-"}</Box>
                      </Box>

                      <Box>
                        <Box fontWeight={600}>Billing Address</Box>

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

                      {selectedSupplier && (
                        <Box display="flex" gap={3}>
                          <Box sx={{ color: "primary.main", fontWeight: 500 }}>Change Address</Box>
                          <Box sx={{ color: "primary.main", fontWeight: 500 }}>Edit Billing Address</Box>
                        </Box>
                      )}
                    </Box>

                    {/* ================= RIGHT SIDE ================= */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                      <CommonValidationDatePicker name="supplierBillDate" label="Supplier Bill Date" grid={{ xs: 12 }} />
                      {isEditing && (<CommonValidationTextField name="referenceBillNo" label="Reference Bill No." grid={{ xs: 12 }} />)}
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
                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" />}
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
export default SupplierBillForm;
