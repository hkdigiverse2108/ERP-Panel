import * as Yup from "yup";
import { Validation } from "./Validation";

const RequiredWhenTrue = (dependentField: string, message: string, baseSchema: Yup.AnySchema) => {
  return baseSchema.when(dependentField, {
    is: true,
    then: (schema) => schema.required(`${message} is required`),
    otherwise: (schema) => schema.notRequired(),
  });
};

// ---------- Reusable helpers ----------

// const ImageSchema = (label: string, required = true) => Validation("array", label, required ? { minItems: 1 } : { required: false });
export const PhoneValidation = (label = "Phone No", options?: { requiredCountryCode?: boolean; requiredNumber?: boolean }) =>
  Yup.object({
    countryCode: Validation("string", "Country code", {
      required: options?.requiredCountryCode ?? true,
    }),

    phoneNo: Validation("string", label, {
      required: options?.requiredNumber ?? true,
      extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    }),
  });

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

export const EmployeeFormSchema = Yup.object({
  // ---------- BASIC DETAILS ----------
  fullName: Validation("string", "FullName"),
  username: Validation("string", "Username"),
  // designation: Validation("string", "Designation", { required: false }),
  // role: Validation("string", "Role", { required: false }),
  phoneNo: PhoneValidation(),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.trim().email("Invalid email address") }),
  branchId: Validation("string", "Branch Name", { required: false }),
  panNumber: Validation("string", "PAN Number", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),

  // ---------- ADDRESS ----------
  address: Yup.object({
    address: Validation("string", "Address"),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    postalCode: Validation("string", "ZIP Code", { extraRules: (s) => s.matches(/^[0-9]{5,6}$/, "Invalid ZIP Code") }),
  }).nullable(),

  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});

export const RolesFormSchema = Yup.object({
  name: Validation("string", "Roles name"),
  isActive: Yup.boolean(),
});

export const CallRequestFormSchema = Yup.object({
  businessName: Validation("string", "Business Name"),
  contactName: Validation("string", "Contact Name"),
  contactNo: PhoneValidation("Contact No"),
  note: Validation("string", "note"),
});

