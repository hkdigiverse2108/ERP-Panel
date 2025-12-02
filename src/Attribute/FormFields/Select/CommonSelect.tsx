import { Autocomplete, Box, TextField } from "@mui/material";
import { type FC } from "react";
import type { CommonSelectProps, SelectOptionType } from "../../../Types";

const CommonSelect: FC<CommonSelectProps> = ({ label, options, value, onChange, sx, multiple = false, limitTags }) => {
  const valueObjects = value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOptionType[];
  const singleValue = !multiple ? valueObjects[0] ?? null : null;
  return (
    <Box sx={{ width: "100%", ...(sx || {}) }}>
      <Autocomplete
        multiple={multiple}
        options={options}
        limitTags={limitTags}
        value={multiple ? valueObjects : singleValue}
        getOptionLabel={(opt) => opt.label}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        onChange={(_, newValues) => {
          if (multiple) {
            onChange((newValues as SelectOptionType[]).map((o) => o.value));
          } else {
            const single = newValues as SelectOptionType | null;
            onChange(single ? [single.value] : []);
          }
        }}
        filterSelectedOptions
        clearOnEscape
        disableCloseOnSelect={multiple}
        renderInput={(params) => <TextField {...params} label={label} size="small" />}
      />
    </Box>
  );
};

export default CommonSelect;
