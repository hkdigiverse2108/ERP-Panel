import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

const AdvancedSearch = () => {
  return (
    <>
      <Accordion className="advanced-search">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography component="span">Advanced Search</Typography>
        </AccordionSummary>
        <AccordionDetails>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</AccordionDetails>
      </Accordion>
    </>
  );
};

export default AdvancedSearch;
