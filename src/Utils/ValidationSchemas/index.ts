import * as Yup from "yup";
import { Validation } from "./Validation";

// ---------- Reusable helpers ----------

const ImageSchema = (label: string, required = true) => Validation("array", label, required ? { minItems: 1 } : { required: false });

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

export const EmployeeFormSchema = Yup.object({
  // ---------- BASIC DETAILS ----------
  name: Validation("string", "Name"),
  username: Validation("string", "Username"),
  role: Validation("string", "Role"),
  mobileNo: Validation("string", "Mobile No"),
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),

  // PAN is alphanumeric, NOT number
  panNumber: Validation("string", "PAN Number", { required: false, extraRules: (s) => s.matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),

  // ---------- ADDRESS ----------
  address: Yup.object({
    address: Validation("string", "Address", { required: false }),
    country: Validation("string", "Country", { required: false }),
    state: Validation("string", "State", { required: false }),
    city: Validation("string", "City", { required: false }),
    postalCode: Validation("number", "ZIP Code", { required: false }).nullable(),
  }),

  // ---------- BANK DETAILS ----------
  bankDetails: Yup.object({
    bankName: Validation("string", "Bank Name", { required: false }),
    branch: Validation("string", "Branch Name", { required: false }),
    accountNumber: Validation("number", "Account Number", { required: false }).nullable(),
    bankHolderName: Validation("string", "Account Holder Name", { required: false }),
    swiftCode: Validation("string", "Swift Code", { required: false }),
  }),

  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});
