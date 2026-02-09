import { Box } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikProps } from "formik";
import { useLocation } from "react-router-dom";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions } from "../../../Utils";
import type { Supplier, SupplierBillFormValues, ProductRow, AdditionalChargeRow, SupplierBillProductDetails, AdditionalChargeDetails, SupplierBillProductItem, AdditionalChargeItem } from "../../../Types/SupplierBill";
import { BREADCRUMBS } from "../../../Data";
import { Mutations, Queries } from "../../../Api";
import { useEffect, useRef, useState } from "react";
import TermsAndConditionModal from "./TermsAndConditionModal";
import SupplierBillTabs from "./SupplierBillTab";
import AdditionalChargesSection from "./AdditionalChargeSection";
import SupplierBillDetails from "./SupplierBillDetails";
import type { TermsConditionBase } from "../../../Types/TermsAndCondition";
import type { ProductBase } from "../../../Types";

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
  const [termsList, setTermsList] = useState<TermsConditionBase[]>([]);
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
    const itemDiscount = rows.reduce((s, r) => s + (Number(r.disc1) || 0) + (Number(r.disc2) || 0), 0);
    const itemTaxable = rows.reduce((s, r) => s + (Number(r.taxableAmount) || 0), 0);
    const itemTax = rows.reduce((s, r) => s + (Number(r.taxAmount) || 0), 0);
    const itemGross = rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.sellingPrice) || 0), 0);
    const additionalTaxable = additionalChargeRows.reduce((s, r) => s + (Number(r.taxableAmount) || 0), 0);
    const additionalTax = additionalChargeRows.reduce((s, r) => s + (Number(r.taxAmount) || 0), 0);
    const grossAmount = itemGross + additionalTaxable;
    const taxableAmount = itemTaxable + additionalTaxable;
    const taxAmount = itemTax + additionalTax;
    const discount = Number(flatDiscount) || 0;
    const roundOff = Number(roundOffAmount) || 0;
    const netAmount = taxableAmount + taxAmount - discount + roundOff;
    const taxBreakdown: Record<string, { rate: number; amount: number }> = {};
    rows.forEach((r) => {
      if (r.taxName && r.taxAmount) {
        const name = r.taxName;
        const rate = Number(r.taxRate) || 0;
        const amount = Number(r.taxAmount) || 0;
        if (!taxBreakdown[name]) {
          taxBreakdown[name] = { rate, amount: 0 };
        }
        taxBreakdown[name].amount += amount;
      }
    });
    additionalChargeRows.forEach((r) => {
      if (r.tax && r.taxAmount) {
        const rateStr = r.tax;
        const amount = Number(r.taxAmount) || 0;
        const taxOption = taxOptions.find((o) => o.value === String(rateStr));
        const name = taxOption ? taxOption.label : `Tax ${rateStr}%`;
        const rate = parseFloat(String(rateStr)) || 0;
        if (!taxBreakdown[name]) {
          taxBreakdown[name] = { rate, amount: 0 };
        }
        taxBreakdown[name].amount += amount;
      }
    });
    const taxSummary = Object.entries(taxBreakdown).map(([name, data]) => ({ name, rate: data.rate, amount: Number(data.amount.toFixed(2)) }));
    return { itemDiscount, grossAmount, taxableAmount, taxAmount, roundOff, netAmount, taxSummary };
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
    const qty = Number(row.qty) || 0;
    const unitCost = Number(row.unitCost) || 0;
    const taxRate = Number(row.taxRate) || 0;
    let mrp = Number(row.mrp) || 0;
    let sellingPrice = Number(row.sellingPrice) || 0;
    const disc1 = Number(row.disc1) || 0;
    const disc2 = Number(row.disc2) || 0;
    const discount = disc1 + disc2;
    const taxablePerUnit = unitCost;
    const taxPerUnit = (unitCost * taxRate) / 100;
    const landingCost = unitCost + taxablePerUnit + taxPerUnit;
    if (mrp > 0 && mrp < landingCost) {
      mrp = landingCost;
    }
    if (!sellingPrice || sellingPrice < landingCost) {
      sellingPrice = mrp || landingCost;
    }
    sellingPrice = Math.max(0, sellingPrice - discount);
    const margin = sellingPrice - landingCost;
    const totalAmount = landingCost * qty;
    return { ...row, taxableAmount: (taxablePerUnit * qty).toFixed(2), taxAmount: (taxPerUnit * qty).toFixed(2), landingCost: landingCost.toFixed(2), sellingPrice: sellingPrice.toFixed(2), mrp: mrp ? mrp.toFixed(2) : "", margin: margin.toFixed(2), totalAmount: totalAmount.toFixed(2) };
  };

  const calculateReturnRow = (row: ProductRow): ProductRow => {
    const qty = Number(row.qty) || 0;
    const unitCost = Number(row.unitCost) || 0;
    const taxRate = Number(row.taxRate) || 0;
    const disc1 = Number(row.disc1) || 0;
    const disc2 = Number(row.disc2) || 0;
    const discountPerUnit = disc1 + disc2;
    const taxablePerUnit = unitCost;
    const taxPerUnit = (unitCost * taxRate) / 100;
    const landingCost = unitCost + taxablePerUnit + taxPerUnit - discountPerUnit;
    const finalLandingCost = Math.max(0, landingCost);
    const totalAmount = finalLandingCost * qty;
    return { ...row, taxableAmount: (taxablePerUnit * qty).toFixed(2), taxAmount: (taxPerUnit * qty).toFixed(2), landingCost: finalLandingCost.toFixed(2), totalAmount: totalAmount.toFixed(2) };
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
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", unitCost: product.purchasePrice || 0, mrp: product.mrp || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0, taxRate: product.purchaseTaxId?.percentage || 0, taxName: product.purchaseTaxId?.name || "" };
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
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", unitCost: product.purchasePrice || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0, taxRate: product.purchaseTaxId?.percentage || 0, taxName: product.purchaseTaxId?.name || "" };
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
      if (field === "chargeId") {
        const selectedCharge = additionalchargedata?.data?.find((c: any) => c._id === finalValue);
        if (selectedCharge) {
          const chargeValue = (selectedCharge as any).defaultValue?.value || 0;
          newRows[index].taxableAmount = String(chargeValue);
          const val = parseFloat(String(chargeValue)) || 0;
          const taxRate = parseFloat(String(newRows[index].tax)) || 0;
          const taxAmt = (val * taxRate) / 100;
          const total = val + taxAmt;
          newRows[index].taxAmount = taxAmt.toFixed(2);
          newRows[index].totalAmount = total.toFixed(2);
        }
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
                <CommonCard title="Supplier Bill Details">
                  <SupplierBillDetails supplierOptions={supplierOptions} selectedSupplier={selectedSupplier} isEditing={isEditing} />
                </CommonCard>
              </Form>
              <CommonCard hideDivider>
                <SupplierBillTabs tabValue={tabValue} setTabValue={setTabValue} rows={rows} handleAdd={handleAdd} handleCut={handleCut} handleRowChange={handleRowChange} returnRows={returnRows} handleAddReturn={handleAddReturn} handleCutReturn={handleCutReturn} handleReturnRowChange={handleReturnRowChange} termsList={termsList} handleDeleteTerm={handleDeleteTerm} notes={notes} setNotes={setNotes} setOpenModal={setOpenModal} productOptions={productOptions} isProductLoading={ProductsDataLoading} returnRoundOffAmount={returnRoundOffAmount} onReturnRoundOffAmountChange={setReturnRoundOffAmount} />
              </CommonCard>
              <CommonCard grid={{ xs: 12 }} hideDivider>
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
        onSave={(term: TermsConditionBase) => {
          setTermsList((prev) => [...prev, term]);
          setSelectedTermIds((prev) => [...prev, term._id]);
        }}
      />
    </>
  );
};
export default SupplierBillForm;
