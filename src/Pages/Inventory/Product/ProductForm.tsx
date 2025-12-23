import { Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../../Components/Common";
import { CommonButton, CommonTextField, CommonSwitch, CommonSelect } from "../../../Attribute";
import { Mutations } from "../../../Api";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
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
        const changedFields = GetChangedFields(values, data);
        // let payload = cleanEditPayload(changedFields, data);

        // payload.productId = data._id;
        // payload.companyId = company?._id;

        // editProductMutate(payload, {
        //   onSuccess: () => {
        //     queryClient.invalidateQueries({
        //       queryKey: [KEYS.PRODUCT.ALL],
        //     });
        //     navigate(-1);
        //   },
        // });
      } else {
        let payload = RemoveEmptyFields(values);
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
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              {/* ================= GENERAL DETAILS ================= */}
              <CommonCard title="General Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="itemCode" label="Item Code" required grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Product Type" options={PRODUCT_TYPE_OPTIONS} value={values.productType ? [values.productType] : []} onChange={(v) => setFieldValue("productType", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="name" label="Product Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="printName" label="Print Name" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="slug" label="Slug" grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Category"  options={CATEGORY_OPTIONS} value={values.categoryId ? [values.categoryId] : []} onChange={(v) => setFieldValue("categoryId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Sub Category" options={SUB_CATEGORY_OPTIONS} value={values.subCategoryId ? [values.subCategoryId] : []} onChange={(v) => setFieldValue("subCategoryId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Brand" options={BRAND_OPTIONS} value={values.brandId ? [values.brandId] : []} onChange={(v) => setFieldValue("brandId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Sub Brand" options={SUB_BRAND_OPTIONS} value={values.subBrandId ? [values.subBrandId] : []} onChange={(v) => setFieldValue("subBrandId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Department" options={DEPARTMENT_OPTIONS} value={values.departmentId ? [values.departmentId] : []} onChange={(v) => setFieldValue("departmentId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="UOM" options={UOM_OPTIONS} value={values.uomId ? [values.uomId] : []} onChange={(v) => setFieldValue("uomId", v[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="hsnCode" label="HSN Code" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="expiryDays" label="Expiry Days" type="number" grid={{ xs: 12, md: 6 }} />

                  <CommonSelect
                    label="Expiry Type"
                    options={[
                      { label: "MFG", value: "MFG" },
                      { label: "Expiry", value: "expiry" },
                    ]}
                    value={values.expiryType ? [values.expiryType] : []}
                    onChange={(v) => setFieldValue("expiryType", v[0] || "")}
                    grid={{ xs: 12, md: 6 }}
                  />

                  <CommonTextField name="shortDescription" label="Short Description" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="description" label="Description" multiline rows={3} grid={{ xs: 12 }} />
                </Grid>
              </CommonCard>

              {/* ================= PRICING & TAX ================= */}
              <CommonCard title="Pricing & Tax" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="purchasePrice" label="Purchase Price" type="number" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="landingCost" label="Landing Cost" type="number" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 6 }} />

                  <CommonSelect label="Purchase Tax" options={TAX_OPTIONS} value={values.purchaseTaxId ? [values.purchaseTaxId] : []} onChange={(v) => setFieldValue("purchaseTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  <CommonSelect label="Sales Tax" options={TAX_OPTIONS} value={values.salesTaxId ? [values.salesTaxId] : []} onChange={(v) => setFieldValue("salesTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />

                  <CommonTextField name="cessPercentage" label="Cess %" type="number" grid={{ xs: 12, md: 6 }} />

                  <CommonSwitch name="isPurchaseTaxInclusive" label="Purchase Tax Inclusive" value={values.isPurchaseTaxInclusive} onChange={(v) => setFieldValue("isPurchaseTaxInclusive", v)} grid={{ xs: 12, md: 6 }} />
                  <CommonSwitch name="isSalesTaxInclusive" label="Sales Tax Inclusive" value={values.isSalesTaxInclusive} onChange={(v) => setFieldValue("isSalesTaxInclusive", v)} grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              {/* ================= INVENTORY ================= */}
              <CommonCard title="Inventory & Other Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="netWeight" label="Net Weight" type="number" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="nutritionInfo" label="Nutrition Info" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="ingredients" label="Ingredients" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="image" label="Image URL" grid={{ xs: 12, md: 6 }} />

                  <CommonSwitch name="manageBatch" label="Manage Batch" value={values.manageBatch} onChange={(v) => setFieldValue("manageBatch", v)} grid={{ xs: 12, md: 6 }} />
                  <CommonSwitch name="hasExpiry" label="Has Expiry" value={values.hasExpiry} onChange={(v) => setFieldValue("hasExpiry", v)} grid={{ xs: 12, md: 6 }} />
                  <CommonSwitch name="status" label="Status" value={values.status === "active"} onChange={(v) => setFieldValue("status", v ? "active" : "inactive")} grid={{ xs: 12 }} />
                </Grid>
              </CommonCard>

              {/* ================= STATUS ================= */}

              {/* ================= ACTIONS ================= */}
              <Grid className="w-full! flex justify-end">
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <CommonButton variant="outlined" title="Back" onClick={() => navigate(-1)} />
                  <CommonButton type="submit" variant="contained" title="Save" loading={isSubmitting} />
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
