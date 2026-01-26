import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationDatePicker, CommonValidationTextField, CommonDatePicker, CommonValidationSelect, CommonValidationSwitch } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { ProductBase, RecipeBase } from "../../../Types";
import { GenerateOptions, DateConfig } from "../../../Utils";
import { useLocation, useNavigate } from "react-router-dom";
import type { BillOfLiveProductBase, BillOfLiveProductFormValues } from "../../../Types/BillOfMaterials";

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
  rawProducts?: {
    productId: ProductBase;
    availableQty: number;
    useQty: number;
  }[];
}

const BillOfMaterialForm = () => {
  const { data: recipeData } = Queries.useGetRecipe({ activeFilter: true });

  const navigate = useNavigate();
  const location = useLocation();

  const { data, no } = location.state as {
    data?: BillOfLiveProductBase;
    no?: number;
  };

  const isEditing = Boolean(data?._id);

  const [rows, setRows] = useState<BomRow[]>([]);

  const pageMode = isEditing ? "EDIT" : "ADD";

  const bomNumber = isEditing ? data?.number : String((Number(no) || 0) + 1);

  const { mutate: addBOM, isPending: isAddLoading } = Mutations.useAddBillOfLiveProduct();

  const { mutate: editBOM, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const formikRef = useRef<any>(null);

  /* ---------------- CREATE ROW FROM RECIPE ---------------- */

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
      mfgDate: DateConfig.utc().toISOString(),
      expDate: null,
      rawProducts:
        recipe.rawProducts?.map((r) => ({
          productId: r.productId as ProductBase,
          availableQty: (r.productId as ProductBase)?.qty ?? 0,
          useQty: r.useQty ?? 0,
        })) || [],
    };
  };

  /* ---------------- RECIPE CHANGE (ADD MODE ONLY) ---------------- */

  const handleRecipeChange = (ids: string[]) => {
    const allRecipes = recipeData?.data?.recipe_data || [];

    setRows((prev) => {
      const map = new Map(prev.map((r) => [r.recipeId, r]));

      const result: BomRow[] = [];

      ids.forEach((id) => {
        const existing = map.get(id);

        if (existing) {
          result.push(existing);
        } else {
          const recipe = allRecipes.find((r) => r._id === id);
          if (recipe) result.push(createRowFromRecipe(recipe));
        }
      });

      return result;
    });
  };

  const updateRow = (id: string, data: Partial<BomRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...data } : row)));
  };
  const handleCut = (recipeId: string) => {
    const current: string[] = formikRef.current?.values?.recipeId || [];

    const updated = current.filter((id) => id !== recipeId);

    formikRef.current?.setFieldValue("recipeId", updated);
    setRows((prev) => prev.filter((row) => row.recipeId !== recipeId));
  };

  const updateRawQty = (rowId: string, index: number, value: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              rawProducts: row.rawProducts?.map((raw, i) => (i === index ? { ...raw, useQty: value } : raw)),
            }
          : row,
      ),
    );
  };
//   const findRecipeIdByProduct = (productId: string) => {
//   const recipe = recipeData?.data?.recipe_data.find(
//     (r) => r.finalProducts?.productId?._id === productId
//   );
//   return recipe?._id || "";
// };

//   useEffect(() => {
//     if (!isEditing || !data || !recipeData?.data?.recipe_data?.length) return;