export const CompanyFormSchemas = Yup.object({
  name: Validation("string", "Company Name"),
  displayName: Validation("string", "display Name"),
  contactName: Validation("string", "contact Name"),
  email: Validation("string", "Email", { extraRules: (s) => s.trim().email("Invalid email address") }),
  supportEmail: Validation("string", "support Email", { extraRules: (s) => s.trim().email("Invalid email address") }),
  customerCareNumber: Validation("string", "customer Care Number"),
  phoneNo: PhoneValidation(),
  ownerNo: PhoneValidation(),

  address: Validation("string", "address"),
  city: Validation("string", "city"),
  state: Validation("string", "State"),
  country: Validation("string", "country"),
  pinCode: Validation("string", "pinCode", { extraRules: (s) => s.trim().matches(/^[0-9]{6}$/, "Pin code must be 6 digits") }),
  timeZone: Validation("string", "timeZone", { required: false }),

  upiId: Validation("string", "upiId", { required: false }),

  userName: Validation("string", "userName", { required: false }),
  GSTRegistrationType: Validation("string", "GSTRegistrationType", { required: false }),
  GSTIdentificationNumber: Validation("string", "GSTIdentificationNumber", { required: false }),
  PanNo: Validation("string", "PanNo", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid Pan Number") }),
  taxDeductionAndCollectionAccountNumber: Validation("string", "taxDeductionAndCollectionAccountNumber", { required: false }),
  webSite: Validation("string", "webSite", { required: false }),
  financialYear: Validation("string", "financialYear", { required: false }),
  corporateIdentificationNumber: Validation("string", "corporateIdentificationNumber", { required: false }),
  letterOfUndertaking: Validation("string", "letterOfUndertaking", { required: false }),
  importerExporterCode: Validation("string", "importerExporterCode", { required: false }),
  outletSize: Validation("string", "outletSize", { required: false }),
  fssaiNo: Validation("string", "fssaiNo", { required: false, extraRules: (s) => s.trim().matches(/^[0-9]{14}$/, "FSSAI number must be exactly 14 digits") }),
  currency: Validation("string", "currency", { required: false }),
  printDateFormat: Validation("string", "printDateFormat", { required: false }),
  decimalPoint: Validation("string", "decimalPoint", { required: false }),

  allowRoundOff: Validation("boolean", "allowRoundOff", { required: false }),
  enableFeedbackModule: Validation("boolean", "enableFeedbackModule", { required: false }),

  logo: Validation("string", "Logo", { required: false }),
  waterMark: Validation("string", "Water Mark", { required: false }),
  reportFormatLogo: Validation("string", "Report Format Logo", { required: false }),
  authorizedSignature: Validation("string", "Authorized Signature", { required: false }),
});

export const WeightScaleFormSchema = Yup.object({
  baudRate: Validation("string", "Baud Rate"),
  dataBits: Validation("string", "Data Bits"),
  stopBits: Validation("string", "Stop Bits"),
  parity: Validation("string", "Parity"),
  flowControl: Validation("string", "Flow Control"),
  precision: Validation("string", "Precision"),
});

export const CustomerFormSchema = Yup.object({
  baudRate: Validation("string", "Baud Rate"),
  dataBits: Validation("string", "Data Bits"),
  stopBits: Validation("string", "Stop Bits"),
  parity: Validation("string", "Parity"),
  flowControl: Validation("string", "Flow Control"),
  precision: Validation("string", "Precision"),
});

export const MultiplePaySchema = Yup.object({
  payments: Yup.array()
    .of(
      Yup.object({
        amount: Yup.number().typeError("Amount must be a number").positive("Amount must be greater than 0").required("Received Amount is required"),
        paymentMode: Validation("string", "Payment Method"),
        paymentAccount: Yup.string().when("paymentMode", ([paymentMode], schema) => (["card", "upi", "wallet", "bank", "cheque"].includes(paymentMode) ? Validation("string", "Payment Account") : schema.nullable())),
        cardHolderName: Yup.string().when("paymentMode", ([paymentMode], schema) => (paymentMode === "card" ? Validation("string", "Card Holder Name") : schema.nullable())),
        cardTxnNo: Yup.string().when("paymentMode", ([paymentMode], schema) => (paymentMode === "card" ? Validation("string", "Card Transaction No") : schema.nullable())),
        upiId: Yup.string().when("paymentMode", ([paymentMode], schema) => (paymentMode === "upi" ? Validation("string", "UPI ID") : schema.nullable())),
        bankAccountNo: Yup.string().when("paymentMode", ([paymentMode], schema) => (paymentMode === "bank" ? Validation("string", "Bank Account No") : schema.nullable())),
        chequeNo: Yup.string().when("paymentMode", ([paymentMode], schema) => (paymentMode === "cheque" ? Validation("string", "Cheque No") : schema.nullable())),
      })
    )
    .min(1, "At least one payment is required"),
});

export const BankFormSchema = Yup.object().shape({
  name: Validation("string", "Name"),
  branchName: Validation("string", "Branch Name"),
  accountHolderName: Validation("string", "Account Holder Name"),
  bankAccountNumber: Validation("string", "Account Number"),
  ifscCode: Validation("string", "IFSC Code"),
  swiftCode: Validation("string", "Swift Code", { required: false }),
  openingBalance: Yup.object({
    creditBalance: Validation("number", "Credit Balance", { required: false }).nullable(),
    debitBalance: Validation("number", "Debit Balance", { required: false }).nullable(),
  }).nullable(),
});

export const RecipeFormSchema = Yup.object({
  recipeName: Validation("string", "Name"),
  recipeDate: Validation("string", "Recipe Date"),
  recipeNo: Validation("string", "Recipe No"),
  recipeType: Validation("string", "Recipe Type"),
});


const AddressSchema = Yup.object().shape({
  gstType: Validation("string", "GST Type"),
  gstIn: Validation("string", "GSTIN"),
  contactFirstName: Validation("string", "Contact First Name"),
  contactLastName: Validation("string", "Contact Last Name"),
  contactCompanyName: Validation("string", "Contact Company Name"),
  contactNo: PhoneValidation("Contact No"),
  contactEmail: Validation("string", "Email", {
    extraRules: (s) => s.email("Invalid email address"),
  }),
  addressLine1: Validation("string", "Address Line 1"),
  addressLine2: Validation("string", "Address Line 2"),
  country: Validation("string", "Country"),
  state: Validation("string", "State"),
  city: Validation("string", "City"),
  pinCode: Validation("string", "Pin Code", {
    extraRules: (s) => s.matches(/^[0-9]{6}$/, "Pin code must be 6 digits"),
  }),
  tanNo: Validation("string", "Tan No", { required: false }),
});

const BaseSchema = {
  firstName: Validation("string", "First Name"),
  lastName: Validation("string", "Last Name"),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.email("Invalid email address") }),
  companyName: Validation("string", "Company Name"),
  phoneNo: PhoneValidation(),
  whatsappNo: PhoneValidation("Whatsapp No", { requiredNumber: false, requiredCountryCode: false }),
  panNo: Validation("string", "PAN No", {
    extraRules: (s) => s.matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number"),
  }),
  paymentMode: Validation("string", "Payment Mode"),
  paymentTerms: Validation("string", "Payment Terms", { required: false }),
  openingBalance: Yup.object().shape({
    debitBalance: Validation("number", "Debit Balance", { required: false }),
    creditBalance: Validation("number", "Credit Balance", { required: false }),
  }),
  dob: Validation("string", "Date of Birth", { required: false }),
  anniversaryDate: Validation("string", "Anniversary Date", { required: false }),
  telephoneNo: Validation("string", "Telephone No"),
  remarks: Validation("string", "Remarks", { required: false }),
  addressDetails: Yup.array().of(AddressSchema).min(1),
  bankDetails: Yup.object().shape({
    ifscCode: Validation("string", "IFSC Code", { required: false }),
    name: Validation("string", "Bank Name", { required: false }),
    branch: Validation("string", "Bank Branch", { required: false }),
    accountNumber: Validation("string", "Account Number", { required: false }),
  }),
};

