import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { debounce } from "@mui/material/utils";

export default function AutoCompleteServerSide({
    fetchDataFunction,
    id,
    onChange,
    defaultValue = null,
    label,
    disabled,
    keyname = "name",
    error,
    helperText,
    apiParams = {},
    initialOptions = [],
}) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        if (initialOptions.length > 0) {
            const formattedOptions = initialOptions.map((obj) => ({
                name: obj[keyname],
                ...obj,
            }));
            setOptions(formattedOptions);
        }
    }, [initialOptions, keyname]);

    React.useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
            setInputValue(defaultValue[keyname] || "");
        }
    }, [defaultValue]);

    // Set initial options when component mounts and inputValue is empty
    React.useEffect(() => {
        if (initialOptions.length > 0 && inputValue === "" && !value) {
            const formattedOptions = initialOptions.map((obj) => ({
                name: obj[keyname],
                ...obj,
            }));
            setOptions(formattedOptions);
        }
    }, [initialOptions, inputValue, value, keyname]);

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

        if (inputValue === "") {
            // If we have initial options and no value selected, show initial options
            if (initialOptions.length > 0 && !value) {
                const formattedOptions = initialOptions.map((obj) => ({
                    name: obj[keyname],
                    ...obj,
                }));
                setOptions(formattedOptions);
                return undefined;
            }
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ keywords: inputValue, ...apiParams }, (results) => {
            if (active && results && results.length > 0) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    let filter = results.map((obj) => {
                        return { name: obj[keyname], ...obj };
                    });
                    newOptions = [...newOptions, ...filter];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    React.useEffect(() => {
        // if (value)
        onChange(value);
    }, [value]);

    return (
        <Autocomplete
            id={id}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
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
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                if (newInputValue !== undefined && newInputValue !== "undefined") {
                    setInputValue(newInputValue);
                }
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} fullWidth error={error} helperText={helperText} />
            )}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderOption={(props, option) => {
                const matches = match(option.name, inputValue, { insideWords: true });

                const parts = parse(option.name, matches);

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                                {parts.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
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
