import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { FormHelperText } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectArray({ options, onChange, id, value, name, label, size = "small", ...other }) {

    const handleChange = (event) => {
        const { target: { value } } = event;
        onChange(value);
    };

    return (
        <div>
            <FormControl fullWidth error={other.error}>
                <InputLabel size={size} id={id}>{label}</InputLabel>
                <Select
                    labelId={id}
                    id={id}
                    multiple
                    name={name}
                    value={value}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    size={size}
                    {...other}
                >
                    {options.map((row, key) => (
                        <MenuItem key={key} value={row}>
                            <Checkbox checked={value.indexOf(row) > -1} />
                            <ListItemText primary={row} />
                        </MenuItem>
                    ))}
                </Select>
                {other.error ? (
                    <FormHelperText>{other.helperText}</FormHelperText>
                ) : null}
            </FormControl>
        </div>
    );
}