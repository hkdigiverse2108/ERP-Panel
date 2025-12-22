import { Grid, Box, Button, IconButton, MenuItem, Menu } from "@mui/material";
import { Formik, Form } from "formik";
import { CommonTextField, CommonSwitch } from "../../../../Attribute";
import { CommonCard } from "../../../Common";
import { Validation } from "../../../../Utils/ValidationSchemas/Validation";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { setSelectedFiles, setUploadModal } from "../../../../Store/Slices/ModalSlice";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { ImagePath } from "../../../../Constants";
import { useEffect, useState } from "react";
import { Mutations } from "../../../../Api";
import { getChangedFields } from "../../../../Utils";
import { setCompany } from "../../../../Store/Slices/CompanySlice";
import { CommonButton } from "../../../../Attribute";

type CompanyImageKey = "logo" | "waterMark" | "reportFormatLogo" | "authorizedSignature";

const COMPANY_IMAGES: {
  key: CompanyImageKey;
  label: string;
}[] = [
  { key: "logo", label: "Logo" },
  { key: "waterMark", label: "waterMark" },
  { key: "reportFormatLogo", label: "Report Formats Logo" },
  { key: "authorizedSignature", label: "Authorized Signature" },
];

export const EditCompany = () => {
  const { company: companyData = {} } = useAppSelector((state) => state.company);
  const { selectedFiles } = useAppSelector((state) => state.modal);
  console.log("companyData --->> ", companyData);

  const { mutate: editCompanyMutate } = Mutations.useEditCompany();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeKey, setActiveKey] = useState<CompanyImageKey | null>(null);

  const [images, setImages] = useState<Record<CompanyImageKey, string | null>>({
    logo: "",
    waterMark: "",
    reportFormatLogo: "",
    authorizedSignature: "",
  });

  const handleOnSubmit = (values: any) => {
    const newData = {
      ...values,
      ...images,
    };

    const payload = getChangedFields(newData, companyData);

    editCompanyMutate(
      { companyId: companyData?._id, ...payload },
      {
        onSuccess: (response) => {
          console.log("response --> ", response?.data);
          dispatch(setCompany(response?.data));
          navigate(-1);
        },
      }
    );
  };
  useEffect(() => {
    if (!companyData) return;

    setImages({
      logo: companyData.logo || "",
      waterMark: companyData.waterMark || "",
      reportFormatLogo: companyData.reportFormatLogo || "",
      authorizedSignature: companyData.authorizedSignature || "",
    });
  }, [companyData]);

  const handleUpload = (key: CompanyImageKey) => {
    setActiveKey(key);
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>, key: CompanyImageKey) => {
    e.stopPropagation();
    setActiveKey(key);
    setMenuAnchor(e.currentTarget);
  };

  const handleDelete = () => {
    if (!activeKey) return;

    setImages((prev) => ({ ...prev, [activeKey]: "" }));
    dispatch(setSelectedFiles([]));
    setMenuAnchor(null);
  };

  const handleDownload = async () => {
    if (!activeKey || !images[activeKey]) return;
    try {
      const link = document.createElement("a");
      link.href = images[activeKey];
      link.download = images[activeKey];
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }

    setMenuAnchor(null);
  };

  useEffect(() => {
    if (!activeKey || !selectedFiles[0]) return;

    setImages((prev) => ({
      ...prev,
      [activeKey]: selectedFiles[0],
    }));

    dispatch(setSelectedFiles([]));
    setActiveKey(null);
  }, [selectedFiles, activeKey, dispatch]);

  const ValidationSchemas = Yup.object({
    name: Validation("string", "Company Name"),
    email: Validation("string", "Email"),
    city: Validation("string", "City"),
    state: Validation("string", "State"),
  });

  if (!companyData) return false;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2 },
        m: { xs: 1, md: 2 },
      }}
    >
      <Formik
        enableReinitialize
        initialValues={{
          name: companyData.name || "",
          displayName: companyData.displayName || "",
          contactName: companyData.contactName || "",
          ownerNo: companyData.ownerNo || "",
          email: companyData.email || "",
          phoneNumber: companyData.phoneNumber || "",
          address: companyData.address || "",
          city: companyData.city || "",
          state: companyData.state || "",
          country: companyData.country || "",
          pinCode: companyData.pinCode || "",
          timeZone: companyData.timeZone || "",
          bankName: companyData.bankName || "",
          bankIFSC: companyData.bankIFSC || "",
          upiId: companyData.upiId || "",
          accountHolderName: companyData.accountHolderName || "",
          bankAccountNumber: companyData.bankAccountNumber || "",
          allowRoundOff: companyData.allowRoundOff === true || companyData.allowRoundOff === "true",
          enableFeedbackModule: companyData.enableFeedbackModule === true || companyData.enableFeedbackModule === "true",
          corporateIdentificationNumber: companyData.corporateIdentificationNumber || "",
          letterOfUndertaking: companyData.letterOfUndertaking || "",
          taxDeductionAndCollectionAccountNumber: companyData.taxDeductionAndCollectionAccountNumber || "",
          importerExporterCode: companyData.importerExporterCode || "",
        }}
        validationSchema={ValidationSchemas}
        onSubmit={handleOnSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* BASIC DETAILS */}
              <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {/* <CommonTextField name="AccountingType" label="Accounting Type" grid={{ xs: 12, md: 6 }} /> */}
                  <CommonTextField name="name" label="Company Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="contactName" label="Contact Name" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="phoneNumber" label="Mobile No" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="ownerNo" label="Owner No" grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              {/* COMMUNICATION */}
              <CommonCard title="Communication Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2}}>
                  <CommonTextField name="address" label="Address" grid={{ xs: 12, md: 6 }} multiline/>
                  <CommonTextField name="city" label="City" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="state" label="State" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="country" label="Country" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="pinCode" label="Pin Code" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="timeZone" label="Time Zone" grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              {/* BANK */}
              <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="bankIFSC" label="IFSC Code" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="bankAccountNumber" label="Account No" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="accountHolderName" label="Account Holder Name" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="upiId" label="UPI ID" grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              {/* OTHER */}
              <CommonCard title="Other Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonTextField name="corporateIdentificationNumber" label="CIN No" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="letterOfUndertaking" label="LUT No" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="taxDeductionAndCollectionAccountNumber" label="TAN No" grid={{ xs: 12, md: 6 }} />
                  <CommonTextField name="importerExporterCode" label="IEC No" grid={{ xs: 12, md: 6 }} />
                  <CommonSwitch name="allowRoundOff" label="Allow Round Off" value={values.allowRoundOff} onChange={(checked) => setFieldValue("allowRoundOff", checked)} grid={{ xs: 12, md: 6 }} />
                  <CommonSwitch name="enableFeedbackModule" label="Enable Feedback Module" value={values.enableFeedbackModule} onChange={(checked) => setFieldValue("enableFeedbackModule", checked)} grid={{ xs: 12, md: 6 }} />
                </Grid>
              </CommonCard>

              <CommonCard title="Company Images" grid={{ xs: 12 }}>
                <Grid container spacing={3} sx={{ p: 2 }}>
                  {COMPANY_IMAGES.map(({ key, label }) => {
                    const value = images[key];

                    return (
                      <Grid size="auto" className="flex flex-col items-center">
                        <p className="mb-2 text-sm font-medium">{label}</p>

                        <Box onClick={() => handleUpload(key)} sx={{ width: 150, height: 150 }} className="relative cursor-pointer border rounded-lg overflow-hidden">
                          <img src={value || `${ImagePath}user/1.jpg`} alt={label} className="w-full h-full object-cover" />

                          {value && (
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                zIndex: 2,
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenMenu(e, key);
                              }}
                            >
                              <GridMoreVertIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => {
                    setMenuAnchor(null);
                    setActiveKey(null);
                  }}
                >
                  {/* <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}> */}
                  <MenuItem onClick={handleDownload}>Download</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
              </CommonCard>

              {/* ACTIONS */}
              <Grid className="w-full! flex justify-end ">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" />

                  <CommonButton type="submit" variant="contained" title="Save" />
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditCompany;
