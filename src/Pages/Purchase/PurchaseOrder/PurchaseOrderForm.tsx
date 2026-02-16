import { Box, Grid } from "@mui/material";
import type { FormikHelpers, FormikProps } from "formik";
import { Form, Formik, useFormikContext } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS, TAX_TYPE } from "../../../Data";
import type { AddPurchaseOrderPayload, PurchaseOrderFormContentProps, PurchaseOrderFormValues, PurchaseOrderItem, Supplier, TermsConditionBase } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { PurchaseOrderFormSchema } from "../../../Utils/ValidationSchemas";
import { useEffect, useRef, useState } from "react";
import TermsSelectionModal from "../../../Components/Purchase/SupplierBill/TermsAndCondition/TermsSelectionModal";
import TermsAndConditionModal from "../../../Components/Purchase/SupplierBill/TermsAndCondition/TermsAndConditionModal";
import { useAppSelector } from "../../../Store/hooks";
import { ProductAndTerm } from "../../../Components/Purchase/PurchaseOrder";

const PurchaseOrderFormContent = ({ isEditing, addLoading, editLoading, navigate, resetForm, setFieldValue, dirty, supplierQueryEnabled, termsList, handleDeleteTerm }: PurchaseOrderFormContentProps & { termsList: TermsConditionBase[]; handleDeleteTerm: (index: number) => void }) => {
  const { values } = useFormikContext<PurchaseOrderFormValues>();
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" }, supplierQueryEnabled);

  const selectedSupplier = (supplierData?.data as Supplier[])?.find((s) => s._id === values.supplierId);

  return (
    <Form noValidate>
      <Grid container spacing={2}>
        {/* BASIC DETAILS */}
        <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/* ================= LEFT SIDE ================= */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <CommonValidationSelect name="supplierId" label="Select Supplier" required isLoading={supplierDataLoading} options={GenerateOptions(supplierData?.data)} />

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
                  <Box display="flex" gap={1}>
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
                      <Box color="text.secondary">-</Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* ================= RIGHT SIDE ================= */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={2}>
                  <CommonValidationDatePicker name="orderDate" label="Purchase Order Date" required grid={{ xs: 12, sm: 6, md: 4 }} />
                  <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12, sm: 6, md: 4 }} />
                  <CommonValidationTextField name="shippingNote" label="Shipping Note" grid={{ xs: 12, sm: 6, md: 4 }} />
                  {isEditing && <CommonValidationTextField name="orderNo" label="Purchase Order No." grid={{ xs: 12, sm: 6, md: 4 }} />}
                  <CommonValidationSelect name="taxType" label="Tax Type" required options={TAX_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} />
                  <CommonValidationSelect name="status" label="Order Status" required options={ORDER_STATUS} grid={{ xs: 12, sm: 6, md: 4 }} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CommonCard>

        <ProductAndTerm termsList={termsList} handleDeleteTerm={handleDeleteTerm} />

        <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={addLoading || editLoading} onClear={() => (isEditing ? navigate(-1) : resetForm())} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
      </Grid>
    </Form>
  );
};

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const formikRef = useRef<FormikProps<PurchaseOrderFormValues>>(null);

  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  const [allTerms, setAllTerms] = useState<TermsConditionBase[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const { data: termsConditionData } = Queries.useGetTermsCondition();
  const { isTermsSelectionModal } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (!isTermsSelectionModal.open && isTermsSelectionModal.data) {
      setSelectedTermIds(isTermsSelectionModal.data);
    }
  }, [isTermsSelectionModal]);

  useEffect(() => {
    if (!termsConditionData?.data) return;
    const response = termsConditionData.data;
    const all: TermsConditionBase[] = Array.isArray(response) ? response : (response.termsCondition_data ?? []);
    setAllTerms(all);
    if (isEditing && data?.termsAndConditionIds) {
      setSelectedTermIds(data.termsAndConditionIds.map((t: string | TermsConditionBase) => (typeof t === "string" ? t : t._id)));
    } else {
      const defaultTerms = all.filter((t) => t.isDefault);
      setSelectedTermIds(defaultTerms.map((t) => t._id));
    }
  }, [termsConditionData, isEditing, data]);

  const handleDeleteTerm = (index: number) => {
    const termToRemove = displayTerms[index];
    if (!termToRemove?._id) return;
    setSelectedTermIds((prev) => prev.filter((id) => id !== termToRemove._id));
  };

  const displayTerms = allTerms.filter((term) => selectedTermIds.includes(term._id)).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  const pageMode: "ADD" | "EDIT" = isEditing ? "EDIT" : "ADD";
  const initialValues: PurchaseOrderFormValues = {
    supplierId: data?.supplierId?._id || data?.supplierId || "",
    contactId: data?.contactId?._id || "",
    orderDate: data?.orderDate || data?.date || "",
    orderNo: data?.orderNo || "",
    shippingDate: data?.shippingDate || data?.date || data?.orderDate || "",
    shippingNote: data?.shippingNote || "",
    items: (data?.items || data?.item || data?.productDetails?.item || []).length
      ? (data?.items || data?.item || data?.productDetails?.item || []).map((item: PurchaseOrderItem) => {
          const product = (item.productId || {}) as { _id?: string; mrp?: number; purchasePrice?: number };
          return {
            ...item,
            productId: product?._id || (typeof item.productId === "string" ? item.productId : ""),
            qty: Number(item.qty ?? item.quantity ?? 1),
            freeQty: Number(item.freeQty ?? 0),
            mrp: Number(item.mrp ?? product?.mrp ?? 0),
            sellingPrice: Number(item.sellingPrice ?? item.selling_price ?? 0),
            discount1: Number(item.discount1 ?? item.disc1 ?? 0),
            discount2: Number(item.discount2 ?? item.disc2 ?? 0),
            taxableAmount: Number(item.taxableAmount ?? item.taxable_amount ?? 0),
            unitCost: Number(item.unitCost ?? item.price ?? item.rate ?? product.purchasePrice ?? 0),
            tax: item.tax && typeof item.tax === "object" ? String((item.tax as { percentage?: number }).percentage ?? 0) : String(item.taxRate ?? item.tax ?? 0),
            taxName: (item.tax && typeof item.tax === "object" ? (item.tax as { name?: string }).name : item.taxName) || "",
            landingCost: String(item.landingCost ?? 0),
            margin: String(item.margin ?? 0),
            total: Number(item.total ?? item.totalAmount ?? 0),
            taxAmount: Number(item.taxAmount ?? 0),
          } as PurchaseOrderItem;
        })
      : [{ productId: "", qty: 1, freeQty: 0, mrp: 0, sellingPrice: 0, discount1: 0, discount2: 0, taxableAmount: 0, unitCost: 0, tax: "0", landingCost: "0", margin: "0", total: 0 }],

    flatDiscount: data?.flatDiscount || 0,
    grossAmount: data?.grossAmount || 0,
    discountAmount: data?.discountAmount || 0,
    taxableAmount: data?.taxableAmount || 0,
    tax: data?.tax || 0,
    roundOff: data?.roundOff || 0,
    netAmount: data?.netAmount || 0,

    notes: data?.notes || "",
    status: ["in_progress", "delivered", "partially_delivered", "exceed", "completed", "cancelled"].includes(data?.status) ? data.status : "in_progress",
    taxType: data?.taxType || "tax_exclusive",
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
  };

  const handleSubmit = async (values: PurchaseOrderFormValues, { resetForm }: FormikHelpers<PurchaseOrderFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      termsAndConditionIds: selectedTermIds,
      items: rest.items?.map(({ taxAmount, taxName, taxRate, freeQty, mrp, sellingPrice, discount1, discount2, taxableAmount, unitCost, ...item }) => ({
        ...item,
        tax: String(item.tax || 0),
        landingCost: String(item.landingCost || 0),
        margin: String(item.margin || 0),
      })),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPurchaseOrder({ ...changedFields, purchaseOrderId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPurchaseOrder(RemoveEmptyFields(payload) as unknown as AddPurchaseOrderPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />
      <Box sx={{ p: 3, pb: 14 }}>
        <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={PurchaseOrderFormSchema} onSubmit={handleSubmit} enableReinitialize>
          {(formikProps) => <PurchaseOrderFormContent {...formikProps} isEditing={isEditing} addLoading={addLoading} editLoading={editLoading} navigate={navigate} termsList={displayTerms} handleDeleteTerm={handleDeleteTerm} />}
        </Formik>
      </Box>

      <TermsAndConditionModal
        onSave={(term: TermsConditionBase) => {
          setAllTerms((prev) => {
            const index = prev.findIndex((t) => t._id === term._id);
            if (index > -1) {
              const updated = [...prev];
              updated[index] = term;
              return updated;
            }
            return [...prev, term];
          });
          if (term.isDefault) {
            setSelectedTermIds((prev) => (prev.includes(term._id) ? prev : [...prev, term._id]));
          }
        }}
      />
      <TermsSelectionModal />
    </>
  );
};

export default PurchaseOrderForm;
