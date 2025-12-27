import { Box, Grid, IconButton } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Mutations } from "../../../Api";
import { CommonTextField, CommonSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { BRAND_OPTIONS, BREADCRUMBS, CATEGORY_OPTIONS, DEPARTMENT_OPTIONS, PRODUCT_TYPE_OPTIONS, SUB_BRAND_OPTIONS, SUB_CATEGORY_OPTIONS, TAX_OPTIONS, UOM_OPTIONS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";
import { FieldArray } from "formik";
// import { IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonButton } from "../../../Attribute";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addProduct, isPending: isAddLoading } = Mutations.useAddProduct();
  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues = {
    _submitAction: "save",
    variants: [
      {
        name: "",
        nutrition: [
          {
            label: "",
            value: "",
          },
        ],
      },
    ],

    companyId: data?.companyId || "",

    itemCode: data?.itemCode || "",
    name: data?.name || "",
    printName: data?.printName || "",
    slug: data?.slug || "",

    productType: data?.productType || "",
    categoryId: data?.categoryId || "",
    subCategoryId: data?.subCategoryId || "",
    brandId: data?.brandId || "",
    subBrandId: data?.subBrandId || "",
    departmentId: data?.departmentId || "",
    uomId: data?.uomId || "",

    purchaseTaxId: data?.purchaseTaxId || "",
    salesTaxId: data?.salesTaxId || "",

    mrp: data?.mrp || 0,
    sellingPrice: data?.sellingPrice || 0,
    purchasePrice: data?.purchasePrice || 0,
    landingCost: data?.landingCost || 0,

    hsnCode: data?.hsnCode || "",
    expiryDays: data?.expiryDays || "",
    expiryType: data?.expiryType || "",

    shortDescription: data?.shortDescription || "",
    description: data?.description || "",

    netWeight: data?.netWeight || "",
    nutritionInfo: data?.nutritionInfo || "",
    ingredients: data?.ingredients || "",
    image: data?.image || "",

    isPurchaseTaxInclusive: data?.isPurchaseTaxInclusive || false,
    isSalesTaxInclusive: data?.isSalesTaxInclusive || false,
    cessPercentage: data?.cessPercentage || 0,

    manageBatch: data?.manageBatch || false,
    hasExpiry: data?.hasExpiry || false,

    status: data?.status || "active",
  };

  const objectToFormData = (obj: Record<string, any>) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (v instanceof File) {
        fd.append(k, v);
      } else if (Array.isArray(v)) {
        v.forEach((val) => fd.append(k, typeof val === "object" ? JSON.stringify(val) : String(val)));
      } else if (typeof v === "object") {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, String(v));
      }
    });
    return fd;
  };

  const handleSubmit = (values: any, { resetForm }: FormikHelpers<any>) => {
    const { _submitAction, ...rest } = values;

    const onSuccessHandler = () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.PRODUCT.ALL],
      });

      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      editProduct({ ...changedFields, productId: data._id, companyId: companyId!._id }, { onSuccess: onSuccessHandler });
    } else {
      addProduct({ ...RemoveEmptyFields(rest), companyId: company!._id }, { onSuccess: onSuccessHandler });
    }
    return (
      <>
        <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT[pageMode]} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT[pageMode]} />

        <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
          <Formik enableReinitialize initialValues={initialValues} validationSchema={ProductFormSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, resetForm, dirty }) => (
              <Form noValidate>
                <Grid container spacing={2}>
                  {/* ---------- GENERAL DETAILS ---------- */}
                  <CommonCard title="General Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonTextField name="itemCode" label="Item Code" required grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Product Type" options={PRODUCT_TYPE_OPTIONS} value={values.productType ? [values.productType] : []} onChange={(v) => setFieldValue("productType", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="name" label="Product Name" required grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="printName" label="Print Name" grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="slug" label="Slug" grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Category" options={CATEGORY_OPTIONS} value={values.categoryId ? [values.categoryId] : []} onChange={(v) => setFieldValue("categoryId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Sub Category" options={SUB_CATEGORY_OPTIONS} value={values.subCategoryId ? [values.subCategoryId] : []} onChange={(v) => setFieldValue("subCategoryId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Brand" options={BRAND_OPTIONS} value={values.brandId ? [values.brandId] : []} onChange={(v) => setFieldValue("brandId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Sub Brand" options={SUB_BRAND_OPTIONS} value={values.subBrandId ? [values.subBrandId] : []} onChange={(v) => setFieldValue("subBrandId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Department" options={DEPARTMENT_OPTIONS} value={values.departmentId ? [values.departmentId] : []} onChange={(v) => setFieldValue("departmentId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Brand" options={UOM_OPTIONS} value={values.uomId ? [values.uomId] : []} onChange={(v) => setFieldValue("uomId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="tags" label="Tags" grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="net weight" label="Net Weight" grid={{ xs: 12, md: 6 }} />

                      <CommonTextField name="description" label="Description" multiline rows={4} grid={{ xs: 12 }} />

                      <CommonTextField name="shortNote" label="Short Note" multiline rows={4} grid={{ xs: 12 }} />
                      <CommonCard title="Nutrition" grid={{ xs: 12 }}>
                        <Grid spacing={2} sx={{ p: 2 }}>
                          <FieldArray name="variants">
                            {({ push, remove }) => (
                              <>
                                {values.variants.map((variant, vIndex) => (
                                  <Grid spacing={2} key={vIndex}>
                                    <Box p={2} border="1px solid #ccc " borderRadius={1} mb={2}>
                                      <FieldArray name={`variants.${vIndex}.nutrition`}>
                                        {() => (
                                          <>
                                            {variant.nutrition.map((_, nIndex) => (
                                              <Grid key={nIndex}>
                                                {/* Nutrition Name */}
                                                <Grid container spacing={2} sx={{ xs: 12, md: 5 }}>
                                                  <CommonTextField name={`variants.${vIndex}.nutrition.${nIndex}.label`} label="Nutrition Name" grid={{ xs: 12, md: 6 }} />
                                                  <CommonTextField name={`variants.${vIndex}.nutrition.${nIndex}.value`} label="Nutrition Value" grid={{ xs: 12, md: 5.5 }} />
                                                  {values.variants.length > 1 && (
                                                    <IconButton color="error" size="small" onClick={() => remove(vIndex)}>
                                                      <DeleteIcon />
                                                    </IconButton>
                                                  )}
                                                </Grid>
                                              </Grid>
                                            ))}
                                          </>
                                        )}
                                      </FieldArray>
                                    </Box>
                                  </Grid>
                                ))}

                                {/* ADD  BUTTON  */}
                                <Grid className="flex flex-start!">
                                  <CommonButton
                                    variant="contained"
                                    onClick={() =>
                                      push({
                                        name: "",
                                        nutrition: [{ label: "", value: "" }],
                                      })
                                    }
                                  >
                                    + Add Nutrition
                                  </CommonButton>
                                </Grid>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                      </CommonCard>

                      {/* <CommonSelect label="Status" options={} value={values.status ? [values.status] : []} onChange={(v) => setFieldValue("status", v[0] || "")} grid={{ xs: 12, md: 6 }} /> */}
                    </Grid>
                  </CommonCard>

                  {/* ---------- PRICING & TAX ---------- */}
                  <CommonCard title="Pricing & Tax" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="Purchase Price" label="Purchase Price" type="number" required grid={{ xs: 12, md: 6 }} />
                      <CommonTextField name="landingCost" label="Landing Cost" type="number" required grid={{ xs: 12, md: 6 }} />
                      {/* <CommonTextField name="purchaseTaxId" label="Purchase Tax" type="number" required grid={{ xs: 12, md: 6 }} /> */}
                      <CommonSelect label="Purchase Tax" options={TAX_OPTIONS} value={values.purchaseTaxId ? [values.purchaseTaxId] : []} onChange={(v) => setFieldValue("purchaseTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                      <CommonSelect label="Sales Tax" options={TAX_OPTIONS} value={values.salesTaxId ? [values.salesTaxId] : []} onChange={(v) => setFieldValue("salesTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                    </Grid>
                  </CommonCard>

                  {/* ---------- ACTION BAR ---------- */}
                  <CommonBottomActionBar clear disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </>
    );
  };
};
export default ProductForm;
