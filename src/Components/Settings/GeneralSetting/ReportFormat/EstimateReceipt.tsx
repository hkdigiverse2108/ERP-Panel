import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import { FormatDate } from "../../../../Utils";
import { ImagePath } from "../../../../Constants";

const aToWords = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
];
const bToWords = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function inWords(num: number) {
    if ((num = num || 0) === 0) return "Zero";
    const n = (`000000000${num}`).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    let str = "";
    str += (n[1] != "00") ? (aToWords[Number(n[1])] || bToWords[n[1][0] as any] + " " + aToWords[n[1][1] as any]) + "Crore " : "";
    str += (n[2] != "00") ? (aToWords[Number(n[2])] || bToWords[n[2][0] as any] + " " + aToWords[n[2][1] as any]) + "Lakh " : "";
    str += (n[3] != "00") ? (aToWords[Number(n[3])] || bToWords[n[3][0] as any] + " " + aToWords[n[3][1] as any]) + "Thousand " : "";
    str += (n[4] != "0") ? (aToWords[Number(n[4])] || bToWords[n[4][0] as any] + " " + aToWords[n[4][1] as any]) + "Hundred " : "";
    str += (n[5] != "00") ? ((str != "") ? "and " : "") + (aToWords[Number(n[5])] || bToWords[n[5][0] as any] + " " + aToWords[n[5][1] as any]) : "";
    return str.trim();
}

