import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationSelect } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, DEPARTMENT_OPTIONS } from "../../../Data";
import { GenerateOptions } from "../../../Utils";
import type { ProductBase } from "../../../Types";

const StockForm = () => {
  const [searchValue, setSearchValue] = useState<string[]>([""]);
  const [enterRemark, setEnterRemark] = useState("");

  const { data: BrandsData } = Queries.useGetBrand({ activeFilter: true });
  const { data: CategoryData } = Queries.useGetCategory({ activeFilter: true });
  const { data: productData } = Queries.useGetProduct({ activeFilter: true });

  interface StockFormProps {
    id: string;
    name: string;
    batch: string;
    landingCost: number;
    price: number;
    mrp: number;
    sellingPrice: number;
    qty: number;
    differenceAmount: number;
  }

  const [rows, setRows] = useState<StockFormProps[]>([]);

  const createRowFromProduct = (product: ProductBase): StockFormProps => ({
    id: product._id,
    name: product.name,
    batch: "",
    landingCost: product.landingCost ?? 0,
    price: product.purchasePrice ?? 0,
    mrp: product.mrp ?? 0,
    sellingPrice: product.sellingPrice ?? 0,
    qty: 1,
    differenceAmount: (product.landingCost ?? 0) * 1,
  });

  const updateRow = (id: string, data: Partial<StockFormProps>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const updated = { ...r, ...data };

        return { ...updated, differenceAmount: updated.landingCost * updated.qty };
      })
    );
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const initialValues = {
    department: null,
    categoryId: null,
    brandId: null,
  };
  const handleSubmit = () => {};
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK.ADD} maxItems={3} breadcrumbs={BREADCRUMBS.STOCK.ADD} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ dirty }) => (
                  <Form noValidate>
                    <Grid container spacing={2}>
                      <CommonValidationSelect name="department" label="Department" options={DEPARTMENT_OPTIONS} grid={{ xs: 12, sm: 6, md: 3 }} />
                      <CommonValidationSelect name="categoryId" label="Category" placeholder="Category & Subcategory Selection" options={GenerateOptions(BrandsData?.data?.brand_data)} grid={{ xs: 12, sm: 6, md: 3 }} />
                      <CommonValidationSelect name="brandId" label="Brand" placeholder="Brand & Subbrand Selection" options={GenerateOptions(CategoryData?.data?.category_data)} grid={{ xs: 12, md: 3 }} />
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
                  options={GenerateOptions(productData?.data?.product_data)}
                  grid={{ xs: 12, sm: 6 }}
                  onChange={(selected: string[]) => {
                    setSearchValue(selected);
                    if (!selected.length) return;

                    const product = productData?.data?.product_data?.find((p) => p._id === selected[0]);
                    if (!product) return;

                    setRows((prev) => {
                      const existing = prev.find((r) => r.id === product._id);

                      if (existing) {
                        return prev.map((r) => (r.id === product._id ? { ...r, qty: r.qty + 1, differenceAmount: (r.landingCost ?? 0) * (r.qty + 1) } : r));
                      }

                      return [...prev, createRowFromProduct(product)];
                    });

                    setSearchValue([]);
                  }}
                />
                <CommonTextField label="Enter Remark" placeholder="Enter Remark" grid={{ xs: 12, sm: 6 }} value={enterRemark} onChange={(e) => setEnterRemark(e)} />
              </Grid>
            </Grid>

            <Grid size={12}>
              <div className="w-full bg-white dark:bg-gray-dark">
                <div className="lg:h-[420px] max-h-[420px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
                  <table className="w-full text-sm ">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                      <tr>
                        <th className="p-2">Sr No.</th>
                        <th className="p-2 text-start">Product</th>
                        <th className="p-2">Batch</th>
                        <th className="p-2">Landing Cost</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">MRP</th>
                        <th className="p-2">Selling Price</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Difference Amount</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, i) => {
                        return (
                          <tr key={row.id} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                            <td className="p-2 text-center">{i + 1}</td>
                            <td className="p-2 min-w-60 w-60 text-start">{row.name}</td>
                            <td className="p-2 min-w-60 w-60">
                              <CommonTextField value={row.batch} onChange={(e) => updateRow(row.id, { batch: e })} multiline />
                            </td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.landingCost} onChange={(e) => updateRow(row.id, { landingCost: Number(e) })} />
                            </td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.price} onChange={(e) => updateRow(row.id, { price: Number(e) })} />
                            </td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.mrp} onChange={(e) => updateRow(row.id, { mrp: Number(e) })} />
                            </td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.sellingPrice} onChange={(e) => updateRow(row.id, { sellingPrice: Number(e) })} />
                            </td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.qty} onChange={(e) => updateRow(row.id, { qty: Number(e) })} />
                            </td>
                            <td className="p-2">{row.differenceAmount.toFixed(2)}</td>
                            <td className="p-2">
                              <CommonButton color="error" variant="outlined" size="small" onClick={() => removeRow(row.id)}>
                                <ClearIcon />
                              </CommonButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Grid>
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};

export default StockForm;
