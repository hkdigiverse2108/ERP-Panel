import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import { FormatDate, inWords } from "../../../../Utils";
import { ImagePath } from "../../../../Constants";

const DeliveryChallanReceiptType2 = forwardRef<HTMLDivElement, { bill: any }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    let totalQty = 0;
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalAmount = bill.totalAmount || bill.summary?.netAmount || 0;
    const roundOff = bill.roundOff || bill.summary?.roundOff || 0;

    bill.items?.forEach((item: any) => {
        totalQty += (item.qty || 0);
        const rate = item.mrp || item.unitCost || item.rate || 0;
        const disc1 = item.discountAmount || 0;
        const disc2 = item.additionalDiscountAmount || 0;
        const discAmt = disc1 + disc2;
        
        const taxable = item.netAmount || ((rate - discAmt) * (item.qty || 1));
        subTotal += taxable;
        
        let taxAmt = item.taxAmount || 0;
        if (!taxAmt && item.productId?.salesTaxId?.percentage && item.netAmount) {
            taxAmt = item.productId.isSalesTaxIncluding ? 0 : (item.netAmount * item.productId.salesTaxId.percentage) / 100;
        }
        totalTax += taxAmt;
    });

    if (totalAmount === 0 && subTotal > 0) {
        totalAmount = subTotal + totalTax;
    }

    return (
        <div ref={ref} className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black font-sans text-[11px] flex flex-col relative border border-black" style={{ fontFamily: "Arial, sans-serif" }}>
            
            {/* Header / Logo section */}
            <div className="relative pt-6 pb-2 px-6 flex items-center min-h-[80px]">
                {company?.logo ? (
                    <img src={company.logo} alt="Logo" className="h-10 object-contain" />
                ) : (
                    <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Logo" className="h-10 object-contain" />
                )}
            </div>

            {/* Separator line and Delivery Challan Box */}
            <div className="w-full border-t border-black relative mt-2">
                <div className="absolute right-2 -top-5 text-[10px] font-normal bg-white px-1">Orignal / Duplicate / Transport</div>
                <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 font-bold text-[16px] px-8 py-0.5 border border-black bg-white flex items-center justify-center">
                    Delivery Challan
                </div>
            </div>

            {/* Addresses and Details Columns */}
            <div className="flex border-b border-black">
                <div className="w-[35%] border-r border-black flex flex-col px-2 py-1">
                    <div className="font-bold text-[14px]">Billing Address</div>
                    <div className="font-bold mt-1 text-[11px]">{bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>
                    <div className="text-[10px] leading-tight mt-0.5">
                      {bill.customerId?.address?.[0]?.addressLine1 || "Address"}<br />
                      {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"}-{bill.customerId?.address?.[0]?.pinCode || "123456"}<br />
                      {company?.address?.state?.name || "Gujarat"}(24), India<br />
                      Mo. : {bill.customerId?.phoneNo?.phoneNo || ""}<br />
                      Company GSTIN : {(bill.customerId as any)?.gstin || "24CUSTM1206D1ZM"}
                    </div>
                </div>
                <div className="w-[35%] border-r border-black flex flex-col px-2 py-1">
                    <div className="font-bold text-[14px]">Shipping Address</div>
                    <div className="font-bold mt-1 text-[11px]">{bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>
                    <div className="text-[10px] leading-tight mt-0.5">
                      {bill.customerId?.address?.[0]?.addressLine1 || "Address"}<br />
                      {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"}, {bill.customerId?.address?.[0]?.pinCode || "123456"}<br />
                      {company?.address?.state?.name || "Gujarat"}({company?.address?.state?.name || "Gujarat"}), India<br />
                      Consignee GSTIN : {(bill.customerId as any)?.gstin || "24CUSTM1206D1ZM"}
                    </div>
                </div>
                <div className="w-[30%] flex flex-col px-2 py-2 text-[10px] font-bold gap-1 mt-2">
                    <div className="flex justify-between">
                        <span className="w-24">Estimate No.</span>
                        <span className="flex-1">: {bill.orderNo || bill.estimateNo || "DC1"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="w-24">Estimate Date</span>
                        <span className="flex-1">: {FormatDate(bill.createdAt || bill.date || new Date())}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="w-24">Rev. Charge</span>
                        <span className="flex-1">: {bill.revCharge || "NO"}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="flex-1 flex flex-col relative items-stretch">
                <table className="w-full text-[10px] text-center table-fixed flex-1 h-full">
                    <thead className="h-8">
                        <tr className="border-b border-black font-bold h-full">
                            <th className="border-r border-black py-1 px-1 w-[4%] text-center align-middle">#</th>
                            <th className="border-r border-black py-1 px-2 w-[28%] text-left align-middle">Description</th>
                            <th className="border-r border-black py-1 px-1 w-[7%] text-center align-middle">HSN</th>
                            <th className="border-r border-black py-1 px-1 w-[7%] text-center align-middle">Qty</th>
                            <th className="border-r border-black py-1 px-1 w-[6%] text-center align-middle">UOM</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Rate</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Discount</th>
                            <th className="border-r border-black py-1 px-1 w-[10%] text-center align-middle">Taxable</th>
                            <th className="border-r border-black py-1 px-1 w-[7%] text-center align-middle">Tax (%)</th>
                            <th className="border-r border-black py-1 px-1 w-[8%] text-center align-middle">Tax Amount</th>
                            <th className="py-1 px-1 w-[10%] text-center align-middle text-right pr-2">Total</th>
                        </tr>
                    </thead>
                    <tbody className="align-top relative">
                        {bill.items?.map((item: any, index: number) => {
                            const disc1 = item.discountAmount || 0;
                            const disc2 = item.additionalDiscountAmount || 0;
                            const discAmt = disc1 + disc2;
                            const rate = item.mrp || item.unitCost || item.rate || 0;
                            const taxable = item.netAmount || ((rate - discAmt) * (item.qty || 1));
                            
                            let taxAmt = item.taxAmount || 0;
                            const taxPercent = item.productId?.salesTaxId?.percentage || 0;
                            if (!taxAmt && taxPercent && item.netAmount) {
                                taxAmt = item.productId.isSalesTaxIncluding ? 0 : (item.netAmount * taxPercent) / 100;
                            }
                            const rowTotal = taxable + taxAmt;

                            return (
                                <tr key={index} className="h-8">
                                    <td className="border-r border-black py-1 px-1">{index + 1}</td>
                                    <td className="border-r border-black py-1 px-2 text-left">
                                        <div className="font-bold">{item.productId?.name || "Product name"}</div>
                                        {item.productId?.variant && <div className="text-gray-700">({item.productId.variant})</div>}
                                        {item.productId?.description && <div className="text-gray-600 mt-0.5">{item.productId.description}</div>}
                                    </td>
                                    <td className="border-r border-black py-1 px-1">{item.productId?.hsnCode || "-"}</td>
                                    <td className="border-r border-black py-1 px-1">{Number(item.qty || 0).toFixed(3)}</td>
                                    <td className="border-r border-black py-1 px-1">{item.productId?.uomId?.name || item.unit || "UOM"}</td>
                                    <td className="border-r border-black py-1 px-1">{Number(rate).toFixed(3)}</td>
                                    <td className="border-r border-black py-1 px-1">{discAmt > 0 ? `${Number(discAmt).toFixed(3)}(%)` : "-"}</td>
                                    <td className="border-r border-black py-1 px-1">{Number(taxable).toFixed(3)}</td>
                                    <td className="border-r border-black py-1 px-1">{taxPercent > 0 ? `${taxPercent.toFixed(1)}%` : "-"}</td>
                                    <td className="border-r border-black py-1 px-1">{Number(taxAmt).toFixed(3)}</td>
                                    <td className="py-1 px-1 text-right pr-2">{Number(rowTotal).toFixed(3)}</td>
                                </tr>
                            );
                        })}

                        {/* Additional charges mapping if any */}
                        {bill.additionalCharges?.map((charge: any, idx: number) => {
                            const taxPercent = charge.taxPercentage || 0;
                            const taxAmt = charge.taxAmount || 0;
                            return (
                                <tr key={`charge-${idx}`} className="h-8">
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-2 text-left">
                                        {charge.accountId?.name || charge.name || charge.accountId || "delivery charges"}
                                    </td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1">{Number(charge.rate || charge.amount || 0).toFixed(3)}</td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1 font-bold">{taxPercent > 0 ? `${taxPercent.toFixed(3)}%` : ""}</td>
                                    <td className="border-r border-black py-1 px-1 font-bold">{taxAmt > 0 ? Number(taxAmt).toFixed(3) : ""}</td>
                                    <td className="py-1 px-1 text-right pr-2 font-bold">{Number(charge.totalAmount || charge.amount || 0).toFixed(3)}</td>
                                </tr>
                            );
                        })}

                        {/* Empty Space filler */}
                        <tr className="h-full">
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black relative">
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30 mt-32">
                                    <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Watermark" className="w-[60%] opacity-20 ml-20" />
                                    <div className="text-2xl font-bold mt-2 ml-20 tracking-widest text-[#70bed4] opacity-50">ERP | POS | CRM</div>
                                </div>
                            </td>
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
                            <td colSpan={2} className="border-r border-black py-1 px-2 text-center">Total :</td>
                            <td className="border-r border-black py-1 px-1"></td>
                            <td className="border-r border-black py-1 px-1">{Number(totalQty).toFixed(3)}</td>
                            <td className="border-r border-black py-1 px-1"></td>
                            <td className="border-r border-black py-1 px-1"></td>
                            <td className="border-r border-black py-1 px-1"></td>
                            <td className="border-r border-black py-1 px-1">{Number(subTotal).toFixed(2)}</td>
                            <td className="border-r border-black py-1 px-1"></td>
                            <td className="border-r border-black py-1 px-1">{Number(totalTax).toFixed(3)}</td>
                            <td className="py-1 px-1 text-right pr-2">{Number(totalAmount).toFixed(3)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Summary Totals Row */}
            <div className="flex border-t border-black text-[11px] font-bold h-[90px]">
                <div className="flex-1 border-r border-black"></div>
                <div className="w-[30%] flex flex-col justify-center px-4 py-1">
                    <div className="flex justify-between mb-1">
                        <span>Sub Total</span>
                        <span>: <span className="inline-block w-20 text-right">{Number(subTotal).toFixed(3)}</span></span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Discount</span>
                        <span>: <span className="inline-block w-20 text-right">{Number(totalDiscount).toFixed(3)}</span></span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Tax Amount</span>
                        <span>: <span className="inline-block w-20 text-right">{Number(totalTax).toFixed(3)}</span></span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Round Off</span>
                        <span>: <span className="inline-block w-20 text-right">{Number(roundOff).toFixed(3)}</span></span>
                    </div>
                    <div className="flex justify-between">
                        <span>Net Amount</span>
                        <span>: <span className="inline-block w-20 text-right">{Number(totalAmount).toFixed(3)}</span></span>
                    </div>
                </div>
            </div>

            {/* In Words */}
            <div className="border-t border-b border-black py-1.5 px-2 text-[10px] items-center font-bold">
                Rupees {inWords(Math.round(totalAmount))} Only
            </div>

            {/* Footer / Signature Area */}
            <div className="min-h-[110px] relative p-3 font-bold text-right text-[12px] flex flex-col">
                <div className="text-left font-bold text-[12px]">Terms & Conditions</div>
                
                <div className="flex-1 mt-6 mr-8 flex flex-col items-end justify-end">
                    <div className="border-t border-black w-48 mb-1"></div>
                    <div className="text-[11px]">Authorised Signatory</div>
                </div>

                <div className="absolute bottom-1 left-3 text-[9px] font-normal text-gray-700">
                    This is computer generated
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-normal text-gray-700">
                    Page 1 of 1
                </div>
                <div className="absolute bottom-1 right-2 text-[9px] font-normal text-gray-800">
                    E.O.E.
                </div>
            </div>
        </div>
    );
});

export default DeliveryChallanReceiptType2;
