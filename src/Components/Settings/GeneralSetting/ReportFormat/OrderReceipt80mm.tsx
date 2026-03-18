import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PurchaseOrderBase } from "../../../../Types/PurchaseOrder";
import { FormatDate } from "../../../../Utils";

const OrderReceipt80mm = forwardRef<HTMLDivElement, { bill: PurchaseOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return null;

        const parts = [addr.address, addr.city?.name, addr.state?.name, "India"].filter(Boolean);
        return parts.join(", ");
    };

    const totalQty = bill.items?.reduce((acc, item) => acc + (Number(item.qty) || 0), 0) || 0;
    const totalAmount = bill.summary?.netAmount || 0;

    return (
        <div ref={ref} id="order-receipt-80mm-print" className="mx-auto w-[80mm] bg-white text-black p-4 font-mono text-[11px] leading-tight">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="font-bold text-[14px] uppercase tracking-wider">{company?.name || "VasyERP"}</h1>
                <div className="font-semibold text-[10px]">
                    {getCompanyAddress()}
                </div>
                {company?.gstNo && <div className="font-bold text-[11px]">GSTIN : {company.gstNo}</div>}
            </div>

            <div className="border-y border-black border-dashed py-1 text-center font-bold text-[13px] mb-2 uppercase">
                Purchase Order
            </div>

            {/* Meta Info */}
            <div className="flex flex-col mb-2 font-bold border-b border-dashed border-black pb-2 text-[11px]">
                <div className="flex">
                    <span className="w-20">Date</span>
                    <span>: {FormatDate(bill.orderDate || new Date())}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Bill No.</span>
                    <span>: {bill.orderNo || "-"}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Supplier</span>
                    <span className="capitalize">: {bill.supplierId?.firstName ? `${bill.supplierId.firstName} ${bill.supplierId.lastName || ""}` : "-"}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Reference</span>
                    <span>: {bill.notes || "-"}</span>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-2 font-bold border-b border-dashed border-black text-[10px]">
                <thead>
                    <tr className="border-b border-dashed border-black">
                        <th className="text-left py-1 w-6">#</th>
                        <th className="text-left py-1">Item Name</th>
                        <th className="text-right py-1 w-12">Qty</th>
                        <th className="text-right py-1 w-12">UOM</th>
                    </tr>
                </thead>
                <tbody>
                    {bill.items?.map((item, index) => (
                        <tr key={index} className="align-top border-b border-dotted border-gray-300 last:border-0">
                            <td className="py-1">{index + 1}</td>
                            <td className="py-1">{(item as any).productId?.name || "-"}</td>
                            <td className="py-1 text-right">{Number(item.qty || 0).toFixed(3)}</td>
                            <td className="py-1 text-right uppercase">{item.unit || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="flex flex-wrap gap-x-4 mb-4 font-bold border-b border-dashed border-black pb-2 text-[11px]">
                <div>
                  <span>Bill Amount : </span>
                  <span>{Number(totalAmount).toFixed(2)}</span>
                </div>
                <div>
                  <span>Bill Qty : </span>
                  <span>{totalQty}</span>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4 text-[10px]">
                <h3 className="font-bold text-[12px] mb-1 underline uppercase">Terms & Conditions</h3>
                <ol className="list-decimal ml-4 font-bold space-y-0.5">
                    {bill.termsAndConditionIds?.map((term: any, index: number) => (
                        <li key={index}>{term.termsCondition}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
});

OrderReceipt80mm.displayName = "OrderReceipt80mm";

export default OrderReceipt80mm;
