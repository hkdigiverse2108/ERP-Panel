import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import { FormatDate, inWords } from "../../../../Utils";
import { ImagePath } from "../../../../Constants";

const DeliveryChallanReceipt = forwardRef<HTMLDivElement, { bill: any }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const totalQty = bill.items?.reduce((acc: number, item: any) => acc + (item.qty || 0), 0) || 0;
    const totalAmount = bill.totalAmount || bill.summary?.netAmount || 0;
    const roundOff = bill.roundOff || bill.summary?.roundOff || 0;

    return (
        <div ref={ref} className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black font-sans text-[12px] flex flex-col relative border border-black" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="relative pt-4 pb-0 text-center flex flex-col items-center">
                <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Logo" className="absolute left-4 top-4 h-8 object-contain" />
                <h1 className="text-[18px] font-bold tracking-wide">{company?.name || "VasyERP Solution Private LTD"}</h1>
                <div className="text-[12px] font-bold tracking-wide">{company?.address?.address || "AddressOther-123456"}</div>
                <div className="text-[11px] font-bold mt-1 tracking-wide">Email : {company?.email || "himmatprajapati@vasyerp.com"} | Contact No. : {company?.phoneNo?.phoneNo || "9313305699"}</div>
                <div className="text-[11px] font-bold tracking-wide">GSTIN/UIN : {company?.gstin || "1234567890"} State : {company?.address?.state?.name || "Other"}(37)</div>
                
                {/* separator line below the company info */}
                <div className="w-full border-b border-black mt-3 relative h-[22px]">
                    <div className="absolute right-2 top-0.5 text-[10px] font-normal bg-white px-1">Orignal / Duplicate / Transport</div>
                    <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 font-bold text-[16px] px-8 border border-black bg-white h-7 flex items-center justify-center">
                        Delivery Challan
                    </div>
                </div>
            </div>

            <div className="flex border-b border-black">
                <div className="w-[33.33%] border-r border-black flex flex-col px-2 py-1">
                    <div className="font-bold text-[14px]">Billing Address</div>
                    <div className="font-bold text-[12px] mt-1">{bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>
                    <div className="text-[11px] leading-tight mt-0.5">
                      {bill.customerId?.address?.[0]?.addressLine1 || "Address"}<br />
                      {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"}-{bill.customerId?.address?.[0]?.pinCode || "123456"}<br />
                      {company?.address?.state?.name || "Gujarat"}(24), India<br />
                      Mo. : {bill.customerId?.phoneNo?.phoneNo || ""}
                    </div>
                </div>
                <div className="w-[33.33%] border-r border-black flex flex-col px-2 py-1">
                    <div className="font-bold text-[14px]">Shipping Address</div>
                    <div className="font-bold text-[12px] mt-1">{bill.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>
                    <div className="text-[11px] leading-tight mt-0.5">
                      {bill.customerId?.address?.[0]?.addressLine1 || "Address"}<br />
                      {bill.customerId?.address?.[0]?.city?.name || "Ahmedabad"}, {bill.customerId?.address?.[0]?.pinCode || "123456"}<br />
                      {company?.address?.state?.name || "Gujarat"}({company?.address?.state?.name || "Gujarat"}), India<br />
                      Consignee GSTIN : {(bill.customerId as any)?.gstin || "24CUSTM1206D1ZM"}
                    </div>
                </div>
                <div className="w-[33.33%] flex flex-col px-2 py-1 text-[11px] font-bold">
                    <div className="flex justify-between">
                        <span className="w-28">Deliverychallan</span>
                        <span className="flex-1">: {bill.orderNo || bill.estimateNo || "DC1"}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="w-28">Deliverychallan</span>
                        <span className="flex-1">: {FormatDate(bill.createdAt || bill.date || new Date())}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="w-28">Rev. Charge</span>
                        <span className="flex-1">: {bill.revCharge || "NO"}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="w-28">Payment Terms</span>
                        <span className="flex-1">: {bill.paymentTerms || "Payment term name"}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="w-28">Due Date</span>
                        <span className="flex-1">: {FormatDate(bill.dueDate || bill.createdAt || bill.date || new Date())}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="w-28">Place of Supply</span>
                        <span className="flex-1 leading-tight w-full break-words max-w-[120px]">: {company?.address?.city?.name || "Ahmedabad"}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative items-stretch">
                <table className="w-full text-[11px] table-fixed flex-1 h-full">
                    <thead className="h-8">
                        <tr className="border-b border-black font-bold h-full">
                            <th className="border-r border-black py-1 px-1 w-[5%] text-center align-middle">#</th>
                            <th className="border-r border-black py-1 px-1 w-[15%] text-center align-middle">Image</th>
                            <th className="border-r border-black py-1 px-2 w-[50%] text-center align-middle">Description</th>
                            <th className="border-r border-black py-1 px-1 w-[15%] text-center align-middle">Qty</th>
                            <th className="py-1 px-1 w-[15%] text-center align-middle">UOM</th>
                        </tr>
                    </thead>
                    <tbody className="align-top relative">
                        {bill.items?.map((item: any, index: number) => {
                            return (
                                <tr key={index} className="h-8 group">
                                    <td className="border-r border-black py-2 px-1 text-center font-normal">{index + 1}</td>
                                    <td className="border-r border-black py-2 px-1 text-center font-normal">
                                       {item.productId?.image && <img src={item.productId.image} alt="prd" className="w-8 h-8 mx-auto" />}
                                    </td>
                                    <td className="border-r border-black py-2 px-3 text-left">
                                        <div className="font-normal">{item.productId?.name || "Product name variant"}</div>
                                        {item.productId?.description && <div className="text-gray-600 text-[10px] mt-0.5">{item.productId.description}</div>}
                                    </td>
                                    <td className="border-r border-black py-2 px-1 text-center font-normal">{Number(item.qty || 10).toFixed(3)}</td>
                                    <td className="py-2 px-1 text-center font-normal">{item.productId?.uomId?.name || item.unit || "UOM code"}</td>
                                </tr>
                            );
                        })}

                        {/* Additional charges mapping if any */}
                        {bill.additionalCharges?.map((charge: any, idx: number) => (
                             <tr key={`charge-${idx}`} className="h-8">
                                 <td className="border-r border-black border-none py-1 px-1 text-center"></td>
                                 <td className="border-r border-black border-none py-1 px-1 text-center"></td>
                                 <td className="border-r border-black border-none py-1 px-3 text-left font-normal">
                                     {charge.accountId?.name || charge.name || "delivery charges"}
                                 </td>
                                 <td className="border-r border-black border-none py-1 px-1 text-center pr-4 text-[10px]">
                                     {charge.rate ? charge.rate + 'Rs.' : ''} {charge.taxPercentage ? charge.taxPercentage + '%' : ''}
                                 </td>
                                 <td className="border-none py-1 px-1 text-center pr-4">{(charge.totalAmount || charge.amount || 0).toFixed(3)}</td>
                             </tr>
                        ))}

                        <tr className="h-full">
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black"></td>
                            <td className="border-r border-black">
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30 mt-32">
                                    <img src={`${ImagePath}/vasy_erp_logo.png`} alt="Watermark" className="w-[40%] opacity-20" />
                                    <div className="text-2xl font-bold mt-2 tracking-widest text-[#70bed4] opacity-50">ERP | POS | CRM</div>
                                </div>
                            </td>
                            <td className="border-r border-black"></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot className="h-6">
                        <tr className="border-t border-black font-bold h-full">
                            <td colSpan={2} className="border-r border-black py-1 px-2 text-right"></td>
                            <td className="border-r border-black py-1 px-2 text-right">Total :</td>
                            <td className="border-r border-black py-1 text-center align-middle">{Number(totalQty).toFixed(3)}</td>
                            <td className="py-1 text-center align-middle"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex border-t border-black text-[12px] font-bold">
                <div className="w-[60%] border-r border-black p-1 flex">
                    <div className="w-[150px] font-bold tracking-wide">
                        <div className="text-center w-full mb-1">Bank Details</div>
                        <div className="flex justify-between"><span className="font-normal text-[10px]">Bank Name</span><span>:</span></div>
                        <div className="flex justify-between"><span className="font-normal text-[10px]">Bank Account Number</span><span>:</span></div>
                        <div className="flex justify-between"><span className="font-normal text-[10px]">Bank Branch IFSC</span><span>:</span></div>
                        <div className="flex justify-between"><span className="font-normal text-[10px]">Bank Branch Name</span><span>:</span></div>
                    </div>
                    <div className="flex-1">
                        <div className="mt-5 text-[10px] pl-2 font-normal">
                             <div>{company?.bankDetails?.bankName || ""}</div>
                             <div>{company?.bankDetails?.accountNo || ""}</div>
                             <div>{company?.bankDetails?.ifscCode || ""}</div>
                             <div>{company?.bankDetails?.branchName || ""}</div>
                        </div>
                    </div>
                </div>
                <div className="w-[40%] text-right bg-white flex flex-col justify-start">
                    <div className="flex w-full border-b border-black">
                        <div className="w-auto min-w-[50%] px-2 py-1 text-left border-r border-black font-normal">Round Off</div>
                        <div className="flex-1 px-2 py-1 text-right font-normal flex justify-between"><span>:</span><span>{Number(roundOff).toFixed(3)}</span></div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-auto min-w-[50%] px-2 py-1 text-left border-r border-black">Net Amount</div>
                        <div className="flex-1 px-2 py-1 text-right flex justify-between"><span>:</span><span>{Number(totalAmount).toFixed(3)}</span></div>
                    </div>
                </div>
            </div>

            <div className="border-t border-b border-black py-1.5 px-2 text-[12px] font-bold">
                Rupees {inWords(Math.round(totalAmount))} Only
            </div>

            <div className="min-h-[100px] relative p-2 font-bold text-right text-[12px]">
                <div className="absolute top-2 left-2 text-left">
                    Terms & Conditions
                </div>

                <div className="absolute top-2 right-8 font-bold">For, {company?.name || "VasyERP Solution Private LTD"}</div>

                <div className="absolute bottom-6 right-8 flex flex-col items-center">
                    <div className="border-t border-black w-48 mb-1"></div>
                    <div>Authorised Signatory</div>
                </div>

                <div className="absolute bottom-1 left-2 text-[10px] font-normal text-gray-700">
                    This is computer generated
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-normal text-gray-700">
                    Page 1 of 1
                </div>
                <div className="absolute bottom-1 right-2 text-[10px] font-normal text-gray-700">
                    E.O.E.
                </div>
            </div>
        </div>
    );
});

export default DeliveryChallanReceipt;
