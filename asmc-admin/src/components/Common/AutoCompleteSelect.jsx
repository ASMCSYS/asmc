import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AutoCompleteSelect = ({ id, options, label, onChange, error, disabled = false, value = [], name, keyname = "label", disableCloseOnSelect = true, ...other }) => {

  return (
    <Autocomplete
      {...other}
      id={id}
      fullWidth
      options={options}
      size="small"
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option[keyname]}
      disabled={disabled}
      disableCloseOnSelect={disableCloseOnSelect}
      renderInput={(params) =>
        <TextField
          {...params}
          label={label}
          name={name}
          fullWidth
          error={error}
          inputProps={{
            ...params.inputProps,
          }}
          size={"small"}
        />
      }
    />
  );
}

export default AutoCompleteSelect;


