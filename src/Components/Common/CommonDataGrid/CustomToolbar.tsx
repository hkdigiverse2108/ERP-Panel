import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { Box, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { GridToolbarQuickFilter, Toolbar } from "@mui/x-data-grid";
import { useState, type FC } from "react";
import { CommonButton, CommonSwitch } from "../../../Attribute";
import type { CustomToolbarProps } from "../../../Types";
import { ExportDataGridToExcel } from "./ExportDataGridToExcel";
import { ExportDataGridToPDF } from "./ExportDataGridToPDF";

const CustomToolbar: FC<CustomToolbarProps> = ({ apiRef, columns, rows, rowCount, handleAdd, isActive, setActive }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Toolbar>
      <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
        Total Results: {rowCount}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {setActive && <CommonSwitch name="isActive" label="Active" switchPlacement="start" value={isActive} onChange={(checked) => setActive(checked)} grid={{ xs: 12 }} />}

        <GridToolbarQuickFilter />

        <Tooltip title="Columns">
          <IconButton onClick={() => apiRef.current.showPreferences("columns")}>
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        {/* CUSTOM FILTER ICON */}
        <Tooltip title="Filters">
          <IconButton onClick={() => apiRef.current.showPreferences("filters")}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        {/* EXPORT */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <DownloadIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {/* EXCEL */}
          <MenuItem
            onClick={() => {
              ExportDataGridToExcel({
                columns,
                rows,
                fileName: "employees.xlsx",
              });
              setAnchorEl(null);
            }}
          >
            <GridOnIcon fontSize="small" sx={{ mr: 1 }} />
            Download as Excel
          </MenuItem>

          {/* PRINT */}
          <MenuItem
            onClick={() => {
              apiRef?.current?.exportDataAsPrint();
              setAnchorEl(null);
            }}
          >
            <PrintIcon fontSize="small" sx={{ mr: 1 }} />
            Print
          </MenuItem>

          {/* PDF */}
          <MenuItem
            onClick={() => {
              ExportDataGridToPDF({
                columns,
                rows,
                fileName: "employees.pdf",
              });
              setAnchorEl(null);
            }}
          >
            <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
            PDF
          </MenuItem>
        </Menu>
        {handleAdd && (
          <Grid size="auto">
            <CommonButton variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
              ADD
            </CommonButton>
          </Grid>
        )}
      </Box>
    </Toolbar>
  );
};

export default CustomToolbar;
