import { Box, Tab, Tabs } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikProps } from "formik";
import { useLocation } from "react-router-dom";
import { CommonButton, CommonSelect, CommonSwitch, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions } from "../../../Utils";
import type { Supplier, SupplierBillFormValues, TermsAndCondition } from "../../../Types/SupplierBill";
import { account_Ledgers, BREADCRUMBS, PAYMENT_TERMS, REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { Mutations, Queries } from "../../../Api";
import { useEffect, useRef, useState } from "react";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import AddIcon from "@mui/icons-material/Add";
import TermsAndConditionModal from "./TermsAndConditionModal";
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
  const { mutate: addSupplierBill, isPending: isAddLoading } = Mutations.useAddSupplierBill();
  const { mutate: editSupplierBill, isPending: isEditLoading } = Mutations.useAddSupplierBill();
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({}) => (
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
          )}
        </Formik>
        <CommonCard hideDivider>
          {/* ================= TABS HEADER ================= */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Product Details" />
              <Tab label="Terms & Conditions" />
              <Tab label="Return Product Details" />
            </Tabs>
          </Box>
          {/* ================= TAB 1 : PRODUCT DETAILS ================= */}
          {tabValue === 0 && (
            <Box sx={{ mt: 2, width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 1400 }}>
                <div className="w-full bg-white dark:bg-gray-dark">
                  <div className="lg:max-h-[500px] min-h-auto!">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                        <tr>
                          <th className="p-2"></th>
                          <th className="p-2">#</th>
                          <th className="p-2">Product Name</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Free Qty</th>
                          <th className="p-2">MRP</th>
                          <th className="p-2">Selling Price</th>
                          <th className="p-2">Pur. Disc 1</th>
                          <th className="p-2">Pur. Disc 2</th>
                          <th className="p-2">Taxable</th>
                          <th className="p-2">Tax</th>
                          <th className="p-2">Landing Cost</th>
                          <th className="p-2">Margin (%)</th>
                          <th className="p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((_, index) => (
                          <tr key={index} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                            <td className="p-2 flex justify-center gap-1">
                              {index === rows.length - 1 && (
                                <CommonButton size="small" variant="outlined" onClick={handleAdd}>
                                  <AddIcon />
                                </CommonButton>
                              )}
                              {rows.length > 1 && (
                                <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(index)}>
                                  <ClearIcon />
                                </CommonButton>
                              )}
                            </td>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 min-w-60 w-60 text-start">
                              <CommonSelect label="Search Product" value={[]} options={[]} onChange={() => {}} />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" disabled />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" isCurrency currencyDisabled />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" isCurrency currencyDisabled />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                            <td className="p-2 min-w-30 w-30">
                              <CommonTextField type="number" value="" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Box>
            </Box>
          )}

          {/* ================= TAB 2 : TERMS & CONDITIONS ================= */}
          {tabValue === 1 && (
            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
              {/* ================= LEFT : TABLE ================= */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box fontWeight={600}>Terms & Conditions</Box>
                  <CommonButton startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                    New Term And Condition
                  </CommonButton>
                </Box>
                <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="p-2 w-10">#</th>
                      <th className="p-2 text-left">Terms & Conditions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {termsList.map((term, index) => (
                      <tr key={term._id} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{term.termsCondition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              <Box>
                <Box fontWeight={600} mb={1}>
                  Note
                </Box>
                <Box sx={{ p: 1.5, maxHeight: 140 }}>
                  <CommonTextField placeholder="Enter a note (max 200 characters)" multiline rows={4} value={notes} onChange={(value: string) => setNotes(value)} />
                </Box>
                <Box mt={1} fontSize={12} color="text.secondary">
                  {notes.length}/200 characters
                </Box>
              </Box>
            </Box>
          )}

          {/* ================= TAB 3 : RETURN PRODUCT DETAILS ================= */}
          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              {/* ================= TABLE ================= */}
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="p-2"></th>
                      <th className="p-2 w-10">#</th>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Disc1</th>
                      <th className="p-2">Disc2</th>
                      <th className="p-2">Taxable</th>
                      <th className="p-2">Tax</th>
                      <th className="p-2">Landing Cost</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((_, index) => (
                      <tr key={index} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                        <td className="p-2 flex justify-center gap-1">
                          {index === rows.length - 1 && (
                            <CommonButton size="small" variant="outlined" onClick={handleAdd}>
                              <AddIcon />
                            </CommonButton>
                          )}
                          {rows.length > 1 && (
                            <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(index)}>
                              <ClearIcon />
                            </CommonButton>
                          )}
                        </td>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 min-w-60 w-60  text-start">
                          <CommonSelect label="Search Product" value={[]} options={[]} onChange={() => {}} />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" isCurrency currencyDisabled />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" isCurrency currencyDisabled />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" disabled />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" />
                        </td>
                        <td className="p-2">
                          <CommonTextField type="number" value="" />
                        </td>
                      </tr>
                    ))}
                    {/* TOTAL ROW */}
                    <tr className="bg-gray-50 dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200">
                      <td colSpan={4} className="p-2 text-right">
                        Total
                      </td>
                      <td className="p-2 text-center">0</td>
                      <td colSpan={8}></td>
                    </tr>
                  </tbody>
                </table>
              </Box>

              {/* ================= SUMMARY BOX ================= */}
              <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: "1fr 300px", gap: 2 }}>
                <Box />
                <Box className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                  <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                    <span>Gross</span>
                    <span>0</span>
                  </Box>

                  <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                    <span>Tax Amount</span>
                    <span>0</span>
                  </Box>

                  <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                    <span>Roundoff</span>
                    <span>0.0</span>
                  </Box>
                  <Box className="flex justify-between p-3 text-lg font-semibold">
                    <span>Net Amount</span>
                    <span>0</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </CommonCard>

        <CommonCard>
          {!showAdditionalCharge && (
            <CommonButton size="small" startIcon={<AddIcon fontSize="small" />} onClick={() => setShowAdditionalCharge(true)}>
              Add Additional Charges
            </CommonButton>
          )}
          {showAdditionalCharge && (
            <Box sx={{ mt: 2, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2, bgcolor: "background.paper" }}>
              {/* ===== HEADER ===== */}
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <CommonButton size="small" color="error" variant="outlined" onClick={() => setShowAdditionalCharge(false)}>
                  <ClearIcon fontSize="small" />
                </CommonButton>
              </Box>

              {/* ===== TABLE ===== */}
              <Box sx={{ mt: 1, overflowX: "auto", borderRadius: 1 }}>
                <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="p-2 w-10"></th>
                      <th className="p-2 w-10">#</th>
                      <th className="p-2 text-left">Additional Charge</th>
                      <th className="p-2">Value </th>
                      <th className="p-2">Tax</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((_, index) => (
                      <tr key={index} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                        <td className="p-2 flex justify-center gap-1">
                          {index === rows.length - 1 && (
                            <CommonButton size="small" variant="outlined" onClick={handleAdd}>
                              <AddIcon />
                            </CommonButton>
                          )}
                          {rows.length > 1 && (
                            <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(index)}>
                              <ClearIcon />
                            </CommonButton>
                          )}
                        </td>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 mmin-w-80 w-80">
                          <CommonSelect label="Search Additional" value={[]} options={[]} onChange={() => {}} />
                        </td>
                        <td className="p-2 min-w-80 w-80">
                          <CommonTextField type="number" value="" />
                        </td>
                        <td className="p-2 min-w-80 w-80">
                          <CommonSelect value={[]} options={[]} onChange={() => {}} />
                        </td>
                        <td className="p-2 text-right">0</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-900 font-medium">
                      <td colSpan={4} className="p-2 text-right">
                        Total
                      </td>
                      <td className="p-2 text-right">0</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: "1fr 300px", gap: 2 }}>
            <Box />
            <Box className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Flat Discount</span>
                <CommonTextField type="number" value="" isCurrency currencyDisabled />
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Gross Amount</span>
                <span>0</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Taxable Amount</span>
                <span>0</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                <span>Tax</span>
                <span>0</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                <span>Roundoff</span>
                <span>0</span>
              </Box>
              <Box className="flex justify-between p-3 text-lg font-semibold">
                <span>Net Amount</span>
                <span>0</span>
              </Box>
            </Box>
          </Box>
        </CommonCard>
        {!isEditing && <CommonSwitch name="isActive" label="Is Active" />}
        <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} onSave={() => formikRef.current?.submitForm()} />
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
