import { Grid, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { debounce } from "../../helpers/utils";
import { Fragment, useState } from "react";

export const SearchRecords = ({
    handlePagination,
    pagination,
    type = "default",
    filterOptions = [{ label: "Any Word", value: "any_word" }],
    filterLabel = "Filter By",
    onFilterChange = () => {}, // Callback if needed separately
}) => {
    const [filterValue, setFilterValue] = useState("any_word");

    const handleSearch = (val) => {
        const keywords = val.toLowerCase();
        handlePagination({
            ...pagination,
            pageNo: 0,
            limit: 10,
            keywords: keywords,
            filter_by: type === "filter_by_with" ? filterValue : undefined,
        });
    };

    const handleDropdownChange = (e) => {
        const selectedValue = e.target.value;
        setFilterValue(selectedValue);
        onFilterChange(selectedValue);
        handlePagination({
            ...pagination,
            pageNo: 0,
            limit: 10,
            keywords: pagination?.keywords || "",
            filter_by: selectedValue,
        });
    };

    const processChange = debounce((e) => handleSearch(e));

    return (
        <Fragment>
            {type === "filter_by_with" ? (
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <FormControl size="small" style={{ minWidth: 150 }}>
                            <InputLabel>{filterLabel}</InputLabel>
                            <Select value={filterValue} onChange={handleDropdownChange} label={filterLabel}>
                                {filterOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item textAlign={"right"}>
                        <TextField
                            size="small"
                            id="outlined-search"
                            label="Search here..."
                            type="search"
                            style={{ minWidth: 300 }}
                            onChange={(e) => processChange(e.target.value)}
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid item textAlign={"right"}>
                    <TextField
                        size="small"
                        id="outlined-search"
                        label="Search here..."
                        type="search"
                        style={{ minWidth: 300 }}
                        onChange={(e) => processChange(e.target.value)}
                    />
                </Grid>
            )}
        </Fragment>
    );
};
