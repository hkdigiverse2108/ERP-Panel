import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Queries } from "../../../../Api";
import { CommonSelect } from "../../../../Attribute";
import { useAppDispatch } from "../../../../Store/hooks";
import { addOrUpdateProduct } from "../../../../Store/Slices/PosSlice";
import { GenerateOptions } from "../../../../Utils";
import { CommonDrawer } from "../../../Common";

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const { data: category, isLoading: categoryLoading } = Queries.useGetCategoryDropdown({}, open);
  const id = value[0] || "";
  const { data: productDropdown, isLoading: productDropdownLoading } = Queries.useGetProductDropdown(id ? { categoryFilter: id } : {}, open);

  const handleProductChange = (id: string) => {
    const product = productDropdown?.data?.find((item) => item._id === id);
    dispatch(addOrUpdateProduct(product));
  };

  return (
    <>
      <Tooltip title="Product">
        <div onClick={() => setOpen(!open)} className="head-icon">
          <DashboardIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonDrawer open={open} onClose={() => setOpen(!open)} anchor="right" width={900} title="Product List" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
        <Box className="flex flex-col gap-5 text-gray-800 dark:text-gray-200">
          <CommonSelect label="Select Category and Subcategory" options={GenerateOptions(category?.data)} isLoading={categoryLoading} value={value} onChange={(v) => setValue(v)} limitTags={1} />
          {productDropdownLoading ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 1.5 }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={200} height={100} className="rounded-lg!" />
              ))}
            </Box>
          ) : productDropdown?.data?.length === 0 ? (
            <Typography align="center" width="100%">
              No Product Found.
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 1.5 }}>
              {productDropdown?.data?.map((item, index) => (
                <Paper key={index} elevation={0} onClick={() => handleProductChange(item._id)} className="p-4 rounded-lg! cursor-pointer border border-gray-200! dark:border-gray-600! bg-gray-50! dark:bg-gray-800! hover:bg-gray-100! dark:hover:bg-gray-dark! hover:border-gray-300! dark:hover:border-gray-600!">
                  <Typography fontWeight={600} noWrap title={item.name}>
                    {item.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Price : {Number(item.sellingPrice).toFixed(2)} ₹
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </CommonDrawer>
    </>
  );
};

export default ProductList;
