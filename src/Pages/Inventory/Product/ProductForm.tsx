import { Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../../Components/Common";
import { CommonButton, CommonTextField, CommonSwitch, CommonSelect } from "../../../Attribute";
import { Mutations } from "../../../Api";
import { cleanEditPayload, getChangedFields, removeEmptyFields } from "../../../Utils";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { BRAND_OPTIONS, CATEGORY_OPTIONS, DEPARTMENT_OPTIONS, PRODUCT_TYPE_OPTIONS, SUB_BRAND_OPTIONS, SUB_CATEGORY_OPTIONS, TAX_OPTIONS, UOM_OPTIONS } from "../../../Data";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);
  console.log("Editing Product Data:", data);
  const queryClient = useQueryClient();

  const { mutate: addProductMutate, isPending: isAddLoading } = Mutations.useAddProduct();
  const { mutate: editProductMutate, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);

  const handleSubmit = async (values: any) => {
    if (isAddLoading || isEditLoading) return;

    try {
      if (isEditing) {
        const changedFields = getChangedFields(values, data);
        let payload = cleanEditPayload(changedFields, data);

        payload.productId = data._id;
        payload.companyId = company?._id;

        editProductMutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [KEYS.PRODUCT.ALL],
            });
            navigate(-1);
          },
        });
      } else {
        let payload = removeEmptyFields(values);
        payload.companyId = company?._id;

        addProductMutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [KEYS.PRODUCT.ALL],
            });
            navigate(-1);
          },
        });
      }
    } catch (error) {
      console.error("Product form error:", error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <h2 style={{ marginBottom: 16 }}>{isEditing ? "Edit Product" : "Add Product"}</h2>

      <Formik
        enableReinitialize
        initialValues={{
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

          mrp: data?.mrp || "",
          sellingPrice: data?.sellingPrice || "",
          purchasePrice: data?.purchasePrice || "",
          landingCost: data?.landingCost || "",

          hsnCode: data?.hsnCode || "",
          expiryDays: data?.expiryDays || "",
          expiryType: data?.expiryType || "",

          shortDescription: data?.shortDescription || "",
          description: data?.description || "",

          status: data?.status || "active",

          sellingDiscount: data?.sellingDiscount || "",
          sellingMargin: data?.sellingMargin || "",
          retailerDiscount: data?.retailerDiscount || "",
          retailerPrice: data?.retailerPrice || "",
          retailerMargin: data?.retailerMargin || "",
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <CommonCard title="General Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="itemCode" label="Item Code" required grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Product Type" options={PRODUCT_TYPE_OPTIONS} value={values.productType ? [values.productType] : []} onChange={(val) => setFieldValue("productType", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="name" label="Product Name" required grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="printName" label="Print Name" required grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Category" options={CATEGORY_OPTIONS} value={values.categoryId ? [values.categoryId] : []} onChange={(val) => setFieldValue("categoryId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Sub Category" options={SUB_CATEGORY_OPTIONS} value={values.subCategoryId ? [values.subCategoryId] : []} onChange={(val) => setFieldValue("subCategoryId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Brand" options={BRAND_OPTIONS} value={values.brandId ? [values.brandId] : []} onChange={(val) => setFieldValue("brandId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Sub Brand" options={SUB_BRAND_OPTIONS} value={values.subBrandId ? [values.subBrandId] : []} onChange={(val) => setFieldValue("subBrandId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Department" options={DEPARTMENT_OPTIONS} value={values.departmentId ? [values.departmentId] : []} onChange={(val) => setFieldValue("departmentId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="UOM" options={UOM_OPTIONS} value={values.uomId ? [values.uomId] : []} onChange={(val) => setFieldValue("uomId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="hsnCode" label="HSN Code" required grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Purchase Tax" options={TAX_OPTIONS} value={values.purchaseTaxId ? [values.purchaseTaxId] : []} onChange={(val) => setFieldValue("purchaseTaxId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Sales Tax" options={TAX_OPTIONS} value={values.salesTaxId ? [values.salesTaxId] : []} onChange={(val) => setFieldValue("salesTaxId", val[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="expiryDays" label="Expiry Days" grid={{ xs: 12, md: 6 }} />

                  <CommonSelect
                    label="Expiry Type"
                    options={[
                      { label: "MFG", value: "MFG" },
                      { label: "Expiry", value: "expiry" },
                    ]}
                    value={values.expiryType ? [values.expiryType] : []}
                    onChange={(val) => setFieldValue("expiryType", val[0] || "")}
                    grid={{ xs: 12, md: 6 }}
                  />

                  <CommonTextField name="shortDescription" label="Short Description" grid={{ xs: 12, md: 6 }} />

                  {/* <Grid xs={12}>
                    <CommonRichText value={values.description} onChange={(val) => setFieldValue("description", val)} />
                  </Grid> */}
                </Grid>
              </CommonCard>

              <CommonCard title="Pricing Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="purchasePrice" label="Purchase Price" type="number" grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="landingCost" label="Landing Cost" type="number" grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              <CommonSwitch name="status" label="Status" value={values.status === "active"} onChange={(checked) => setFieldValue("status", checked ? "active" : "inactive")} grid={{ xs: 12 }} />

              <Grid className="w-full! flex justify-end">
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <CommonButton variant="outlined" title="Back" onClick={() => navigate(-1)} loading={isAddLoading || isEditLoading} />

                  <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading || isSubmitting} disabled={isAddLoading || isEditLoading || isSubmitting} />
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductForm;
