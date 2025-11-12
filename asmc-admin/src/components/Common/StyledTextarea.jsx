import React from "react";
import styled from "@emotion/styled";
import { FormControl, InputLabel, TextField, TextareaAutosize } from "@mui/material";

const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    font: inherit;
    letter-spacing: inherit;
    color: currentColor;
    width: 100%;
    padding: 12px;
    font-family: Metropolis;
    background: none;

    &:focus {
        outline: 1px solid ${theme.palette.primary.main};
    }
  `,
);

const StyledTextarea = (props) => {
    const {
        minRows,
        value,
        onChange,
        displayEmpty,
        placeholder,
        name,
        id,
        ...other
    } = props;

    return (
        <TextField
            id={id}
            label={placeholder}
            multiline
            InputProps={{
                inputComponent: Textarea,
                inputProps: {
                    style: {
                        resize: "auto",
                    },
                    minRows: minRows,
                    value: value,
                    onChange: onChange
                }
            }}
            {...other}
        />
    )
}

export default StyledTextarea;