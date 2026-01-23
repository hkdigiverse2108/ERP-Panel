import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonSwitch, CommonValidationDatePicker, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { ProductBase, RecipeBase } from "../../../Types";
import { GenerateOptions, DateConfig } from "../../../Utils";
import { useLocation } from "react-router-dom";

interface BomRow {
  id: string;
  recipeId: string;
  name: string;
  qty: number;
  purchasePrice: number;
  landingCost: number;
  mrp: number;
  sellingPrice: number;
  expiryDays: number;
  mfgDate: string | null;
  expDate: string | null;
  useQty?: number;
}

const BillOfMaterialForm = () => {
  const { data: recipeData } = Queries.useGetRecipe({ activeFilter: true });
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const location = useLocation();
  const { data, no } = location.state || {};
  const [rows, setRows] = useState<BomRow[]>([]);

  const isEditing = Boolean(data?._id);
  const bomNumber = isEditing ? data?.number : String((Number(no) || 0) + 1);

  const createRowFromRecipe = (recipe: RecipeBase): BomRow => {
    const product = recipe.finalProducts?.productId as ProductBase;
    return {
      id: product._id,
      recipeId: recipe._id,
      name: product.name ?? "",
      qty: recipe.finalProducts?.qtyGenerate ?? 1,
      purchasePrice: product.purchasePrice ?? 0,
      landingCost: product.landingCost ?? 0,
      mrp: recipe.finalProducts?.mrp ?? 0,
      sellingPrice: product.sellingPrice ?? 0,
      expiryDays: recipe.finalProducts?.expiryDays ?? 0,
      mfgDate: null,
      expDate: null,
    };
  };
  const handleRecipeChange = (ids: string[]) => {
    setSelectedRecipeIds(ids);
    if (!ids.length) {
      setRows([]);
      return;
    }

    const recipes = recipeData?.data?.recipe_data.filter((r) => ids.includes(r._id)) || [];
    setRows(recipes.map(createRowFromRecipe));
  };

  const handleCut = (recipeId: string) => {
    const updated = selectedRecipeIds.filter((id) => id !== recipeId);
    handleRecipeChange(updated);
  };

  const updateRow = (id: string, data: Partial<BomRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };
  const initialValues = {
    number: bomNumber,
    date: DateConfig.utc().toISOString(),
    allowReverseCalculation: false,
  };
  const handleSubmit = () => {};

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILLOFMATERIALS.ADD} breadcrumbs={BREADCRUMBS.BILLOFMATERIALS.ADD} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {() => (
                  <Form>
                    <Grid container spacing={2}>
                      <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 3 }} />
                      <CommonValidationTextField name="text" label="BIM" disabled grid={{ xs: 12, md: 2 }} />
                      <CommonValidationTextField name="number" label="No" disabled grid={{ xs: 12, md: 2 }} />

                      <CommonSelect value={selectedRecipeIds} label="Recipe" multiple limitTags={1} grid={{ xs: 12, md: 5 }} options={GenerateOptions(recipeData?.data?.recipe_data)} onChange={handleRecipeChange} />

                      <CommonSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>

            {/* ================= TABLE ================= */}
            <Grid size={12}>
              <CommonCard title="Product Details">
                <div className="w-full bg-white dark:bg-gray-dark">
                  <div className="lg:h-[350px] max-h-[350px] overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm ">
                      <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                        <tr>
                          <th className="p-2">Sr No</th>
                          <th className="p-2 text-start">Product</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Purchase Price</th>
                          <th className="p-2">Landing Cost</th>
                          <th className="p-2">MRP</th>
                          <th className="p-2">Selling Price</th>
                          <th className="p-2">MFG Date</th>
                          <th className="p-2">Expiry Days</th>
                          <th className="p-2">EXP Date</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((row, i) => {
                          const recipe = recipeData?.data?.recipe_data.find((r) => r._id === row.recipeId);

                          return (
                            <>
                              <tr className="bg-blue-50 dark:bg-blue-900/20">
                                <td colSpan={11} className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-400">
                                  {recipe?.name}
                                </td>
                              </tr>
                              {/* ===== FINAL PRODUCT ===== */}
                              <tr className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                                <td className="p-2 text-center">{i + 1}</td>

                                <td className="p-2 min-w-35 w-35 text-start">{row.name}</td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.qty} onChange={(v) => updateRow(row.id, { qty: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.purchasePrice} onChange={(v) => updateRow(row.id, { purchasePrice: Number(v) })} />
                                </td>
                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.landingCost} onChange={(v) => updateRow(row.id, { landingCost: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.mrp} onChange={(v) => updateRow(row.id, { mrp: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.sellingPrice} onChange={(v) => updateRow(row.id, { sellingPrice: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="date" value={row.mfgDate ?? ""} onChange={(v) => updateRow(row.id, { mfgDate: v })} />
                                </td>

                                <td>{row.expiryDays}</td>

                                <td>
                                  <CommonTextField
                                    type="date"
                                    value={row.expDate ?? ""}
                                    onChange={(v) =>
                                      updateRow(row.id, {
                                        expDate: v,
                                      })
                                    }
                                  />
                                </td>

                                <td>
                                  <CommonButton size="small" color="error" onClick={() => handleCut(row.recipeId)}>
                                    <ClearIcon />
                                  </CommonButton>
                                </td>
                              </tr>
                              {/* ===== RAW MATERIAL TABLE ===== */}
                              {recipe?.rawProducts?.length ? (
                                <tr className="bg-white dark:bg-gray-800">
                                  <td colSpan={10} className="p-4">
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead className="bg-gray-100 dark:bg-gray-900">
                                          <tr>
                                            <th>Sr No</th>
                                            <th>Raw Product</th>
                                            <th>Available Qty</th>
                                            <th>Use Qty</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {recipe.rawProducts.map((raw, index) => (
                                            <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-dark">
                                              <td className="text-center">{index + 1}</td>

                                              <td>{(raw.productId as ProductBase)?.name}</td>

                                              <td className="text-center">{(raw.productId as ProductBase)?.qty}</td>

                                              <td>
                                                <CommonTextField type="number" value={raw.useQty ?? 0} onChange={(v) => updateRow(row.id, { useQty: Number(v) })} />
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CommonCard>
            </Grid>

            <CommonBottomActionBar save />
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};

export default BillOfMaterialForm;
