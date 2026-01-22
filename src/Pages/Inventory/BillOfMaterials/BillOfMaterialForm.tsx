import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers, type FormikProps } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonSwitch, CommonTextField, CommonValidationDatePicker, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { DateConfig, GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { RecipeFormSchema } from "../../../Utils/ValidationSchemas";
import type { BillOfLiveProductFormValues } from "../../../Types/BillOfMaterials";
import { useRef, useState } from "react";
import type { ProductBase, RecipeBase } from "../../../Types";
import { ClearIcon } from "@mui/x-date-pickers-pro";

const BillOfMaterialForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, no } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const formikRef = useRef<FormikProps<BillOfLiveProductFormValues>>(null);

  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<RecipeBase[]>([]);

  const { data: recipeData } = Queries.useGetRecipe({ activeFilter: true });

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const bomNumber = isEditing ? data?.number : String((Number(no) || 0) + 1);

  const { mutate: addBillOfMaterial, isPending: isAddLoading } = Mutations.useAddBillOfLiveProduct();

  const { mutate: editBillOfMaterial, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const initialValues: BillOfLiveProductFormValues = {
    number: bomNumber,
    date: DateConfig.utc().toISOString(),
    recipeId: [],
    allowReverseCalculation: false,
    isActive: true,
  };

  const handleSubmit = async (values: BillOfLiveProductFormValues, { resetForm }: FormikHelpers<BillOfLiveProductFormValues>) => {
    const payload = {
      ...values,
      companyId: company!._id,
    };

    const onSuccess = () => {
      resetForm();
      navigate(-1);
    };

    isEditing ? editBillOfMaterial({ ...payload, billOfLiveProductId: data._id }, { onSuccess }) : addBillOfMaterial(RemoveEmptyFields(payload), { onSuccess });
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILLOFMATERIALS[pageMode]} breadcrumbs={BREADCRUMBS.BILLOFMATERIALS[pageMode]} />

      <Box sx={{ p: 3, mb: 8 }}>
        <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={RecipeFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* HEADER */}
                <Grid size={12}>
                  <CommonCard>
                    <Box p={2} display="flex" flexWrap="wrap" gap={2}>
                      <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 3 }} />

                      <CommonTextField value="BOM" label="BOM" disabled grid={{ xs: 12, md: 3 }} />

                      <CommonValidationTextField name="number" label="No" disabled grid={{ xs: 12, md: 3 }} />

                      <CommonSelect
                        value={selectedRecipeIds}
                        label="Recipe"
                        multiple
                        grid={{ xs: 12, md: 3 }}
                        limitTags={1}
                        options={GenerateOptions(recipeData?.data?.recipe_data)}
                        onChange={(ids: string[]) => {
                          setSelectedRecipeIds(ids);
                          formikRef.current?.setFieldValue("recipeId", ids);

                          const recipes = recipeData?.data?.recipe_data.filter((r) => ids.includes(r._id)) || [];

                          setSelectedRecipes(recipes);
                        }}
                      />

                      <CommonSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                    </Box>
                  </CommonCard>
                </Grid>

                {/* PRODUCT DETAILS */}
                <Grid size={12}>
                  <CommonCard title="Product Details">
                    <div className="w-full bg-white dark:bg-gray-dark">
                      <div className="lg:h-[500px] max-h-[500px] overflow-x-auto custom-scrollbar dark:border-gray-600 rounded-md">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
                            <tr>
                              <th className="p-2 text-center whitespace-nowrap">Sr No</th>
                              <th className="p-2 text-start">Product</th>
                              <th className="p-2 text-center whitespace-nowrap">Qty</th>
                              <th className="p-2 text-center whitespace-nowrap">Purchase Price</th>
                              <th className="p-2 text-center whitespace-nowrap">Landing Cost</th>
                              <th className="p-2 text-center whitespace-nowrap">MRP</th>
                              <th className="p-2 text-center whitespace-nowrap">Selling Price</th>
                              <th className="p-2 text-center whitespace-nowrap">Mfg</th>
                              <th className="p-2 text-center whitespace-nowrap">Expiry Days</th>
                              <th className="p-2 text-center whitespace-nowrap">Exp Date</th>
                              <th className="p-2 text-center whitespace-nowrap">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {selectedRecipes.map((recipe, i) => (
                              <>
                                {/* RECIPE NAME */}
                                <tr className="bg-blue-50 dark:bg-blue-900/20">
                                  <td colSpan={11} className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-400">
                                    {recipe.name}
                                  </td>
                                </tr>

                                {/* FINAL PRODUCT */}
                                <tr className="even:bg-gray-50 dark:even:bg-gray-dark text-gray-700 dark:text-gray-200">
                                  <td className="p-2 text-center">{i + 1}</td>

                                  <td className="p-2 text-start">{(recipe.finalProducts?.productId as ProductBase)?.name}</td>

                                  <td className="p-2">
                                    <CommonTextField type="number" value={recipe.finalProducts?.qtyGenerate ?? 0} />
                                  </td>
                                  <td className="p-2">
                                    <CommonTextField type="number" value={(recipe.finalProducts?.productId as ProductBase)?.purchasePrice ?? 0} />
                                  </td>

                                  <td className="p-2">
                                    <CommonTextField type="number" value={(recipe.finalProducts?.productId as ProductBase)?.landingCost ?? 0} />
                                  </td>

                                  <td className="p-2">
                                    <CommonTextField type="number" value={recipe.finalProducts?.mrp ?? 0} />
                                  </td>

                                  <td className="p-2">
                                    <CommonTextField type="number" value={(recipe.finalProducts?.productId as ProductBase)?.sellingPrice ?? 0} />
                                  </td>

                                  <td className="p-2">
                                    <CommonValidationDatePicker name={`mfg_${recipe._id}`} />
                                  </td>

                                  <td className="p-2">
                                    <CommonTextField type="number" disabled value={recipe.finalProducts?.expiryDays ?? 0} />
                                  </td>

                                  <td className="p-2">
                                    <CommonValidationDatePicker name={`exp_${recipe._id}`} />
                                  </td>

                                  <td className="p-2">
                                    <CommonButton
                                      size="small"
                                      color="error"
                                      variant="outlined"
                                      onClick={() => {
                                        setSelectedRecipeIds((prev) => prev.filter((id) => id !== recipe._id));
                                        setSelectedRecipes((prev) => prev.filter((r) => r._id !== recipe._id));
                                      }}
                                    >
                                      <ClearIcon />
                                    </CommonButton>
                                  </td>
                                </tr>

                                {/* RAW MATERIAL */}
                                <tr>
                                  <td colSpan={10} className="pl-12 py-4">
                                    <table className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-md">
                                      <thead className="bg-gray-100 dark:bg-gray-900">
                                        <tr>
                                          <th className="p-2">Sr No</th>
                                          <th className="p-2 text-start">Raw Product</th>
                                          <th className="p-2 text-center">Available Qty</th>
                                          <th className="p-2 text-center">Use Qty</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {recipe.rawProducts?.map((raw, index) => (
                                          <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-dark">
                                            <td className="p-2 text-center">{index + 1}</td>
                                            <td className="p-2">{(raw.productId as ProductBase)?.name}</td>
                                            <td className="p-2 text-center">{(raw.productId as ProductBase)?.qty ?? "-"}</td>
                                            <td className="p-2">
                                              <CommonTextField type="number" value={raw.useQty ?? 0} />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CommonCard>
                </Grid>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm()} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BillOfMaterialForm;
