import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonSelect, CommonTextField } from "../../../Attribute";
import type { FC } from "react";
import type { AdditionalChargeRow } from "../../../Types/SupplierBill";

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
    taxAmount: number;
    roundOff: number;
    netAmount: number;
  };
}

const AdditionalChargesSection: FC<AdditionalChargesSectionProps> = ({ showAdditionalCharge, setShowAdditionalCharge, additionalChargeRows, handleAddAdditionalCharge, handleCutAdditionalCharge, handleAdditionalChargeRowChange, taxOptions, isTaxLoading, flatDiscount, onFlatDiscountChange, summary }) => {
  return (
    <>
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
                  <th className="p-2">Value</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {additionalChargeRows.map((_, index) => (
                  <tr key={index} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                    <td className="p-2 flex justify-center gap-1">
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
                    </td>

                    <td className="p-2">{index + 1}</td>

                    <td className="p-2 min-w-80 w-80">
                      <CommonSelect label="Search Additional" value={additionalChargeRows[index].chargeId ? [additionalChargeRows[index].chargeId] : []} options={[]} onChange={(v) => handleAdditionalChargeRowChange(index, "chargeId", v)} />
                    </td>

                    <td className="p-2 min-w-80 w-80">
                      <CommonTextField type="number" value={additionalChargeRows[index].taxableAmount} onChange={(v) => handleAdditionalChargeRowChange(index, "taxableAmount", v)} />
                    </td>

                    <td className="p-2 min-w-80 w-80">
                      <CommonSelect value={additionalChargeRows[index].tax ? [additionalChargeRows[index].tax] : []} options={taxOptions} isLoading={isTaxLoading} onChange={(v) => handleAdditionalChargeRowChange(index, "tax", v)} />
                    </td>

                    <td className="p-2 text-right">{additionalChargeRows[index].totalAmount || 0}</td>
                  </tr>
                ))}

                <tr className="bg-gray-50 dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200">
                  <td colSpan={5} className="p-2 text-right">
                    Total
                  </td>
                  <td className="p-2 text-right">{additionalChargeRows.reduce((a, b) => a + (parseFloat(b.totalAmount) || 0), 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {/* ===== SUMMARY ===== */}
      <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: "1fr 300px", gap: 2 }}>
        <Box />
        <Box className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
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
          <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
            <span>Tax</span>
            <span>{summary.taxAmount.toFixed(2)}</span>
          </Box>
          <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
            <span>Roundoff</span>
            <span>{summary.roundOff.toFixed(2)}</span>
          </Box>
          <Box className="flex justify-between p-3 text-lg font-semibold">
            <span>Net Amount</span>
            <span>
              <span>{summary.netAmount.toFixed(2)}</span>
            </span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdditionalChargesSection;
