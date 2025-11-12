import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

export default function BasicSelect(props) {
  const {
    id,
    label,
    value,
    name,
    onChange,
    items,
    labelId,
    size = "small",
    fullWidth = true,
    disabled = false,
    error,
    helperText
  } = props;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel size={size}>{label}</InputLabel>
      <Select
        size={size}
        labelId={labelId}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        disabled={disabled}
      >
        {items?.map((element, index) => {
          return (
            <MenuItem disabled={element.disabled} key={"select_key_" + label + index} value={element.value}>
              {element.label}
            </MenuItem>
          );
        })}
      </Select>
      {error ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
