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
  designation: Validation("string", "Designation", { required: false }),
  role: Validation("string", "Role", { required: false }),
  phoneNo: Validation("string", "Phone No", { extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits") }),
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

  // ---------- BANK DETAILS ----------
  bankDetails: Yup.object({
    bankName: Validation("string", "Bank Name", { required: false }),
    branch: Validation("string", "Branch Name", { required: false }),
    accountNumber: Validation("number", "Account Number", { required: false }).nullable(),
    bankHolderName: Validation("string", "Account Holder Name", { required: false }),
    swiftCode: Validation("string", "Swift Code", { required: false }),
    IFSCCode: Validation("string", "IFSC Code", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code") }),
  }).nullable(),

  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});

export const BranchFormSchema = Yup.object({
  name: Validation("string", "Name"),
  address: Validation("string", "Address"),
  isActive: Yup.boolean(),
});
