import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, RECIPE_TYPE_OPTIONS } from "../../../Data";
import type { RecipeFormValues } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { RecipeFormSchema } from "../../../Utils/ValidationSchemas";
import dayjs from "dayjs";

const RecipeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: productData } = Queries.useGetProduct({ activeFilter: true });
  const { mutate: addRecipe, isPending: isAddLoading } = Mutations.useAddRecipe();
  const { mutate: editRecipe, isPending: isEditLoading } = Mutations.useEditRecipe();

  const initialValues: RecipeFormValues = {
    recipeName: data?.recipeName || "",
    recipeNo: data?.recipeNo || "",
    recipeDate: data?.recipeDate ?? null,
    recipeType: data?.recipeType || "",

    rawProducts: [
      {
        productId: data?.rawProducts?.[0]?.productId ?? "",
        itemCode: "",
        mrp: data?.rawProducts?.[0]?.mrp ?? null,
        useQty: data?.rawProducts?.[0]?.useQty ?? null,
      },
    ],

    finalProducts: [
      {
        productId: data?.finalProducts?.[0]?.productId ?? "",
        itemCode: "",
        mrp: data?.finalProducts?.[0]?.mrp ?? null,
        qtyGenerate: data?.finalProducts?.[0]?.qtyGenerate ?? null,
      },
    ],
  };

  const handleSubmit = async (values: RecipeFormValues, { resetForm }: FormikHelpers<RecipeFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editRecipe({ ...changedFields, recipeId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addRecipe(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.RECIPE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.RECIPE[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<RecipeFormValues> enableReinitialize initialValues={initialValues} validationSchema={RecipeFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Recipe Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="recipeName" label="Recipe Name" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="recipeNo" label="Recipe No" required grid={{ xs: 12, md: 3 }} />
                    <CommonDatePicker name="recipeDate" label="Recipe Date" grid={{ xs: 12, md: 3 }} value={values.recipeDate ? dayjs(values.recipeDate) : null} onChange={(value) => setFieldValue("recipeDate", value ? value.toISOString() : "")} />
                    <CommonValidationSelect name="recipeType" label="Recipe Type" options={RECIPE_TYPE_OPTIONS} required grid={{ xs: 12, md: 3 }} />
                  </Grid>
                </CommonCard>

                {/* RAW PRODUCTS */}
                <CommonCard title="Raw Products" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <FieldArray name="rawProducts">
                      {({ push, remove }) =>
                        values?.rawProducts?.map((_, object) => (
                          <>
                            <CommonValidationSelect name={`rawProducts.${object}.productId`} label="Product" options={GenerateOptions(productData?.data.product_data)} required grid={{ xs: 12, md: 4 }} />
                            <CommonValidationTextField name={`rawProducts.${object}.useQty`} label="Use Qty" type="number" required grid={{ xs: 12, md: 3 }} />
                            <CommonValidationTextField name={`rawProducts.${object}.mrp`} label="MRP" type="number" grid={{ xs: 12, md: 3 }} />
                            <Grid gap={1}>
                              {(values?.rawProducts?.length || 0) > 1 && (
                                <CommonButton size="small" variant="outlined" color="error" onClick={() => remove(object)}>
                                  <DeleteIcon />
                                </CommonButton>
                              )}

                              {object === (values.rawProducts?.length || 1) - 1 && (
                                <CommonButton
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    push({
                                      productId: "",
                                      itemCode: "",
                                      mrp: null,
                                      useQty: null,
                                    })
                                  }
                                >
                                  <AddIcon />
                                </CommonButton>
                              )}
                            </Grid>
                          </>
                        ))
                      }
                    </FieldArray>
                  </Grid>
                </CommonCard>

                {/* FINAL PRODUCTS */}
                <CommonCard title="Final Products" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <FieldArray name="finalProducts">
                      {({ push, remove }) =>
                        values.finalProducts?.map((_, index) => (
                          <>
                            <CommonValidationSelect name={`finalProducts.${index}.productId`} label="Product" options={GenerateOptions(productData?.data.product_data)} required grid={{ xs: 12, md: 4 }} />

                            <CommonValidationTextField name={`finalProducts.${index}.qtyGenerate`} label="Qty Generate" type="number" required grid={{ xs: 12, md: 3 }} />

                            <CommonValidationTextField name={`finalProducts.${index}.mrp`} label="MRP" type="number" grid={{ xs: 12, md: 3 }} />

                            <Grid gap={1}>
                              {(values?.finalProducts?.length || 0) > 1 && (
                                <CommonButton size="small" variant="outlined" color="error" onClick={() => remove(index)}>
                                  <DeleteIcon />
                                </CommonButton>
                              )}

                              {index === (values.finalProducts?.length || 1) - 1 && (
                                <CommonButton size="small" variant="outlined" onClick={() => push({ productId: "", itemCode: "", mrp: null, qtyGenerate: null })}>
                                  <AddIcon />
                                </CommonButton>
                              )}
                            </Grid>
                          </>
                        ))
                      }
                    </FieldArray>
                  </Grid>
                </CommonCard>
                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isAddLoading || isEditLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={async () => {
                    setFieldValue("_submitAction", "save");
                  }}
                  onSaveAndNew={async () => {
                    setFieldValue("_submitAction", "saveAndNew");
                  }}
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default RecipeForm;
