import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import { FormatDate, inWords } from "../../../../Utils";

const PaymentReceipt = forwardRef<HTMLDivElement, { bill: any }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    let totalBillAmount = 0;
    let totalPaymentAmount = 0;

    bill.bills?.forEach((item: any) => {
        totalBillAmount += (item.billAmount || 0);
        totalPaymentAmount += (item.paymentAmount || 0);
    });

    const netAmount = bill.totalAmount || bill.amount || totalPaymentAmount || 0;

    return (
        <div ref={ref} className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black font-sans text-[12px] flex flex-col relative" style={{ fontFamily: "Arial, sans-serif" }}>
            
            {/* Header section */}
            <div className="relative pt-6 pb-2 px-8 flex flex-col items-center text-center">
                <div className="text-[18px] font-extrabold uppercase mb-1">
                    {company?.name || "VASY ERP SOLUTIONS PVT. LTD"}
                </div>
                <div className="text-[10px] w-full max-w-[80%] leading-tight font-bold">
                    {company?.address?.addressLine1 || "Ground/First Floor, A - 05, THE FIRST, Lake Road, I I M, Vastrapur"}, {company?.address?.city?.name || "Ahmedabad"}-{company?.address?.pinCode || "363520"}
                </div>
                <div className="text-[10px] leading-tight font-bold mt-0.5">
                    Email : {company?.email || "dharmendraahuja@vasyerp.com"} | Contact No. : {company?.phoneNo?.phoneNo || "9145936724"} | Fssai No. {company?.fssaiNo || ""}
                </div>
                <div className="text-[10px] leading-tight font-bold mt-0.5">
                    GSTIN/UIN : {company?.gstIn || "27AACCA8432H2ZP"} State : {company?.address?.state?.name || "Gujarat"}({company?.address?.state?.stateCode || "24"})
                </div>
            </div>

            {/* Separator and Title */}
            <div className="px-8 mt-4 flex items-center justify-center relative">
                <div className="w-full border-t border-black absolute top-1/2 left-0 -translate-y-1/2 z-0"></div>
                <div className="bg-white px-4 font-extrabold text-[15px] lowercase z-10">receipt</div>
            </div>

            {/* Details Section */}
            <div className="flex px-8 mt-5 mb-4">
                <div className="w-1/2 flex flex-col gap-0.5 pr-4">
                    <div className="font-bold text-[14px]">To,</div>
                    <div className="font-bold text-[14px]">{bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : (bill.customerName || "Akash")}</div>
                    <div className="text-[11px] mt-1 leading-tight">
                        {bill.customerId?.address?.[0]?.addressLine1 || "Crystal Indus Logistic Park, Block No.11, National Highway 8, Survey No. , Taluka Bavala"}
                    </div>
                    <div className="text-[11px] mt-4">
                        Company GSTIN :{bill.customerId?.gstin || "22AAAAA0000A1Z5"}
                    </div>
                </div>
                <div className="w-1/2 flex flex-col justify-start items-end text-[11px] font-bold">
                    <div className="w-64">
                        <div className="flex mb-1 justify-between">
                            <span className="w-28 text-left">Voucher No.</span>
                            <span className="w-4 text-center">:</span>
                            <span className="flex-1 text-left">{bill.voucherNo || bill.receiptNo || "REC2721"}</span>
                        </div>
                        <div className="flex mb-1 justify-between">
                            <span className="w-28 text-left">Voucher Date</span>
                            <span className="w-4 text-center">:</span>
                            <span className="flex-1 text-left">{FormatDate(bill.createdAt || bill.date || new Date())}</span>
                        </div>
                        <div className="flex mb-1 justify-between">
                            <span className="w-28 text-left">Type</span>
                            <span className="w-4 text-center">:</span>
                            <span className="flex-1 text-left">{bill.type || "AgainstBill"}</span>
                        </div>
                        <div className="flex mb-1 justify-between">
                            <span className="w-28 text-left">Payment Mode</span>
                            <span className="w-4 text-center">:</span>
                            <span className="flex-1 text-left">{bill.paymentMode || "Cash"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="w-28 text-left uppercase">AMOUNT</span>
                            <span className="w-4 text-center">:</span>
                            <span className="flex-1 text-left">{Number(netAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="px-8 mt-2 flex-1 flex flex-col items-stretch">
                <div className="border border-black flex-1 flex flex-col">
                    <table className="w-full text-[11px] text-center table-fixed h-full">
                        <thead>
                            <tr className="border-b border-black font-bold h-8">
                                <th className="border-r border-black py-1 px-1 w-[6%] text-center font-bold">Sr.</th>
                                <th className="border-r border-black py-1 px-2 w-[16%] text-center font-bold">Bill Date</th>
                                <th className="border-r border-black py-1 px-2 w-[22%] text-center font-bold">Bill No.</th>
                                <th className="border-r border-black py-1 px-2 w-[20%] text-center font-bold">Bill Amount</th>
                                <th className="border-r border-black py-1 px-2 w-[16%] text-center font-bold">KASAR Amount</th>
                                <th className="py-1 px-2 w-[20%] text-center font-bold">Payment Amount</th>
                            </tr>
                        </thead>
                        <tbody className="align-top flex-1">
                            {(bill.bills || bill.items || [{_id:1}]).map((item: any, index: number) => {
                                const billAmt = item.billAmount || bill.amount || 5643;
                                const payAmt = item.paymentAmount || bill.amount || 5643;
                                const kasarAmt = item.kasarAmount || 0;
                                const billNo = item.billNo || item.invoiceNo || "INVQ419";
                                const bDate = item.billDate || bill.createdAt || new Date();
                                
                                return (
                                    <tr key={index} className="h-8">
                                        <td className="border-r border-black py-1 px-1">{index + 1}</td>
                                        <td className="border-r border-black py-1 px-2">{FormatDate(bDate)}</td>
                                        <td className="border-r border-black py-1 px-2">{billNo}</td>
                                        <td className="border-r border-black py-1 px-2 text-right">{Number(billAmt).toFixed(2)}</td>
                                        <td className="border-r border-black py-1 px-2 text-right">{Number(kasarAmt).toFixed(2)}</td>
                                        <td className="py-1 px-2 text-right pr-2">{Number(payAmt).toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                            <tr className="h-full">
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-black font-bold h-8">
                                <td colSpan={3} className="border-r border-black py-1 px-2 text-right pr-4">Total :</td>
                                <td className="border-r border-black py-1 px-2 text-right">{Number(totalBillAmount || netAmount).toFixed(2)}</td>
                                <td className="border-r border-black py-1 px-2 text-right">0.00</td>
                                <td className="py-1 px-2 text-right pr-2">{Number(totalPaymentAmount || netAmount).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="border border-t-0 border-black py-1.5 px-2 font-bold text-[11px] flex items-center">
                    <span className="mr-1">Amount in words :</span>
                    <span>Rupees {inWords(Math.round(netAmount))} Only</span>
                </div>
            </div>

            {/* Footer Signatures */}
            <div className="px-8 mt-2 mb-8 flex justify-between items-start text-[11px]">
                <div className="flex flex-col gap-1 text-[9px] w-1/2 pt-1">
                    <div>Description :</div>
                    <div>{bill.description || ""}</div>
                </div>
                
                <div className="w-1/2 flex flex-col items-end gap-1 font-bold text-center">
                    <div className="mr-8">For, {company?.name || "VASY ERP SOLUTIONS PVT. LTD"}</div>
                    
                    <div className="mt-14 mr-6 flex items-center w-full justify-end">
                        <span className="w-5 border-t border-black inline-block"></span>
                        <span className="px-1">Authorised Signatory</span>
                        <span className="w-5 border-t border-black inline-block"></span>
                    </div>
                </div>
            </div>

        </div>
    );
});

export default PaymentReceipt;