const EstimateReceipt = forwardRef<HTMLDivElement, { bill: any }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (item.qty || 0), 0) || 0;
    const totalAmount = bill.totalAmount || bill.summary?.netAmount || 0;
    
    const totalTax = bill.items?.reduce((acc: number, item: any) => {
        let tax = item.taxAmount || 0;
        if (!tax && item.productId?.salesTaxId?.percentage && item.netAmount) {
             const net = item.netAmount;
             tax = item.productId.isSalesTaxIncluding ? 0 : (net * item.productId.salesTaxId.percentage) / 100;
        }
        return acc + tax;
    }, 0) || 0;

    const totalRate = bill.items?.reduce((acc: number, item: any) => acc + (item.mrp || item.unitCost || item.rate || 0), 0) || 0;
    const tableAmountAmt = bill.items?.reduce((acc: number, item: any) => acc + (item.netAmount || item.total || 0), 0) || totalAmount;

    return (
        <div ref={ref} className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black font-sans text-[12px] flex flex-col relative border border-black" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="relative pt-6 pb-4 text-center flex flex-col items-center">
                <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Logo" className="absolute left-6 top-6 h-10 object-contain" />
                <h1 className="text-xl font-bold">{company?.name || "VasyERP Solution Private LTD"}</h1>
                <div className="text-[13px]">{company?.address?.address || "Address"}</div>
                <div className="text-[13px]">Other</div>
            </div>

            <div className="text-center font-bold text-base border-y border-black py-1 uppercase tracking-widest bg-gray-50">
                ESTIMATE
            </div>

            <div className="flex border-b border-black">
                <div className="w-1/2 p-3 border-r border-black flex flex-col gap-1">
                    <div className="font-bold text-[14px]">To, {bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>
                    <div className="text-[12px] text-gray-700 mt-1">
                      {bill.customerId?.address?.[0]?.addressLine1 || "Address"}<br />
                      {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"} - {bill.customerId?.address?.[0]?.pinCode || "123456"} {company?.address?.state?.name || "Gujarat India"}
                    </div>
                </div>
                <div className="w-1/2 p-3 flex flex-col gap-2 font-bold text-[13px]">
                    <div>Estimate No. : {bill.orderNo || bill.estimateNo || "EST1"}</div>
                    <div>Estimate Date : {FormatDate(bill.createdAt || bill.date || new Date())}</div>
                    <div>Place Of Supply : {company?.address?.city?.name || "Ahmedabad"}</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative items-stretch">
                <table className="w-full text-[11px] text-center table-fixed flex-1 h-full">
                    <thead className="h-8">
                        <tr className="border-b border-black font-bold h-full">
                            <th className="border-r border-black py-1 px-1 w-[5%] text-center align-middle">Sr no</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Image</th>
                            <th className="border-r border-black py-1 px-2 w-[22%] text-left align-middle">Particular</th>
                            <th className="border-r border-black py-1 px-1 w-[12%] text-center align-middle">Brand Name</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Qty</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Unit</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Discount</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Rate</th>
                            <th className="border-r border-black py-1 px-1 w-[9%] text-center align-middle leading-tight">Tax Amount</th>
                            <th className="py-1 px-1 w-[12%] text-center align-middle">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="align-top relative">
                        {bill.items?.map((item: any, index: number) => {
                            const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
                            const rate = item.mrp || item.unitCost || item.rate || 0;
                            let amount = item.netAmount || item.total || 0;
                            if(amount === 0 && item.qty) {
                                amount = (rate - discAmt) * item.qty;
                            }
                            
                            let taxAmt = item.taxAmount || 0;
                            if (!taxAmt && item.productId?.salesTaxId?.percentage && item.netAmount) {
                                taxAmt = item.productId.isSalesTaxIncluding ? 0 : (item.netAmount * item.productId.salesTaxId.percentage) / 100;
                            }

                            return (
                                <tr key={index} className="h-8">
                                    <td className="border-r border-black py-2 px-1">{index + 1}</td>
                                    <td className="border-r border-black py-2 px-1"></td>
                                    <td className="border-r border-black py-2 px-2 text-left">
                                        <div className="font-bold">{item.productId?.name || "Product name"}</div>
                                        {item.productId?.description && <div className="text-gray-600 text-[10px] mt-0.5">{item.productId.description}</div>}
                                    </td>
                                    <td className="border-r border-black py-2 px-1">{item.productId?.brandId?.name || "brand name"}</td>
                                    <td className="border-r border-black py-2 px-1">{Number(item.qty || 0).toFixed(3)}</td>
                                    <td className="border-r border-black py-2 px-1">{item.productId?.uomId?.name || item.unit || "UOM name"}</td>
                                    <td className="border-r border-black py-2 px-1">{Number(discAmt).toFixed(2)}</td>
                                    <td className="border-r border-black py-2 px-1">{Number(rate).toFixed(2)}</td>
                                    <td className="border-r border-black py-2 px-1">{Number(taxAmt).toFixed(3)}</td>
                                    <td className="py-2 px-1">{Number(amount).toFixed(3)}</td>
                                </tr>
                            );
                        })}
                        
                        <tr className="h-full">
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot className="h-6">
                        <tr className="border-t border-black font-bold h-full">
                            <td colSpan={4} className="border-r border-black py-1 px-2 text-right"></td>
                            <td className="border-r border-black py-1 text-center align-middle">{Number(totalQty).toFixed(3)}</td>
                            <td colSpan={2} className="border-r border-black py-1 text-center align-middle"></td>
                            <td className="border-r border-black py-1 text-center align-middle">{Number(totalRate).toFixed(3)}</td>
                            <td className="border-r border-black py-1 text-center align-middle">{Number(totalTax).toFixed(3)}</td>
                            <td className="py-1 text-center align-middle">{Number(tableAmountAmt).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
                    <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Watermark" className="w-[60%] opacity-20" />
                    <div className="text-2xl font-bold mt-2 tracking-widest text-[#70bed4] opacity-50">ERP | POS | CRM</div>
                </div>
            </div>

            <div className="flex border-t border-black font-bold">
                <div className="flex-1 py-2 px-3 border-r border-black text-center text-[13px]">
                    Rupees {inWords(Math.round(totalAmount))} Only
                </div>
                <div className="w-[12%] py-2 px-2 text-center text-[15px] border-l-0">
                    {Number(totalAmount).toFixed(3)}
                </div>
            </div>

            <div className="min-h-[100px] border-t border-black relative p-3 font-bold text-right text-[12px]">
                <div>For, {company?.name || "VasyERP Solution Private"}</div>
                
                <div className="absolute bottom-4 right-4 flex flex-col items-center">
                    <div className="border-t border-black w-48 mb-2"></div>
                    <div>Authorised Signatory</div>
                </div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-normal">
                    Page 1 of 1
                </div>
            </div>
        </div>
    );
});

export default EstimateReceipt;
