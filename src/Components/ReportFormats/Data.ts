export const Thermal_80mmOfflineData = {
  _id: "mock1",
  orderNo: "POS2981",
  createdAt: new Date().toISOString(),
  customerId: {
    _id: "cust1",
    firstName: "Walk In",
    lastName: "Customer",
    phoneNo: { countryCode: "+91", phoneNo: "0000000000" },
    address: [{ addressLine1: "Aadityana", city: { name: "Gujarat" } }],
  },
  companyId: { name: "Ai Setu Solutions", _id: "comp1" },
  items: [
    {
      productId: { _id: "prod1", name: "Test demo yellow / 1", hsnCode: "1234", isSalesTaxIncluding: false, salesTaxId: { percentage: 5 } },
      qty: 1,
      mrp: 2010.0,
      netAmount: 2163.6,
      discountAmount: 0,
      additionalDiscountAmount: 0,
    },
  ],
  totalAmount: 2366.0,
  roundOff: 0.4,
  totalDiscount: 0,
  flatDiscountAmount: 0,
  additionalCharges: [{ _id: "charge1", totalAmount: 202.0, accountId: "acc1" }],
  multiplePayments: [
    { method: "cash", amount: 1000 },
    { method: "card", amount: 1366 },
  ],
};

export const Thermal_80mmOffline1Data = {
  _id: "mock2",
  orderNo: "POS2982",
  createdAt: new Date().toISOString(),
  customerId: {
    _id: "cust2",
    firstName: "dinein",
    lastName: "",
    phoneNo: { countryCode: "+91", phoneNo: "0000000000" },
    address: [{ addressLine1: "Ahmedabad", city: { name: "Gujarat" } }],
  },
  companyId: { name: "DMART company", _id: "comp2" },
  items: [
    {
      productId: { _id: "prod2", name: "DMart Product", hsnCode: "1234", isSalesTaxIncluding: false, salesTaxId: { percentage: 5 } },
      qty: 1,
      mrp: 100.0,
      netAmount: 95.0,
      discountAmount: 5.0,
      additionalDiscountAmount: 0,
    },
  ],
  totalAmount: 95.0,
  roundOff: 0.0,
  totalDiscount: 5.0,
  flatDiscountAmount: 0,
  additionalCharges: [],
  multiplePayments: [
    { method: "cash", amount: 95.0 },
  ],
};

export const Thermal_80mm1JasperData = {
  _id: "mock3",
  orderNo: "1023961",
  createdAt: "2023-04-27T10:00:00.000Z",
  customerId: {
    _id: "cust3",
    firstName: "Walk in",
    lastName: "Customer",
    phoneNo: { countryCode: "+91", phoneNo: "0000000000" },
    address: [{ addressLine1: "Adityana", city: { name: "Gujarat" } }],
  },
  companyId: { name: "AI Setu Solutions Private Limited", _id: "comp3" },
  items: [
    {
      productId: { _id: "prod3", name: "Tata demo yellow / 1", hsnCode: "1000200014", isSalesTaxIncluding: false, salesTaxId: { percentage: 5 } },
      qty: 1,
      mrp: 201.00,
      netAmount: 191.63,
      discountAmount: 5.0,
      additionalDiscountAmount: 0,
      description: "The product is available in the store",
    },
  ],
  totalAmount: 195.00,
  roundOff: 0.40,
  totalDiscount: 5.00,
  flatDiscountAmount: 0,
  additionalCharges: [],
  multiplePayments: [
    { method: "cash", amount: 195.00 },
  ],
};

export const A5_2JasperData = {
  _id: "mock4",
  orderNo: "POS2961",
  createdAt: "2023-04-27T10:00:00.000Z",
  customerId: {
    _id: "cust4",
    firstName: "Walk in",
    lastName: "Customer",
    phoneNo: { countryCode: "+91", phoneNo: "0000000000" },
    address: [{ addressLine1: "Adityana", city: { name: "Gujarat" } }],
  },
  companyId: { 
    name: "AI Setu ERP Solutions Private Limited", 
    _id: "comp4",
    email: "circleastar09@gmail.com",
    phoneNo: { phoneNo: "1234567895", countryCode: "+91" },
    address: [{ addressLine1: "SHOP NO.1-14, UPPER GROUND FLOOR, NEAR KOTAK BANK CIRCLE, GHODDOD ROAD", city: { name: "Gujarat" } }]
  },
  items: [
    {
      productId: { _id: "prod4", name: "Test demo yellow / 1", hsnCode: "1234", isSalesTaxIncluding: false, salesTaxId: { percentage: 5 } },
      qty: 1,
      mrp: 2010.00,
      netAmount: 2163.60,
      discountAmount: 5.0,
      additionalDiscountAmount: 20.05,
      description: "The product is available in the store",
    },
  ],
  totalAmount: 2366.00,
  roundOff: 0.40,
  totalDiscount: 25.05,
  flatDiscountAmount: 0,
  additionalCharges: [
    { _id: "charge1", name: "Test Additional Charge", totalAmount: 202.00, accountId: "acc1" }
  ],
  multiplePayments: [
    { method: "cash", amount: 1000.00 },
    { method: "card", amount: 1366.00 },
  ],
};


