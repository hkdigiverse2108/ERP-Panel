import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonSwitch, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { RecipeFormSchema } from "../../../Utils/ValidationSchemas";
import type { BillOfLiveProductFormValues } from "../../../Types/BillOfMaterials";
import { useEffect, useState } from "react";

const BillOfMaterialForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const [recipeId, setRecipeId] = useState<string>("");
  const { data: recipeData } = Queries.useGetRecipe({ activeFilter: true });

  const { mutate: addBillOfMaterial, isPending: isAddLoading } = Mutations.useAddBillOfLiveProduct();
  const { mutate: editBillOfMaterial, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const selectedRecipe = recipeData?.data?.recipe_data?.find((r) => r._id === recipeId);
  interface BomIngredientRow {
    productId: string;
    code: string;
    name: string;
    batch: string;
    availableQty: number;
    useQty: number;
  }

  const [rows, setRows] = useState<BomIngredientRow[]>([]);

  useEffect(() => {
    if (!selectedRecipe) return;

    const rows = selectedRecipe.rawProducts?.map((raw) => {
      const product = raw.productId as any;

      return {
        productId: product?._id || "",
        code: raw.itemCode || product?.code || "",
        name: product?.name || "",
        batch: "",
        availableQty: product?.qty || 0,
        useQty: raw.useQty || 0,
      };
    });
    setRows(rows || []);
  }, [selectedRecipe]);

  const { data: bomList } = Queries.useGetBillOfLiveProduct({
    page: 1,
    limit: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const nextBomNumber = (() => {
    const last = bomList?.data?.billOfLiveProduct_data?.[0]?.number;

    if (!last) return 1;

    const num = Number(last);

    return isNaN(num) ? 1 : num + 1;
  })();

  // ✅ INITIAL VALUES
  const initialValues: BillOfLiveProductFormValues = {
    number: isEditing ? data?.number : String(nextBomNumber),
    date: data?.date || DateConfig.utc().toISOString(),
    recipeId: data?.recipeId ?? [],
    allowReverseCalculation: false,
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: BillOfLiveProductFormValues, { resetForm }: FormikHelpers<BillOfLiveProductFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id };
    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editBillOfMaterial({ ...changedFields, billOfLiveProductId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addBillOfMaterial(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.RECIPE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.BILLOFMATERIALS[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BillOfLiveProductFormValues> initialValues={initialValues} validationSchema={RecipeFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard>
                  <Box p={2} display="flex" alignItems="center" gap={2} flexWrap="nowrap">
                    {/* DATE */}
                    <Box sx={{ width: 230 }}>
                      <CommonValidationDatePicker name="date" label="Bill Of Materials Date" required />
                    </Box>

                    {/* BOM PREFIX */}
                    <Box sx={{ width: 90 }}>
                      <CommonTextField value="BOM" label="BOM" disabled />
                    </Box>

                    {/* BOM NUMBER */}
                    <Box sx={{ width: 90 }}>
                      <CommonValidationTextField name="number" label="No." disabled />
                    </Box>

                    {/* RECIPE */}
                    <Box sx={{ width: 340 }}>
                      <CommonValidationSelect name="recipeId" label="Select Recipe" required options={GenerateOptions(recipeData?.data?.recipe_data)} />
                    </Box>

                    {/* SWITCH — IMPORTANT FIX */}
                    <Box
                      sx={{
                        width: "auto",
                        minWidth: 190,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CommonSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                    </Box>
                  </Box>
                </CommonCard>

                {!isEditing && <CommonSwitch name="isActive" label="Is Active" />}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BillOfMaterialForm;
