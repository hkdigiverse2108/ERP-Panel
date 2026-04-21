import { Box } from "@mui/material";
import { GridFooterContainer, gridVisibleColumnDefinitionsSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";

export const CommonDataGridSummaryFooter = ({ summary, label = "Total" }: { summary: Record<string, string | number>; label?: string }) => {
  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);

  return (
    <GridFooterContainer sx={{ overflowX: "auto", px: 0, width: "fit-content" }}>
      <Box sx={{ display: "flex", minWidth: "max-content" }}>
        {visibleColumns.map((col, index) => (
          <Box key={col.field} sx={{ width: col.computedWidth, px: 1, py: 1, fontWeight: 600, whiteSpace: "nowrap", textAlign: col.type === "number" ? "right" : "left" }}>
            {/* {index === 0 ? label : (summary[col.field] ?? "")} */}
            {index === 0 ? label : typeof summary[col.field] === "number" ? Number(summary[col.field]).toFixed(2) : (summary[col.field] ?? "")}
          </Box>
        ))}
      </Box>
    </GridFooterContainer>
  );
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

export const CalculateGridSummary = <T extends Record<string, any>>(rows: T[], fields: string[]): Record<string, number> => {
  return rows.reduce(
    (acc, row) => {
      fields.forEach((field) => {
        const value = getNestedValue(row, field);
        acc[field] = (acc[field] || 0) + Number(value || 0);
      });
      return acc;
    },
    {} as Record<string, number>,
  );
};
