import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonSelect, CommonTextField } from "../../../Attribute";
import CommonCard from "../../../Components/Common/CommonCard";
import { useState, type FC } from "react";
import type { AdditionalChargeRow } from "../../../Types/SupplierBill";
import { CommonTable } from "../../../Components/Common";
import type { CommonTableColumn } from "../../../Types";

interface AdditionalChargesSectionProps {
  showAdditionalCharge: boolean;
  setShowAdditionalCharge: (value: boolean) => void;
  additionalChargeRows: AdditionalChargeRow[];
  handleAddAdditionalCharge: () => void;
  handleCutAdditionalCharge: (index: number) => void;
  handleAdditionalChargeRowChange: (index: number, field: keyof AdditionalChargeRow, value: string | number | string[]) => void;
  taxOptions: { label: string; value: string }[];
  isTaxLoading: boolean;
  flatDiscount: string | number;
  onFlatDiscountChange: (value: string | number) => void;
  summary: {
    itemDiscount: number;
    grossAmount: number;
    taxableAmount: number;
    itemTax: number;
    roundOff: number;
    netAmount: number;
    taxSummary: { name: string; rate: number; amount: number }[];
  };
  isAdditionalChargeLoading: boolean;
  additionalChargeOptions: { label: string; value: string }[];
  roundOffAmount: string | number;
  onRoundOffAmountChange: (value: string | number) => void;
}

const AdditionalChargesSection: FC<AdditionalChargesSectionProps> = ({ showAdditionalCharge, setShowAdditionalCharge, additionalChargeRows, handleAddAdditionalCharge, handleCutAdditionalCharge, handleAdditionalChargeRowChange, taxOptions, isTaxLoading, flatDiscount, onFlatDiscountChange, summary, isAdditionalChargeLoading, additionalChargeOptions, roundOffAmount, onRoundOffAmountChange }) => {
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  const AdditionalChargeColumns: CommonTableColumn<AdditionalChargeRow>[] = [
    {
      key: "actions",
      header: "",
      bodyClass: "p-2 flex justify-center gap-1",
      render: (_, index) => (
        <>
          {index === additionalChargeRows.length - 1 && (
            <CommonButton size="small" variant="outlined" onClick={handleAddAdditionalCharge}>
              <AddIcon />
            </CommonButton>
          )}
          {additionalChargeRows.length > 1 && (
            <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCutAdditionalCharge(index)}>
              <ClearIcon />
            </CommonButton>
          )}
        </>
      ),
      footer: () => <span className="p-2 text-right block">Total</span>,
      footerClass: "text-right",
    },
    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10", footer: "" },
    { key: "chargeId", header: "Additional Charge", headerClass: "text-start", bodyClass: "min-w-80 w-80 text-start", render: (row, index) => <CommonSelect label="Search Additional" value={row.chargeId ? [row.chargeId] : []} options={additionalChargeOptions} isLoading={isAdditionalChargeLoading} onChange={(v) => handleAdditionalChargeRowChange(index, "chargeId", v)} />, footer: "" },
    { key: "taxableAmount", header: "Value", bodyClass: "min-w-80 w-80", render: (row, index) => <CommonTextField type="number" value={row.taxableAmount} onChange={(v) => handleAdditionalChargeRowChange(index, "taxableAmount", v)} />, footer: "" },
    { key: "tax", header: "Tax", bodyClass: "min-w-80 w-80", render: (row, index) => <CommonSelect value={row.tax ? [row.tax] : []} options={taxOptions} isLoading={isTaxLoading} onChange={(v) => handleAdditionalChargeRowChange(index, "tax", v)} />, footer: "" },
    { key: "totalAmount", header: "Total", headerClass: "text-right", bodyClass: "p-2 text-right", render: (row) => row.totalAmount || 0, footer: (data) => data.reduce((a, b) => a + (parseFloat(b.totalAmount) || 0), 0).toFixed(2), footerClass: "text-right" },
  ];

  const taxBreakdownColumns: CommonTableColumn<{
    name: string;
    rate: number;
    amount: number;
  }>[] = [
    { key: "name", header: "Tax", headerClass: "text-left px-4 w-52", bodyClass: "text-left px-4 w-52" },
    { key: "rate", header: "Tax Rate", headerClass: "text-center px-4 w-32", bodyClass: "text-center px-4 w-32 whitespace-nowrap", render: (row) => `${row.rate}%` },
    { key: "amount", header: "Tax Amount", headerClass: "text-right px-4 w-36", bodyClass: "text-right px-4 w-36 whitespace-nowrap font-medium", render: (row) => row.amount.toFixed(2) },
  ];

  return (
    <CommonCard hideDivider>
      <Box p={2}>
        {!showAdditionalCharge && (
          <CommonButton size="small" startIcon={<AddIcon fontSize="small" />} onClick={() => setShowAdditionalCharge(true)}>
            Add Additional Charges
          </CommonButton>
        )}

        {showAdditionalCharge && (
          <CommonCard
            hideDivider
            title="Additional Charge"
            topContent={
              <CommonButton size="small" color="error" variant="outlined" onClick={() => setShowAdditionalCharge(false)}>
                <ClearIcon fontSize="small" />
              </CommonButton>
            }
          >
            <Box sx={{ p: 2, overflowX: "auto" }}>
              <Box sx={{ border: "1px solid", borderColor: "divider" }}>
                <CommonTable data={additionalChargeRows} columns={AdditionalChargeColumns} rowKey={(_, i) => i} showFooter />
              </Box>
            </Box>
          </CommonCard>
        )}

        {/* ===== SUMMARY ===== */}
        <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 300px" }, gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            {showTaxBreakdown && (
              <Box sx={{ width: "100%", maxWidth: 600, border: "1px solid", borderColor: "divider", borderRadius: 1, backgroundColor: "background.paper" }}>
                <CommonTable data={summary.taxSummary} columns={taxBreakdownColumns} rowKey={(r) => r.name} />
              </Box>
            )}
          </Box>
          <CommonCard hideDivider>
            <Box className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Flat Discount</span>
                <CommonTextField type="number" value={flatDiscount} onChange={onFlatDiscountChange} isCurrency currencyDisabled />
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Item Discount</span>
                <span>{summary.itemDiscount.toFixed(2)}</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Gross Amount</span>
                <span>{summary.grossAmount.toFixed(2)}</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Taxable Amount</span>
                <span>{summary.taxableAmount.toFixed(2)}</span>
              </Box>
              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600 cursor-pointer" onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}>
                <span>Tax</span>
                <span>{summary.itemTax.toFixed(2)}</span>
              </Box>
              <Box className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                <span>Roundoff</span>
                <Box width={100}>
                  <CommonTextField type="number" value={roundOffAmount} onChange={onRoundOffAmountChange} />
                </Box>
              </Box>
              <Box className="flex justify-between p-3 text-lg font-semibold">
                <span>Net Amount</span>
                <span>
                  <span>{summary.netAmount.toFixed(2)}</span>
                </span>
              </Box>
            </Box>
          </CommonCard>
        </Box>
      </Box>
    </CommonCard>
  );
};
export default AdditionalChargesSection;
