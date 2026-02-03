import { Box, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";

import { CommonButton, CommonSelect, CommonTextField } from "../../../Attribute";
import type { TermsAndCondition } from "../../../Types/SupplierBill";
import type { FC } from "react";
import CommonTabPanel from "../../../Components/Common/CommonTabPanel";

interface SupplierBillTabsProps {
  tabValue: number;
  setTabValue: (value: number) => void;
  rows: any[];
  handleAdd: () => void;
  handleCut: (index: number) => void;
  termsList: TermsAndCondition[];
  notes: string;
  setNotes: (value: string) => void;
  setOpenModal: (value: boolean) => void;
  returnRows: any[];
  handleAddReturn: () => void;
  handleCutReturn: (index: number) => void;
}

const SupplierBillTabs: FC<SupplierBillTabsProps> = ({ tabValue, setTabValue, rows, handleAdd, handleCut, termsList, notes, setNotes, setOpenModal, returnRows, handleAddReturn, handleCutReturn }) => {
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
                      <CommonSelect label="Search Product" value={[]} options={[]} onChange={() => {}} />
                    </td>

                    {/* Qty */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Free Qty */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* MRP */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Selling */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Disc 1 */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" isCurrency currencyDisabled />
                    </td>
                    {/* Disc 2 */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" isCurrency currencyDisabled />
                    </td>
                    {/* Taxable */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Tax */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Landing */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Margin */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                    {/* Total */}
                    <td className="p-2 min-w-28">
                      <CommonTextField type="number" value="" />
                    </td>
                  </tr>
                ))}
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

            <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2 w-10">#</th>
                  <th className="p-2 text-left">Condition</th>
                </tr>
              </thead>
              <tbody>
                {termsList.map((term, index) => (
                  <tr key={term._id} className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700">
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
      </CommonTabPanel>
    </>
  );
};

export default SupplierBillTabs;
