import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";
import { FormatDateTime } from "../../../../Utils";

const BillReceipt80mmB2C = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

    const getCompanyAddress = () => {
        const addr = company?.address;
        if (!addr) return null;

        const parts = [addr.address, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean);

        let addressStr = parts.join(", ");
        if (addr.pinCode) {
            addressStr += ` - ${addr.pinCode}`;
        }

        return addressStr;
    };

    const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
    const tendered = bill.multiplePayments?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
    const change = Math.max(0, tendered - (bill.totalAmount || 0));

    // Calculate credits applied assuming 'credit' is a payment method, adjust if needed
    const creditsApplied = bill.multiplePayments?.filter(p => p.method?.toLowerCase() === 'credit')?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
    const cashApplied = bill.multiplePayments?.filter(p => p.method?.toLowerCase() === 'cash' || p.method?.toLowerCase() === 'card' || p.method?.toLowerCase() === 'upi')?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[80mm] bg-white text-black p-4 font-sans text-[12px] leading-snug flex flex-col items-center">
            {/* Outline box if needed for print testing, but usually it's plain */}
            <div className="w-full flex justify-end font-bold italic mb-2">
                (Duplicate)
            </div>

            {/* Header */}
            <div className="text-center mb-3 w-full">
                <h2 className="font-bold text-[18px] mb-1">{company?.name || "VasyERP"}</h2>
                <div className="text-[10px] font-bold leading-tight flex flex-col items-center">
                    {getCompanyAddress() ? <div>{getCompanyAddress()}</div> : (
                        <>
                            <div>Information Technology Park Ltd, Pioneer</div>
                            <div>Building, Whitefield Road, Bengaluru, Mahe,</div>
                            <div>Puducherry-673310</div>
                        </>
                    )}
                    {company?.phoneNo ? (
                        <div>
                            Ph:+{company.phoneNo.countryCode}-{company.phoneNo.phoneNo}
                        </div>
                    ) : (
                        <div>Ph:+91-7972596928</div>
                    )}
                    <div className="mt-1">
                        GST No:{company?.gstin || "34AACCC1596Q002"}
                    </div>
                </div>
            </div>

            <div className="font-bold underline text-[14px] mb-2 tracking-wide">
                Invoice
            </div>

            {/* Customer Meta */}
            <div className="flex flex-col mb-1 text-[11px] font-bold w-full">
                <div className="flex">
                    <div className="w-20">Invoice No</div>
                    <div>: {bill.orderNo || "V2-POS523"}</div>
                </div>
                <div className="flex">
                    <div className="w-20">Invoice Dt</div>
                    <div>: {FormatDateTime(bill.createdAt)}</div>
                </div>
                <div className="flex">
                    <div className="w-20">Name</div>
                    <div>: {bill?.customerId?.firstName ? `${bill.customerId.firstName} ${bill.customerId.lastName || ""}` : "adityapatel"}</div>
                </div>
                <div className="flex">
                    <div className="w-20">Phone No</div>
                    <div>: +{bill?.customerId?.phoneNo?.countryCode || "91"}-{bill?.customerId?.phoneNo?.phoneNo || "8511865214"}</div>
                </div>
            </div>

            {/* Product Table */}
            <table className="w-full text-[11px] font-bold mb-1">
                <thead>
                    <tr className="border-y border-black">
                        <th className="text-left py-1 w-[40%] p-0">Product</th>
                        <th className="text-center py-1 w-[12%] p-0">Qty</th>
                        <th className="text-center py-1 w-[16%] p-0">Price</th>
                        <th className="text-center py-1 w-[16%] p-0">Disc</th>
                        <th className="text-right py-1 w-[16%] p-0">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {bill?.items?.map((item, index) => {
                        const discAmt = (item.discountAmount || 0) + (item.additionalDiscountAmount || 0);

                        return (
                            <React.Fragment key={index}>
                                <tr className="align-top border-b border-transparent">
                                    <td className="py-1 p-0 uppercase">
                                        <div>{item.productId?.name}</div>
                                    </td>
                                    <td className="text-center py-1 p-0">{Number(item.qty || 0).toString()}</td>
                                    <td className="text-center py-1 p-0">{Number(item.mrp || 0).toString()}</td>
                                    <td className="text-center py-1 p-0">{Number(discAmt).toFixed(2)}</td>
                                    <td className="text-right py-1 p-0">{Number(item.netAmount || 0).toFixed(2)}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <div className="w-full border-t border-black mb-1"></div>

            {/* Totals */}
            <div className="text-[11px] font-bold w-full">
                {bill.roundOff !== 0 && (
                    <div className="flex justify-end gap-2">
                        <span className="w-32 text-right">Round off :</span>
                        <span className="w-20 text-right">{Number(bill.roundOff || 0).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <span className="w-32 text-right">Bill Amount :</span>
                    <span className="w-20 text-right">{Number(bill.totalAmount?.toFixed(2) || 0).toFixed(2)}</span>
                </div>
                {bill.additionalCharges?.length > 0 && (
                    <div className="flex justify-end gap-2 mb-1">
                        <span className="w-32 text-right">Additional Charge :</span>
                        <span className="w-20 text-right">{Number(bill.additionalCharges?.reduce((acc, charge) => acc + (charge.totalAmount || 0), 0)?.toFixed(2) || 0)}</span>
                    </div>
                )}
                <div className="w-full border-t border-black mt-1 mb-1"></div>

                {/* Payment Details */}
                <div className="flex justify-between w-full">
                    <div className="w-32">Payment Details:</div>
                    <div className="flex flex-col flex-1 items-end">
                        {creditsApplied > 0 && (
                            <div className="flex justify-end gap-2">
                                <span className="w-20 text-right">Credits Applied :</span>
                                <span className="w-20 text-right">{Number(creditsApplied || 0).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <span className="w-20 text-right">Cash :</span>
                            <span className="w-20 text-right">{Number(cashApplied || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                            <span className="w-20 text-right">Change:</span>
                            <span className="w-20 text-right">{Number(change || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full border-t border-black mt-1 mb-1"></div>

                <div className="flex justify-between w-full mb-3">
                    <span>No. of Products : {Number(totalQty.toFixed(2)).toString().replace(/\.00$/, '')}</span>
                    <div className="flex justify-end gap-2">
                        <span className="w-20 text-right">You Saved:</span>
                        <span className="w-20 text-right">{Number((bill.totalDiscount + bill.flatDiscountAmount).toFixed(2))}</span>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="text-center font-bold text-[11px] mb-3 w-full flex flex-col gap-1 tracking-tight">
                <div>No Return</div>
                <div>No Exchange</div>
                <div>(Bill Amt Inclusive of Taxes)</div>
                <div>Thank You , Visit Again!</div>
            </div>

            {/* Barcode Placeholder */}
            <div className="flex flex-col items-center mb-1 w-full">
                <div className="h-10 border-x-4 border-l-black border-r-black flex items-end px-4 gap-1">
                    <div className="w-2 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-3 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                    <div className="w-3 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                </div>
                <div className="text-[10px] mt-1">{bill.orderNo || "V2-POS523"}</div>
            </div>
        </div>
    );
});

export default BillReceipt80mmB2C;
