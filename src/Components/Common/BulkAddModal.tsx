import { Box, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import { CommonButton } from "../../Attribute";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setBulkAddModal } from "../../Store/Slices/ModalSlice";
import CommonModal from "./Modal/CommonModal";
import { DEMO_FILE_URL } from "../../Constants";
import type { DemoFileKey } from "../../Constants/DemoFilesUrl";

interface BulkAddModalProps {
  type: string;
  onUpload: (file: File) => void;
  loading?: boolean;
}

const BulkAddModal = ({ type, onUpload, loading }: BulkAddModalProps) => {
  const dispatch = useAppDispatch();
  const { open, title, type: activeType } = useAppSelector((state) => state.modal.isBulkAddModal);
  const demoFileUrl = DEMO_FILE_URL[activeType as DemoFileKey] ?? null;

  const isOpen = open && activeType === type;

  const handleClose = () => {
    dispatch(setBulkAddModal({ open: false, title: "", type: "" }));
  };

  const handleBulkAdd = async (values: { file: File | null }) => {
    if (!values.file) return;
    onUpload(values.file);
  };

  return (
    <CommonModal title={title || "Import Data"} isOpen={isOpen} onClose={handleClose} className="max-w-150 m-2 sm:m-5">
      {demoFileUrl && (
        <a href={demoFileUrl} download className="cursor-pointer mb-1 font-medium">
          Download
          <span className="px-1 text-brand-500">Demo</span>
          File
        </a>
      )}
      <Formik initialValues={{ file: null }} onSubmit={handleBulkAdd}>
        {({ setFieldValue, values, handleSubmit }) => (
          <Box>
            <Grid container spacing={2}>
              <Grid size={12} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background: (theme) => theme.palette.action.hover,
                    "&:hover": { borderColor: "primary.main", background: (theme) => theme.palette.action.selected },
                  }}
                  onClick={() => document.getElementById("common-bulk-file-input")?.click()}
                >
                  <input id="common-bulk-file-input" type="file" accept=".csv, .xlsx, .xls" hidden onChange={(event) => setFieldValue("file", event.currentTarget.files?.[0])} />
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    {values.file ? (values.file as File).name : "Click here or drag file to select"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Accepts .csv, .xlsx, .xls
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12} sx={{ pt: 2, width: "100%" }}>
                <CommonButton type="button" onClick={() => handleSubmit()} variant="contained" title="Upload" size="medium" loading={loading} fullWidth disabled={!values.file} />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </CommonModal>
  );
};

export default BulkAddModal;
