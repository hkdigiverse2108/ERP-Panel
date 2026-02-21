import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setProductDetailsModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";

const ProductDetails = () => {
  const { isProductDetailsModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const ProductData = [
    // { title: "purchase Price", value: isProductDetailsModal.data?.purchasePrice },
    // { title: "landing Cost", value: isProductDetailsModal.data?.landingCost },
    // { title: "mrp", value: isProductDetailsModal.data?.mrp },
    // { title: "selling Discount", value: isProductDetailsModal.data?.sellingDiscount },
    // { title: "selling Price", value: isProductDetailsModal.data?.sellingPrice },
    // { title: "selling Margin", value: isProductDetailsModal.data?.sellingMargin },
    { title: "name", value: isProductDetailsModal.data?.name },
    { title: "print Name", value: isProductDetailsModal.data?.printName },
    { title: "category", value: isProductDetailsModal.data?.categoryId?.name },
    { title: "brand", value: isProductDetailsModal.data?.brandId?.name },
    { title: "product Type", value: isProductDetailsModal.data?.productType },
    { title: "qty", value: isProductDetailsModal.data?.qty },
    { title: "sales Tax", value: isProductDetailsModal.data?.salesTaxId?.name },
  ];

  return (
    <CommonModal title="Product Details" isOpen={isProductDetailsModal.open} onClose={() => dispatch(setProductDetailsModal({ open: false, data: null }))} className="max-w-[600px]">
      <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
        <div className="max-h-120 overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Sr No.</th>
                <th className="px-3 py-2 text-left">Product</th>
              </tr>
            </thead>
            <tbody>
              {ProductData.map((item, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark">
                  <td className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300 capitalize">{item.title}</td>
                  <td className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300 capitalize">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CommonModal>
  );
};

export default ProductDetails;
