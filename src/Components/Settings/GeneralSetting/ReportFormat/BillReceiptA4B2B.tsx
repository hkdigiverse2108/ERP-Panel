import { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";

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

const BillReceiptA4B2B = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getTaxPercent = (item: PosOrderBase["items"][number]) => {
        return item?.productId?.salesTaxId?.percentage || 0;
    };

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return null;

        const parts = [
            addr.address,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name
        ].filter(Boolean);

        let addressStr = parts.join(", ");
        if (addr.pinCode) {
            addressStr += `-${addr.pinCode}`;
        }
        return addressStr;
    };

    const getCustomerAddress = () => {
        const addr = bill?.customerId?.address?.[0];
        if (!addr) return "";

        const parts = [
            addr.addressLine1,
            addr.addressLine2,
            addr.city?.name,
            addr.state?.name,
            addr.country?.name
        ].filter(Boolean);

        let addressStr = parts.join(", ");
        if (addr.pinCode) {
            addressStr += `-${addr.pinCode}`;
        }
        return addressStr;
    };

    // Calculate item-level details
    let totalQty = 0;
    let totalTaxableValue = 0;
    let totalTaxAmount = 0;
    let grandTotal = 0;

    const taxSummary: Record<string, { taxableValue: number; cgst: number; sgst: number; igst: number }> = {};

    bill.items?.forEach((item) => {
        const taxPercent = getTaxPercent(item);
        if (!taxSummary[taxPercent]) {
            taxSummary[taxPercent] = { taxableValue: 0, cgst: 0, sgst: 0, igst: 0 };
        }
        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);
        const net = ((item.mrp || 0) - discAmt) * (item.qty || 0);

        // Detailed tax calc
        let taxAmt = 0;
        if (item.productId?.isSalesTaxIncluding) {
            taxAmt = net - (net / (1 + (taxPercent / 100)));
        } else {
            taxAmt = (net * taxPercent) / 100;
        }

        const taxableVal = item.productId?.isSalesTaxIncluding ? net - taxAmt : net;
        const totalAmt = taxableVal + taxAmt;

        taxSummary[taxPercent].taxableValue += taxableVal;
        taxSummary[taxPercent].cgst += taxAmt / 2; // Assuming intra-state
        taxSummary[taxPercent].sgst += taxAmt / 2;

        totalQty += (item.qty || 0);
        totalTaxableValue += taxableVal;
        totalTaxAmount += taxAmt;
        grandTotal += totalAmt;
    });

    // Handle extra charges, round off, total amount
    const finalBillAmount = bill.totalAmount || grandTotal; // from POS data

    // For extracting date and time separately
    const dateObj = bill.createdAt ? new Date(bill.createdAt) : new Date();
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black p-4 font-sans text-[11px] leading-tight flex flex-col items-center">
            <div className="w-full border border-black relative font-semibold flex flex-col h-full">

                {/* Header Section */}
                <div className="flex w-full items-start p-2 border-b border-black text-center relative">
                    <div className="absolute left-2 top-2">
                        {company?.logo ? (
                            <img src={company.logo} alt="Company Logo" className="h-8 object-contain" />
                        ) : (
                            <h2 className="font-bold text-[24px] text-blue-500 tracking-tighter m-0 leading-none">
                                {company?.name?.split(" ")[0] || "vasy"} <span className="bg-gray-800 text-white px-2 py-0.5 rounded inline-block text-[14px] align-middle">ERP</span>
                            </h2>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="font-bold text-[18px] mb-1">{company?.name || "VasyERP Solution Private LTD"}</div>
                        <div className="font-bold text-[12px]">{getCompanyAddress() || "AddressOther-123456"}</div>
                        <div className="font-bold text-[11px] mt-1 space-x-2">
                            <span>Email : {company?.email || "himmatprajapati@vasyerp.com"}</span>
                            <span>|</span>
                            <span>Contact No. : {company?.phoneNo?.phoneNo || "9313305699"}</span>
                        </div>
                        <div className="font-bold text-[11px] mt-0.5">
                            GSTIN/UIN : {company?.gstin || "1234567890"} State : {company?.address?.state?.name || "Other(37)"}
                        </div>
                    </div>
                </div>

                {/* Info Container */}
                <div className="flex w-full border-b border-black">
                    {/* Billing Address */}
                    <div className="flex-1 border-r border-black p-2 flex flex-col">
                        <div className="font-bold mb-1">Billing Address</div>
                        <div className="font-bold">Customer name-{bill?.customerId?.phoneNo?.phoneNo || "82123345678"}</div>
                        {getCustomerAddress() ? (
                            <div className="text-[10px] mt-1 whitespace-pre-wrap">{getCustomerAddress()}</div>
                        ) : (
                            <div className="text-[10px] mt-1 flex flex-col">
                                <span>Address</span>
                                <span>Ahmedabad-123456</span>
                                <span>Gujarat(24), India</span>
                            </div>
                        )}
                        <div className="mt-4 font-bold">Company GSTIN :{(bill?.companyId as any)?.gstin || "24CUSTM1206D1ZM"}</div>
                    </div>

                    {/* Tax Invoice Stamp */}
                    <div className="w-[140px] flex justify-center -mt-3 absolute left-1/2 transform -translate-x-1/2">
                        <div className="bg-white border border-black px-4 py-1 font-bold text-[16px] shadow-sm">
                            Tax Invoice
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="w-[200px] p-2 flex flex-col text-[10px] font-bold">
                        <div className="flex justify-between">
                            <span>Invoice No.</span>
                            <span>:{bill.orderNo || "INV1"}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Invoice Date</span>
                            <span>:{formattedDate}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Rev. Charge</span>
                            <span>:NO</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Place of Supply</span>
                            <span className="text-right w-24 truncate">{bill.companyId?.address?.state?.name || "Ahmedabad, Gujarat"}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-black text-[9px] font-bold bg-gray-50">
                            <th className="border-r border-black p-1">#</th>
                            <th className="border-r border-black p-1 text-left w-[20%]">Description</th>
                            <th className="border-r border-black p-1">HSN</th>
                            <th className="border-r border-black p-1">Qty</th>
                            <th className="border-r border-black p-1">Free Qty</th>
                            <th className="border-r border-black p-1">UOM</th>
                            <th className="border-r border-black p-1">Rate</th>
                            <th className="border-r border-black p-1">MRP</th>
                            <th className="border-r border-black p-1">Discount</th>
                            <th className="border-r border-black p-1">Add Disc.</th>
                            <th className="border-r border-black p-1">Taxable Value</th>
                            <th className="border-r border-black p-1">Tax (%)</th>
                            <th className="border-r border-black p-1">Tax Amount</th>
                            <th className="p-1">Total</th>
                        </tr>
                    </thead>
                    <tbody className="align-top text-[10px]">
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
                                <tr key={index} className="border-b border-transparent">
                                    <td className="border-r border-black p-1">{index + 1}</td>
                                    <td className="border-r border-black p-1 text-left font-bold">
                                        <div>{item.productId?.name || "Product name"}</div>
                                        <div className="font-normal">{item.productId?.description || "delivery charges"}</div>
                                    </td>
                                    <td className="border-r border-black p-1">{item.productId?.hsnCode || "-"}</td>
                                    <td className="border-r border-black p-1">{Number(item.qty || 0).toString()}</td>
                                    <td className="border-r border-black p-1">0</td>
                                    <td className="border-r border-black p-1">
                                        <div className="text-[8px] leading-none mb-1">UOM</div>
                                        <div>code</div>
                                    </td>
                                    <td className="border-r border-black p-1">{Number(taxableVal / (item.qty || 1)).toFixed(3)}</td>
                                    <td className="border-r border-black p-1">{Number(item.mrp || 0).toFixed(3)}</td>
                                    <td className="border-r border-black p-1">{Number(item.discountAmount || 0).toFixed(3)}(%)</td>
                                    <td className="border-r border-black p-1">{Number(item.additionalDiscountAmount || 0).toFixed(3)}(%)</td>
                                    <td className="border-r border-black p-1 font-bold">
                                        {Number(taxableVal).toFixed(3)}<br /><span className="text-[8px] font-normal">{taxAmt > 0 && "55Rs."}</span>
                                    </td>
                                    <td className="border-r border-black p-1 font-bold">{taxPercent > 0 ? `${taxPercent.toFixed(1)}%` : "6%"}</td>
                                    <td className="border-r border-black p-1">{Number(taxAmt).toFixed(3)}</td>
                                    <td className="p-1 font-bold">{Number(totalAmt).toFixed(3)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {/* Empty Space Filler inside table to push down totals if needed, omitted for simplicity */}
                    <tfoot>
                        <tr className="border-y border-black font-bold text-[10px]">
                            <td colSpan={3} className="border-r border-black p-1 text-right">Total :</td>
                            <td className="border-r border-black p-1 text-center">{Number(totalQty).toFixed(2)}</td>
                            <td colSpan={6} className="border-r border-black"></td>
                            <td className="border-r border-black p-1 text-center">{Number(totalTaxableValue).toFixed(3)}</td>
                            <td className="border-r border-black p-1"></td>
                            <td className="border-r border-black p-1 text-center">{Number(totalTaxAmount).toFixed(3)}</td>
                            <td className="p-1 text-center">{Number(grandTotal).toFixed(3)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Notes and Net Amount Block */}
                <div className="flex w-full border-b border-black min-h-[40px]">
                    <div className="flex-1 border-r border-black p-1 text-[8px] flex flex-col justify-end">
                        <div className="font-bold">Note:</div>
                        <div>Bank Details</div>
                        <div>Bank Name</div>
                    </div>
                    <div className="w-[180px] flex flex-col justify-center p-1 text-[11px] font-bold">
                        {bill.roundOff !== 0 && (
                            <div className="flex justify-between mb-1">
                                <span>Round Off</span>
                                <span>: <span className="inline-block w-20 text-right">{Number(bill.roundOff || 0).toFixed(3)}</span></span>
                            </div>
                        )}
                        <div className="flex justify-between text-[12px]">
                            <span>Net Amount</span>
                            <span>: <span className="inline-block w-20 text-right">{Number(finalBillAmount).toFixed(3)}</span></span>
                        </div>
                    </div>
                </div>

                {/* Tax Summary Heading */}
                <div className="w-full text-center border-b border-black font-bold p-1 bg-gray-50 text-[10px]">
                    TAX SUMMARY
                </div>

                {/* Tax Table */}
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="border-b border-black text-[9px] font-bold">
                            <th className="border-r border-black p-1 w-[10%]">Sr. No.</th>
                            <th className="border-r border-black p-1 text-left w-[20%]">HSN / SAC</th>
                            <th className="border-r border-black p-1 w-[25%]">TAXABLE VALUE</th>
                            <th className="border-r border-black p-1 w-[15%]">CGST</th>
                            <th className="border-r border-black p-1 w-[15%]">SGST</th>
                            <th className="p-1 w-[15%]">IGST</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold text-[10px]">
                        {Object.keys(taxSummary).length > 0 ? (
                            Object.keys(taxSummary).map((taxP, index) => (
                                <tr key={taxP} className="border-b border-black">
                                    <td className="border-r border-black p-1">{index + 1}</td>
                                    <td className="border-r border-black p-1 text-left"></td>
                                    <td className="border-r border-black p-1">{Number(taxSummary[taxP].taxableValue || 0).toFixed(3)}</td>
                                    {/* Using CGST and SGST for now unless IGST logic is added */}
                                    <td className="border-r border-black p-1">0.000</td>
                                    <td className="border-r border-black p-1">0.000</td>
                                    <td className="p-1">{Number(taxSummary[taxP].cgst * 2).toFixed(3)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-black">
                                <td colSpan={6} className="p-1 italic">No taxes applied</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Amount in words */}
                <div className="w-full border-b border-black p-2 font-bold text-[11px]">
                    Rupees {inWords(Math.round(finalBillAmount))}
                </div>

                {/* Blank space to push footer */}
                <div className="flex-1"></div>

                {/* Footer Notes */}
                <div className="w-full p-2 flex justify-between items-end text-[9px] mt-8 font-normal">
                    <div>This is computer generated invoice.</div>
                    <div>Page 1 of 1</div>
                    <div>E.O.E.</div>
                </div>

            </div>
        </div>
    );
});

export default BillReceiptA4B2B;
