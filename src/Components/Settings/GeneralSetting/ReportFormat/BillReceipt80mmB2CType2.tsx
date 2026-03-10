import React, { forwardRef } from "react";
import { useAppSelector } from "../../../../Store/hooks";
import type { PosOrderBase } from "../../../../Types";

const BillReceipt80mmB2CType2 = forwardRef<HTMLDivElement, { bill: PosOrderBase }>(({ bill }, ref) => {
    const { company } = useAppSelector((state) => state.company);
    if (!bill) return null;

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
            addressStr += `, ${addr.pinCode}`;
        }

        return addressStr;
    };

    const totalQty = bill?.items?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
    const tendered = bill.multiplePayments?.reduce((acc, payment) => acc + (payment.amount || 0), 0) || 0;
    const change = Math.max(0, tendered - (bill.totalAmount || 0));

    // For extracting date and time separately
    const dateObj = bill.createdAt ? new Date(bill.createdAt) : new Date();
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    
    // Formatting time like "05:44 PM"
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return (
        <div ref={ref} id="last-bill-print" className="mx-auto w-[80mm] bg-white text-black p-4 font-serif text-[12px] leading-snug flex flex-col items-center">
            
            {/* Logo / Header */}
            <div className="text-center w-full mb-2">
                {company?.logo ? (
                    <img src={company.logo} alt="Company Logo" className="h-12 mx-auto mb-2 object-contain" />
                ) : (
                    <h2 className="font-bold text-[24px] mb-2 text-blue-500 tracking-tighter">
                        {company?.name || "vasy"} <span className="bg-gray-800 text-white px-2 py-1 rounded inline-block text-[16px] align-middle">ERP</span>
                    </h2>
                )}
                <div className="text-[12px] font-bold leading-tight flex flex-col items-center text-center">
                    {getCompanyAddress() ? <div>{getCompanyAddress()}</div> : (
                        <div>Synthesis The First, Corporate House, THE FIRST, A5, Nyay Marg, near Itc Narmada, I I M, Vastrapur, Ahmedabad, Gujarat, India, 380054</div>
                    )}
                </div>
            </div>

            <div className="w-full border-t border-dashed border-black mb-1"></div>

            {/* Product Table */}
            <table className="w-full text-[12px] font-bold mb-1">
                <thead>
                    <tr className="border-b border-dashed border-black">
                        <th className="text-left py-1 w-[45%] p-0">Items</th>
                        <th className="text-center py-1 w-[15%] p-0">Qty</th>
                        <th className="text-center py-1 w-[20%] p-0">Price</th>
                        <th className="text-right py-1 w-[20%] p-0">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {bill?.items?.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr className="align-top">
                                    <td className="py-1 p-0">
                                        <div className="font-bold">{item.productId?._id?.slice(-6) || "RC50024"}</div>
                                    </td>
                                    <td className="text-center py-1 p-0">{Number(item.qty || 0).toFixed(3)}</td>
                                    <td className="text-center py-1 p-0">{Number(item.mrp || 0).toFixed(3)}</td>
                                    <td className="text-right py-1 p-0">{Number(item.netAmount || 0).toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="p-0 pb-1">
                                        <div className="font-bold">{item.productId?.name} {item.productId?.variant ? `/ \n${item.productId.variant}` : ""}</div>
                                        <div className="text-gray-600 font-normal leading-tight mt-1 text-[11px]">
                                            Description: {item.productId?.description || "The highlight of this product description is the use of bullet points to highlight the prima"}
                                        </div>
                                        <div className="font-bold text-[13px] mt-1">{item.productId?.name || "Product name"}</div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <div className="w-full border-t border-dashed border-black mb-1"></div>

            {/* Totals */}
            <div className="text-[13px] font-bold w-full">
                <div className="flex justify-between w-full mb-1">
                    <span>Total item sold :</span>
                    <span>{Number(totalQty).toFixed(3)}</span>
                </div>
                <div className="flex justify-between w-full mb-1">
                    <span className="w-1/2">Qatar Riyals</span>
                    <span className="w-1/4 text-center">QAR</span>
                    <span className="w-1/4 text-right">{Number(tendered || 0).toFixed(3)}</span>
                </div>
                <div className="flex justify-between w-full mb-1">
                    <span>Change Qatar Riyals</span>
                    <span>{Number(change || 0).toFixed(3)}</span>
                </div>
                
                <div className="flex w-full items-center mb-1">
                    <span>***</span>
                    <div className="flex-1 border-t border-dashed border-black mx-1"></div>
                    <span>***</span>
                </div>

                <div className="w-full mb-1">
                    Served by : {company?.name || "Variety Dry Fruit Stores"}
                </div>

                <div className="w-full border-t border-dashed border-black mb-1"></div>

                {/* Footer Meta */}
                <div className="flex justify-between w-full text-center">
                    <div className="flex flex-col flex-1 text-left">
                        <span>Date</span>
                        <span className="font-normal">{formattedDate}</span>
                    </div>
                    <div className="flex flex-col flex-1 text-center">
                        <span>Time</span>
                        <span className="font-normal">{formattedTime}</span>
                    </div>
                    <div className="flex flex-col flex-1 text-right">
                        <span>Receipt</span>
                        <span className="font-normal">{bill.orderNo || "POS3617"}</span>
                    </div>
                </div>
            </div>

            <div className="w-full border-t border-dashed border-black mt-2 mb-1"></div>

            {/* Footer Text */}
            <div className="text-center font-bold text-[13px] mb-1 w-full flex flex-col gap-1 tracking-tight">
                <div>Thank You For Shopping</div>
                <div>Keep Your bills for Exchange</div>
            </div>

            <div className="w-full border-t border-dashed border-black mt-1 mb-2"></div>

            <div className="text-center font-bold text-[13px] mb-3 w-full">
                Powered by {company?.name || "Variety Dry Fruit Stores"}
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
            </div>
        </div>
    );
});

export default BillReceipt80mmB2CType2;
