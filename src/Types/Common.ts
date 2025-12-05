import type { Breakpoint, DrawerProps, PaperProps as MuiPaperProps } from "@mui/material";
import type { GridColDef, GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";

// ************ Drawer Start ***********

export interface CommonDrawerProps extends Omit<DrawerProps, "anchor" | "title"> {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  width?: number | string;
  fullScreenBelow?: Breakpoint;
  showDivider?: boolean;
  hideCloseButton?: boolean;
  paperProps?: MuiPaperProps;
}

// ************ Drawer End ***********

// ************ Select Start ***********

export type SelectOptionType = {
  label: string;
  value: string;
};

export interface CommonSelectProps {
  label?: string;
  options: SelectOptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  BoxClassName?: string;
  multiple?: boolean;
  limitTags?: number;
  size?: "small" | "medium";
}

// ************ Select End ***********

// ************ Date Range Selector Start ***********

export interface CommonDateRangeSelectorProps {
  value: { start: Dayjs; end: Dayjs };
  onChange: (range: { start: Dayjs; end: Dayjs }) => void;
  BoxClassName?: string;
  active?: string;
}

// ************ Date Range Selector End ***********

// ************ Table Start ***********

export interface Params {
  [key: string]: any;
}

export interface UseDataGridOptions {
  page?: number;
  pageSize?: number;
  initialSort?: GridSortModel;
  initialFilter?: GridFilterModel;
}

export interface CommonColumn<T = any> {
  field: keyof T | string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  headerAlign?: "left" | "right" | "center";
  renderCell?: (params: any) => React.ReactNode;
}

export interface CommonDataGridProps<T = any> {
  columns: GridColDef[];
  rows: T[];
  rowCount: number;
  loading?: boolean;

  // Pagination
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;

  // Sorting
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;

  // Filter
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;

  pageSizeOptions?: number[];
  defaultHidden?: string[];
  BoxClass?: string;
}

// ************ Table End ***********
