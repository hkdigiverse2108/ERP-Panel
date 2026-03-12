import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { SupplierBillBase } from "../../../../Types/SupplierBill";
import { FormatDate } from "../../../../Utils";

const MaterialInwardReceipt = forwardRef<HTMLDivElement, { bill: SupplierBillBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return null;

        const parts = [addr.address, addr.city?.name, addr.state?.name, "India"].filter(Boolean);
        return parts.join(", ");
    };

    const totalQty = bill.productDetails?.totalQty || 0;
    const totalAmount = bill.summary?.netAmount || 0;

    return (
        <div ref={ref} id="material-inward-print" className="mx-auto w-[148mm] bg-white text-black p-4 font-serif text-[13px] border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="font-bold text-[18px] uppercase tracking-wider">{company?.name || "DISPLAY - VASYERP"}</h1>
                <div className="font-semibold text-[14px]">
                    {getCompanyAddress() || "ISKCON TEMPLE,MUDIYA AHMAD NAGAR,PILIBHIT ROAD,BAREILLY Bhavnagar,Gujarat,India"}
                </div>
                {company?.gstNo && <div className="font-bold">GSTIN : {company.gstNo}</div>}
                {!company?.gstNo && <div className="font-bold">GSTIN : 34AACCC1596Q002</div>}
            </div>

            <div className="border-t border-b border-black border-dashed py-1 text-center font-bold text-[16px] mb-2">
                Goods Receipt Note
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-x-4 mb-2 font-bold border-b border-dashed border-black pb-2">
                <div className="flex">
                    <span className="w-20">Date</span>
                    <span>: {FormatDate(bill.supplierBillDate || new Date())}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Bill No.</span>
                    <span>: {bill.supplierBillNo || "mi88231"}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Supplier</span>
                    <span className="capitalize">: {bill.supplierId?.firstName ? `${bill.supplierId.firstName} ${bill.supplierId.lastName || ""}` : "karva"}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Received</span>
                    <span>: {bill.notes || "Zaid"}</span>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-2 font-bold border-b border-dashed border-black">
                <thead>
                    <tr className="border-b border-dashed border-black">
                        <th className="text-left py-1 w-8">#</th>
                        <th className="text-left py-1">Item Name</th>
                        <th className="text-right py-1">Qty</th>
                        <th className="text-right py-1 w-20">UOM</th>
                    </tr>
                </thead>
                <tbody>
                    {bill.productDetails?.item?.map((item, index) => (
                        <tr key={index} className="align-top">
                            <td className="py-1">{index + 1}</td>
                            <td className="py-1">{item.productId?.name || "Ching's Secret Singapore Curry Instant Noodles 60 g"}</td>
                            <td className="py-1 text-right">{Number(item.qty || 1).toFixed(3)}</td>
                            <td className="py-1 text-right  uppercase">{item.productId?.uomId?.name || "Gram"}</td>
                        </tr>
                    )) || (
                        <tr className="align-top">
                            <td className="py-1">1</td>
                            <td className="py-1">Ching's Secret Singapore Curry Instant Noodles 60 g</td>
                            <td className="py-1 text-right">1.000</td>
                            <td className="py-1 text-right uppercase">Gram</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Summary */}
            <div className="flex flex-wrap gap-x-8 mb-4 font-bold border-b border-dashed border-black pb-2">
                <div>
                  <span>Bill Amount : </span>
                  <span>{totalAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span>Bill Qty : </span>
                  <span>{totalQty}</span>
                </div>
                <div className="w-full mt-1">
                  <span>Shipping Note : </span>
                  <span className="font-normal italic"></span>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4">
                <h3 className="font-bold text-[16px] mb-2 underline">Terms & Conditions</h3>
                <ol className="list-decimal ml-6 font-bold space-y-1">
                    {bill.termsAndConditionIds?.map((term, index) => (
                        <li key={index}>{term.termsCondition}</li>
                    ))}
                    {!bill.termsAndConditionIds?.length && (
                        <>
                            <li>demo</li>
                            <li>demoterm</li>
                            <li>test</li>
                            <li>testing purchase terms and conditions</li>
                            <li>I agree to the mentioned items and conditions</li>
                        </>
                    )}
                </ol>
            </div>
        </div>
    );
});

MaterialInwardReceipt.displayName = "MaterialInwardReceipt";

export default MaterialInwardReceipt;