// ---------- Complete Contact Schema with conditional fields ----------
export const getContactFormSchema = () => {
  return Yup.object().shape({
    ...BaseSchema,

    customerCategory: Yup.string().when("$contactType", {
      is: "customer",
      then: (schema) => schema.required("Customer Category is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    customerType: Yup.string().when("$contactType", {
      is: "customer",
      then: (schema) => schema.required("Customer Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    supplierType: Yup.string().when("$contactType", {
      is: "supplier",
      then: (schema) => schema.required("Supplier Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    transporterId: Yup.string().when("$contactType", {
      is: "transporter",
      then: (schema) => schema.required("Transporter Id is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};



export const ProductFormSchema = Yup.object({
  productType: Validation("string", "Product Type"),
  name: Validation("string", "Product Name"),
  printName: Validation("string", "Print Name"),
  hsnCode: Validation("string", "HSN Code", { required: false }),
  categoryId: Validation("string", "Category"),
  subCategoryId: Validation("string", "Sub Category", { required: false }),
  brandId: Validation("string", "Brand"),
  subBrandId: Validation("string", "Sub Brand", { required: false }),
  purchaseTaxId: Validation("string", "Purchase Tax"),
  isPurchaseTaxIncluding: Yup.boolean(),
  salesTaxId: Validation("string", "Sales Tax"),
  isSalesTaxIncluding: Yup.boolean(),
  cessPercentage: Validation("number", "Cess Percentage", { required: false }),
  manageMultipleBatch: Validation("boolean", "Multiple Batch", { required: false }),
  hasExpiry: RequiredWhenTrue("manageMultipleBatch", "Has Expiry", Yup.boolean()),
  expiryDays: RequiredWhenTrue("hasExpiry", "Expiry Days", Yup.number()),
  calculateExpiryOn: RequiredWhenTrue("hasExpiry", "Expiry Calculation", Yup.string()),
  expiryReferenceDate: RequiredWhenTrue("hasExpiry", "Expiry Reference Date", Yup.string()),

  isExpiryProductSaleable: Yup.boolean(),
  ingredients: Validation("string", "Ingredients", { required: false }),
  shortDescription: Validation("string", "Short Description", { required: false }),
  description: Validation("string", "Description", { required: false }),
  nutrition: Yup.array().of(
    Yup.object({
      name: Validation("string", "Nutrition Name", { required: false }),
      value: Validation("string", "Nutrition Value", { required: false }),
    })
  ),
  netWeight: Validation("number", "Net Weight", { required: false }),
  masterQty: Validation("number", "Master Quantity", { required: false }),
  purchasePrice: Validation("number", "Purchase Price"),
  landingCost: Validation("number", "Landing Cost"),
  mrp: Validation("number", "MRP"),
  sellingDiscount: Validation("number", "Selling Discount"),
  sellingPrice: Validation("number", "Selling Price"),
  sellingMargin: Validation("number", "Selling Margin"),
  retailerDiscount: Validation("number", "Retailer Discount"),
  retailerPrice: Validation("number", "Retailer Price"),
  retailerMargin: Validation("number", "Retailer Margin"),
  wholesalerDiscount: Validation("number", "Wholesaler Discount"),
  wholesalerMargin: Validation("number", "Wholesaler Margin"),
  wholesalerPrice: Validation("number", "Wholesaler Price"),
  minimumQty: Validation("number", "Minimum Quantity"),
  openingQty: Validation("number", "Opening Quantity", { required: false }),
  images: Yup.array().of(Yup.mixed().required("Image is required")).min(2, "At least two image is required"),
  isActive: Yup.boolean(),
});

export const ProductItemFormSchema = Yup.object({
  productId: Validation("string", "Product"),
  uomId: Validation("string", "UOM"),
  purchasePrice: Validation("number", "Purchase Price"),
  landingCost: Validation("number", "Landing Cost"),
  mrp: Validation("number", "MRP"),
  sellingDiscount: Validation("number", "Selling Discount"),
  sellingPrice: Validation("number", "Selling Price"),
  sellingMargin: Validation("number", "Selling Margin"),
  qty: Validation("number", "Quantity"),
});
