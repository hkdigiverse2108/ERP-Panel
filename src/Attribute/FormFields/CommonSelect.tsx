import { Autocomplete, Grid, TextField } from "@mui/material";
import { useField } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps, SelectOptionType } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ name, label, required, options, multiple = false, limitTags, size = "small", grid, disabled }) => {
  const [field, meta, helpers] = useField<any>({ name });

  // Normalize value
  const safeValue = multiple ? (Array.isArray(field.value) ? field.value : []) : field.value ?? "";

  const valueObjects = multiple ? safeValue?.map((v: string) => options.find((o) => o.value === v)).filter(Boolean) : options.find((o) => o.value === safeValue) ?? null;

  const Input = (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={valueObjects}
      size={size}
      disabled={disabled}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => {
        if (multiple) {
          helpers.setValue((newValues as SelectOptionType[]).map((o) => o.value));
        } else {
          helpers.setValue((newValues as SelectOptionType | null)?.value ?? "");
        }
      }}
      onBlur={() => helpers.setTouched(true)}
      renderInput={(params) => <TextField {...params} className="capitalize" disabled={disabled} required={required} label={label} size={size} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error ? meta.error : ""} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, limitTags, size, grid, disabled }) => {
  const valueObjects = value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOptionType[];
  const singleValue = !multiple ? valueObjects[0] ?? null : null;

  const Input = (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={multiple ? valueObjects : singleValue}
      size={size}
      disabled={disabled}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => {
        if (multiple) {
          onChange((newValues as SelectOptionType[])?.map((o) => o.value));
        } else {
          const single = newValues as SelectOptionType | null;
          onChange(single ? [single.value] : []);
        }
      }}
      filterSelectedOptions
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderInput={(params) => <TextField {...params} className="capitalize" disabled={disabled} label={label} size="small" />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
