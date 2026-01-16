import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSwitch, CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, RECIPE_TYPE_OPTIONS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import type { RecipeFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { RecipeFormSchema } from "../../../Utils/ValidationSchemas";

const RecipeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: productData } = Queries.useGetProduct({ activeFilter: true });
  const { mutate: addRecipe, isPending: isAddLoading } = Mutations.useAddRecipe();
  const { mutate: editRecipe, isPending: isEditLoading } = Mutations.useEditRecipe();

  const initialValues: RecipeFormValues = {
    Name: data?.Name || "",
    recipeNo: data?.No || "",
    Date: data?.Date || DateConfig.utc().toISOString(),
    Type: data?.recipeType || "",
    isActive: data?.isActive ?? true,
    rawProducts: [
      {
        productId: data?.rawProducts?.[0]?.productId ?? "",
        mrp: data?.rawProducts?.[0]?.mrp ?? null,
        useQty: data?.rawProducts?.[0]?.useQty ?? null,
      },
    ],

    finalProducts: {
      productId: data?.finalProducts?.productId ?? "",
      mrp: data?.finalProducts?.mrp ?? null,
      qtyGenerate: data?.finalProducts?.qtyGenerate ?? null,
    },
  };

  const handleSubmit = async (values: RecipeFormValues, { resetForm }: FormikHelpers<RecipeFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id };

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
                    <CommonValidationTextField name="Name" label="Recipe Name" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="recipeNo" label="Recipe No" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationDatePicker name="Date" label="Recipe Date" grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="Type" label="Recipe Type" options={RECIPE_TYPE_OPTIONS} required grid={{ xs: 12, md: 3 }} />
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
                    <CommonValidationSelect name="finalProducts.productId" label="Product" options={GenerateOptions(productData?.data.product_data)} required grid={{ xs: 12, md: 4 }} />

                    <CommonValidationTextField name="finalProducts.qtyGenerate" label="Qty Generate" type="number" required grid={{ xs: 12, md: 3 }} />

                    <CommonValidationTextField name="finalProducts.mrp" label="MRP" type="number" grid={{ xs: 12, md: 3 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isEditLoading || isAddLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={() => {
                    setFieldValue("_submitAction", "save");
                  }}
                  onSaveAndNew={() => {
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
