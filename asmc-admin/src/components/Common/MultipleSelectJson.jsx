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

export default function MultipleSelectJson({ options, onChange, id, value, name, label, size = "small", ...other }) {
    const [finalVal, setFinalVal] = React.useState(value);

    const handleChange = (event) => {
        const { target: { value } } = event;
        onChange(value);
    };

    React.useEffect(() => {
        if (value && value.length > 0 && !value[0].label) {
            let selectVal = value.map(function (e) {
                let findInOption = options.find(obj => obj.value === e);
                return findInOption;
            })
            setFinalVal(selectVal);
            onChange(selectVal)
        } else {
            setFinalVal(value);
        }
    }, [value])

    return (
        <FormControl fullWidth error={other.error}>
            <InputLabel size={size} id={id}>{label}</InputLabel>
            <Select
                labelId={id}
                id={id}
                multiple
                name={name}
                value={finalVal}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => Array.prototype.map.call(selected, s => s.label).toString()}
                MenuProps={MenuProps}
                size={size}
                {...other}
            >
                {options.map((row, key) => (
                    <MenuItem key={key} value={row}>
                        <Checkbox checked={finalVal.find(obj => obj.value === row.value) !== undefined} />
                        <ListItemText primary={row.label} />
                    </MenuItem>
                ))}
            </Select>
            {other.error ? (
                <FormHelperText>{other.helperText}</FormHelperText>
            ) : null}
        </FormControl>
    );
}