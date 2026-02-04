import { Box, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";

import { CommonButton, CommonSelect, CommonTextField } from "../../../Attribute";
import type { TermsAndCondition, ProductRow } from "../../../Types/SupplierBill";
import type { FC } from "react";
import { CommonTabPanel } from "../../../Components/Common";

interface SupplierBillTabsProps {
  tabValue: number;
  setTabValue: (value: number) => void;
  rows: ProductRow[];
  handleAdd: () => void;
  handleCut: (index: number) => void;
  handleRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  termsList: TermsAndCondition[];
  notes: string;
  setNotes: (value: string) => void;
  setOpenModal: (value: boolean) => void;
  returnRows: ProductRow[];
  handleAddReturn: () => void;
  handleCutReturn: (index: number) => void;
  handleReturnRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  productOptions: { label: string; value: string }[];
  isProductLoading: boolean;
}

const SupplierBillTabs: FC<SupplierBillTabsProps> = ({ tabValue, setTabValue, rows, handleAdd, handleCut, handleRowChange, termsList, notes, setNotes, setOpenModal, returnRows, handleAddReturn, handleCutReturn, handleReturnRowChange, productOptions, isProductLoading }) => {
  return (
    <>
      {/* ================= TABS HEADER ================= */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Product Details" />
          <Tab label="Terms & Conditions" />
          <Tab label="Return Product Details" />
        </Tabs>
      </Box>

      {/* ================= TAB 1 : PRODUCT DETAILS ================= */}
      <CommonTabPanel value={tabValue} index={0}>
        <Box sx={{ mt: 2, overflowX: "auto" }}>
          <Box sx={{ minWidth: 1400 }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2">#</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Free Qty</th>
                  <th className="p-2">MRP</th>
                  <th className="p-2">Selling</th>
                  <th className="p-2">Disc 1</th>
                  <th className="p-2">Disc 2</th>
                  <th className="p-2">Taxable</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2">Landing</th>
                  <th className="p-2">Margin</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((_, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 flex justify-center gap-1">
                      {index === rows.length - 1 && (
                        <CommonButton size="small" variant="outlined" onClick={handleAdd}>
                          <AddIcon fontSize="small" />
                        </CommonButton>
                      )}
                      {rows.length > 1 && (
                        <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(index)}>
                          <ClearIcon fontSize="small" />
                        </CommonButton>
                      )}
                    </td>

                    <td className="p-2">{index + 1}</td>

                    <td className="p-2 min-w-60">
                      <CommonSelect label="Search Product" value={rows[index].productId ? [rows[index].productId] : []} options={productOptions} isLoading={isProductLoading} onChange={(v) => handleRowChange(index, "productId", v)} />
                    </td>

                    {/* Qty */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].qty} onChange={(v) => handleRowChange(index, "qty", v)} />
                    </td>
                    {/* Free Qty */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].freeQty} onChange={(v) => handleRowChange(index, "freeQty", v)} />
                    </td>
                    {/* MRP */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].mrp} onChange={(v) => handleRowChange(index, "mrp", v)} />
                    </td>
                    {/* Selling */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].sellingPrice} onChange={(v) => handleRowChange(index, "sellingPrice", v)} />
                    </td>
                    {/* Disc 1 */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].disc1} onChange={(v) => handleRowChange(index, "disc1", v)} isCurrency currencyDisabled />
                    </td>
                    {/* Disc 2 */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].disc2} onChange={(v) => handleRowChange(index, "disc2", v)} isCurrency currencyDisabled />
                    </td>
                    {/* Taxable */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].taxableAmount} onChange={(v) => handleRowChange(index, "taxableAmount", v)} />
                    </td>
                    {/* Tax */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].taxAmount} onChange={(v) => handleRowChange(index, "taxAmount", v)} />
                    </td>
                    {/* Landing */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].landingCost} onChange={(v) => handleRowChange(index, "landingCost", v)} />
                    </td>
                    {/* Margin */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].margin} onChange={(v) => handleRowChange(index, "margin", v)} />
                    </td>
                    {/* Total */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value={rows[index].totalAmount} onChange={(v) => handleRowChange(index, "totalAmount", v)} />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="p-2 text-right">
                    Total
                  </td>
                  {/* Qty */}
                  <td className="p-2 text-center">{rows.reduce((a, b) => a + (+b.qty || 0), 0)}</td>
                  {/* Free Qty */}
                  <td className="p-2 text-center">{rows.reduce((a, b) => a + (+b.freeQty || 0), 0)}</td>
                  {/* MRP */}
                  <td></td>
                  {/* Selling */}
                  <td></td>
                  {/* Disc 1 */}
                  <td></td>
                  {/* Disc 2 */}
                  <td></td>
                  {/* Taxable */}
                  <td className="p-2 text-right">{rows.reduce((a, b) => a + (+b.taxableAmount || 0), 0).toFixed(2)}</td>
                  {/* Tax */}
                  <td className="p-2 text-right">{rows.reduce((a, b) => a + (+b.taxAmount || 0), 0).toFixed(2)}</td>
                  {/* Landing */}
                  <td></td>
                  {/* Margin */}
                  <td></td>
                  {/* Total */}
                  <td className="p-2 text-right">{rows.reduce((a, b) => a + (+b.totalAmount || 0), 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </CommonTabPanel>

      {/* ================= TAB 2 : TERMS ================= */}
      <CommonTabPanel value={tabValue} index={1}>
        <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
          <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box fontWeight={600}>Terms & Conditions</Box>
              <CommonButton startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                New Term
              </CommonButton>
            </Box>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 w-10">#</th>
                  <th className="p-2 text-left">Condition</th>
                </tr>
              </thead>
              <tbody>
                {termsList.map((term, index) => (
                  <tr key={term._id}>
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
            <CommonTextField multiline rows={4} value={notes} onChange={(v: string) => setNotes(v)} />
            <Box mt={1} fontSize={12}>
              {notes.length}/200 characters
            </Box>
          </Box>
        </Box>
      </CommonTabPanel>

      {/* ================= TAB 3 : RETURN PRODUCT ================= */}
      <CommonTabPanel value={tabValue} index={2}>
        <Box sx={{ mt: 2 }}>
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
                {returnRows.map((_, index) => (
                  <tr key={index} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                    <td className="p-2 flex justify-center gap-1">
                      {index === returnRows.length - 1 && (
                        <CommonButton size="small" variant="outlined" onClick={handleAddReturn}>
                          <AddIcon />
                        </CommonButton>
                      )}
                      {returnRows.length > 1 && (
                        <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCutReturn(index)}>
                          <ClearIcon />
                        </CommonButton>
                      )}
                    </td>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 min-w-60 w-60  text-start">
                      <CommonSelect label="Search Product" value={returnRows[index].productId ? [returnRows[index].productId] : []} options={productOptions} isLoading={isProductLoading} onChange={(v) => handleReturnRowChange(index, "productId", v)} />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].qty} onChange={(v) => handleReturnRowChange(index, "qty", v)} />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].disc1} onChange={(v) => handleReturnRowChange(index, "disc1", v)} isCurrency currencyDisabled />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].disc2} onChange={(v) => handleReturnRowChange(index, "disc2", v)} isCurrency currencyDisabled />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].taxableAmount} disabled />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].taxAmount} onChange={(v) => handleReturnRowChange(index, "taxAmount", v)} />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].landingCost} onChange={(v) => handleReturnRowChange(index, "landingCost", v)} />
                    </td>
                    <td className="p-2">
                      <CommonTextField type="number" value={returnRows[index].totalAmount} onChange={(v) => handleReturnRowChange(index, "totalAmount", v)} disabled />
                    </td>
                  </tr>
                ))}
                {/* TOTAL ROW */}
                <tr className="bg-gray-50 dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-200">
                  <td colSpan={4} className="p-2 text-right">
                    Total
                  </td>
                  <td className="p-2 text-center">{returnRows.reduce((a, b) => a + (parseFloat(String(b.qty)) || 0), 0)}</td>
                  <td colSpan={5}></td>
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
                <span>{returnRows.reduce((a, b) => a + (parseFloat(String(b.taxableAmount)) || 0), 0).toFixed(2)}</span>
              </Box>

              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span>Tax Amount</span>
                <span>{returnRows.reduce((a, b) => a + (parseFloat(String(b.taxAmount)) || 0), 0).toFixed(2)}</span>
              </Box>

              <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                <span>Roundoff</span>
                <span>{(Math.round(returnRows.reduce((a, b) => a + (parseFloat(String(b.totalAmount)) || 0), 0)) - returnRows.reduce((a, b) => a + (parseFloat(String(b.totalAmount)) || 0), 0)).toFixed(2)}</span>
              </Box>
              <Box className="flex justify-between p-3 text-lg font-semibold">
                <span>Net Amount</span>
                <span>{Math.round(returnRows.reduce((a, b) => a + (parseFloat(String(b.totalAmount)) || 0), 0)).toFixed(2)}</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </CommonTabPanel>
    </>
  );
};
export default SupplierBillTabs;
