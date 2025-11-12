import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { debounce } from '@mui/material/utils';

export default function MultiSelectAutoCompleteServerSide({ fetchDataFunction, id, onChange, defaultValue = [], label, disabled, keyname = "name", error, helperText, apiParams = {}, setData = null }) {
    const [value, setValue] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    console.log(options, "options");
    

    React.useEffect(() => {
        if (defaultValue && defaultValue.length > 0) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    const fetch = React.useMemo(
        () =>
            debounce(async (request, callback) => {
                try {
                    let results = await fetchDataFunction(request);
                    callback(results.data?.result);
                } catch (e) {
                    callback([]);
                }
            }, 400),
        [fetchDataFunction],
    );

    React.useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value.length ? value : []);
            return undefined;
        }

        fetch({ keywords: inputValue, ...apiParams }, (results) => {
            if (active && results && results.length > 0) {
                let newOptions = [];

                if (value.length) {
                    newOptions = [...value];
                }

                if (results) {
                    const filteredResults = results.map((obj) => ({ name: obj[keyname], _id: obj._id }));
                    newOptions = [...newOptions, ...filteredResults];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    React.useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <Autocomplete
            multiple
            id={id}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option?.name
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            size="small"
            disabled={disabled}
            noOptionsText={label}
            onChange={(event, newValue) => {
                setOptions(newValue ? [...newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} fullWidth error={error} helperText={helperText} />
            )}
            isOptionEqualToValue={(option, value) => option?.name === value.name}
            renderOption={(props, option) => {
                const matches = match(
                    option?.name,
                    inputValue, { insideWords: true }
                );

                const parts = parse(
                    option?.name,
                    matches
                );

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                {parts.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                    >
                                        {part.text}
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
