import React from "react";
import { Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useGetContactLeadsListQuery } from "../../../store/common/commonApis";
import ContactLeadsTable from "../../../components/admin/leads/ContactLeadsTable";
import { debounce } from "../../../helpers/utils";

const LeadsContainer = (props) => {
    const { pagination } = props;

    const { isLoading, data: leads, isFetching } = useGetContactLeadsListQuery({ ...pagination, sortBy: -1, sortField: "createdAt" });

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    }

    const handleSearch = (val) => {
        let keywords = val.toLowerCase();
        handlePagination({
            ...pagination,
            keywords: keywords
        })
    }

    const processChange = debounce((e) => handleSearch(e));

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Contact Leads</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12} textAlign={"right"} pb={2} pt={1} display={"flex"} justifyContent={"space-between"}>
                    <TextField
                        size="small"
                        id="outlined-search"
                        label="Search here..."
                        type="search"
                        sx={{ width: "25%" }}
                        onChange={(e) => processChange(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: "#071B2A", fontWeight: "400" }}
                        elevation={0}
                    >
                        <ContactLeadsTable fetching={isFetching} loading={isLoading} count={leads?.count || 0} data={leads?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
        </Stack >
    );
}

export default LeadsContainer;