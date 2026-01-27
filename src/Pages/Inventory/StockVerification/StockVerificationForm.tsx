import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { ProductBase, StockVerificationFormValues, StockVerificationRow } from "../../../Types";
import { GenerateOptions } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const StockVerificationForm = () => {
  const [searchValue, setSearchValue] = useState<string[]>([""]);
  const [enterRemark, setEnterRemark] = useState("");
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = location.state || {};
  const isEditing = Boolean(data?._id);
  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown();
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown();
  const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown();

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStockVerification();

  const [rows, setRows] = useState<StockVerificationRow[]>([]);

  const createRowFromProduct = (product: ProductBase): StockVerificationRow => ({
    productId: product._id,
    name: product.name ?? "",
    landingCost: product.landingCost ?? 0,
    price: product.purchasePrice ?? 0,
    mrp: product.mrp ?? 0,
    sellingPrice: product.sellingPrice ?? 0,
    systemQty: product.qty ?? 0,
    physicalQty: 0,
    differenceQty: 0 - (product.qty ?? 0),
    differenceAmount: (product.landingCost ?? 0) * (0 - (product.qty ?? 0)),
  });

  const updateRow = (id: string, data: Partial<StockVerificationRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.productId !== id) return r;

        const updated = { ...r, ...data };
        const differenceQty = updated?.physicalQty - updated?.systemQty;

        return { ...updated, differenceQty, differenceAmount: updated?.landingCost * differenceQty };
      }),
    );
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.productId !== id));
  const totalDifferenceQty = rows.reduce((sum, r) => sum + r?.physicalQty, 0);

  const totalDifferenceAmount = rows.reduce((sum, r) => sum + r?.differenceAmount, 0);

  const handleSubmit = () => {};

  const handleStockSubmit = async () => {
    const items = rows.map((r) => ({
      productId: r.productId,
      landingCost: r.landingCost,
      price: r.price,
      mrp: r.mrp,
      sellingPrice: r.sellingPrice,
      systemQty: r.systemQty,
      physicalQty: r.physicalQty,
      differenceQty: r.differenceQty,
      differenceAmount: r.differenceAmount,
    }));
    const payload: StockVerificationFormValues = {
      items,
      totalProducts: rows.length,
      totalPhysicalQty: totalDifferenceQty,
      differenceAmount: totalDifferenceAmount,
      status: "pending",
      remark: enterRemark,
    };
    await addStock(payload);
    console.log("payload", payload);
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.ADD} maxItems={3} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION.ADD} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              <Formik enableReinitialize initialValues={{ categoryId: null, brandId: null }} onSubmit={handleSubmit}>
                {({ dirty }) => (
                  <Form noValidate>
                    <Grid container spacing={2}>
                      <CommonValidationSelect name="categoryId" label="Category" placeholder="Category & Subcategory Selection" options={GenerateOptions(CategoryData?.data)} isLoading={CategoryDataLoading} grid={{ xs: 12, sm: 6, md: 4 }} />
                      <CommonValidationSelect name="brandId" label="Brand" placeholder="Brand & Subbrand Selection" options={GenerateOptions(BrandsData?.data)} isLoading={BrandsDataLoading} grid={{ xs: 12, md: 4 }} />
                      <CommonButton type="submit" variant="contained" title="Apply" disabled={!dirty} />
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2}>
                <CommonSelect
                  value={searchValue}
                  label="Search Product"
                  placeholder="Search Product"
                  options={GenerateOptions(productData?.data)}
                  grid={{ xs: 12, sm: 6 }}
                  isLoading={productDataLoading}
                  onChange={(selected: string[]) => {
                    setSearchValue(selected);
                    if (!selected.length) return;

                    const product = productData?.data.find((p) => p._id === selected[0]);
                    if (!product) return;

                    setRows((prev) => {
                      const existing = prev.find((r) => r.productId === product._id);

                      if (existing) {
                        return prev.map((r) => (r.productId === product._id ? { ...r, physicalQty: r.physicalQty + 1, differenceQty: r.physicalQty + 1 - r.systemQty, differenceAmount: (r.landingCost ?? 0) * (r.physicalQty + 1) } : r));
                      }

                      return [createRowFromProduct(product), ...prev];
                    });
                    // setSearchValue([]);
                  }}
                />
                <CommonTextField label="Enter Remark" placeholder="Enter Remark" grid={{ xs: 12, sm: 6 }} value={enterRemark} onChange={(e) => setEnterRemark(e)} />
              </Grid>
            </Grid>

            <Grid size={12}>
              <div className="w-full bg-white dark:bg-gray-dark">
                <div className="lg:h-[500px] max-h-[500px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
                  <table className="w-full text-sm ">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                      <tr>
                        <th className="p-2">Sr No.</th>
                        <th className="p-2 text-start">Product</th>
                        <th className="p-2">Landing Cost</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">MRP</th>
                        <th className="p-2">Selling Price</th>
                        <th className="p-2">System Qty</th>
                        <th className="p-2">Physical Qty</th>
                        <th className="p-2">Difference Qty</th>
                        <th className="p-2">Difference Amount</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        return (
                          <tr key={row.productId} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                            <td className="p-2 text-center">{i + 1}</td>
                            <td className="p-2 min-w-60 w-60 text-start">{row.name}</td>
                            <td className="p-2 ">{row.landingCost}</td>
                            <td className="p-2 ">{row.price}</td>
                            <td className="p-2 ">{row.mrp}</td>
                            <td className="p-2 ">{row.sellingPrice}</td>
                            <td className="p-2 ">{row.systemQty}</td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.physicalQty} onChange={(e) => updateRow(row.productId, { physicalQty: Number(e) })} />
                            </td>
                            <td className="p-2 ">{row.differenceQty}</td>
                            <td className="p-2">{row.differenceAmount.toFixed(2)}</td>
                            <td className="p-2">
                              <CommonButton color="error" variant="outlined" size="small" onClick={() => removeRow(row.productId)}>
                                <ClearIcon />
                              </CommonButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
                        <td colSpan={7} />
                        <td className="p-3 text-center font-semibold">{totalDifferenceQty}</td>
                        <td />
                        <td className="p-3 text-center font-semibold">{totalDifferenceAmount.toFixed(2)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </Grid>
            <CommonBottomActionBar save isLoading={isAddLoading} disabled={rows.length === 0} onSave={() => handleStockSubmit()} />
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};

export default StockVerificationForm;
