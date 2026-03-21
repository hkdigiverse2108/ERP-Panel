import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import { FormatDate, inWords } from "../../../../Utils";
import { ImagePath } from "../../../../Constants";

const StockTransferReceipt = forwardRef<HTMLDivElement, { bill: any }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    let totalQty = 0;
    let totalAmount = bill.totalAmount || bill.summary?.netAmount || 0;
    const roundOff = bill.roundOff || bill.summary?.roundOff || 0;

    bill.items?.forEach((item: any) => {
        totalQty += (item.qty || 0);
    });

    return (
        <div ref={ref} className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black font-sans text-[11px] flex flex-col relative" style={{ fontFamily: "Arial, sans-serif" }}>
            
            {/* Header / Logo section */}
            <div className="relative pt-8 pb-4 px-8 flex justify-between items-start">
                <div className="w-1/2">
                    {company?.logo ? (
                        <img src={company.logo} alt="Logo" className="h-14 object-contain" />
                    ) : (
                        <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Logo" className="h-14 object-contain" />
                    )}
                </div>
                <div className="w-1/2 text-right flex flex-col items-end">
                    <div className="text-[18px] font-bold mb-1">Stock Transfer</div>
                    <div className="text-[9px] w-64 leading-tight mb-1 font-bold">
                        {company?.address?.addressLine1 || "Synthesis The First, Corporate House, THE FIRST, A5, Nyay Marg, near Itc Narmada, I I M, Vastrapur"}
                    </div>
                    <div className="text-[10px] leading-tight">
                        <span className="font-semibold">State :</span> {company?.address?.state?.name || "Gujarat"} ({company?.address?.state?.stateCode || "24"})<br />
                        <span className="font-semibold">GSTIN/UIN :</span> {company?.gstIn || "07AAGFF2194N1Z1"}<br />
                        <span className="font-semibold">PAN No:</span> {company?.panNo || "AACCA8432H"}<br />
                        <span className="font-semibold">Mobile No :</span> {company?.phoneNo?.phoneNo || "1234567899"}<br />
                        <span className="font-semibold">Email :</span> {company?.email || "email.vasyerp@gmail.com"}
                    </div>
                </div>
            </div>

            <div className="w-full border-t border-gray-200 mt-2 mb-4"></div>

            {/* Details Section */}
            <div className="flex px-8 mb-6">
                <div className="w-1/2 flex flex-col gap-0.5 text-[11px]">
                    <div className="flex"><span className="w-24 font-bold">Buyer</span><span>:- {bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : (bill.buyerName || "test")}</span></div>
                    <div className="flex"><span className="w-24 font-bold">Address</span><span>:- {bill.customerId?.address?.[0]?.addressLine1 || ""}</span></div>
                    <div className="flex"><span className="w-24 font-bold">City</span><span>:- {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"}</span></div>
                    <div className="flex"><span className="w-24 font-bold">State</span><span>:- {bill.customerId?.address?.[0]?.state?.name || "Gujarat"} ({bill.customerId?.address?.[0]?.state?.stateCode || "24"})</span></div>
                    <div className="flex"><span className="w-24 font-bold">GSTIN</span><span>:- {(bill.customerId as any)?.gstin || ""}</span></div>
                    <div className="flex"><span className="w-24 font-bold">Contact No</span><span>:- {bill.customerId?.phoneNo?.phoneNo || "963852741"}</span></div>
                </div>
                <div className="w-1/2 flex flex-col justify-start items-end gap-1 text-[11px] font-bold">
                    <div className="flex w-56 justify-between">
                        <span>Transfer Date</span>
                        <span>: {FormatDate(bill.createdAt || bill.date || new Date())}</span>
                    </div>
                    <div className="flex w-56 justify-between">
                        <span>Transfer No.</span>
                        <span>: {bill.transferNo || bill.orderNo || bill.estimateNo || "267"}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="px-8 flex-1 flex flex-col">
                <table className="w-full text-[11px] text-center table-fixed">
                    <thead className="bg-[#1f7335] text-white">
                        <tr className="h-8">
                            <th className="py-1 px-2 w-[5%] text-center font-normal">#</th>
                            <th className="py-1 px-2 w-[45%] text-left font-normal">Description of Goods</th>
                            <th className="py-1 px-2 w-[15%] text-center font-normal">UOM</th>
                            <th className="py-1 px-2 w-[10%] text-center font-normal">QTY</th>
                            <th className="py-1 px-2 w-[10%] text-center font-normal">Rate</th>
                            <th className="py-1 px-2 w-[15%] text-center font-normal">Total</th>
                        </tr>
                    </thead>
                    <tbody className="align-top border-b border-gray-200">
                        {bill.items?.map((item: any, index: number) => {
                            const rate = item.mrp || item.unitCost || item.rate || 0;
                            const qty = item.qty || 1;
                            const rowTotal = item.total || item.netAmount || item.amount || (rate * qty);

                            return (
                                <tr key={index} className="h-8 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="py-2 px-2 text-center">{index + 1}</td>
                                    <td className="py-2 px-2 text-left text-gray-800">
                                        <div className="uppercase">{item.productId?.name || "BINDI SHEET"}</div>
                                    </td>
                                    <td className="py-2 px-2">{item.productId?.uomId?.name || item.unit || "pieces"}</td>
                                    <td className="py-2 px-2">{Number(qty).toFixed(1)}</td>
                                    <td className="py-2 px-2">{Number(rate).toFixed(2)}</td>
                                    <td className="py-2 px-2">{Number(rowTotal).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="flex justify-end mt-4">
                    <div className="w-[35%] flex flex-col gap-1 text-[11px]">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="w-4 text-center">:</span>
                            <span className="w-20 text-right">{Number(totalAmount - roundOff).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Round off</span>
                            <span className="w-4 text-center">:</span>
                            <span className="w-20 text-right">{Number(roundOff).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Net Amount</span>
                            <span className="w-4 text-center">:</span>
                            <span className="w-20 text-right">{Number(totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Amount in words */}
                <div className="mt-4 text-[11px]">
                    <span className="font-bold">Amount Chargeable (In Word) : </span>
                    <span className="font-bold">Rupees {inWords(Math.round(totalAmount))} Only</span>
                </div>
            </div>

            {/* Footer / Signatures */}
            <div className="px-8 pb-8 mt-auto flex justify-between items-end relative">
                <div className="text-[9px]">
                    Prepared By : VasyERP
                </div>
                
                <div className="flex flex-col items-center min-w-[150px]">
                    {company?.signature ? (
                        <img src={company.signature} alt="Signature" className="h-12 object-contain mb-1" />
                    ) : (
                        <div className="h-12 mb-1 flex items-center justify-center">
                            <img src={`${ImagePath}/report-format/signature.png`} alt="Signature" className="h-10 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                    )}
                    <div className="border-t border-black w-full text-center pt-1 font-bold text-[11px]">
                        Authorised Signature
                    </div>
                </div>

                <div className="absolute bottom-4 right-8 text-[8px] text-gray-600">
                    E.O.E.
                </div>
            </div>
        </div>
    );
});

export default StockTransferReceipt;
