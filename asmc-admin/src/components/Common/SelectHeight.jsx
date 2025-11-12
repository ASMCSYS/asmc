import { FormControl, FormHelperText } from "@mui/material";
import BasicSelect from "./Select";
import { useEffect, useState } from "react";

const feet = [{ value: 0, label: "Choose" }, { value: 4, label: "4 feet" }, { value: 5, label: "5 feet" }, { value: 6, label: "6 feet" }];
const inch = [{ value: 0, label: "Choose" }, { value: 1, label: "1 inch" }, { value: 2, label: "2 inch" }, { value: 3, label: "3 inch" }, { value: 4, label: "4 inch" }, { value: 5, label: "5 inch" }, { value: 6, label: "6 inch" }, { value: 7, label: "7 inch" }, { value: 8, label: "8 inch" }, { value: 9, label: "9 inch" }, { value: 10, label: "10 inch" }, { value: 11, label: "11 inch" }];

export const SelectHeight = (props) => {
    const [feetVal, setFeetVal] = useState(0);
    const [inchVal, setInchVal] = useState(0);
    const {
        id,
        label,
        value,
        name,
        onChange,
        input,
        key,
        items,
        labelId,
        fullWidth,
        ...other
    } = props;

    useEffect(() => {
        if (value) {
            let feetValue = parseInt(value.split(".")[0]);
            if (feetValue !== feetVal)
                setFeetVal(feetValue);
            let inchValue = parseInt(value.split(".")[1]);
            if (inchValue !== inchVal)
                setInchVal(inchValue);
        }
    }, [value])

    useEffect(() => {
        onChange(`${feetVal}.${inchVal}`)
    }, [feetVal, inchVal])

    // console.log(feetVal, inchVal, "adsfasdf");

    return (
        <FormControl fullWidth={fullWidth} error={other.error} sx={{ flexDirection: "row", gap: 2 }}>
            <BasicSelect
                id="feet"
                label="Height Feet"
                value={feetVal}
                name="feet"
                items={feet}
                fullWidth={true}
                onChange={(e) => setFeetVal(e.target.value)}
            />
            <BasicSelect
                id="inch"
                label="Height Inch"
                value={inchVal}
                name="inch"
                items={inch}
                fullWidth={true}
                onChange={(e) => setInchVal(e.target.value)}
            />
            {other.error ? (
                <FormHelperText>{other.helperText}</FormHelperText>
            ) : null}
        </FormControl>
    )
}