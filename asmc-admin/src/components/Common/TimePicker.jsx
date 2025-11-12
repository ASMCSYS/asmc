import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormControl, FormHelperText } from "@mui/material";

const TimePickerComponent = ({
    label = "Select Time",
    value,
    name,
    helperText,
    error,
    fullWidth,
    disabled,
    onChange,
    minTime,
    maxTime,
    id,
    ampm = true,
}) => {
    return (
        <FormControl fullWidth error={error}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    minTime={minTime}
                    maxTime={maxTime}
                    ampm={ampm}
                    size="small"
                    disabled={disabled}
                    slotProps={{ textField: { size: "small" } }}
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

export default TimePickerComponent;
