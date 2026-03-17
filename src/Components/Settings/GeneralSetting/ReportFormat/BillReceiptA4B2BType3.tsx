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
    str += (n[4] != "00") ? (aToWords[Number(n[4])] || bToWords[n[4][0] as any] + " " + aToWords[n[4][1] as any]) + "Hundred " : "";
    str += (n[5] != "00") ? ((str != "") ? "and " : "") + (aToWords[Number(n[5])] || bToWords[n[5][0] as any] + " " + aToWords[n[5][1] as any]) : "";
    return str.trim() + " Only";
}

const BillReceiptA4B2BType3 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
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
    let subTotal = 0; // Taxable value
    let grandTotal = 0; // With tax
    let totalQty = 0;
    let totalTaxAmt = 0;

    const taxSummary: Record<string, { taxableValue: number; cgst: number; sgst: number; igst: number }> = {};
    let isInterState = false; // Add logic for interstate if required

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
        if (isInterState) {
            taxSummary[taxPercent].igst += taxAmt;
        } else {
            taxSummary[taxPercent].cgst += taxAmt / 2;
            taxSummary[taxPercent].sgst += taxAmt / 2;
        }

        totalQty += (item.qty || 0);
        subTotal += taxableVal;
        totalTaxAmt += taxAmt;
        grandTotal += totalAmt;
    });

    const finalBillAmount = bill.totalAmount || grandTotal;
    const formattedDate = bill.createdAt ? FormatDate(bill.createdAt) : FormatDate(new Date());

    const dueDateObj = new Date(bill.createdAt || new Date());
    dueDateObj.setDate(dueDateObj.getDate() + 60);
    const formattedDueDate = FormatDate(dueDateObj);

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[210mm] min-h-[297mm] bg-white text-black p-4 font-sans text-[11px] leading-tight flex flex-col items-center">
            <div className="w-full border border-black relative font-semibold flex flex-col h-full bg-white flex-1">

                {/* Header Section */}
                <div className="flex w-full items-center justify-center p-2 pt-4 relative">
                    <div className="absolute left-2 top-2">
                        {company?.logo ? (
                            <img src={company.logo} alt="Company Logo" className="h-8 object-contain" />
                        ) : (
                            <h2 className="font-bold text-[24px] text-blue-500 tracking-tighter m-0 leading-none">
                                {company?.name?.split(" ")[0] || "vasy"} <span className="bg-gray-800 text-white px-2 py-0.5 rounded inline-block text-[14px] align-middle">ERP</span>
                            </h2>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center -mt-2">
                        <div className="font-bold text-[18px] mb-0.5">{company?.name || "VasyERP Solution Private LTD"}</div>
                        <div className="font-bold text-[12px]">{getCompanyAddress() || "AddressOther-123456"}</div>
                        <div className="font-bold text-[10px] mt-0.5 flex gap-1 justify-center">
                            <span>Email : {company?.email || "himmatprajapati@vasyerp.com"}</span>
                            <span>|</span>
                            <span>Contact No. : {company?.phoneNo?.phoneNo || "9313305699"}</span>
                        </div>
                        <div className="font-bold text-[10px] mt-0.5 flex gap-1 justify-center">
                            <span>GSTIN/UIN : {company?.gstin || "1234567890"}</span>
                            <span>State : {company?.address?.state?.name || "Other(37)"}</span>
                        </div>
                    </div>
                </div>

                {/* Tax Invoice Label */}
                <div className="w-full border-t border-black flex">
                    <div className="flex-1 flex justify-center items-center py-1">
                        <div className="border border-black px-8 py-0.5 font-bold text-[14px]">
                            Tax Invoice
                        </div>
                    </div>
                    <div className="absolute right-2 top-[80px] text-[10px]">
                        Original / Duplicate / Transport
                    </div>
                </div>

                {/* Addresses & Details Columns */}
                <div className="flex w-full border-t border-black min-h-[140px]">
                    {/* Billing Address */}
                    <div className="flex-1 border-r border-black p-2 flex flex-col text-[10px]">
                        <div className="font-bold text-[12px] mb-1">Billing Address</div>
                        <div className="font-bold">{(bill?.customerId?.firstName || "Customer") + " " + (bill?.customerId?.lastName || "name")}</div>
                        <div className="font-bold">{bill?.customerId?.companyName || "Company name"}</div>
                        {getCustomerAddressFields().length > 0 ? (
                            <div className="mt-1 flex flex-col">
                                <span>{getCustomerAddressFields()[0] || ""}</span>
                                <span>{bill?.customerId?.address?.[0]?.city?.name || "Ahmedabad"}-{bill?.customerId?.address?.[0]?.pinCode || "123456"}</span>
                                <span>{bill?.customerId?.address?.[0]?.state?.name || "Gujarat"}({bill?.customerId?.address?.[0]?.state?.code || "24"}), {bill?.customerId?.address?.[0]?.country?.name || "India"}</span>
                            </div>
                        ) : (
                            <div className="mt-1 flex flex-col">
                                <span>Address</span>
                                <span>Ahmedabad-123456</span>
                                <span>Gujarat(24), India</span>
                            </div>
                        )}
                        <div className="mt-1">Mo. : {bill?.customerId?.phoneNo?.phoneNo || "82123345678"}</div>
                        <div className="mt-1">Company GSTIN :{(bill?.customerId as any)?.gstin || "24CUSTM1206D1ZM"}</div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex-1 border-r border-black p-2 flex flex-col text-[10px]">
                        <div className="font-bold text-[12px] mb-1">Shipping Address</div>
                        <div className="font-bold">{(bill?.customerId?.firstName || "Customer") + " " + (bill?.customerId?.lastName || "name")}</div>
                        <div className="font-bold">{bill?.customerId?.companyName || "Company name"}</div>
                        {getCustomerAddressFields().length > 0 ? (
                            <div className="mt-1 flex flex-col">
                                <span>{getCustomerAddressFields()[0] || ""}</span>
                                <span>{bill?.customerId?.address?.[0]?.city?.name || "Ahmedabad"}, {bill?.customerId?.address?.[0]?.pinCode || "123456"}</span>
                                <span>{bill?.customerId?.address?.[0]?.state?.name || "Gujarat"}({bill?.customerId?.address?.[0]?.state?.name || "Gujarat"}), {bill?.customerId?.address?.[0]?.country?.name || "India"}</span>
                            </div>
                        ) : (
                            <div className="mt-1 flex flex-col">
                                <span>Address</span>
                                <span>Ahmedabad, 123456</span>
                                <span>Gujarat(Gujarat), India</span>
                            </div>
                        )}
                        <div className="mt-1">Consignee GSTIN :{(bill?.customerId as any)?.gstin || "24CUSTM1206D1ZM"}</div>
                    </div>

                    {/* Invoice Meta */}
                    <div className="w-[200px] p-2 flex flex-col text-[10px]">
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
                        <div className="flex justify-between mt-1 items-start">
                            <span>Payment Terms</span>
                            <span className="text-right w-24 truncate">:{(bill as any)?.paymentTermId?.name || "Payment term name"}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Due Date</span>
                            <span>:{formattedDueDate}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Place of Supply</span>
                            <span className="text-right w-24 truncate">:{bill?.companyId?.address?.state?.name || "Ahmedabad"}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Transporter Name</span>
                            <span>:</span>
                        </div>
                        <div className="flex justify-between mt-3">
                            <span>Ack Date.</span>
                            <span></span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Ack No.</span>
                            <span></span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>IRN No.</span>
                            <span></span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-center border-collapse text-[9px]">
                    <thead>
                        <tr className="border-y border-black font-bold">
                            <th className="border-r border-black p-1 w-[3%]">#</th>
                            <th className="border-r border-black p-1 text-left w-[18%]">Description</th>
                            <th className="border-r border-black p-1 w-[7%]">Itemcode</th>
                            <th className="border-r border-black p-1 w-[7%]">Net Weight</th>
                            <th className="border-r border-black p-1 w-[6%]">Qty</th>
                            <th className="border-r border-black p-1 w-[6%]">HSN</th>
                            <th className="border-r border-black p-1 w-[5%]">UOM</th>
                            <th className="border-r border-black p-1 w-[6%]">MRP</th>
                            <th className="border-r border-black p-1 w-[7%]">Discount</th>
                            <th className="border-r border-black p-1 w-[9%]">Taxable</th>
                            <th className="border-r border-black p-1 w-[7%]">Tax (%)</th>
                            <th className="border-r border-black p-1 w-[8%]">Tax</th>
                            <th className="p-1 w-[11%]">Total</th>
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
                                        <div>{item.productId?.name || "Product name variant"}</div>
                                        <div className="font-normal">{item.productId?.description || "delivery charges"}</div>
                                    </td>
                                    <td className="border-r border-black p-1">{(item.productId as any)?.code || "ItemcodeNo"}</td>
                                    <td className="border-r border-black p-1">10</td>
                                    <td className="border-r border-black p-1">{Number(item.qty || 0).toFixed(3)}</td>
                                    <td className="border-r border-black p-1">{item.productId?.hsnCode || ""}</td>
                                    <td className="border-r border-black p-1">UOM</td>
                                    <td className="border-r border-black p-1">{Number(item.mrp || 0).toFixed(3)}</td>
                                    <td className="border-r border-black p-1">{Number(discAmt || 0).toFixed(3)}(%)</td>
                                    <td className="border-r border-black p-1 font-bold">
                                        {Number(taxableVal).toFixed(3)}
                                    </td>
                                    <td className="border-r border-black p-1 font-bold">
                                        {taxPercent > 0 ? `${taxPercent.toFixed(1)}%` : "5.0%"}
                                    </td>
                                    <td className="border-r border-black p-1">
                                        {Number(taxAmt).toFixed(3)}
                                    </td>
                                    <td className="p-1 font-bold">
                                        {Number(totalAmt).toFixed(3)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-y border-black font-bold text-[10px] bg-white">
                            <td colSpan={4} className="border-r border-black p-1 text-center">Total :</td>
                            <td className="border-r border-black p-1 text-center">{Number(totalQty).toFixed(3)}</td>
                            <td className="border-r border-black p-1"></td>
                            <td className="border-r border-black p-1"></td>
                            <td className="border-r border-black p-1 text-center">{(bill?.items?.[0]?.mrp || 2000).toFixed(1)}</td>
                            <td className="border-r border-black p-1"></td>
                            <td className="border-r border-black p-1 text-center">{Number(subTotal).toFixed(1)}</td>
                            <td className="border-r border-black p-1"></td>
                            <td className="border-r border-black p-1 text-center">{Number(totalTaxAmt).toFixed(3)}</td>
                            <td className="p-1 text-center">{Number(grandTotal).toFixed(3)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Bank Details & Round Off Block */}
                <div className="flex w-full min-h-[40px] border-b border-black">
                    <div className="flex-1 border-r border-black flex flex-col">
                        <div className="font-bold text-[11px] p-1 text-center">Bank Details</div>
                        <div className="flex flex-1 p-1 text-[9px]">
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex"><span className="w-20">Name</span><span>:</span></div>
                                <div className="flex"><span className="w-20">Branch Name</span><span>:</span></div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex"><span className="w-20">Account</span><span>:</span></div>
                                <div className="flex"><span className="w-20">Branch IFSC</span><span>:</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[45%] flex flex-col justify-center p-2 text-[11px] font-bold">
                        <div className="flex justify-between mb-1">
                            <span>Round Off</span>
                            <span>: <span className="inline-block w-24 text-right">{Number(bill.roundOff || 0).toFixed(3)}</span></span>
                        </div>
                        <div className="flex justify-between">
                            <span>Net Amount</span>
                            <span>: <span className="inline-block w-24 text-right">{Number(finalBillAmount).toFixed(3)}</span></span>
                        </div>
                    </div>
                </div>

                {/* Note Row */}
                <div className="w-full border-b border-black p-1 text-[9px]">
                    Note :
                </div>

                {/* Tax Summary Heading */}
                <div className="w-full text-center border-b border-black font-bold p-1 text-[10px]">
                    TAX SUMMARY
                </div>

                {/* Tax Split Table */}
                <table className="w-full text-center border-collapse text-[9px]">
                    <thead>
                        <tr className="border-b border-black font-bold">
                            <th className="border-r border-black p-1 w-[8%]" rowSpan={2}>Sr. No.</th>
                            <th className="border-r border-black p-1 w-[12%]" rowSpan={2}>Hsn</th>
                            <th className="border-r border-black p-1 w-[20%]" rowSpan={2}>TAXABLE VALUE</th>
                            <th className="border-r border-black p-1 w-[30%]" colSpan={2}>INTEGRATED TAX</th>
                            <th className="p-1 w-[30%]" colSpan={2}>N.A.</th>
                        </tr>
                        <tr className="border-b border-black font-bold">
                            <th className="border-r border-black p-1 w-[15%]">RATE</th>
                            <th className="border-r border-black p-1 w-[15%]">AMOUNT</th>
                            <th className="border-r border-black p-1 w-[15%]">RATE</th>
                            <th className="p-1 w-[15%]">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody className="align-top font-bold text-[9px]">
                        {Object.keys(taxSummary).length > 0 ? (
                            Object.keys(taxSummary).map((taxP, index) => {
                                const rate = isInterState ? taxSummary[taxP].igst : taxSummary[taxP].cgst + taxSummary[taxP].sgst;
                                return (
                                    <tr key={taxP} className="border-b border-black">
                                        <td className="border-r border-black p-1">{index + 1}</td>
                                        <td className="border-r border-black p-1"></td>
                                        <td className="border-r border-black p-1">{Number(taxSummary[taxP].taxableValue || 0).toFixed(3)}</td>
                                        <td className="border-r border-black p-1">{Number(taxP).toFixed(1)}</td>
                                        <td className="border-r border-black p-1">{Number(rate).toFixed(3)}</td>
                                        <td className="border-r border-black p-1">N.A.</td>
                                        <td className="p-1">N.A.</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className="border-b border-black">
                                <td colSpan={7} className="p-2 italic">No taxes applied</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Amount in words */}
                <div className="w-full border-b border-black p-1 font-bold text-[10px]">
                    Rupees {inWords(Math.round(finalBillAmount))}
                </div>

                <div className="flex-1 min-h-[60px]"></div>

                {/* T&C and Signature Area */}
                <div className="flex w-full min-h-[100px] border-t border-black">
                    <div className="flex-1 border-r border-black p-2 flex flex-col">
                        <div className="font-bold text-[10px]">Terms & Conditions</div>
                    </div>
                    <div className="flex-1 p-2 flex flex-col items-center justify-between text-[11px] font-bold">
                        <div>For, {company?.name || "VasyERP Solution Private LTD"}</div>
                        <div className="flex flex-col items-center">
                            {company?.signature ? (
                                <img src={company.signature} alt="Signature" className="h-10 object-contain mb-1" />
                            ) : (
                                <div className="h-10 flex items-center justify-center font-[cursive] text-[18px] opacity-80" style={{ transform: "rotate(-10deg)" }}>
                                    Signature
                                </div>
                            )}
                            <div className="border-t border-black w-[150px] text-center pt-0.5">
                                Authorised Signatory
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer outside border box */}
            <div className="w-full flex justify-between items-end text-[9px] mt-2 font-normal">
                <div>This is computer generated invoice.</div>
                <div>Page 1 of 1</div>
                <div>E.O.E.</div>
            </div>

        </div>
    );
});

export default BillReceiptA4B2BType3;
