import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { CommonValidationTextField } from "../../../Attribute";
import { CommonCard } from "../../../Components/Common";
import type { PurchaseOrderFormValues, PurchaseOrderItem } from "../../../Types";
import TaxDetailsTable from "./TaxDetailsTable";
import { Queries } from "../../../Api";

const BillingSummary = () => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const { data: productData } = Queries.useGetProductDropdown();

  // ===== CALCULATIONS =====
  useEffect(() => {
    const items = values.items || [];

    const grossAmount = items.reduce((sum: number, item: PurchaseOrderItem) => sum + (Number(item.qty) * Number(item.unitCost) || 0), 0) || 0;

    const discount = Number(values.flatDiscount) || 0;
    const roundOff = Number(values.roundOff) || 0;

    const calculatedTax =
      items.reduce((acc: number, item: PurchaseOrderItem) => {
        const qty = Number(item.qty) || 0;
        const unitCost = Number(item.unitCost) || 0;
        const rate = values.taxType === "out_of_scope" ? 0 : Number(item.tax) || 0;

        if (values.taxType === "tax_inclusive") {
          const totalCtx = qty * unitCost;
          return acc + (totalCtx - totalCtx / (1 + rate / 100));
        } else {
          return acc + qty * unitCost * (rate / 100);
        }
      }, 0) || 0;

    const taxableAmount = grossAmount;

    let netAmount = 0;

    if (values.taxType === "tax_inclusive") {
      netAmount = grossAmount - discount + roundOff;
    } else {
      netAmount = grossAmount + calculatedTax - discount + roundOff;
    }

    setFieldValue("grossAmount", grossAmount);
    setFieldValue("taxableAmount", taxableAmount);
    setFieldValue("discountAmount", discount);
    setFieldValue("netAmount", netAmount);
  }, [values.items, values.taxType, values.flatDiscount, values.roundOff, setFieldValue]);

  // ===== DISPLAY SUMMARY =====
  const taxAmount = (values.items || []).reduce((acc: number, item: PurchaseOrderItem) => {
    const qty = Number(item.qty) || 0;
    const unitCost = Number(item.unitCost) || 0;
    const rate = values.taxType === "out_of_scope" ? 0 : Number(item.tax) || 0;

    if (values.taxType === "tax_inclusive") {
      const totalCtx = qty * unitCost;
      return acc + (totalCtx - totalCtx / (1 + rate / 100));
    } else {
      return acc + qty * unitCost * (rate / 100);
    }
  }, 0);

  const summary = {
    grossAmount: Number(values.grossAmount) || 0,
    discountAmount: Number(values.discountAmount) || 0,
    taxableAmount: Number(values.taxableAmount) || 0,
    taxAmount,
    netAmount: Number(values.netAmount) || 0,
  };

  return (
    <CommonCard hideDivider grid={{ xs: 12 }}>
      <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 320px" }, gap: 2 }}>
        {/* LEFT — TAX DETAILS */}
        <Box>{showTaxDetails && <TaxDetailsTable items={values.items || []} productData={productData?.data || []} taxType={values.taxType} />}</Box>
        {/* RIGHT — SUMMARY CARD */}
        <CommonCard hideDivider paperProps={{ sx: { border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", width: { xs: "100%", md: 320 } } }}>
          <Box className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200">
            {/* Flat Discount */}
            <Box className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-medium text-sm">Flat Discount</span>
              <Box width={110}>
                <CommonValidationTextField name="flatDiscount" type="number" isCurrency currencyDisabled />
              </Box>
            </Box>

            {/* Discount */}
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Discount</span>
              <span className="font-medium text-red-500">-{summary.discountAmount.toFixed(2)}</span>
            </Box>

            {/* Gross */}
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Gross Amount</span>
              <span className="font-medium">{summary.grossAmount.toFixed(2)}</span>
            </Box>

            {/* Taxable */}
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Taxable Amount</span>
              <span className="font-medium">{summary.taxableAmount.toFixed(2)}</span>
            </Box>

            {/* Tax */}
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm group cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" onClick={() => setShowTaxDetails(!showTaxDetails)}>
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                Tax
                <Box component="span" sx={{ fontSize: "10px", opacity: 0.7 }}>
                  {showTaxDetails ? "▲" : "▼"}
                </Box>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{summary.taxAmount.toFixed(2)}</span>
            </Box>

            {/* Roundoff */}
            <Box className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 text-sm">Roundoff</span>
              <Box width={110}>
                <CommonValidationTextField name="roundOff" type="number" />
              </Box>
            </Box>
            {/* Net */}
            <Box className="flex justify-between p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
              <span className="text-lg font-bold">Net Amount</span>
              <span className="text-xl font-black">₹{summary.netAmount.toFixed(2)}</span>
            </Box>
          </Box>
        </CommonCard>
      </Box>
    </CommonCard>
  );
};

export default BillingSummary;
