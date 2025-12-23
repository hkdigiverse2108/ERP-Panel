import { Box, Grid } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Mutations } from "../../../Api";
import { CommonTextField, CommonSwitch, CommonSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { KEYS, PAGE_TITLE } from "../../../Constants";
import { BRAND_OPTIONS, BREADCRUMBS, CATEGORY_OPTIONS, DEPARTMENT_OPTIONS, PRODUCT_TYPE_OPTIONS, SUB_BRAND_OPTIONS, SUB_CATEGORY_OPTIONS, TAX_OPTIONS, UOM_OPTIONS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";

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

      editProduct(
        {
          ...changedFields,
          productId: data._id,
          companyId: company?._id,
        },
        { onSuccess: onSuccessHandler }
      );
    } else {
      addProduct(
        {
          ...RemoveEmptyFields(rest),
          companyId: company?._id,
        },
        { onSuccess: onSuccessHandler }
      );
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE[pageMode]} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik enableReinitialize initialValues={initialValues} validationSchema={ProductFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm }) => (
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
                    <CommonSelect label="UOM" options={UOM_OPTIONS} value={values.uomId ? [values.uomId] : []} onChange={(v) => setFieldValue("uomId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {/* ---------- PRICING & TAX ---------- */}
                <CommonCard title="Pricing & Tax" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 6 }} />
                    <CommonTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 6 }} />
                    <CommonSelect label="Purchase Tax" options={TAX_OPTIONS} value={values.purchaseTaxId ? [values.purchaseTaxId] : []} onChange={(v) => setFieldValue("purchaseTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                    <CommonSelect label="Sales Tax" options={TAX_OPTIONS} value={values.salesTaxId ? [values.salesTaxId] : []} onChange={(v) => setFieldValue("salesTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                {/* ---------- ACTION BAR ---------- */}
                <CommonBottomActionBar clear isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ProductForm;
