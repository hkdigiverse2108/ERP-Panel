import { Add, Clear, Edit } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonTabPanel } from "../../../Components/Common";
import CommonTable from "../../../Components/Common/CommonTable";
import { GenerateOptions } from "../../../Utils";
import type { CommonTableColumn, ProductBase, ProductSelectCellProps, PurchaseOrderFormValues, PurchaseOrderItem, TaxBase, TermsConditionBase } from "../../../Types";
import { setTermsAndConditionModal, setTermsSelectionModal } from "../../../Store/Slices/ModalSlice";
import BillingSummary from "./BillingSummary";
import { GridDeleteIcon } from "@mui/x-data-grid";

const ProductSelectCell = ({ index, productData, taxData, isLoading }: ProductSelectCellProps) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const productId = values.items?.[index]?.productId;
  const prevProductId = useRef(productId);

  useEffect(() => {
    if (productId && productId !== prevProductId.current) {
      // Product Changed
      const productList = productData?.data || [];
      const product = productList?.find((p: ProductBase) => p._id === productId);
      if (product) {
        const taxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId as unknown as { _id: string })?._id : product.purchaseTaxId;
        const tax = taxData?.data?.find((t: TaxBase) => t._id === taxId);

        if (tax && tax.percentage !== undefined) {
          setFieldValue(`items.${index}.tax`, tax.percentage);
          setFieldValue(`items.${index}.taxName`, tax.name || (tax as TaxBase & { taxName?: string }).taxName || "");
          setFieldValue(`items.${index}.taxRate`, tax.percentage);
        }
        setFieldValue(`items.${index}.qty`, 1);
        setFieldValue(`items.${index}.unitCost`, product.landingCost || 0);
        setFieldValue(`items.${index}.mrp`, product.mrp || 0);
      }
      prevProductId.current = productId;
    }
  }, [productId, productData, taxData, setFieldValue, index]);

  return <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" isLoading={isLoading} options={GenerateOptions(productData?.data)} required size="small" />;
};

const TotalInputCell = ({ index }: { index: number }) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const item = values.items?.[index];

  if (!item) return null;

  const handleTotalChange = (value: string) => {
    const newTotal = Number(value) || 0;
    setFieldValue(`items.${index}.total`, newTotal);

    const qty = Number(item.qty) || 0;
    const taxPercent = Number(item.tax) || 0;
    const isTaxInclusive = values.taxType === "tax_inclusive";

    if (qty > 0) {
      const landingCost = newTotal / qty;
      let unitCost = 0;

      if (isTaxInclusive) {
        unitCost = landingCost;
      } else {
        unitCost = landingCost / (1 + taxPercent / 100);
      }
      setFieldValue(`items.${index}.unitCost`, unitCost);
    }
  };

  return <CommonTextField type="number" onChange={handleTotalChange} value={item.total || 0} />;
};

