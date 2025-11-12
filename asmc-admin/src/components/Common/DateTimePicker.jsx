import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FormControl, FormHelperText } from "@mui/material";

const DateTimePickerComponent = ({
    label = "Select date and time",
    value,
    name,
    helperText,
    error = false,
    fullWidth = true,
    disabled,
    onChange,
    minDate = null,
    id,
    showTime = true,
    ...other
}) => {
    return (
        <FormControl fullWidth error={error}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    minDate={minDate}
                    size="small"
                    disabled={disabled}
                    slotProps={{ textField: { size: "small" } }}
                    format="dd-MM-yyyy HH:mm"
                    {...other}
                    error={error}
                    renderInput={(params) => {
                        return (
                            <TextField
                                size="small"
                                id={id}
                                name={name}
                                {...params}
                                fullWidth={fullWidth}
                                disabled={disabled}
                                error={error}
                                helperText={helperText}
                            />
                        );
                    }}
                />
                {error ? <FormHelperText>{helperText}</FormHelperText> : null}
            </LocalizationProvider>
        </FormControl>
    );
};

export default DateTimePickerComponent;
