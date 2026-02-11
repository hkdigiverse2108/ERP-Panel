import { Grid, Box } from "@mui/material";
import { Formik, Form } from "formik";
import { CommonModal, CommonCard } from "../../../Components/Common";
import { CommonCheckbox, CommonButton } from "../../../Attribute";
import type { TermsConditionBase } from "../../../Types/TermsAndCondition";
import type { FC } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  allTerms: TermsConditionBase[];
  selectedTermIds: string[];
  onSave: (ids: string[]) => void;
}

const TermsSelectionModal: FC<Props> = ({ open, onClose, allTerms, selectedTermIds, onSave }) => {
  const initialValues = {
    selected: selectedTermIds,
  };

  return (
    <CommonModal title="Edit Terms" isOpen={open} onClose={onClose} className="max-w-150 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => onSave(values.selected)}>
        {({ values, setFieldValue }) => (
          <Form>
            <CommonCard hideDivider>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {allTerms.map((term) => (
                  <Grid size={12} key={term._id}>
                    <CommonCheckbox
                      name={`term_${term._id}`}
                      label={term.termsCondition}
                      value={values.selected.includes(term._id!)}
                      onChange={(checked: boolean) => {
                        if (checked) {
                          setFieldValue("selected", [...values.selected, term._id]);
                        } else {
                          setFieldValue(
                            "selected",
                            values.selected.filter((id: string) => id !== term._id),
                          );
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", p: 2 }}>
                <CommonButton variant="outlined" title="Cancel" onClick={onClose} />
                <CommonButton type="submit" variant="contained" title="Save" />
              </Box>
            </CommonCard>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default TermsSelectionModal;