//     const mapped: BomRow[] = (data.productDetails ?? []).map((item, index) => ({
//       id: item.productId._id,
//       recipeId: findRecipeIdByProduct(item.productId._id),
//       name: item.productId.name ?? "",
//       qty: item.qty,
//       purchasePrice: item.purchasePrice ?? 0,
//       landingCost: item.landingCost ?? 0,
//       mrp: item.mrp ?? 0,
//       sellingPrice: item.sellingPrice ?? 0,
//       expiryDays: item.expiryDays ?? 0,
//       mfgDate: item.mfgDate ?? null,
//       expDate: item.expiryDate ?? null,
//       rawProducts:
//         item.ingredients?.map((ing) => ({
//           productId: ing.productId as ProductBase,
//           availableQty: ing.availableQty ?? 0,
//           useQty: ing.useQty,
//         })) || [],
//     }));
//     setRows(mapped);
//     formikRef.current?.setFieldValue("recipeId", data.recipeId ?? [], false);
//   }, [isEditing, data, recipeData?.data?.recipe_data?.length]);

  /* ---------------- FORM ---------------- */

  const initialValues: BillOfLiveProductFormValues = {
    number: isEditing ? data!.number : bomNumber,
    date: isEditing ? data!.date : DateConfig.utc().toISOString(),
    allowReverseCalculation: data?.allowReverseCalculation ?? false,
    recipeId: isEditing ? (data?.recipeId ?? []) : [],
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (values: BillOfLiveProductFormValues) => {
    const productDetails = rows.map((r) => ({
      productId: r.id,
      qty: r.qty,
      purchasePrice: r.purchasePrice,
      landingCost: r.landingCost,
      mrp: r.mrp,
      sellingPrice: r.sellingPrice,

      mfgDate: r.mfgDate || undefined,
      expiryDays: r.expiryDays,
      expiryDate: r.expDate || undefined,

      ingredients: r.rawProducts?.map((raw) => ({
        productId: raw.productId._id,
        availableQty: raw.availableQty,
        useQty: raw.useQty,
      })),
    }));

    if (isEditing) {
      editBOM(
        {
          billOfLiveProductId: data!._id,
          recipeId: values.recipeId,
          productDetails,
        },
        {
          onSuccess: () => navigate(ROUTES.BILLOFMATERIALS.BASE),
        },
      );
    } else {
      addBOM(
        {
          number: values.number,
          date: values.date,
          allowReverseCalculation: values.allowReverseCalculation,
          recipeId: values.recipeId,
          productDetails,
        },
        {
          onSuccess: () => navigate(ROUTES.BILLOFMATERIALS.BASE),
        },
      );
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILLOFMATERIALS[pageMode]} breadcrumbs={BREADCRUMBS.BILLOFMATERIALS[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              {recipeData?.data?.recipe_data?.length ? (
                <Formik
                  enableReinitialize={isEditing}
                  innerRef={formikRef}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validate={(values) => {
                    handleRecipeChange(values.recipeId || []);
                    return {};
                  }}
                >
                  {() => {
                    return (
                      <Form noValidate>
                        <Grid container spacing={2}>
                          <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 3 }} />
                          <CommonValidationTextField name="text" label="BIM" disabled grid={{ xs: 12, md: 2 }} />
                          <CommonValidationTextField name="number" label="No" disabled grid={{ xs: 12, md: 2 }} />

                          <CommonValidationSelect name="recipeId" label="Recipe" multiple limitTags={1} grid={{ xs: 12, md: 5 }} options={GenerateOptions(recipeData?.data?.recipe_data)} />
                          <CommonValidationSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                        </Grid>
                      </Form>
                    );
                  }}
                </Formik>
              ) : null}
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
                                  <CommonDatePicker name="mfgDate" value={row.mfgDate} onChange={(v) => updateRow(row.id, { mfgDate: v })} />
                                </td>

                                <td>{row.expiryDays}</td>

                                <td>
                                  <CommonDatePicker name="expDate" value={row.expDate ?? ""} onChange={(v) => updateRow(row.id, { expDate: v })} />
                                </td>

                                <td>
                                  <CommonButton size="small" color="error" onClick={() => handleCut(row.recipeId)}>
                                    <ClearIcon />
                                  </CommonButton>
                                </td>
                              </tr>
                              {/* ===== RAW MATERIAL TABLE ===== */}
                              {row.rawProducts?.length ? (
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
                                          {row.rawProducts.map((raw, index) => (
                                            <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-dark">
                                              <td className="text-center">{index + 1}</td>
                                              <td>{raw.productId?.name}</td>
                                              <td className="text-center">{raw.availableQty}</td>
                                              <td>
                                                <CommonTextField type="number" value={raw.useQty ?? 0} onChange={(v) => updateRawQty(row.id, index, Number(v))} />
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
            <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} onSave={() => formikRef.current?.submitForm()} />
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};

export default BillOfMaterialForm;
