import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";
import { FormatDate } from "../../../../Utils";

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
    return str.trim() + " Only";
}

const BillReceiptA4B2BType2 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getTaxPercent = (item: PosOrderBase["items"][number]) => {
        return item?.productId?.salesTaxId?.percentage || 0;
    };

    const getCompanyAddressFields = () => {
        const addr = company?.address;
        if (!addr) return [];
        return [
            addr.address,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name,
            addr.pinCode ? `-${addr.pinCode}` : ""
        ].filter(Boolean);
    };

    const getCustomerAddressFields = () => {
        const addr = bill?.customerId?.address?.[0];
        if (!addr) return [];
        return [
            addr.addressLine1,
            addr.addressLine2,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name,
            addr.pinCode || ""
        ].filter(Boolean);
    };

    // Calculate totals and taxes
    let subTotal = 0; // Taxable value without tax
    let grandTotal = 0; // With tax

    const taxSummary: Record<string, { taxableValue: number; cgst: number; sgst: number; igst: number }> = {};
    let isInterState = false; // Assuming false for simplicity, could determine based on states

    bill.items?.forEach((item) => {
        const taxPercent = getTaxPercent(item);
        if (!taxSummary[taxPercent]) {
            taxSummary[taxPercent] = { taxableValue: 0, cgst: 0, sgst: 0, igst: 0 };
        }
        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
        const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);

        let taxAmt = 0;
        if (item.productId?.isSalesTaxIncluding) {
            taxAmt = net - (net / (1 + (taxPercent / 100)));
        } else {
            taxAmt = (net * taxPercent) / 100;
        }

        const taxableVal = item.productId?.isSalesTaxIncluding ? net - taxAmt : net;
        const totalAmt = taxableVal + taxAmt;

        taxSummary[taxPercent].taxableValue += taxableVal;
        if (isInterState) {
            taxSummary[taxPercent].igst += taxAmt;
        } else {
            taxSummary[taxPercent].cgst += taxAmt / 2;
            taxSummary[taxPercent].sgst += taxAmt / 2;
        }

        subTotal += taxableVal;
        grandTotal += totalAmt;
    });

    // Handle extra charges, round off, total amount
    const finalBillAmount = bill.totalAmount || grandTotal;
    const tendered = bill.multiplePayments?.reduce((acc, pay) => acc + (pay.amount || 0), 0) || 0;
    const dueAmount = Math.max(0, finalBillAmount - tendered);

    const formattedDate = bill.createdAt ? FormatDate(bill.createdAt) : FormatDate(new Date());

    // Add 60 days for due date placeholder
    const dueDateObj = new Date(bill.createdAt || new Date());
    dueDateObj.setDate(dueDateObj.getDate() + 60);
    const formattedDueDate = FormatDate(dueDateObj);

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black p-6 font-sans text-[11px] leading-snug flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="pt-8">
                    {company?.logo ? (
                        <img src={company.logo} alt="Company Logo" className="h-10 object-contain block" />
                    ) : (
                        <h2 className="font-bold text-[32px] text-blue-500 tracking-tighter m-0 leading-none">
                            {company?.name?.split(" ")[0] || "vasy"} <span className="bg-gray-800 text-white px-2 py-0.5 rounded inline-block text-[18px] align-middle">ERP</span>
                        </h2>
                    )}
                </div>

                <div className="text-right">
                    <div className="font-bold text-[16px]">Tax Invoice</div>
                    <div className="font-bold text-[14px]">{company?.name || "VasyERP Solution Private LTD"}</div>
                    <div className="text-[10px] text-gray-700">
                        {getCompanyAddressFields().length > 0 ? (
                            <>
                                <div>{getCompanyAddressFields().slice(0, 2).join(", ")}</div>
                                <div>{getCompanyAddressFields().slice(2).join(", ")}</div>
                            </>
                        ) : (
                            <>
                                <div>Address</div>
                                <div>Other - 123456</div>
                            </>
                        )}
                        <div>State : {company?.address?.state?.name || "Other(37)"}</div>
                        <div>GSTIN/UIN : {company?.gstin || "1234567890"}</div>
                        <div>PAN No : AIMPG2221M</div>
                        <div>Mobile No :{company?.phoneNo?.phoneNo || "9313305699"}</div>
                        <div>Email :{company?.email || "himmatprajapati@vasyerp.com"}</div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-300 w-full mb-3"></div>

            {/* Buyer & Invoice Meta */}
            <div className="flex justify-between text-[11px] mb-4">
                <div className="flex flex-col flex-1">
                    <div className="font-bold">Buyer :- {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "Customer name"}</div>

                    {getCustomerAddressFields().length > 0 ? (
                        <>
                            <div>Address:- {getCustomerAddressFields()[0] || ""}</div>
                            <div>City:- {bill?.customerId?.address?.[0]?.city?.name || ""}</div>
                            <div>State:- {bill?.customerId?.address?.[0]?.state?.name || ""}</div>
                        </>
                    ) : (
                        <>
                            <div>Address:- Address</div>
                            <div>City:- Ahmedabad</div>
                            <div>State:- Gujarat(24)</div>
                        </>
                    )}
                    <div>GSTIN:- {(bill?.customerId as any)?.gstin || "24CUSTM1206D1ZM"}</div>
                    <div>{bill?.customerId?.email || "customer@gmail.com"}</div>
                    <div>Contact No:- {bill?.customerId?.phoneNo?.phoneNo || "82123345678"}</div>
                </div>

                <div className="flex flex-col items-end w-[250px]">
                    <div className="flex w-full justify-between">
                        <span className="font-bold">Invoice Date</span>
                        <span>:</span>
                        <span className="w-28 text-right">{formattedDate}</span>
                    </div>
                    <div className="flex w-full justify-between mt-1">
                        <span className="font-bold">Invoice No.</span>
                        <span>:</span>
                        <span className="w-28 text-right font-bold">{bill.orderNo || "INV1"}</span>
                    </div>
                    <div className="flex w-full justify-between mt-1">
                        <span className="font-bold">Due Date</span>
                        <span>:</span>
                        <span className="w-28 text-right">{formattedDueDate}</span>
                    </div>
                    <div className="flex w-full justify-between mt-1 items-start">
                        <span className="font-bold">Payment Terms</span>
                        <span>:</span>
                        <span className="w-28 text-right break-words leading-tight">Payment term<br />name</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <table className="w-full text-center border-collapse text-[10px] mb-4">
                <thead className="bg-[#1e9b8b] text-white">
                    <tr className="border border-[#1e9b8b]">
                        <th className="p-1 px-2 text-left font-normal w-[4%]">#</th>
                        <th className="p-1 text-left font-normal w-[26%]">Description of Goods</th>
                        <th className="p-1 font-normal w-[6%]">HSN</th>
                        <th className="p-1 font-normal w-[6%]">UOM</th>
                        <th className="p-1 font-normal w-[6%]">Qty</th>
                        <th className="p-1 font-normal w-[10%]">Rate</th>
                        <th className="p-1 font-normal w-[8%]">Discount</th>
                        <th className="p-1 font-normal w-[8%]">Tax Rate</th>
                        <th className="p-1 font-normal w-[12%]">Tax<br />Amount</th>
                        <th className="p-1 text-right px-2 font-normal w-[14%]">Total</th>
                    </tr>
                </thead>
                <tbody className="align-top border-x border-[#1e9b8b]">
                    {bill?.items?.map((item, index) => {
                        const taxPercent = getTaxPercent(item);
                        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
                        const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);

                        let taxAmt = 0;
                        if (item.productId?.isSalesTaxIncluding) {
                            taxAmt = net - (net / (1 + (taxPercent / 100)));
                        } else {
                            taxAmt = (net * taxPercent) / 100;
                        }
                        const taxableVal = item.productId?.isSalesTaxIncluding ? net - taxAmt : net;
                        const totalAmt = taxableVal + taxAmt;

                        return (
                            <tr key={index} className="border-b border-gray-200 last:border-b-[#1e9b8b]">
                                <td className="p-1 px-2 text-left">{index + 1}</td>
                                <td className="p-1 text-left">
                                    <div>{item.productId?.name || "Product name"} {item.productId?.variant || "variant"}</div>
                                </td>
                                <td className="p-1">{item.productId?.hsnCode || "-"}</td>
                                <td className="p-1 leading-tight"><div className="text-[8px]">UOM</div><div>code</div></td>
                                <td className="p-1">{Number(item.qty || 0).toString()}</td>
                                <td className="p-1">{Number(taxableVal / (item.qty || 1)).toFixed(3)}</td>
                                <td className="p-1">{Number(discAmt).toFixed(3)}</td>
                                <td className="p-1">{taxPercent > 0 ? `${taxPercent}%` : "5%"}</td>
                                <td className="p-1">{Number(taxAmt).toFixed(3)}</td>
                                <td className="p-1 text-right px-2">{Number(totalAmt).toFixed(3)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Additional Charges Table (Mocked as per image) */}
            {bill.additionalCharges && bill.additionalCharges.length > 0 && (
                <table className="w-full text-center border-collapse text-[10px] mb-4">
                    <thead className="bg-[#1e9b8b] text-white">
                        <tr className="border border-[#1e9b8b]">
                            <th className="p-1 px-2 text-left font-normal w-[4%]">#</th>
                            <th className="p-1 text-left font-normal w-[48%]">Description</th>
                            <th className="p-1 font-normal w-[12%]">Rate</th>
                            <th className="p-1 font-normal w-[10%]">Tax Rate</th>
                            <th className="p-1 font-normal w-[12%]">Tax Amount</th>
                            <th className="p-1 text-right px-2 font-normal w-[14%]">Total</th>
                        </tr>
                    </thead>
                    <tbody className="align-top border-x border-b border-[#1e9b8b]">
                        {bill.additionalCharges.map((charge: any, idx) => (
                            <tr key={charge._id || charge.chargeId?._id || idx}>
                                <td className="p-1 px-2 text-left">{idx + 1}</td>
                                <td className="p-1 text-left">{charge.accountId || charge.chargeId?.name || "delivery charges"}</td>
                                <td className="p-1">{Number(charge.totalAmount || 0).toFixed(3)}</td>
                                <td className="p-1">6%</td>
                                <td className="p-1">3.300</td>
                                <td className="p-1 text-right px-2">{Number((charge.totalAmount || 0) + 3.3).toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Bank details and Summary totals */}
            <div className="flex justify-between items-start mb-6 text-[10px]">
                <div className="flex flex-col w-1/2">
                    <div className="font-bold text-[11px] mb-2 text-gray-800">Bank Details</div>
                    <div className="flex mb-1">
                        <span className="w-24">Account No :</span>
                        <span className="font-semibold"></span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-24">Name of Bank :</span>
                        <span className="font-semibold"></span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-24">Branch Name :</span>
                        <span className="font-semibold"></span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-24">IFSC Code :</span>
                        <span className="font-semibold"></span>
                    </div>
                </div>

                <div className="flex flex-col w-[250px]">
                    <div className="flex justify-between mb-1">
                        <span>SubTotal</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(subTotal).toFixed(3)}</span>
                    </div>
                    {/* Render IGST if interstate, else CGST/SGST */}
                    {isInterState ? (
                        <div className="flex justify-between mb-1">
                            <span>IGST</span>
                            <span>:</span>
                            <span className="w-24 text-right">{Number(grandTotal - subTotal).toFixed(3)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between mb-1">
                                <span>CGST</span>
                                <span>:</span>
                                <span className="w-24 text-right">{Number((grandTotal - subTotal) / 2).toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span>SGST</span>
                                <span>:</span>
                                <span className="w-24 text-right">{Number((grandTotal - subTotal) / 2).toFixed(3)}</span>
                            </div>
                        </>
                    )}
                    <div className="flex justify-between mb-1 mt-1 font-semibold">
                        <span>Total</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(grandTotal).toFixed(3)}</span>
                    </div>
                    {bill.roundOff !== 0 && (
                        <div className="flex justify-between mb-1">
                            <span>Round Off</span>
                            <span>:</span>
                            <span className="w-24 text-right">{Number(bill.roundOff || 0).toFixed(3)}</span>
                        </div>
                    )}
                    <div className="flex justify-between mb-1 font-bold">
                        <span>Net Amount</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(finalBillAmount).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Due Amount</span>
                        <span>:</span>
                        <span className="w-24 text-right">{Number(dueAmount).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="leading-tight">Received<br />Amount</span>
                        <span className="leading-none mt-auto">:</span>
                        <span className="w-24 text-right mt-auto">{Number(tendered).toFixed(3)}</span>
                    </div>
                </div>
            </div>

            {/* In Words */}
            <div className="font-bold text-[11px] mb-8">
                Amount Chargeable (In Word) : Rupees {inWords(Math.round(finalBillAmount))}
            </div>

            {/* Tax Summary Table */}
            <div className="w-full mb-4">
                <table className="w-full text-center border border-gray-300 text-[10px]">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th colSpan={5} className="p-1 font-bold">Tax Summary</th>
                        </tr>
                        <tr className="border-b border-gray-300 font-semibold bg-white">
                            <th className="border-r border-gray-300 p-1 w-[8%]">Sr No.</th>
                            <th className="border-r border-gray-300 p-1 w-[12%]">HSN</th>
                            <th className="border-r border-gray-300 p-1 w-[30%]">Taxable Value</th>
                            <th className="border-r border-gray-300 p-0 w-[25%] font-normal">
                                <div className="border-b border-gray-300 p-1 font-semibold">Integrated Tax</div>
                                <div className="flex w-full">
                                    <div className="w-1/2 p-1 border-r border-gray-300 font-semibold">Rate</div>
                                    <div className="w-1/2 p-1 font-semibold">Amount</div>
                                </div>
                            </th>
                            <th className="p-1 w-[25%]">Total Tax Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(taxSummary).length > 0 ? (
                            Object.keys(taxSummary).map((taxP, index) => {
                                const rate = isInterState ? taxSummary[taxP].igst : taxSummary[taxP].cgst + taxSummary[taxP].sgst;
                                return (
                                    <tr key={taxP} className="border-b border-gray-300 bg-white">
                                        <td className="border-r border-gray-300 p-1">{index + 1}</td>
                                        <td className="border-r border-gray-300 p-1">-</td>
                                        <td className="border-r border-gray-300 p-1">{Number(taxSummary[taxP].taxableValue || 0).toFixed(3)}</td>
                                        <td className="border-r border-gray-300 p-0 text-gray-900">
                                            <div className="flex w-full h-full">
                                                <div className="w-1/2 p-1 flex items-center justify-center">{Number(taxP).toFixed(1)}%</div>
                                                <div className="w-1/2 p-1 flex items-center justify-center">{Number(rate).toFixed(3)}</div>
                                            </div>
                                        </td>
                                        <td className="p-1">{Number(rate).toFixed(3)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-2 italic">No taxes included</td>
                            </tr>
                        )}
                        <tr className="border-gray-300 bg-white font-bold">
                            <td className="border-r border-gray-300 p-1" colSpan={2}>Total</td>
                            <td className="border-r border-gray-300 p-1">{Number(subTotal).toFixed(3)}</td>
                            <td className="border-r border-gray-300 p-0">
                                <div className="flex w-full h-full">
                                    <div className="w-1/2 p-1 border-gray-300"></div>
                                    <div className="w-1/2 p-1 flex items-center justify-center">{Number(grandTotal - subTotal).toFixed(3)}</div>
                                </div>
                            </td>
                            <td className="p-1">{Number(grandTotal - subTotal).toFixed(3)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Terms and Conditions */}
            <div className="w-full border border-gray-300 mb-[50px]">
                <div className="p-1 px-2 border-b border-gray-300 font-bold text-[10px] bg-white text-left">
                    Terms And Conditions
                </div>
                <div className="p-6 bg-white min-h-[40px]">
                    {/* Empty block as per image */}
                </div>
            </div>

            {/* Signature Area */}
            {/* <div className="flex w-full justify-end pr-6 mb-8 mt-4 relative"> */}
            {/* Simulated signature cursive text */}
            {/* <div className="absolute right-8 -top-12 opacity-80" style={{ fontFamily: "cursive", fontSize: "28px", color: "black", transform: "rotate(-10deg)" }}>
                    Signature
                </div>
                <div className="border-t border-black w-[150px] text-center pt-1 font-bold text-[10px]">
                    Authorised Signature
                </div>
            </div> */}

            <div className="flex-1 mt-auto"></div>

            {/* Footer Notes */}
            <div className="w-full flex justify-between items-end text-[9px] font-normal text-gray-700">
                <div>Prepared By : {company?.name || "VasyERP Solution Private LTD"}</div>
                <div>Subject to Other Jurisdiction</div>
                <div>E. & O.E.</div>
            </div>

        </div>
    );
});

export default BillReceiptA4B2BType2;
