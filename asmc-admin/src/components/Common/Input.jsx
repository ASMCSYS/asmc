import React from "react";
import { TextField, InputAdornment, MenuItem } from "@mui/material";
import { isString } from "formik";

const Input = ({
    name,
    id,
    label,
    value,
    onChange,
    onBlur,
    type = "text",
    size = "small",
    variant = "outlined",
    error = false,
    helperText = "",
    prefix = "",
    prefixOptions = null,
    onPrefixChange = () => {},
    disabled = false,
    touched = false,
    ...other
}) => {
    return (
        <TextField
            variant={variant}
            name={name}
            id={id || name}
            label={label}
            size={size}
            type={type}
            value={isString(value) ? value?.replace(prefix, "") : value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            error={Boolean(error)}
            helperText={error || helperText}
            InputProps={{
                startAdornment: prefixOptions ? (
                    <TextField
                        select
                        value={prefix}
                        onChange={(e) => onPrefixChange(e.target.value)}
                        size="small"
                        variant="standard"
                        sx={{ width: 70, mr: 1 }}
                    >
                        {prefixOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : prefix ? (
                    <InputAdornment position="start">{prefix}</InputAdornment>
                ) : null,
            }}
            {...other}
        />
    );
};

export default Input;
