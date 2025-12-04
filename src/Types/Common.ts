import type { Breakpoint, DrawerProps, PaperProps as MuiPaperProps } from "@mui/material";
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

export interface UseBasicTableFilterHelperOptions {
  initialParams?: Params;
  debounceDelay?: number;
  sortKey?: string;
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
  columns: CommonColumn<T>[];
  rows: T[];
  loading?: boolean;

  // Pagination
  page: number;
  limit: number;
  total: number;

  // Sorting
  sortBy?: string | null;
  onSortChange?: (field: string | null) => void;

  // Pagination callback
  onPageChange?: (page: number, limit: number) => void;

  height?: number | string;
}


// ************ Table End ***********