const ProductAndTerm = ({ termsList, handleDeleteTerm }: { termsList: TermsConditionBase[]; handleDeleteTerm: (index: number) => void }) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown();
  const { data: taxData } = Queries.useGetTaxDropdown();

  const handleOpenAddTerm = () => {
    dispatch(setTermsAndConditionModal({ open: true, data: null }));
  };

  const handleEditTerm = (term: TermsConditionBase) => {
    dispatch(setTermsAndConditionModal({ open: true, data: term }));
  };

  const handleOpenSelectTerms = () => {
    dispatch(setTermsSelectionModal({ open: true, data: values.termsAndConditionIds }));
  };

  useEffect(() => {
    let hasChanges = false;
    const newItems = values.items?.map((item: PurchaseOrderItem) => {
      // 1. Calculate Landing Cost
      const unitCost = Number(item.unitCost) || 0;
      const isOutOfScope = values.taxType === "out_of_scope";
      const taxPercent = isOutOfScope ? 0 : Number(item.tax) || 0;
      const isTaxInclusive = values.taxType === "tax_inclusive";

      let landingCost = 0;
      let taxAmount = 0;

      if (isTaxInclusive && !isOutOfScope) {
        landingCost = unitCost;
        const qty = Number(item.qty) || 0;
        const totalCtx = qty * unitCost;
        taxAmount = totalCtx - totalCtx / (1 + taxPercent / 100);
      } else {
        landingCost = unitCost + (unitCost * taxPercent) / 100;
        // Exclusive
        const qty = Number(item.qty) || 0;
        taxAmount = qty * unitCost * (taxPercent / 100);
      }
      const mrp = Number(item.mrp) || 0;
      const discount = Number(item.discount1) || 0;
      const sellingPrice = mrp - discount;
      const margin = sellingPrice > 0 ? sellingPrice - unitCost : 0;

      // 3. Calculate Line Total
      const quantity = Number(item.qty) || 0;
      const total = quantity * landingCost;

      const newItem = { ...item };
      let itemChanged = false;

      if (Number(newItem.landingCost) !== Number(landingCost.toFixed(2))) {
        newItem.landingCost = landingCost.toFixed(2);
        itemChanged = true;
      }
      if (Number(newItem.sellingPrice) !== Number(sellingPrice.toFixed(2))) {
        newItem.sellingPrice = sellingPrice.toFixed(2);
        itemChanged = true;
      }
      if (Number(newItem.margin) !== Number(margin.toFixed(2))) {
        newItem.margin = margin.toFixed(2);
        itemChanged = true;
      }
      if (Number(newItem.total) !== Number(total.toFixed(2))) {
        newItem.total = total.toFixed(2);
        itemChanged = true;
      }
      if (Number(newItem.taxAmount) !== Number(taxAmount.toFixed(2))) {
        newItem.taxAmount = taxAmount.toFixed(2);
        itemChanged = true;
      }

      if (itemChanged) hasChanges = true;
      return newItem;
    });

    if (hasChanges) {
      setFieldValue("items", newItems);
    }
  }, [values.items, values.taxType, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

  return (
    <>
      <CommonCard hideDivider grid={{ xs: 12 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Product Details" />
              <Tab label="Terms & Conditions" />
            </Tabs>
          </Box>

          {/* TAB 0: PRODUCT DETAILS */}
          <CommonTabPanel value={tabValue} index={0}>
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 1200 }}>
                <FieldArray name="items">
                  {({ push, remove }) => {
                    const columns: CommonTableColumn<PurchaseOrderItem>[] = [
                      {
                        key: "action",
                        header: "",
                        headerClass: "text-center",
                        bodyClass: "text-center w-[100px]",
                        render: (_row, index) => (
                          <Box display="flex" justifyContent="center" gap={1}>
                            {index === (values.items?.length || 0) - 1 && (
                              <CommonButton size="small" variant="outlined" onClick={() => push({ productId: "", qty: 1, freeQty: 0, mrp: 0, sellingPrice: 0, discount1: 0, discount2: 0, taxableAmount: 0, unitCost: 0, tax: "0", landingCost: "0", margin: "0", total: 0 })}>
                                <Add fontSize="small" />
                              </CommonButton>
                            )}

                            {(values.items?.length || 0) > 1 && (
                              <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                <Clear fontSize="small" />
                              </CommonButton>
                            )}
                          </Box>
                        ),
                        footer: "Total",
                      },
                      { key: "sr", header: "#", bodyClass: "align-middle text-center w-[50px]", render: (_row, index) => index + 1 },
                      { key: "productId", header: "Product*", bodyClass: "min-w-[200px]", render: (_row, index) => <ProductSelectCell index={index} productData={productData} taxData={taxData} isLoading={productDataLoading} /> },
                      { key: "mrp", header: "MRP", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.mrp`} type="number" /> },
                      { key: "qty", header: "Qty", bodyClass: "min-w-[80px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.qty`} type="number" /> },
                      { key: "unitCost", header: "Unit Cost", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.unitCost`} type="number" /> },
                      {
                        key: "tax",
                        header: "Tax",
                        bodyClass: "min-w-[120px] text-center",
                        render: (row) => (
                          <Box className="flex flex-col items-center">
                            <span className="text-sm font-medium">
                              {row.tax}% (₹{row.taxAmount})
                            </span>
                            <span className="text-xs text-gray-500">{row.taxName}</span>
                          </Box>
                        ),
                      },
                      { key: "landingCost", header: "Landing Cost", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.landingCost`} type="number" disabled /> },
                      { key: "margin", header: "Margin", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.margin`} type="number" disabled /> },
                      { key: "total", header: "Total", bodyClass: "min-w-[120px]", render: (_row, index) => <TotalInputCell index={index} />, footer: (data) => data.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toFixed(2) },
                    ];

                    return <CommonTable showFooter data={values.items || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                  }}
                </FieldArray>
              </Box>
            </Box>
          </CommonTabPanel>

          <CommonTabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              {/* HEADER */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box fontWeight={600}>Terms & Conditions</Box>

                <Box display="flex" gap={1}>
                  <CommonButton size="small" startIcon={<Add />} onClick={handleOpenAddTerm} variant="outlined">
                    New Term
                  </CommonButton>
                  <CommonButton size="small" onClick={handleOpenSelectTerms} variant="outlined">
                    <Edit fontSize="small" /> Edit Terms
                  </CommonButton>
                </Box>
              </Box>
              {/* TABLE */}
              {(() => {
                const columns: CommonTableColumn<TermsConditionBase>[] = [
                  { key: "sr", header: "#", bodyClass: "align-middle text-center w-[60px]", render: (_row, index) => index + 1 },
                  {
                    key: "termsCondition",
                    header: "Condition",
                    headerClass: "text-left pl-6",
                    bodyClass: "min-w-[400px] text-left pl-6",
                  },
                  {
                    key: "action",
                    header: "Action",
                    headerClass: "text-center",
                    bodyClass: "text-center w-[120px]",
                    render: (row, index) => (
                      <Box display="flex" justifyContent="center" gap={1}>
                        <CommonButton size="small" color="primary" variant="outlined" onClick={() => handleEditTerm(row)}>
                        <Edit fontSize="small" />
                        </CommonButton>
                        <CommonButton size="small" color="error" variant="outlined" onClick={() => handleDeleteTerm(index)}>
                           <GridDeleteIcon fontSize="small" />
                        </CommonButton>
                      </Box>
                    ),
                  },
                ];
                return (
                  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                    <CommonTable data={termsList || []} columns={columns} rowKey={(row) => row._id || ""} getRowClass={() => "align-top"} />{" "}
                  </Box>
                );
              })()}
              {/* NOTE */}
              <Box mt={3}>
                <CommonValidationTextField name="notes" label="Note" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
              </Box>
            </Box>
          </CommonTabPanel>
        </Box>
      </CommonCard>

      {/* BILLING SUMMARY - Separated outside TabPanel */}
      <BillingSummary />
    </>
  );
};
export default ProductAndTerm;
