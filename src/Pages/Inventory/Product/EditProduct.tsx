import { Box, Grid, Button } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../../Components/Common";
import { CommonTextField } from "../../../Attribute";
import { CommonRichText } from "../../../Attribute";
import { CommonButton } from "../../../Attribute";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <h2 style={{ margin: 3 }}>Edit Product</h2>
      </Box>

      <Formik
        initialValues={{
          itemCode: data?.itemCode || "",
          productType: data?.productType || "",
          productName: data?.name || "",
          printName: "",
          category: data?.category || "",
          subCategory: "",
          brand: data?.brand || "",
          subBrand: "",
          uom: "",
          hsn: data?.hsn || "",
          purchaseTax: "",
          salesTax: "",
          expiryDays: "",
          calculateExpiryOn: "",
          shortDescription: "",
          description: data?.description || "",

          purchasePrice: "",
          landingCost: "",
          mrp: data?.mrp || "",
          sellingDiscount: "",
          sellingPrice: data?.sellingPrice || "",
          sellingMargin: "",
          retailerDiscount: "",
          retailerPrice: "",
          retailerMargin: "",
          wholesalerDiscount: "",
          wholesalerPrice: "",
          wholesalerMargin: "",
          minimumQty: "",
        }}
        onSubmit={(values) => {
          console.log("Edit Product Data:", values);
        }}
      >
        <Form>
          <Grid container spacing={2}>
            <CommonCard title="General Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="itemCode" label="Item Code / Barcode" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="productType" label="Product Type" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="productName" label="Product Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="printName" label="Print Name" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="category" label="Category" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="subCategory" label="Sub Category" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="brand" label="Select Brand" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="subBrand" label="Sub Brand" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="uom" label="Select UOM" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="hsn" label="HSN Code" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="purchaseTax" label="Purchase Tax" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="salesTax" label="Sales Tax" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="expiryDays" label="Select Expiry Days" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="calculateExpiryOn" label="Calculate Expiry On" required grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="shortDescription" label="Short Description" grid={{ xs: 12 }} />

                {/*  RICH TEXT EDITOR APPLIED HERE */}
                <Grid size="auto">
                  <CommonRichText />
                </Grid>
              </Grid>
            </CommonCard>

            {/*  PRICING DETAILS  */}
            <CommonCard title="Pricing Details" grid={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <CommonTextField name="purchasePrice" label="Purchase Price"  required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="landingCost" label="Landing Cost"  required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="mrp" label="MRP" required type="number" grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="sellingDiscount" label="Selling Discount (%)" required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="sellingPrice" label="Selling Price" required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="sellingMargin" label="Selling Margin (%)" required type="number" grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="retailerDiscount" label="Retailer Discount (%)" required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="retailerPrice" label="Retailer Price" required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="retailerMargin" label="Retailer Margin (%)" type="number" required grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="wholesalerDiscount" label="Wholesaler Discount (%)" type="number" required grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="wholesalerPrice" label="Wholesaler Price" required type="number" grid={{ xs: 12, md: 6 }} />
                <CommonTextField name="wholesalerMargin" label="Wholesaler Margin (%)" required type="number" grid={{ xs: 12, md: 6 }} />

                <CommonTextField name="minimumQty" label="Minimum Qty" grid={{ xs: 12, md: 6 }} />
              </Grid>
            </CommonCard>

            {/* ACTION BUTTONS  */}
            <Grid className="w-full! flex justify-end ">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" />

                <CommonButton type="submit" variant="contained" title="Save" />
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
};

export default EditProduct;
