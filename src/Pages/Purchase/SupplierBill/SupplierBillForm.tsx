import { Box } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikProps } from "formik";
import { useLocation } from "react-router-dom";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions } from "../../../Utils";
import type { Supplier, SupplierBillFormValues, TermsAndCondition, ProductRow, AdditionalChargeRow, SupplierBillProductDetails, AdditionalChargeDetails, SupplierBillProductItem, AdditionalChargeItem, ProductBase } from "../../../Types/SupplierBill";
import { BREADCRUMBS, PAYMENT_TERMS, REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
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
  const { data: supplierData } = Queries.useGetContactDropdown({ activeFilter: true, typeFilter: "supplier" });
  const suppliers = (supplierData?.data || []) as Supplier[];
  const supplierOptions = GenerateOptions(suppliers);
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const emptyRow: ProductRow = { productId: "", itemCode: "", qty: "", freeQty: "", unit: "", unitCost: "", mrp: "", sellingPrice: "", disc1: "", disc2: "", taxableAmount: "", taxAmount: "", landingCost: "", margin: "", totalAmount: "", mfgDate: "", expiryDate: "", taxRate: "", taxName: "" };
  const additionalChargeEmptyRow: AdditionalChargeRow = { chargeId: "", taxableAmount: "", tax: "", taxAmount: "", totalAmount: "" };
  const [rows, setRows] = useState<ProductRow[]>([emptyRow]);
  const [returnRows, setReturnRows] = useState<ProductRow[]>([emptyRow]);
  const [additionalChargeRows, setAdditionalChargeRows] = useState<AdditionalChargeRow[]>([additionalChargeEmptyRow]);
  const { mutate: addSupplierBill, isPending: isAddLoading } = Mutations.useAddSupplierBill();
  const { mutate: editSupplierBill, isPending: isEditLoading } = Mutations.useEditSupplierBill();
  const formikRef = useRef<FormikProps<SupplierBillFormValues> | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [termsList, setTermsList] = useState<TermsAndCondition[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [showAdditionalCharge, setShowAdditionalCharge] = useState(false);
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();
  const taxOptions = GenerateOptions(TaxData?.data || []);
  const { data: ProductsData, isLoading: ProductsDataLoading } = Queries.useGetProductDropdown();
  const productOptions = GenerateOptions(ProductsData?.data);
  const [flatDiscount, setFlatDiscount] = useState<string | number>(0);
  const { data: additionalchargedata, isLoading: additionalchargeLoading } = Queries.useGetAdditionalChargeDropdown();
  const additionalChargeOptions = GenerateOptions(additionalchargedata?.data);
  const [roundOffAmount, setRoundOffAmount] = useState<string | number>(0);
  const [returnRoundOffAmount, setReturnRoundOffAmount] = useState<string | number>(0);
  const calculateSummary = () => {
    const itemDiscount = rows.reduce((s, r) => s + (parseFloat(String(r.disc1)) || 0) + (parseFloat(String(r.disc2)) || 0), 0);
    const itemTax = rows.reduce((s, r) => s + (parseFloat(String(r.taxAmount)) || 0), 0);
    const itemGross = rows.reduce((s, r) => s + (parseFloat(String(r.qty)) || 0) * (parseFloat(String(r.sellingPrice)) || 0), 0);
    const itemTaxable = rows.reduce((s, r) => s + (parseFloat(String(r.taxableAmount)) || 0), 0);
    const additionalChargeAmount = additionalChargeRows.reduce((s, r) => s + (parseFloat(String(r.taxableAmount)) || 0), 0);
    const additionalChargeTax = additionalChargeRows.reduce((s, r) => s + (parseFloat(String(r.taxAmount)) || 0), 0);
    const grossAmount = itemGross + additionalChargeAmount;
    const taxableAmount = itemTaxable + additionalChargeAmount;
    const taxAmount = itemTax + additionalChargeTax;
    const billTotal = taxableAmount + taxAmount - (parseFloat(String(flatDiscount)) || 0);
    const roundOff = parseFloat(String(roundOffAmount)) || 0;
    const netAmount = billTotal + roundOff;
    return { flatDiscount: parseFloat(String(flatDiscount)) || 0, grossAmount, itemDiscount, itemTax, additionalChargeAmount, additionalChargeTax, taxableAmount, taxAmount, roundOff, netAmount };
  };
  const summary = calculateSummary();
  useEffect(() => {
    if (isEditing && data) {
      if (data.productDetails?.item) {
        setRows(
          data.productDetails.item.map((item: SupplierBillProductItem) => {
            const product = item.productId as ProductBase | undefined;
            return {
              productId: product?._id || (item.productId as string),
              qty: item.qty || "",
              freeQty: item.freeQty || "",
              mrp: item.mrp || "",
              sellingPrice: item.sellingPrice || "",
              disc1: item.discount1 || "",
              disc2: item.discount2 || "",
              taxAmount: item.taxAmount || "",
              totalAmount: item.total || "",
              itemCode: product?.itemCode || "",
              unit: product?.unit || "",
              taxableAmount: ((item.total || 0) - (item.taxAmount || 0)).toFixed(2),
              landingCost: item.landingCost || "",
              margin: item.margin || "",
              mfgDate: item.mfgDate ? DateConfig.utc(item.mfgDate).toISOString() : "",
              expiryDate: item.expiryDate ? DateConfig.utc(item.expiryDate).toISOString() : "",
              taxRate: product?.purchaseTaxId?.percentage || 0,
              taxName: product?.purchaseTaxId?.name || "",
            };
          }),
        );
      }
      if (data.additionalCharges?.item) {
        setAdditionalChargeRows(data.additionalCharges.item.map((item: AdditionalChargeItem) => ({ chargeId: item.chargeId?._id || "", taxableAmount: item.value?.toString() || "", tax: item.taxRate?.toString() || "", taxAmount: ((item.total || 0) - (item.value || 0))?.toFixed(2) || "", totalAmount: item.total?.toString() || "" })));
      }
      if (data.summary?.flatDiscount) {
        setFlatDiscount(data.summary.flatDiscount);
      }
      if (data.summary?.roundOff) {
        setRoundOffAmount(data.summary.roundOff);
      }
      if (data.returnProductDetails?.summary?.roundOff) {
        setReturnRoundOffAmount(data.returnProductDetails.summary.roundOff);
      }
    }
  }, [data, isEditing]);

  const mapProductRows = (): SupplierBillProductDetails => {
    const item = rows.map((r) => ({
      productId: r.productId,
      qty: +r.qty || 0,
      freeQty: +r.freeQty || 0,
      mrp: +r.mrp || 0,
      sellingPrice: +r.sellingPrice || 0,
      landingCost: +r.landingCost || 0,
      margin: +r.margin || 0,
      discount1: +r.disc1 || 0,
      discount2: +r.disc2 || 0,
      taxAmount: +r.taxAmount || 0,
      total: +r.totalAmount || 0,
    }));
    return { item, totalQty: item.reduce((s, r) => s + r.qty!, 0), totalTax: item.reduce((s, r) => s + r.taxAmount!, 0), total: item.reduce((s, r) => s + r.total!, 0) };
  };
  const mapAdditionalCharges = (): AdditionalChargeDetails => {
    const item = additionalChargeRows.map(({ chargeId, taxableAmount, tax, totalAmount }) => ({ chargeId: { _id: chargeId }, value: +taxableAmount || 0, taxRate: +tax || 0, total: +totalAmount || 0 }));
    return { item, total: item.reduce((a, b) => a + b.total!, 0) };
  };
  const handleAdd = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCut = (index: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const calculateRow = (row: ProductRow): ProductRow => {
    const qty = parseFloat(String(row.qty)) || 0;
    const sellingPrice = parseFloat(String(row.sellingPrice)) || 0;
    const disc1 = parseFloat(String(row.disc1)) || 0;
    const disc2 = parseFloat(String(row.disc2)) || 0;
    const taxRate = parseFloat(String(row.taxRate)) || 0;
    const freeQty = parseFloat(String(row.freeQty)) || 0;
    const mrp = parseFloat(String(row.mrp)) || 0;
    const baseAmount = qty * sellingPrice;
    const taxableAmount = Math.max(0, baseAmount - disc1 - disc2);
    const taxAmount = (taxableAmount * taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;
    const totalQty = qty + freeQty;
    const landingCost = totalQty > 0 ? totalAmount / totalQty : 0;
    const margin = mrp - landingCost;
    return { ...row, taxAmount: taxAmount.toFixed(2), taxableAmount: taxableAmount.toFixed(2), totalAmount: totalAmount.toFixed(2), landingCost: landingCost.toFixed(2), margin: margin.toFixed(2) };
  };
  const calculateReturnRow = (row: ProductRow): ProductRow => {
    const qty = parseFloat(String(row.qty)) || 0;
    const landingCost = parseFloat(String(row.landingCost)) || 0;
    const disc1 = parseFloat(String(row.disc1)) || 0;
    const disc2 = parseFloat(String(row.disc2)) || 0;
    const taxAmount = parseFloat(String(row.taxAmount)) || 0;
    const baseAmount = qty * landingCost;
    const taxableAmount = Math.max(0, baseAmount - disc1 - disc2);
    const totalAmount = taxableAmount + taxAmount;
    return { ...row, taxableAmount: taxableAmount.toFixed(2), totalAmount: totalAmount.toFixed(2) };
  };
  const handleRowChange = (index: number, field: keyof ProductRow, value: string | number | string[]) => {
    setRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      let updatedRow = { ...newRows[index], [field]: finalValue };
      if (field === "productId") {
        if (!finalValue) {
          updatedRow = { ...emptyRow };
          newRows[index] = updatedRow;
          return newRows;
        }
        const product = (ProductsData?.data || []).find((p) => String(p._id) === String(finalValue));
        if (product) {
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", mrp: product.mrp || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0, taxRate: product.purchaseTaxId?.percentage || 0, taxName: product.purchaseTaxId?.name || "" };
        }
      }
      newRows[index] = calculateRow(updatedRow);
      if (field === "productId" && finalValue && index === prev.length - 1) {
        newRows.push({ ...emptyRow });
      }
      return newRows;
    });
  };
  const handleReturnRowChange = (index: number, field: keyof ProductRow, value: string | number | string[]) => {
    setReturnRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      let updatedRow = { ...newRows[index], [field]: finalValue };
      if (field === "productId") {
        if (!finalValue) {
          updatedRow = { ...emptyRow };
          newRows[index] = updatedRow;
          return newRows;
        }
        const product = (ProductsData?.data || []).find((p) => String(p._id) === String(finalValue));
        if (product) {
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", mrp: product.mrp || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0 };
        }
      }
      newRows[index] = calculateReturnRow(updatedRow);
      if (field === "productId" && finalValue && index === prev.length - 1) {
        newRows.push({ ...emptyRow });
      }
      return newRows;
    });
  };

  const handleAddReturn = () => {
    setReturnRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCutReturn = (index: number) => {
    setReturnRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const handleAddAdditionalCharge = () => {
    setAdditionalChargeRows((prev) => [...prev, { ...additionalChargeEmptyRow }]);
  };
  const handleCutAdditionalCharge = (index: number) => {
    setAdditionalChargeRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleAdditionalChargeRowChange = (index: number, field: keyof AdditionalChargeRow, value: string | number | string[]) => {
    setAdditionalChargeRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      newRows[index] = { ...newRows[index], [field]: finalValue };
      if (field === "taxableAmount" || field === "tax") {
        const val = parseFloat(String(newRows[index].taxableAmount)) || 0;
        const taxRate = parseFloat(String(newRows[index].tax)) || 0;
        const taxAmt = (val * taxRate) / 100;
        const total = val + taxAmt;
        newRows[index].taxAmount = taxAmt.toFixed(2);
        newRows[index].totalAmount = total.toFixed(2);
      }
      if (field === "chargeId" && finalValue && index === prev.length - 1) {
        newRows.push({ ...additionalChargeEmptyRow });
      }

      return newRows;
    });
  };
  const handleDeleteTerm = (index: number) => {
    const termToRemove = termsList[index];
    setTermsList((prev) => prev.filter((_, i) => i !== index));
    if (termToRemove?._id) {
      setSelectedTermIds((prev) => prev.filter((id) => id !== termToRemove._id));
    }
  };
  const defaultValues: SupplierBillFormValues = {
    supplierId: "",
    supplierBillNo: "",
    supplierBillDate: DateConfig.utc().toISOString(),
    taxType: "exclusive",
    paymentTerm: "",
    dueDate: "",
    reverseCharge: false,
    shippingDate: "",
    invoiceAmount: "",
    termsAndConditionIds: [],
    notes: "",
    paidAmount: 0,
    balanceAmount: 0,
    paymentStatus: "unpaid",
    status: "active",
    isActive: true,
  };
  const initialValues: SupplierBillFormValues = { ...defaultValues, ...data, supplierId: data?.supplierId?._id || defaultValues.supplierId, termsAndConditionIds: data?.termsAndConditionIds?.map((t: { _id: string }) => t._id) || [] };

  /* ========================= SUBMIT ========================= */
  const handleSubmit = async (values: SupplierBillFormValues, { resetForm }: FormikHelpers<SupplierBillFormValues>) => {
    const payload: SupplierBillFormValues = { ...values, productDetails: mapProductRows(), additionalCharges: mapAdditionalCharges(), termsAndConditionIds: selectedTermIds, notes, summary };
    if (isEditing) {
      editSupplierBill({ supplierBillId: data._id, ...payload }, { onSuccess: () => resetForm() });
    } else {
      addSupplierBill(payload, { onSuccess: () => resetForm() });
    }
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
                      <CommonValidationSelect name="paymentTerm" label="Payment Term" grid={{ xs: 12 }} options={PAYMENT_TERMS} />
                      <CommonValidationDatePicker name="dueDate" label="Due Date" grid={{ xs: 12 }} />
                      <CommonValidationSelect name="reverseCharge" label="Reverse Charge" grid={{ xs: 12 }} options={REVERSE_CHARGE} />
                      <CommonValidationDatePicker name="shippingDate" label="Shipping Date" grid={{ xs: 12 }} />
                      <CommonValidationSelect name="taxType" label="Tax Type" grid={{ xs: 12 }} options={TAX_TYPE} />
                      <CommonValidationTextField name="invoiceAmount" label="Invoice Amount" grid={{ xs: 12 }} />
                      <CommonValidationSwitch name="exportSez" label="Export / SEZ" />
                    </Box>
                  </Box>
                </CommonCard>
              </Form>
              <CommonCard hideDivider>
                <SupplierBillTabs tabValue={tabValue} setTabValue={setTabValue} rows={rows} handleAdd={handleAdd} handleCut={handleCut} handleRowChange={handleRowChange} returnRows={returnRows} handleAddReturn={handleAddReturn} handleCutReturn={handleCutReturn} handleReturnRowChange={handleReturnRowChange} termsList={termsList} handleDeleteTerm={handleDeleteTerm} notes={notes} setNotes={setNotes} setOpenModal={setOpenModal} productOptions={productOptions} isProductLoading={ProductsDataLoading} returnRoundOffAmount={returnRoundOffAmount} onReturnRoundOffAmountChange={setReturnRoundOffAmount} />
              </CommonCard>
              <CommonCard grid={{ xs: 12 }}>
                <AdditionalChargesSection showAdditionalCharge={showAdditionalCharge} setShowAdditionalCharge={setShowAdditionalCharge} additionalChargeRows={additionalChargeRows} handleAddAdditionalCharge={handleAddAdditionalCharge} handleCutAdditionalCharge={handleCutAdditionalCharge} handleAdditionalChargeRowChange={handleAdditionalChargeRowChange} taxOptions={taxOptions} isTaxLoading={TaxDataLoading} flatDiscount={flatDiscount} onFlatDiscountChange={setFlatDiscount} summary={summary} isAdditionalChargeLoading={additionalchargeLoading} additionalChargeOptions={additionalChargeOptions} roundOffAmount={roundOffAmount} onRoundOffAmountChange={setRoundOffAmount} />
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
